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
import EmojiMenu from "./EmojiMenu";
import MessageInput from "./MessageInput";

function Chat({ socket }) {
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
  const [showReactionDetails, setShowReactionDetails] = useState(null);

  const chatRef = useRef();
  const closeEmojisOnClick = () => {
    if (showEmojiMenu) {
      setShowEmojiMenu(null);
    }
  };

  const scroll = scrollToNewMessage(chatRef, curMessages);
  // if the channel changes, fetch the messages for the new channel
  useEffect(() => {
    scroll();
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

  const handleEditClick = (id, text) => {
    setEditID(id);
    setEditText(text);
    originalText.current = text;
  };

  const handleEditConfirm = () => {
    if (editText !== originalText.current && editText.trim()) {
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
    // scroll if last message
    const lastMessageID = curMessages[curMessages.length - 1].messageID;
    if (lastMessageID === messageID) scroll();
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

  const handleEmojiClick = (e, reactionList, emojiID, messageID) => {
    const userReact = reactionList.find(
      (react) => parseInt(react[0]) === userID
    );
    if (userReact) {
      if (reactionList.length === 1) {
        e.target.disabled = true;
        e.target.classList.remove("in");
        e.target.classList.add("out");
        e.target.nextSibling.style.display = "none";
        setTimeout(() => {
          dispatch(
            removeReaction({
              token: token,
              emojiID: emojiID,
              messageID: messageID,
              channelID: channel.id,
              reactionID: userReact[1],
            })
          );
        }, 300);
      } else
        dispatch(
          removeReaction({
            token: token,
            emojiID: emojiID,
            messageID: messageID,
            channelID: channel.id,
            reactionID: userReact[1],
          })
        );
    } else
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

  const reactionString = (reactionList) => {
    const maxNames = 3;
    const numReactions = reactionList.length;
    const sliceList = reactionList
      .map((data) =>
        users[data[0]] ? users[data[0]].username : "unknown user"
      )
      .slice(0, maxNames);

    if (numReactions === 1) {
      return sliceList;
    }
    if (numReactions === 2) {
      return sliceList.join(" and ");
    }
    if (numReactions === 3) {
      return `${sliceList[0]}, ${sliceList[1]}, and ${sliceList[2]}`;
    }
    const overMax = numReactions - maxNames;
    return `${sliceList.join(", ")} and ${overMax} ${
      overMax === 1 ? "user" : "users"
    }`;
  };

  const reactionDetailsDiv = (reactionList, emojiCode, emojiName) => {
    if (!reactionList || reactionList.length == 0) return;

    const div = (
      <div className="reaction-details">
        <div>
          <span className="emoji-code">{emojiCode}</span>
          <span className="emoji-name">{emojiName}</span>
        </div>{" "}
        reacted by {reactionString(reactionList)}
      </div>
    );
    return div;
  };

  const reactions = (reactionMap, messageID) => {
    if (!reactionMap) return;
    const keys = Object.keys(reactionMap);
    return keys.map((emojiID) => {
      const { emojiCode, emojiName } = getEmoji(emojiID);
      if (emojiCode) {
        return (
          <span className="reaction-span" key={`${emojiCode}-${messageID}`}>
            <button
              className="active-btn message-btn reaction-btn in"
              onClick={(e) =>
                handleEmojiClick(e, reactionMap[emojiID], emojiID, messageID)
              }
              onMouseEnter={() => {
                setShowReactionDetails(`${emojiCode}-${messageID}`);
              }}
              onMouseLeave={() => {
                setShowReactionDetails(null);
              }}
            >
              {emojiCode} {reactionMap[emojiID].length}
            </button>
            {showReactionDetails === `${emojiCode}-${messageID}` &&
              reactionDetailsDiv(reactionMap[emojiID], emojiCode, emojiName)}
          </span>
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
      <div className="reaction-row">
        {reactions(message.reactions, message.messageID)}
      </div>
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

  const getEmoji = (emojiId) => {
    const found = emojis.find(
      (em) => parseInt(em.emojiID) === parseInt(emojiId)
    );
    if (found) return found;
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
    <div className="chat-container" ref={chatRef}>
      <div className="chat">
        {server.id !== null &&
          channel.id !== null &&
          messagesStatus !== "failed" &&
          usersStatus === "succeeded" && (
            <ul className="message-list">{messageList}</ul>
          )}
      </div>
      <MessageInput socket={socket} scroll={scroll} />
    </div>
  );
}

const scrollToNewMessage = (chatRef, curMessages) => {
  const [scroll, setScroll] = useState(true);
  useLayoutEffect(() => {
    // Always scroll to the bottom of the chat container
    if (
      scroll &&
      chatRef.current &&
      chatRef.current.firstChild &&
      chatRef.current.firstChild.lastChild &&
      chatRef.current.firstChild.lastChild.lastChild
    ) {
      const lastMessage = chatRef.current.firstChild.lastChild.lastChild;
      if (lastMessage) {
        lastMessage.scrollIntoView();
      }
      setScroll(false);
    }
  }, [curMessages]);
  return () => setScroll(true);
};
export default Chat;
