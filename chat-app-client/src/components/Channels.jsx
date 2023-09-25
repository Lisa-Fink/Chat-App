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
import {
  deleteChannelUpdate,
  editName,
  editRole,
  fetchChannelsForServer,
} from "../redux/channelsSlice";
import {
  addUserChannelUpdate,
  clearUserChannel,
  fetchUsersForChannel,
  removeCurrentUserFromServer,
  removeUserChannelUpdate,
  setUserChannel,
} from "../redux/usersSlice";
import AddChannelModal from "./modals/AddChannelModal";
import { deleteServer } from "../redux/serversSlice";
import {
  addMessageUpdate,
  addTyping,
  deleteMessageChannelUpdate,
  deleteMessageUpdate,
  editMessageUpdate,
  rmTyping,
} from "../redux/messagesSlice";

function Channels({ setShowServerSettingsModal, socket }) {
  const dispatch = useDispatch();
  const { server, channel } = useSelector((state) => state.current);
  const { token, userID } = useSelector((state) => state.auth);
  const channelData = useSelector((state) => state.channels);
  const channels = channelData.byServerID;
  const [curChannels, setCurChannels] = useState(
    channels && server && server.id in channels ? channels[server.id] : []
  );

  const [showServerDropdown, setShowServerDropdown] = useState(false);
  const [showLeaveServerConfirm, setShowLeaveServerConfirm] = useState(false);

  const [showAddChannelModal, setShowAddChannelModal] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useServerSelect(
    setCurChannels,
    server,
    setShowLeaveServerConfirm,
    setShowServerDropdown,
    dispatch,
    token
  );
  useChannelsChange(socket, channels, dispatch, channel, token, userID);
  useCurrentServerChannelsChange(
    server,
    channels,
    channel,
    setCurChannels,
    dispatch,
    channel,
    token,
    userID
  );

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

function useServerSelect(
  setCurChannels,
  server,
  setShowLeaveServerConfirm,
  setShowServerDropdown,
  dispatch,
  token
) {
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
}

function useChannelsChange(socket, channels, dispatch, channel, token, userID) {
  useEffect(() => {
    // subscribe to all channels
    for (const serverID in channels) {
      const channelArr = channels[serverID];
      for (const chan of channelArr) {
        // if not already subscribed, subscribe
        if (!(chan.channelID in socket.getChannelSubs())) {
          socket.addChannelSub(chan.channelID, handleChannelData);
        }
        // fetch users for channel
        dispatch(
          fetchUsersForChannel({
            token: token,
            serverID: chan.serverID,
            channelID: chan.channelID,
          })
        );
      }
    }
  }, [channels]);

  const handleChannelData = (res) => {
    const parsed = JSON.parse(res.body);
    const updateUserID = parsed.data.userID;
    if (updateUserID === userID) {
      // will be skipping updates from current user
      return;
    }
    const resType = parsed.type;
    if (resType === "MESSAGE_NEW") {
      // add the new message
      dispatch(addMessageUpdate({ message: parsed.data }));
    } else if (resType === "MESSAGE_EDIT") {
      const data = parsed.data;
      dispatch(editMessageUpdate(data));
    } else if (resType === "MESSAGE_DELETE") {
      dispatch(
        deleteMessageUpdate({
          messageID: parsed.data.messageID,
          channelID: parsed.data.channelID,
        })
      );
    } else if (resType === "CHANNEL_DELETE") {
      deleteChannel(parsed);
    } else if (resType === "TYPING") {
      if (parsed.data.status) {
        dispatch(addTyping(parsed.data));
      } else {
        dispatch(rmTyping(parsed.data));
      }
    } else if (resType === "ROLE_EDIT") {
      if (!parsed.data.userIDs.includes(userID)) {
        deleteChannel(parsed);
        return;
      }
      // update role
      dispatch(editRole(parsed.data));
      // update users
      dispatch(setUserChannel(parsed.data));
      if (parseInt(parsed.data.channelID) === parseInt(channel.id)) {
        // if cur channel changed, update it
        dispatch(
          setChannel({
            id: channel.id,
            name: channel.channelName,
            roleID: parsed.data.roleID,
          })
        );
      }
    } else if (resType === "NAME_EDIT") {
      dispatch(editName(parsed.data));
    } else if (resType === "USER_EDIT") {
      if (parsed.data.add) {
        // Adding a user
        dispatch(
          addUserChannelUpdate({
            channelID: parsed.data.channelID,
            userID: parsed.data.editUserID,
          })
        );
      } else {
        // Remove a user
        if (parseInt(parsed.data.editUserID) === parseInt(userID)) {
          // If the user to remove is this user, delete the channel and unsub
          deleteChannel(parsed);
        } else {
          // The user to remove is not this user, so just remove them from the list
          dispatch(
            removeUserChannelUpdate({
              channelID: parsed.data.channelID,
              userID: parsed.data.editUserID,
            })
          );
        }
      }
    }
  };

  const deleteChannel = (parsed) => {
    // remove the channel from channels
    dispatch(
      deleteChannelUpdate({
        channelID: parsed.data.channelID,
        serverID: parsed.data.serverID,
      })
    );
    // remove the channel from UserChannels
    dispatch(clearUserChannel({ channelID: parsed.data.channelID }));
    // remove the channel from message
    dispatch(deleteMessageChannelUpdate({ channelID: parsed.data.channelID }));
    socket.removeChannelSub(parsed.data.channelID);
  };
}

function useCurrentServerChannelsChange(
  server,
  channels,
  channel,
  setCurChannels,
  dispatch
) {
  // if channels[serverID] changes update the local channels list
  useEffect(() => {
    if (server && server.id && channels[server.id]) {
      setCurChannels(channels[server.id]);
      // if the changed channel is the current channel, update it
      if (channel && channel.name) {
        const curChannel = channels[server.id].find(
          (chan) => chan.channelID == channel.id
        );
        if (curChannel && curChannel.channelName !== channel.name) {
          dispatch(
            setChannel({
              id: curChannel.channelID,
              name: curChannel.channelName,
              roleID: curChannel.roleID,
            })
          );
        }
      }

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
}
