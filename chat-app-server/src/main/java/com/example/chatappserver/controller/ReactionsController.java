package com.example.chatappserver.controller;

import com.example.chatappserver.model.Reaction;
import com.example.chatappserver.model.ReactionRequest;
import com.example.chatappserver.repository.ReactionsDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/reactions")
public class ReactionsController {

    private final ReactionsDao reactionsDao;

    @Autowired
    public ReactionsController(ReactionsDao reactionsDao) { this.reactionsDao = reactionsDao; }

    // Create a reaction (adds a reaction to a message
    @PostMapping
    public ResponseEntity<Integer> createReaction(@RequestBody ReactionRequest reaction) {
        reactionsDao.create(reaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(reaction.getReactionID());
    }

    @DeleteMapping("/{reactionID}")
    public ResponseEntity<Void> deleteReaction(@PathVariable int reactionID) {
        reactionsDao.deleteReaction(reactionID);
        return ResponseEntity.ok().build();
    }
}


