import React, { useState, useEffect } from "react";
import { fetchServers } from "../redux/serversSlice";
import { useSelector, useDispatch } from "react-redux";
import { setChannel, setServer } from "../redux/currentSlice";
import "../styles/Servers.css";
import AddServerModal from "./AddServerModal";
import ServerSettingsModal from "./modals/ServerSettingsModal";
function Servers({ showSeverSettingsModal, setShowServerSettingsModal }) {
  const dispatch = useDispatch();
  const servers = useSelector((state) => state.servers.data);
  const serversStatus = useSelector((state) => state.servers.status);
  const token = useSelector((state) => state.auth.token);

  const [showServerDetails, setShowServerDetails] = useState(0);
  const [showAddServerModal, setShowAddServerModal] = useState(false);

  const handleServerClick = (serverID, serverName, roleID) => {
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

  useEffect(() => {
    if (serversStatus === "idle") {
      dispatch(fetchServers(token));
    }
  }, []);

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
