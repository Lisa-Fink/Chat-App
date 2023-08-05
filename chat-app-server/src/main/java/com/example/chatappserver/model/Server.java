package com.example.chatappserver.model;

public class Server {
    private int serverID;
    private String serverName;
    private String serverDescription;
    private String serverImageUrl;

    public Server() {}

    public Server(int serverID, String serverName, String serverDescription, String serverImageUrl) {
        this.serverID = serverID;
        this.serverName = serverName;
        this.serverDescription = serverDescription;
        this.serverImageUrl = serverImageUrl;
    }

    public int getServerID() {
        return serverID;
    }

    public void setServerID(int serverID) {
        this.serverID = serverID;
    }

    public String getServerName() {
        return serverName;
    }

    public void setServerName(String serverName) {
        this.serverName = serverName;
    }

    public String getServerDescription() {
        return serverDescription;
    }

    public void setServerDescription(String serverDescription) {
        this.serverDescription = serverDescription;
    }

    public String getServerImageUrl() {
        return serverImageUrl;
    }

    public void setServerImageUrl(String serverImageUrl) {
        this.serverImageUrl = serverImageUrl;
    }
}
