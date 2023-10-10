import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import MangeChannelUsers from "./ManageChannelUsers";
import {
  deleteChannel,
  updateChannelName,
  updateChannelRole,
} from "../../redux/channelsSlice";
import { MdCancel, MdCheck } from "react-icons/md";
import Modal from "./Modal";
import "../../styles/ChannelSettingsModal.css";

function ChannelSettingsModal({ closeModal }) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const current = useSelector((state) => state.current);
  const serverID = current.server;
  const channelID = current.channel;
  const channel = useSelector(
    (state) =>
      state.channels.byServerID[serverID] &&
      state.channels.byServerID[serverID].find(
        (chan) => parseInt(chan.channelID) === parseInt(channelID)
      )
  );
  const server = useSelector(
    (state) =>
      state.servers.data &&
      state.servers.data.find(
        (ser) => parseInt(ser.serverID) === parseInt(serverID)
      )
  );
  const { channelName, roleID } = channel;

  const [newChannelName, setNewChannelName] = useState(channelName);
  const [newChannelRole, setNewChannelRole] = useState(roleID);
  const [validName, setValidName] = useState(true);
  const [editName, setEditName] = useState(false);
  const [editRole, setEditRole] = useState(false);

  const [view, setView] = useState("details");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEditNameClick = (e) => {
    e.preventDefault();
    setEditName(true);
  };
  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) {
      setValidName(false);
      return;
    }
    setValidName(true);
    if (newChannelName !== channelName) {
      dispatch(
        updateChannelName({
          token: auth.token,
          serverID: serverID,
          channelID: channelID,
          channelName: newChannelName,
        })
      );
    }
    setEditName(false);
  };
  const handleNameCancel = (e) => {
    e.preventDefault();
    setNewChannelName(channelName);
    setEditName(false);
  };

  const handleEditRoleClick = (e) => {
    e.preventDefault();
    setEditRole(true);
  };

  const handleRoleSubmit = (e) => {
    e.preventDefault();
    if (newChannelRole < 1 || newChannelRole > 4) return;
    if (roleID !== newChannelRole) {
      dispatch(
        updateChannelRole({
          token: auth.token,
          serverID: serverID,
          channelID: channelID,
          roleID: newChannelRole,
          oldRoleID: roleID,
        })
      );
    }
    setEditRole(false);
  };

  const handleRoleCancel = (e) => {
    e.preventDefault();
    setNewChannelRole(roleID);
    setEditRole(false);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    setShowDeleteConfirm(true);
  };

  const handleDeleteCancel = (e) => {
    e.preventDefault();
    setShowDeleteConfirm(false);
  };

  const handleDeleteConfirm = (e) => {
    e.preventDefault();
    dispatch(
      deleteChannel({
        token: auth.token,
        serverID: serverID,
        channelID: channelID,
      })
    );
    setShowDeleteConfirm(false);
    closeModal();
  };

  return (
    <Modal closeModal={closeModal}>
      <h2>{channelName}</h2>
      <h3>Channel Settings</h3>
      <button className="modal-view-btn" onClick={() => setView("details")}>
        Channel Details
      </button>{" "}
      |
      <button className="modal-view-btn" onClick={() => setView("users")}>
        Manage Users
      </button>
      {view === "details" ? (
        <form>
          <>
            <div className="form-field-container">
              Edit Channel Details
              <div>
                <div>
                  {editName ? (
                    <label htmlFor="channel-name">Channel Name</label>
                  ) : (
                    <div>Channel Name</div>
                  )}
                  {!validName && (
                    <span class="error">Enter a Channel Name</span>
                  )}
                </div>
                <div className="flex-row center">
                  {!editName ? (
                    <div id="channel-name">{channelName}</div>
                  ) : (
                    <input
                      name="channel-name"
                      id="channel-name"
                      placeholder="Type Channel Name"
                      autoComplete="off"
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value)}
                    />
                  )}

                  {!editName ? (
                    <button id="edit-name-btn" onClick={handleEditNameClick}>
                      edit
                    </button>
                  ) : (
                    <>
                      <button id="edit-name-btn" onClick={handleNameSubmit}>
                        submit
                      </button>
                      <button id="edit-name-btn" onClick={handleNameCancel}>
                        cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div>
                <div>
                  {editRole ? (
                    <label htmlFor="channel-role">Channel Role</label>
                  ) : (
                    <div>Channel Role</div>
                  )}
                </div>
                <div className="flex-row center">
                  {!editRole ? (
                    <div id="channel-role">
                      {newChannelRole == 4
                        ? "Everyone"
                        : newChannelRole == 3
                        ? "Moderators"
                        : "Admins"}
                    </div>
                  ) : (
                    <select
                      name="channel-role"
                      id="channel-role"
                      value={newChannelRole}
                      onChange={(e) => setNewChannelRole(e.target.value)}
                    >
                      <option value="4">Everyone</option>
                      <option value="3">Moderators</option>
                      <option value="2">Admins</option>
                    </select>
                  )}
                  {!editRole ? (
                    <button id="edit-name-btn" onClick={handleEditRoleClick}>
                      edit
                    </button>
                  ) : (
                    <>
                      <button id="edit-name-btn" onClick={handleRoleSubmit}>
                        submit
                      </button>
                      <button id="edit-name-btn" onClick={handleRoleCancel}>
                        cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            {server.roleID <= 2 && (
              <div className="form-field-container">
                Delete Channel
                <div>
                  <button onClick={handleDeleteClick}>Delete</button>
                  {showDeleteConfirm && (
                    <div className="confirm-del-modal">
                      Confirm Delete?{" "}
                      <button onClick={handleDeleteConfirm}>
                        <MdCheck />
                      </button>
                      <button onClick={handleDeleteCancel}>
                        <MdCancel />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        </form>
      ) : (
        <MangeChannelUsers
          id={serverID}
          channelRoleID={roleID}
          channelID={channelID}
        />
      )}
    </Modal>
  );
}

export default ChannelSettingsModal;
