import Header from "./components/Header";
import Servers from "./components/Servers";
import Chat from "./components/Chat";
import Users from "./components/Users";
import Channels from "./components/Channels";
import Menu from "./components/Menu";
import MessageInput from "./components/MessageInput";
import Auth from "./components/Auth";

import "./App.css";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addChannelUpdate } from "./redux/channelsSlice";
import WebSocketManager from "./WebSocketManager";
import { fetchEmojis } from "./redux/emojiSlice";

function App() {
  const auth = useSelector((state) => state.auth);
  const [showSeverSettingsModal, setShowServerSettingsModal] = useState(false);
  const dispatch = useDispatch();

  const handleUserData = (res) => {
    const parsed = JSON.parse(res.body);
    const resType = parsed.type;
    if (resType === "CHANNEL_NEW") {
      // user has a new channel
      dispatch(addChannelUpdate({ channel: parsed.data }));
    }
  };

  const socket = useRef(new WebSocketManager());
  useEffect(() => {
    if (auth.isAuthenticated && !socket.current.isActive()) {
      socket.current.activate(auth.userID, handleUserData, auth.token);
      dispatch(fetchEmojis({ token: auth.token }));
    }
    if (!auth.isAuthenticated && socket.current.isActive()) {
      socket.current.deactivate();
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
              socket={socket}
            />
            <Channels
              showSeverSettingsModal={showSeverSettingsModal}
              setShowServerSettingsModal={setShowServerSettingsModal}
              socket={socket}
            />
            <Chat />
            <Users />
            <MessageInput socket={socket} />
          </>
        )}
      </div>
    </>
  );
}

export default App;
