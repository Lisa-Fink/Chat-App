package com.example.chatappserver.websocket.controller;

import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

@Controller
public class UserWebSocketController {
    @SubscribeMapping("/users/{userID}")
    public void subscribeUser() {
        System.out.println("user sub");
    }
}
