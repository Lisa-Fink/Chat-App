import Header from "./components/Header";
import Servers from "./components/Servers";
import Chat from "./components/Chat";
import Users from "./components/Users";
import Channels from "./components/Channels";
import Menu from "./components/Menu";
import MessageInput from "./components/MessageInput";

import "./App.css";

function App() {
  return (
    <>
      <div className="container">
        <Header />
        <Menu />
        <Servers />
        <Channels />
        <Chat />
        <Users />
        <MessageInput />
      </div>
    </>
  );
}

export default App;
