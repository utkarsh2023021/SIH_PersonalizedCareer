import React, { useEffect, useRef } from "react";
import "./Profile.css";

export default function Profile({ onClose, user }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.keyCode === 27) onClose();
    };
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  return (
    <div className="profile-overlay">
      <div className="profile-card" ref={modalRef}>
        <div className="decorative-shape shape-1" />
        <div className="decorative-shape shape-2" />
        <div className="decorative-shape shape-3" />
        <button className="close-btn" onClick={onClose}>
          <span className="close-icon">&times;</span>
        </button>
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-glow"></div>
            <div className="avatar-circle">{user.name?.charAt(0)?.toUpperCase()}</div>
          </div>
          <div className="profile-title">Your Profile</div>
          <div className="profile-subtitle">Account Information</div>
        </div>
        <div className="profile-content">
          <div className="info-card">
            <span className="info-icon">👤</span>
            <div className="info-content">
              <div className="info-label">Name</div>
              <div className="info-value">{user.name}</div>
            </div>
          </div>
          <div className="info-card">
            <span className="info-icon">📧</span>
            <div className="info-content">
              <div className="info-label">Email</div>
              <div className="info-value">{user.email}</div>
            </div>
          </div>
        </div>
        <div className="profile-footer">
          <button className="action-btn secondary-btn">Edit Profile</button>
          <button className="action-btn primary-btn" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}
