package com.example.chatappserver.controller;

import com.example.chatappserver.model.Server;
import com.example.chatappserver.repository.ServersDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/servers")
public class ServersController {
    private final ServersDao serversDao;

    @Autowired
    public ServersController(ServersDao serversDao) {
        this.serversDao = serversDao;
    }
    // TODO: will need to validate the user sending the request is a valid user and logged in


    // Creates a new server, using the Server object
    @PostMapping
    public ResponseEntity<String> createServer(@RequestBody Server server) {
        // TODO: do I need to check if server has a serverName, because that cannot be null?
        serversDao.create(server);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // Returns a list of the Servers the user belongs to
    @GetMapping("/{userID}")
    public ResponseEntity<List<Server>> getUserServers(@PathVariable int userID) {
        // TODO: validate that user sending request has the same userID
        List<Server> userServers = serversDao.getAllUserServers(userID);
        return ResponseEntity.ok(userServers);
    }

    // Updates the Server's image
    @PutMapping("/{serverID}/image")
    public ResponseEntity<Void> updateServerImageUrl(@PathVariable int serverID, @RequestBody String serverImageUrl) {
        // TODO: validate that user sending request has role of admin/above
        serversDao.updateImage(serverID, serverImageUrl);
        return ResponseEntity.ok().build();
    }

    // Updates the Server's description
    @PutMapping("/{serverID}/description")
    public ResponseEntity<Void> updateServerDescription(@PathVariable int serverID, @RequestBody String serverDescription) {
        // TODO: validate that user sending request has role of admin/above
        serversDao.updateDescription(serverID, serverDescription);
        return ResponseEntity.ok().build();
    }

    // Updates the Role of a User in the Server
    @PutMapping("/{serverID}/{userID}/role")
    public ResponseEntity<Void> updateServerDescription(@PathVariable int serverID, @PathVariable int userID, @RequestBody int roleID) {
        // TODO: validate that user sending request has role of admin/above
        serversDao.updateUserRole(userID, roleID, serverID);
        return ResponseEntity.ok().build();
    }

    // Deletes a Server
    @DeleteMapping("/{serverID}")
    public ResponseEntity<Void> deleteServer(@PathVariable int serverID) {
        // TODO: validate that user sending request has role of creator
        serversDao.deleteServer(serverID);
        return ResponseEntity.ok().build();
    }


}
