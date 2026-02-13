import React, { useState } from "react";
import "../styles/user.css";
import avatar_icone from "../assets/icones/avatar.png";
import mascott_image from "../assets/images/mascott.png";
import illustration_image from "../assets/images/illustration.png";
import { useEffect } from "react";
import { profiles } from "../data/profiles";

const UserPage = () => {
  useEffect(() => {
    document.body.classList.add("user-page-body");
    return () => {
      document.body.classList.remove("user-page-body");
    };
  }, []);

  const userProfileKey = "visual"; // alaina avy any am-backend
  const profile = profiles[userProfileKey] || profiles.default;

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="main-header">
        <div className="logo-section">
          <div className="logo-icon">🧠</div>
          <span className="welcome-text">Hello [Name]!</span>
        </div>
        <div className="user-controls">
          <div className="avatar-circle">
            <img
              /*src="https://api.dicebear.com/7.x/bottts/svg?seed=Felix"*/
              src={avatar_icone}
              alt="avatar"
            />
          </div>
          <button className="logout-btn">Log Out</button>
        </div>
      </header>

      {/* SECTION PROFIL ACTUEL */}
      <section className="profile-card">
        <div className="card-content">
          <span className="profile-badge">{profile.icon} Learning Style</span>

          <h1 className="profile-title">{profile.title}</h1>

          <p className="profile-subtitle">
            Personalized learning experience based on your habits.
          </p>

          <button
            className="retake-link"
            onClick={() => alert("Restarting test...")}
          >
            🔄 Retake the test
          </button>
        </div>

        <div className="card-illustration">
          <img
            /*src="https://illustrations.popsy.co/purple/searching-with-a-magnifying-glass.svg"*/
            src={illustration_image}
            alt="Illustration robot"
          />
        </div>
      </section>

      {/* SECTION POURQUOI / CONSEILS */}
      <section className="details-card">
        <h3>Why it fits you</h3>
        <p>{profile.description}</p>

        <div className="tips-grid">
          {profile.tips.map((tip, index) => (
            <div className="tip-item" key={index}>
              <span className="tip-icon">{tip.icon}</span>
              {tip.text}
            </div>
          ))}
        </div>

        <div className="robot-floating">
          <img
            /*src="https://illustrations.popsy.co/purple/space-shuttle.svg"*/
            src={mascott_image}
            alt="Robot mascot"
          />
        </div>
      </section>

      {/* FOOTER / FEEDBACK & ACTIONS */}
      <footer className="footer-section">
        <div className="feedback-box">
          <div className="input-group">
            <button className="send-btn">Send Feedback</button>
          </div>
          <a href="#about" className="about-link">
            About Us
          </a>
          {/**asina image kely */}
        </div>

        <div className="bottom-row">
          <div className="coming-soon-card">
            <div className="soon-badge">Coming Soon!</div>
            <p>🎓 Learn a Specific Topic</p>
          </div>
          <button className="delete-btn">Delete My Account</button>
        </div>
      </footer>
    </div>
  );
};

export default UserPage;
