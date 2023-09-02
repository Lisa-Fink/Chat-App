import React from "react";
import "../styles/Header.css";
import { useSelector } from "react-redux";

function Header() {
  const auth = useSelector((state) => state.auth);
  return (
    <header className="header">
      <h1>Lisa's Chat App</h1>
      {auth.isAuthenticated && (
        <div>
          <img className="server-thumbnail" src="./images/cat2.jpg" />
        </div>
      )}
    </header>
  );
}

export default Header;
