// components/Feedback.js
import React, { useState, useEffect, useRef } from "react";
import "./Feedback.css";

export default function Feedback({ onClose }) {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Auto-close after success
      setTimeout(() => {
        if (onClose) onClose();
      }, 1500);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="feedback-overlay">
        <div className="feedback-card" ref={modalRef}>
          <div className="feedback-success">
            <div className="success-icon">✓</div>
            <h2>Thank You!</h2>
            <p>Your feedback has been submitted successfully.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-overlay">
      <div className="feedback-card" ref={modalRef}>
        <div className="feedback-header">
          <h2 className="feedback-title">Share Your Feedback</h2>
          <p className="feedback-subtitle">We'd love to hear your thoughts</p>
          <button 
            className="close-btn" 
            onClick={onClose}
            aria-label="Close feedback"
          >
            <span className="close-icon">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="input-container">
            <textarea
              className="feedback-textarea"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What's on your mind? Share your suggestions, issues, or anything else you'd like us to know..."
              rows="8"
              required
            />
          </div>

          <div className="feedback-footer">
            <button 
              type="button"
              className="action-btn secondary-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="action-btn primary-btn"
              disabled={isSubmitting || !feedback.trim()}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>

        {/* Decorative elements */}
        <div className="decorative-shape shape-1"></div>
        <div className="decorative-shape shape-2"></div>
      </div>
    </div>
  );
}