package com.example.chatappserver.model;

public class LoginResponse {
    JwtAuthResponse jwtAuthResponse;
    int userID;

    public LoginResponse(JwtAuthResponse jwtAuthResponse, int userID) {
        this.jwtAuthResponse = jwtAuthResponse;
        this.userID = userID;
    }

    public JwtAuthResponse getJwtAuthResponse() {
        return jwtAuthResponse;
    }

    public void setJwtAuthResponse(JwtAuthResponse jwtAuthResponse) {
        this.jwtAuthResponse = jwtAuthResponse;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }
}
