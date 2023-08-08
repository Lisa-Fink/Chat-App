package com.example.chatappserver.model;

public class Emoji {
    private int emojiID;
    private String emojiCode;
    private String emojiName;

    public Emoji(int emojiID, String emojiCode, String emojiName) {
        this.emojiID = emojiID;
        this.emojiCode = emojiCode;
        this.emojiName = emojiName;
    }

    public int getEmojiID() {
        return emojiID;
    }

    public void setEmojiID(int emojiID) {
        this.emojiID = emojiID;
    }

    public String getEmojiCode() {
        return emojiCode;
    }

    public void setEmojiCode(String emojiCode) {
        this.emojiCode = emojiCode;
    }

    public String getEmojiName() {
        return emojiName;
    }

    public void setEmojiName(String emojiName) {
        this.emojiName = emojiName;
    }
}
