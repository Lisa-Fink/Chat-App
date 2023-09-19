import React, { useMemo } from "react";
import "../styles/Channels.css";
import {
  MdSettings,
  MdOutlineExpandMore,
  MdClose,
  MdCheck,
  MdCancel,
} from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setChannel } from "../redux/currentSlice";
import { fetchChannelsForServer } from "../redux/channelsSlice";
import { removeCurrentUserFromServer } from "../redux/usersSlice";
import { fetchMessagesForChannel } from "../redux/messagesSlice";

function Channels({ setShowServerSettingsModal }) {
  const dispatch = useDispatch();
  const { server, channel } = useSelector((state) => state.current);
  const { token, userID } = useSelector((state) => state.auth);
  const channels = useSelector((state) => state.channels.byServerID);
  const [curChannels, setCurChannels] = useState(
    channels && server && server.id in channels ? channels[server.id] : []
  );

  const [showServerDropdown, setShowServerDropdown] = useState(false);
  const [showLeaveServerConfirm, setShowLeaveServerConfirm] = useState(false);

  // When a server is selected clear menus and fetch channels
  useEffect(() => {
    setShowLeaveServerConfirm(false);
    setShowServerDropdown(false);
    if (server && server.id) {
      dispatch(
        fetchChannelsForServer({
          token: token,
          serverID: server.id,
        })
      );
    }
  }, [server]);

  // if channels[serverID] changes update the local channels list
  useEffect(() => {
    if (server && server.id && channels[server.id]) {
      setCurChannels(channels[server.id]);
      const firstChannel = channels[server.id][0];
      if (firstChannel) {
        dispatch(
          setChannel({
            id: firstChannel.channelID,
            name: firstChannel.channelName,
          })
        );
      } else {
        dispatch(setChannel({ id: null, name: null }));
      }
    }
  }, [channels[server.id]]);

  const handleChannelClick = (e) => {
    const newChannelID = e.currentTarget.dataset.id;
    const newChannelName = e.currentTarget.dataset.name;
    dispatch(setChannel({ id: newChannelID, name: newChannelName }));
  };

  const channelList = curChannels.map(({ channelID, channelName }) => (
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

  const handleServerSettingsClick = () => {
    setShowServerSettingsModal(true);
    setShowServerDropdown(false);
  };

  const handleConfirmLeave = () => {
    dispatch(
      removeCurrentUserFromServer({
        token: token,
        serverID: server.id,
        userID: userID,
      })
    );
    setShowServerDropdown(false);
    setShowLeaveServerConfirm(false);
  };

  const handleShowServerMenu = () => {
    setShowServerDropdown(!showServerDropdown);
    setShowLeaveServerConfirm(false);
  };

  return (
    <>
      <div className="channels thin-scroll">
        <div className="col-head">
          <h2>{server.name}</h2>
          {server.name && (
            <button onClick={handleShowServerMenu}>
              {!showServerDropdown ? <MdOutlineExpandMore /> : <MdClose />}
            </button>
          )}
        </div>
        <div className="channel-list-container">
          <ul>{channelList}</ul>
          {showServerDropdown && (
            <ul className="server-dropdown">
              {/* if the user is an admin+ show edit option */}
              {server.roleID <= 2 && (
                <li>
                  <button onClick={handleServerSettingsClick}>
                    Edit Server <MdSettings />
                  </button>
                </li>
              )}
              {/* leave server (creator can't leave) */}
              {server.roleID > 1 && (
                <li>
                  <button onClick={() => setShowLeaveServerConfirm(true)}>
                    Leave Server
                  </button>
                  {showLeaveServerConfirm && (
                    <div>
                      Confirm{" "}
                      <button onClick={handleConfirmLeave}>
                        <MdCheck />
                      </button>
                      <button onClick={() => setShowLeaveServerConfirm(false)}>
                        <MdCancel />
                      </button>
                    </div>
                  )}
                </li>
              )}
            </ul>
          )}
        </div>
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
