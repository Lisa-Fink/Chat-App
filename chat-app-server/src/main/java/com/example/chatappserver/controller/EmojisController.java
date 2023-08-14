package com.example.chatappserver.controller;

import com.example.chatappserver.model.Emoji;
import com.example.chatappserver.repository.EmojisDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/emojis")
public class EmojisController {
    private final EmojisDao emojisDao;

    @Autowired
    public EmojisController(EmojisDao emojisDao) {
        this.emojisDao = emojisDao;
    }

    // Get all emojis
    @GetMapping
    public ResponseEntity<List<Emoji>> getEmojis() {
        List<Emoji> emojis = emojisDao.getEmojis();
        return ResponseEntity.ok(emojis);
    }
}
