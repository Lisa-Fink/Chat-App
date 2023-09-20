package com.example.chatappserver.controller;

import com.example.chatappserver.model.Channel;
import com.example.chatappserver.model.CustomUserDetails;
import com.example.chatappserver.model.User;
import com.example.chatappserver.repository.ChannelsDao;
import com.example.chatappserver.service.AuthService;
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
    private final AuthService authService;

    @Autowired
    public ChannelsController(ChannelsDao channelsDao, AuthService authService) {

        this.channelsDao = channelsDao;
        this.authService = authService;

    }

    // Create a new channel
    @PostMapping
    public ResponseEntity<Object> createChannel(
            @RequestBody Channel channel,
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable int serverID) {
        if (!authService.userIsAdmin(user.getUserId(), serverID)) {
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
        return ResponseEntity.status(HttpStatus.CREATED).body(channel.getChannelID());
    }

    // Add multiple users to a channel (Create UserChannels)
    @PostMapping("/{channelID}/users")
    public ResponseEntity<Void> addUsersToChannel(
            @PathVariable int channelID, @RequestBody List<Integer> userIDs,
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable int serverID) {
        if (!authService.userIsAdmin(user.getUserId(), serverID)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        channelsDao.addUsersToChannel(userIDs, channelID);
        return ResponseEntity.ok().build();
    }

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
            @PathVariable int channelID, @RequestBody String strRoleID,
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable int serverID) {
        if (!authService.userIsAdmin(user.getUserId(), serverID)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        int roleID = Integer.parseInt(strRoleID);
        // RoleID must be >= 2
        if (roleID == 1) {
            return ResponseEntity.badRequest().body("RoleID must be greater than or equal to 2.");
        }
        channelsDao.updateRole(roleID, channelID);
        return ResponseEntity.ok().build();
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
        return ResponseEntity.ok().build();
    }

    // Update the channel role and channel name
        public record ChannelUpdateReq(int roleID, String channelName) {
    }
    @PutMapping("/{channelID}")
    public ResponseEntity<Object> updateNameAndRoleID(
            @PathVariable int channelID,
            @RequestBody ChannelUpdateReq channelUpdateReq,
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable int serverID) {
        if (!authService.userIsAdmin(user.getUserId(), serverID)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        // RoleID must be >= 2
        if (channelUpdateReq.roleID() == 1) {
            return ResponseEntity.badRequest().body(
                    "RoleID must be greater than or equal to 2.");
        }
        channelsDao.updateRoleAndChannelName(
                channelUpdateReq.roleID(), channelUpdateReq.channelName(), channelID);
        return ResponseEntity.ok().build();
    }

    // Delete a Channel
    @DeleteMapping("/{channelID}")
    public ResponseEntity<Void> deleteChannel(
            @PathVariable int channelID,
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable int serverID) {
        if (!authService.userIsCreator(user.getUserId(), serverID)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        channelsDao.deleteChannel(channelID);
        return ResponseEntity.ok().build();
    }

    // Remove multiple users from a channel (Delete UserChannel)
    @DeleteMapping("/{channelID}/users")
    public ResponseEntity<Void> deleteUserChannels(
            @PathVariable int channelID, @RequestBody List<Integer> userIDs,
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable int serverID) {
        if (!authService.userIsAdmin(user.getUserId(), serverID)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        channelsDao.removeUsersFromChannel(userIDs, channelID);
        return ResponseEntity.ok().build();
    }

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
        return ResponseEntity.ok().build();
    }
}
