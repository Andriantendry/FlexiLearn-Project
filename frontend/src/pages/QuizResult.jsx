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

  // Fonction pour parser et structurer les recommandations
  const parseRecommendations = (text) => {
    const sections = [];
    const lines = text.split('\n');
    
    let currentSection = null;
    let currentSubsection = null;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Détecter les sections principales (###, nombres, ou MAJUSCULES)
      if (trimmed.match(/^#{2,4}\s/) || 
          trimmed.match(/^\d+\.\s*\*\*/) ||
          trimmed.match(/^[A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸŒÆÇ\s]{10,}$/)) {
        
        if (currentSection) {
          sections.push(currentSection);
        }
        
        currentSection = {
          title: trimmed.replace(/^#{2,4}\s*\*?\*?/, '').replace(/\*\*$/g, ''),
          items: []
        };
        currentSubsection = null;
      }
      // Détecter sous-sections (ÉTAPE, nombres avec **)
      else if (trimmed.match(/^(ÉTAPE|Étape)\s[A-Z]/i) || 
               trimmed.match(/^\d+\.\s/)) {
        
        if (currentSection) {
          currentSubsection = {
            subtitle: trimmed.replace(/\*\*/g, ''),
            points: []
          };
          currentSection.items.push(currentSubsection);
        }
      }
      // Points de liste (·, -, •, **)
      else if (trimmed.match(/^[·•\-\*]/)) {
        const point = trimmed.replace(/^[·•\-\*]\s*\*?\*?/, '').replace(/\*\*/g, '');
        
        if (currentSubsection) {
          currentSubsection.points.push(point);
        } else if (currentSection) {
          currentSection.items.push({ text: point });
        }
      }
      // Texte normal
      else {
        if (currentSubsection && currentSubsection.points) {
          currentSubsection.points.push(trimmed.replace(/\*\*/g, ''));
        } else if (currentSection) {
          currentSection.items.push({ text: trimmed.replace(/\*\*/g, '') });
        }
      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  };

  const parsedRecommendations = parseRecommendations(recommendations);

  const handleRestart = () => {
    localStorage.removeItem("recommendations");
    navigate("/quiz");
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/signin");
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
            {profile.includes("V") && (
              <span className="badge badge-visual">Visuel</span>
            )}
            {profile.includes("A") && (
              <span className="badge badge-auditory">Auditif</span>
            )}
            {profile.includes("K") && (
              <span className="badge badge-kinesthetic">Kinesthésique</span>
            )}
          </div>
        </div>

        {/* Recommandations */}
        <div className="recommendations-card">
          <h2>Vos Recommandations Personnalisées</h2>
          <div className="recommendations-content">
            {parsedRecommendations.map((section, sIdx) => (
              <div key={sIdx} className="reco-section">
                <h3 className="reco-section-title">{section.title}</h3>
                
                {section.items.map((item, iIdx) => {
                  // Si c'est une sous-section avec points
                  if (item.subtitle) {
                    return (
                      <div key={iIdx} className="reco-subsection">
                        <h4 className="reco-subtitle">{item.subtitle}</h4>
                        <ul className="reco-list">
                          {item.points.map((point, pIdx) => (
                            <li key={pIdx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  }
                  // Si c'est juste du texte
                  else if (item.text) {
                    return (
                      <p key={iIdx} className="reco-paragraph">
                        {item.text}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="result-actions">
          <button className="btn-secondary" onClick={handleRestart}>
            Refaire le test
          </button>
          {/* <button className="btn-primary" onClick={() => navigate("/chat")}>
            Continuer le chat
          </button> */}
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