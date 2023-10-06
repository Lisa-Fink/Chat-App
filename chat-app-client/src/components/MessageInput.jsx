import React, { useState, useRef, useEffect } from "react";
import "../styles/MessageInput.css";
import { useSelector, useDispatch } from "react-redux";
import { createMessage } from "../redux/messagesSlice";
import { MdAddReaction } from "react-icons/md";
import EmojiMenu from "./EmojiMenu";

function MessageInput({ socket, scroll }) {
  const [message, setMessage] = useState("");
  const userID = useSelector((state) => state.auth.userID);
  const serverID = useSelector((state) => state.current.server.id);
  const token = useSelector((state) => state.auth.token);
  const channel = useSelector((state) => state.current.channel);
  const error = useSelector((state) => state.messages.error);
  const channelData = useSelector((state) => state.messages.typingByChannelID);
  const users = useSelector((state) => state.users.dataByID);
  const [channelTyping, setChannelTyping] = useState([]);
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);

  const isTyping = useRef(false);
  const typingTimeout = useRef(null);

  const dispatch = useDispatch();

  const textAreaRef = useRef(null);
  useResizeTextArea(textAreaRef.current, message);

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
      endTyping();
    } else {
      if (!isTyping.current) {
        // if starting to type (hitting a key but not submitting with enter),
        // alert channel (websocket) of typing
        socket.current.publishTypingStart(userID, channel.id);
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
      endTyping();
    }
  };

  const endTyping = () => {
    isTyping.current = false;
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    socket.current.publishTypingEnd(userID, channel.id);
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
      scroll();
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

  const addEmojiToMessage = (id, messageID, code) => {
    if (textAreaRef.current.style.height.slice(0, -2) >= 532) {
      textAreaRef.current.parentElement.classList.add("too-long");
      setTimeout(() => {
        textAreaRef.current.parentElement.classList.remove("too-long");
      }, 500);
      setShowEmojiMenu(false);
      return;
    }
    const cursorStart = textAreaRef.current.selectionStart;
    const cursorEnd = textAreaRef.current.selectionEnd;
    const newMessage =
      message.slice(0, Math.min(cursorStart, cursorEnd)) +
      code +
      message.slice(Math.max(cursorStart, cursorEnd), message.length + 1);
    setMessage(newMessage);
    setShowEmojiMenu(false);
  };

  const handleTextChange = (e) => {
    if (
      e.target.style.height.slice(0, -2) >= 460 &&
      e.target.value.length > message.length
    ) {
      e.target.parentElement.classList.add("too-long");
      setTimeout(() => {
        e.target.parentElement.classList.remove("too-long");
      }, 500);
    } else {
      setMessage(e.target.value);
    }
  };

  return (
    <div className="message-input-container">
      {typingDiv}
      {error && <p>{error}</p>}
      <div className="message-input">
        <textarea
          placeholder={channel.name && `Message # ${channel.name}`}
          value={message}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          ref={textAreaRef}
        />
        {showEmojiMenu && (
          <EmojiMenu
            addEmoji={addEmojiToMessage}
            cancel={() => {
              setShowEmojiMenu(false);
            }}
          />
        )}
        <button
          className="message-icon-btn"
          onClick={() => setShowEmojiMenu(true)}
          disabled={showEmojiMenu}
        >
          <MdAddReaction />
        </button>
      </div>
    </div>
  );
}

const useResizeTextArea = (textAreaRef, message) => {
  useEffect(() => {
    if (textAreaRef) {
      textAreaRef.style.height = "0px";
      textAreaRef.style.height = textAreaRef.scrollHeight + 3 + "px";
    }
  }, [textAreaRef, message]);
};

export default MessageInput;
