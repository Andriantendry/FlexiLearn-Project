import React, { useState } from "react";
import "../styles/signin&signup.css";
import app_icone from "../assets/icones/app_icon.png";
import mail_icone from "../assets/icones/email.png";
import lock_icone from "../assets/icones/lock.png";
import { Link, useNavigate } from "react-router-dom"; // ← Ajout de useNavigate
import logo_image from "../assets/images/logo.png";
import eye_icone from "../assets/icones/eye.png";
import eye_hide_icone from "../assets/icones/eye_hide.png";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false); // Optionnel : pour désactiver le bouton pendant la requête

  const navigate = useNavigate(); // ← Hook pour la navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/user/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("API response:", data);

      if (!res.ok) {
        // L'API renvoie probablement un message d'erreur dans data.message ou similaire
        alert(data.message || "Échec de la connexion. Vérifiez vos identifiants.");
        return;
      }

      // Succès : on suppose que l'API renvoie { user_id, ... } ou { user: { id: ... } }
      // À adapter selon la structure réelle de ta réponse
      const userId = data.user_id || data.user?.id || data.id;

      if (userId) {
        localStorage.setItem("user_id", userId);
        // Optionnel : stocker un token si ton API en renvoie un
        // localStorage.setItem("token", data.token);

        alert("Connexion réussie !");
        navigate("/quiz"); // ← Redirection après succès
      } else {
        alert("Réponse inattendue du serveur.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Erreur de connexion au serveur. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
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
        <img src={app_icone} alt="Illustration d'équipe" className="illustration" />

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
              disabled={loading}
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
              disabled={loading}
            />
            <span className="toggle-pwd" onClick={() => setShowPwd(!showPwd)}>
              <img
                src={showPwd ? eye_icone : eye_hide_icone}
                alt={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                className="pwd-icon"
              />
            </span>
          </div>

          <div className="options">
            <label className="remember-me">
              <input type="checkbox" disabled={loading} /> Remember me
            </label>

            <a href="#" className="forgot-link underline-link">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Loading..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}