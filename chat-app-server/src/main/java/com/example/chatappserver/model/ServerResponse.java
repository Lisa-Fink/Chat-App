package com.example.chatappserver.model;

public class ServerResponse extends Server{
    private int roleID;

    public ServerResponse(int serverID, String serverName, String serverDescription, String serverImageUrl, int roleID) {
        super(serverID, serverName, serverDescription, serverImageUrl);
        this.roleID = roleID;
    }

    public int getRoleID() {
        return roleID;
    }

    public void setRoleID(int roleID) {
        this.roleID = roleID;
    }
}
