package com.example.chatappserver.websocket.model.server;

public class ServerUserRoleEditData {
    private int serverID;
    private int userID;
    private int updateUserID;
    private int roleID;

    public ServerUserRoleEditData(int serverID, int userID, int updateUserID, int roleID) {
        this.serverID = serverID;
        this.userID = userID;
        this.updateUserID = updateUserID;
        this.roleID = roleID;
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

    public int getUpdateUserID() {
        return updateUserID;
    }

    public void setUpdateUserID(int updateUserID) {
        this.updateUserID = updateUserID;
    }

    public int getRoleID() {
        return roleID;
    }

    public void setRoleID(int roleID) {
        this.roleID = roleID;
    }
}
