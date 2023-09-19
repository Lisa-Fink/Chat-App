import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./../styles/modal.css";
import { createServer } from "../redux/serversSlice";

function AddServerModal({ closeModal }) {
  const auth = useSelector((state) => state.auth);
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();

  const [serverName, setServerName] = useState("");
  const [serverDescription, setServerDescription] = useState("");

  const [validName, setValidName] = useState(true);
  const [validDescription, setValidDescription] = useState(true);

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

      // close modal
      closeModal();
    }
  };

  return (
    <div className="modal-container">
      <div className="modal">
        <h2>Edit Account</h2>
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
        <button id="close-btn" onClick={closeModal}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default AddServerModal;
