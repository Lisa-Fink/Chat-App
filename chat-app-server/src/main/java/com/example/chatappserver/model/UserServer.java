package com.example.chatappserver.model;

public class UserServer {
    private int userServerID;
    private int serverID;
    private int userID;
    private int roleID;

    public UserServer () {}

    public UserServer(int userServerID, int serverID, int userID, int roleID) {
        this.userServerID = userServerID;
        this.serverID = serverID;
        this.userID = userID;
        this.roleID = roleID;
    }

    public int getUserServerID() {
        return userServerID;
    }

    public void setUserServerID(int userServerID) {
        this.userServerID = userServerID;
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

    public int getRoleID() {
        return roleID;
    }

    public void setRoleID(int roleID) {
        this.roleID = roleID;
    }
}
