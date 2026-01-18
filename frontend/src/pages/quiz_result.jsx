import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/quiz_result.css";

export default function QuizResult({ result, answers, onLogout }) {
  const navigate = useNavigate();

  const profile = result.profile || "Mixte";
  const stats = result.statistiques || {};

  const handleSaveAndLogout = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      navigate("/signin");
      localStorage.clear();
      sessionStorage.clear();
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
        "http://localhost:8000/user/save-results",
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

  const handleGoToChat = () => {
    // redirige vers le chat, on peut passer le profil si besoin
    navigate("/chat", { state: { firstTestResult: profile } });
  };

  return (
    <div className="qr-container">
      <div className="qr-card">
        <h1 className="qr-title">🎉 Résultat de ton quiz</h1>
        <p className="qr-subtitle">Voici ton style d’apprentissage dominant</p>

        <div className="qr-main-profile">{profile}</div>

        <div className="qr-stats">
          {Object.entries(stats).map(([style, percent]) => (
            <div key={style} className="qr-stat">
              <span className="qr-stat-label">{style}</span>
              <span className="qr-stat-value">{percent}%</span>
            </div>
          ))}
        </div>

        <button className="qr-save-btn" onClick={handleSaveAndLogout}>
          Sauvegarder et quitter
        </button>

        <button className="qr-save-btn" onClick={handleGoToChat}>
          Passer au Chat IA
        </button>

        <button className="qr-logout-btn" onClick={onLogout}>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
