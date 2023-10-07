import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createServer, joinServerByInviteCode } from "../../redux/serversSlice";
import Modal from "./Modal";

function AddServerModal({ closeModal }) {
  const auth = useSelector((state) => state.auth);
  const servers = useSelector((state) => state.servers.data);
  const serversStatus = useSelector((state) => state.servers.status);
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();

  const [serverName, setServerName] = useState("");
  const [serverDescription, setServerDescription] = useState("");

  const [validName, setValidName] = useState(true);
  const [validDescription, setValidDescription] = useState(true);

  const [showJoin, setShowJoin] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [validCode, setValidCode] = useState(true);

  const handleImageClick = (e) => {
    e.preventDefault();
    if (e.target.className.includes("edit-thumbnail")) {
      setImage(e.target.dataset.img);
    }
  };

  const handleAddServerClick = (e) => {
    e.preventDefault();
    const isValidName = serverName.trim().length > 0;
    const isValidDescription = serverDescription.trim().length > 0;
    setValidName(isValidName);
    setValidDescription(isValidDescription);
    if (isValidName && isValidDescription) {
      // create the new server
      dispatch(
        createServer({
          token: auth.token,
          serverName: serverName,
          serverDescription: serverDescription,
          serverImageUrl: image,
          user: auth,
        })
      );

      closeModal();
    }
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      setValidCode(false);
      return;
    }
    setValidCode(true);
    dispatch(
      joinServerByInviteCode({ token: auth.token, inviteCode: inviteCode })
    );
  };

  useEffect(() => {
    if (serversStatus === "new") {
      closeModal();
    }
  }, [servers, serversStatus]);

  const join = (
    <>
      <h2>Join Server</h2>
      <div>
        <button onClick={() => setShowJoin(false)}>Create Server</button>|
        <button onClick={() => setShowJoin(true)}>Join Server</button>
      </div>
      <form>
        <div className="form-field-container">
          Invite Code
          <div>
            {!validCode && (
              <span className="error">Enter a Valid Invite Code</span>
            )}
          </div>
          <label htmlFor="invite-code">Enter Invite Code</label>
          <input
            name="invite-code"
            id="invite-code"
            type="text"
            placeholder="Type Invite Code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
          <button onClick={handleInviteSubmit}>Join</button>
        </div>
      </form>
    </>
  );

  const create = (
    <>
      <h2>Create Server </h2>
      <div>
        <button className="modal-hover" onClick={() => setShowJoin(false)}>
          Create Server
        </button>
        |
        <button className="modal-hover" onClick={() => setShowJoin(true)}>
          Join Server
        </button>
      </div>
      <form>
        <div className="form-field-container">
          Server Details
          <div>
            <div>
              <div>
                <label htmlFor="server-name">Server Name</label>
                {!validName && (
                  <span className="error">Enter a Server Name</span>
                )}
              </div>
              <input
                name="server-name"
                id="server-name"
                type="text"
                placeholder="Type Server Name"
                autoComplete="off"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
              />
            </div>

            <div>
              <div>
                <label htmlFor="server-description">Server Description</label>
                {!validDescription && (
                  <span className="error">Enter a Server Description</span>
                )}
              </div>
              <textarea
                name="server-description"
                id="server-description"
                placeholder="Type Server Description"
                value={serverDescription}
                onChange={(e) => setServerDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-field-container">
          Select Server Image
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
                {serverName.substring(0, 1).toUpperCase()}
              </button>
            </li>
          </ul>
        </div>
        <button id="modal-btn" onClick={handleAddServerClick}>
          Add Server
        </button>
      </form>
    </>
  );

  return <Modal closeModal={closeModal}>{!showJoin ? create : join}</Modal>;
}

export default AddServerModal;
