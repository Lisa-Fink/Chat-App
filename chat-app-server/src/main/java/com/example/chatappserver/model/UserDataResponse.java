package com.example.chatappserver.model;

import java.util.Map;
import java.util.List;

public class UserDataResponse {
    private List<ServerResponse> servers;
    private Map<Integer, List<UserChannelResponse>> usersInServers;
    private Map<Integer, List<Channel>> channelsInServers;
    private Map<Integer, List<Integer>> userIDsByChannelID;

    public UserDataResponse(List<ServerResponse> servers, Map<Integer, List<UserChannelResponse>> usersInServers, Map<Integer, List<Channel>> channelsInServers, Map<Integer, List<Integer>> userIDsByChannelID) {
        this.servers = servers;
        this.usersInServers = usersInServers;
        this.channelsInServers = channelsInServers;
        this.userIDsByChannelID = userIDsByChannelID;
    }

    public List<ServerResponse> getServers() {
        return servers;
    }

    public void setServers(List<ServerResponse> servers) {
        this.servers = servers;
    }

    public Map<Integer, List<UserChannelResponse>> getUsersInServers() {
        return usersInServers;
    }

    public void setUsersInServers(Map<Integer, List<UserChannelResponse>> usersInServers) {
        this.usersInServers = usersInServers;
    }

    public Map<Integer, List<Channel>> getChannelsInServers() {
        return channelsInServers;
    }

    public void setChannelsInServers(Map<Integer, List<Channel>> channelsInServers) {
        this.channelsInServers = channelsInServers;
    }

    public Map<Integer, List<Integer>> getUserIDsByChannelID() {
        return userIDsByChannelID;
    }

    public void setUserIDsByChannelID(Map<Integer, List<Integer>> userIDsByChannelID) {
        this.userIDsByChannelID = userIDsByChannelID;
    }
}
