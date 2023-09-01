import React, { useState, useEffect } from "react";
import { fetchServers } from "../redux/serversSlice";
import { useSelector, useDispatch } from "react-redux";
import { setServer } from "../redux/currentSlice";
import "../styles/Servers.css";
function Servers() {
  const dispatch = useDispatch();
  const servers = useSelector((state) => state.servers);

  const [showServerDetails, setShowServerDetails] = useState(0);

  const handleServerClick = (e) => {
    const serverID = parseInt(e.currentTarget.dataset.serverId);
    const serverName = e.currentTarget.dataset.serverName;
    dispatch(setServer({ id: serverID, name: serverName }));
  };

  const handleServerHover = (e) => {
    const serverID = parseInt(e.currentTarget.dataset.serverId);
    setShowServerDetails(serverID);
  };

  const handleServerEndHover = () => {
    setShowServerDetails(0);
  };

  useEffect(() => {
    const token = import.meta.env.VITE_TOKEN;
    dispatch(fetchServers(token));
  }, []);

  const thumbnails = servers.map((server) => {
    return (
      <li key={server.serverID}>
        <button
          className="server-thumbnail"
          data-server-id={server.serverID}
          data-server-name={server.serverName}
          onClick={handleServerClick}
          onMouseEnter={handleServerHover}
          onMouseLeave={handleServerEndHover}
        >
          {server.serverImageUrl !== null ? (
            <img className="image-thumbnail" src={server.serverImageUrl} />
          ) : (
            server.serverName.substring(0, 1)
          )}
        </button>
        {showServerDetails === server.serverID && (
          <div className="server-details">{server.serverName}</div>
        )}
      </li>
    );
  });

  return (
    <ul className="servers">
      {thumbnails}
      <li>
        <button className="server-thumbnail add-thumbnail">+</button>
      </li>
    </ul>
  );
}

export default Servers;
