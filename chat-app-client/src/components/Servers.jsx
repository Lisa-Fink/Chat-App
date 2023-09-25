import React, { useState, useEffect, useRef } from "react";
import {
  fetchServers,
  removeFromServers,
  updateStatus,
} from "../redux/serversSlice";
import { useSelector, useDispatch } from "react-redux";
import { setServer } from "../redux/currentSlice";
import "../styles/Servers.css";
import AddServerModal from "./AddServerModal";
import ServerSettingsModal from "./modals/ServerSettingsModal";
import {
  addUserServerUpdate,
  fetchUsersForServer,
  removeUserServerUpdate,
  setUserChannel,
} from "../redux/usersSlice";
import {
  addChannelUpdate,
  fetchChannelsForServer,
  removeServer,
} from "../redux/channelsSlice";
import { deleteMessageChannelUpdate } from "../redux/messagesSlice";
function Servers({
  showSeverSettingsModal,
  setShowServerSettingsModal,
  socket,
}) {
  const dispatch = useDispatch();
  const servers = useSelector((state) => state.servers.data);
  const { token, userID } = useSelector((state) => state.auth);
  const channels = useSelector((state) => state.channels.byServerID);
  const lastServerID = useSelector((state) => state.servers.lastID);
  const serversStatus = useSelector((state) => state.servers.status);
  const serverSub = useRef(false);

  const [showServerDetails, setShowServerDetails] = useState(0);
  const [showAddServerModal, setShowAddServerModal] = useState(false);

  useFetchServersAtLogin(dispatch, serversStatus, token);

  // fetches all channels and users in servers the first time Servers changes
  useServersChange(
    servers,
    serversStatus,
    serverSub,
    socket,
    dispatch,
    userID,
    channels,
    lastServerID,
    token
  );

  const handleServerClick = (serverID, serverName, roleID) => {
    // set current server
    dispatch(
      setServer({
        id: serverID,
        name: serverName,
        roleID: roleID,
      })
    );
  };

  const handleServerHover = (serverID) => {
    setShowServerDetails(serverID);
  };

  const handleServerHoverExit = () => {
    setShowServerDetails(0);
  };

  const detailsDiv = (serverID, serverName) => {
    const button = document.getElementById(serverID);
    const buttonRect = button.getBoundingClientRect();
    // Calculate the position
    const top = buttonRect.top + window.scrollY + 10;
    const left = buttonRect.right + window.scrollX + 10;
    if (top > 800) {
      return;
    }
    const serverDetails = (
      <div
        style={{ top: top + "px", left: left + "px" }}
        className="server-details"
        id={serverID + "-details"}
      >
        {serverName}
      </div>
    );
    return serverDetails;
  };

  const thumbnails = servers.map((server) => {
    return (
      <li key={server.serverID}>
        <button
          className="server-thumbnail"
          id={server.serverID}
          onClick={() =>
            handleServerClick(
              server.serverID,
              server.serverName,
              server.roleID,
              server.serverDescription,
              server.serverImageUrl
            )
          }
          onMouseEnter={() => handleServerHover(server.serverID)}
          onMouseLeave={handleServerHoverExit}
        >
          {server.serverImageUrl !== null ? (
            <img className="image-thumbnail" src={server.serverImageUrl} />
          ) : (
            server.serverName.substring(0, 1)
          )}
        </button>
        {showServerDetails === server.serverID &&
          detailsDiv(server.serverID, server.serverName)}
      </li>
    );
  });

  return (
    <ul className="servers">
      {thumbnails}
      <li>
        <button
          id="new"
          className="server-thumbnail add-thumbnail"
          onMouseEnter={() => handleServerHover("new")}
          onMouseLeave={handleServerHoverExit}
          onClick={() => setShowAddServerModal(true)}
        >
          +
        </button>
        {showServerDetails === "new" && detailsDiv("new", "New Server")}
      </li>
      {showAddServerModal && (
        <AddServerModal closeModal={() => setShowAddServerModal(false)} />
      )}
      {showSeverSettingsModal && (
        <ServerSettingsModal
          closeModal={() => setShowServerSettingsModal(false)}
        />
      )}
    </ul>
  );
}

function useFetchServersAtLogin(dispatch, serversStatus, token) {
  // fetches the users servers after login
  useEffect(() => {
    if (serversStatus === "idle") {
      dispatch(fetchServers(token));
    }
  }, []);
}

function useServersChange(
  servers,
  serversStatus,
  serverSub,
  socket,
  dispatch,
  userID,
  channels,
  lastServerID,
  token
) {
  useEffect(() => {
    if (!serverSub.current && serversStatus === "succeeded") {
      // subscribe to servers the first time servers is set
      for (const server of servers) {
        socket.addServerSub(
          server.serverID,
          server.roleID,
          handleServerData,
          handleServerRoleData
        );

        // fetch all channels for each server
        dispatch(
          fetchChannelsForServer({ token: token, serverID: server.serverID })
        );

        // fetch all users for each server
        dispatch(
          fetchUsersForServer({
            token: token,
            serverID: server.serverID,
          })
        );
      }

      serverSub.current = true;
    } else if (serversStatus === "new") {
      const lastServer = servers[servers.length - 1];
      // subscribe to server
      socket.addServerSub(
        lastServer.serverID,
        lastServer.roleID,
        handleServerData,
        handleServerRoleData
      );
      // fetch all channels for server
      dispatch(
        fetchChannelsForServer({ token: token, serverID: lastServer.serverID })
      );
      // fetch all users for each server
      dispatch(
        fetchUsersForServer({
          token: token,
          serverID: lastServer.serverID,
        })
      );
      // set current server
      dispatch(
        setServer({
          id: lastServer.serverID,
          name: lastServer.serverName,
        })
      );
    } else if (serversStatus === "delete") {
      // unsub from server
      socket.removeServerSub(lastServerID);

      // unsub from each channel in server and delete each channel
      for (const chan of channels[lastServerID]) {
        const channelID = chan.channelID;
        dispatch(deleteMessageChannelUpdate({ channelID: channelID }));
        socket.removeChannelSub(channelID);
      }
      dispatch(removeServer({ serverID: lastServerID }));

      // change to next server
      const next_server = servers.length > 0 ? servers[0] : {};
      dispatch(
        setServer({
          name: next_server.serverName,
          id: next_server.serverID,
        })
      );
      dispatch(updateStatus()); // change status
    }
  }, [servers, serversStatus]);

  const handleServerData = (res) => {
    const parsed = JSON.parse(res.body);
    const updateUserID = parsed.data.userID;
    if (parseInt(updateUserID) === parseInt(userID)) {
      // will be skipping updates from current user
      return;
    }
    const resType = parsed.type;
    if (resType === "SERVER_DELETE") {
      const delServerID = parsed.data.serverID;
      // remove server from servers data
      dispatch(removeFromServers({ serverID: delServerID }));
    } else if (resType === "SERVER_NEW_USER") {
      // add the user to the userSlice for all categories,
      // (will sub from useEffect in Users.jsx)
      dispatch(
        addUserServerUpdate({
          data: parsed.data,
        })
      );
    } else if (resType === "SERVER_DELETE_USER") {
      // will keep the user and user sub incase they are in another common server
      dispatch(removeUserServerUpdate({ data: parsed.data }));
    }
  };

  const handleServerRoleData = (res) => {
    const parsed = JSON.parse(res.body);
    const updateUserID = parsed.data.userID;
    if (updateUserID === userID) {
      // will be skipping updates from current user
      return;
    }
    const resType = parsed.type;
    if (resType === "CHANNEL_NEW") {
      // add new channel to channels slice
      dispatch(addChannelUpdate({ channel: parsed.data.channel }));
      // add the users for the channel to users slice by channel id
      dispatch(
        setUserChannel({
          channelID: parsed.data.channel.channelID,
          userIDs: parsed.data.users,
        })
      );
    }
  };
}

export default Servers;
