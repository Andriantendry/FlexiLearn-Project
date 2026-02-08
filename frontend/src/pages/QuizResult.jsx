import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/quiz-result.css";

export default function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const { profile, recommendations } = location.state || {};

  // Si pas de données, rediriger vers le quiz
  if (!profile || !recommendations) {
    return (
      <div className="result-container">
        <div className="result-card">
          <h2>⚠️ Aucune donnée disponible</h2>
          <p>Veuillez d'abord compléter le quiz.</p>
          <button className="btn-primary" onClick={() => navigate("/quiz")}>
            Retour au quiz
          </button>
        </div>
      </div>
    );
  }

  // Mapping des codes de profil vers noms complets
  const profileNames = {
    "VA": "Visuel-Auditif",
    "VK": "Visuel-Kinesthésique",
    "AV": "Auditif-Visuel",
    "AK": "Auditif-Kinesthésique",
    "KV": "Kinesthésique-Visuel",
    "KA": "Kinesthésique-Auditif"
  };

  const profileName = profileNames[profile] || profile;

  const handleRestart = () => {
    localStorage.removeItem("recommendations");
    navigate("/quiz");
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/signin");
  };

const saveProfile = async () => {
  try {
    const userId = localStorage.getItem("user_id");
    
    const response = await fetch("http://localhost:8000/user/save-results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: parseInt(userId),
        answers: {},
        profile_code: profile,
        profil_dominant: profile[0] || "",
        profil_secondaire: profile[1] || "",
        profil_tertiaire: "",
        statistiques: {},
        recommendation: JSON.stringify(recommendations)
      })
    });

    const data = await response.json();
    if (response.ok) {
      alert("Profil et recommandations sauvegardés avec succès !");
    } else {
      console.error(data);
      alert("Erreur lors de la sauvegarde du profil.");
    }
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la sauvegarde du profil.");
  }
};

  return (
    <div className="result-container">
      <header className="result-header">
        <div className="brand">🎓 FlexiLearn</div>
        <h1>Votre Profil d'Apprentissage</h1>
      </header>

      <div className="result-wrapper">
        {/* Carte du profil */}
        <div className="profile-card">
          <div className="profile-icon">
            {profile === "VA" || profile === "VK" ? "👁️" : 
             profile === "AV" || profile === "AK" ? "👂" : "✋"}
          </div>
          <h2 className="profile-title">{profileName}</h2>
          <p className="profile-code">Code: {profile}</p>
          <div className="profile-description">
            {profile.includes("V") && <span className="badge badge-visual">Visuel</span>}
            {profile.includes("A") && <span className="badge badge-auditory">Auditif</span>}
            {profile.includes("K") && <span className="badge badge-kinesthetic">Kinesthésique</span>}
          </div>
        </div>

        {/* Recommandations */}
        <div className="recommendations-card">
          <h2>Vos Recommandations Personnalisées</h2>
          <div className="recommendations-content">
            {recommendations.sections.map((section, sIdx) => (
              <div key={sIdx} className="reco-section">
                <h3 className="reco-section-title">{section.title}</h3>
                
                {section.items.map((item, iIdx) => (
                  <div key={iIdx}>
                    {item.subtitle && (
                      <div className="reco-subsection">
                        <h4 className="reco-subtitle">{item.subtitle}</h4>
                        <ul className="reco-list">
                          {item.points.map((point, pIdx) => (
                            <li key={pIdx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {item.text && <p className="reco-paragraph">{item.text}</p>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="result-actions">
          <button className="btn-secondary" onClick={handleRestart}>
            Refaire le test
          </button>
          <button className="btn-primary" onClick={saveProfile}>
            Sauvegarder
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Se déconnecter
          </button>
        </div>

        {/* Informations supplémentaires */}
        <div className="info-card">
          <h3>Que faire maintenant ?</h3>
          <ul>
            <li>Appliquez ces recommandations dans vos études quotidiennes</li>
            <li>Adaptez votre environnement d'apprentissage selon votre profil</li>
            <li>Suivez vos progrès et ajustez vos méthodes si nécessaire</li>
            <li>Partagez vos stratégies avec vos enseignants ou formateurs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
