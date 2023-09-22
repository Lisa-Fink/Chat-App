package com.example.chatappserver.controller;

import com.example.chatappserver.model.*;
import com.example.chatappserver.repository.MessagesDao;
import com.example.chatappserver.service.AuthService;
import com.example.chatappserver.websocket.controller.ChannelWebSocketController;
import com.example.chatappserver.websocket.service.ChannelWebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/servers/{serverID}/channels/{channelID}/messages")
public class MessagesController {
    private final MessagesDao messagesDao;
    private final AuthService authService;
    private final ChannelWebSocketService webSocketService;

    @Autowired
    public MessagesController(MessagesDao messagesDao, AuthService authService, ChannelWebSocketService webSocketService) {
        this.messagesDao = messagesDao;
        this.authService = authService;
        this.webSocketService = webSocketService;
    }

    // Create a message with no attachment
    @PostMapping
    public ResponseEntity<Integer> createMessage(
            @RequestBody Message message, @PathVariable int serverID, @PathVariable int channelID,
            @AuthenticationPrincipal CustomUserDetails user) {
        if (!authService.userInChannel(user.getUserId(), channelID)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        messagesDao.create(message);

        webSocketService.sendMessageToSubscribers(message);
        return ResponseEntity.status(HttpStatus.CREATED).body(message.getMessageID());
    }

//    // Create a message with 1-3 attachments
//    @PostMapping("/attachments")
//    public ResponseEntity<MessageAttachmentResponse> createMessageWithAttachments(
//            @RequestBody Message message, @PathVariable int channelID,
//            @AuthenticationPrincipal CustomUserDetails user) {
//        if (!authService.userInChannel(user.getUserId(), channelID)) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//        }
//        messagesDao.createWithAttachments(message);
//        List<Integer> attachmentIds = message.getAttachments().stream()
//                .map(Attachment::getAttachmentID).toList();
//
//        MessageAttachmentResponse res = new MessageAttachmentResponse(
//                message.getMessageID(), attachmentIds);
//
//        return ResponseEntity.status(HttpStatus.CREATED).body(res);
//    }

    // Get all messages in a Channel
    @GetMapping
    public ResponseEntity<List<Message>> getMessagesInChannel(
            @PathVariable int serverID, @PathVariable int channelID,
            @AuthenticationPrincipal CustomUserDetails user) {
        if (!authService.userInChannel(user.getUserId(), channelID)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<Message> res = messagesDao.getMessagesInChannel(channelID);
        return ResponseEntity.ok(res);
    }
    private static class MessageEditRequest {
        private String text;

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }
    // Edit a message text, no change to attachments
    @PutMapping("/{messageID}")
    public ResponseEntity<Void> editMessage(
            @RequestBody MessageEditRequest editMessage,
            @PathVariable int channelID, @PathVariable int messageID,
            @AuthenticationPrincipal CustomUserDetails user) {
        // Checks for the message, ensuring the message exists with the messageID and userID
        if (!messagesDao.doesMessageExist(messageID, user.getUserId())) {
            return ResponseEntity.notFound().build();
        }
        messagesDao.editMessageText(messageID, editMessage.getText());
        webSocketService.sendMessageEditToSubscribers(channelID, messageID, editMessage.getText(), user.getUserId());
        return ResponseEntity.ok().build();
    }

    // Edit a message by removing attachment(s)
//    @PutMapping("/attachments/{messageID}")
//    public ResponseEntity<Void> removeAttachment(
//            @PathVariable int messageID, @RequestBody List<Integer> attachmentIDs,
//            @AuthenticationPrincipal CustomUserDetails user) {
//        // Checks for the message, ensuring the message exists with the messageID and userID
//        if (!messagesDao.doesMessageExist(messageID, user.getUserId())) {
//            return ResponseEntity.notFound().build();
//        }
//        messagesDao.editRemoveAttachments(messageID, attachmentIDs);
//        return ResponseEntity.ok().build();
//    }

    // Delete a message (attachments and reactions will get deleted with CASCADE)
    @DeleteMapping("/{messageID}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable int channelID, @PathVariable int messageID, @PathVariable int serverID,
            @AuthenticationPrincipal CustomUserDetails user) {
        // Checks for the message, ensuring the message exists with the messageID and userID
        // or that the user sending the request is a mod or above
        if (!messagesDao.doesMessageExist(messageID, user.getUserId()) &&
                !authService.userIsModerator(user.getUserId(), serverID)) {
            return ResponseEntity.notFound().build();
        }
        messagesDao.deleteMessage(messageID);
        webSocketService.sendMessageDeleteToSubscribers(messageID, channelID, user.getUserId());
        return ResponseEntity.ok().build();
    }
}
