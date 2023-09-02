import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updatePassword, updateImage } from "../redux/authSlice";
import "../styles/EditModal.css";

function EditModal({ closeModal }) {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [validPassword, setValidPassword] = useState(true);
  const [validPasswordMatch, setValidPasswordMatch] = useState(true);

  const auth = useSelector((state) => state.auth);
  const [image, setImage] = useState(auth.userImageUrl);
  const dispatch = useDispatch();
  const passwordError =
    auth.errorContext === "updatePassword" ? auth.error : undefined;
  const imageError =
    auth.errorContext === "updateImage" ? auth.error : undefined;

  const handlePasswordChange = (e) => {
    e.preventDefault();
    const isPasswordValid = password.length >= 6;
    const passwordsMatch = password === passwordConfirm;
    setValidPassword(isPasswordValid);
    setValidPasswordMatch(passwordsMatch);
    if (isPasswordValid && passwordsMatch) {
      dispatch(updatePassword(password));
      // clear the form data
      setPassword("");
      setPasswordConfirm("");
    }
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    if (e.target.className.includes("edit-thumbnail")) {
      setImage(e.target.dataset.img);
    }
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    // check if image changed before sending req
    if (image !== auth.userImageUrl) {
      dispatch(updateImage(image));
    }
  };

  return (
    <div className="modal-container">
      <div className="edit-modal">
        <h2>Edit Account</h2>
        <form>
          <div className="edit-container">
            Change Password
            <p className="error">{passwordError}</p>
            <div className="flex-row">
              <div>
                <div>
                  <label htmlFor="password">Password</label>
                  {!validPassword && (
                    <span class="error">
                      Password must be 6 or more characters
                    </span>
                  )}
                </div>
                <input
                  name="password"
                  id="password"
                  type="password"
                  placeholder="new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <div>
                  <label htmlFor="password-confirm">Confirm Password</label>
                  {!validPasswordMatch && (
                    <span class="error">Passwords much match</span>
                  )}
                </div>
                <input
                  name="password-confirmword"
                  id="password-confirm"
                  type="password"
                  placeholder="confirm new password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </div>
              <button onClick={handlePasswordChange}>Submit</button>
            </div>
          </div>

          <div className="edit-container">
            Change Profile Image
            <p className="error">{imageError}</p>
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
                  {auth.username.substring(0, 1).toUpperCase()}
                </button>
              </li>
            </ul>
            <button onClick={handleImageChange}>Change Image</button>
          </div>
        </form>
        <button id="close-btn" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
}

export default EditModal;
