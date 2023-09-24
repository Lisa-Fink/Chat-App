package com.example.chatappserver.controller;

import com.example.chatappserver.model.Channel;
import com.example.chatappserver.model.CustomUserDetails;
import com.example.chatappserver.model.RoleUpdateRequest;
import com.example.chatappserver.model.User;
import com.example.chatappserver.repository.ChannelsDao;
import com.example.chatappserver.repository.UsersDao;
import com.example.chatappserver.service.AuthService;
import com.example.chatappserver.websocket.service.ChannelWebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/servers/{serverID}/channels")
public class ChannelsController {
    private final ChannelsDao channelsDao;
    private final UsersDao usersDao;
    private final AuthService authService;
    private final ChannelWebSocketService channelWebSocketService;

    @Autowired
    public ChannelsController(
            ChannelsDao channelsDao,
            AuthService authService,
            UsersDao usersDao,
            ChannelWebSocketService channelWebSocketService
    ) {

        this.channelsDao = channelsDao;
        this.authService = authService;
        this.usersDao = usersDao;
        this.channelWebSocketService = channelWebSocketService;
    }

    // Create a new channel
    @PostMapping
    public ResponseEntity<Object> createChannel(
            @RequestBody Channel channel,
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable int serverID) {
        if (!authService.userIsAdmin(user.getUserId(), serverID)) {
            System.out.println("not admin");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        // RoleID must be >= 2
        if (channel.getRoleID() == 1) {
            return ResponseEntity.badRequest().body("RoleID must be greater than or equal to 2.");
        } if (channel.getServerID() != serverID) {
            return ResponseEntity.badRequest().body("ServerID must match.");
        } if (channelsDao.isChannelExists(serverID, channel.getChannelName())) {
            return ResponseEntity.badRequest().body("Channel with the same name already exists.");
        }
        channelsDao.create(channel);
        // get the users
        List<Integer> users = usersDao.getUsersInChannel(
                channel.getChannelID(), serverID);
        channelWebSocketService.sendRolesNewChannel(
                user.getUserId(), channel, 0, users);
        return ResponseEntity.status(HttpStatus.CREATED).body(channel.getChannelID());
    }

//    // Add multiple users to a channel (Create UserChannels)
//    @PostMapping("/{channelID}/users")
//    public ResponseEntity<Void> addUsersToChannel(
//            @PathVariable int channelID, @RequestBody List<Integer> userIDs,
//            @AuthenticationPrincipal CustomUserDetails user,
//            @PathVariable int serverID) {
//        if (!authService.userIsAdmin(user.getUserId(), serverID)) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//        }
//        channelsDao.addUsersToChannel(userIDs, channelID);
//        return ResponseEntity.ok().build();
//    }

    // Add a user to a channel (Create UserChannel)
    @PostMapping("/{channelID}/users/{userID}")
    public ResponseEntity<Void> addUserToChannel(
            @PathVariable int channelID, @PathVariable int userID,
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable int serverID) {
        if (!authService.userIsAdmin(user.getUserId(), serverID)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        channelsDao.addUserToChannel(userID, channelID);
        // broadcast user add to all subs
        channelWebSocketService.sendUserEditToSubscribers(
                channelID, userID, serverID, user.getUserId(), true);
        // broadcast user add to new user
        channelWebSocketService.sendUserNewChannel(userID, channelID, serverID);
        return ResponseEntity.ok().build();
    }

    // Get all Channels in a Server, that the user has access to
    @GetMapping
    public ResponseEntity<List<Channel>> getChannelsInServer(
            @PathVariable int serverID,
            @AuthenticationPrincipal CustomUserDetails user) {
        List<Channel> channels = channelsDao.getChannelsInServer(
                serverID, user.getUserId());
        return ResponseEntity.ok(channels);
    }

    // Update the channel role
    @PutMapping("/{channelID}/role")
    public ResponseEntity<Object> updateRoleID(
            @PathVariable int channelID,
            @RequestBody RoleUpdateRequest roleUpdateRequest,
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable int serverID) {
        if (!authService.userIsAdmin(user.getUserId(), serverID)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        int roleID = roleUpdateRequest.getRoleID();
        int oldRoleID = roleUpdateRequest.getOldRoleID();
        // RoleID must be >= 2
        if (roleID == 1) {
            return ResponseEntity.badRequest().body("RoleID must be greater than or equal to 2.");
        }
        channelsDao.updateRole(roleID, channelID);
        // get the new users in the channel now that the role changed
        List<Integer> userIDs = usersDao.getUsersInChannel(channelID, serverID);
        // broadcast the new user list and roleID for the channel
        channelWebSocketService.sendRoleEditToSubscribers(channelID, roleID, serverID,
                user.getUserId(), userIDs);
        if (oldRoleID < roleID) {
            // get the channel
            Channel channel = channelsDao.getChannelByID(serverID, user.getUserId(), channelID);
            // broadcast the new channel to the new users
            channelWebSocketService.sendRolesNewChannel(user.getUserId(),
                    channel, oldRoleID, userIDs);
        }
        return ResponseEntity.ok(userIDs);
    }

    // Update the channel name
    @PutMapping("/{channelID}/name")
    public ResponseEntity<Void> updateChannelName(
            @PathVariable int channelID, @RequestBody String channelName,
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable int serverID) {
        if (!authService.userIsAdmin(user.getUserId(), serverID)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        channelsDao.updateChannelName(channelName, channelID);
        channelWebSocketService.sendNameEditToSubscribers(channelID, serverID, user.getUserId(), channelName);
        return ResponseEntity.ok().build();
    }

//    // Update the channel role and channel name
//        public record ChannelUpdateReq(int roleID, String channelName) {
//    }
//    @PutMapping("/{channelID}")
//    public ResponseEntity<Object> updateNameAndRoleID(
//            @PathVariable int channelID,
//            @RequestBody ChannelUpdateReq channelUpdateReq,
//            @AuthenticationPrincipal CustomUserDetails user,
//            @PathVariable int serverID) {
//        if (!authService.userIsAdmin(user.getUserId(), serverID)) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//        }
//        // RoleID must be >= 2
//        if (channelUpdateReq.roleID() == 1) {
//            return ResponseEntity.badRequest().body(
//                    "RoleID must be greater than or equal to 2.");
//        }
//        channelsDao.updateRoleAndChannelName(
//                channelUpdateReq.roleID(), channelUpdateReq.channelName(), channelID);
//        return ResponseEntity.ok().build();
//    }

    // Delete a Channel
    @DeleteMapping("/{channelID}")
    public ResponseEntity<Void> deleteChannel(
            @PathVariable int channelID,
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable int serverID) {
        if (!authService.userIsAdmin(user.getUserId(), serverID)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        channelsDao.deleteChannel(channelID);
        channelWebSocketService.sendChannelDeleteToSubscribers(channelID, serverID, user.getUserId());
        return ResponseEntity.ok().build();
    }

//    // Remove multiple users from a channel (Delete UserChannel)
//    @DeleteMapping("/{channelID}/users")
//    public ResponseEntity<Void> deleteUserChannels(
//            @PathVariable int channelID, @RequestBody List<Integer> userIDs,
//            @AuthenticationPrincipal CustomUserDetails user,
//            @PathVariable int serverID) {
//        if (!authService.userIsAdmin(user.getUserId(), serverID)) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//        }
//        channelsDao.removeUsersFromChannel(userIDs, channelID);
//        return ResponseEntity.ok().build();
//    }

    // Remove a user from a channel (Delete UserChannel)
    @DeleteMapping("/{channelID}/users/{userID}")
    public ResponseEntity<Void> deleteUserChannel(
            @PathVariable int channelID, @PathVariable int userID,
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable int serverID) {
        if (!authService.userIsAdmin(user.getUserId(), serverID)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        channelsDao.removeUserFromChannel(userID, channelID);
        // broadcast the removal
        channelWebSocketService.sendUserEditToSubscribers(
                channelID, userID, serverID, user.getUserId(), false);
        return ResponseEntity.ok().build();
    }
}
