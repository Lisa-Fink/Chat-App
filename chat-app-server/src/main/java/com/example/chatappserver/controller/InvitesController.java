package com.example.chatappserver.controller;

import com.example.chatappserver.model.*;
import com.example.chatappserver.repository.InvitesDao;
import com.example.chatappserver.repository.ServersDao;
import com.example.chatappserver.service.AuthService;
import com.example.chatappserver.service.ServerService;
import com.example.chatappserver.websocket.service.ServerWebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/invites")
public class InvitesController {
    private final InvitesDao invitesDao;
    private final AuthService authService;
    private final ServersDao serversDao;
    private final ServerService serverService;
    private final ServerWebSocketService serverWebSocketService;

    @Autowired
    public InvitesController(InvitesDao invitesDao, AuthService authService,
                             ServersDao serversDao, ServerService serverService,
                             ServerWebSocketService serverWebSocketService) {
        this.invitesDao = invitesDao ;
        this.authService = authService;
        this.serversDao = serversDao;
        this.serverService = serverService;
        this.serverWebSocketService = serverWebSocketService;
    }

    // Create Invite
    private String createUniqueCode() {
        int codeLen = 6;
        StringBuilder code = new StringBuilder();
        Random random = new Random();

        // Create alphanumeric code
        for (int i = 0; i < codeLen; i++) {
            int randomNumber = random.nextInt(62);
            if (randomNumber < 26) {
                code.append(('A' + randomNumber)); // 'A' to 'Z'
            } else if (randomNumber < 52) {
                code.append(('a' + randomNumber - 26)); // 'a' to 'z'
            } else {
                code.append(('0' + randomNumber - 52)); // '0' to '9'
            }
        }

        // Use timestamp
        long timestamp = System.currentTimeMillis();
        code.append(timestamp);
        return code.toString();
    }

    @PostMapping
    public ResponseEntity<String>  createInvite(
            @RequestBody Invite invite, @AuthenticationPrincipal CustomUserDetails user) {
        if (!authService.userInServer(user.getUserId(), invite.getServerID())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        // If the user already created an invite today, return it
        String inviteCode = invitesDao.getInviteForUserServerToday(user.getUserId(), invite.getServerID());
        if (inviteCode != null) {
            return ResponseEntity.ok(inviteCode);
        }
        invite.setCreatedDate(new Date(System.currentTimeMillis()));
        boolean success = false;
        invite.setInviteCode(createUniqueCode());
        // If the generated code isn't unique, will create a new one until it is
        while (!success) {
            try {
                invitesDao.createInvite(invite, user.getUserId());
                success = true;
            } catch (DataIntegrityViolationException e) {
                invite.setInviteCode(createUniqueCode());
            }
        }
        return ResponseEntity.ok(invite.getInviteCode());
    }

    // Get Invite using code (will be used for validation when using the invite)
    @GetMapping("/{inviteCode}")
    public ResponseEntity<Invite> getInviteByCode(@PathVariable String inviteCode) {
        Invite invite = invitesDao.getInviteByCode(inviteCode);
        return ResponseEntity.ok(invite);
    }

    // Join server using invite
    @PostMapping("/{inviteCode}/join")
    public ResponseEntity<Object> joinByInviteCode(
            @PathVariable String inviteCode,
            @AuthenticationPrincipal CustomUserDetails user) {
        // Get the invite from the inviteCode
        Invite invite = invitesDao.getInviteByCode(inviteCode);
        if (invite == null) {
            return ResponseEntity.notFound().build();
        }
        // join the server
        int basicUserRole = 4;
        try {
            // Add user to server
            serversDao.addUser(user.getUserId(), invite.getServerID(),
                    basicUserRole);
        } catch (DataIntegrityViolationException e) {
            // Handle user is already in Server
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("User is already a member of this server.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while adding the user to the server.");
        }
        // Retrieve the server data
        AddServerResponse addServerResponse = serverService.getServerData(
                invite.getServerID(), user.getUserId()
        );
        // Broadcast new server user
        serverWebSocketService.sendServerNewUserToSubscribers(invite.getServerID(),
                user.getUserId(), user.getDbUsername(), user.getUserImageUrl());

        return ResponseEntity.ok(addServerResponse);
    }

}
