import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const WhyUsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <nav className="navbar scrolled">
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="logo-text">MC Biomarker</span>
        </div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/features">Features</a></li>
          <li><a href="/tasks">Tasks</a></li>
          <li><a href="/why-us" className="active">Why Us</a></li>
          <li><a href="/benefits">Benefits</a></li>
        </ul>
        <button className="nav-cta" onClick={() => navigate('/login')}>
          Get Started →
        </button>
      </nav>

      <section id="why-us" className="why-us-section" style={{ paddingTop: '8rem' }}>
        <div className="section-header">
          <h2 className="section-title">Why Choose MC Biomarker</h2>
          <p className="section-subtitle">Market-leading performance backed by clinical validation</p>
        </div>
        
        <div className="why-us-grid">
          <div className="why-card">
            <div className="why-icon-3d">
              <svg viewBox="0 0 100 100" style={{ width: '80px', height: '80px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
                <polygon points="50,15 65,45 95,50 70,70 75,100 50,85 25,100 30,70 5,50 35,45" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                <polygon points="50,20 63,45 88,50 68,68 72,95 50,82 28,95 32,68 12,50 37,45" fill="rgba(255,255,100,0.3)"/>
              </svg>
            </div>
            <h3>Fast & Efficient</h3>
            <p>Complete diagnostic evaluation in just 15 minutes compared to 60-90 minutes for traditional methods.</p>
            <div className="why-stat">15 Minutes</div>
          </div>
          
          <div className="why-card">
            <div className="why-icon-3d">
              <svg viewBox="0 0 100 100" style={{ width: '80px', height: '80px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
                <circle cx="50" cy="50" r="35" fill="rgba(100,255,100,0.2)" stroke="rgba(100,255,100,0.6)" strokeWidth="3"/>
                <path d="M 30 50 L 45 65 L 70 35" stroke="rgba(255,255,255,0.9)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Cost Effective</h3>
            <p>Affordable $20 assessment accessible to everyone versus expensive traditional diagnostics.</p>
            <div className="why-stat">$20 per test</div>
          </div>
          
          <div className="why-card">
            <div className="why-icon-3d">
              <svg viewBox="0 0 100 100" style={{ width: '80px', height: '80px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
                <rect x="20" y="70" width="12" height="20" fill="rgba(100,150,255,0.7)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                <rect x="37" y="55" width="12" height="35" fill="rgba(100,150,255,0.8)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                <rect x="54" y="35" width="12" height="55" fill="rgba(100,150,255,0.9)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                <rect x="71" y="20" width="12" height="70" fill="rgba(100,200,255,1)" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
              </svg>
            </div>
            <h3>Highly Accurate</h3>
            <p>94.7% diagnostic accuracy with 0.91 AUC outperforms existing assessment methods.</p>
            <div className="why-stat">94.7% Accuracy</div>
          </div>
        </div>

        <div className="competitive-landscape" style={{ marginTop: '6rem' }}>
          <h2 className="section-title">Our Competitive Edge</h2>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', maxWidth: '900px', margin: '2rem auto 3rem', color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>
            MC Biomarker delivers clinical-grade accuracy at consumer-scale accessibility.
          </p>
          
          <div className="advantage-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div className="advantage-card">
              <div className="advantage-value">150x</div>
              <div className="advantage-label">More Affordable</div>
              <div className="advantage-detail">vs. specialized equipment</div>
            </div>
            <div className="advantage-card">
              <div className="advantage-value">23%</div>
              <div className="advantage-label">Higher Accuracy</div>
              <div className="advantage-detail">vs. traditional methods</div>
            </div>
            <div className="advantage-card">
              <div className="advantage-value">6x</div>
              <div className="advantage-label">Faster Results</div>
              <div className="advantage-detail">vs. neuroimaging</div>
            </div>
          </div>
        </div>
      </section>

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

export default WhyUsPage;
