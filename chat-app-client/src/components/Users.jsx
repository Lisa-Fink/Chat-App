import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../styles/Users.css";

import { fetchUsersForChannel } from "../redux/usersSlice";

function Users() {
  const dispatch = useDispatch();
  const { server, channel } = useSelector((state) => state.current);
  const userChannels = useSelector((state) => state.users.byChannelID);
  const usersByID = useSelector((state) => state.users.dataByID);
  const usersStatus = useSelector((state) => state.users.status);
  const { token } = useSelector((state) => state.auth);
  const [curUserChannels, setCurUserChannels] = useState([]);
  const id = channel.id;

  // if the channel id changes, fetch the users list for the new channel
  useEffect(() => {
    if (channel && channel.id) {
      dispatch(
        fetchUsersForChannel({
          token: token,
          serverID: server.id,
          channelID: channel.id,
        })
      );
    }
  }, [server, channel]);
  // after fetching the new user list, update the local state
  useEffect(() => {
    if (usersStatus === "succeeded") {
      setCurUserChannels(
        channel.id in userChannels ? userChannels[channel.id] : []
      );
    }
  }, [usersStatus, userChannels]);

  const creator = [];
  const admins = [];
  const mods = [];
  const members = [];
  for (const user of curUserChannels) {
    const role = usersByID[user].serverRoles[server.id];
    if (role === 1) creator.push(user);
    else if (role === 2) admins.push(user);
    else if (role === 3) mods.push(user);
    else members.push(user);
  }

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
    <div className="users thin-scroll">
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
