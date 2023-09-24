package com.example.chatappserver.websocket.model;

public class ChannelNameEditData {
    private int channelID;
    private String name;
    private int serverID;
    private int userID;

    public ChannelNameEditData(int channelID, String name, int serverID, int userID) {
        this.channelID = channelID;
        this.name = name;
        this.serverID = serverID;
        this.userID = userID;
    }

    public int getChannelID() {
        return channelID;
    }

    public void setChannelID(int channelID) {
        this.channelID = channelID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getServerID() {
        return serverID;
    }

    public void setServerID(int serverID) {
        this.serverID = serverID;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }
}
