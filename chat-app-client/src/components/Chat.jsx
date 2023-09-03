import React, { useEffect, useRef, useState } from "react";
import "../styles/Chat.css";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMessagesForChannel,
  editMessage,
  deleteMessage,
} from "../redux/messagesSlice";
import { fetchUsersForChannel } from "../redux/usersSlice";
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

  const [curMessages, setCurMessages] = useState(
    channel.id in messages ? messages[channel.id] : []
  );

  const [showOptions, setShowOptions] = useState(null);

  const [editText, setEditText] = useState(null);
  const [editID, setEditID] = useState(null);
  const originalText = useRef(null);

  const [confirmDelID, setConfirmDelID] = useState(null);

  useEffect(() => {
    if (channel && channel.id) {
      dispatch(
        fetchMessagesForChannel({
          token: token,
          serverID: server.id,
          channelID: channel.id,
        })
      );
      dispatch(
        fetchUsersForChannel({
          token: token,
          serverID: server.id,
          channelID: channel.id,
        })
      );
    }
  }, [channel, messages]);

  useEffect(() => {
    if (messagesStatus === "succeeded" && usersStatus === "succeeded") {
      setCurMessages(messages[channel.id]);
    }
  }, [messagesStatus, usersStatus]);

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
          time: new Date().toISOString(),
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
    return (
      <li
        className="message"
        key={message.messageID}
        onMouseEnter={() => setShowOptions(message.messageID)}
        onMouseLeave={() => setShowOptions(null)}
      >
        {users[message.userID].userImageUrl ? (
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
              {users[message.userID].username}
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
    <div className="chat">
      <ul className="message-list">{messageList}</ul>
    </div>
  );
}

export default Chat;
