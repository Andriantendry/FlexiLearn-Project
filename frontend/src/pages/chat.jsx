import "../styles/chat.css";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import human from "../assets/icones/person.png";
import robot from "../assets/images/logo.png";

export default function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sessionId] = useState(() => uuidv4());
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [profile, setProfile] = useState("");
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chatEndRef = useRef(null);

  // Scroll automatique
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Vérification et initialisation
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      navigate("/signin");
      return;
    }

    // ✅ Récupérer le profil depuis location.state
    const receivedProfile = location.state?.profile;
    
    console.log("Profile reçu depuis quiz:", receivedProfile);
    console.log("Type du profile:", typeof receivedProfile);

    // ✅ Validation stricte
    if (!receivedProfile || typeof receivedProfile !== 'string') {
      console.error("Profil invalide ou manquant, redirection vers quiz");
      navigate("/quiz");
      return;
    }

    setProfile(receivedProfile);
  }, [navigate, location.state]);

  // Chargement des questions
  useEffect(() => {
    if (!profile) return; // Attendre que le profil soit défini

    const fetchStart = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Envoi au backend:", { 
          session_id: sessionId, 
          profile: profile 
        });

        const res = await fetch("http://localhost:8000/chat/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            session_id: sessionId, 
            profile: profile  // ✅ Maintenant c'est bien une string
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Erreur serveur:", text);
          throw new Error(`HTTP ${res.status}: ${text}`);
        }

        const data = await res.json();
        console.log("Données reçues:", data);

        setMessages([{ type: "bot", text: data.question }]);
        setCurrentStep(data.step);
        setTotalSteps(data.total);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setError(err.message);
        setMessages([{ 
          type: "bot", 
          text: "Une erreur s'est produite. Veuillez réessayer." 
        }]);
        setLoading(false);
      }
    };

    fetchStart();
  }, [profile, sessionId]);

  const handleSend = async () => {
    if (!input.trim() || quizFinished) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setInput("");

    try {
      const res = await fetch("http://localhost:8000/chat/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          session_id: sessionId, 
          answer: userMessage 
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const data = await res.json();

      if (data.question) {
        setMessages((prev) => [...prev, { type: "bot", text: data.question }]);
        setCurrentStep(data.step);
        setTotalSteps(data.total);
      } else if (data.recommendations) {
        setQuizFinished(true);
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: "✅ Quiz terminé ! Appuyez sur 'Voir recommandations'." },
        ]);
        localStorage.setItem("recommendations", data.recommendations);
      }
    } catch (err) {
      console.error("Erreur:", err);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Erreur lors de l'envoi. Réessayez." },
      ]);
    }
  };

  const handleReco = () => {
    const recommendations = localStorage.getItem("recommendations") || "";
    navigate("/quiz-result", { state: { profile, recommendations } });
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/signin");
  };

  if (loading) {
    return (
      <div className="chat-wrapper">
        <div className="chat-header">
          <div className="header-title">Assistant IA</div>
        </div>
        <div className="chat-window" style={{
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100%'
        }}>
          <p>Chargement des questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-wrapper">
        <div className="chat-header">
          <div className="header-title">Erreur</div>
        </div>
        <div className="chat-window" style={{
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100%',
          padding: '20px'
        }}>
          <p style={{color: 'red', marginBottom: '20px'}}>❌ {error}</p>
          <button onClick={() => navigate("/quiz")}>
            Retour au quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <div className="header-title">Assistant IA - Profil {profile}</div>
        <div className="header-right">
          <span>Question {currentStep}/{totalSteps}</span>
          <img src={robot} className="header-icon" alt="Robot" />
          <button onClick={handleLogout} style={{marginLeft: '10px'}}>
            Déconnexion
          </button>
        </div>
      </div>

      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`msg-row ${msg.type}`}>
            {msg.type === "user" && <img src={human} className="avatar" alt="User" />}
            {msg.type === "bot" && <img src={robot} className="avatar" alt="Bot" />}
            <div className={`bubble ${msg.type}`}>{msg.text}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input">
        {quizFinished ? (
          <button className="reco-btn" onClick={handleReco}>
            Voir recommandations
          </button>
        ) : (
          <div className="input-box">
            <input
              placeholder="Répondre..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
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