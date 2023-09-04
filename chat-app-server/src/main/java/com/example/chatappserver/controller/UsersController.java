package com.example.chatappserver.controller;

import com.example.chatappserver.model.*;
import com.example.chatappserver.repository.UsersDao;
import com.example.chatappserver.service.AuthService;
import com.example.chatappserver.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UsersController {

    private final UsersDao usersDao;
    private final UserService userService;
    private final AuthService authService;

    @Autowired
    public UsersController(UsersDao usersDao, UserService userService, AuthService authService) {
        this.usersDao = usersDao;
        this.userService = userService;
        this.authService = authService;
    }

    // Creates a new user, using the User object, returning the new userID
    @PostMapping("/signup")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if (!userService.checkAvailableUsername(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"" + "Username not available" + "\"}");
        }
        if (!userService.checkAvailableEmail(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"" + "Email address is already in use" + "\"}");
        }
        String token = userService.registerUser(user);
        // needs to return userID
        JwtAuthResponse jwtAuthResponse = new JwtAuthResponse(token);
        JwtLoginResponse jwtLoginResponse = new JwtLoginResponse(jwtAuthResponse,
            user.getEmail(), user.getUserID(), user.getUserImageUrl(), user.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(jwtLoginResponse);
    }



    // Login using email and password
    @PostMapping("/login")
    public ResponseEntity<?>loginUserWithEmail(@RequestBody UserLoginRequest loginRequest) {
        System.out.println("controller");
        JwtLoginResponse jwtLoginResponse = userService.loginUser(loginRequest);
        if (jwtLoginResponse == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"" + "Invalid Email/Password" + "\"}");
        }
        return ResponseEntity.ok(jwtLoginResponse);
    }

    // Returns all Users in a channel
    @GetMapping("/{serverID}/{channelID}")
    public ResponseEntity<List<UserChannelResponse>> getUsersInChannel(
            @PathVariable int serverID, @PathVariable int channelID,
            @AuthenticationPrincipal CustomUserDetails user) {
        if (!authService.userInChannel(user.getUserId(), channelID)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<UserChannelResponse> channelUsers = usersDao.getUsersInChannel(channelID, serverID);
        return ResponseEntity.ok(channelUsers);
    }

    // Returns all Users in a server
    @GetMapping("/{serverID}")
    public ResponseEntity<List<UserChannelResponse>> getUsersInServer(
            @PathVariable int serverID,
            @AuthenticationPrincipal CustomUserDetails user) {
        if (!authService.userIsAdmin(user.getUserId(), serverID)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<UserChannelResponse> channelUsers = usersDao.getUsersInServer(serverID);
        return ResponseEntity.ok(channelUsers);
    }

    // Updates a Users password
    @PutMapping("/password")
    public ResponseEntity<Void> updateUserPassword(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody String password) {
        userService.updateUserPassword(user.getUserId(), password);
        return ResponseEntity.ok().build();
    }

    // Updates a Users image
    public static class UpdateImageReq {
        private String userImageUrl;

        public String getUserImageUrl() {
            return userImageUrl;
        }

        public void setUserImageUrl(String userImageUrl) {
            this.userImageUrl = userImageUrl;
        }
    }
    @PutMapping("/image")
    public ResponseEntity<Void> updateUserImage(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody UpdateImageReq imageReq) {
        usersDao.editUserImage(user.getUserId(), imageReq.getUserImageUrl());
        return ResponseEntity.ok().build();
    }


    // Delete a User
    @DeleteMapping("/")
   public ResponseEntity<Void> deleteUser(@AuthenticationPrincipal CustomUserDetails user) {
        usersDao.deleteUser(user.getUserId());
        return ResponseEntity.ok().build();
    }
}
