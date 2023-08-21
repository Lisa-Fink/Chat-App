package com.example.chatappserver.model;

import java.util.List;

public class MessageAttachmentResponse {
    private int messageID;
    private List<Integer> attachmentIDs;

    public int getMessageID() {
        return messageID;
    }

    public void setMessageID(int messageID) {
        this.messageID = messageID;
    }

    public List<Integer> getAttachmentIDs() {
        return attachmentIDs;
    }

    public void setAttachmentIDs(List<Integer> attachmentIDs) {
        this.attachmentIDs = attachmentIDs;
    }

    public MessageAttachmentResponse(int messageID, List<Integer> attachmentIDs) {
        this.messageID = messageID;
        this.attachmentIDs = attachmentIDs;
    }
}
