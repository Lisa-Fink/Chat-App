package com.example.chatappserver.websocket.model;

import java.util.List;

public class ChannelRoleEditData {
    private int channelID;
    private int roleID;
    private int serverID;
    private int userID;
    private List<Integer> userIDs;
    public ChannelRoleEditData(){}

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

    public ChannelRoleEditData(int channelID, int roleID, int serverID, int userID, List<Integer> userIDs) {
        this.channelID = channelID;
        this.roleID = roleID;
        this.serverID = serverID;
        this.userID = userID;
        this.userIDs = userIDs;
    }

    public int getChannelID() {
        return channelID;
    }

    public void setChannelID(int channelID) {
        this.channelID = channelID;
    }

    public int getRoleID() {
        return roleID;
    }

    public void setRoleID(int roleID) {
        this.roleID = roleID;
    }

    public List<Integer> getUserIDs() {
        return userIDs;
    }

    public void setUserIDs(List<Integer> userIDs) {
        this.userIDs = userIDs;
    }
}
