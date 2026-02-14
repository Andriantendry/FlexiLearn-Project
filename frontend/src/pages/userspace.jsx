import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/userspace.css";

export default function UserSpace() {
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasRecommendation, setHasRecommendation] = useState(false);

  // Conseils prédéfinis selon le type de profil
  const getStyleDescription = (style) => {
    const descriptions = {
      "Visuel": "Vous traitez l'information mieux lorsqu'elle est présentée dans un format graphique ou écrit.",
      "Auditif": "Vous apprenez mieux en écoutant des explications et des discussions.",
      "Kinesthésique": "Vous apprenez mieux par la pratique et l'expérience directe."
    };
    return descriptions[style] || descriptions["Visuel"];
  };

  const getStyleTraits = (style) => {
    const traits = {
      "Visuel": [
        "Forte conscience spatiale",
        "Excellente mémoire visuelle",
        "Orienté vers les détails"
      ],
      "Auditif": [
        "Bonne mémoire auditive",
        "Aime les discussions",
        "Sensible aux sons"
      ],
      "Kinesthésique": [
        "Apprentissage par la pratique",
        "Bon coordination physique",
        "Aime bouger en apprenant"
      ]
    };
    return traits[style] || traits["Visuel"];
  };

  const getStyleIcon = (style) => {
    const icons = {
      "Visuel": "visibility",
      "Auditif": "hearing",
      "Kinesthésique": "touch_app"
    };
    return icons[style] || "visibility";
  };

  const getTipsForStyle = (style) => {
    const tips = {
      "Visuel": [
        {
          icon: "schema",
          title: "Cartes Mentales",
          description: "Convertissez vos notes textuelles en cartes mentales interconnectées. Voir la disposition des informations vous aide à créer des connexions mentales."
        },
        {
          icon: "palette",
          title: "Codage par Couleur",
          description: "Utilisez des surligneurs et des stylos de différentes couleurs pour catégoriser les informations. Votre cerveau associera des couleurs spécifiques à des sujets spécifiques."
        },
        {
          icon: "play_circle",
          title: "Démonstrations Vidéo",
          description: "Lors de l'apprentissage d'un nouveau concept, recherchez des démonstrations visuelles ou des animations plutôt que d'écouter uniquement des cours audio."
        }
      ],
      "Auditif": [
        {
          icon: "headphones",
          title: "Podcasts & Audiolivres",
          description: "Écoutez des podcasts éducatifs et des audiolivres pour absorber les informations de manière auditive."
        },
        {
          icon: "groups",
          title: "Discussions de Groupe",
          description: "Participez à des discussions et débats pour mieux comprendre et mémoriser les concepts."
        },
        {
          icon: "record_voice_over",
          title: "Lecture à Voix Haute",
          description: "Lisez vos notes à voix haute ou expliquez les concepts à quelqu'un pour renforcer votre compréhension."
        }
      ],
      "Kinesthésique": [
        {
          icon: "construction",
          title: "Apprentissage Pratique",
          description: "Privilégiez les exercices pratiques, les expériences et les manipulations pour apprendre."
        },
        {
          icon: "directions_walk",
          title: "Pauses Actives",
          description: "Prenez des pauses régulières pour bouger et marcher pendant vos sessions d'étude."
        },
        {
          icon: "edit",
          title: "Prise de Notes Manuscrites",
          description: "Écrivez à la main plutôt que de taper pour mieux ancrer les informations."
        }
      ]
    };
    return tips[style] || tips["Visuel"];
  };

  const getToolsForStyle = (style) => {
  const tools = {
    "Visuel": [
      {
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBN7sps5tGAhN8_GjRQ43yxcA4ny9rjd6U1nlekQRKB6dyzk473LvzJ_N7mgCPcNs6H_2aMQspiiSMAufgZMkE2gS1yqhCFuZlW4y61avVJwIx9TfI2UmJSrOrPZpBCqtGDtusjXf6wrIcCOc1eJme3NoNLIrPmLwqzJVuOeqpTJbEMiO8LhHWMiXIKn3RuvaqQ-a65hKL0Oty4vyai0yM5dbwGnEA4WDFwUls0gnLTDkMOMKM8XAB-UXVKhe0ulNoYcm3whaMQKk",
        name: "Créateur de Diagrammes",
        description: "Créez des organigrammes et cartes conceptuelles personnalisés pour n'importe quel cours."
      },
      {
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCv1BiziIzu__abSs17vYhkvt1XR1xDgEzZoCLhC_v6XdyAHi1wTftMd581IFdUl0Tv8Aq_Yaqaqgtx0LGlKsAIVxpzBHDGpZ1olbWuY2csIpghzEL8Qfs9CeeqaM8DIEM-TuP0CwzFA-P5ZpN7V3OhOkq3JLTzgvAIvDvLhLsb6UuyoJSzYacujIgYKJw7WqFd-4M6lgUEsdqAymGX_MZwVm1rXiZL6yHXd7v0JtNAO7DTi-WnWPISbhAGBdImBt68q_ItumgixT4",
        name: "Fiches Visuelles",
        description: "Jeux de fiches basés sur des images pour une mémorisation visuelle rapide."
      }
    ],
    "Auditif": [
      {
        image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400",
        name: "Podcasts Éducatifs",
        description: "Bibliothèque de podcasts et contenus audio adaptés à votre apprentissage."
      },
      {
        image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400",
        name: "Enregistreur Vocal",
        description: "Enregistrez vos notes et révisez en écoutant vos propres explications."
      }
    ],
    "Kinesthésique": [
      {
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
        name: "Exercices Interactifs",
        description: "Simulations et activités pratiques pour apprendre par l'expérimentation."
      },
      {
        image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400",
        name: "Prise de Notes Active",
        description: "Outil de prise de notes manuscrites et annotations interactives."
      }
    ]
  };
  
  return tools[style] || tools["Visuel"];
};

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        
        if (!userId) {
          navigate("/signin");
          return;
        }

        const response = await fetch(
          `http://localhost:8000/get_profile/profile?user_id=${userId}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.detail && errorData.detail.includes("Profil d'apprentissage non trouvé")) {
            navigate("/quiz");
            return;
          }
          throw new Error(errorData.detail || "Erreur lors du chargement du profil");
        }

        const data = await response.json();
        console.log("Données reçues du backend:", data);
        
        setUserData(data.user);
        setProfileData(data.profile);
        setHasRecommendation(
        data.profile.recommendation !== null && 
        data.profile.recommendation !== undefined &&
        Object.keys(data.profile.recommendation || {}).length > 0
        );
        setLoading(false);
      } catch (err) {
        console.error("Erreur:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleRetakeTest = () => {
    const confirmation = window.confirm(
      "Êtes-vous sûr de vouloir refaire le test ? Vos résultats actuels seront remplacés."
    );
    if (confirmation) {
      navigate("/quiz");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    navigate("/signin");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

    // Fonction pour gérer la navigation
    const handleNavigation = (path) => {
    navigate(path);
    };

    // Fonction pour gérer les recommandations
    const handleRecommendations = () => {
    if (hasRecommendation) {
        alert("Affichage des recommandations (page à créer)");
        // TODO: navigate("/recommendations");
    } else {
        navigate("/chat");
    }
    };

    // Fonction pour les cours (coming soon)
    const handleCours = () => {
    alert("📚 Les cours seront bientôt disponibles ! 🚀");
    };

    // Vérifier si l'utilisateur est admin
    const isAdmin = () => {
    const userRole = userData?.role || localStorage.getItem("user_role");
    return userRole === "admin" || userRole === "superadmin";
    };


  if (loading) {
    return (
      <div className="userspace-page">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          fontSize: '1.2rem',
          color: '#18a89e'
        }}>
          Chargement de votre profil... 🧠
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="userspace-page">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          gap: '1rem',
          padding: '2rem'
        }}>
          <h2 style={{ color: '#ef4444' }}>Erreur</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={() => navigate("/quiz")}>
            Passer le test
          </button>
        </div>
      </div>
    );
  }

  // ✅ Récupération correcte des données depuis le backend
  const dominant = profileData.dominant;      // "Visuel", "Auditif", ou "Kinesthésique"
  const secondary = profileData.secondary;    // Deuxième profil
  const tertiary = profileData.tertiary;      // Troisième profil
  const statistics = profileData.statistics || {}; // {"Visuel": 45.2, "Auditif": 30.5, "Kinesthésique": 24.3}
  
  console.log("Profil dominant:", dominant);
  console.log("Profil secondaire:", secondary);
  console.log("Profil tertiaire:", tertiary);
  console.log("Statistiques:", statistics);

  // ✅ Calculer les pourcentages pour le donut chart
  const dominantPercentage = Math.round(statistics[dominant] || 0);
  const secondaryPercentage = Math.round(statistics[secondary] || 0);
  const tertiaryPercentage = Math.round(statistics[tertiary] || 0);

  // ✅ Calculer les positions pour le conic-gradient
  const point1 = dominantPercentage;
  const point2 = dominantPercentage + secondaryPercentage;

  return (
    <div className="userspace-page light">
      <div className="page-wrapper">
        {/* Top Navigation Bar */}
        <header className="top-nav">
          <div className="nav-left">
            <div className="logo-icon">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" />
              </svg>
            </div>
            <h2 className="logo-title">Flexilearn</h2>
          </div>
          <div className="nav-right">
            <nav className="nav-links">
            <a href="#" className="nav-link active">
                Tableau de bord
            </a>
            <a 
                href="#" 
                className="nav-link"
                onClick={(e) => {
                e.preventDefault();
                handleNavigation("/feedbackpage");
                }}
            >
                Feedback
            </a>
            <a 
                href="#" 
                className="nav-link"
                onClick={(e) => {
                e.preventDefault();
                handleRecommendations();
                }}
            >
                Recommandations
                {!hasRecommendation && (
                <span className="nav-badge">Nouveau</span>
                )}
            </a>
            <a 
                href="#" 
                className="nav-link nav-link-disabled"
                onClick={(e) => {
                e.preventDefault();
                handleCours();
                }}
            >
                Cours
                <span className="nav-badge coming-soon">Bientôt</span>
            </a>
            {isAdmin() && (
                <a 
                href="#" 
                className="nav-link"
                onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("/admin");
                }}
                >
                Admin Panel
                </a>
            )}
            </nav>
            
            {/* User Badge */}
            <div className="user-info-badge">
              <div className="user-avatar-small">{getInitials(userData?.name)}</div>
              <span className="user-name-text">{userData?.name}</span>
            </div>
            
            {/* Logout Button */}
            <button className="logout-button" onClick={handleLogout}>
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-section">
          <div className="content-container">
            {/* Hero Section */}
            <div className="hero-section">
              <div className="hero-text">
                <h1 className="hero-title">Résultats de Votre Profil d'Apprentissage</h1>
                <p className="hero-subtitle">
                  Félicitations ! Selon votre évaluation VAK, vous êtes un <span className="highlight-text">Apprenant {dominant}</span>.
                </p>
              </div>
              <div className="hero-buttons">
                <button className="btn-secondary" onClick={handleRetakeTest}>
                  <span className="material-symbols-outlined">refresh</span>
                  <span>Refaire le Test</span>
                </button>
              </div>
            </div>

            {/* Breakdown & Main Visual Card */}
            <div className="breakdown-grid">
              {/* VAK Breakdown Card */}
              <div className="breakdown-card">
                <div className="card-header">
                  <h3 className="card-title">La Répartition VAK</h3>
                  <span className="status-badge">Évaluation Terminée</span>
                </div>
                <div className="chart-section">
                  {/* Donut Chart */}
                  <div className="donut-wrapper">
                    <div 
                      className="donut-chart" 
                      style={{
                        background: `conic-gradient(
                          #18a89e 0% ${point1}%, 
                          #7dd3c0 ${point1}% ${point2}%, 
                          #d4f1f4 ${point2}% 100%
                        )`
                      }}
                    >
                      <div className="donut-center">
                        <span className="donut-percentage">{dominantPercentage}%</span>
                        <span className="donut-label">{dominant}</span>
                      </div>
                    </div>
                  </div>

                  {/* Legend & Progress Bars */}
                  <div className="legend-section">
                    <div className="progress-group">
                      {/* Dominant */}
                      <div className="progress-item">
                        <div className="progress-header">
                          <span className="progress-label">
                            <span className="dot dot-visual"></span> {dominant}
                          </span>
                          <span className="progress-value">{dominantPercentage}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill progress-visual" style={{width: `${dominantPercentage}%`}}></div>
                        </div>
                      </div>

                      {/* Secondary */}
                      <div className="progress-item">
                        <div className="progress-header">
                          <span className="progress-label">
                            <span className="dot dot-auditory"></span> {secondary}
                          </span>
                          <span className="progress-value">{secondaryPercentage}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill progress-auditory" style={{width: `${secondaryPercentage}%`}}></div>
                        </div>
                      </div>

                      {/* Tertiary */}
                      <div className="progress-item">
                        <div className="progress-header">
                          <span className="progress-label">
                            <span className="dot dot-kinesthetic"></span> {tertiary}
                          </span>
                          <span className="progress-value">{tertiaryPercentage}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill progress-kinesthetic" style={{width: `${tertiaryPercentage}%`}}></div>
                        </div>
                      </div>
                    </div>

                    <p className="quote-text">
                      {getStyleDescription(dominant)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Primary Style Summary Card */}
              <div className="style-card">
                <div className="style-bg-icon">
                  <span className="material-symbols-outlined">{getStyleIcon(dominant)}</span>
                </div>
                <h3 className="style-card-title">Style Principal</h3>
                <div className="style-info">
                  <div className="style-icon-box">
                    <span className="material-symbols-outlined">{getStyleIcon(dominant)}</span>
                  </div>
                  <h4 className="style-name">Apprenant {dominant}</h4>
                  <p className="style-desc">{getStyleDescription(dominant)}</p>
                </div>
                <ul className="style-traits">
                  {getStyleTraits(dominant).map((trait, index) => (
                    <li key={index} className="trait-item">
                      <span className="material-symbols-outlined">check_circle</span>
                      {trait}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Personalized Study Tips */}
            <div className="tips-section">
              <h2 className="section-title">
                <span className="material-symbols-outlined">lightbulb</span>
                Conseils d'Étude Recommandés
              </h2>
              <div className="tips-grid">
                {getTipsForStyle(dominant).map((tip, index) => (
                  <div key={index} className="tip-card">
                    <div className="tip-icon">
                      <span className="material-symbols-outlined">{tip.icon}</span>
                    </div>
                    <h4 className="tip-title">{tip.title}</h4>
                    <p className="tip-description">{tip.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Tools Section */}
            <div className="tools-section">
            <div className="tools-header">
                <h3 className="tools-title">Outils Suggérés pour Vous</h3>
                <p className="tools-subtitle">Fonctionnalités de Flexilearn adaptées à votre profil {dominant}</p>
            </div>
            <div className="tools-grid">
                {getToolsForStyle(dominant).map((tool, index) => (
                <div key={index} className="tool-item">
                    <div 
                    className="tool-image" 
                    style={{backgroundImage: `url("${tool.image}")`}}
                    ></div>
                    <div className="tool-content">
                    <h5 className="tool-name">{tool.name}</h5>
                    <p className="tool-desc">{tool.description}</p>
                    </div>
                </div>
                ))}
            </div>
            </div>

            {/* Bottom CTA */}
            <div className="cta-section">
        <h4 className="cta-title">Prêt à commencer votre parcours ?</h4>
        <p className="cta-text">
            Nous avons personnalisé votre tableau de bord et vos suggestions de cours en fonction de ces résultats. Plongez dans votre première leçon optimisée visuellement dès maintenant.
        </p>
        <button 
            className="cta-button cta-button-disabled" 
            disabled
            title="Fonctionnalité à venir"
        >
            Aller à Mes Cours
            <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem' }}>(Bientôt disponible)</span>
        </button>
        </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="page-footer">
          <p className="footer-copyright">© 2024 Flexilearn Educational Systems. Tous droits réservés.</p>
          <div className="footer-links">
            <a href="#" className="footer-link">Politique de Confidentialité</a>
            <a href="#" className="footer-link">Conditions d'Utilisation</a>
            <a href="#" className="footer-link">Centre d'Aide</a>
          </div>
        </footer>
      </div>
    </div>
  );
}