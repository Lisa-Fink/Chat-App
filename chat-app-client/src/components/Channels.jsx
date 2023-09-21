import React from "react";
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
import { setChannel, setServer } from "../redux/currentSlice";
import { fetchChannelsForServer } from "../redux/channelsSlice";
import { removeCurrentUserFromServer } from "../redux/usersSlice";
import AddChannelModal from "./modals/AddChannelModal";
import { deleteServer } from "../redux/serversSlice";

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

  const [showAddChannelModal, setShowAddChannelModal] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    } else {
      setCurChannels([]);
    }
  }, [server]);

  // if channels[serverID] changes update the local channels list
  useEffect(() => {
    if (server && server.id && channels[server.id]) {
      setCurChannels(channels[server.id]);
      // if the current channel is in the server continue, otherwise select the first channel
      if (
        channel.id &&
        channels[server.id].find(
          (chan) => parseInt(chan.channelID) === parseInt(channel.id)
        )
      ) {
        return;
      }
      const firstChannel = channels[server.id][0];
      if (firstChannel) {
        dispatch(
          setChannel({
            id: firstChannel.channelID,
            name: firstChannel.channelName,
            roleID: firstChannel.roleID,
          })
        );
      } else {
        dispatch(setChannel({ id: null, name: null, roleID: null }));
      }
    }
  }, [channels[server.id]]);

  const handleChannelClick = (e) => {
    const newChannelID = e.currentTarget.dataset.id;
    const newChannelName = e.currentTarget.dataset.name;
    const newChannelRoleID = e.currentTarget.dataset.roleid;
    dispatch(
      setChannel({
        id: newChannelID,
        name: newChannelName,
        roleID: newChannelRoleID,
      })
    );
  };

  const handleAddChannelClick = () => {
    setShowAddChannelModal(true);
  };

  const channelList = curChannels.map(({ channelID, channelName, roleID }) => (
    <li key={channelID}>
      <button
        data-id={channelID}
        data-name={channelName}
        data-roleid={roleID}
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

  const handleConfirmDelete = () => {
    dispatch(deleteServer({ token: token, serverID: server.id }));
    dispatch(setServer({ id: null, name: null }));
    dispatch(setChannel({ id: null, name: null, roleID: null }));
    setShowDeleteConfirm(false);
    setShowServerDropdown(false);
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
              {/* can delete if creator otherwise can
               leave server (creator can't leave) */}
              {server.roleID === 1 ? (
                <li>
                  <button onClick={() => setShowDeleteConfirm(true)}>
                    Delete Server
                  </button>
                  {showDeleteConfirm && (
                    <div>
                      Confirm
                      <button onClick={handleConfirmDelete}>
                        <MdCheck />
                      </button>
                      <button onClick={() => setShowDeleteConfirm(false)}>
                        <MdCancel />
                      </button>
                    </div>
                  )}
                </li>
              ) : (
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
          <button onClick={handleAddChannelClick}>
            <AiOutlinePlusCircle />
          </button>
        </div>
        <div>
          <MdSettings />
        </div>
      </div>
      {showAddChannelModal && (
        <AddChannelModal closeModal={() => setShowAddChannelModal(false)} />
      )}
    </>
  );
}

export default Channels;
