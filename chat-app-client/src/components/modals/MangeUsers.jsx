import React, { useEffect, useState, useMemo } from "react";
import {
  MdCancel,
  MdCheck,
  MdClose,
  MdOutlineExpandMore,
} from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsersForServer,
  updateUserServerRole,
} from "../../redux/usersSlice";
import { removeUserFromServer } from "../../redux/usersSlice";

function MangeUsers({ id }) {
  const users = useSelector((state) => state.users.dataByID);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [showRoleMenu, setShowRoleMenu] = useState(0);
  const [showKickConfirm, setShowKickConfirm] = useState(0);

  const usersInServer = useSelector((state) => state.users.byServerID[id]);
  useFetchUsersOnMount(usersInServer, dispatch, id, auth);

  const handleRoleClick = (userID) => {
    if (showRoleMenu !== userID) {
      setShowRoleMenu(userID);
    } else {
      setShowRoleMenu(0);
    }
  };

  const handleRoleChange = (userID, roleID, oldRoleID) => {
    if (roleID !== oldRoleID) {
      dispatch(
        updateUserServerRole({
          token: auth.token,
          serverID: id,
          userID: userID,
          roleID: roleID,
        })
      );
    }
    setShowRoleMenu(0);
  };

  const handleKickClick = (userID) => {
    setShowKickConfirm(userID);
  };

  const handleKickConfirm = (userID) => {
    dispatch(
      removeUserFromServer({ token: auth.token, serverID: id, userID: userID })
    );
    setShowKickConfirm(0);
  };

  const changeRoleMenu = (user, roleID) => (
    <ul className="role-menu">
      <li>
        <button onClick={() => handleRoleChange(user.userID, 2, roleID)}>
          Admin
        </button>
      </li>
      <li>
        <button onClick={() => handleRoleChange(user.userID, 3, roleID)}>
          Moderator
        </button>
      </li>
      <li>
        <button onClick={() => handleRoleChange(user.userID, 4, roleID)}>
          Member
        </button>
      </li>
    </ul>
  );

  const userServersList = useMemo(() => {
    return (
      usersInServer &&
      usersInServer.map((userID) => {
        const user = users[userID];
        const roleID = user.serverRoles[id];
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
            <td>
              {roleID != 1 && user.userID !== auth.userID && (
                <div className="role-container">
                  <button
                    className="role"
                    onClick={(e) => handleRoleClick(user.userID)}
                  >
                    {" "}
                    Change Role
                    {showRoleMenu !== user.userID ? (
                      <MdOutlineExpandMore />
                    ) : (
                      <MdClose />
                    )}
                  </button>
                  {showRoleMenu === user.userID && (
                    <div>{changeRoleMenu(user)}</div>
                  )}
                </div>
              )}
            </td>
            <td>
              {roleID !== 1 && user.userID !== auth.userID && (
                <>
                  <button
                    className="kick"
                    onClick={() => handleKickClick(user.userID)}
                  >
                    Kick
                  </button>
                  {showKickConfirm === user.userID && (
                    <div className="kick-confirm">
                      Confirm Kick:{" "}
                      <button onClick={() => handleKickConfirm(user.userID)}>
                        <MdCheck />
                      </button>{" "}
                      <button onClick={() => setShowKickConfirm(0)}>
                        <MdCancel />
                      </button>
                    </div>
                  )}
                </>
              )}
            </td>
          </tr>
        );
      })
    );
  }, [usersInServer, users, showKickConfirm, showRoleMenu]);
  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Role</th>
          <th>Update</th>
          <th>Kick</th>
        </tr>
      </thead>
      <tbody>{userServersList}</tbody>
    </table>
  );
}

function useFetchUsersOnMount(usersInServer, dispatch, id, auth) {
  useEffect(() => {
    // gets the users in the server the first time
    if (usersInServer === null || usersInServer === undefined) {
      dispatch(fetchUsersForServer({ token: auth.token, serverID: id }));
    }
  }, []);
}

export default MangeUsers;
