package com.example.chatappserver.websocket.model.channel;

public class MessageDeleteData {
    private int messageID;
    private int channelID;
    private int userID;

    public MessageDeleteData(int messageID, int channelID, int userID) {
        this.messageID = messageID;
        this.channelID = channelID;
        this.userID = userID;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public int getMessageID() {
        return messageID;
    }

    public void setMessageID(int messageID) {
        this.messageID = messageID;
    }

    public int getChannelID() {
        return channelID;
    }

    public void setChannelID(int channelID) {
        this.channelID = channelID;
    }
}
