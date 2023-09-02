import React, { useEffect, useState } from "react";
import "../styles/Chat.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchMessagesForChannel } from "../redux/messagesSlice";
import { fetchUsersForChannel } from "../redux/usersSlice";

function Chat() {
  const dispatch = useDispatch();
  const { channel, server } = useSelector((state) => state.current);
  const token = useSelector((state) => state.auth.token);
  const messages = useSelector((state) => state.messages.byChannelID);
  const messagesStatus = useSelector((state) => state.messages.status);
  const usersStatus = useSelector((state) => state.users.status);
  const users = useSelector((state) => state.users.dataByID);

  const [curMessages, setCurMessages] = useState(
    channel.id in messages ? messages[channel.id] : []
  );
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
  }, [channel]);

  useEffect(() => {
    if (messagesStatus === "succeeded" && usersStatus === "succeeded") {
      setCurMessages(messages[channel.id]);
    }
  }, [messagesStatus, usersStatus]);

  const messageList = curMessages.map((message) => {
    return (
      <li className="message" key={message.messageID}>
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
          <ul>{message.text}</ul>
        </div>
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
