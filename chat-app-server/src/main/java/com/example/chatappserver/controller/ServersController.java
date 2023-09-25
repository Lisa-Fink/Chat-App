package com.example.chatappserver.controller;

import com.example.chatappserver.model.CustomUserDetails;
import com.example.chatappserver.model.Server;
import com.example.chatappserver.model.ServerResponse;
import com.example.chatappserver.repository.ChannelsDao;
import com.example.chatappserver.repository.ServersDao;
import com.example.chatappserver.service.AuthService;
import com.example.chatappserver.websocket.service.ServerWebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/servers")
public class ServersController {
    private final ServersDao serversDao;
    private final AuthService authService;
    private final ChannelsDao channelsDao;
    private final ServerWebSocketService serverWebSocketService;

    @Autowired
    public ServersController(ServersDao serversDao, AuthService authService,
                             ChannelsDao channelsDao,
                             ServerWebSocketService serverWebSocketService) {
        this.serversDao = serversDao;
        this.authService = authService;
        this.channelsDao = channelsDao;
        this.serverWebSocketService = serverWebSocketService;
    }


    // Creates a new server, using the Server object
    @PostMapping
    public ResponseEntity<Object> createServer(@RequestBody Server server,
                                                @AuthenticationPrincipal CustomUserDetails user) {
        // Check if serverName isn't empty/null
        if (server.getServerName() == null || server.getServerName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("ServerName cannot be null or empty.");
        }
        // create the server
        serversDao.create(server);

        // add the user to the server with Creator role
        int creatorRole = 1;
        serversDao.addUser(user.getUserId(), server.getServerID(), creatorRole);

        // create a general channel
        int channelID = channelsDao.createGeneral(server.getServerID());

        class CreateServerResponse {
            public final int serverID;
            public final int channelID;

            CreateServerResponse(int serverID, int channelID) {
                this.serverID = serverID;
                this.channelID = channelID;
            }
        }

        CreateServerResponse res = new CreateServerResponse(server.getServerID(), channelID);

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    // Adds a user to a server, create UserServers
    @PostMapping("/{serverID}/users")
    public ResponseEntity<Object> addUserToServer(@AuthenticationPrincipal CustomUserDetails user,
                                                @PathVariable int serverID) {
        int basicUserRole = 4;
        try {
            serversDao.addUser(user.getUserId(), serverID, basicUserRole);
            return ResponseEntity.ok().build();
        } catch (DataIntegrityViolationException e) {
            // Handle user is already in Server
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("User is already a member of this server.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while adding the user to the server.");
        }

    }

    // Returns a list of the Servers the user belongs to
    @GetMapping
    public ResponseEntity<List<ServerResponse>> getUserServers(
            @AuthenticationPrincipal CustomUserDetails user) {
        List<ServerResponse> userServers = serversDao.getAllUserServers(user.getUserId());
        return ResponseEntity.ok(userServers);
    }

    // Updates the Server's image
    @PutMapping("/{serverID}/image")
    public ResponseEntity<Void> updateServerImageUrl(
            @PathVariable int serverID, @RequestBody String serverImageUrl,
            @AuthenticationPrincipal CustomUserDetails user) {
        if (!authService.userIsAdmin(user.getUserId(), serverID)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        serversDao.updateImage(serverID, serverImageUrl);
        // Broadcast the update
        serverWebSocketService.sendServerImageUpdateToSubscribers(
                serverID, user.getUserId(), serverImageUrl
        );
        return ResponseEntity.ok().build();
    }

    // Updates the Server's description
    @PutMapping("/{serverID}/description")
    public ResponseEntity<Void> updateServerDescription(
            @PathVariable int serverID, @RequestBody String serverDescription,
            @AuthenticationPrincipal CustomUserDetails user) {
        if (!authService.userIsAdmin(user.getUserId(), serverID)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        serversDao.updateDescription(serverID, serverDescription);
        // Broadcast the update
        serverWebSocketService.sendServerDescriptionUpdateToSubscribers(
                serverID, user.getUserId(), serverDescription
        );
        return ResponseEntity.ok().build();
    }

    // Updates the Role of a User in the Server
    @PutMapping("/{serverID}/users/{userID}/role")
    public ResponseEntity<Void> updateServerDescription(
            @PathVariable int serverID, @PathVariable int userID,
            @RequestBody String roleIDStr, @AuthenticationPrincipal CustomUserDetails user) {
        int roleID = Integer.parseInt(roleIDStr);
        // role must be 2,3 or 4 and user sending request must be admin, and user getting updated can't be creator
        if ((roleID != 2 && roleID != 3 && roleID != 4) || !authService.userIsAdmin(user.getUserId(), serverID) || authService.userIsCreator(userID, serverID)) {
            System.out.println("bad");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        serversDao.updateUserRole(userID, roleID, serverID);
        // broadcast the role change
        serverWebSocketService.sendServerRoleUpdateToSubscribers(
                serverID, user.getUserId(), userID, roleID
        );
        return ResponseEntity.ok().build();
    }

    // Deletes a Server
    @DeleteMapping("/{serverID}")
    public ResponseEntity<Void> deleteServer(
            @PathVariable int serverID,
            @AuthenticationPrincipal CustomUserDetails user) {
        if (!authService.userIsCreator(user.getUserId(), serverID)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        serversDao.deleteServer(serverID);
        // broadcast to subs
        serverWebSocketService.sendServerDeleteToSubscribers(serverID, user.getUserId());
        return ResponseEntity.ok().build();
    }

    // Remove a user from a server, Deletes UserServers
    @DeleteMapping("/{serverID}/users/{userID}")
    public ResponseEntity<Void> deleteUserFromServer(
            @PathVariable int serverID, @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable int userID) {
        // the user sending the request has to be the user being removed, or an admin, and the creator cannot be removed
        if ((user.getUserId() != userID && !authService.userIsAdmin(user.getUserId(), serverID))|| authService.userIsCreator(userID, serverID)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        serversDao.deleteUserServer(serverID, userID);
        serverWebSocketService.sendServerUserLeaveToSubscribers(serverID, userID,
                user.getUserId());
        return ResponseEntity.ok().build();
    }
}
