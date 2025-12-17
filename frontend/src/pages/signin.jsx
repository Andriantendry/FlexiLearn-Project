import React, { useState } from "react";
import "../styles/signin&signup.css";
import app_icone from "../assets/icones/app_icon.png";
import mail_icone from "../assets/icones/email.png";
import lock_icone from "../assets/icones/lock.png";
import { Link, useNavigate } from "react-router-dom";
import logo_image from "../assets/images/logo.png";
import eye_icone from "../assets/icones/eye.png";
import eye_hide_icone from "../assets/icones/eye_hide.png";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/user/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("API response:", data);
      // Récupère l'ID utilisateur (adapté à ta backend)
      const userId = data.user_id || data.user?.id || data.id;
      if (userId) {
        localStorage.setItem("user_id", userId);
        alert(
          "Connexion réussie ! Prêt à découvrir ton style d'apprentissage ? 🚀"
        );
        navigate("/quiz");
      } else {
        alert("Connexion réussie, mais ID manquant. Contacte le support.");
      }

      if (!res.ok) alert("Login failed");
      else alert("Login successful!");
    } catch (error) {
      console.error("Error:", error);
      alert("Server connection error");
    }
  };

  return (
    <div className="signin-container">
      {/* LEFT PANEL */}
      <div className="signin-left">
        <h1 className="brand">
          Flexi<span>Learn</span> <br /> Platform
        </h1>

        <p className="subtitle">
          Shapes your way of learning,
          <br />
          optimizing progress through adaptive intelligence.{" "}
        </p>
        <img src={app_icone} alt="Team Illustration" className="illustration" />

        <p className="signup-left">
          Don’t Have Account?{" "}
          <Link to="/signup" className="underline-link">
            Sign up
          </Link>
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="signin-right">
        <img src={logo_image} alt="Logo" className="signin-logo" />

        <h2>Welcome back</h2>

        <p className="info">
          Log in to your account using your phone no/email & password
        </p>

        <form className="signin-form" onSubmit={handleLogin}>
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
              <input type="checkbox" /> Remember me
            </label>

            <a href="#" className="forgot-link underline-link">
              Forgot Password?
            </a>
          </div>

          <button className="login-btn">LOGIN</button>
        </form>
      </div>
    </div>
  );
}
