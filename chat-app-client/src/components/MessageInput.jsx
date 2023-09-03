import React, { useState } from "react";
import "../styles/MessageInput.css";
import { useSelector, useDispatch } from "react-redux";
import { createMessage } from "../redux/messagesSlice";

function MessageInput() {
  const [message, setMessage] = useState("");
  const userID = useSelector((state) => state.auth.userID);
  const serverID = useSelector((state) => state.current.server.id);
  const token = useSelector((state) => state.auth.token);
  const channel = useSelector((state) => state.current.channel);
  const errorContext = useSelector((state) => state.messages.errorContext);
  const error = useSelector((state) => state.messages.error);

  const dispatch = useDispatch();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && message.trim().length > 0) {
      e.preventDefault();
      submitMessage();
    }
  };

  const submitMessage = () => {
    // only submit if a server and channel is selected
    if (serverID && channel.id) {
      console.log("submit");
      dispatch(
        createMessage({
          token: token,
          userID: userID,
          serverID: serverID,
          channelID: channel.id,
          text: message,
          time: new Date().toISOString(),
        })
      );
    }
    setMessage("");
  };

  return (
    <div className="message-input">
      {error && <p>{error}</p>}
      <textarea
        placeholder={`Message # ${channel.name}`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export default MessageInput;
