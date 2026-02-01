import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/quiz.css";

export default function Quiz() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  /* ===== Vérif connexion ===== */
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) navigate("/signin");
  }, [navigate]);

  /* ===== Chargement questions ===== */
  useEffect(() => {
    fetch("http://localhost:8000/api/quiz")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Erreur chargement quiz");
        setLoading(false);
      });
  }, []);

  /* ===== Sélection réponse ===== */
  const handleSelect = (letter) => {
    setAnswers({ ...answers, [current + 1]: letter.toUpperCase() });
  };

  /* ===== Suivant / Soumission ===== */
  const handleNext = () => {
    if (!answers[current + 1]) {
      alert("Choisis une réponse avant de continuer 😊");
      return;
    }

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      finishQuiz();
    }
  };

  /* ===== Fin du quiz → redirection chat ===== */
  const finishQuiz = async () => {
  if (Object.keys(answers).length !== 20) {
    alert("Toutes les questions doivent être répondues (20/20)");
    return;
  }

  const responsesArray = Array.from({ length: 20 }, (_, i) => answers[i + 1]);
  console.log("Réponses envoyées au chat :", responsesArray);

  try {
    const popup = document.createElement("div");
    popup.textContent = "Enregistrement de vos réponses...";
    popup.style.cssText =
      "position:fixed;top:30%;left:50%;transform:translateX(-50%);background-color:#2196F3;color:white;padding:15px 25px;border-radius:8px;z-index:9999;font-weight:bold;";
    document.body.appendChild(popup);

    const userId = localStorage.getItem("user_id");

    const res = await fetch(`http://127.0.0.1:8000/api/predict?user_id=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responses: responsesArray }),
    });

    if (!res.ok) throw new Error("Erreur serveur lors de la prédiction");

    const result = await res.json();
    console.log("Profil prédit :", result.result);

    popup.textContent = "✅ Profil enregistré avec succès !";

    setTimeout(() => {
      popup.remove();
      // ✅ FIX : Envoyer uniquement le code du profil (string)
      navigate("/chat", { 
        state: { 
          answers: responsesArray, 
          profile: result.result.Profil  // ✅ Juste "VA", "AK", etc.
        } 
      });
    }, 1500);
  } catch (err) {
    console.error(err);
    alert("Erreur lors de l'enregistrement du profil. Réessayez.");
  }
};

  /* ===== Déconnexion ===== */
  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.clear();
    sessionStorage.clear();
    navigate("/signin");
  };

  /* ===== Loading ===== */
  if (loading) {
    return (
      <div className="quiz-container">
        <div className="quiz-content">Chargement du quiz...</div>
      </div>
    );
  }

  /* ===== AFFICHAGE QUIZ ===== */
  const q = questions[current];
  const progressPercent =
    questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0;

  return (
    <div className="quiz-container">
      <header className="quiz-top">
        <div className="quiz-brand">🎓 FlexiLearn</div>
        <h1 className="quiz-title">Test de Profil d'Apprentissage</h1>
        <p className="quiz-subtitle">
          Répondez honnêtement à chaque question pour obtenir votre profil le
          plus précis
        </p>
      </header>
      <div className="quiz-wrapper">
        <div className="progress-card">
          <span>
            Question {current + 1} sur {questions.length}
          </span>
          <span>{Math.round(progressPercent)}%</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="quiz-card">
          <span className="question-badge">Question {current + 1}</span>
          <h2 className="question">{q?.Question}</h2>

          <div className="options">
            {["A", "B", "C"].map((letter) => (
              <div
                key={letter}
                className={`option-card ${
                  answers[current + 1] === letter ? "selected" : ""
                }`}
                onClick={() => handleSelect(letter)}
              >
                <div className="option-icon">{letter}</div>
                <div className="option-text">{q?.[`Option_${letter}`]}</div>
              </div>
            ))}
          </div>

          <button className="next-btn" onClick={handleNext}>
            {current === questions.length - 1
              ? "Finaliser mon test et commencer le chat"
              : "Suivant →"}
          </button>
        </div>
      </div>
    </div>
  );
}
