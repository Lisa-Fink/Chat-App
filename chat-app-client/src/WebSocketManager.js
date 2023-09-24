import { Client } from "@stomp/stompjs";

class WebSocketManager {
  constructor() {
    this.active = false;
    this.subscriptions = { channels: {}, servers: {}, users: {} };
    this.socket = null;
  }

  activate(userID, handleUserData) {
    const url = "ws://localhost:8080/ws";
    this.socket = new Client({
      brokerURL: url,
      onConnect: () => {
        this.socket.subscribe("/topic/users/" + userID, handleUserData);
      },
    });
    this.socket.activate();
    this.active = true;
  }

  deactivate() {
    this.active = false;
    this.socket.deactivate();
  }

  isActive() {
    return this.active;
  }

  addChannelSub(channelID, callback) {
    const sub = this.socket.subscribe("/topic/channels/" + channelID, callback);
    this.subscriptions.channels[channelID] = sub;
  }

  removeChannelSub(channelID) {
    const sub = this.subscriptions.channels[channelID];
    sub.unsubscribe();
    delete this.subscriptions.channels[channelID];
  }

  getChannelSubs() {
    return this.subscriptions.channels;
  }

  addServerSub(serverID, roleID, callbackServer, callbackRole) {
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

  removeServerSub(serverID) {
    const sub = this.subscriptions.servers[serverID];
    sub.unsubscribe();
    delete this.subscriptions.servers[serverID];
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
