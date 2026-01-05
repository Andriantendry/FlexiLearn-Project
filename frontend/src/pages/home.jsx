import "../styles/home.css";
import { Link } from "react-router-dom";
import hero from "../assets/images/logo.png";

export default function Home() {
  return (
    <div className="landing-container">
      <header className="navbar">
        <div className="logo">
          📘 <span>FlexiLearn</span>
        </div>

        <nav>
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Features</a>
          <a href="#">Contact</a>
        </nav>
      </header>

      <main className="hero">
        <div className="hero-left">
          <h1>Personalized Learning Platform</h1>
          <p>Adaptive learning to suit your style and pace</p>
          <Link to="/signup" className="cta-btn">
            Get Started
          </Link>
        </div>

        <div className="hero-right">
          <img
            src={hero}
            alt="https://storyset.com/images/Online-learning-cuate.svg"
          />
        </div>
      </main>

      <section className="features">
        <div className="feature-card">
          <img src="https://cdn-icons-png.flaticon.com/512/943/943277.png" />
          <h3>Assess Learning Style</h3>
          <p>
            Determine your preferred learning approach through interactive tests
          </p>
        </div>

        <div className="feature-card">
          <img src="https://cdn-icons-png.flaticon.com/512/906/906343.png" />
          <h3>Tailored Recommendation</h3>
          <p>Receive custom learning resources based on your style</p>
        </div>

        <div className="feature-card">
          <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" />
          <h3>Track Progress</h3>
          <p>Monitor your learning progress and adjust as needed</p>
        </div>
      </section>
    </div>
  );
}
