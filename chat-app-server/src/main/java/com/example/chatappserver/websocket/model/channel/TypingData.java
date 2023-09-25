package com.example.chatappserver.websocket.model.channel;

public class TypingData {
    private int userID;
    private int channelID;
    private boolean status;

    public TypingData() {}
    public TypingData(int userID, int channelID, boolean status) {
        this.userID = userID;
        this.channelID = channelID;
        this.status = status;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public int getChannelID() {
        return channelID;
    }

    public void setChannelID(int channelID) {
        this.channelID = channelID;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
}
