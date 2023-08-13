package com.example.chatappserver.controller;

import com.example.chatappserver.model.Invite;
import com.example.chatappserver.repository.InvitesDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Random;


@RestController
@RequestMapping("/invites")
public class InvitesController {
    private final InvitesDao invitesDao;

    @Autowired
    public InvitesController(InvitesDao invitesDao) { this.invitesDao = invitesDao ; }

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
    public ResponseEntity<Void>  createInvite(@RequestBody Invite invite) {
        // TODO: user sending request needs to be in the server
        boolean success = false;
        invite.setInviteCode(createUniqueCode());
        // If the generated code isn't unique, will create a new one until it is
        while (!success) {
            try {
                invitesDao.createInvite(invite);
                success = true;
            } catch (DataIntegrityViolationException e) {
                invite.setInviteCode(createUniqueCode());
            }

        }
        return ResponseEntity.ok().build();
    }

    // Get Invite using code (will be used for validation when using the invite)
    @GetMapping("/{inviteCode}")
    public ResponseEntity<Invite> getInviteByCode(@PathVariable String inviteCode) {
        Invite invite = invitesDao.getInviteByCode(inviteCode);
        return ResponseEntity.ok(invite);
    }

}
