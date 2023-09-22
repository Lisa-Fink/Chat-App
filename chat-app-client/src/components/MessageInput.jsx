import React, { useState, useRef, useEffect } from "react";
import "../styles/MessageInput.css";
import { useSelector, useDispatch } from "react-redux";
import { createMessage } from "../redux/messagesSlice";

function MessageInput({ stomp }) {
  const [message, setMessage] = useState("");
  const userID = useSelector((state) => state.auth.userID);
  const serverID = useSelector((state) => state.current.server.id);
  const token = useSelector((state) => state.auth.token);
  const channel = useSelector((state) => state.current.channel);
  const errorContext = useSelector((state) => state.messages.errorContext);
  const error = useSelector((state) => state.messages.error);
  const channelData = useSelector((state) => state.messages.typingByChannelID);
  const users = useSelector((state) => state.users.dataByID);
  const [channelTyping, setChannelTyping] = useState([]);

  const isTyping = useRef(false);
  const typingTimeout = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (channel.id && channel.id in channelData && channelData[channel.id]) {
      setChannelTyping(channelData[channel.id]);
    } else {
      setChannelTyping([]);
    }
  }, [channel, channelData]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && message.trim().length > 0) {
      e.preventDefault();
      submitMessage();
    } else {
      if (!isTyping.current) {
        // if starting to type (hitting a key but not submitting with enter),
        // alert channel (websocket) of typing
        stomp.current.publish({
          destination: `/topic/channels/${channel.id}/typing`,
          body: JSON.stringify({
            userID: userID,
            status: true,
            channelID: channel.id,
          }),
        });
      }
      isTyping.current = Date.now();
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(checkTyping, 1100);
    }
  };

  const checkTyping = () => {
    if (!isTyping.current) return;
    const now = Date.now();
    if (now - isTyping.current >= 1000) {
      isTyping.current = false;
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      stomp.current.publish({
        destination: `/topic/channels/${channel.id}/typing`,
        body: JSON.stringify({
          userID: userID,
          status: false,
          channelID: channel.id,
        }),
      });
    }
  };

  const submitMessage = () => {
    // only submit if a server and channel is selected
    if (serverID && channel.id) {
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

  const typingDiv = (
    <div>
      {channelTyping.slice(0, 3).map((userID, index) => {
        const username = users[userID].username;

        if (index === 2 && channelTyping.length > 3) {
          return (
            <span key={userID}>
              {username} and {channelTyping.length - 3} more are typing
            </span>
          );
        } else if (index === 1 && channelTyping.length === 2) {
          return <span key={userID}>{username} and</span>;
        } else if (index === 0 && channelTyping.length === 1) {
          return <span key={userID}>{username} is typing</span>;
        } else {
          return <span key={userID}>{username},</span>;
        }
      })}
    </div>
  );

  return (
    <div className="message-input">
      {typingDiv}
      {error && <p>{error}</p>}
      <textarea
        placeholder={channel.name && `Message # ${channel.name}`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export default MessageInput;
