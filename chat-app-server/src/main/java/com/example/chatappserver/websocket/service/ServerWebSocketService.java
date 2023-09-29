package com.example.chatappserver.websocket.service;

import com.example.chatappserver.websocket.model.channel.MessageBroadcast;
import com.example.chatappserver.websocket.model.MessageType;
import com.example.chatappserver.websocket.model.server.*;
import com.example.chatappserver.websocket.model.user.UserUpdateData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public void sendServerDescriptionUpdateToSubscribers(
            int serverID, int userID, String serverDescription
    ) {
        String destination = "/topic/servers/" + serverID;
        ServerEditData data = new ServerEditData(serverDescription,
                serverID, userID);
        MessageBroadcast messageBroadcast = new MessageBroadcast(
                MessageType.DESCRIPTION_EDIT, data);
        messaging.convertAndSend(destination, messageBroadcast);
    }

    public void sendServerImageUpdateToSubscribers(
            int serverID, int userID, String serverImageUrl
    ) {
        String destination = "/topic/servers/" + serverID;
        ServerEditData data = new ServerEditData(serverImageUrl,
                serverID, userID);
        MessageBroadcast messageBroadcast = new MessageBroadcast(
                MessageType.IMAGE_EDIT, data);
        messaging.convertAndSend(destination, messageBroadcast);
    }

    public void sendServerRoleUpdateToSubscribers(
            int serverID, int userID, int updateUserID, int roleID
    ) {
        String destination = "/topic/servers/" + serverID;
        ServerUserRoleEditData data = new ServerUserRoleEditData(
                serverID, userID, updateUserID, roleID
        );
        MessageBroadcast messageBroadcast = new MessageBroadcast(
                MessageType.ROLE_EDIT, data);
        messaging.convertAndSend(destination, messageBroadcast);
    }

    public void sendUserImageUpdateToServers(int userID, String userImageUrl,
                                             List<Integer> serverIDs) {
        UserUpdateData data = new UserUpdateData(userID, userImageUrl);
        MessageBroadcast messageBroadcast = new MessageBroadcast(
                MessageType.USER_IMAGE_EDIT, data);
        for (Integer serverID: serverIDs) {
            String destination = "/topic/servers/" + serverID;
            messaging.convertAndSend(destination, messageBroadcast);
        }
    }
}
