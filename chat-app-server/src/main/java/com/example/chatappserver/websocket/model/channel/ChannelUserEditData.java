package com.example.chatappserver.websocket.model.channel;

public class ChannelUserEditData {
    private int userID;
    private int editUserID;
    private int channelID;
    private int serverID;
    private boolean isAdd;

    public ChannelUserEditData(int channelID, int editUserID, int serverID, int userID, boolean isAdd) {
        this.userID = userID;
        this.editUserID = editUserID;
        this.channelID = channelID;
        this.serverID = serverID;
        this.isAdd = isAdd;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public int getEditUserID() {
        return editUserID;
    }

    public void setEditUserID(int editUserID) {
        this.editUserID = editUserID;
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

    public boolean isAdd() {
        return isAdd;
    }

    public void setAdd(boolean add) {
        isAdd = add;
    }
}
