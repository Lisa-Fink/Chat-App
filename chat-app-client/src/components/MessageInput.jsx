import React from "react";
import "../styles/MessageInput.css";

function MessageInput() {
  const channelName = "General";
  return (
    <div className="message-input">
      <input placeholder={`Message # ${channelName}`} />
    </div>
  );
}

export default MessageInput;
