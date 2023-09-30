import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "../styles/Chat.css";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMessagesForChannel,
  editMessage,
  deleteMessage,
  addReaction,
  removeReaction,
} from "../redux/messagesSlice";
import {
  MdEdit,
  MdDelete,
  MdAddReaction,
  MdCheck,
  MdCancel,
} from "react-icons/md";
import EmojiMenu from "./modals/EmojiMenu";

function Chat() {
  const dispatch = useDispatch();
  const { channel, server } = useSelector((state) => state.current);
  const { token, userID } = useSelector((state) => state.auth);
  const messages = useSelector((state) => state.messages.byChannelID);
  const messagesStatus = useSelector((state) => state.messages.status);

  const usersStatus = useSelector((state) => state.users.status);
  const users = useSelector((state) => state.users.dataByID);
  const usersInChannel = useSelector((state) => state.users.byChannelID);
  const emojis = useSelector((state) => state.emojis.emojis);

  const [curMessages, setCurMessages] = useState(
    channel.id in messages ? messages[channel.id] : []
  );

  const [showOptions, setShowOptions] = useState(null);

  const [editText, setEditText] = useState(null);
  const [editID, setEditID] = useState(null);
  const originalText = useRef(null);

  const [confirmDelID, setConfirmDelID] = useState(null);

  const [showEmojiMenu, setShowEmojiMenu] = useState(0);

  const chatRef = useRef();
  const closeEmojisOnClick = () => {
    if (showEmojiMenu) {
      setShowEmojiMenu(null);
    }
  };

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
  // After the messages for the channel are fetched/added to, update the local state
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

  const handleMessageMouseEnter = (messageID) => {
    setShowOptions(messageID);
  };

  const handleEmojiSelectClick = (messageID) => {
    setShowEmojiMenu(messageID);
  };

  const handleNewEmojiClick = (emojiID, messageID) => {
    setShowEmojiMenu(null);
    dispatch(
      addReaction({
        token: token,
        userID: userID,
        messageID: messageID,
        emojiID: emojiID,
        channelID: channel.id,
      })
    );
  };

  const handleEmojiClick = (reactionList, emojiID, messageID) => {
    const userReact = reactionList.find(
      (react) => parseInt(react[0]) === userID
    );
    if (userReact)
      dispatch(
        removeReaction({
          token: token,
          emojiID: emojiID,
          messageID: messageID,
          channelID: channel.id,
          reactionID: userReact[1],
        })
      );
    else
      dispatch(
        addReaction({
          token: token,
          emojiID: emojiID,
          messageID: messageID,
          channelID: channel.id,
          userID: userID,
        })
      );
  };

  const userThumbnail = (message, isUnknown) =>
    isUnknown ? (
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
    );

  const reactions = (reactionMap, messageID) => {
    if (!reactionMap) return;
    const keys = Object.keys(reactionMap);
    return keys.map((emojiID) => {
      const emojiCode = getEmojiCode(emojiID);
      if (emojiCode) {
        return (
          <button
            key={emojiID}
            className="active-btn message-btn reaction-btn"
            onClick={() =>
              handleEmojiClick(reactionMap[emojiID], emojiID, messageID)
            }
          >
            {emojiCode} {reactionMap[emojiID].length}
          </button>
        );
      }
    });
  };

  const messageData = (message, isUnknown) => (
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
            <button
              className="message-btn active-btn"
              onClick={handleEditConfirm}
            >
              <MdCheck />
            </button>
            <button className="message-btn active-btn" onClick={clearEditState}>
              <MdCancel />
            </button>
          </div>
        </div>
      )}
      {reactions(message.reactions, message.messageID)}
    </div>
  );

  const messageHoverOptions = (message) =>
    showEmojiMenu !== message.messageID &&
    showOptions === message.messageID && (
      <div className="message-options">
        <button
          className="message-btn active-btn"
          onClick={() => handleEmojiSelectClick(message.messageID)}
        >
          <MdAddReaction />
        </button>

        {message.userID === userID && (
          <>
            <button
              className="message-btn active-btn"
              onClick={() => handleEditClick(message.messageID, message.text)}
            >
              <MdEdit />
            </button>
            <button
              className="message-btn active-btn"
              onClick={() => handleDeleteClick(message.messageID)}
            >
              <MdDelete />
            </button>
          </>
        )}
      </div>
    );

  const confirmDelete = (message) =>
    confirmDelID === message.messageID && (
      <div className="message-btn confirm-del">
        Confirm Delete
        <div>
          <button
            className="message-btn active-btn"
            onClick={handleDeleteConfirm}
          >
            <MdCheck />
          </button>
          <button
            className="message-btn active-btn"
            onClick={() => setConfirmDelID(null)}
          >
            <MdCancel />
          </button>
        </div>
      </div>
    );

  const getEmojiCode = (emojiId) => {
    const found = emojis.find(
      (em) => parseInt(em.emojiID) === parseInt(emojiId)
    );
    if (found) return found.emojiCode;
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
        onMouseEnter={() => handleMessageMouseEnter(message.messageID)}
        onMouseLeave={() => setShowOptions(null)}
      >
        {userThumbnail(message, isUnknown)}
        {messageData(message, isUnknown)}
        {showEmojiMenu === message.messageID && (
          <EmojiMenu
            addEmoji={handleNewEmojiClick}
            messageID={message.messageID}
            cancel={closeEmojisOnClick}
          />
        )}
        {messageHoverOptions(message)}
        {confirmDelete(message)}
      </li>
    );
  });

  return (
    <div className="chat" ref={chatRef}>
      {server.id !== null &&
        channel.id !== null &&
        messagesStatus !== "failed" &&
        usersStatus === "succeeded" && (
          <ul className="message-list">{messageList}</ul>
        )}
    </div>
  );
}

export default Chat;
