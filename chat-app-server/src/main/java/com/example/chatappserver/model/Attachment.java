package com.example.chatappserver.model;

public class Attachment {
    private int attachmentID;
    String filename;
    String attachmentUrl;
    int messageID;
    int fileTypeID;

    public Attachment() {}

    public Attachment(int attachmentID, String filename, String attachmentUrl, int messageID, int fileTypeID) {
        this.attachmentID = attachmentID;
        this.filename = filename;
        this.attachmentUrl = attachmentUrl;
        this.messageID = messageID;
        this.fileTypeID = fileTypeID;
    }

    public int getAttachmentID() {
        return attachmentID;
    }

    public void setAttachmentID(int attachmentID) {
        this.attachmentID = attachmentID;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getAttachmentUrl() {
        return attachmentUrl;
    }

    public void setAttachmentUrl(String attachmentUrl) {
        this.attachmentUrl = attachmentUrl;
    }

    public int getMessageID() {
        return messageID;
    }

    public void setMessageID(int messageID) {
        this.messageID = messageID;
    }

    public int getFileTypeID() {
        return fileTypeID;
    }

    public void setFileTypeID(int fileTypeID) {
        this.fileTypeID = fileTypeID;
    }
}
