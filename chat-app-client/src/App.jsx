import Header from "./components/Header";
import Servers from "./components/Servers";
import Chat from "./components/Chat";
import Users from "./components/Users";
import Channels from "./components/Channels";
import Menu from "./components/Menu";
import MessageInput from "./components/MessageInput";
import Auth from "./components/Auth";
import { Stomp } from "@stomp/stompjs";

import "./App.css";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

function App() {
  const auth = useSelector((state) => state.auth);
  const [showSeverSettingsModal, setShowServerSettingsModal] = useState(false);
  const stomp = useRef(null);

  const connect = () => {
    const url = "ws://localhost:8080/ws";
    const client = Stomp.client(url);
    client.connect(null, null);
    stomp.current = client;
  };

  useEffect(() => {
    if (auth.isAuthenticated && !stomp.current) {
      connect();
    }
    if (!auth.isAuthenticated && stomp.current) {
      stomp.current.deactivate();
      stomp.current = null;
    }
  }, [auth]);

  return (
    <>
      <div className="container">
        {!auth.isAuthenticated ? (
          <Auth />
        ) : (
          <>
            <Header />
            <Menu />
            <Servers
              showSeverSettingsModal={showSeverSettingsModal}
              setShowServerSettingsModal={setShowServerSettingsModal}
            />
            <Channels
              showSeverSettingsModal={showSeverSettingsModal}
              setShowServerSettingsModal={setShowServerSettingsModal}
              stomp={stomp}
            />
            <Chat />
            <Users />
            <MessageInput stomp={stomp} />
          </>
        )}
      </div>
    </>
  );
}

export default App;
