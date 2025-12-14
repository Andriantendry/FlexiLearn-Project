import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import logo from "../assets/images/logo.jpg"; // Ton logo FlexiLearn

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        alert(data.message || "Identifiants incorrects. Réessaie ! 😊");
        return;
      }

      // Récupère l'ID utilisateur (adapté à ta backend)
      const userId = data.user_id || data.user?.id || data.id;

      if (userId) {
        localStorage.setItem("user_id", userId);
        alert("Connexion réussie ! Prêt à découvrir ton style d'apprentissage ? 🚀");
        navigate("/quiz");
      } else {
        alert("Connexion réussie, mais ID manquant. Contacte le support.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion. Vérifie ton réseau ou réessaie plus tard.");
    } finally {
      setLoading(false); // ← Important : désactive le loading même en cas d'erreur
    }
  };

  return (
    <div className="auth-container">
      <img src={logo} alt="FlexiLearn" className="auth-logo" />
      <div className="auth-card">
        <h1 className="auth-title">Bienvenue !</h1>
        <p className="auth-subtitle">
          Connecte-toi pour retrouver ou découvrir ton style d'apprentissage personnalisé
        </p>

        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Ton email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <div className="auth-link">
          Première visite ? <Link to="/signup">Créer un compte</Link>
        </div>
      </div>
    </div>
  );
}