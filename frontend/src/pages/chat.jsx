import "../styles/chat.css";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import human from "../assets/icones/person.png";
import robot from "../assets/images/logo.png";
import questionsData from "../questions.json";

export default function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Récupérer le style dominant du 1er test depuis la page précédente
  const firstTestResult = location.state?.firstTestResult;
  const dominantStyle = firstTestResult?.dominant_style || "visuel";

  // 🔹 Ne garder que les questions correspondant au style prédit
  const questions = questionsData[dominantStyle];

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);

  const [userResponses, setUserResponses] = useState({
    visuel: [],
    auditif: [],
    kinesthesique: []
  });

  const chatEndRef = useRef(null);

  // 🔹 Scroll automatique à chaque nouveau message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Message de bienvenue + première question
  useEffect(() => {
    setMessages([
      {
        type: "bot",
        text:
          "Bonjour 🙂 Je vais vous poser quelques questions afin de mieux vous proposer des méthodes d’apprentissage."
      },
      {
        type: "bot",
        text: questions[0].question
      }
    ]);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 1️⃣ Ajouter le message utilisateur
    setMessages(prev => [...prev, { type: "user", text: input }]);

    // 2️⃣ Ajouter la réponse dans le style correspondant
    const newResponses = {
      ...userResponses,
      [dominantStyle]: [...userResponses[dominantStyle], input]
    };
    setUserResponses(newResponses);

    // 3️⃣ Afficher la prochaine question ou terminer
    const nextIndex = questionIndex + 1;

    if (nextIndex < questions.length) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { type: "bot", text: questions[nextIndex].question }
        ]);
        setQuestionIndex(nextIndex);
      }, 500);
    } else {
      // 🔹 Toutes les questions du style sont terminées
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { type: "bot", text: "Merci pour vos réponses ! Génération de vos recommandations..." }
        ]);
      }, 500);

      // 🔹 Préparer le payload pour le backend
      const payload = {
        user_answers: newResponses,
        style_result: { [dominantStyle]: newResponses[dominantStyle].length * 10 }
      };

      try {
        const response = await fetch("http://localhost:8000/recommendation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          console.error("Erreur API :", response.statusText);
          return;
        }

        const data = await response.json();

        // 🔹 Redirection vers la page recommandations
        navigate("/recommandation", { state: { recommendationsData: data } });
      } catch (error) {
        console.error("Erreur backend :", error);
      }
    }

    // 4️⃣ Vider l'input
    setInput("");
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <div className="header-title">Assistant IA</div>
        <div className="header-right">
          <span>Connecté</span>
          <img src={robot} className="header-icon" />
        </div>
      </div>

      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`msg-row ${msg.type}`}>
            {msg.type === "user" && <img src={human} className="avatar" />}
            <div className={`bubble ${msg.type}`}>{msg.text}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input">
        {questionIndex >= questions.length ? (
          <button
            className="reco-btn"
            onClick={() =>
              navigate("/recommandation", { state: { recommendationsData: null } })
            }
          >
            Voir recommandation
          </button>
        ) : (
          <div className="input-box">
            <input
              placeholder="Répondre..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
            />
            <span className="send-icon" onClick={handleSend}>
              ➤
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
