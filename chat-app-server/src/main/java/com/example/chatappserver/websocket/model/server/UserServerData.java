package com.example.chatappserver.websocket.model.server;

public class UserServerData {
    private int serverID;
    private int userID;
    private String username;
    private String userImageUrl;
    private int serverRoleID;

    public UserServerData(int serverID, int userID, String username, String userImageUrl, int serverRoleID) {
        this.serverID = serverID;
        this.userID = userID;
        this.username = username;
        this.userImageUrl = userImageUrl;
        this.serverRoleID = serverRoleID;
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUserImageUrl() {
        return userImageUrl;
    }

    public void setUserImageUrl(String userImageUrl) {
        this.userImageUrl = userImageUrl;
    }

    public int getServerRoleID() {
        return serverRoleID;
    }

    public void setServerRoleID(int serverRoleID) {
        this.serverRoleID = serverRoleID;
    }
}
