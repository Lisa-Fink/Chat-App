import React from "react";
import "../styles/Menu.css";
import { MdSettings } from "react-icons/md";
import { useSelector } from "react-redux";

function Menu() {
  const { channel } = useSelector((state) => state.current);

  return (
    <div className="menu">
      <div className="channel-name"># {channel.name}</div>
      <div id="channel-setting-icon">
        <MdSettings />
      </div>
    </div>
  );
}

export default Menu;
