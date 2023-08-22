package com.example.chatappserver.model;

public class User {
    private int userID;
    private String username;
    private String email;
    private String password;
    private String userImageUrl;

    public User() {}

    public User(String username, String email, String password, String userImageUrl) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.userImageUrl = userImageUrl;
    }

    public Integer getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUserImageUrl() {
        return userImageUrl;
    }

    public void setUserImageUrl(String userImageUrl) {
        this.userImageUrl = userImageUrl;
    }

    // Override toString method for debugging and logging purposes
    @Override
    public String toString() {
        return "User{" +
                "userID=" + userID +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", userImageUrl='" + userImageUrl + '\'' +
                '}';
    }
}
