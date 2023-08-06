package com.example.chatappserver.model;

public class Channel {
    private int channelID;
    private int serverID;
    private int roleID;
    private int channelTypeID;
    private String channelName;

    public Channel() {
    }

    public Channel(int channelID, int serverID, int roleID, int channelTypeID, String channelName) {
        this.channelID = channelID;
        this.serverID = serverID;
        this.roleID = roleID;
        this.channelTypeID = channelTypeID;
        this.channelName = channelName;
    }

    public int getChannelID() {
        return channelID;
    }

    public void setChannelID(int channelID) {
        this.channelID = channelID;
    }

    public int getServerID() {
        return serverID;
    }

    public void setServerID(int serverID) {
        this.serverID = serverID;
    }

    public int getRoleID() {
        return roleID;
    }

    public void setRoleID(int roleID) {
        this.roleID = roleID;
    }

    public int getChannelTypeID() {
        return channelTypeID;
    }

    public void setChannelTypeID(int channelTypeID) {
        this.channelTypeID = channelTypeID;
    }

    public String getChannelName() {
        return channelName;
    }

    public void setChannelName(String channelName) {
        this.channelName = channelName;
    }
}
