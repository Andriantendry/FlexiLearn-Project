import React, { useState, useRef, useEffect } from "react";
import "../styles/cours.css";

// ─── DATA ────────────────────────────────────────────────────────────────
const ICON_OPTIONS = [
  { value: "psychology", label: "Sciences" },
  { value: "language", label: "Langue" },
  { value: "brush", label: "Art" },
  { value: "calculate", label: "Maths" },
  { value: "history_edu", label: "Histoire" },
  { value: "biotech", label: "Biologie" },
  { value: "computer", label: "Informatique" },
  { value: "music_note", label: "Musique" },
  { value: "sports_soccer", label: "Sport" },
  { value: "camera", label: "Photo" },
];

const STATUS_OPTIONS = [
  { value: "ajoute", label: "Ajouté" },
  { value: "en-cours", label: "En cours" },
  { value: "termine", label: "Terminé" },
];

const ICON_BG_MAP = {
  psychology: "icon-orange",
  language: "icon-slate",
  brush: "icon-mint",
  calculate: "icon-orange",
  history_edu: "icon-slate",
  biotech: "icon-mint",
  computer: "icon-orange",
  music_note: "icon-mint",
  sports_soccer: "icon-slate",
  camera: "icon-orange",
};

const STATUS_LABELS = {
  "en-cours": "En cours",
  ajoute: "Ajouté",
  termine: "Terminé",
};

const FILTERS = ["Tous", "Ajouté", "En cours", "Terminé"];
const FILTER_MAP = { Tous: null, Ajouté: "ajoute", "En cours": "en-cours", Terminé: "termine" };

const METHODS = [
  { icon: "visibility", label: "Visuel", detail: "Diagrammes de Feynman & Vidéos", bg: "method-indigo" },
  { icon: "headphones", label: "Auditif", detail: 'Podcasts "Science en vrac"', bg: "method-pink" },
  { icon: "touch_app", label: "Kinesthésique", detail: "Calculs matriciels & Labo virtuel", bg: "method-amber" },
];

const INITIAL_SUBJECTS = [
  { id: 1, title: "Physique Quantique", description: "Introduction aux particules et ondes", status: "en-cours", icon: "psychology", iconBg: "icon-orange", modifiedLabel: "Modifié il y a 2h", modifiedIcon: "schedule", active: true },
  { id: 2, title: "Langue Japonaise", description: "Bases du Kanji et grammaire JLPT N5", status: "ajoute", icon: "language", iconBg: "icon-slate", modifiedLabel: "Hier", modifiedIcon: "schedule", active: false },
  { id: 3, title: "Théorie des Couleurs", description: "Harmonie et psychologie visuelle", status: "termine", icon: "brush", iconBg: "icon-mint", modifiedLabel: "3 jours ago", modifiedIcon: "check_circle", active: false, done: true },
];

const INITIAL_BOT_MESSAGES = [
  { id: 1, from: "bot", text: "Bonjour ! Je suis FlexiBot 👋 Je peux adapter vos méthodes d'apprentissage à votre rythme. Que souhaitez-vous modifier ?" },
];

const BOT_REPLIES = [
  "Je prends note ! Je vais adapter votre parcours en conséquence.",
  "Bonne idée ! Je recommande d'intégrer plus de pratique active dans votre routine.",
  "Compris. Voulez-vous que j'ajuste aussi la fréquence de vos sessions ?",
  "Je peux vous proposer des exercices alternatifs mieux adaptés à votre profil kinesthésique.",
  "Parfait ! J'ai mis à jour vos recommandations. Continuez comme ça !",
];

// ─── ADD SUBJECT MODAL ───────────────────────────────────────────────────
const MODAL_TABS = ["Informations", "Objectifs", "Méthodes"];

const EMPTY_FORM = {
  title: "",
  description: "",
  status: "ajoute",
  icon: "psychology",
  objectif: "",
  echeance: "",
  priorite: "normale",
  methodes: [],
  notes: "",
};

const PRIORITE_OPTIONS = [
  { value: "faible", label: "Faible", color: "#64748b" },
  { value: "normale", label: "Normale", color: "#18a89e" },
  { value: "haute", label: "Haute", color: "#f59e0b" },
  { value: "urgente", label: "Urgente", color: "#ef4444" },
];

const METHODE_OPTIONS = [
  { value: "flashcards", icon: "style", label: "Flashcards" },
  { value: "videos", icon: "play_circle", label: "Vidéos" },
  { value: "pratique", icon: "sports_esports", label: "Pratique" },
  { value: "lecture", icon: "menu_book", label: "Lecture" },
  { value: "podcast", icon: "podcasts", label: "Podcast" },
  { value: "groupe", icon: "group", label: "Groupe d'étude" },
];

function AddSubjectModal({ onClose, onAdd }) {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const toggleMethode = (val) => {
    setForm((f) => ({
      ...f,
      methodes: f.methodes.includes(val)
        ? f.methodes.filter((m) => m !== val)
        : [...f.methodes, val],
    }));
  };

  const validateTab = () => {
    const errs = {};
    if (tab === 0) {
      if (!form.title.trim()) errs.title = "Le titre est requis.";
      if (!form.description.trim()) errs.description = "La description est requise.";
    }
    if (tab === 1) {
      if (!form.objectif.trim()) errs.objectif = "Définissez un objectif.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextTab = () => { if (validateTab()) setTab((t) => t + 1); };
  const prevTab = () => setTab((t) => t - 1);

  const handleSubmit = () => {
    if (!validateTab()) return;
    const newSubject = {
      id: Date.now(),
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      icon: form.icon,
      iconBg: ICON_BG_MAP[form.icon] || "icon-orange",
      modifiedLabel: "À l'instant",
      modifiedIcon: "schedule",
      active: false,
      done: false,
    };
    setSuccess(true);
    setTimeout(() => {
      onAdd(newSubject);
      onClose();
    }, 1200);
  };

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-header-icon">
              <span className="material-symbols-outlined">add_circle</span>
            </div>
            <div>
              <h2 className="modal-title">Nouveau Sujet</h2>
              <p className="modal-subtitle">Ajoutez un sujet à votre liste d'apprentissage</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="modal-progress">
          <div className="modal-progress-fill" style={{ width: `${((tab + 1) / MODAL_TABS.length) * 100}%` }} />
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          {MODAL_TABS.map((t, i) => (
            <button
              key={t}
              className={`modal-tab${tab === i ? " modal-tab--active" : ""}${i < tab ? " modal-tab--done" : ""}`}
              onClick={() => i < tab && setTab(i)}
            >
              <span className="modal-tab-num">
                {i < tab ? <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>check</span> : i + 1}
              </span>
              {t}
            </button>
          ))}
        </div>

        {/* Success screen */}
        {success ? (
          <div className="modal-success">
            <div className="modal-success-icon">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <h3>Sujet ajouté avec succès !</h3>
            <p>Votre nouveau sujet apparaît maintenant dans votre liste.</p>
          </div>
        ) : (
          <>
            {/* Tab 0 — Informations */}
            {tab === 0 && (
              <div className="modal-body animate-tab">
                {/* Icon picker */}
                <div className="modal-field">
                  <label className="modal-label">Icône du sujet</label>
                  <div className="icon-picker">
                    {ICON_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`icon-pick-btn${form.icon === opt.value ? " icon-pick-btn--active" : ""}`}
                        onClick={() => set("icon", opt.value)}
                        title={opt.label}
                      >
                        <span className="material-symbols-outlined">{opt.value}</span>
                        <span className="icon-pick-label">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div className="modal-field">
                  <label className="modal-label" htmlFor="m-title">Titre <span className="required">*</span></label>
                  <input
                    id="m-title"
                    className={`modal-input${errors.title ? " modal-input--error" : ""}`}
                    type="text"
                    placeholder="Ex : Algèbre Linéaire, Espagnol débutant…"
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                  />
                  {errors.title && <span className="modal-error">{errors.title}</span>}
                </div>

                {/* Description */}
                <div className="modal-field">
                  <label className="modal-label" htmlFor="m-desc">Description <span className="required">*</span></label>
                  <textarea
                    id="m-desc"
                    className={`modal-textarea${errors.description ? " modal-input--error" : ""}`}
                    placeholder="Décrivez brièvement ce que vous souhaitez apprendre…"
                    rows={3}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                  />
                  {errors.description && <span className="modal-error">{errors.description}</span>}
                </div>

                {/* Status */}
                <div className="modal-field">
                  <label className="modal-label">Statut initial</label>
                  <div className="status-picker">
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        className={`status-pick-btn status-pick-${s.value}${form.status === s.value ? " status-pick-btn--active" : ""}`}
                        onClick={() => set("status", s.value)}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 1 — Objectifs */}
            {tab === 1 && (
              <div className="modal-body animate-tab">
                <div className="modal-field">
                  <label className="modal-label" htmlFor="m-obj">Objectif principal <span className="required">*</span></label>
                  <textarea
                    id="m-obj"
                    className={`modal-textarea${errors.objectif ? " modal-input--error" : ""}`}
                    placeholder="Ex : Maîtriser les bases de la physique quantique en 3 mois…"
                    rows={3}
                    value={form.objectif}
                    onChange={(e) => set("objectif", e.target.value)}
                  />
                  {errors.objectif && <span className="modal-error">{errors.objectif}</span>}
                </div>

                <div className="modal-row">
                  <div className="modal-field">
                    <label className="modal-label" htmlFor="m-ech">Date d'échéance</label>
                    <input
                      id="m-ech"
                      className="modal-input"
                      type="date"
                      value={form.echeance}
                      onChange={(e) => set("echeance", e.target.value)}
                    />
                  </div>
                  <div className="modal-field">
                    <label className="modal-label">Priorité</label>
                    <div className="priorite-picker">
                      {PRIORITE_OPTIONS.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          className={`priorite-btn${form.priorite === p.value ? " priorite-btn--active" : ""}`}
                          style={form.priorite === p.value ? { borderColor: p.color, color: p.color, background: p.color + "18" } : {}}
                          onClick={() => set("priorite", p.value)}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="modal-field">
                  <label className="modal-label" htmlFor="m-notes">Notes personnelles</label>
                  <textarea
                    id="m-notes"
                    className="modal-textarea"
                    placeholder="Ressources, liens utiles, remarques…"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                  />
                </div>

                {/* Objectif tip */}
                <div className="modal-tip">
                  <span className="material-symbols-outlined">lightbulb</span>
                  <p>Un bon objectif est <strong>spécifique</strong>, <strong>mesurable</strong> et assorti d'une <strong>date</strong>.</p>
                </div>
              </div>
            )}

            {/* Tab 2 — Méthodes */}
            {tab === 2 && (
              <div className="modal-body animate-tab">
                <div className="modal-field">
                  <label className="modal-label">Méthodes d'apprentissage préférées</label>
                  <p className="modal-hint">Sélectionnez une ou plusieurs méthodes adaptées à votre profil.</p>
                  <div className="methode-grid">
                    {METHODE_OPTIONS.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        className={`methode-btn${form.methodes.includes(m.value) ? " methode-btn--active" : ""}`}
                        onClick={() => toggleMethode(m.value)}
                      >
                        <span className="material-symbols-outlined methode-icon">{m.icon}</span>
                        <span className="methode-label">{m.label}</span>
                        {form.methodes.includes(m.value) && (
                          <span className="methode-check material-symbols-outlined">check_circle</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recap */}
                <div className="modal-recap">
                  <h4 className="recap-title">
                    <span className="material-symbols-outlined">summarize</span>
                    Récapitulatif
                  </h4>
                  <div className="recap-grid">
                    <div className="recap-item">
                      <span className="recap-key">Sujet</span>
                      <span className="recap-val">{form.title || "—"}</span>
                    </div>
                    <div className="recap-item">
                      <span className="recap-key">Statut</span>
                      <span className="recap-val">{STATUS_LABELS[form.status]}</span>
                    </div>
                    <div className="recap-item">
                      <span className="recap-key">Priorité</span>
                      <span className="recap-val">{PRIORITE_OPTIONS.find((p) => p.value === form.priorite)?.label}</span>
                    </div>
                    <div className="recap-item">
                      <span className="recap-key">Échéance</span>
                      <span className="recap-val">{form.echeance || "Non définie"}</span>
                    </div>
                    <div className="recap-item recap-item--full">
                      <span className="recap-key">Méthodes</span>
                      <span className="recap-val">
                        {form.methodes.length === 0
                          ? "Aucune sélectionnée"
                          : form.methodes.map((v) => METHODE_OPTIONS.find((m) => m.value === v)?.label).join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="modal-footer">
              <button className="modal-btn-secondary" onClick={tab === 0 ? onClose : prevTab}>
                {tab === 0 ? (
                  <><span className="material-symbols-outlined">close</span> Annuler</>
                ) : (
                  <><span className="material-symbols-outlined">arrow_back</span> Précédent</>
                )}
              </button>
              <div className="modal-footer-right">
                <span className="modal-step-count">{tab + 1} / {MODAL_TABS.length}</span>
                {tab < MODAL_TABS.length - 1 ? (
                  <button className="modal-btn-primary" onClick={nextTab}>
                    Suivant <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                ) : (
                  <button className="modal-btn-primary modal-btn-submit" onClick={handleSubmit}>
                    <span className="material-symbols-outlined">check</span> Ajouter le sujet
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── FlexiBot Chat Panel ─────────────────────────────────────────────────
function FlexiBotChat({ subject, onClose }) {
  const [messages, setMessages] = useState(INITIAL_BOT_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: Date.now(), from: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
      setMessages((prev) => [...prev, { id: Date.now() + 1, from: "bot", text: reply }]);
      setTyping(false);
    }, 1200);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-avatar">
            <span className="material-symbols-outlined">smart_toy</span>
          </div>
          <div>
            <p className="chat-title">FlexiBot</p>
            {subject && <p className="chat-subtitle">{subject.title}</p>}
          </div>
        </div>
        <button className="sidebar-close" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble-wrap chat-bubble-wrap--${msg.from}`}>
            {msg.from === "bot" && (
              <div className="chat-bot-icon">
                <span className="material-symbols-outlined">smart_toy</span>
              </div>
            )}
            <div className={`chat-bubble chat-bubble--${msg.from}`}>{msg.text}</div>
          </div>
        ))}
        {typing && (
          <div className="chat-bubble-wrap chat-bubble-wrap--bot">
            <div className="chat-bot-icon"><span className="material-symbols-outlined">smart_toy</span></div>
            <div className="chat-bubble chat-bubble--bot chat-typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-suggestions">
        {["Moins de théorie", "Plus d'exercices", "Changer le rythme"].map((s) => (
          <button key={s} className="chat-suggestion" onClick={() => setInput(s)}>{s}</button>
        ))}
      </div>

      <div className="chat-input-row">
        <textarea
          className="chat-input"
          rows={1}
          placeholder="Écrivez votre message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button className="chat-send" onClick={sendMessage} disabled={!input.trim()}>
          <span className="material-symbols-outlined">send</span>
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────
export default function Cours() {
  const [subjectList, setSubjectList] = useState(INITIAL_SUBJECTS);
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [selectedSubject, setSelectedSubject] = useState(INITIAL_SUBJECTS[0]);
  const [showChat, setShowChat] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered =
    FILTER_MAP[activeFilter] === null
      ? subjectList
      : subjectList.filter((s) => s.status === FILTER_MAP[activeFilter]);

  const handleAdd = (newSubject) => {
    setSubjectList((prev) => [newSubject, ...prev]);
    setSelectedSubject(newSubject);
    setShowChat(false);
  };

  return (
    <div className="cours-page">
      {/* Modal */}
      {showAddModal && (
        <AddSubjectModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
        />
      )}

      {/* NAV */}
      <nav className="cours-nav">
        <div className="nav-inner">
          <div className="nav-brand">
            <div className="brand-icon">
              <span className="material-symbols-outlined">auto_stories</span>
            </div>
            <h1 className="brand-name">Flexilearn</h1>
          </div>
          <div className="nav-links">
            <a href="#" className="nav-link">Tableau de bord</a>
            <a href="#" className="nav-link">Feedback</a>
            <a href="#" className="nav-link">Recommandations</a>
            <a href="#" className="nav-link active">Cours</a>
          </div>
          <div className="nav-actions">
            <button className="nav-icon-btn">
              <span className="material-symbols-outlined">search</span>
            </button>
            <div className="nav-avatar">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk8TK3gpUj1OUtjiZyCLS8GfLqXRhBTwWGHKBT-xlX-tZqnMdBoMaqfiUWSuEaMnwhYyz3fkMv8LHVgg5El0osqTJtULHQbe_jyhpdo0iqIN3F6JZvrW-fPv1SIx6IwJMUVcPw6ZfVbu-MOhMcFso4nZwbcZdGXkuh3uo0AUxgt8MCx1RFRurTZByuypQVHkijERm5mau5ZmZSue89QToh9PxMX-hNGd5kWmogpFRADhwlk9gU6e-BZEdHs1uYClYwQgHfQA-vEpE"
                alt="Profile"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="cours-main">
        <section className="subjects-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Mes Apprentissages</h2>
              <p className="section-subtitle">Gérez votre progression et vos objectifs d'étude.</p>
            </div>
            <button className="btn-add" onClick={() => setShowAddModal(true)}>
              <span className="material-symbols-outlined">add</span>
              Ajouter un sujet
            </button>
          </div>

          <div className="filter-row">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`filter-btn${activeFilter === f ? " filter-btn--active" : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="subject-list">
            {filtered.length === 0 ? (
              <div className="subject-list-empty">
                <span className="material-symbols-outlined">inbox</span>
                <p>Aucun sujet dans cette catégorie.</p>
                <button className="btn-add" onClick={() => setShowAddModal(true)}>
                  <span className="material-symbols-outlined">add</span>
                  Ajouter un sujet
                </button>
              </div>
            ) : (
              filtered.map((subject) => (
                <div
                  key={subject.id}
                  className={`subject-card${subject.active ? " subject-card--active" : ""}${
                    selectedSubject?.id === subject.id ? " subject-card--selected" : ""
                  }`}
                  onClick={() => { setSelectedSubject(subject); setShowChat(false); }}
                >
                  <div className="subject-card-inner">
                    <div className="subject-left">
                      <div className={`subject-icon ${subject.iconBg}`}>
                        <span className="material-symbols-outlined">{subject.icon}</span>
                      </div>
                      <div>
                        <h3 className={`subject-title${subject.done ? " subject-title--done" : ""}`}>
                          {subject.title}
                        </h3>
                        <p className="subject-desc">{subject.description}</p>
                        <div className="subject-meta">
                          <span className={`status-badge status-${subject.status}`}>
                            {STATUS_LABELS[subject.status]}
                          </span>
                          <span className="subject-time">
                            <span className="material-symbols-outlined">{subject.modifiedIcon}</span>
                            {subject.modifiedLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="subject-chevron">
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* SIDEBAR */}
        <aside className="cours-sidebar">
          {showChat ? (
            <FlexiBotChat subject={selectedSubject} onClose={() => setShowChat(false)} />
          ) : selectedSubject ? (
            <div className="sidebar-card">
              <div className="sidebar-deco" />
              <div className="sidebar-content">
                <div className="sidebar-top">
                  <span className="sidebar-tag">Guide pour profil Visuel</span>
                  <button className="sidebar-close" onClick={() => setSelectedSubject(null)}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <h3 className="sidebar-title">{selectedSubject.title}</h3>
                <div className="progress-row">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "35%" }} />
                  </div>
                  <span className="progress-pct">35%</span>
                </div>
                <div className="sidebar-methods">
                  <h4 className="methods-title">
                    <span className="material-symbols-outlined">auto_fix</span>
                    Méthodologie personnalisée
                  </h4>
                  <div className="methods-list">
                    {METHODS.map((m) => (
                      <div key={m.label} className="method-item">
                        <div className={`method-icon ${m.bg}`}>
                          <span className="material-symbols-outlined">{m.icon}</span>
                        </div>
                        <div>
                          <p className="method-label">{m.label}</p>
                          <p className="method-detail">{m.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flexibot-card">
                  <div className="flexibot-deco" />
                  <div className="flexibot-inner">
                    <div className="flexibot-header">
                      <div className="flexibot-avatar">
                        <span className="material-symbols-outlined">smart_toy</span>
                      </div>
                      <span className="flexibot-heading">Besoin d'aide ?</span>
                    </div>
                    <p className="flexibot-text">
                      Besoin d'ajuster votre parcours ? Je peux adapter ces méthodes à votre rythme actuel.
                    </p>
                    <button className="flexibot-btn" onClick={() => setShowChat(true)}>
                      <span className="material-symbols-outlined">auto_awesome</span>
                      Modifier mes méthodes avec FlexiBot
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="sidebar-empty">
              <span className="material-symbols-outlined">touch_app</span>
              <p>Sélectionnez un sujet pour voir le guide personnalisé</p>
            </div>
          )}
        </aside>
      </main>

      {/* FAB */}
      <button
        className={`fab${showChat ? " fab--active" : ""}`}
        onClick={() => { setShowChat((v) => !v); }}
      >
        <span className="material-symbols-outlined">{showChat ? "close" : "chat_bubble"}</span>
      </button>
    </div>
  );
}