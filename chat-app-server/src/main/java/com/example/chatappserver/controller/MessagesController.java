package com.example.chatappserver.controller;

import com.example.chatappserver.model.Message;
import com.example.chatappserver.model.Attachment;
import com.example.chatappserver.model.MessageAttachmentResponse;
import com.example.chatappserver.repository.MessagesDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessagesController {
    private final MessagesDao messagesDao;

    @Autowired
    public MessagesController(MessagesDao messagesDao) { this.messagesDao = messagesDao; }

    // Create a message with no attachment
    @PostMapping
    public ResponseEntity<Integer> createMessage(@RequestBody Message message) {
        messagesDao.create(message);
        return ResponseEntity.status(HttpStatus.CREATED).body(message.getMessageID());
    }

    // Create a message with 1-3 attachments
    @PostMapping("/attachments")
    public ResponseEntity<MessageAttachmentResponse> createMessageWithAttachments(
            @RequestBody Message message) {
        messagesDao.createWithAttachments(message);
        List<Integer> attachmentIds = message.getAttachments().stream()
                .map(Attachment::getAttachmentID).toList();

        MessageAttachmentResponse res = new MessageAttachmentResponse(
                message.getMessageID(), attachmentIds);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    // Get all messages in a Channel
    @GetMapping("/{channelID}")
    public ResponseEntity<List<Message>> getMessagesInChannel(
            @PathVariable int channelID) {
        List<Message> res = messagesDao.getMessagesInChannel(channelID);
        return ResponseEntity.ok(res);
    }

    // Edit a message, no change to attachments
    @PutMapping
    public ResponseEntity<Void> editMessage(@RequestBody Message message) {
        messagesDao.editMessage(message);
        return ResponseEntity.ok().build();
    }

    // Edit a message by removing attachment(s)
    @PutMapping("/attachments/{messageID}")
    public ResponseEntity<Void> removeAttachment(
            @PathVariable int messageID, @RequestBody List<Integer> attachmentIDs) {
        messagesDao.editRemoveAttachments(messageID, attachmentIDs);
        return ResponseEntity.ok().build();
    }

    // Delete a message, removing all attachments and all reactions
    @DeleteMapping("/attachments-reactions/{messageID}")
    public ResponseEntity<Void> deleteMessageAttachmentsReactions(@PathVariable int messageID) {
        messagesDao.deleteMessageAttachmentsReactions(messageID);
        return ResponseEntity.ok().build();
    }

    // Delete a message, removing all attachments
    @DeleteMapping("/attachments/{messageID}")
    public ResponseEntity<Void> deleteMessageAttachments(@PathVariable int messageID) {
        messagesDao.deleteMessageAttachments(messageID);
        return ResponseEntity.ok().build();
    }

    // Delete a message, removing all reactions
    @DeleteMapping("/reactions/{messageID}")
    public ResponseEntity<Void> deleteMessageReactions(@PathVariable int messageID) {
        messagesDao.deleteMessageReactions(messageID);
        return ResponseEntity.ok().build();
    }

    // Delete a message with no attachments or reactions
    @DeleteMapping("/{messageID}")
    public ResponseEntity<Void> deleteMessage(@PathVariable int messageID) {
        messagesDao.deleteMessageOnly(messageID);
        return ResponseEntity.ok().build();
    }


}
