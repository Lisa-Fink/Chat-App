package com.example.chatappserver.model;
import java.sql.Date;

public class Invite {
    private int inviteID;
    private int serverID;
    private String inviteCode;
    private Date createdDate;



    public Invite() {
    }

    public Invite(int serverID, String inviteCode, Date createdDate) {
        this.serverID = serverID;
        this.inviteCode = inviteCode;
        this.createdDate = createdDate;
    }

    public int getInviteID() {
        return inviteID;
    }

    public void setInviteID(int inviteID) {
        this.inviteID = inviteID;
    }

    public int getServerID() {
        return serverID;
    }

    public void setServerID(int serverID) {
        this.serverID = serverID;
    }

    public String getInviteCode() {
        return inviteCode;
    }

    public void setInviteCode(String inviteCode) {
        this.inviteCode = inviteCode;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }
}
