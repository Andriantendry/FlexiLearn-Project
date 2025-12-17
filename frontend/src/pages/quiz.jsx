import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/quiz.css";
import logo from "../assets/images/logo.png";
import QuizResult from "./quiz_result";

export default function Quiz() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

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
    setAnswers({ ...answers, [current + 1]: letter });
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
      submitQuiz();
    }
  };

  /* ===== Soumission quiz ===== */
  const submitQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      const data = await res.json();
      if (res.ok && data) {
        setResult(data);
      } else {
        alert("Erreur soumission");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  /* ===== Déconnexion ===== */
  const handleLogout = () => {
    localStorage.removeItem("user_id");
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

  /* ===== AFFICHAGE RÉSULTAT ===== */
  if (result) {
    return (
      <QuizResult result={result} answers={answers} onLogout={handleLogout} />
    );
  }

  /* ===== AFFICHAGE QUIZ ===== */
  const q = questions[current];
  const progressPercent =
    questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0;

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <img src={logo} alt="FlexiLearn" className="quiz-logo" />
        <button className="logout-btn" onClick={handleLogout}>
          Déconnexion
        </button>
      </header>

      <div className="quiz-content">
        <div className="quiz-card">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="progress-text">
            Question {current + 1} / {questions.length}
          </div>

          <h2 className="question">{q?.Question}</h2>

          <div className="options">
            {["A", "B", "C", "D"].map((letter) => (
              <div
                key={letter}
                className={`option-card ${
                  answers[current + 1] === letter ? "selected" : ""
                }`}
                onClick={() => handleSelect(letter)}
              >
                <div
                  className={`custom-radio ${
                    answers[current + 1] === letter ? "selected" : ""
                  }`}
                />
                <div className="option-text">{q?.[`Option_${letter}`]}</div>
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
