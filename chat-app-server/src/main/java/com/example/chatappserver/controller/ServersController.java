package com.example.chatappserver.controller;

import com.example.chatappserver.model.CustomUserDetails;
import com.example.chatappserver.model.Server;
import com.example.chatappserver.model.User;
import com.example.chatappserver.repository.ChannelsDao;
import com.example.chatappserver.repository.ServersDao;
import com.example.chatappserver.service.AuthService;
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

    @Autowired
    public ServersController(ServersDao serversDao, AuthService authService,
                             ChannelsDao channelsDao) {
        this.serversDao = serversDao;
        this.authService = authService;
        this.channelsDao = channelsDao;
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
    public ResponseEntity<List<Server>> getUserServers(
            @AuthenticationPrincipal CustomUserDetails user) {
        List<Server> userServers = serversDao.getAllUserServers(user.getUserId());
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
        return ResponseEntity.ok().build();
    }

    // Updates the Role of a User in the Server
    @PutMapping("/{serverID}/users/role")
    public ResponseEntity<Void> updateServerDescription(
            @PathVariable int serverID, @PathVariable int userID,
            @RequestBody int roleID, @AuthenticationPrincipal CustomUserDetails user) {
        if (!authService.userIsAdmin(user.getUserId(), serverID)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        serversDao.updateUserRole(user.getUserId(), roleID, serverID);
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
        return ResponseEntity.ok().build();
    }

    // Remove a user from a server, Deletes UserServers
    @DeleteMapping("/{serverID}/users/{userID}")
    public ResponseEntity<Void> deleteUserFromServer(
            @PathVariable int serverID, @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable int userID) {
        // TODO: cannot remove creator of server, add to README
        if (user.getUserId() != userID && !authService.userIsAdmin(user.getUserId(), serverID)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        serversDao.deleteUserServer(serverID, userID);
        return ResponseEntity.ok().build();
    }
}
