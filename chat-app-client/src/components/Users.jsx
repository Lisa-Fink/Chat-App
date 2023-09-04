import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../styles/Users.css";

function Users() {
  const { id } = useSelector((state) => state.current.channel);
  const userChannels = useSelector((state) => state.users.byChannelID);
  const usersByID = useSelector((state) => state.users.dataByID);
  const usersStatus = useSelector((state) => state.users.status);
  const [curUserChannels, setCurUserChannels] = useState(
    id in userChannels ? userChannels[id] : []
  );

  useEffect(() => {
    if (usersStatus === "succeeded") {
      setCurUserChannels(id in userChannels ? userChannels[id] : []);
    }
  }, [userChannels]);

  useEffect(() => {
    setCurUserChannels(id in userChannels ? userChannels[id] : []);
  }, [id]);

  const creator = [];
  const admins = [];
  const mods = [];
  const members = [];
  for (const user of curUserChannels) {
    const role = usersByID[user].roleID;
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
