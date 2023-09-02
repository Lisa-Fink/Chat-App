import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../styles/Users.css";

function Users() {
  const { id } = useSelector((state) => state.current.channel);
  const userChannels = useSelector((state) => state.users.byChannelID);
  const usersStatus = useSelector((state) => state.users.status);
  const [curUserChannels, setCurUserChannels] = useState(
    id in userChannels ? userChannels[id] : [[], [], [], []]
  );

  useEffect(() => {
    if (usersStatus === "succeeded") {
      setCurUserChannels(
        id in userChannels ? userChannels[id] : [[], [], [], []]
      );
    }
  }, [usersStatus]);

  const userList = (userArr) => {
    return userArr.map((user) => {
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
  const creator = userList(curUserChannels[0]);
  const admins = userList(curUserChannels[1]);
  const mods = userList(curUserChannels[2]);
  const members = userList(curUserChannels[3]);

  return (
    <div className="users thin-scroll">
      {curUserChannels[0].length !== 0 && (
        <ul>
          <h3>Creator</h3>
          {creator}
        </ul>
      )}
      {curUserChannels[1].length !== 0 && (
        <ul>
          <h3>Admins</h3>
          {admins}
        </ul>
      )}
      {curUserChannels[2].length !== 0 && (
        <ul>
          <h3>Mods</h3>
          {mods}
        </ul>
      )}
      {curUserChannels[3].length !== 0 && (
        <ul>
          <h3>Users</h3>
          {members}
        </ul>
      )}
    </div>
  );
}

export default Users;
