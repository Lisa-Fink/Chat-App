package com.example.chatappserver.model;

public class RoleUpdateRequest {
    private int roleID;
    private int oldRoleID;

    public RoleUpdateRequest() {}

    public RoleUpdateRequest(int roleID, int oldRoleID) {
        this.roleID = roleID;
        this.oldRoleID = oldRoleID;
    }

    public int getRoleID() {
        return roleID;
    }

    public void setRoleID(int roleID) {
        this.roleID = roleID;
    }

    public int getOldRoleID() {
        return oldRoleID;
    }

    public void setOldRoleID(int oldRoleID) {
        this.oldRoleID = oldRoleID;
    }
}
