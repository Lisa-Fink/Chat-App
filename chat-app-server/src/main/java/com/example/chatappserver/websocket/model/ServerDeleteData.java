package com.example.chatappserver.websocket.model;

public class ServerDeleteData {
    private int serverID;
    private int userID;

    public ServerDeleteData(int serverID, int userID) {
        this.serverID = serverID;
        this.userID = userID;
    }

    public ServerDeleteData() {}

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
