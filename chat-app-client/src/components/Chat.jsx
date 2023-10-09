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
import { readChannelMsg } from "../redux/channelsSlice";

function Chat({ socket }) {
  const dispatch = useDispatch();
  const current = useSelector((state) => state.current);
  const serverID = current.server;
  const channelID = current.channel;
  const channel = useSelector(
    (state) =>
      state.channels.byServerID[serverID] &&
      state.channels.byServerID[serverID].find(
        (chan) => parseInt(chan.channelID) === parseInt(channelID)
      )
  );
  const server = useSelector(
    (state) =>
      state.servers.data &&
      state.servers.data.find(
        (ser) => parseInt(ser.serverID) === parseInt(serverID)
      )
  );
  const { token, userID } = useSelector((state) => state.auth);
  const messages = useSelector((state) => state.messages.byChannelID);
  const messagesStatus = useSelector((state) => state.messages.status);
  const channels = useSelector((state) => state.channels.byServerID);

  const usersStatus = useSelector((state) => state.users.status);
  const users = useSelector((state) => state.users.dataByID);
  const usersInChannel = useSelector((state) => state.users.byChannelID);
  const emojis = useSelector((state) => state.emojis.emojis);

  const [curMessages, setCurMessages] = useState(
    channelID in messages ? messages[channelID] : []
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

  const hasUnread = useRef(null);
  const curChanUserTime = useRef(null);

  const scroll = useScrollToNewMessage(
    chatRef,
    curMessages,
    curChanUserTime.current
  );

  useUpdateMessages(
    scroll,
    channel,
    channelID,
    serverID,
    dispatch,
    token,
    hasUnread,
    curChanUserTime,
    channels,
    messages,
    setCurMessages
  );

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
          serverID: channel.serverID,
          channelID: channel.channelID,
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
        serverID: channel.serverID,
        channelID: channel.channelID,
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
        channelID: channel.channelID,
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
              channelID: channel.channelID,
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
            channelID: channel.channelID,
            reactionID: userReact[1],
          })
        );
    } else
      dispatch(
        addReaction({
          token: token,
          emojiID: emojiID,
          messageID: messageID,
          channelID: channel.channelID,
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
      <div className="confirm-del">
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
      !usersInChannel[channelID] ||
      !usersInChannel[channelID].includes(message.userID);
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

  const setScrollTop = useReadLastViewed(
    hasUnread,
    curMessages,
    chatRef,
    server,
    channel,
    dispatch,
    token
  );
  const lastScrollTime = useRef(null);
  const handleChatScroll = () => {
    lastScrollTime.current = Date.now();
    setTimeout(() => {
      if (Date.now() - lastScrollTime.current >= 490) {
        setScrollTop(true);
      }
    }, 500);
  };

  return (
    <div className="chat-container">
      <div className="chat" ref={chatRef} onScroll={handleChatScroll}>
        {serverID !== null &&
          channelID !== null &&
          messagesStatus !== "failed" &&
          usersStatus === "succeeded" && (
            <ul className="message-list">{messageList}</ul>
          )}
      </div>
      <MessageInput socket={socket} scroll={scroll} />
    </div>
  );
}

const useScrollToNewMessage = (chatRef, curMessages, time) => {
  const [scroll, setScroll] = useState(true);
  useLayoutEffect(() => {
    // Always scroll to the channel with the same or prev time
    if (
      scroll &&
      chatRef.current &&
      chatRef.current.firstChild &&
      chatRef.current.firstChild.firstChild
    ) {
      let lastMessage;
      const messageList = chatRef.current.firstChild.children;

      let i = 0;
      const dateTime = new Date(time).getTime();
      while (i < messageList.length) {
        const messageTime = new Date(curMessages[i].time).getTime();
        if (messageTime === dateTime) {
          lastMessage = messageList[i];
          break;
        }
        if (messageTime > dateTime) {
          lastMessage = messageList[Math.max(i - 1, 0)];
          break;
        }
        i++;
      }
      if (lastMessage) {
        lastMessage.scrollIntoView({ block: "end" });
      }
      setScroll(false);
    }
  }, [curMessages]);
  return () => setScroll(true);
};

const useReadLastViewed = (
  hasUnread,
  curMessages,
  chatRef,
  server,
  channel,
  dispatch,
  token
) => {
  const [scrollTop, setScrollTop] = useState(null);

  useEffect(() => {
    setScrollTop(true);
  }, [curMessages]);
  useEffect(() => {
    if (scrollTop !== true) return;

    setScrollTop(false);
    if (!hasUnread.current) return;
    if (curMessages && curMessages.length) {
      const list = chatRef.current.firstChild.childNodes;
      const chatRect = chatRef.current.getBoundingClientRect();
      const inView = (li) => {
        const listRect = li.getBoundingClientRect();
        return (
          listRect.bottom > chatRect.top &&
          listRect.top < chatRect.bottom &&
          listRect.bottom <= chatRect.bottom - 20 &&
          listRect.top >= chatRect.top - 20
        );
      };
      // find the last viewable li
      const getLastMsgIdx = () => {
        let start = false;
        let i = 0;
        while (i < list.length) {
          if (inView(list[i])) {
            start = true;
          } else if (start) {
            return i;
          }
          i++;
        }
        return list.length - 1;
      };
      const readIdx = getLastMsgIdx();
      const lastReadMsg = curMessages[readIdx];
      // set the last read time for this channel to be the lastReadMsg time
      dispatch(
        readChannelMsg({
          token: token,
          serverID: channel.serverID,
          channelID: channel.channelID,
          msgTime: lastReadMsg.time,
          isLast: readIdx === curMessages.length - 1,
        })
      );
    }
  }, [scrollTop]);
  return setScrollTop;
};

const useUpdateMessages = (
  scroll,
  channel,
  channelID,
  serverID,
  dispatch,
  token,
  hasUnread,
  curChanUserTime,
  channels,
  messages,
  setCurMessages
) => {
  const updateCur = () => {
    if (channel) {
      hasUnread.current = channel.hasUnread;
      curChanUserTime.current = channel.userRead;
    }
  };
  // if the channel changes, fetch the messages for the new channel
  useEffect(() => {
    scroll();
    if (serverID && channelID) {
      dispatch(
        fetchMessagesForChannel({
          token: token,
          serverID: serverID,
          channelID: channelID,
        })
      );
      updateCur();
    } else {
      setCurMessages([]);
    }
  }, [channelID]);
  useEffect(() => {
    if (serverID && channelID && channels && channels[serverID]) {
      updateCur();
    }
  }, [channels[serverID]]);

  // After the messages for the channel are fetched/added to, update the local state
  useEffect(() => {
    if (!channelID || !messages[channelID]) return;
    setCurMessages(messages[channelID]);
    updateCur();
  }, [messages[channelID]]);
};
export default Chat;
