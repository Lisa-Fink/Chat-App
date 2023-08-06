package com.example.chatappserver.model;
import java.sql.Date;

public class Invite {
    private int inviteID;
    private int serverID;
    private String inviteCode;
    private Date expirationTime;

    public Invite(int inviteID, int serverID, String inviteCode, Date expirationTime) {
        this.inviteID = inviteID;
        this.serverID = serverID;
        this.inviteCode = inviteCode;
        this.expirationTime = expirationTime;
    }

    public Invite() {
    }

    public Invite(int serverID, String inviteCode, Date expirationTime) {
        this.serverID = serverID;
        this.inviteCode = inviteCode;
        this.expirationTime = expirationTime;
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

    public Date getExpirationTime() {
        return expirationTime;
    }

    public void setExpirationTime(Date expirationTime) {
        this.expirationTime = expirationTime;
    }
}
