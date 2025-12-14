import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/quiz.css";
import logo from "../assets/images/logo.jpg";

export default function Quiz() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null); // ← Résultat ici

  // Vérif connexion
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) navigate("/signin");
  }, [navigate]);

  // Chargement questions
  useEffect(() => {
    fetch("http://localhost:8000/api/quiz")
      .then(res => res.json())
      .then(data => {
        setQuestions(data.questions || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Erreur chargement quiz");
        setLoading(false);
      });
  }, []);

  const handleSelect = (letter) => {
    setAnswers({ ...answers, [current + 1]: letter });
  };

  const handleNext = () => {
    if (!answers[current + 1]) {
      alert("Choisis une réponse avant de continuer ! 😊");
      return;
    }

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      const data = await res.json();
      console.log("Résultat reçu :", data); // ← Vérifie dans la console

      if (res.ok && data) {
        setResult(data); // ← Force l'affichage
      } else {
        alert("Erreur soumission – vérifie la console");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur lors de la soumission");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    navigate("/signin");
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="quiz-content">Chargement du quiz...</div>
      </div>
    );
  }

  // AFFICHAGE RÉSULTAT CORRIGÉ
  if (result) {
  const profile = result.profile || "Mixte";
  const stats = result.statistiques || {};

  const handleSaveAndLogout = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("Erreur : utilisateur non identifié");
      navigate("/signin");
      return;
    }

    const payload = {
      id: parseInt(userId),
      answers: answers, // Les réponses complètes du quiz
      profile: profile,
      statistiques: stats
    };

    try {
      const res = await fetch("http://localhost:8000/user/enregistrement des résultats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Résultat sauvegardé avec succès ! 🎉 Merci d'avoir découvert ton style d'apprentissage.");
      } else {
        alert("Erreur sauvegarde : " + (data.message || "Vérifie la console"));
        console.error(data);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de la sauvegarde");
    } finally {
      localStorage.removeItem("user_id");
      navigate("/signin");
    }
  };

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <img src={logo} alt="FlexiLearn" className="quiz-logo" />
        <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
      </header>

      <div className="quiz-content">
        <div className="quiz-card result-card">
          <h2 className="result-main-title">Ton style d'apprentissage principal</h2>

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
  // Quiz normal
  const q = questions[current];
  const progressPercent = questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0;

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <img src={logo} alt="FlexiLearn" className="quiz-logo" />
        <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
      </header>

      <div className="quiz-content">
        <div className="quiz-card">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="progress-text">Question {current + 1} / {questions.length}</div>

          <h2 className="question">{q?.Question || "Chargement..."}</h2>

          <div className="options">
            {["A", "B", "C", "D"].map(letter => (
              <div
                key={letter}
                className={`option-card ${answers[current + 1] === letter ? "selected" : ""}`}
                onClick={() => handleSelect(letter)}
              >
                <div className={`custom-radio ${answers[current + 1] === letter ? "selected" : ""}`} />
                <div className="option-text">{q?.[`Option_${letter}`] || ""}</div>
              </div>
            ))}
          </div>

          <button className="next-btn" onClick={handleNext}>
            {current === questions.length - 1 ? "Voir mon résultat" : "Suivant"}
          </button>
        </div>
      </div>
    </div>
  );
}