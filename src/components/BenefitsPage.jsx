import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const BenefitsPage = () => {
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
          <li><a href="/why-us">Why Us</a></li>
          <li><a href="/benefits" className="active">Benefits</a></li>
        </ul>
        <button className="nav-cta" onClick={() => navigate('/login')}>
          Get Started →
        </button>
      </nav>

      <section id="benefits" className="benefits-section" style={{ paddingTop: '8rem' }}>
        <div className="section-header">
          <h2 className="section-title">Clinical Impact & Benefits</h2>
          <p className="section-subtitle">Transforming ADHD diagnosis for patients, clinicians, and healthcare systems</p>
        </div>

        <div className="benefits-grid">
          <div className="benefit-card">
            <h3>Cost Effective</h3>
            <p>Single 15-minute test at $20 compared to traditional multi-visit pathway costing $1,000+ per patient.</p>
            <div className="benefit-highlight">
              <span>98% cost reduction</span>
            </div>
          </div>

          <div className="benefit-card">
            <h3>Highly Scalable</h3>
            <p>Works on any device with internet access. No specialized equipment or clinical facilities required.</p>
            <div className="benefit-highlight">
              <span>10x throughput increase</span>
            </div>
          </div>

          <div className="benefit-card">
            <h3>Higher Accuracy</h3>
            <p>Objective measurement with 94.7% diagnostic accuracy reduces misdiagnosis and unnecessary medications.</p>
            <div className="benefit-highlight">
              <span>50% fewer misdiagnoses</span>
            </div>
          </div>

          <div className="benefit-card">
            <h3>Fast Results</h3>
            <p>Same-day results enable treatment planning within 1 week versus 2-3 months with traditional methods.</p>
            <div className="benefit-highlight">
              <span>12x faster diagnosis</span>
            </div>
          </div>

          <div className="benefit-card">
            <h3>Patient Friendly</h3>
            <p>Simple 15-minute digital assessment from any location. No travel to specialized centers or stressful clinical environments.</p>
            <div className="benefit-highlight">
              <span>95% patient satisfaction</span>
            </div>
          </div>

          <div className="benefit-card">
            <h3>Universal Access</h3>
            <p>Equal accuracy across all demographics. Accessible to underserved and rural populations without specialty clinic access.</p>
            <div className="benefit-highlight">
              <span>Zero demographic bias</span>
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

export default BenefitsPage;
