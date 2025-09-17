import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    auth.logout();
    localStorage.removeItem("token");
    navigate("/login");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🎓</span>
          CareerGuide
        </Link>

        <button 
          className="mobile-menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          {user ? (
            <>
              <div className="navbar-user-info">
                <span className="user-greeting">Hello, {user.name}</span>
              </div>
              
              <div className="navbar-links">
                <Link to="/quiz" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                  <span className="link-icon">📝</span>
                  Assessment
                </Link>
                <Link to="/recommendations" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                  <span className="link-icon">💡</span>
                  Recommendations
                </Link>
                <Link to="/colleges" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                  <span className="link-icon">🏫</span>
                  Colleges
                </Link>
                <Link to="/chatbot" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                  <span className="link-icon">🤖</span>
                  Chat Assistant
                </Link>
              </div>
              
              <button onClick={handleLogout} className="logout-btn">
                <span className="btn-icon">🚪</span>
                Logout
              </button>
            </>
          ) : (
            <div className="navbar-auth-links">
              <Link to="/login" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className="navbar-link signup-link" onClick={() => setIsMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}