import React, { useState } from "react";
import "../styles/login-signup.css";
import { login } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";

function Login({ toggleMenu }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);

  const handleLogin = async (e) => {
    e.preventDefault();
    const emailPattern = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
    const isEmailValid = emailPattern.test(email);
    const isPasswordValid = password.length >= 6;
    setValidEmail(isEmailValid);
    setValidPassword(isPasswordValid);
    if (isEmailValid && isPasswordValid) {
      dispatch(login({ email, password }));
    }
  };

  return (
    <>
      <h2>Login</h2>
      <p className="error">{error}</p>
      <form>
        <div>
          <div>
            <label htmlFor="email">Email</label>
            {!validEmail && <span className="error">Enter a valid email</span>}
          </div>
          <input
            autoComplete="email"
            name="email"
            id="email"
            type="text"
            placeholder="Type your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <div>
            <label htmlFor="password">Password</label>
            {!validPassword && (
              <span className="error">
                Password must be 6 or more characters
              </span>
            )}
          </div>
          <input
            autoComplete="current-password"
            name="password"
            id="password"
            type="password"
            placeholder="Type your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleLogin}>Login</button>
      </form>
      Need an account? <a onClick={toggleMenu}>Signup</a>
    </>
  );
}

export default Login;
