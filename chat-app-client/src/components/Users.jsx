import React from "react";
import "../styles/Users.css";

function Users() {
  const users = [
    {
      userID: 1,
      username: "user1",
      userImageUrl: "./J7R_2006.jpg",
      roleID: 1,
    },
    {
      userID: 2,
      username: "user2",
      userImageUrl: "./J7R_2046.jpg",
      roleID: 4,
    },
    {
      userID: 3,
      username: "user3",
      userImageUrl: "./JRR_0015_edit.jpg",
      roleID: 4,
    },
    {
      userID: 4,
      username: "user4",
      userImageUrl: "./JRX_2667-2.jpg",
      roleID: 4,
    },
    {
      userID: 5,
      username: "user5",
      userImageUrl: "./JRZ_0467.jpg",
      roleID: 4,
    },
  ];
  // sort users by role
  const userMap = [[], [], [], []];
  for (const user of users) {
    userMap[user.roleID - 1].push(user);
  }

  const userList = (userArr) => {
    return userArr.map((user) => {
      return (
        <li className="user-list" key={user.userID}>
          <img src={user.userImageUrl} />
          <div>{user.username}</div>
        </li>
      );
    });
  };
  const creator = userList(userMap[0]);
  const admins = userList(userMap[1]);
  const mods = userList(userMap[2]);
  const members = userList(userMap[3]);

  return (
    <div className="users thin-scroll">
      {userMap[0].length !== 0 && (
        <ul>
          <h3>Creator</h3>
          {creator}
        </ul>
      )}
      {userMap[1].length !== 0 && (
        <ul>
          <h3>Admins</h3>
          {admins}
        </ul>
      )}
      {userMap[2].length !== 0 && (
        <ul>
          <h3>Mods</h3>
          {mods}
        </ul>
      )}
      {userMap[3].length !== 0 && (
        <ul>
          <h3>Users</h3>
          {members}
        </ul>
      )}
    </div>
  );
}

export default Users;
