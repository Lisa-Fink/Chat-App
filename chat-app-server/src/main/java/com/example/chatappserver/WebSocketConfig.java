package com.example.chatappserver;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocket
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // handle subscriptions
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app", "/topic");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Define the WebSocket endpoint and enable CORS
        registry.addEndpoint("/ws").setAllowedOrigins("http://localhost:5173");
        registry.addEndpoint("/ws").setAllowedOrigins("http://localhost:5173").withSockJS();
    }
}
