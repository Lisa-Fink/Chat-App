import React from "react";
import "../styles/Channels.css";
import { MdSettings } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";

function Channels() {
  const serverName = "Lisa Chat";
  const channels = [
    {
      channelID: 1,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "General",
    },
    {
      channelID: 2,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Cat Pics",
    },
    {
      channelID: 3,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Leetcode",
    },
    {
      channelID: 4,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Random",
    },
    {
      channelID: 5,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Tech Talk",
    },
    {
      channelID: 6,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Funny Memes",
    },
    {
      channelID: 7,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Music",
    },
    {
      channelID: 8,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Movies",
    },
    {
      channelID: 9,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Books",
    },
    {
      channelID: 10,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Food",
    },
    {
      channelID: 11,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Gaming",
    },
    {
      channelID: 12,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Travel",
    },
    {
      channelID: 13,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Fitness",
    },
    {
      channelID: 14,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Art",
    },
    {
      channelID: 15,
      serverID: 1,
      roleID: 4,
      channelTypeID: 1,
      channelName: "Science",
    },
  ];

  const channelList = channels.map((channel) => {
    return <li key={channel.channelID}># {channel.channelName}</li>;
  });

  return (
    <>
      <div className="channels thin-scroll">
        <div className="col-head">
          <h2>{serverName}</h2>
        </div>
        <ul>{channelList}</ul>
      </div>
      <div className="server-menu">
        <div>
          <AiOutlinePlusCircle />
        </div>
        <div>
          <MdSettings />
        </div>
      </div>
    </>
  );
}

export default Channels;