import React, { useState } from "react";
import "../styles/Menu.css";
import { MdSettings } from "react-icons/md";
import { useSelector } from "react-redux";

import ChannelSettingsModal from "./modals/ChannelSettingsModal";

function Menu() {
  const current = useSelector((state) => state.current);
  const serverID = current.server;
  const channelID = current.channel;
  const channel = useSelector(
    (state) =>
      state.channels.byServerID[serverID] &&
      state.channels.byServerID[serverID].find(
        (chan) => parseInt(chan.channelID) === parseInt(channelID)
      )
  );
  const server = useSelector(
    (state) =>
      state.servers.data &&
      state.servers.data.find(
        (ser) => parseInt(ser.serverID) === parseInt(serverID)
      )
  );
  const [settingsModal, setSettingsModal] = useState(false);

  return (
    <div className="menu">
      <div className="channel-name"># {channel && channel.channelName}</div>
      {channel &&
        channel.channelID &&
        server &&
        server.roleID &&
        server.roleID <= 2 && (
          <div id="channel-setting-icon">
            <button
              className="hover-btn"
              onClick={() => setSettingsModal(true)}
            >
              <MdSettings />
            </button>
          </div>
        )}
      {settingsModal && (
        <ChannelSettingsModal closeModal={() => setSettingsModal(false)} />
      )}
    </div>
  );
}

export default Menu;
