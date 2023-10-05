package com.example.chatappserver.service;

import com.example.chatappserver.model.Channel;
import com.example.chatappserver.model.ServerResponse;
import com.example.chatappserver.model.UserChannelResponse;
import com.example.chatappserver.model.UserDataResponse;
import com.example.chatappserver.repository.ChannelsDao;
import com.example.chatappserver.repository.ServersDao;
import com.example.chatappserver.repository.UsersDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserDataService {
    private final ServersDao serversDao;
    private final UsersDao usersDao;
    private final ChannelsDao channelsDao;

    @Autowired
    public UserDataService(
            ServersDao serversDao, UsersDao usersDao, ChannelsDao channelsDao) {
        this.serversDao = serversDao;
        this.usersDao = usersDao;
        this.channelsDao = channelsDao;
    }

    public UserDataResponse fetchUserData(int userId) {
        // Get all servers for a user
        List<ServerResponse> servers = serversDao.getAllUserServers(userId);

        // Get all users for each server, mapped by serverID
        Map<Integer, List<UserChannelResponse>> usersInServers = servers.stream()
                .collect(Collectors.toMap(
                        ServerResponse::getServerID,
                        server -> usersDao.getUsersInServer(server.getServerID())
                ));

        // Get all channels for each server, mapped by serverID
        List<Channel> channels = channelsDao.getAllUserChannels(userId);
        Map<Integer, List<Channel>> channelsInServers = channels.stream()
                .collect(Collectors.groupingBy(Channel::getServerID));

        // Get all userIDs for each channel, mapped by channelID
        Map<Integer, List<Integer>> userIDsByChannelID = channels.stream()
                .collect(Collectors.toMap(
                        Channel::getChannelID,
                        channel -> usersDao.getUsersInChannel(
                                channel.getChannelID(),
                                channel.getServerID())
                ));
    return new UserDataResponse(servers, usersInServers, channelsInServers,
            userIDsByChannelID);
    }
}
