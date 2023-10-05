import React, { useEffect } from "react";
import {
  MdCheck,
  MdOutlineAddCircleOutline,
  MdOutlineRemoveCircleOutline,
} from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import {
  addUserChannel,
  fetchUsersForServer,
  removeUserChannel,
} from "../../redux/usersSlice";

function MangeChannelUsers({ id, channelRoleID, channelID }) {
  const curUserID = useSelector((state) => state.auth.userID);
  const users = useSelector((state) => state.users.dataByID);
  const usersInServer = useSelector((state) => state.users.byServerID[id]);
  const usersInChannel = useSelector(
    (state) => state.users.byChannelID[channelID]
  );
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // gets the users in the server the first time
    if (usersInServer === null || usersInServer === undefined) {
      dispatch(fetchUsersForServer({ token: auth.token, serverID: id }));
    }
  }, []);

  const handleAddUser = (userID) => {
    dispatch(
      addUserChannel({
        token: auth.token,
        serverID: id,
        channelID: channelID,
        userID: userID,
      })
    );
  };

  const handleRemoveUser = (userID) => {
    dispatch(
      removeUserChannel({
        token: auth.token,
        serverID: id,
        channelID: channelID,
        userID: userID,
      })
    );
  };

  const userServersList =
    usersInServer &&
    usersInServer.map((userID) => {
      const user = users[userID];
      const roleID = user.serverRoles[id];
      const hasUserChannel = usersInChannel && usersInChannel.includes(userID);
      const inChannel = roleID <= channelRoleID || hasUserChannel;
      return (
        <tr className="user-server" key={userID}>
          <td className="user-info">
            {user.userImageUrl ? (
              <img className="user-thumbnail" src={user.userImageUrl} />
            ) : (
              <div className="user-thumbnail">
                {user.username.substring(0, 1).toUpperCase()}
              </div>
            )}
            {user.username}
          </td>
          <td>
            {roleID === 1
              ? "Creator"
              : roleID === 2
              ? "Admin"
              : roleID === 3
              ? "Moderator"
              : "Member"}
          </td>
          <td>{inChannel && <MdCheck />}</td>
          <td>
            {!inChannel && (
              <button onClick={() => handleAddUser(userID)}>
                <MdOutlineAddCircleOutline />
              </button>
            )}
          </td>
          <td>
            {inChannel &&
              roleID !== 1 &&
              userID !== curUserID &&
              parseInt(roleID) > parseInt(channelRoleID) && (
                <button onClick={() => handleRemoveUser(userID)}>
                  <MdOutlineRemoveCircleOutline />
                </button>
              )}
          </td>
        </tr>
      );
    });
  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Role</th>
          <th>Member</th>
          <th>Add</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>{userServersList}</tbody>
    </table>
  );
}

export default MangeChannelUsers;
