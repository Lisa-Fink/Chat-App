import React, { useState } from "react";
import "../styles/login-signup.css";
import { login } from "../redux/authSlice";
import { useDispatch } from "react-redux";

function Login({ toggleMenu }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    const emailPattern = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
    const isEmailValid = emailPattern.test(email);
    const isPasswordValid = password.length >= 6;
    setValidEmail(isEmailValid);
    setValidPassword(isPasswordValid);
    if (isEmailValid && isPasswordValid) {
      try {
        dispatch(login({ email, password }));
      } catch (error) {
        setError(error);
      }
    }
  };

  return (
    <>
      <h2>Login</h2>
      <p id="error">{error}</p>
      <form>
        <div>
          <div>
            <label htmlFor="email">Email</label>
            {!validEmail && <span>Enter a valid email</span>}
          </div>
          <input
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
              <span>Password must be 6 or more characters</span>
            )}
          </div>
          <input
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
