import Header from "./components/Header";
import Servers from "./components/Servers";
import Chat from "./components/Chat";
import Users from "./components/Users";
import Channels from "./components/Channels";
import Menu from "./components/Menu";
import MessageInput from "./components/MessageInput";

import "./App.css";
import { useState } from "react";

function App() {
  const serversHardcoded = [
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
  ];
  const [servers, setServers] = useState(serversHardcoded);
  const [server, setServer] = useState(serversHardcoded[0].serverID); // TODO handle no servers (new user)
  const [serverName, setServerName] = useState(servers[server - 1].serverName);

  return (
    <>
      <div className="container">
        <Header />
        <Menu />
        <Servers
          servers={servers}
          server={server}
          setServer={setServer}
          setServerName={setServerName}
        />
        <Channels server={server} serverName={serverName} />
        <Chat />
        <Users />
        <MessageInput />
      </div>
    </>
  );
}

export default App;
