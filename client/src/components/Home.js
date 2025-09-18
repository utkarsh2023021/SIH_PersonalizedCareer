import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Home.css";

export default function Home() {
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false
  });

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targetName = entry.target.dataset.section;
            setIsVisible(prev => ({
              ...prev,
              [targetName]: true
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-container">
      {/* Technical background elements */}
      <div className="background-elements">
        {/* Technical floating icons */}
        <div className="tech-elements">
          <div className="tech-icon tech-icon-1">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
              <path d="M2 17L12 22L22 17"/>
              <path d="M2 12L12 17L22 12"/>
            </svg>
          </div>
          <div className="tech-icon tech-icon-2">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15L16 10L5 21"/>
            </svg>
          </div>
          <div className="tech-icon tech-icon-3">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
          <div className="tech-icon tech-icon-4">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
            </svg>
          </div>
          <div className="tech-icon tech-icon-5">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.75 3v4.5h4.5V3h-4.5zM21 12v-1.5h-4.5V12H21zm-9.75 0v4.5h4.5V12h-4.5zm0-4.5V3H7.5v4.5h3.75z"/>
            </svg>
          </div>
          <div className="tech-icon tech-icon-6">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z"/>
              <polyline points="2,7 12,12 22,7"/>
              <polyline points="2,17 12,12 22,17"/>
            </svg>
          </div>
          <div className="tech-icon tech-icon-7">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
              <line x1="7" y1="2" x2="7" y2="22"/>
              <line x1="17" y1="2" x2="17" y2="22"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <line x1="2" y1="7" x2="7" y2="7"/>
              <line x1="2" y1="17" x2="7" y2="17"/>
              <line x1="17" y1="17" x2="22" y2="17"/>
              <line x1="17" y1="7" x2="22" y2="7"/>
            </svg>
          </div>
          <div className="tech-icon tech-icon-8">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 15S6 9 12 9S20 15 20 15"/>
              <path d="M4 15V21H12V15"/>
              <path d="M20 15V21H12V15"/>
            </svg>
          </div>
          <div className="tech-icon tech-icon-9">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
            </svg>
          </div>
          <div className="tech-icon tech-icon-10">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"/>
            </svg>
          </div>
        </div>

        {/* Circuit lines */}
        <div className="circuit-lines">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,20 Q50,10 100,30" className="circuit-path"/>
            <path d="M0,40 L50,35 L100,50" className="circuit-path"/>
            <path d="M0,70 Q50,80 100,60" className="circuit-path"/>
            <path d="M20,0 Q30,50 50,100" className="circuit-path"/>
            <path d="M80,0 Q70,50 50,100" className="circuit-path"/>
          </svg>
        </div>

        {/* Data particles */}
        <div className="data-particles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`data-particle data-particle-${i + 1}`}></div>
          ))}
        </div>

        {/* Binary rain effect */}
        <div className="binary-rain">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="binary-column">
              {Array.from({ length: 15 }, () => Math.random() > 0.5 ? '1' : '0').join('')}
            </div>
          ))}
        </div>

        {/* Tech shapes */}
        <div className="tech-shapes">
          <div className="tech-shape tech-hexagon shape-1"></div>
          <div className="tech-shape tech-triangle shape-2"></div>
          <div className="tech-shape tech-diamond shape-3"></div>
          <div className="tech-shape tech-hexagon shape-4"></div>
          <div className="tech-shape tech-triangle shape-5"></div>
        </div>

        {/* Original gradient orbs with parallax */}
        <div className="bg-gradient-orb orb-1" 
             style={{
               transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
             }}></div>
        <div className="bg-gradient-orb orb-2"
             style={{
               transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * 0.015}px)`
             }}></div>
        <div className="bg-gradient-orb orb-3"
             style={{
               transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * -0.01}px)`
             }}></div>
        
        {/* Enhanced floating particles */}
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`particle particle-${i}`}></div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        data-section="hero"
        className={`hero-section ${isVisible.hero ? 'animate-in' : ''}`}
      >
        <div className="hero-content">
          <div className="hero-text">
            <div className="text-animation-wrapper">
              <h1 className="hero-title">
                <span className="text-reveal">Discover Your</span>
                <span className="text-reveal gradient-text">Career Path</span>
              </h1>
              <p className="hero-subtitle">
                Get personalized guidance based on your skills, interests, and goals
              </p>
            </div>
            
            {user ? (
              <div className="user-welcome animate-fade-up">
                <div className="welcome-card">
                  <div className="avatar-section">
                    <div className="user-avatar">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="welcome-text">
                      <p className="welcome-message">Welcome back,</p>
                      <p className="user-name">{user.name}!</p>
                    </div>
                  </div>
                  <div className="progress-indicator">
                    <div className="progress-ring">
                      <svg viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" className="progress-bg"></circle>
                        <circle cx="18" cy="18" r="16" className="progress-bar"></circle>
                      </svg>
                      <div className="progress-text">75%</div>
                    </div>
                    <span className="progress-label">Profile Complete</span>
                  </div>
                </div>
                <div className="action-buttons">
                  <Link to="/quiz" className="cta-button primary">
                    <span className="button-icon">🎯</span>
                    Take Assessment
                    <span className="button-arrow">→</span>
                  </Link>
                  <Link to="/recommendations" className="cta-button secondary">
                    <span className="button-icon">💡</span>
                    View Recommendations
                  </Link>
                </div>
              </div>
            ) : (
              <div className="guest-actions animate-fade-up">
                <div className="guest-message">
                  <div className="message-icon">🚀</div>
                  <p>Create an account to unlock personalized career guidance</p>
                </div>
                <div className="action-buttons">
                  <Link to="/register" className="cta-button primary">
                    <span className="button-icon">✨</span>
                    Get Started
                    <span className="button-arrow">→</span>
                  </Link>
                  <Link to="/login" className="cta-button secondary">
                    <span className="button-icon">👤</span>
                    Sign In
                  </Link>
                </div>
                <div className="trust-indicators">
                  <div className="trust-item">
                    <span className="trust-number">10K+</span>
                    <span className="trust-label">Students Guided</span>
                  </div>
                  <div className="trust-item">
                    <span className="trust-number">95%</span>
                    <span className="trust-label">Success Rate</span>
                  </div>
                  <div className="trust-item">
                    <span className="trust-number">500+</span>
                    <span className="trust-label">Career Paths</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="hero-visual">
            <div className="visual-container">
              <div className="floating-card card-1" 
                   style={{
                     transform: `translateY(${Math.sin(Date.now() / 1000) * 10}px)`
                   }}>
                <div className="card-glow"></div>
                <span className="icon">🎯</span>
                <h3>Career Matching</h3>
                <p>AI-powered matching</p>
                <div className="card-stats">
                  <span className="stat">98% accuracy</span>
                </div>
              </div>
              
              <div className="floating-card card-2"
                   style={{
                     transform: `translateY(${Math.sin(Date.now() / 1000 + 2) * 15}px)`
                   }}>
                <div className="card-glow"></div>
                <span className="icon">📚</span>
                <h3>Course Recommendations</h3>
                <p>Personalized learning</p>
                <div className="card-stats">
                  <span className="stat">1000+ courses</span>
                </div>
              </div>
              
              <div className="floating-card card-3"
                   style={{
                     transform: `translateY(${Math.sin(Date.now() / 1000 + 4) * 12}px)`
                   }}>
                <div className="card-glow"></div>
                <span className="icon">🏫</span>
                <h3>College Finder</h3>
                <p>Best fit colleges</p>
                <div className="card-stats">
                  <span className="stat">500+ colleges</span>
                </div>
              </div>
              
              {/* Connecting lines between cards */}
              <div className="connection-lines">
                <svg viewBox="0 0 400 300" className="connections-svg">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                      <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M 100 80 Q 200 120 300 80" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="connection-path path-1" />
                  <path d="M 80 150 Q 200 180 320 150" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="connection-path path-2" />
                  <path d="M 120 220 Q 200 250 280 220" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="connection-path path-3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        ref={featuresRef}
        data-section="features"
        className={`features-section ${isVisible.features ? 'animate-in' : ''}`}
      >
        <div className="section-header">
          <div className="section-badge">How It Works</div>
          <h2 className="section-title">Your Journey to Success</h2>
          <p className="section-subtitle">
            Follow our proven 3-step process to discover your ideal career path
          </p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card" data-step="1">
            <div className="feature-background"></div>
            <div className="step-indicator">
              <span className="step-number">01</span>
            </div>
            <div className="feature-icon-wrapper">
              <div className="feature-icon">📊</div>
              <div className="icon-glow"></div>
            </div>
            <div className="feature-content">
              <h3>Take Assessment</h3>
              <p>Complete our comprehensive skill and interest assessment to understand your unique strengths and preferences</p>
              <div className="feature-stats">
                <div className="stat-item">
                  <span className="stat-number">15 min</span>
                  <span className="stat-label">Duration</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Questions</span>
                </div>
              </div>
            </div>
            <div className="feature-arrow">→</div>
          </div>
          
          <div className="feature-card" data-step="2">
            <div className="feature-background"></div>
            <div className="step-indicator">
              <span className="step-number">02</span>
            </div>
            <div className="feature-icon-wrapper">
              <div className="feature-icon">💡</div>
              <div className="icon-glow"></div>
            </div>
            <div className="feature-content">
              <h3>Get Recommendations</h3>
              <p>Receive AI-powered, personalized career and course recommendations tailored to your assessment results</p>
              <div className="feature-stats">
                <div className="stat-item">
                  <span className="stat-number">10+</span>
                  <span className="stat-label">Career Options</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Accuracy</span>
                </div>
              </div>
            </div>
            <div className="feature-arrow">→</div>
          </div>
          
          <div className="feature-card" data-step="3">
            <div className="feature-background"></div>
            <div className="step-indicator">
              <span className="step-number">03</span>
            </div>
            <div className="feature-icon-wrapper">
              <div className="feature-icon">🗺️</div>
              <div className="icon-glow"></div>
            </div>
            <div className="feature-content">
              <h3>Plan Your Path</h3>
              <p>Create a detailed roadmap with milestones, courses, and resources to achieve your career goals successfully</p>
              <div className="feature-stats">
                <div className="stat-item">
                  <span className="stat-number">Custom</span>
                  <span className="stat-label">Roadmap</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <div className="section-badge">Success Stories</div>
          <h2 className="section-title">What Our Users Say</h2>
        </div>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="quote-icon">"</div>
              <p>"CareerGuide helped me discover my passion for data science. The recommendations were spot-on!"</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">S</div>
              <div className="author-info">
                <h4>Sarah Johnson</h4>
                <span>Data Scientist</span>
              </div>
            </div>
            <div className="testimonial-rating">
              ⭐⭐⭐⭐⭐
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="quote-icon">"</div>
              <p>"The assessment was thorough and the career path suggestions opened up possibilities I never considered."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">M</div>
              <div className="author-info">
                <h4>Michael Chen</h4>
                <span>Software Engineer</span>
              </div>
            </div>
            <div className="testimonial-rating">
              ⭐⭐⭐⭐⭐
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="quote-icon">"</div>
              <p>"Thanks to CareerGuide, I found the perfect college program that aligned with my interests and goals."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">E</div>
              <div className="author-info">
                <h4>Emily Rodriguez</h4>
                <span>Design Student</span>
              </div>
            </div>
            <div className="testimonial-rating">
              ⭐⭐⭐⭐⭐
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
