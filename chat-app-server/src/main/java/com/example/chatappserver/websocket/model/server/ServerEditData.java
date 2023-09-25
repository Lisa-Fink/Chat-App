package com.example.chatappserver.websocket.model.server;

public class ServerEditData {
    private String editData;
    private int serverID;
    private int userID;

    public ServerEditData(String editData, int serverID, int userID) {
        this.editData = editData;
        this.serverID = serverID;
        this.userID = userID;
    }

    public String getEditData() {
        return editData;
    }

    public void setEditData(String editData) {
        this.editData = editData;
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
