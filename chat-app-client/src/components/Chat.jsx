import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "../styles/Chat.css";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMessagesForChannel,
  editMessage,
  deleteMessage,
} from "../redux/messagesSlice";
import {
  MdEdit,
  MdDelete,
  MdAddReaction,
  MdCheck,
  MdCancel,
} from "react-icons/md";

function Chat() {
  const dispatch = useDispatch();
  const { channel, server } = useSelector((state) => state.current);
  const { token, userID } = useSelector((state) => state.auth);
  const messages = useSelector((state) => state.messages.byChannelID);
  const messagesStatus = useSelector((state) => state.messages.status);
  const usersStatus = useSelector((state) => state.users.status);
  const users = useSelector((state) => state.users.dataByID);
  const usersInChannel = useSelector((state) => state.users.byChannelID);

  const [curMessages, setCurMessages] = useState(
    channel.id in messages ? messages[channel.id] : []
  );

  const [showOptions, setShowOptions] = useState(null);

  const [editText, setEditText] = useState(null);
  const [editID, setEditID] = useState(null);
  const originalText = useRef(null);

  const [confirmDelID, setConfirmDelID] = useState(null);

  const chatRef = useRef();

  // if the channel changes, fetch the messages for the new channel
  useEffect(() => {
    if (channel && channel.id) {
      dispatch(
        fetchMessagesForChannel({
          token: token,
          serverID: server.id,
          channelID: channel.id,
        })
      );
    } else {
      setCurMessages([]);
    }
  }, [channel]);
  // After the messages are fetched, update the local state
  useEffect(() => {
    if (!messages[channel.id]) return;
    setCurMessages(messages[channel.id]);
  }, [messages[channel.id]]);

  useLayoutEffect(() => {
    // Always scroll to the bottom of the chat container
    if (
      chatRef.current &&
      chatRef.current.lastChild &&
      chatRef.current.lastChild.lastChild
    ) {
      const lastMessage = chatRef.current.lastChild.lastChild;
      if (lastMessage) {
        lastMessage.scrollIntoView();
      }
    }
  }, [chatRef, curMessages]);

  const handleEditClick = (id, text) => {
    setEditID(id);
    setEditText(text);
    originalText.current = text;
  };

  const handleEditConfirm = () => {
    if (editText !== originalText.current) {
      dispatch(
        editMessage({
          token: token,
          text: editText,
          messageID: editID,
          serverID: server.id,
          channelID: channel.id,
        })
      );
    }
    clearEditState();
  };

  const clearEditState = () => {
    setEditID(null);
    setEditText(null);
    originalText.current = null;
  };

  const handleDeleteClick = (id) => {
    setConfirmDelID(id);
  };

  const handleDeleteConfirm = () => {
    dispatch(
      deleteMessage({
        token: token,
        messageID: confirmDelID,
        serverID: server.id,
        channelID: channel.id,
      })
    );
    setConfirmDelID(null);
  };

  const messageList = curMessages.map((message) => {
    const isUnknown =
      !message.userID ||
      !usersInChannel[channel.id] ||
      !usersInChannel[channel.id].includes(message.userID);
    return (
      <li
        className="message"
        key={message.messageID}
        onMouseEnter={() => setShowOptions(message.messageID)}
        onMouseLeave={() => setShowOptions(null)}
      >
        {isUnknown ? (
          <div className="message-thumbnail">U</div>
        ) : users[message.userID].userImageUrl ? (
          <img
            className="message-thumbnail"
            src={users[message.userID].userImageUrl}
          />
        ) : (
          <div className="message-thumbnail">
            {users[message.userID].username.substring(0, 1).toUpperCase()}
          </div>
        )}
        <div>
          <div className="message-data">
            <div className="message-username">
              {isUnknown ? "Unknown User" : users[message.userID].username}
            </div>
            <div className="message-time">
              {new Date(message.time).toLocaleString()}
            </div>
            {message.edited && <div className="edited">(edited)</div>}
          </div>
          {editID !== message.messageID ? (
            <p>{message.text}</p>
          ) : (
            <div className="edit-div">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <div>
                <button onClick={handleEditConfirm}>
                  <MdCheck />
                </button>
                <button onClick={clearEditState}>
                  <MdCancel />
                </button>
              </div>
            </div>
          )}
        </div>
        {showOptions === message.messageID && (
          <div className="message-options">
            <button>
              <MdAddReaction />
            </button>
            {message.userID === userID && (
              <>
                <button
                  onClick={() =>
                    handleEditClick(message.messageID, message.text)
                  }
                >
                  <MdEdit />
                </button>
                <button onClick={() => handleDeleteClick(message.messageID)}>
                  <MdDelete />
                </button>
              </>
            )}
          </div>
        )}
        {confirmDelID === message.messageID && (
          <div className="confirm-del">
            Confirm Delete
            <div>
              <button onClick={handleDeleteConfirm}>
                <MdCheck />
              </button>
              <button onClick={() => setConfirmDelID(null)}>
                <MdCancel />
              </button>
            </div>
          </div>
        )}
      </li>
    );
  });

  return (
    <div className="chat" ref={chatRef}>
      {messagesStatus === "succeeded" && usersStatus === "succeeded" && (
        <ul className="message-list">{messageList}</ul>
      )}
    </div>
  );
}

export default Chat;
