import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMenu = () => {
    setIsLogin(!isLogin);
  };
  return (
    <div className="login-signup">
      <h1>Lisa's Chat App</h1>
      {isLogin ? (
        <Login toggleMenu={toggleMenu} />
      ) : (
        <Signup toggleMenu={toggleMenu} />
      )}
    </div>
  );
}

export default Auth;
