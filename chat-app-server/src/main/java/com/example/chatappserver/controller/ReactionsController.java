package com.example.chatappserver.controller;

import com.example.chatappserver.model.CustomUserDetails;
import com.example.chatappserver.model.Reaction;
import com.example.chatappserver.model.ReactionRequest;
import com.example.chatappserver.repository.ReactionsDao;
import com.example.chatappserver.service.AuthService;
import com.example.chatappserver.websocket.service.ChannelWebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/reactions")
public class ReactionsController {

    private final ReactionsDao reactionsDao;
    private final ChannelWebSocketService channelWebSocketService;
    private final AuthService authService;

    @Autowired
    public ReactionsController(ReactionsDao reactionsDao,
                               ChannelWebSocketService channelWebSocketService,
                               AuthService authService) {
        this.reactionsDao = reactionsDao;
        this.channelWebSocketService = channelWebSocketService;
        this.authService = authService;
    }

    // Create a reaction (adds a reaction to a message
    @PostMapping
    public ResponseEntity<Integer> createReaction(@RequestBody ReactionRequest reaction) {
        reactionsDao.create(reaction);
        // broadcast new reaction to channel
        channelWebSocketService.sendNewReactionToSubscribers(reaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(reaction.getReactionID());
    }

    @DeleteMapping("/{reactionID}")
    public ResponseEntity<Void> deleteReaction(
            @PathVariable int reactionID,
            @AuthenticationPrincipal CustomUserDetails user) {
        // check that the user sending the request is either an admin, or has the reaction.userID
        if (reactionsDao.isUser(reactionID, user.getUserId()) ||
                reactionsDao.senderIsAdminInReactionServer(reactionID, user.getUserId())) {
            // get the data before deleting
            ReactionRequest reaction = reactionsDao.getReactionChannel(reactionID);
            reactionsDao.deleteReaction(reactionID);
            // broadcast to the channel
            channelWebSocketService.sendDeleteReactionToSubscribers(reaction);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
}


