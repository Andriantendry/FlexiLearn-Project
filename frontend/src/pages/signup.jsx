import React, { useState } from "react";
import "../styles/signin&signup.css";
import app_icone from "../assets/icones/app_icon.png";
import mail_icone from "../assets/icones/email.png";
import lock_icone from "../assets/icones/lock.png";
import user_icone from "../assets/icones/user.png";
import logo_image from "../assets/images/logo.png";
import eye_icone from "../assets/icones/eye.png";
import eye_hide_icone from "../assets/icones/eye_hide.png";

import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      console.log("API response:", data);

      if (!res.ok) {
        // Le backend renvoie probablement un message d'erreur
        alert(data.message || "Échec de l'inscription. Vérifiez vos informations.");
        return;
      }

      // Succès !
      // Option 1 : le backend connecte automatiquement → on récupère user_id ou token
      const userId = data.user_id || data.user?.id || data.id;

      if (userId) {
        localStorage.setItem("user_id", userId);
        // Si ton API renvoie un token :
        // localStorage.setItem("token", data.token);

        alert("Inscription réussie ! Bienvenue !");
        navigate("/quiz"); // ou "/signin" si tu veux forcer une connexion manuelle
      } else {
        // Option 2 : inscription OK mais pas de login auto → rediriger vers signin
        alert("Inscription réussie ! Connectez-vous maintenant.");
        navigate("/signin");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Erreur de connexion au serveur. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container signup-mode">
      {/* LEFT PANEL */}
      <div className="signin-left">
        <h1 className="brand">
          Learn<span>Flow</span> <br /> Platform
        </h1>

        <p className="subtitle">
          Shapes your way of learning,
          <br />
          optimizing progress through adaptive intelligence.
        </p>

        <img
          src={app_icone}
          alt="Illustration d'équipe"
          className="illustration"
        />

        <p className="signup-left">
          Already have an account?{" "}
          <Link to="/signin" className="underline-link">
            Sign in
          </Link>
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="signin-right">
        <img src={logo_image} alt="Logo" className="signin-logo" />

        <h2>Create Account</h2>

        <p className="info">
          Sign up with your username, email and password
        </p>

        <form className="signin-form" onSubmit={handleSignup}>
          {/* USERNAME */}
          <label className="field-label">Username</label>
          <div className="input-box">
            <img src={user_icone} className="input-icon" alt="" />
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* EMAIL */}
          <label className="field-label">Email Address</label>
          <div className="input-box">
            <img src={mail_icone} className="input-icon" alt="" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* PASSWORD */}
          <label className="field-label">Password</label>
          <div className="input-box password-box">
            <img src={lock_icone} className="input-icon" alt="" />
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <span className="toggle-pwd" onClick={() => setShowPwd(!showPwd)}>
              <img
                src={showPwd ? eye_icone : eye_hide_icone}
                alt={showPwd ? "Masquer" : "Afficher"}
                className="pwd-icon"
              />
            </span>
          </div>

          {/* On retire "Remember me" et "Forgot Password" → inutiles ici */}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Creating Account..." : "SIGN UP"}
          </button>
        </form>

        <p className="signup-left mobile-link">
          Already have an account?{" "}
          <Link to="/signin" className="underline-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}