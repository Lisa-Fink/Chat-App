package com.example.chatappserver.model;

public class ReactionRequest {
    int emojiID;
    int userID;
    int messageID;
    int reactionID;

    public ReactionRequest() {}

    public int getReactionID() {
        return reactionID;
    }

    public void setReactionID(int reactionID) {
        this.reactionID = reactionID;
    }

    public int getEmojiID() {
        return emojiID;
    }

    public void setEmojiID(int emojiID) {
        this.emojiID = emojiID;
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
