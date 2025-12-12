import React, { useState } from "react";
import "../styles/signin&signup.css";
import app_icone from "../assets/icones/app_icon.png";
import mail_icone from "../assets/icones/email.png";
import eye_icone from "../assets/icones/eye.png";
import eye_hide_icone from "../assets/icones/eye_hide.png";
import lock_icone from "../assets/icones/lock.png";
import user_icone from "../assets/icones/user.png";
import logo_image from "../assets/images/logo.png";

import { Link } from "react-router-dom";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8001/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      console.log("API response:", data);

      if (!res.ok) alert("Login failed");
      else alert("Login successful!");
    } catch (error) {
      console.error("Error:", error);
      alert("Server connection error");
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-container signup-mode">
        {/* LEFT PANEL */}
        <div className="signin-left">
          <h1 className="brand">
            Learn<span>Flow</span> <br /> Platform
          </h1>

          <p className="subtitle">
            Shapes your way of learning,
            <br />
            optimizing progress through adaptive intelligence.{" "}
          </p>

          <img
            src={app_icone}
            alt="Team Illustration"
            className="illustration"
          />

          <p className="signup-left">
            Have you Account?{" "}
            <Link to="/signin" className="underline-link">
              Sign in
            </Link>
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="signin-right">
          <img src={logo_image} alt="Logo" className="signin-logo" />

          <h2>Welcome</h2>

          <p className="info">
            Create your account using your phone no/email & password
          </p>

          <form className="signin-form" onSubmit={handleLogin}>
            {/* USERNAME */}
            <label className="field-label">Username</label>
            <div className="input-box">
              <img src={user_icone} className="input-icon" />
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            {/* EMAIL FIELD */}
            <label className="field-label">Email Address</label>
            <div className="input-box">
              <img src={mail_icone} className="input-icon" alt="" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD FIELD */}
            <label className="field-label">Your Password</label>
            <div className="input-box password-box">
              <img src={lock_icone} className="input-icon" alt="" />

              <input
                type={showPwd ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <span className="toggle-pwd" onClick={() => setShowPwd(!showPwd)}>
                <img
                  src={showPwd ? eye_icone : eye_hide_icone}
                  alt="toggle"
                  className="pwd-icon"
                />
              </span>
            </div>

            <div className="options">
              <label>
                <input type="checkbox" defaultChecked={false} /> Remember me
              </label>

              <a href="#" className="forgot-link underline-link">
                Forgot Password?
              </a>
            </div>

            <button className="login-btn">SIGNUP</button>
          </form>
        </div>
      </div>
    </div>
  );
}
