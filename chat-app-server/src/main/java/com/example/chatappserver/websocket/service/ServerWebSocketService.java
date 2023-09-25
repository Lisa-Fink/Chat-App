package com.example.chatappserver.websocket.service;

import com.example.chatappserver.websocket.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class ServerWebSocketService {
    private final SimpMessagingTemplate messaging;

    @Autowired
    public ServerWebSocketService(
            SimpMessagingTemplate messaging) {

        this.messaging = messaging;
    }

    public void sendServerDeleteToSubscribers(int serverID, int userID) {
        String destination = "/topic/servers/" + serverID;
        ServerDeleteData data = new ServerDeleteData(serverID, userID);
        MessageBroadcast messageBroadcast = new MessageBroadcast(
                MessageType.SERVER_DELETE, data);
        messaging.convertAndSend(destination, messageBroadcast);
    }

    public void sendServerUserLeaveToSubscribers(int serverID, int delUserID,
                                                    int userID) {
        String destination = "/topic/servers/" + serverID;
        ServerDeleteUserData data = new ServerDeleteUserData(serverID, delUserID, userID);
        MessageBroadcast messageBroadcast = new MessageBroadcast(
                MessageType.SERVER_DELETE_USER, data);
        messaging.convertAndSend(destination, messageBroadcast);
    }

    public void sendServerNewUserToSubscribers(
            int serverID, int userID, String username, String userImageUrl) {
        String destination = "/topic/servers/" + serverID;
        int basicUserRole = 4;
        UserServerData data = new UserServerData(
                serverID, userID, username, userImageUrl, basicUserRole);
        MessageBroadcast messageBroadcast = new MessageBroadcast(
                MessageType.SERVER_NEW_USER, data);
        messaging.convertAndSend(destination, messageBroadcast);
    }
}
