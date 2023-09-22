//package com.example.chatappserver.websocket.controller;
//
//import com.example.chatappserver.model.Message;
//import com.example.chatappserver.websocket.model.MessageBroadcast;
//import com.example.chatappserver.websocket.model.MessageType;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Controller;
//
//@Controller
//public class MessageWebSocketController {
//    private final SimpMessagingTemplate messagingTemplate;
//
//    public MessageWebSocketController(SimpMessagingTemplate messagingTemplate) {
//        this.messagingTemplate = messagingTemplate;
//    }
//
//    public void sendMessageToSubscribers(Message message) {
//        // Broadcast the message to subscribers of the channel
//        String broadcastDestination = "/topic/" + message.getChannelID() + "/messages/";
//        MessageBroadcast messageBroadcast = new MessageBroadcast(MessageType.MESSAGE, message);
//        messagingTemplate.convertAndSend(broadcastDestination, messageBroadcast);
//    }
//
//}
