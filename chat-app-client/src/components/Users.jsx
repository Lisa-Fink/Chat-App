import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../styles/Users.css";

import {
  addUserServerChannelUpdate,
  removeUserServerChannelUpdate,
  userChannelRoleUpdate,
} from "../redux/usersSlice";

function Users() {
  const dispatch = useDispatch();
  const current = useSelector((state) => state.current);
  const serverID = current.server;
  const channelID = current.channel;
  const channel = useSelector(
    (state) =>
      state.channels.byServerID[serverID] &&
      state.channels.byServerID[serverID].find(
        (chan) => parseInt(chan.channelID) === parseInt(channelID)
      )
  );
  const server = useSelector(
    (state) =>
      state.servers.data &&
      state.servers.data.find(
        (ser) => parseInt(ser.serverID) === parseInt(serverID)
      )
  );
  const userChannels = useSelector((state) => state.users.byChannelID);
  const usersByID = useSelector((state) => state.users.dataByID);
  const usersStatus = useSelector((state) => state.users.status);
  const newID = useSelector((state) => state.users.newID);
  const channelsByServerID = useSelector((state) => state.channels.byServerID);

  const curUserChannels = useCurUserChannels(
    usersStatus,
    channelID,
    channel,
    userChannels
  );
  useUsersChange(newID, channelsByServerID, usersStatus, dispatch);

  const { creator, admins, mods, members } = useMemo(() => {
    const creator = [];
    const admins = [];
    const mods = [];
    const members = [];
    if (curUserChannels) {
      for (const user of curUserChannels) {
        const role = usersByID[user].serverRoles[server.serverID];
        if (role === 1) creator.push(user);
        else if (role === 2) admins.push(user);
        else if (role === 3) mods.push(user);
        else members.push(user);
      }
    }

    return { creator, admins, mods, members };
  }, [curUserChannels, usersByID]);

  const userList = (userArr) => {
    return userArr.map((userID) => {
      const user = usersByID[userID];
      return (
        <li className="user-list" key={user.userID}>
          {user.userImageUrl ? (
            <img className="user-thumbnail" src={user.userImageUrl} />
          ) : (
            <div className="user-thumbnail">
              {user.username.substring(0, 1).toUpperCase()}
            </div>
          )}
          <div>{user.username}</div>
        </li>
      );
    });
  };

  return (
    <div className="users thin-scroll" id="dark-scroll">
      {creator.length !== 0 && (
        <ul>
          <h3>Creator</h3>
          {userList(creator)}
        </ul>
      )}
      {admins.length !== 0 && (
        <ul>
          <h3>Admins</h3>
          {userList(admins)}
        </ul>
      )}
      {mods.length !== 0 && (
        <ul>
          <h3>Mods</h3>
          {userList(mods)}
        </ul>
      )}
      {members.length !== 0 && (
        <ul>
          <h3>Users</h3>
          {userList(members)}
        </ul>
      )}
    </div>
  );
}

export default Users;

function useCurUserChannels(usersStatus, channelID, channel, userChannels) {
  const [curUserChannels, setCurUserChannels] = useState([]);
  useEffect(() => {
    if (channel && usersStatus === "succeeded") {
      setCurUserChannels(
        channel.channelID in userChannels ? userChannels[channel.channelID] : []
      );
    }
  }, [channel]);

  useEffect(() => {
    if (channelID) {
      // update users list if userChannels changes
      setCurUserChannels(
        channelID in userChannels ? userChannels[channelID] : []
      );
    }
  }, [userChannels[channelID]]);

  return curUserChannels;
}

function useUsersChange(newID, channelsByServerID, usersStatus, dispatch) {
  useEffect(() => {
    if (usersStatus === "new") {
      const [serverID, newUserID] = newID;
      const channels = channelsByServerID[serverID];
      dispatch(addUserServerChannelUpdate({ channels, newUserID }));
    } else if (usersStatus === "delete") {
      const [serverID, delUserID] = newID;
      const channelIDs = channelsByServerID[serverID].map(
        (chan) => chan.channelID
      );
      dispatch(removeUserServerChannelUpdate({ channelIDs, delUserID }));
    } else if (usersStatus === "serverRole") {
      // get all channels
      const [serverID, userID] = newID;
      const channels = channelsByServerID[serverID];
      dispatch(userChannelRoleUpdate({ channels, userID, serverID }));
    }
  }, [usersStatus]);
}
