import React from "react";
import "../styles/Header.css";

function Header() {
  return (
    <header className="header">
      <h1>Lisa's Chat App</h1>
      <div>
        <img className="server-thumbnail" src="./images/cat2.jpg" />
      </div>
    </header>
  );
}

export default Header;
