package com.example.chatappserver.model;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collections;

public class CustomUserDetails extends User {

    private final int userId;
    private final String userImageUrl;
    private final String dbUsername;

    public CustomUserDetails(int userId, String userImageUrl, String username, String password,
                             String dbUsername) {
        super(username, password, Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
        this.userId = userId;
        this.userImageUrl = userImageUrl;
        this.dbUsername = dbUsername;
    }

    public String getDbUsername() {
        return dbUsername;
    }

    public String getUserImageUrl() {
        return userImageUrl;
    }

    public int getUserId() {
        return userId;
    }
}