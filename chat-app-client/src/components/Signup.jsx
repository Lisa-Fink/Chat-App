import React, { useState } from "react";
import "../styles/login-signup.css";
import { registerAndLogin } from "../redux/authSlice";
import { useDispatch } from "react-redux";

function Signup({ toggleMenu }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [validPasswordMatch, setValidPasswordMatch] = useState(true);
  const [validUsername, setValidUsername] = useState(true);
  const dispatch = useDispatch();

  const handleSignup = (e) => {
    e.preventDefault();
    const emailPattern = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
    const isEmailValid = emailPattern.test(email);
    const isPasswordValid = password.length >= 6;
    const passwordsMatch = password === passwordConfirm;
    const isUsernameValid = username.length > 0;
    setValidEmail(isEmailValid);
    setValidPassword(isPasswordValid);
    setValidPasswordMatch(passwordsMatch);
    setValidUsername(isUsernameValid);
    if (isEmailValid && isPasswordValid && passwordsMatch && isUsernameValid) {
      try {
        dispatch(registerAndLogin({ username, email, password }));
        // clear the form data
        setPassword("");
        setEmail("");
        setPasswordConfirm("");
        setUsername("");
      } catch (error) {
        setError(error);
      }
    }
  };

  return (
    <>
      <h2>Create an Account</h2>
      <p id="error">{error}</p>
      <form>
        <div>
          <div>
            <label htmlFor="username">Username</label>
            {!validUsername && (
              <span class="error">Enter a valid username</span>
            )}
          </div>
          <input
            name="username"
            id="username"
            type="text"
            placeholder="Type your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <div>
            <label htmlFor="email">Email</label>
            {!validEmail && <span class="error">Enter a valid email</span>}
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
              <span class="error">Password must be 6 or more characters</span>
            )}
          </div>
          <input
            autoComplete="new-password"
            name="password"
            id="password"
            type="password"
            placeholder="Type your password"
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
            name="password-confirm"
            id="password-confirm"
            type="password"
            placeholder="Confirm your password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>
        <button onClick={handleSignup}>Submit</button>
      </form>
      Already have an account? <a onClick={toggleMenu}>Login</a>
    </>
  );
}

export default Signup;
