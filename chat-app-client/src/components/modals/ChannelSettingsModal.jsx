import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import "../../styles/modal.css";
import "../../styles/ChannelSettingsModal.css";
import MangeChannelUsers from "./ManageChannelUsers";

function ChannelSettingsModal({ closeModal }) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { name, id, roleID } = useSelector((state) => state.current.channel);
  const { server } = useSelector((state) => state.current);

  const [channelName, setChannelName] = useState(name);
  const [channelRole, setChannelRole] = useState(roleID);
  const [validName, setValidName] = useState(true);
  const [editName, setEditName] = useState(false);
  const [editRole, setEditRole] = useState(false);

  const [view, setView] = useState("details");

  const handleEditNameClick = (e) => {
    e.preventDefault();
    setEditName(true);
  };
  const handleNameSubmit = (e) => {
    e.preventDefault();
  };
  const handleNameCancel = (e) => {
    e.preventDefault();
    setChannelName(name);
    setEditName(false);
  };

  const handleEditRoleClick = (e) => {
    e.preventDefault();
    setEditRole(true);
  };

  const handleRoleSubmit = (e) => {
    e.preventDefault();
  };
  const handleRoleCancel = (e) => {
    e.preventDefault();
    setChannelRole(channel.roleID);
    setEditRole(false);
  };

  return (
    <div className="modal-container">
      <div className="modal">
        <h2>{name}</h2>
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
                      <div id="channel-name">{name}</div>
                    ) : (
                      <input
                        name="channel-name"
                        id="channel-name"
                        placeholder="Type Channel Name"
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
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
                        {roleID === 4
                          ? "Everyone"
                          : roleID === 3
                          ? "Moderators"
                          : "Admins"}
                      </div>
                    ) : (
                      <select
                        name="channel-role"
                        id="channel-role"
                        value={channelRole}
                        onChange={(e) => setChannelRole(e.target.value)}
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
            </>
          </form>
        ) : (
          <MangeChannelUsers
            id={server.id}
            channelRoleID={roleID}
            channelID={id}
          />
        )}
        <button id="close-btn" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
}

export default ChannelSettingsModal;
