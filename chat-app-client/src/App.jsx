import Header from "./components/Header";
import Servers from "./components/Servers";
import Chat from "./components/Chat";
import Users from "./components/Users";
import Channels from "./components/Channels";
import Menu from "./components/Menu";
import MessageInput from "./components/MessageInput";
import Auth from "./components/Auth";

import "./App.css";
import { useState } from "react";
import { useSelector } from "react-redux";

function App() {
  const auth = useSelector((state) => state.auth);
  const [serverName, setServerName] = useState("lisa");
  return (
    <>
      <div className="container">
        {!auth.isAuthenticated ? (
          <Auth />
        ) : (
          <>
            <Header />
            <Menu />
            <Servers />
            <Channels />
            <Chat />
            <Users />
            <MessageInput />
          </>
        )}
      </div>
    </>
  );
}

export default App;
