package com.example.chatappserver.websocket.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;


@Controller
public class ChannelWebSocketController {
    private final SimpMessagingTemplate messaging;

    @Autowired
    public ChannelWebSocketController(SimpMessagingTemplate messaging) {
        this.messaging = messaging;
    }

    @SubscribeMapping("/channels/{channelID}")
    public void subscribeToChannel() {
        System.out.println("sub");
    }



}
