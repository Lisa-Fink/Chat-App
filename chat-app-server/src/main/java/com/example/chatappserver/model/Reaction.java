package com.example.chatappserver.model;

public class Reaction {
    private int reactionID;
    private int userID;
    private int messageID;
    private int emojiID;

    public Reaction() {
    }

    public Reaction(int reactionID, int userID, int messageID, int emojiID) {
        this.reactionID = reactionID;
        this.userID = userID;
        this.messageID = messageID;
        this.emojiID = emojiID;
    }

    public int getReactionID() {
        return reactionID;
    }

    public void setReactionID(int reactionID) {
        this.reactionID = reactionID;
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

    public int getEmojiID() {
        return emojiID;
    }

    public void setEmojiID(int emojiID) {
        this.emojiID = emojiID;
    }
}
