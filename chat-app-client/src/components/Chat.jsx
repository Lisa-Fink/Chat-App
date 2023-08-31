import React from "react";
import "../styles/Chat.css";
import MessageInput from "./MessageInput";

function Chat() {
  const channelName = "# General";

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

  const messages = [
    {
      messageID: 1,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      time: "2023-08-30T10:00:00Z",
      userID: 1,
      channelID: 1,
      edited: false,
      reactions: null,
      attachments: null,
    },
    {
      messageID: 2,
      text: "Vivamus ac libero ut dui convallis aliquam.",
      time: "2023-08-30T10:15:00Z",
      userID: 2,
      channelID: 1,
      edited: true,
      reactions: ["thumbs-up", "heart"],
      attachments: null,
    },
    {
      messageID: 3,
      text: "Praesent eget felis eu enim cursus varius.",
      time: "2023-08-30T10:30:00Z",
      userID: 3,
      channelID: 1,
      edited: false,
      reactions: null,
      attachments: null,
    },
    {
      messageID: 4,
      text: "In ultricies quam at sapien tincidunt, nec lacinia nulla laoreet.",
      time: "2023-08-30T10:45:00Z",
      userID: 4,
      channelID: 1,
      edited: false,
      reactions: null,
      attachments: null,
    },
    {
      messageID: 5,
      text: "Aliquam erat volutpat. Nullam eu nunc quis felis finibus finibus in id urna.",
      time: "2023-08-30T11:00:00Z",
      userID: 5,
      channelID: 1,
      edited: false,
      reactions: null,
      attachments: null,
    },
    {
      messageID: 6,
      text: "Proin eget nunc nec arcu varius ullamcorper.",
      time: "2023-08-30T11:15:00Z",
      userID: 1,
      channelID: 1,
      edited: false,
      reactions: null,
      attachments: null,
    },
    {
      messageID: 7,
      text: "Nunc ac dui facilisis, pellentesque odio vel, tincidunt ligula.",
      time: "2023-08-30T11:30:00Z",
      userID: 2,
      channelID: 1,
      edited: true,
      reactions: ["thumbs-up"],
      attachments: null,
    },
    {
      messageID: 8,
      text: "Fusce gravida lorem vel ligula bibendum interdum.",
      time: "2023-08-30T11:45:00Z",
      userID: 3,
      channelID: 1,
      edited: false,
      reactions: null,
      attachments: null,
    },
    {
      messageID: 9,
      text: "Suspendisse ac ex in nunc vestibulum auctor ac sit amet sapien.",
      time: "2023-08-30T12:00:00Z",
      userID: 4,
      channelID: 1,
      edited: false,
      reactions: null,
      attachments: null,
    },
    {
      messageID: 10,
      text: "Duis nec ante ut neque pellentesque tempor.",
      time: "2023-08-30T12:15:00Z",
      userID: 5,
      channelID: 1,
      edited: false,
      reactions: null,
      attachments: null,
    },
    {
      messageID: 11,
      text: "Vestibulum efficitur leo non quam congue bibendum.",
      time: "2023-08-30T12:30:00Z",
      userID: 1,
      channelID: 1,
      edited: false,
      reactions: null,
      attachments: null,
    },
    {
      messageID: 12,
      text: "Aenean at ligula quis neque tristique ullamcorper.",
      time: "2023-08-30T12:45:00Z",
      userID: 2,
      channelID: 1,
      edited: false,
      reactions: null,
      attachments: null,
    },
    {
      messageID: 13,
      text: "Phasellus dignissim neque non nisl cursus, ac tincidunt elit lacinia.",
      time: "2023-08-30T13:00:00Z",
      userID: 3,
      channelID: 1,
      edited: false,
      reactions: null,
      attachments: null,
    },
    {
      messageID: 14,
      text: "Ut sit amet nulla eu nulla consectetur venenatis.",
      time: "2023-08-30T13:15:00Z",
      userID: 4,
      channelID: 1,
      edited: false,
      reactions: null,
      attachments: null,
    },
    {
      messageID: 15,
      text: "Maecenas nec nunc non quam gravida tristique.",
      time: "2023-08-30T13:30:00Z",
      userID: 5,
      channelID: 1,
      edited: false,
      reactions: null,
      attachments: null,
    },
  ];

  const messageList = messages.map((message) => {
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
