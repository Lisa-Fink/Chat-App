import Header from "./components/Header";
import Servers from "./components/Servers";
import Chat from "./components/Chat";
import Users from "./components/Users";
import Channels from "./components/Channels";
import Menu from "./components/Menu";
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
  const [wsConnect, setWsConnect] = useState(false);
  const { authorized, unAuthorize } = useAuthorized(auth, wsConnect);
  const dispatch = useDispatch();

  const socket = useRef(new WebSocketManager(wsConnect, setWsConnect));

  const handleUserData = (res) => {
    const parsed = JSON.parse(res.body);
    const resType = parsed.type;
    if (resType === "CHANNEL_NEW") {
      // user has a new channel
      dispatch(addChannelUpdate({ channel: parsed.data }));
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated && !wsConnect) {
      socket.current.activate(handleUserData, auth.token);
      dispatch(fetchEmojis({ token: auth.token }));
    }
    if (!auth.isAuthenticated && wsConnect) {
      socket.current.deactivate();
    }
  }, [auth, wsConnect]);

  return (
    <>
      <div className="container">
        {!authorized ? (
          <Auth />
        ) : (
          <>
            <Header unAuthorize={unAuthorize} />
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
            <Chat socket={socket} />
            <Users />
          </>
        )}
      </div>
    </>
  );
}

const useAuthorized = (auth, wsConnect) => {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated && wsConnect && !authorized) setAuthorized(true);
    if ((!auth.isAuthenticated || !wsConnect) && authorized)
      setAuthorized(false);
  }, [auth, wsConnect]);

  return { authorized, unAuthorize: () => setAuthorized(false) };
};

export default App;
