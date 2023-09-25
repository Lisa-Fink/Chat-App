package com.example.chatappserver.websocket.service;

import com.example.chatappserver.websocket.model.MessageType;
import com.example.chatappserver.websocket.model.channel.MessageBroadcast;
import com.example.chatappserver.websocket.model.user.UserUpdateData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class UserWebSocketService {
    private final SimpMessagingTemplate messaging;

    @Autowired
    public UserWebSocketService(
            SimpMessagingTemplate messaging) {

        this.messaging = messaging;
    }

    public void sendUserImageUpdateToSubscribers(int userID, String userImageUrl) {
        String destination = "/topic/users/" + userID;
        UserUpdateData data = new UserUpdateData(userID, userImageUrl);
        MessageBroadcast messageBroadcast = new MessageBroadcast(
                MessageType.IMAGE_EDIT, data);
        messaging.convertAndSend(destination, messageBroadcast);
    }
}
