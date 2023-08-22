package com.example.chatappserver.controller;

import com.example.chatappserver.model.*;
import com.example.chatappserver.repository.UsersDao;
import com.example.chatappserver.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UsersController {

    private final UsersDao usersDao;
    private final UserService userService;

    @Autowired
    public UsersController(UsersDao usersDao, UserService userService) {
        this.usersDao = usersDao;
        this.userService = userService;
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
            @PathVariable int serverID, @PathVariable int channelID) {
        List<UserChannelResponse> channelUsers = usersDao.getUsersInChannel(channelID, serverID);
        return ResponseEntity.ok(channelUsers);
    }

    // Updates a Users password
    @PutMapping("/{userID}/password")
    public ResponseEntity<Void> updateUserPassword(@PathVariable int userID,
                                                   @RequestBody String password) {
        // TODO: Authenticate that user sending request has the same userID
        userService.updateUserPassword(userID, password);
        return ResponseEntity.ok().build();
    }

    // Updates a Users image
    @PutMapping("/{userID}/image")
    public ResponseEntity<Void> updateUserImage(
            @PathVariable int userID, @RequestBody String imageUrl) {
        // TODO: Authenticate that user sending request has the same userID
        usersDao.editUserImage(userID, imageUrl);
        return ResponseEntity.ok().build();
    }


    // Delete a User
    @DeleteMapping("/{userID}")
   public ResponseEntity<Void> deleteUser(@PathVariable int userID) {
        // TODO: Authenticate that user sending request has the same userID
        usersDao.deleteUser(userID);
        return ResponseEntity.ok().build();
    }
}
