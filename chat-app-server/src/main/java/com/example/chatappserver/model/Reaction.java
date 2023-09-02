package com.example.chatappserver.model;

public class Reaction {
    private int reactionID;
    private String emojiCode;
    private String emojiName;
    private int userID;
    private int messageID;
    private int emojiID;

    public int getEmojiID() {
        return emojiID;
    }

    public void setEmojiID(int emojiID) {
        this.emojiID = emojiID;
    }

    public Reaction() {
    }

    public Reaction(int messageID, int reactionID, String emojiCode, String emojiName, int userID) {
        this.messageID = messageID;
        this.reactionID = reactionID;
        this.emojiCode = emojiCode;
        this.emojiName = emojiName;
        this.userID = userID;
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
}
