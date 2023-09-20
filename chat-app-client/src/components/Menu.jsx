import React, { useState } from "react";
import "../styles/Menu.css";
import { MdSettings } from "react-icons/md";
import { useSelector } from "react-redux";

import ChannelSettingsModal from "./modals/ChannelSettingsModal";

function Menu() {
  const { server, channel } = useSelector((state) => state.current);

  const [settingsModal, setSettingsModal] = useState(false);

  return (
    <div className="menu">
      <div className="channel-name"># {channel.name}</div>
      {channel.id && server && server.roleID && server.roleID <= 2 && (
        <div id="channel-setting-icon">
          <button onClick={() => setSettingsModal(true)}>
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
