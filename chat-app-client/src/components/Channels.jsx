import React from "react";
import "../styles/Channels.css";
import { MdSettings } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setChannel } from "../redux/currentSlice";

function Channels() {
  const dispatch = useDispatch();
  const { server } = useSelector((state) => state.current);
  const channels = useSelector((state) => state.channels);
  const [curChannels, setCurChannels] = useState(
    server.id in channels ? channels[server.id] : []
  );

  useEffect(() => {
    // curChannels to store all channels in the current server
    if (server.id in channels) {
      setCurChannels(channels[server.id]);
      // current.channel updated to first channel in the list of channels
      const firstChannel = channels[server.id][0];
      dispatch(
        setChannel({
          id: firstChannel.channelID,
          name: firstChannel.channelName,
        })
      );
    } else {
      setCurChannels([]);
      dispatch(setChannel({ id: 0, name: "None" }));
    }
  }, [server]);

  const handleChannelClick = (e) => {
    const newChannelID = e.currentTarget.dataset.id;
    const newChannelName = e.currentTarget.dataset.name;
    dispatch(setChannel({ id: newChannelID, name: newChannelName }));
  };

  const channelList = curChannels.map((channel) => {
    return (
      <li key={channel.channelID}>
        <button
          data-id={channel.channelID}
          data-name={channel.channelName}
          onClick={handleChannelClick}
        >
          # {channel.channelName}
        </button>
      </li>
    );
  });

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
