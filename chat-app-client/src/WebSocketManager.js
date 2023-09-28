import { Client } from "@stomp/stompjs";

class WebSocketManager {
  constructor() {
    this.active = false;
    this.subscriptions = { channels: {}, servers: {}, users: {} };
    this.socket = null;
  }

  activate(userID, handleUserData, token) {
    const url = "ws://localhost:8080/ws";

    const headers = {
      Authorization: token,
    };

    this.socket = new Client({
      brokerURL: url,
      connectHeaders: headers,
      onConnect: () => {
        this.socket.subscribe("/topic/users/" + userID, handleUserData);
      },
    });
    this.socket.activate();
    this.active = true;
  }

  deactivate() {
    this.active = false;
    this.subscriptions = { channels: {}, servers: {}, users: {} };
    this.socket.deactivate();
  }

  isActive() {
    return this.active;
  }

  addChannelSub(channelID, callback) {
    if (!(channelID in this.subscriptions.channels)) {
      const sub = this.socket.subscribe(
        "/topic/channels/" + channelID,
        callback
      );
      this.subscriptions.channels[channelID] = sub;
    }
  }

  removeChannelSub(channelID) {
    if (channelID in this.subscriptions.channels) {
      const sub = this.subscriptions.channels[channelID];
      sub.unsubscribe();
      delete this.subscriptions.channels[channelID];
    }
  }

  getChannelSubs() {
    return this.subscriptions.channels;
  }

  addServerSub(serverID, roleID, callbackServer, callbackRole) {
    if (!(serverID in this.subscriptions.servers)) {
      const sub = this.socket.subscribe(
        "/topic/servers/" + serverID,
        callbackServer
      );
      const roleSub = this.socket.subscribe(
        `/topic/servers/${serverID}/roles/${roleID}`,
        callbackRole
      );
      this.subscriptions.servers[serverID] = [sub, roleSub];
    }
  }

  updateServerRoleSub(serverID, roleID, callback) {
    const roleSub = this.subscriptions.servers[serverID][1];
    roleSub.unsubscribe();
    const newRoleSub = this.socket.subscribe(
      `/topic/servers/${serverID}/roles/${roleID}`,
      callback
    );
    this.subscriptions.servers[serverID][1] = newRoleSub;
  }

  removeServerSub(serverID) {
    if (serverID in this.subscriptions.servers) {
      const [sub, roleSub] = this.subscriptions.servers[serverID];
      sub.unsubscribe();
      roleSub.unsubscribe();
      delete this.subscriptions.servers[serverID];
    }
  }

  addUserSub(userID, callback) {
    if (!(userID in this.subscriptions.users)) {
      const sub = this.socket.subscribe("/topic/users/" + userID, callback);
      this.subscriptions.users[userID] = sub;
    }
  }

  removeUserSub(userID) {
    if (userID in this.subscriptions.users) {
      const sub = this.subscriptions.users[userID];
      sub.unsubscribe();
      delete this.subscriptions.users[userID];
    }
  }

  publishTypingStart(userID, channelID) {
    this.socket.publish({
      destination: `/topic/channels/${channelID}/typing`,
      body: JSON.stringify({
        userID: userID,
        status: true,
        channelID: channelID,
      }),
    });
  }

  publishTypingEnd(userID, channelID) {
    this.socket.publish({
      destination: `/topic/channels/${channelID}/typing`,
      body: JSON.stringify({
        userID: userID,
        status: false,
        channelID: channelID,
      }),
    });
  }
}

export default WebSocketManager;
