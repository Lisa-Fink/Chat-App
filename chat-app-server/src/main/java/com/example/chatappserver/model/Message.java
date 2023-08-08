package com.example.chatappserver.model;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class Message {
    private int messageID;
    private String text;
    private Timestamp time;
    private int userID;
    private int channelID;
    private Boolean edited;
    private List<Reaction> reactions;
    private String username;
    public Message() {}

    public Message(int messageID, String text, Timestamp time, int userID, String username, int channelID, Boolean edited) {
        this.messageID = messageID;
        this.text = text;
        this.time = time;
        this.userID = userID;
        this.username = username;
        this.channelID = channelID;
        this.edited = edited;
        this.reactions = new ArrayList<>();
    }

    public void addReaction(Reaction reaction) {
        reactions.add(reaction);
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

    public Timestamp getTime() {
        return time;
    }

    public void setTime(Timestamp time) {
        this.time = time;
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

    public Boolean getEdited() {
        return edited;
    }

    public void setEdited(Boolean edited) {
        this.edited = edited;
    }
}
