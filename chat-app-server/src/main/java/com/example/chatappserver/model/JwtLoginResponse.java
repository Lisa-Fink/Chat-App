package com.example.chatappserver.model;

public class JwtLoginResponse {
    JwtAuthResponse jwtAuthResponse;
    String email;
    int userID;
    String userImageUrl;
    String username;
    UserDataResponse data;

    public JwtLoginResponse(JwtAuthResponse jwtAuthResponse, String email,
                            int userID, String userImageUrl, String username) {
        this.jwtAuthResponse = jwtAuthResponse;
        this.email = email;
        this.userID = userID;
        this.userImageUrl = userImageUrl;
        this.username = username;
    }

    public JwtLoginResponse(JwtAuthResponse jwtAuthResponse, String email,
                            int userID, String userImageUrl, String username,
                            UserDataResponse userDataResponse) {
        this.jwtAuthResponse = jwtAuthResponse;
        this.email = email;
        this.userID = userID;
        this.userImageUrl = userImageUrl;
        this.username = username;
        this.data = userDataResponse;
    }

    public UserDataResponse getData() {
        return data;
    }

    public void setData(UserDataResponse data) {
        this.data = data;
    }

    public JwtAuthResponse getJwtAuthResponse() {
        return jwtAuthResponse;
    }

    public void setJwtAuthResponse(JwtAuthResponse jwtAuthResponse) {
        this.jwtAuthResponse = jwtAuthResponse;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public String getUserImageUrl() {
        return userImageUrl;
    }

    public void setUserImageUrl(String userImageUrl) {
        this.userImageUrl = userImageUrl;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
