package com.example.chatappserver.websocket.model;

public class ServerDeleteUserData {
    private int serverID;
    private int delUserID;
    private int userID;

    public ServerDeleteUserData(int serverID, int delUserID, int userID) {
        this.serverID = serverID;
        this.delUserID = delUserID;
        this.userID = userID;
    }

    public int getServerID() {
        return serverID;
    }

    public void setServerID(int serverID) {
        this.serverID = serverID;
    }

    public int getDelUserID() {
        return delUserID;
    }

    public void setDelUserID(int delUserID) {
        this.delUserID = delUserID;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }
}
