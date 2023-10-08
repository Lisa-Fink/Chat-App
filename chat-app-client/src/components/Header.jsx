import React, { useState } from "react";
import "../styles/Header.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import EditModal from "./modals/EditModal";

function Header({ unAuthorize }) {
  const auth = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const dispatch = useDispatch();

  return (
    <header className="header">
      <h1>Lisa's Chat App</h1>
      {auth.isAuthenticated && (
        <div
          className="header-thumbnail"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          {auth.userImageUrl ? (
            <img
              className="server-thumbnail image-thumbnail"
              src={auth.userImageUrl}
            />
          ) : (
            <button className="server-thumbnail">
              {auth.username.substring(0, 1).toUpperCase()}
            </button>
          )}
          {showDropdown && (
            <ul className="header-dropdown">
              <li>
                <button onClick={() => setShowEdit(true)}>Edit Account</button>
              </li>
              <li>
                <button
                  onClick={() => {
                    unAuthorize();
                    dispatch(logout());
                  }}
                >
                  Log Out
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
      {showEdit && <EditModal closeModal={() => setShowEdit(false)} />}
    </header>
  );
}

export default Header;
