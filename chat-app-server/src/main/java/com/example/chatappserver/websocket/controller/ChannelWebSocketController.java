package com.example.chatappserver.websocket.controller;
import com.example.chatappserver.model.CustomUserDetails;
import com.example.chatappserver.websocket.model.TypingData;
import com.example.chatappserver.websocket.service.ChannelWebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;

import java.security.Principal;


@Controller
public class ChannelWebSocketController {
    private final SimpMessagingTemplate messaging;
    private final ChannelWebSocketService service;

    @Autowired
    public ChannelWebSocketController(
            SimpMessagingTemplate messaging,
            ChannelWebSocketService service) {

        this.messaging = messaging;
        this.service = service;
    }

    @SubscribeMapping("/channels/{channelID}")
    public void subscribeToChannel(Principal principal) {
        System.out.println("sub " + principal);
    }

    @MessageMapping("/channels/{channelID}/typing")
    public void channelTyping(@DestinationVariable int channelID,
                              @Payload TypingData typingData) {
        service.sendTypingToSubscribers(channelID, typingData);
    }

}
