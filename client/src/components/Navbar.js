"use client"

// components/Navbar.js
import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import Profile from "./Profile"
import Feedback from "./Feedback" // Import the Feedback component
import "./Navbar.css"

export default function Navbar() {
  const auth = useContext(AuthContext)
  const user = auth?.user
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false) // State for feedback modal

  const handleLogout = () => {
    auth.logout()
    localStorage.removeItem("token")
    navigate("/login")
    setIsMenuOpen(false)
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleProfile = () => setShowProfile(!showProfile)
  const toggleFeedback = () => setShowFeedback(!showFeedback) // Toggle feedback modal

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
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
                <div className="navbar-user-section">
                  <span className="user-greeting">Welcome, {user.name}</span>

                  <div className="navbar-links">
                    <Link to="/quiz" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                      <span className="link-text">Assessment</span>
                    </Link>
                    <Link to="/recommendations" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                      <span className="link-text">Recommendations</span>
                    </Link>
                    <Link to="/colleges" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                      <span className="link-text">Colleges</span>
                    </Link>
                    <Link to="/chatbot" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                      <span className="link-text">Assistant</span>
                    </Link>
                    {/* Add Feedback link */}
                    <button className="navbar-link feedback-link" onClick={toggleFeedback}>
                      <span className="link-text">Feedback</span>
                    </button>
                  </div>

                  <div className="navbar-actions">
                    <button className="profile-btn" onClick={toggleProfile}>
                      <span className="btn-text">Profile</span>
                    </button>
                    <button onClick={handleLogout} className="logout-btn">
                      <span className="btn-text">Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="navbar-auth-links">
                <Link to="/login" className="navbar-link auth-link" onClick={() => setIsMenuOpen(false)}>
                  <span className="link-text">Sign In</span>
                </Link>
                <Link to="/register" className="navbar-link auth-link signup-link" onClick={() => setIsMenuOpen(false)}>
                  <span className="link-text">Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showProfile && <Profile onClose={toggleProfile} user={user} />}
      {showFeedback && <Feedback onClose={toggleFeedback} />}
    </>
  )
}