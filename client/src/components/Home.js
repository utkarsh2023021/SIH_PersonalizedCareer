import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Home.css";

export default function Home() {
  const auth = useContext(AuthContext);
  const user = auth?.user;

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Your Career Path</h1>
          <p>Get personalized guidance based on your skills, interests, and goals</p>
          
          {user ? (
            <div className="user-welcome">
              <p>Welcome back, <span className="user-name">{user.name}</span>!</p>
              <div className="action-buttons">
                <Link to="/quiz" className="cta-button primary">Take Assessment</Link>
                <Link to="/recommendations" className="cta-button secondary">View Recommendations</Link>
              </div>
            </div>
          ) : (
            <div className="guest-actions">
              <p>Create an account to unlock personalized career guidance</p>
              <div className="action-buttons">
                <Link to="/register" className="cta-button primary">Get Started</Link>
                <Link to="/login" className="cta-button secondary">Sign In</Link>
              </div>
            </div>
          )}
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <span className="icon">🎯</span>
            <h3>Career Matching</h3>
          </div>
          <div className="floating-card card-2">
            <span className="icon">📚</span>
            <h3>Course Recommendations</h3>
          </div>
          <div className="floating-card card-3">
            <span className="icon">🏫</span>
            <h3>College Finder</h3>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Take Assessment</h3>
            <p>Complete our skill and interest assessment to understand your strengths</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Get Recommendations</h3>
            <p>Receive personalized career and course recommendations</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>Plan Your Path</h3>
            <p>Create a roadmap to achieve your career goals</p>
          </div>
        </div>
      </section>
    </div>
  );
}