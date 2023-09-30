package com.example.chatappserver.websocket.service;

import com.example.chatappserver.model.Channel;
import com.example.chatappserver.model.Message;
import com.example.chatappserver.model.ReactionRequest;
import com.example.chatappserver.repository.ChannelsDao;
import com.example.chatappserver.websocket.model.*;
import com.example.chatappserver.websocket.model.channel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChannelWebSocketService {

    private final SimpMessagingTemplate messaging;
    private final ChannelsDao channelsDao;

    @Autowired
    public ChannelWebSocketService(
            SimpMessagingTemplate messaging, ChannelsDao channelsDao) {

        this.messaging = messaging;
        this.channelsDao = channelsDao;
    }

    public void sendMessageToSubscribers(Message message) {
        int channelID = message.getChannelID();
        String destination = "/topic/channels/" + channelID;
        System.out.println("sent");
        MessageBroadcast messageBroadcast = new MessageBroadcast(
                MessageType.MESSAGE_NEW, message);
        messaging.convertAndSend(destination, messageBroadcast);
    }

    public void sendMessageEditToSubscribers(
            int channelID, int messageID, String text, int userID) {
        String destination = "/topic/channels/" + channelID;
        System.out.println("sent");
        MessageBroadcast messageBroadcast = new MessageBroadcast(
                MessageType.MESSAGE_EDIT,
                new MessageEditData(channelID, messageID, text, userID));
        messaging.convertAndSend(destination, messageBroadcast);
    }

    public void sendMessageDeleteToSubscribers(
            int messageID, int channelID, int userID) {
        String destination = "/topic/channels/" + channelID;
        System.out.println("sent");
        MessageBroadcast messageBroadcast = new MessageBroadcast(
                MessageType.MESSAGE_DELETE,
                new MessageDeleteData(messageID, channelID, userID));
        messaging.convertAndSend(destination, messageBroadcast);
    }

    public void sendTypingToSubscribers(int channelID, TypingData typingData) {
        String destination = "/topic/channels/" + channelID;
        MessageBroadcast messageBroadcast = new MessageBroadcast(
                MessageType.TYPING, typingData);
        messaging.convertAndSend(destination, messageBroadcast);
    }

    public void sendRoleEditToSubscribers(
            int channelID, int roleID, int serverID,
            int userID, List<Integer> userIDs) {
        String destination = "/topic/channels/" + channelID;
        ChannelRoleEditData data = new ChannelRoleEditData(
                channelID, roleID, serverID, userID, userIDs);
        MessageBroadcast messageBroadcast = new MessageBroadcast(
                MessageType.ROLE_EDIT, data);
        messaging.convertAndSend(destination, messageBroadcast);
    }

    public void sendNameEditToSubscribers(int channelID, int serverID,
                                          int userID, String name) {
        String destination = "/topic/channels/" + channelID;
        ChannelNameEditData data = new ChannelNameEditData(
                channelID, name, serverID, userID);
        MessageBroadcast messageBroadcast = new MessageBroadcast(
                MessageType.NAME_EDIT, data);
        messaging.convertAndSend(destination, messageBroadcast);
    }

    public void sendUserEditToSubscribers(
            int channelID, int editUserID, int serverID, int userID, boolean isAdd) {
        String destination = "/topic/channels/" + channelID;
        ChannelUserEditData data = new ChannelUserEditData(
                channelID, editUserID, serverID, userID, isAdd);
        MessageBroadcast messageBroadcast = new MessageBroadcast(
                MessageType.USER_EDIT, data);
        messaging.convertAndSend(destination, messageBroadcast);
    }

    public void sendUserNewChannel(int userID, int channelID, int serverID) {
        // get channel data
        Channel channel = channelsDao.getChannelByID(serverID, userID, channelID);

        String destination = "/topic/notifications";
        MessageBroadcast messageBroadcast = new MessageBroadcast(
                MessageType.CHANNEL_NEW, channel);
//        messaging.convertAndSend(destination, messageBroadcast);
        System.out.println("sending " + userID);
        messaging.convertAndSendToUser(String.valueOf(userID), destination, messageBroadcast);
    }

    public void sendRolesNewChannel(int userID, Channel channel,
                                    int oldRoleID, List<Integer> users) {
        int serverID = channel.getServerID();
        int roleID = channel.getRoleID();
        for (int i = oldRoleID + 1; i <= roleID; i++) {
            String destination = "/topic/servers/" + serverID + "/roles/" + i;
            MessageBroadcast messageBroadcast = new MessageBroadcast(
                    MessageType.CHANNEL_NEW, new ChannelNewData(channel, users, userID));
            messaging.convertAndSend(destination, messageBroadcast);
        }
    }


    public void sendChannelDeleteToSubscribers(int channelID, int serverID, int userID) {
        String destination = "/topic/channels/" + channelID;
        MessageBroadcast messageBroadcast = new MessageBroadcast(
                MessageType.CHANNEL_DELETE, new ChannelDeleteData(channelID, userID, serverID));
        messaging.convertAndSend(destination, messageBroadcast);
    }

    public void sendNewReactionToSubscribers(ReactionRequest reaction) {
        String destination = "/topic/channels/" + reaction.getChannelID();
        MessageBroadcast messageBroadcast = new MessageBroadcast(
                MessageType.REACTION_NEW, reaction);
        messaging.convertAndSend(destination, messageBroadcast);
    }

}
