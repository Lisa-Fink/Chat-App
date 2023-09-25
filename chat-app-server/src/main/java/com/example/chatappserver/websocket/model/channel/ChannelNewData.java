package com.example.chatappserver.websocket.model.channel;

import com.example.chatappserver.model.Channel;

import java.util.List;

public class ChannelNewData {
    private Channel channel;
    private List<Integer> users;
    private int userID;

    public ChannelNewData(Channel channel, List<Integer> users, int userID) {
        this.channel = channel;
        this.users = users;
        this.userID = userID;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public Channel getChannel() {
        return channel;
    }

    public void setChannel(Channel channel) {
        this.channel = channel;
    }

    public List<Integer> getUsers() {
        return users;
    }

    public void setUsers(List<Integer> users) {
        this.users = users;
    }
}
