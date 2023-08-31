import React from "react";
import "../styles/Menu.css";
import { MdSettings } from "react-icons/md";

function Menu() {
  const channelName = "# General";

  return (
    <div className="menu">
      <div className="channel-name">{channelName}</div>
      <div id="channel-setting-icon">
        <MdSettings />
      </div>
    </div>
  );
}

export default Menu;
