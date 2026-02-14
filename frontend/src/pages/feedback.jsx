import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/feedback.css";

export default function FeedbackPage() {
  const navigate = useNavigate();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState("");
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [includeEmail, setIncludeEmail] = useState(false);
  const [helpfulness, setHelpfulness] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    { id: "ui", label: "Interface utilisateur", icon: "🎨" },
    { id: "accuracy", label: "Précision des recommandations", icon: "🎯" },
    { id: "performance", label: "Performance", icon: "⚡" },
    { id: "features", label: "Fonctionnalités", icon: "✨" },
    { id: "bug", label: "Bug / Problème technique", icon: "🐛" },
    { id: "other", label: "Autre", icon: "💬" }
  ];

  const validateForm = () => {
    if (rating === 0) {
      setError("⚠️ Veuillez sélectionner une note.");
      return false;
    }
    
    if (!category) {
      setError("⚠️ Veuillez choisir une catégorie.");
      return false;
    }
    
    if (!feedback.trim()) {
      setError("⚠️ Veuillez entrer votre commentaire.");
      return false;
    }
    
    if (feedback.trim().length < 10) {
      setError("⚠️ Votre commentaire doit contenir au moins 10 caractères.");
      return false;
    }
    
    if (feedback.trim().length > 1000) {
      setError("⚠️ Votre commentaire ne peut pas dépasser 1000 caractères.");
      return false;
    }
    
    if (includeEmail && !email.trim()) {
      setError("⚠️ Veuillez entrer votre email ou décocher l'option.");
      return false;
    }
    
    if (includeEmail && !isValidEmail(email)) {
      setError("⚠️ Veuillez entrer un email valide.");
      return false;
    }

    if (!helpfulness){
      setError("⚠️ Veuillez indiquer si cette méthode vous a été utile.")
      return false;
    }
    
    return true;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const userId = localStorage.getItem("user_id");
      
      const feedbackData = {
        user_id: userId ? parseInt(userId) : null,
        rating: rating,
        category: category,
        feedback_text: feedback.trim(),
        email: includeEmail ? email.trim() : null,
        method_helpfulness: helpfulness || null,
        created_at: new Date().toISOString()
      };
      
      const response = await fetch("http://localhost:8000/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erreur lors de l'envoi");
      }
      
      setSubmitted(true);
      
      // Redirection après 3 secondes
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
      
    } catch (err) {
      console.error("Erreur:", err);
      setError(`❌ ${err.message}`);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRating(0);
    setCategory("");
    setFeedback("");
    setEmail("");
    setIncludeEmail(false);
    setError("");
    setHelpfulness("");
  };

  if (submitted) {
    return (
      <div className="feedback-container">
        <div className="success-animation">
          <div className="success-checkmark">
            <div className="check-icon">
              <span className="icon-line line-tip"></span>
              <span className="icon-line line-long"></span>
              <div className="icon-circle"></div>
              <div className="icon-fix"></div>
            </div>
          </div>
          <h1 className="success-title">Merci pour votre feedback !</h1>
          <p className="success-message">
            Votre avis nous aide à améliorer l'expérience pour tous les utilisateurs.
          </p>
          <div className="success-redirect">
            <span className="spinner">⏳</span>
            Redirection en cours...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <header className="feedback-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Retour
        </button>
        <div className="header-content">
          <h1>💭 Partagez votre expérience</h1>
          <p>Votre feedback est précieux pour nous aider à améliorer FlexiLearn</p>
        </div>
      </header>

      <div className="feedback-wrapper">
        <form className="feedback-form" onSubmit={handleSubmit}>
          
          {/* Note par étoiles */}
          <div className="form-section">
            <label className="section-label">
              <span className="label-icon">⭐</span>
              Comment évaluez-vous votre expérience ?
            </label>
            <div className="rating-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star ${star <= (hoverRating || rating) ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && (
              <div className="rating-label">
                {rating === 1 && "😞 Très insatisfait"}
                {rating === 2 && "😕 Insatisfait"}
                {rating === 3 && "😐 Neutre"}
                {rating === 4 && "😊 Satisfait"}
                {rating === 5 && "🤩 Très satisfait"}
              </div>
            )}
          </div>

          {/* Catégorie */}
          <div className="form-section">
            <label className="section-label">
              <span className="label-icon">🏷️</span>
              Quelle est la catégorie de votre feedback ?
            </label>
            <div className="categories-grid">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-btn ${category === cat.id ? 'active' : ''}`}
                  onClick={() => setCategory(cat.id)}
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-label">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Commentaire */}
          <div className="form-section">
            <label className="section-label">
              <span className="label-icon">✍️</span>
              Partagez vos commentaires ou suggestions
            </label>
            <textarea
              className="feedback-textarea"
              placeholder="Décrivez votre expérience, suggérez des améliorations, signalez un problème..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              maxLength={1000}
            />
            <div className="char-count">
              {feedback.length} / 1000 caractères
              {feedback.length < 10 && feedback.length > 0 && (
                <span className="char-warning"> (minimum 10)</span>
              )}
            </div>
          </div>
          
          {/* Question sur l'utilité de la méthode */}
          <div className="form-section">
            <label className="section-label">
              <span className="label-icon">💡</span>
              Cette méthode vous a‑t‑elle été utile ?
            </label>
            <div className="helpfulness-group">
              {["oui", "un peu", "pas du tout"].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`helpfulness-btn ${helpfulness === value ? "active" : ""}`}
                  onClick={() => setHelpfulness(value)}
                >
                  {value === "oui" && "👍 Oui"}
                  {value === "un peu" && "🤏 Un peu"}
                  {value === "pas du tout" && "👎 Pas du tout"}
                </button>
              ))}
            </div>
          </div>

          {/* Email optionnel */}
          <div className="form-section">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={includeEmail}
                onChange={(e) => setIncludeEmail(e.target.checked)}
              />
              <span className="checkbox-label">
                📧 Je souhaite être contacté pour un suivi (optionnel)
              </span>
            </label>
            
            {includeEmail && (
              <div className="email-input-wrapper">
                <input
                  type="email"
                  className="email-input"
                  placeholder="votre.email@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Erreur */}
          {error && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-reset"
              onClick={handleReset}
              disabled={loading}
            >
              🔄 Réinitialiser
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner">⏳</span>
                  Envoi en cours...
                </>
              ) : (
                <>
                  📤 Envoyer le feedback
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info card */}
        <div className="info-card">
          <h3>💡 Pourquoi votre feedback est important ?</h3>
          <ul>
            <li>📊 Nous aide à comprendre vos besoins</li>
            <li>🚀 Améliore continuellement l'application</li>
            <li>🎯 Priorise les fonctionnalités les plus demandées</li>
            <li>🔧 Résout rapidement les problèmes techniques</li>
          </ul>
          <div className="privacy-note">
            🔒 Vos données sont traitées de manière confidentielle
          </div>
        </div>
      </div>
    </div>
  );
}