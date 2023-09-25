package com.example.chatappserver.websocket.model.channel;

public class MessageEditData {
    private int channelID;
    private int messageID;
    private String text;

    private int userID;

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public MessageEditData(int channelID, int messageID, String text, int userID) {
        this.channelID = channelID;
        this.messageID = messageID;
        this.text = text;
        this.userID = userID;
    }

    public int getChannelID() {
        return channelID;
    }

    public void setChannelID(int channelID) {
        this.channelID = channelID;
    }

    public int getMessageID() {
        return messageID;
    }

    public void setMessageID(int messageID) {
        this.messageID = messageID;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
