import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";

export default function QuizResult({ result, answers, onLogout }) {
  const navigate = useNavigate();

  const profile = result.profile || "Mixte";
  const stats = result.statistiques || {};

  const handleSaveAndLogout = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      navigate("/signin");
      return;
    }

    const payload = {
      id: parseInt(userId),
      answers,
      profile,
      statistiques: stats,
    };

    try {
      const res = await fetch(
        "http://localhost:8000/user/enregistrement des résultats",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        alert("Résultat sauvegardé avec succès 🎉");
      } else {
        alert("Erreur sauvegarde");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau");
    } finally {
      localStorage.removeItem("user_id");
      navigate("/signin");
    }
  };

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <img src={logo} alt="FlexiLearn" className="quiz-logo" />
        <button className="logout-btn" onClick={onLogout}>
          Déconnexion
        </button>
      </header>

      <div className="quiz-content">
        <div className="quiz-card result-card">
          <h2 className="result-main-title">
            Ton style d'apprentissage principal
          </h2>

          <div className="main-profile">{profile}</div>

          <div className="result-stats">
            {Object.entries(stats).map(([style, percent]) => (
              <div key={style} className="result-stat-card">
                <div className="stat-label">{style}</div>
                <div className="stat-percent">{percent}%</div>
              </div>
            ))}
          </div>

          <button className="next-btn" onClick={handleSaveAndLogout}>
            Sauvegarder et terminer la session
          </button>
        </div>
      </div>
    </div>
  );
}
