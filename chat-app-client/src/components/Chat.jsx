import React, { useEffect, useState } from "react";
import "../styles/Chat.css";
import { useSelector, useDispatch } from "react-redux";

function Chat() {
  const dispatch = useDispatch();
  const { channel } = useSelector((state) => state.current);
  const messages = useSelector((state) => state.messages);

  const [curMessages, setCurMessages] = useState(
    channel.id in messages ? messages[channel.id] : []
  );
  useEffect(() => {
    setCurMessages(channel.id in messages ? messages[channel.id] : []);
  }, [channel]);

  const users = {
    1: {
      username: "user1",
      userImageUrl: "./images/cat1.jpg",
      roleID: 1,
    },
    2: {
      username: "user2",
      userImageUrl: "./images/cat-drawing.jpg",
      roleID: 4,
    },
    3: {
      username: "user3",
      userImageUrl: "./images/lisa.jpg",
      roleID: 4,
    },
    4: {
      username: "user4",
      userImageUrl: "./images/cat2.jpg",
      roleID: 4,
    },
    5: {
      username: "user5",
      userImageUrl: "./images/dog1.jpg",
      roleID: 4,
    },
  };

  const messageList = curMessages.map((message) => {
    return (
      <li className="message" key={message.messageID}>
        <img
          className="message-thumbnail"
          src={users[message.userID].userImageUrl}
        />
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
