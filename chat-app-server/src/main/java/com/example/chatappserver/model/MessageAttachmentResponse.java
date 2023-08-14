package com.example.chatappserver.model;

import java.util.List;

public class MessageAttachmentResponse {
    private int messageID;
    private List<Integer> attachmentIDs;

    public MessageAttachmentResponse(int messageID, List<Integer> attachmentIDs) {
        this.messageID = messageID;
        this.attachmentIDs = attachmentIDs;
    }
}
