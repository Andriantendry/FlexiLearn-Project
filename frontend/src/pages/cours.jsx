import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/cours.css";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const ICON_BG_MAP = {
  psychology: "icon-orange", language: "icon-slate", brush: "icon-mint",
  calculate: "icon-orange", history_edu: "icon-slate", biotech: "icon-mint",
  computer: "icon-orange", music_note: "icon-mint", sports_soccer: "icon-slate",
  camera: "icon-orange",
};

const ICON_OPTIONS = [
  { value: "psychology", label: "Sciences" }, { value: "language", label: "Langue" },
  { value: "brush", label: "Art" },           { value: "calculate", label: "Maths" },
  { value: "history_edu", label: "Histoire" },{ value: "biotech", label: "Biologie" },
  { value: "computer", label: "Info" },       { value: "music_note", label: "Musique" },
  { value: "sports_soccer", label: "Sport" }, { value: "camera", label: "Photo" },
];

const STATUS_LABELS = { "en-cours": "En cours", ajoute: "Ajouté", termine: "Terminé" };
const FILTERS       = ["Tous", "Ajouté", "En cours", "Terminé"];
const FILTER_MAP    = { Tous: null, Ajouté: "ajoute", "En cours": "en-cours", Terminé: "termine" };
const VAK_LABELS    = { V: "Visuel", A: "Auditif", K: "Kinesthésique" };
const VAK_COLOR     = { V: "#2563EB", A: "#D97706", K: "#059669" };

// ─── API ──────────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:8000";

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function getUserId() {
  return localStorage.getItem("user_id") || "1";
}

// ─── ADD SUBJECT MODAL ────────────────────────────────────────────────────────
function AddSubjectModal({ onClose, onAdd }) {
  const [form, setForm]       = useState({ title: "", status: "ajoute", icon: "psychology" });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError("Le titre est requis."); return; }

    try {
      const saved = await apiFetch("/cours/subjects", {
        method: "POST",
        body: JSON.stringify({ user_id: parseInt(getUserId()), title: form.title.trim(), status: form.status }),
      });

      const newSubject = {
        id_subject:        saved.id_subject,
        title:             saved.title,
        status:            saved.status,
        icon:              form.icon,
        iconBg:            ICON_BG_MAP[form.icon] || "icon-orange",
      };

      setSuccess(true);
      setTimeout(() => { onAdd(newSubject); onClose(); }, 1000);
    } catch (e) {
      setError("Erreur lors de la création. Vérifiez que le backend est démarré.");
    }
  };

  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-header-icon">
              <span className="material-symbols-outlined">add_circle</span>
            </div>
            <div>
              <h2 className="modal-title">Nouveau sujet</h2>
              <p className="modal-subtitle">Un guide VAK sera généré automatiquement</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {success ? (
          <div className="modal-success">
            <div className="modal-success-icon">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <h3>Sujet ajouté !</h3>
            <p>Le guide VAK sera généré à l'ouverture.</p>
          </div>
        ) : (
          <div className="modal-body animate-tab">

            {/* Icône */}
            <div className="modal-field">
              <label className="modal-label">Icône</label>
              <div className="icon-picker">
                {ICON_OPTIONS.map(opt => (
                  <button key={opt.value} type="button"
                    className={`icon-pick-btn${form.icon === opt.value ? " icon-pick-btn--active" : ""}`}
                    onClick={() => set("icon", opt.value)}>
                    <span className="material-symbols-outlined">{opt.value}</span>
                    <span className="icon-pick-label">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Titre */}
            <div className="modal-field">
              <label className="modal-label" htmlFor="m-title">
                Titre <span className="required">*</span>
              </label>
              <input id="m-title"
                className={`modal-input${error ? " modal-input--error" : ""}`}
                type="text" placeholder="Ex : Algèbre, Japonais, Guitare…"
                value={form.title}
                onChange={e => { set("title", e.target.value); setError(""); }} />
              {error && <span className="modal-error">{error}</span>}
            </div>

            {/* Statut */}
            <div className="modal-field">
              <label className="modal-label">Statut</label>
              <div className="status-picker">
                {[{value:"ajoute",label:"Ajouté"},{value:"en-cours",label:"En cours"},{value:"termine",label:"Terminé"}].map(s => (
                  <button key={s.value} type="button"
                    className={`status-pick-btn status-pick-${s.value}${form.status === s.value ? " status-pick-btn--active" : ""}`}
                    onClick={() => set("status", s.value)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer" style={{ padding: "1rem 0 0", border: "none" }}>
              <button className="modal-btn-secondary" onClick={onClose}>
                <span className="material-symbols-outlined">close</span> Annuler
              </button>
              <button className="modal-btn-primary modal-btn-submit" onClick={handleSubmit}>
                <span className="material-symbols-outlined">auto_awesome</span> Ajouter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── GUIDE SIDEBAR ────────────────────────────────────────────────────────────
function GuideSidebar({ subject }) {
  const [guide,     setGuide]     = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const GUIDE_TABS = [
    { key: "plan",        icon: "format_list_numbered", label: "Plan" },
    { key: "session",     icon: "timer",               label: "Session" },
    { key: "ressources",  icon: "library_books",       label: "Ressources" },
    { key: "techniques",  icon: "psychology",          label: "Techniques" },
    { key: "indicateurs", icon: "verified",            label: "Maîtrise" },
  ];

  useEffect(() => {
    if (!subject) return;
    setGuide(null); setError(null); setActiveTab(0);
    fetchGuide();
  }, [subject?.id_subject]);

  const fetchGuide = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/cours/subjects/${subject.id_subject}/guide`);
      // Le guide est dans data.contenu (JSON stocké en DB)
      setGuide(data.contenu || data);
    } catch (e) {
      setError("Impossible de charger le guide. Vérifiez que le backend est démarré.");
    } finally {
      setLoading(false);
    }
  };

  const color = VAK_COLOR[subject?.profil_dominant] || "#18a89e";
  const [exporting, setExporting] = useState(false);

  const exportPDF = async () => {
    if (!guide || exporting) return;
    setExporting(true);
    try {
      // Charger jsPDF depuis CDN si pas encore chargé
      if (!window.jspdf) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
          s.onload = resolve; s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const W = 210, margin = 18, lineH = 6, maxW = W - margin * 2;
      let y = 20;
      const primary = [24, 168, 158];

      const addText = (text, size, bold, color, indent = 0) => {
        doc.setFontSize(size);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setTextColor(...(color || [30, 30, 30]));
        const lines = doc.splitTextToSize(String(text || ""), maxW - indent);
        lines.forEach(line => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(line, margin + indent, y);
          y += lineH;
        });
      };

      const addSection = (title) => {
        if (y > 260) { doc.addPage(); y = 20; }
        y += 4;
        doc.setFillColor(...primary);
        doc.roundedRect(margin, y - 4, maxW, 8, 2, 2, "F");
        doc.setFontSize(11); doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(title, margin + 4, y + 1);
        y += 10;
        doc.setTextColor(30, 30, 30);
      };

      const addDivider = () => {
        doc.setDrawColor(220, 220, 220);
        doc.line(margin, y, W - margin, y);
        y += 4;
      };

      // HEADER
      doc.setFillColor(...primary);
      doc.rect(0, 0, W, 14, "F");
      doc.setFontSize(13); doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("Flexilearn — Guide VAK", margin, 9);
      y = 22;

      addText(subject.title, 16, true, primary);
      addText(`Profil : ${VAK_LABELS[subject.profil_dominant] || subject.profil_dominant} + ${VAK_LABELS[subject.profil_secondaire] || subject.profil_secondaire}`, 10, false, [100, 100, 100]);
      y += 4;

      // PLAN
      if (guide.plan) {
        addSection("Plan d'apprentissage");
        addText(guide.plan.description, 9, false, [80, 80, 80]);
        y += 2;
        (guide.plan.modules || []).forEach((mod, i) => {
          if (y > 265) { doc.addPage(); y = 20; }
          doc.setFillColor(240, 252, 250);
          doc.roundedRect(margin, y - 3, maxW, lineH * 3.5 + 4, 2, 2, "F");
          addText(`${i + 1}. ${mod.titre}`, 10, true, primary, 3);
          addText(mod.tache, 9, false, [50, 50, 50], 3);
          if (mod.comment) addText(mod.comment, 8, false, [120, 120, 120], 3);
          addText(`Durée : ${mod.duree}`, 8, false, [24, 168, 158], 3);
          y += 3;
        });
      }

      // SESSION
      if (guide.session) {
        addSection("Structure d'une séance");
        addText(guide.session.description, 9, false, [80, 80, 80]);
        y += 2;
        (guide.session.phases || []).forEach(ph => {
          if (y > 265) { doc.addPage(); y = 20; }
          addText(`${ph.phase} — ${ph.duree} (${ph.profil})`, 10, true, [50, 50, 50], 2);
          addText(ph.action, 9, false, [50, 50, 50], 4);
          if (ph.ne_pas) addText(`À éviter : ${ph.ne_pas}`, 8, false, [180, 50, 50], 4);
          addDivider();
        });
      }

      // RESSOURCES
      if (guide.ressources) {
        addSection("Ressources recommandées");
        addText(guide.ressources.description, 9, false, [80, 80, 80]);
        y += 2;
        (guide.ressources.ressources || []).forEach(r => {
          if (y > 265) { doc.addPage(); y = 20; }
          addText(`[${r.profil}] ${r.type} — ${r.ressource}`, 10, true, [50, 50, 50], 2);
          addText(r.pourquoi, 9, false, [80, 80, 80], 4);
          y += 1;
        });
      }

      // TECHNIQUES
      if (guide.techniques) {
        addSection("Techniques de travail");
        addText(guide.techniques.description, 9, false, [80, 80, 80]);
        y += 2;
        (guide.techniques.techniques || []).forEach(t => {
          if (y > 265) { doc.addPage(); y = 20; }
          addText(t.technique, 10, true, [50, 50, 50], 2);
          addText(t.action, 9, false, [80, 80, 80], 4);
          addText(t.format, 8, false, [120, 120, 120], 4);
          y += 2;
        });
      }

      // INDICATEURS
      if (guide.indicateurs) {
        addSection("Indicateurs de maîtrise");
        addText(guide.indicateurs.description, 9, false, [80, 80, 80]);
        y += 2;
        addText("Signes de maîtrise :", 10, true, [50, 50, 50], 2);
        (guide.indicateurs.signes || []).forEach(s => { addText(`• ${s}`, 9, false, [50, 50, 50], 4); });
        y += 2;
        addText("Mini-tests :", 10, true, [50, 50, 50], 2);
        (guide.indicateurs.mini_tests || []).forEach((mt, i) => { addText(`${i + 1}. ${mt}`, 9, false, [50, 50, 50], 4); });
      }

      doc.save(`Guide_VAK_${subject.title.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Export PDF error:", err);
      alert("Erreur lors de l'export PDF. Réessayez.");
    } finally {
      setExporting(false);
    }
  };

  if (!subject) return (
    <div className="sidebar-empty">
      <span className="material-symbols-outlined">touch_app</span>
      <p>Sélectionnez un sujet pour voir le guide personnalisé</p>
    </div>
  );

  return (
    <div className="guide-sidebar">
      {/* Header */}
      <div className="guide-header" style={{ borderTopColor: color }}>
        <div className="guide-header-top">
          <div className="guide-profile-badge" style={{ background: color + "18", color }}>
            <span className="material-symbols-outlined">school</span>
            {VAK_LABELS[subject.profil_dominant]} + {VAK_LABELS[subject.profil_secondaire]}
          </div>
          {guide && (
            <button
              className={`guide-export-btn${exporting ? " guide-export-btn--loading" : ""}`}
              onClick={exportPDF}
              disabled={exporting}
              title="Exporter en PDF">
              <span className="material-symbols-outlined">
                {exporting ? "progress_activity" : "picture_as_pdf"}
              </span>
              {exporting ? "Export…" : "PDF"}
            </button>
          )}
        </div>
        <h3 className="guide-subject-title">{subject.title}</h3>
      </div>

      {/* Tabs */}
      <div className="guide-tabs">
        {GUIDE_TABS.map((t, i) => (
          <button key={t.key}
            className={`guide-tab${activeTab === i ? " guide-tab--active" : ""}`}
            style={activeTab === i ? { color, borderBottomColor: color } : {}}
            onClick={() => setActiveTab(i)}>
            <span className="material-symbols-outlined">{t.icon}</span>
            <span className="guide-tab-label">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="guide-content">
        {loading && <GuideLoading color={color} />}
        {error   && <GuideError message={error} onRetry={fetchGuide} />}
        {!loading && !error && guide && (
          <>
            {activeTab === 0 && <PlanSection       data={guide.plan}        color={color} />}
            {activeTab === 1 && <SessionSection    data={guide.session}     color={color} subject={subject} />}
            {activeTab === 2 && <RessourcesSection data={guide.ressources}  color={color} />}
            {activeTab === 3 && <TechniquesSection data={guide.techniques}  color={color} />}
            {activeTab === 4 && <IndicateursSection data={guide.indicateurs} color={color} />}
          </>
        )}
      </div>
    </div>
  );
}

function GuideLoading({ color }) {
  const msgs = ["Génération du guide VAK…", "Adaptation au profil…", "Sélection des ressources…"];
  const [mi, setMi] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setMi(i => (i + 1) % msgs.length), 1800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="guide-loading">
      <div className="guide-loading-spinner" style={{ borderTopColor: color }} />
      <p className="guide-loading-title">Génération du guide VAK…</p>
      <p className="guide-loading-sub">{msgs[mi]}</p>
    </div>
  );
}

function GuideError({ message, onRetry }) {
  return (
    <div className="guide-error">
      <span className="material-symbols-outlined">error_outline</span>
      <p>{message}</p>
      <button className="guide-retry-btn" onClick={onRetry}>
        <span className="material-symbols-outlined">refresh</span> Réessayer
      </button>
    </div>
  );
}

function PlanSection({ data, color }) {
  if (!data?.modules) return null;
  return (
    <div className="guide-section">
      <p className="guide-section-intro">{data.description}</p>
      <div className="plan-modules">
        {data.modules.map((mod, i) => (
          <div key={i} className="plan-module">
            <div className="plan-module-num" style={{ background: color + "18", color }}>{i + 1}</div>
            <div className="plan-module-body">
              <div className="plan-module-title">{mod.titre}</div>
              <div className="plan-module-task">{mod.tache}</div>
              <div className="plan-module-duration">
                <span className="material-symbols-outlined">schedule</span>{mod.duree}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SessionSection({ data, color, subject }) {
  if (!data?.phases) return null;
  return (
    <div className="guide-section">
      <p className="guide-section-intro">{data.description}</p>
      <div className="session-phases">
        {data.phases.map((ph, i) => {
          const pc = VAK_COLOR[ph.profil] || color;
          return (
            <div key={i} className="session-phase">
              <div className="session-phase-left">
                <div className="session-phase-duration" style={{ color: pc }}>{ph.duree}</div>
                <div className="session-phase-line" style={{ background: pc + "30" }} />
              </div>
              <div className="session-phase-body">
                <div className="session-phase-header">
                  <span className="session-phase-name">{ph.phase}</span>
                  <span className="session-phase-badge" style={{ background: pc + "18", color: pc }}>
                    {VAK_LABELS[ph.profil] || ph.profil}
                  </span>
                </div>
                <p className="session-phase-action">{ph.action}</p>
                <p className="session-phase-not">
                  <span className="material-symbols-outlined">block</span>{ph.ne_pas}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RessourcesSection({ data, color }) {
  if (!data?.ressources) return null;
  const typeIcon = { Livre: "menu_book", Vidéo: "play_circle", Exercices: "edit_note", Podcast: "podcasts", Simulation: "biotech", Projet: "build", Article: "article" };
  return (
    <div className="guide-section">
      <p className="guide-section-intro">{data.description}</p>
      <div className="ressources-list">
        {data.ressources.map((r, i) => {
          const rc = VAK_COLOR[r.profil] || color;
          return (
            <div key={i} className="ressource-card">
              <div className="ressource-icon" style={{ background: rc + "18", color: rc }}>
                <span className="material-symbols-outlined">{typeIcon[r.type] || "link"}</span>
              </div>
              <div className="ressource-body">
                <div className="ressource-top">
                  <span className="ressource-name">{r.ressource}</span>
                  <span className="ressource-type-badge" style={{ background: rc + "18", color: rc }}>{r.type}</span>
                </div>
                <p className="ressource-why">{r.pourquoi}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TechniquesSection({ data, color }) {
  if (!data?.techniques) return null;
  return (
    <div className="guide-section">
      <p className="guide-section-intro">{data.description}</p>
      <div className="techniques-list">
        {data.techniques.map((t, i) => (
          <div key={i} className="technique-card">
            <div className="technique-header">
              <div className="technique-dot" style={{ background: color }} />
              <span className="technique-name">{t.technique}</span>
            </div>
            <p className="technique-action">{t.action}</p>
            <div className="technique-format">
              <span className="material-symbols-outlined">tips_and_updates</span>{t.format}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IndicateursSection({ data, color }) {
  if (!data) return null;
  return (
    <div className="guide-section">
      <p className="guide-section-intro">{data.description}</p>
      {data.signes?.length > 0 && (
        <div className="indicateurs-block">
          <h4 className="indicateurs-block-title" style={{ color }}>
            <span className="material-symbols-outlined">verified</span> Signes de maîtrise
          </h4>
          <div className="indicateurs-signs">
            {data.signes.map((s, i) => (
              <div key={i} className="indicateur-sign">
                <span className="indicateur-check material-symbols-outlined" style={{ color }}>check_circle</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {data.mini_tests?.length > 0 && (
        <div className="indicateurs-block">
          <h4 className="indicateurs-block-title" style={{ color }}>
            <span className="material-symbols-outlined">quiz</span> Mini-tests
          </h4>
          <div className="mini-tests-list">
            {data.mini_tests.map((mt, i) => (
              <div key={i} className="mini-test">
                <span className="mini-test-mod" style={{ background: color + "18", color }}>Module {i + 1}</span>
                <p className="mini-test-desc">{mt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Cours() {
  const navigate = useNavigate();
  const [subjects,        setSubjects]        = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [activeFilter,    setActiveFilter]    = useState("Tous");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showAddModal,    setShowAddModal]    = useState(false);
  const [userData,        setUserData]        = useState(null);

  // Charger les infos utilisateur
  useEffect(() => {
    const userId = getUserId();
    fetch(`http://localhost:8000/get_profile/profile?user_id=${userId}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.user) setUserData(d.user); })
      .catch(() => {});
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    navigate("/signin");
  };

  // Charger les sujets depuis l'API au montage
  useEffect(() => {
    apiFetch(`/cours/subjects?user_id=${getUserId()}`)
      .then(data => {
        setSubjects(data);
        if (data.length > 0) setSelectedSubject(data[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = FILTER_MAP[activeFilter] === null
    ? subjects
    : subjects.filter(s => s.status === FILTER_MAP[activeFilter]);

  const handleAdd = s => {
    setSubjects(prev => [s, ...prev]);
    setSelectedSubject(s);
  };

  const handleStatusChange = async (subject, status) => {
    try {
      await apiFetch(`/cours/subjects/${subject.id_subject}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    } catch (_) {}
    setSubjects(prev => prev.map(s => s.id_subject === subject.id_subject ? { ...s, status } : s));
    if (selectedSubject?.id_subject === subject.id_subject) setSelectedSubject(prev => ({ ...prev, status }));
  };

  return (
    <div className="cours-page">
      {showAddModal && (
        <AddSubjectModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />
      )}

      {/* NAV — même structure que userspace.jsx */}
      <header className="cours-nav">
        <div className="nav-inner">
          <div className="nav-brand" onClick={() => navigate("/userspace")} style={{ cursor: "pointer" }}>
            <div className="brand-icon">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" />
              </svg>
            </div>
            <h1 className="brand-name">Flexilearn</h1>
          </div>
          <nav className="nav-links">
            <a href="#" className="nav-link" onClick={e => { e.preventDefault(); navigate("/userspace"); }}>Tableau de bord</a>
            <a href="#" className="nav-link" onClick={e => { e.preventDefault(); navigate("/feedbackpage"); }}>Feedback</a>
            <a href="#" className="nav-link" onClick={e => { e.preventDefault(); navigate("/quiz-result"); }}>Recommandations</a>
            <a href="#" className="nav-link active">Cours</a>
          </nav>
          <div className="nav-actions">
            <div className="nav-user-badge">
              <div className="nav-avatar-initials">{getInitials(userData?.name || userData?.username)}</div>
              <span className="nav-user-name">{userData?.name || userData?.username || ""}</span>
            </div>
            <button className="nav-logout-btn" onClick={handleLogout} title="Déconnexion">
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="cours-main">
        <section className="subjects-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Mes Apprentissages</h2>
              <p className="section-subtitle">Gérez vos sujets et consultez vos guides VAK.</p>
            </div>
            <button className="btn-add" onClick={() => setShowAddModal(true)}>
              <span className="material-symbols-outlined">add</span>
              Ajouter un sujet
            </button>
          </div>

          <div className="filter-row">
            {FILTERS.map(f => (
              <button key={f}
                className={`filter-btn${activeFilter === f ? " filter-btn--active" : ""}`}
                onClick={() => setActiveFilter(f)}>{f}
              </button>
            ))}
          </div>

          <div className="subject-list">
            {loading ? (
              <div className="subject-list-empty">
                <span className="material-symbols-outlined spin">progress_activity</span>
                <p>Chargement...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="subject-list-empty">
                <span className="material-symbols-outlined">inbox</span>
                <p>{subjects.length === 0 ? "Aucun sujet pour l'instant. Ajoutez votre premier sujet !" : "Aucun sujet dans cette catégorie."}</p>
                <button className="btn-add" onClick={() => setShowAddModal(true)}>
                  <span className="material-symbols-outlined">add</span> Ajouter un sujet
                </button>
              </div>
            ) : (
              filtered.map(subject => (
                <div key={subject.id_subject}
                  className={`subject-card${subject.status === "en-cours" ? " subject-card--active" : ""}${selectedSubject?.id_subject === subject.id_subject ? " subject-card--selected" : ""}`}
                  onClick={() => setSelectedSubject(subject)}>
                  <div className="subject-card-inner">
                    <div className="subject-left">
                      <div className={`subject-icon ${subject.iconBg || ICON_BG_MAP[subject.icon] || "icon-orange"}`}>
                        <span className="material-symbols-outlined">{subject.icon || "psychology"}</span>
                      </div>
                      <div>
                        <h3 className="subject-title">{subject.title}</h3>
                        <div className="subject-meta">
                          <span className={`status-badge status-${subject.status}`}>
                            {STATUS_LABELS[subject.status]}
                          </span>
                          <span className="vak-meta-badge">
                            {VAK_LABELS[subject.profil_dominant]}
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

        <aside className="cours-sidebar">
          <GuideSidebar subject={selectedSubject} />
        </aside>
      </main>
    </div>
  );
}