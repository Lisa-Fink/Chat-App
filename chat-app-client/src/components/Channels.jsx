import React, { useMemo } from "react";
import "../styles/Channels.css";
import { MdSettings } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setChannel } from "../redux/currentSlice";
import { fetchChannelsForServer } from "../redux/channelsSlice";

function Channels() {
  const dispatch = useDispatch();
  const { server } = useSelector((state) => state.current);
  const channels = useSelector((state) => state.channels.byServerID);
  const channelsStatus = useSelector((state) => state.channels.status);
  const [curChannels, setCurChannels] = useState(
    server.id in channels ? channels[server.id] : []
  );

  // When a server is selected, gets the channels for the server
  useEffect(() => {
    // curChannels to store all channels in the current server
    if (server && server.id) {
      const token = import.meta.env.VITE_TOKEN;
      dispatch(fetchChannelsForServer({ token: token, serverID: server.id }));
    }
  }, [server]);

  // After the channels are fetched, updates curChannels and current channel
  useEffect(() => {
    if (channelsStatus === "succeeded") {
      setCurChannels(channels[server.id]);
      const firstChannel = channels[server.id][0];
      dispatch(
        setChannel({
          id: firstChannel.channelID,
          name: firstChannel.channelName,
        })
      );
    }
  }, [channelsStatus]);

  const handleChannelClick = (e) => {
    const newChannelID = e.currentTarget.dataset.id;
    const newChannelName = e.currentTarget.dataset.name;
    dispatch(setChannel({ id: newChannelID, name: newChannelName }));
  };

  // will only rerender channel list if curChannels changes
  const channelList = useMemo(() => {
    return curChannels.map(({ channelID, channelName }) => (
      <li key={channelID}>
        <button
          data-id={channelID}
          data-name={channelName}
          onClick={handleChannelClick}
        >
          # {channelName}
        </button>
      </li>
    ));
  }, [curChannels]);

  return (
    <>
      <div className="channels thin-scroll">
        <div className="col-head">
          <h2>{server.name}</h2>
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
