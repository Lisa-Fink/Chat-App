import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateServerDescription,
  updateServerImage,
} from "../../redux/serversSlice";

import "../../styles/ServerSettingsModal.css";
import MangeUsers from "./MangeUsers";
import Modal from "./Modal";

function ServerSettingsModal({ closeModal }) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { name, id } = useSelector((state) => state.current.server);
  const servers = useSelector((state) => state.servers.data);
  const server = servers.find((server) => server.serverID === id);
  const description = server.serverDescription;
  const url = server.serverImageUrl;

  const [image, setImage] = useState(url);
  const [serverDescription, setServerDescription] = useState(description);
  const [validDescription, setValidDescription] = useState(true);
  const [editDescription, setEditDescription] = useState(false);
  const [view, setView] = useState("details");

  const handleImageClick = (e) => {
    e.preventDefault();
    if (e.target.className.includes("edit-thumbnail")) {
      setImage(e.target.dataset.img);
    }
  };

  const handleDescriptionSubmit = (e) => {
    e.preventDefault();
    // check if there is any description
    const isDescription = serverDescription.length > 0;
    setValidDescription(isDescription);
    // check if the description changed
    if (isDescription && serverDescription.trim() !== description) {
      dispatch(
        updateServerDescription({
          token: auth.token,
          serverID: id,
          serverDescription: serverDescription,
        })
      );
    }
    setEditDescription(false);
  };

  const handleEditDescriptionClick = (e) => {
    e.preventDefault();
    setEditDescription(true);
  };

  const handleDescriptionCancel = (e) => {
    e.preventDefault();
    setEditDescription(false);
    setServerDescription(description);
  };

  const handleImageSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateServerImage({
        token: auth.token,
        serverID: id,
        serverImageUrl: image,
      })
    );
  };

  return (
    <Modal closeModal={closeModal}>
      <h2>{name}</h2>
      <h3>Server Settings</h3>
      <button className="modal-view-btn" onClick={() => setView("details")}>
        Server Details
      </button>{" "}
      |
      <button className="modal-view-btn" onClick={() => setView("users")}>
        Manage Users
      </button>
      {view === "details" ? (
        <form>
          <>
            <div className="form-field-container">
              Edit Server Details
              <div className="flex-row">
                <div>
                  <div>
                    <label htmlFor="server-description">
                      Server Description
                    </label>
                    {!validDescription && (
                      <span class="error">Enter a Server Description</span>
                    )}
                  </div>
                  {!editDescription ? (
                    <div id="server-description">{description}</div>
                  ) : (
                    <textarea
                      name="server-description"
                      id="server-description"
                      placeholder="Type Server Description"
                      value={serverDescription}
                      onChange={(e) => setServerDescription(e.target.value)}
                    />
                  )}
                </div>
                {!editDescription ? (
                  <button
                    id="edit-desc-btn"
                    onClick={handleEditDescriptionClick}
                  >
                    edit
                  </button>
                ) : (
                  <>
                    <button
                      id="edit-desc-btn"
                      onClick={handleDescriptionSubmit}
                    >
                      submit
                    </button>
                    <button
                      id="edit-desc-btn"
                      onClick={handleDescriptionCancel}
                    >
                      cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="form-field-container">
              Edit Server Image
              <ul onClick={handleImageClick}>
                <li>
                  <img
                    data-img={"./images/cat-drawing.jpg"}
                    className={
                      "edit-thumbnail" +
                      (image === "./images/cat-drawing.jpg" ? " selected" : "")
                    }
                    src="./images/cat-drawing.jpg"
                  />
                </li>
                <li>
                  <img
                    data-img={"./images/cat1.jpg"}
                    className={
                      "edit-thumbnail" +
                      (image === "./images/cat1.jpg" ? " selected" : "")
                    }
                    src="./images/cat1.jpg"
                  />
                </li>
                <li>
                  <img
                    data-img={"./images/cat2.jpg"}
                    className={
                      "edit-thumbnail" +
                      (image === "./images/cat2.jpg" ? " selected" : "")
                    }
                    src="./images/cat2.jpg"
                  />
                </li>
                <li>
                  <img
                    data-img={"./images/dog1.jpg"}
                    className={
                      "edit-thumbnail" +
                      (image === "./images/dog1.jpg" ? " selected" : "")
                    }
                    src="./images/dog1.jpg"
                  />
                </li>
                <li>
                  <img
                    data-img={"./images/lisa.jpg"}
                    className={
                      "edit-thumbnail" +
                      (image === "./images/lisa.jpg" ? " selected" : "")
                    }
                    src="./images/lisa.jpg"
                  />
                </li>
                <li>
                  <button
                    data-img={null}
                    className={
                      "edit-thumbnail edit-btn" +
                      (image === null || image === undefined ? " selected" : "")
                    }
                  >
                    {name.substring(0, 1).toUpperCase()}
                  </button>
                </li>
              </ul>
              <button id="modal-btn" onClick={handleImageSubmit}>
                submit
              </button>
            </div>
          </>
        </form>
      ) : (
        <MangeUsers id={id} />
      )}
    </Modal>
  );
}

export default ServerSettingsModal;
