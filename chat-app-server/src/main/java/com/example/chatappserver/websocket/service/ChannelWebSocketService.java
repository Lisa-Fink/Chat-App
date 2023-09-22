package com.example.chatappserver.websocket.service;

import com.example.chatappserver.model.Message;
import com.example.chatappserver.websocket.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class ChannelWebSocketService {

    private final SimpMessagingTemplate messaging;

    @Autowired
    public ChannelWebSocketService(SimpMessagingTemplate messaging) {
        this.messaging = messaging;
    }

    public void sendMessageToSubscribers(Message message) {
        int channelID = message.getChannelID();
        String destination = "/topic/channels/" + channelID;
        System.out.println("sent");
        MessageBroadcast messageBroadcast = new MessageBroadcast(MessageType.MESSAGE_NEW, message);
        messaging.convertAndSend(destination, messageBroadcast);
    }

    public void sendMessageEditToSubscribers(int channelID, int messageID, String text, int userID) {
        String destination = "/topic/channels/" + channelID;
        System.out.println("sent");
        MessageBroadcast messageBroadcast = new MessageBroadcast(MessageType.MESSAGE_EDIT,
                new MessageEditData(channelID, messageID, text, userID));
        messaging.convertAndSend(destination, messageBroadcast);
    }

    public void sendMessageDeleteToSubscribers(int messageID, int channelID, int userID) {
        String destination = "/topic/channels/" + channelID;
        System.out.println("sent");
        MessageBroadcast messageBroadcast = new MessageBroadcast(MessageType.MESSAGE_DELETE,
                new MessageDeleteData(messageID, channelID, userID));
        messaging.convertAndSend(destination, messageBroadcast);
    }

    public void sendTypingToSubscribers(int channelID, TypingData typingData) {
        String destination = "/topic/channels/" + channelID;
        MessageBroadcast messageBroadcast = new MessageBroadcast(MessageType.TYPING, typingData);
        messaging.convertAndSend(destination, messageBroadcast);
    }
}
