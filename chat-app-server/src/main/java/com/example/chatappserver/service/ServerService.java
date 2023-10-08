package com.example.chatappserver.service;

import com.example.chatappserver.model.AddServerResponse;
import com.example.chatappserver.model.Channel;
import com.example.chatappserver.model.Server;
import com.example.chatappserver.model.UserChannelResponse;
import com.example.chatappserver.repository.ChannelsDao;
import com.example.chatappserver.repository.ServersDao;
import com.example.chatappserver.repository.UsersDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ServerService {
    private final ServersDao serversDao;
    private final UsersDao usersDao;
    private final ChannelsDao channelsDao;

    @Autowired
    public ServerService(
            ServersDao serversDao, UsersDao usersDao, ChannelsDao channelsDao) {
        this.serversDao = serversDao;
        this.usersDao = usersDao;
        this.channelsDao = channelsDao;
    }

    public AddServerResponse getServerData(int serverID, int userID) {
        // get server
        Server server = serversDao.getServerByID(serverID, userID);
        // return all channels for server
        List<Channel> channels = channelsDao.getChannelsInServer(serverID, userID);
        // return all users in server
        List<UserChannelResponse> users = usersDao.getUsersInServer(serverID);
        // return all users in channels
        // Get all userIDs for each channel, mapped by channelID
        Map<Integer, List<Integer>> userIDsByChannelID = channels.stream()
                .collect(Collectors.toMap(
                        Channel::getChannelID,
                        channel -> usersDao.getUsersInChannel(
                                channel.getChannelID(),
                                channel.getServerID())
                ));

        return new AddServerResponse(server, channels, users, userIDsByChannelID);
    }
}
