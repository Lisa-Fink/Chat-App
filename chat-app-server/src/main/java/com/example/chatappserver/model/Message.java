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
    private List<Attachment> attachments;

    public Message() {}

    // Used when creating new message
    // creating new message (no reactions or attachments)
    public Message(int messageID, String text, Timestamp time, int userID, int channelID) {
        this.messageID = messageID;
        this.text = text;
        this.time = time;
        this.userID = userID;
        this.channelID = channelID;
        this.edited = false;
    }

    public Message(int messageID, String text, Timestamp time, int userID, int channelID, boolean edited) {
        this.messageID = messageID;
        this.text = text;
        this.time = time;
        this.userID = userID;
        this.channelID = channelID;
        this.edited = edited;
    }

    public List<Reaction> getReactions() {
        return reactions;
    }

    public void setReactions(List<Reaction> reactions) {
        this.reactions = reactions;
    }

    public void setAttachments(List<Attachment> attachments) {
        this.attachments = attachments;
    }


    // Used when creating new message
    // creating with attachments but no reactions
    public Message(int userID, int channelID, String text, Timestamp time,
                   List<Attachment> attachments) {
        this.text = text;
        this.time = time;
        this.userID = userID;
        this.channelID = channelID;
        this.edited = false;
        this.attachments = attachments;
    }

    // Used when retrieving messages
    // creating with attachments and reactions
    public Message(int messageID, String text, Timestamp time, int userID,
                   String username, int channelID, boolean edited) {
        this.messageID = messageID;
        this.text = text;
        this.time = time;
        this.userID = userID;
        this.channelID = channelID;
        this.edited = edited;
    }

    public void addReaction(Reaction reaction) {
        if (reactions ==  null) { this.reactions = new ArrayList<>(); }
        reactions.add(reaction);
    }

    public void addAttachment(Attachment attachment) {
        if (attachments == null) { this.attachments = new ArrayList<>(); }
        attachments.add(attachment);
    }

    public List<Attachment> getAttachments() {
        return attachments;
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
