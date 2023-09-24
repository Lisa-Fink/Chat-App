import React, { useState, useEffect, useRef } from "react";
import { fetchServers } from "../redux/serversSlice";
import { useSelector, useDispatch } from "react-redux";
import { setServer } from "../redux/currentSlice";
import "../styles/Servers.css";
import AddServerModal from "./AddServerModal";
import ServerSettingsModal from "./modals/ServerSettingsModal";
import { fetchUsersForServer, setUserChannel } from "../redux/usersSlice";
import {
  addChannelUpdate,
  fetchChannelsForServer,
} from "../redux/channelsSlice";
function Servers({
  showSeverSettingsModal,
  setShowServerSettingsModal,
  socket,
}) {
  const dispatch = useDispatch();
  const servers = useSelector((state) => state.servers.data);
  const serversStatus = useSelector((state) => state.servers.status);
  const { token, userID } = useSelector((state) => state.auth);
  const serverSub = useRef(false);

  const [showServerDetails, setShowServerDetails] = useState(0);
  const [showAddServerModal, setShowAddServerModal] = useState(false);

  const handleServerClick = (serverID, serverName, roleID) => {
    // set current server
    dispatch(
      setServer({
        id: serverID,
        name: serverName,
        roleID: roleID,
      })
    );
    // get all users in server
    dispatch(
      fetchUsersForServer({
        token: token,
        serverID: serverID,
      })
    );

    // next steps handled in Channels.jsx:
    // get all channels in server
    // set current channel to the first channel in the server if there are any channels

    // get all messages for channel (should happen any time a new current channel is set)
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

  // fetches the users servers after login
  useEffect(() => {
    if (serversStatus === "idle") {
      dispatch(fetchServers(token));
    }
  }, []);

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
      }

      serverSub.current = true;
    }
  }, [servers, serversStatus]);

  const handleServerData = (res) => {
    const parsed = JSON.parse(res.body);
    const updateUserID = parsed.data.userID;
    if (updateUserID === userID) {
      // will be skipping updates from current user
      return;
    }
    const resType = parsed.type;
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
        {showServerDetails === "new" &&
          detailsDiv("new", "Create a new Server")}
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

export default Servers;
