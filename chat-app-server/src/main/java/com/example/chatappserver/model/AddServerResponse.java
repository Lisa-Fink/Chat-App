package com.example.chatappserver.model;

import java.util.List;
import java.util.Map;

public class AddServerResponse {
    private Server server;
    private List<Channel> channels;
    List<UserChannelResponse> users;
    Map<Integer, List<Integer>> userIDsByChannelID;

    public AddServerResponse(Server server, List<Channel> channels, List<UserChannelResponse> users, Map<Integer, List<Integer>> userIDsByChannelID) {
        this.server = server;
        this.channels = channels;
        this.users = users;
        this.userIDsByChannelID = userIDsByChannelID;
    }

    public Server getServer() {
        return server;
    }

    public void setServer(Server server) {
        this.server = server;
    }

    public List<Channel> getChannels() {
        return channels;
    }

    public void setChannels(List<Channel> channels) {
        this.channels = channels;
    }

    public List<UserChannelResponse> getUsers() {
        return users;
    }

    public void setUsers(List<UserChannelResponse> users) {
        this.users = users;
    }

    public Map<Integer, List<Integer>> getUserIDsByChannelID() {
        return userIDsByChannelID;
    }

    public void setUserIDsByChannelID(Map<Integer, List<Integer>> userIDsByChannelID) {
        this.userIDsByChannelID = userIDsByChannelID;
    }
}
