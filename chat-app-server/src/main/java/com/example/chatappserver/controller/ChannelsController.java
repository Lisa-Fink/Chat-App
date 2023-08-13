package com.example.chatappserver.controller;

import com.example.chatappserver.model.Channel;
import com.example.chatappserver.repository.ChannelsDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/channels")
public class ChannelsController {
    private final ChannelsDao channelsDao;

    @Autowired
    public ChannelsController(ChannelsDao channelsDao) {
        this.channelsDao = channelsDao;
    }

    // Create a new channel
    @PostMapping
    public ResponseEntity<Integer> createChannel(@RequestBody Channel channel) {
        // TODO: user sending request needs admin+ status
        channelsDao.create(channel);
        return ResponseEntity.status(HttpStatus.CREATED).body(channel.getChannelID());
    }

    // Add a user to a channel (Create UserChannel)
    @PostMapping("/{channelID}/{userID}")
    public ResponseEntity<Void> addUserToChannel(
            @PathVariable int channelID, @PathVariable int userID) {
        // TODO: user sending request needs admin+ status
        channelsDao.addUserToChannel(userID, channelID);
        return ResponseEntity.ok().build();
    }

    // Get all Channels in a Server
    @GetMapping("/{serverID}")
    public ResponseEntity<List<Channel>> getChannelsInServer(@PathVariable int serverID) {
        // TODO: user sending request needs to be in the server (UserServer)
        List<Channel> channels = channelsDao.getChannelsInServer(serverID);
        return ResponseEntity.ok(channels);
    }

    // Update the channel role
    @PutMapping("/{channelID}/role")
    public ResponseEntity<Void> updateRoleID(@PathVariable int channelID,
                                             @RequestBody int roleID) {
        // TODO: user sending request needs admin+ status
        channelsDao.updateRole(roleID, channelID);
        return ResponseEntity.ok().build();
    }

    // Update the channel name
    @PutMapping("/{channelID}/name")
    public ResponseEntity<Void> updateRoleID(@PathVariable int channelID,
                                             @RequestBody String channelName) {
        // TODO: user sending request needs admin+ status
        channelsDao.updateChannelName(channelName, channelID);
        return ResponseEntity.ok().build();
    }

    // Update the channel role and channel name
    public static class ChannelUpdateReq {
        private int roleID;
        private String channelName;

        public ChannelUpdateReq(int roleID, String channelName) {
            this.roleID = roleID;
            this.channelName = channelName;
        }

        public int getRoleID() {
            return roleID;
        }

        public String getChannelName() {
            return channelName;
        }
    }
    @PutMapping("/{channelID}")
    public ResponseEntity<Void> updateRoleID(
            @PathVariable int channelID, @RequestBody ChannelUpdateReq channelUpdateReq) {
        // TODO: user sending request needs admin+ status
        channelsDao.updateRoleAndChannelName(
                channelUpdateReq.getRoleID(), channelUpdateReq.getChannelName(), channelID);
        return ResponseEntity.ok().build();
    }


    // Delete a Channel
    @DeleteMapping("/{channelID")
    public ResponseEntity<Void> deleteChannel(@PathVariable int channelID) {
        // TODO: user sending request needs creator status
        channelsDao.deleteChannel(channelID);
        return ResponseEntity.ok().build();
    }

    // Remove multiple users from a channel (Delete UserChannel)
    @DeleteMapping("/{channelID}/users")
    public ResponseEntity<Void> deleteUserChannels(@PathVariable int channelID,
                                                  @RequestBody List<Integer> userIDs) {
        // TODO: user sending request needs admin+ status
        channelsDao.removeUsersFromChannel(userIDs, channelID);
        return ResponseEntity.ok().build();
    }

    // Remove a user from a channel (Delete UserChannel)
    @DeleteMapping("/{channelID}/{userID}")
    public ResponseEntity<Void> deleteUserChannel(@PathVariable int channelID,
                                                  @PathVariable int userID) {
        // TODO: user sending request needs admin+ status
        channelsDao.removeUserFromChannel(userID, channelID);
        return ResponseEntity.ok().build();
    }
}
