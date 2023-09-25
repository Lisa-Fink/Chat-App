package com.example.chatappserver.websocket.model.user;

public class UserUpdateData {
    private int userID;
    private String update;

    public UserUpdateData(int userID, String update) {
        this.userID = userID;
        this.update = update;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public String getUpdate() {
        return update;
    }

    public void setUpdate(String update) {
        this.update = update;
    }
}
