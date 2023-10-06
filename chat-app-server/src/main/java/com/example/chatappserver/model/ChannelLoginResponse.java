package com.example.chatappserver.model;

import java.sql.Timestamp;

public class ChannelLoginResponse {
    private int channelID;
    private int serverID;
    private int roleID;
    private int channelTypeID;
    private String channelName;
    private Timestamp channelTime;
    private Timestamp userRead;

    public ChannelLoginResponse() {
    }

    public ChannelLoginResponse(int channelID, int serverID, int roleID, int channelTypeID, String channelName, Timestamp channelTime, Timestamp userRead) {
        this.channelID = channelID;
        this.serverID = serverID;
        this.roleID = roleID;
        this.channelTypeID = channelTypeID;
        this.channelName = channelName;
        this.channelTime = channelTime;
        this.userRead = userRead;
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

    public Timestamp getChannelTime() {
        return channelTime;
    }

    public void setChannelTime(Timestamp channelTime) {
        this.channelTime = channelTime;
    }

    public Timestamp getUserRead() {
        return userRead;
    }

    public void setUserRead(Timestamp userRead) {
        this.userRead = userRead;
    }
}
