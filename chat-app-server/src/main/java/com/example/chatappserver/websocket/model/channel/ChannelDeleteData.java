package com.example.chatappserver.websocket.model.channel;

public class ChannelDeleteData {
    private int channelID;
    private int userID;
    private int serverID;

    public ChannelDeleteData(int channelID, int userID, int serverID) {
        this.channelID = channelID;
        this.userID = userID;
        this.serverID = serverID;
    }

    public int getChannelID() {
        return channelID;
    }

    public void setChannelID(int channelID) {
        this.channelID = channelID;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public int getServerID() {
        return serverID;
    }

    public void setServerID(int serverID) {
        this.serverID = serverID;
    }
}
