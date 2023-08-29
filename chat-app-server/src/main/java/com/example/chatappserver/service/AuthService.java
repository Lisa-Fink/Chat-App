package com.example.chatappserver.service;

import com.example.chatappserver.repository.ChannelsDao;
import com.example.chatappserver.repository.ServersDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final ServersDao serversDao;
    private final ChannelsDao channelsDao;
    private final int MEMBER_ROLE = 4;
    private final int ADMIN_ROLE = 2;
    private final int CREATOR_ROLE = 1;

    @Autowired
    public AuthService(ServersDao serversDao, ChannelsDao channelsDao) {
        this.serversDao = serversDao;
        this.channelsDao = channelsDao;
    }


    // Servers Auth
    public boolean userInServer(int userID, int serverID) {
        return serversDao.inServer(userID, serverID);
    }
    public boolean userInServer(int userID, int serverID, int roleID) {
        return serversDao.inServerAsRole(userID, serverID, roleID);
    }
    public boolean userIsAdmin(int userID, int serverID) {
        return userInServer(userID, serverID, ADMIN_ROLE);
    }
    public boolean userIsCreator(int userID, int serverID) {
        return userInServer(userID, serverID, CREATOR_ROLE);
    }

    // Channels Auth
    public boolean inChannelAndAdmin(int userID, int channelID) {
        // user either has a UserChannel with the userID and channelID, or
        // a UserServer.roleID <= Channel.roleID
        // and the UserServer.roleID must be <= 2
        return channelsDao.isAdminChannel(userID, channelID);
    }


}
