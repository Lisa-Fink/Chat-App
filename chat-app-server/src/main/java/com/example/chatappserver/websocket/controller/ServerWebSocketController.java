package com.example.chatappserver.websocket.controller;

import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

@Controller
public class ServerWebSocketController {
    @SubscribeMapping("servers/{serverID}")
    public void subscribeServer() {};

    @SubscribeMapping("servers/{serverID}/role/{roleID}")
    public void subscribeServerRole() {};
}
