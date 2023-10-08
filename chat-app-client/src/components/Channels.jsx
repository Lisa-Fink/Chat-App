import React from "react";
import "../styles/Channels.css";
import {
  MdSettings,
  MdOutlineExpandMore,
  MdClose,
  MdCheck,
  MdCheckCircleOutline,
  MdCancel,
  MdOutlineContentCopy,
} from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setChannel, setServer } from "../redux/currentSlice";
import {
  channelHasNewMessage,
  channelSuccess,
  deleteChannelUpdate,
  editName,
  editRole,
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
import { deleteServer, updateServerRead } from "../redux/serversSlice";
import {
  addMessageUpdate,
  addReactionUpdate,
  addTyping,
  deleteMessageChannelUpdate,
  deleteMessageUpdate,
  editMessageUpdate,
  removeReactionUpdate,
  rmTyping,
} from "../redux/messagesSlice";

function Channels({ setShowServerSettingsModal, socket }) {
  const dispatch = useDispatch();
  const { server, channel } = useSelector((state) => state.current);
  const { token, userID } = useSelector((state) => state.auth);
  const channels = useSelector((state) => state.channels.byServerID);
  const { status, newIDs } = useSelector((state) => state.channels);
  const [curChannels, setCurChannels] = useState(
    channels && server && server.serverID in channels
      ? channels[server.serverID]
      : []
  );

  const [showServerDropdown, setShowServerDropdown] = useState(false);
  const [showLeaveServerConfirm, setShowLeaveServerConfirm] = useState(false);

  const [showAddChannelModal, setShowAddChannelModal] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const codeRef = useRef(null);
  const [codeStatus, setCodeStatus] = useCodeStatus(codeRef);

  useServerSelect(
    setCurChannels,
    server,
    setShowLeaveServerConfirm,
    setShowServerDropdown,
    dispatch,
    token
  );
  useChannelsChange(socket, channels, dispatch, status, newIDs, token, userID);
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
    dispatch(
      setChannel(
        curChannels.find(
          (chan) => parseInt(chan.channelID) === parseInt(newChannelID)
        )
      )
    );
  };

  const handleAddChannelClick = () => {
    setShowAddChannelModal(true);
  };

  const handleServerSettingsClick = () => {
    setShowServerSettingsModal(true);
    setShowServerDropdown(false);
  };

  const handleConfirmLeave = () => {
    dispatch(
      removeCurrentUserFromServer({
        token: token,
        serverID: server.serverID,
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
    dispatch(deleteServer({ token: token, serverID: server.serverID }));
    dispatch(setServer(null));
    dispatch(setChannel(null));
    setShowDeleteConfirm(false);
    setShowServerDropdown(false);
  };

  const handleInviteClick = async () => {
    const apiUrl = import.meta.env.VITE_CHAT_API;
    const url = `${apiUrl}/invites`;

    const reqBody = { serverID: server.serverID };
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });
      if (res.ok) {
        const data = await res.text();
        handleInviteData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInviteData = (data) => {
    navigator.clipboard.writeText(data).then(
      () => {
        setCodeStatus(`Copied invite code ${data} to clipboard!`);
      },
      (err) => {
        console.error("Failed to copy invite code: ", err);
      }
    );
  };

  const channelList = curChannels.map(
    ({ channelID, channelName, roleID, hasUnread }) => (
      <li key={channelID}>
        <div className={`chan-icon ${hasUnread ? "unread" : ""}`}></div>
        <button data-id={channelID} onClick={handleChannelClick}>
          # {channelName}
        </button>
      </li>
    )
  );

  const serverDropDownUl = (
    <ul className="server-dropdown">
      <li>
        <button className="server-dropdown-btn" onClick={handleInviteClick}>
          Get Invite <MdOutlineContentCopy />
        </button>
        {codeStatus && (
          <div ref={codeRef} className="code-status">
            <MdCheckCircleOutline /> {codeStatus}
          </div>
        )}
      </li>
      {/* if the user is an admin+ show edit option */}
      {server.roleID <= 2 && (
        <li>
          <button
            className="server-dropdown-btn"
            onClick={handleServerSettingsClick}
          >
            Edit Server <MdSettings />
          </button>
        </li>
      )}
      {/* can delete if creator otherwise can
               leave server (creator can't leave) */}
      {server.roleID === 1 ? (
        <li>
          <button
            className="server-dropdown-btn"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Server
          </button>
          {showDeleteConfirm && (
            <div className="confirm-outline">
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
            <div className="confirm-outline">
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
  );

  return (
    <>
      <div className="channels-container">
        <div className="channels thin-scroll">
          <div className="col-head">
            <h2>{server.serverName}</h2>
            {server.serverName && (
              <button onClick={handleShowServerMenu}>
                {!showServerDropdown ? <MdOutlineExpandMore /> : <MdClose />}
              </button>
            )}
          </div>
          <div className="channel-list-container">
            <ul>{channelList}</ul>
            {showServerDropdown && serverDropDownUl}
          </div>
        </div>
      </div>
      <div className="server-menu">
        <div>
          {channel.channelID && (
            <button className="hover-btn" onClick={handleAddChannelClick}>
              <AiOutlinePlusCircle />
            </button>
          )}
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
  setShowServerDropdown
) {
  // When a server is selected clear menus
  useEffect(() => {
    setShowLeaveServerConfirm(false);
    setShowServerDropdown(false);

    if (!server || !server.serverID) {
      setCurChannels([]);
    }
  }, [server]);
}

function useChannelsChange(
  socket,
  channels,
  dispatch,
  channelStatus,
  newIDs,
  token,
  userID
) {
  useEffect(() => {
    if (channelStatus === "initialized") {
      // subscribe to all channels
      for (const serverID in channels) {
        const channelArr = channels[serverID];
        for (const chan of channelArr) {
          // if not already subscribed, subscribe
          if (!(chan.channelID in socket.current.getChannelSubs())) {
            socket.current.addChannelSub(chan.channelID, handleChannelData);
          }
        }
      }
    } else if (channelStatus === "new") {
      // fetch users for channel
      dispatch(
        fetchUsersForChannel({
          token: token,
          serverID: newIDs[0],
          channelID: newIDs[1],
        })
      );
      // subscribe
      socket.current.addChannelSub(newIDs[1], handleChannelData);
    } else if (channelStatus === "newMsg") {
      dispatch(updateServerRead({ id: newIDs[0], isUnread: true }));
    }
    if (
      channelStatus === "new" ||
      channelStatus === "initialized" ||
      channelStatus === "newMsg"
    )
      dispatch(channelSuccess());
  }, [channelStatus]);

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
      dispatch(
        channelHasNewMessage({
          channelID: parsed.data.channelID,
          msgTime: parsed.data.time,
        })
      );
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
      deleteChannel(
        parsed.data.channelID,
        parsed.data.serverID,
        dispatch,
        socket
      );
    } else if (resType === "TYPING") {
      if (parsed.data.status) {
        dispatch(addTyping(parsed.data));
      } else {
        dispatch(rmTyping(parsed.data));
      }
    } else if (resType === "ROLE_EDIT") {
      if (!parsed.data.userIDs.includes(userID)) {
        deleteChannel(
          parsed.data.channelID,
          parsed.data.serverID,
          dispatch,
          socket
        );
        return;
      }
      // update role
      dispatch(editRole(parsed.data));
      // update users
      dispatch(setUserChannel(parsed.data));
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
          deleteChannel(
            parsed.data.channelID,
            parsed.data.serverID,
            dispatch,
            socket
          );
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
    } else if (resType === "REACTION_NEW") {
      dispatch(addReactionUpdate(parsed.data));
    } else if (resType === "REACTION_DELETE") {
      dispatch(removeReactionUpdate(parsed.data));
    }
  };
}
const deleteChannel = (channelID, serverID, dispatch, socket) => {
  // remove the channel from channels
  dispatch(
    deleteChannelUpdate({
      channelID: channelID,
      serverID: serverID,
    })
  );
  // remove the channel from UserChannels
  dispatch(clearUserChannel({ channelID: channelID }));
  // remove the channel from message
  dispatch(deleteMessageChannelUpdate({ channelID: channelID }));
  socket.current.removeChannelSub(channelID);
};

function useCurrentServerChannelsChange(
  server,
  channels,
  channel,
  setCurChannels,
  dispatch
) {
  // if channels[serverID] changes update the local channels list
  useEffect(() => {
    if (server && server.serverID && channels[server.serverID]) {
      setCurChannels(channels[server.serverID]);

      // if the current channel is in the server continue, otherwise select the first channel
      if (!channel || !channels[server.serverID].includes(channel)) {
        dispatch(setChannel(channels[server.serverID][0]));
      }
    }
  }, [channels[server.serverID]]);
}

function useCodeStatus(codeRef) {
  const [codeStatus, setCodeStatus] = useState("");
  useEffect(() => {
    if (codeStatus !== "") {
      setTimeout(() => {
        if (codeRef.current) {
          codeRef.current.style.opacity = 0;

          setTimeout(() => setCodeStatus(""), 600);
        }
      }, 1000);
    }
  }, [codeStatus]);
  return [codeStatus, setCodeStatus];
}
