import React, { useState, useEffect, useRef } from 'react';
import './LandingPage.css';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let animationFrameId;
    
    const handleMouseMove = (e) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      animationFrameId = requestAnimationFrame(() => {
        if (heroRef.current) {
          const rect = heroRef.current.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          setMousePosition({ x, y });
        }
      });
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => {
        heroElement.removeEventListener('mousemove', handleMouseMove);
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }
  }, []);

  return (
    <div className="landing-page">
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <span className="logo-text">MC Biomarker</span>
        </div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/features">Features</a></li>
          <li><a href="/tasks">Tasks</a></li>
          <li><a href="/why-us">Why Us</a></li>
          <li><a href="/benefits">Benefits</a></li>
        </ul>
        <button className="nav-cta" onClick={() => window.location.href = '/login'}>
          Get Started →
        </button>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero-section" ref={heroRef}>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-word">MC BIOMARKER</span>
            <span className="title-word">ADHD ASSESSMENT</span>
          </h1>
          <p className="hero-subtitle">
            Revolutionary cross-task consistency metric achieving 91% diagnostic accuracy (AUC 0.91) — 
            outperforming traditional methods by 23-24% while being 75x cheaper and 4x faster.
          </p>
          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => window.location.href = '/login'}>
              Start Assessment
            </button>
            <button className="secondary-btn" onClick={() => window.location.href = '/features'}>
              Learn More
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <h3>94.7%</h3>
              <p>Diagnostic Accuracy</p>
            </div>
            <div className="stat">
              <h3>0.91</h3>
              <p>AUC Score</p>
            </div>
            <div className="stat">
              <h3>75x</h3>
              <p>More Affordable</p>
            </div>
          </div>
        </div>
        <div 
          className="hero-visual-3d"
          style={{
            transform: `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg)`
          }}
        >
          <div className="central-card"
            style={{
              transform: `translate(-50%, -50%) rotateY(${-15 + mousePosition.x * 10}deg) rotateX(${5 - mousePosition.y * 5}deg) translateZ(${10 + Math.abs(mousePosition.x) * 15}px)`
            }}
          >
            <div className="card-header">MC Score</div>
            <div className="card-score">
              <div className="score-label">Diagnostic Confidence</div>
              <div className="score-value">91%</div>
              <div className="score-bar">
                <div className="score-progress" style={{ width: '91%' }}></div>
              </div>
            </div>
            <div className="card-metrics">
              <div className="metric">
                <span className="metric-label">Sensitivity</span>
                <div className="metric-bar-container">
                  <div className="metric-bar" style={{ width: '94.4%' }}></div>
                </div>
                <span className="metric-value">94</span>
              </div>
              <div className="metric">
                <span className="metric-label">Specificity</span>
                <div className="metric-bar-container">
                  <div className="metric-bar" style={{ width: '95%' }}></div>
                </div>
                <span className="metric-value">95</span>
              </div>
              <div className="metric">
                <span className="metric-label">Accuracy</span>
                <div className="metric-bar-container">
                  <div className="metric-bar" style={{ width: '94.7%' }}></div>
                </div>
                <span className="metric-value">95</span>
              </div>
            </div>
          </div>
          <div className="cube-3d cube-1"
            style={{
              transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px) rotateX(${mousePosition.y * 45}deg) rotateY(${mousePosition.x * 45}deg)`
            }}
          ></div>
          <div className="cube-3d cube-2"
            style={{
              transform: `translate(${-mousePosition.x * 20}px, ${-mousePosition.y * 20}px) rotateX(${-mousePosition.y * 50}deg) rotateY(${-mousePosition.x * 50}deg)`
            }}
          ></div>
          <div className="cube-3d cube-3"
            style={{
              transform: `translate(${mousePosition.x * 12}px, ${mousePosition.y * 12}px) rotateX(${mousePosition.y * 40}deg) rotateY(${mousePosition.x * 40}deg)`
            }}
          ></div>
          <div className="cube-3d cube-4"
            style={{
              transform: `translate(${-mousePosition.x * 18}px, ${-mousePosition.y * 18}px) rotateX(${-mousePosition.y * 48}deg) rotateY(${-mousePosition.x * 48}deg)`
            }}
          ></div>
          <div className="cube-3d cube-5"
            style={{
              transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px) rotateX(${mousePosition.y * 35}deg) rotateY(${mousePosition.x * 35}deg)`
            }}
          ></div>
          <div className="cube-3d cube-6"
            style={{
              transform: `translate(${-mousePosition.x * 22}px, ${-mousePosition.y * 22}px) rotateX(${-mousePosition.y * 52}deg) rotateY(${-mousePosition.x * 52}deg)`
            }}
          ></div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Experience the Future of ADHD Diagnosis</h2>
          <p>Join the revolution in objective, accurate, and accessible ADHD assessment</p>
          <button className="cta-button" onClick={() => window.location.href = '/login'}>
            Start Clinical Assessment →
          </button>
          <p className="cta-note">Patent-protected technology • FDA regulatory pathway • 15-minute evaluation</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>MC Biomarker</h4>
            <p>Revolutionary cross-task consistency metric for ADHD diagnosis. Patent-protected innovation achieving 91% diagnostic accuracy.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/features">Features</a></li>
              <li><a href="/tasks">Tasks</a></li>
              <li><a href="/why-us">Why Us</a></li>
              <li><a href="/benefits">Benefits</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#documentation">Documentation</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 MC Biomarker Assessment Suite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
