package com.example.chatappserver.controller;

import com.example.chatappserver.model.User;
import com.example.chatappserver.model.UserLoginRequest;
import com.example.chatappserver.repository.UsersDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UsersController {

    private final UsersDao usersDao;

    @Autowired
    public UsersController(UsersDao usersDao) {
        this.usersDao = usersDao;
    }

    // Creates a new user, using the User object, returning the new userID
    @PostMapping
    public ResponseEntity<Integer> createUser(@RequestBody User user) {
        usersDao.create(user);
        // needs to return user.getUserID()
        return ResponseEntity.status(HttpStatus.CREATED).body(user.getUserID());
    }

    // Login using email and password
    @PostMapping("/login")
    public ResponseEntity<String>loginUserWithEmail(@RequestBody UserLoginRequest loginRequest) {
        // TODO: user auth and security
        return ResponseEntity.ok().build();
    }

    // Returns all Users in a channel
    @GetMapping("/{serverID}/{channelID}/{maxRoleID}")
    public ResponseEntity<List<User>> getUsersInChannel(
            @PathVariable int serverID, @PathVariable int channelID,
            @PathVariable int maxRoleID) {
        List<User> channelUsers = usersDao.getUsersInChannel(channelID, serverID, maxRoleID);
        return ResponseEntity.ok(channelUsers);
    }

    @PutMapping("/{userID}/password")
    public ResponseEntity<Void> updateUserPassword(@PathVariable int userID,
                                                   @RequestBody String password) {
        // TODO: Authenticate that user sending request has the same userID
        usersDao.editPassword(userID, password);
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
    @DeleteMapping("/{userID}/delete")
   public ResponseEntity<Void> deleteUser(@PathVariable int userID) {
        // TODO: Authenticate that user sending request has the same userID
        usersDao.deleteUser(userID);
        return ResponseEntity.ok().build();
    }
}
