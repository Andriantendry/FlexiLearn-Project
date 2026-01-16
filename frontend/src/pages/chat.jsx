import "../styles/chat.css";
import React, { useState, useEffect, useRef } from "react";
import human from "../assets/icones/person.png";
import robot from "../assets/images/logo.png";

const botMessages = [
  "Bonjour, comment puis-je vous aider aujourd'hui ?",
  "Pouvez-vous me donner plus de détails ?",
  "Merci ! Voici une dernière question avant recommandation.",
];

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [botIndex, setBotIndex] = useState(0); // quel message bot envoyer
  const [userCount, setUserCount] = useState(0); // nombre de réponses user

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages([{ type: "bot", text: botMessages[0] }]);
    setBotIndex(1);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;

    // message user
    setMessages((prev) => [...prev, { type: "user", text: input }]);
    setInput("");
    setUserCount((prev) => prev + 1);

    // message bot suivant
    if (botIndex < botMessages.length) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: botMessages[botIndex] },
        ]);
        setBotIndex((prev) => prev + 1);
      }, 500);
    }
  };

  const handleReco = () => {
    console.log("Recommandation affichée !");
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
        {userCount >= 3 ? (
          <button className="reco-btn" onClick={handleReco}>
            Voir recommandation
          </button>
        ) : (
          <div className="input-box">
            <input
              placeholder="Répondre..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
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
