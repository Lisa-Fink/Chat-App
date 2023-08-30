import Header from "./components/Header";
import Servers from "./components/Servers";
import Chat from "./components/Chat";
import Users from "./components/Users";
import Channels from "./components/Channels";

import "./App.css";

function App() {
  return (
    <>
      <Header />
      <div className="container">
        <Servers />
        <Channels />
        <Chat />
        <Users />
      </div>
    </>
  );
}

export default App;
