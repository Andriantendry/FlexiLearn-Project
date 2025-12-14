import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import logo from "../assets/images/logo.jpg";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        alert(data.message || "Erreur lors de l'inscription. Vérifie tes informations.");
        return;
      }

      const userId = data.user_id || data.user?.id || data.id;

      if (userId) {
        localStorage.setItem("user_id", userId);
        alert("Compte créé avec succès ! Bienvenue sur FlexiLearn 🎉 Prêt à passer le quiz ?");
        navigate("/quiz");
      } else {
        alert("Inscription réussie, mais redirection automatique impossible.");
        navigate("/signin");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur. Réessaie dans quelques instants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <img src={logo} alt="FlexiLearn" className="auth-logo" />
      <div className="auth-card">
        <h1 className="auth-title">Rejoins-nous !</h1>
        <p className="auth-subtitle">
          Crée ton compte et découvre quel type d'apprenant tu es vraiment
        </p>

        <form className="auth-form" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
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
            placeholder="Choisis un mot de passe"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Création en cours..." : "Créer mon compte"}
          </button>
        </form>

        <div className="auth-link">
          Déjà inscrit ? <Link to="/signin">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}