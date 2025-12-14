import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/quiz.css";
import logo_image from "../assets/images/logo.png";

export default function Quiz() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  // 🔐 Vérif connexion
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      navigate("/signin");
    }
  }, [navigate]);

  // 📥 Charger questions
useEffect(() => {
  fetch("http://localhost:8000/api/quiz")
    .then((res) => res.json())
    .then((data) => {
      setQuestions(data.questions);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      alert("Erreur chargement quiz");
    });
}, []);

  const handleSelect = (letter) => {
    setAnswers({ ...answers, [current + 1]: letter });
  };

  const handleNext = () => {
    if (!answers[current + 1]) {
      alert("Choisis une réponse");
      return;
    }

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
  const res = await fetch("http://localhost:8000/api/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });

  const data = await res.json();
  setResult(data);
   };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    navigate("/signin");
  };

  if (loading) return <p style={{ textAlign: "center" }}>Chargement...</p>;

  if (result) {
    return (
      <div className="quiz-container">
        <header className="quiz-header">
          <img src={logo_image} className="quiz-logo" />
          <h1>Learn<span>Flow</span></h1>
          <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
        </header>

        <div className="quiz-content">
          <div className="score-section">
            <h2>Profil détecté</h2>
            <p className="final-score">{result.profile}</p>

            <h3>Statistiques</h3>
            {Object.entries(result.statistiques).map(([k, v]) => (
              <p key={k}>{k} : {v}%</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <img src={logo_image} className="quiz-logo" />
        <h1>Learn<span>Flow</span></h1>
        <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
      </header>

      <div className="quiz-content">
        <div className="question-section">
          <div className="progress">
            Question {current + 1} / {questions.length}
          </div>

          <h2>{q.Question}</h2>

          {["A", "B", "C", "D"].map((l) => (
            <label key={l} className="option-label">
              <input
                type="radio"
                checked={answers[current + 1] === l}
                onChange={() => handleSelect(l)}
              />
              {q[`Option_${l}`]}
            </label>
          ))}

          <button className="next-btn" onClick={handleNext}>
            {current === questions.length - 1 ? "Terminer" : "Suivant"}
          </button>
        </div>
      </div>
    </div>
  );
}
