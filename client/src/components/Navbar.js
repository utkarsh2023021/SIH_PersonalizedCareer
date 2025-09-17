import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          🎓 Career Guidance
        </Link>
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <span className="navbar-user">Hi, {user.name}</span>
            <Link to="/quiz" className="navbar-link">Quiz</Link>
            <Link to="/recommendations" className="navbar-link">Recommendations</Link>
            <Link to="/colleges" className="navbar-link">Colleges</Link>
            <Link to="/chatbot" className="navbar-link">Chatbot</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/register" className="navbar-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
