package com.example.chatappserver.controller;

import com.example.chatappserver.model.Message;
import com.example.chatappserver.model.Attachment;
import com.example.chatappserver.model.MessageAttachmentResponse;
import com.example.chatappserver.repository.MessagesDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
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
    private static class MessageEditRequest {
        private String text;
        private Timestamp time;

        public Timestamp getTime() {
            return time;
        }

        public void setTime(Timestamp time) {
            this.time = time;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }
    // Edit a message text, no change to attachments
    @PutMapping("/{messageID}")
    public ResponseEntity<Void> editMessage(@RequestBody MessageEditRequest editMessage, @PathVariable int messageID) {
        messagesDao.editMessageText(messageID, editMessage.getText(), editMessage.getTime());
        return ResponseEntity.ok().build();
    }

    // Edit a message by removing attachment(s)
    @PutMapping("/attachments/{messageID}")
    public ResponseEntity<Void> removeAttachment(
            @PathVariable int messageID, @RequestBody List<Integer> attachmentIDs) {
        messagesDao.editRemoveAttachments(messageID, attachmentIDs);
        return ResponseEntity.ok().build();
    }

    // Delete a message with no attachments or reactions
    @DeleteMapping("/{messageID}")
    public ResponseEntity<Void> deleteMessage(@PathVariable int messageID) {
        messagesDao.deleteMessage(messageID);
        return ResponseEntity.ok().build();
    }
}
