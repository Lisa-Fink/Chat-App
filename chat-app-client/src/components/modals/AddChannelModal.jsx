import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createChannel } from "../../redux/channelsSlice";
import Modal from "./Modal";

function AddChannelModal({ closeModal }) {
  const auth = useSelector((state) => state.auth);
  const serverID = useSelector((state) => state.current.server.id);
  const dispatch = useDispatch();

  const [channelName, setChannelName] = useState("");
  const [channelRole, setChannelRole] = useState(4);

  const [validName, setValidName] = useState(true);

  const handleAddChannelClick = (e) => {
    e.preventDefault();
    const isValidName = channelName.trim().length > 0;
    setValidName(isValidName);
    if (isValidName && channelRole > 1 && channelRole <= 4) {
      dispatch(
        createChannel({
          token: auth.token,
          serverID: serverID,
          channelName: channelName,
          roleID: channelRole,
        })
      );
      closeModal();
    }
  };

  return (
    <Modal closeModal={closeModal}>
      <h2>Add Channel</h2>
      <form>
        <div className="form-field-container">
          Channel Details
          <div>
            <div>
              <div>
                <label htmlFor="channel-name">Channel Name</label>
                {!validName && (
                  <span className="error">Enter a Channel Name</span>
                )}
              </div>
              <input
                name="channel-name"
                id="channel-name"
                type="text"
                placeholder="Type Channel Name"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="channelRoleSelect">Select Channel Role:</label>
              <select
                id="channelRoleSelect"
                value={channelRole}
                onChange={(e) => setChannelRole(e.target.value)}
              >
                <option value="4">Everyone</option>
                <option value="3">Moderator</option>
                <option value="2">Admin</option>
              </select>
            </div>
          </div>
        </div>

        <button id="modal-btn" onClick={handleAddChannelClick}>
          Add Channel
        </button>
      </form>
    </Modal>
  );
}

export default AddChannelModal;
