import "../styles/chat.css";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import human from "../assets/icones/person.png";
import robot from "../assets/images/logo.png";
import questionsData from "../questions.json";

export default function ChatPage({ firstTestResult }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const categories = ["visuel", "auditif", "kinesthesique"];
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Message initial + première question
    setMessages([
      {
        type: "bot",
        text:
          "Bonjour 🙂 Je vais vous poser quelques questions afin de mieux vous proposer des méthodes d’apprentissage."
      },
      {
        type: "bot",
        text: questionsData[categories[0]][0].question
      }
    ]);
  }, []);

  const [userResponses, setUserResponses] = useState({
    visuel: [],
    auditif: [],
    kinesthesique: []
  });

 const handleSend = async () => {
  if (!input.trim()) return;

  const currentCategory = categories[categoryIndex];

  // 1️⃣ Ajouter le message utilisateur
  setMessages(prev => [...prev, { type: "user", text: input }]);

  // 2️⃣ Créer les réponses mises à jour
  const newResponses = {
    ...userResponses,
    [currentCategory]: [...userResponses[currentCategory], input]
  };
  setUserResponses(newResponses);

  // 3️⃣ Préparer la prochaine question
  let nextQuestionIndex = questionIndex + 1;
  let nextCategoryIndex = categoryIndex;

  if (nextQuestionIndex >= questionsData[currentCategory].length) {
    nextCategoryIndex += 1;
    nextQuestionIndex = 0;
  }

  // 4️⃣ Afficher prochaine question ou message final
  if (nextCategoryIndex < categories.length) {
    const nextQuestion =
      questionsData[categories[nextCategoryIndex]][nextQuestionIndex].question;
    setTimeout(() => {
      setMessages(prev => [...prev, { type: "bot", text: nextQuestion }]);
      setQuestionIndex(nextQuestionIndex);
      setCategoryIndex(nextCategoryIndex);
    }, 500);
  } else {
    // Dernière question terminée
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { type: "bot", text: "Merci pour vos réponses ! Génération de vos recommandations..." }
      ]);
    }, 500);

    // 🔹 Calculer les scores en % pour Gemini
    const calculateScores = (responses) => {
      const result = { visuel: 0, auditif: 0, kine: 0 };
      const total = Object.values(responses).reduce((sum, arr) => sum + arr.length, 0);
      if (total === 0) return result;
      result.visuel = Math.round((responses.visuel?.length || 0) / total * 100);
      result.auditif = Math.round((responses.auditif?.length || 0) / total * 100);
      result.kine = Math.round((responses.kinesthesique?.length || 0) / total * 100);
      return result;
    };

    const finalScores = calculateScores(newResponses);

    const payload = {
      user_answers: newResponses,
      style_result: finalScores
    };

    console.log("Payload envoyé au backend :", JSON.stringify(payload, null, 2));

    // 5️⃣ Appel backend
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
      console.log("Recommandations Gemini reçues :", data);

      // 6️⃣ Redirection vers page recommandations
      navigate("/recommandation", { state: { recommendationsData: data } });
    } catch (error) {
      console.error("Erreur lors de l'appel backend :", error);
    }
  }

  // 7️⃣ Vider l'input
  setInput("");
};


  const handleReco = () => {
    // Si l'utilisateur clique sur "Voir recommandation" manuellement
    navigate("/recommandation", { state: { recommendationsData: null } });
  };

  useEffect(() => {
    document.body.classList.add("page-chat");
    return () => document.body.classList.remove("page-chat");
  }, []);

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
        {categoryIndex >= categories.length ? (
          <button className="reco-btn" onClick={handleReco}>
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
            <span className="send-icon" onClick={handleSend}>➤</span>
          </div>
        )}
      </div>
    </div>
  );
}
