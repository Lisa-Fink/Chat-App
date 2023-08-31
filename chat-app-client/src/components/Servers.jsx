import React from "react";
import "../styles/Servers.css";
function Servers() {
  const servers = [
    {
      serverID: 1,
      serverName: "Lisa's Chat",
      serverDescription: "Test 1",
      serverImageUrl: null,
    },
    {
      serverID: 2,
      serverName: "The Hangout",
      serverDescription: "Hangout for friends",
      serverImageUrl: "./images/cat2.jpg",
    },
    {
      serverID: 3,
      serverName: "Magic The Gathering Players",
      serverDescription: "A Server for Magic",
      serverImageUrl: null,
    },
    {
      serverID: 1,
      serverName: "Lisa's Chat",
      serverDescription: "Test 1",
      serverImageUrl: null,
    },
    {
      serverID: 2,
      serverName: "The Hangout",
      serverDescription: "Hangout for friends",
      serverImageUrl: "./images/cat2.jpg",
    },
    {
      serverID: 3,
      serverName: "Magic The Gathering Players",
      serverDescription: "A Server for Magic",
      serverImageUrl: null,
    },
    {
      serverID: 3,
      serverName: "Magic The Gathering Players",
      serverDescription: "A Server for Magic",
      serverImageUrl: null,
    },
  ];

  const thumbnails = servers.map((server) => {
    return (
      <li key={server.serverID}>
        {server.serverImageUrl !== null ? (
          <img className="server-thumbnail" src={server.serverImageUrl} />
        ) : (
          <div className="letter-thumbnail">
            {server.serverName.substring(0, 1)}
          </div>
        )}
      </li>
    );
  });

  return (
    <div className="servers">
      {thumbnails}
      <div className="add-thumbnail">+</div>
    </div>
  );
}

export default Servers;
