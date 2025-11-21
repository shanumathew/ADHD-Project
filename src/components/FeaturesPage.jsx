import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

// CSS 3D Icon Components
const Icon3D = ({ type, style }) => {
  const iconRef = useRef();
  
  useEffect(() => {
    if (type === 'dollar' || type === 'globe') {
      // Static icons - no animation
      return;
    }
    
    const animate = () => {
      if (iconRef.current) {
        const time = Date.now() * 0.001;
        
        if (type === 'trophy') {
          iconRef.current.style.transform = `rotateY(${Math.sin(time) * 20}deg) rotateX(${Math.cos(time * 0.5) * 10}deg)`;
        } else if (type === 'lightning') {
          iconRef.current.style.transform = `translateY(${Math.sin(time * 2) * 5}px) rotateZ(${Math.sin(time) * 5}deg)`;
        } else if (type === 'shield') {
          iconRef.current.style.transform = `rotateY(${Math.sin(time * 0.6) * 15}deg) rotateX(10deg)`;
        } else if (type === 'patent') {
          iconRef.current.style.transform = `rotateY(${Math.sin(time * 0.5) * 10}deg) rotateZ(${Math.sin(time * 0.5) * 5}deg)`;
        }
      }
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [type]);

  const getIconContent = () => {
    switch(type) {
      case 'trophy':
        return (
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: 'white' }}>
            <g transform="translate(0, 5)">
              <path d="M30,20 h40 v5 l-5,15 h-30 l-5,-15 z M35,40 h30 v10 h-30 z M45,50 h10 v15 h-10 z M35,65 h30 v5 h-30 z" />
              <rect x="20" y="15" width="10" height="15" rx="2"/>
              <rect x="70" y="15" width="10" height="15" rx="2"/>
            </g>
          </svg>
        );
      case 'dollar':
        return (
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: 'white', transform: 'scaleX(-1)' }}>
            <g transform="translate(0, 0)">
              <line x1="50" y1="15" x2="50" y2="25" stroke="white" strokeWidth="5" strokeLinecap="round"/>
              <line x1="50" y1="75" x2="50" y2="85" stroke="white" strokeWidth="5" strokeLinecap="round"/>
              <path d="M35,30 h15 Q60,30 60,40 Q60,50 50,50 h-10 Q30,50 30,60 Q30,70 40,70 h20" 
                    stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
          </svg>
        );
      case 'lightning':
        return (
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: 'white' }}>
            <g transform="translate(0, 5)">
              <path d="M55,10 L30,50 h20 L45,85 L70,50 h-20 z" />
            </g>
          </svg>
        );
      case 'globe':
        return (
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', stroke: 'white', fill: 'none', strokeWidth: '3' }}>
            <g transform="translate(0, 0)">
              <circle cx="50" cy="50" r="35" />
              <ellipse cx="50" cy="50" rx="35" ry="12" />
              <ellipse cx="50" cy="50" rx="12" ry="35" />
              <path d="M15,50 h70 M50,15 v70" />
            </g>
          </svg>
        );
      case 'shield':
        return (
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: 'white', stroke: 'white', strokeWidth: '0' }}>
            <g transform="translate(0, 5)">
              <path d="M50,15 L25,27 L25,50 Q25,75 50,85 Q75,75 75,50 L75,27 Z" />
              <path d="M40,50 L47,57 L62,40" fill="none" stroke="black" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
          </svg>
        );
      case 'patent':
        return (
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: 'white' }}>
            <g transform="translate(0, 5)">
              <rect x="30" y="15" width="40" height="60" rx="3" stroke="white" strokeWidth="2"/>
              <rect x="37" y="25" width="26" height="7" fill="rgba(0,0,0,0.7)" rx="1"/>
              <rect x="37" y="38" width="26" height="3" fill="rgba(0,0,0,0.7)" rx="1"/>
              <rect x="37" y="45" width="20" height="3" fill="rgba(0,0,0,0.7)" rx="1"/>
              <rect x="37" y="52" width="26" height="3" fill="rgba(0,0,0,0.7)" rx="1"/>
              <rect x="37" y="59" width="22" height="3" fill="rgba(0,0,0,0.7)" rx="1"/>
            </g>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes spinSlow {
            from { transform: rotateY(0deg); }
            to { transform: rotateY(360deg); }
          }
        `}
      </style>
      <div 
        ref={iconRef}
        style={{
          width: '120px',
          height: '120px',
          margin: '0 auto',
          transformStyle: 'preserve-3d',
          transition: type === 'dollar' || type === 'globe' ? 'none' : 'transform 0.1s linear',
          filter: 'drop-shadow(0 10px 30px rgba(255,255,255,0.3))',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          ...style
        }}
      >
        {getIconContent()}
      </div>
    </>
  );
};

const FeaturesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <nav className="navbar scrolled">
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="logo-text">MC Biomarker</span>
        </div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/features" className="active">Features</a></li>
          <li><a href="/tasks">Tasks</a></li>
          <li><a href="/why-us">Why Us</a></li>
          <li><a href="/benefits">Benefits</a></li>
        </ul>
        <button className="nav-cta" onClick={() => navigate('/login')}>
          Get Started →
        </button>
      </nav>

      <section id="features" className="features-section" style={{ paddingTop: '8rem', background: 'linear-gradient(180deg, #000 0%, #0a0a0a 100%)' }}>
        <div className="section-header" style={{ marginBottom: '4rem' }}>
          <h2 className="section-title">
            What Makes MC Biomarker Different
          </h2>
          <p className="section-subtitle">
            Explore the advantages that could transform ADHD diagnosis for your practice
          </p>
        </div>

        <div className="features-grid">
          {/* Superior Accuracy */}
          <div className="feature-card-wrapper">
            <div className="feature-icon-container">
              <Icon3D type="trophy" />
            </div>
            <h3 className="feature-card-title">
              High Diagnostic Accuracy
            </h3>
            <p className="feature-card-description">
              <strong style={{ color: '#fff', fontSize: '1.3rem' }}>91% AUC</strong> — achieving superior performance in clinical validation studies
            </p>
            <div className="feature-comparison">
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>vs. Traditional Methods</span>
              <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>+23%</span>
            </div>
          </div>

          {/* Cost Effective */}
          <div className="feature-card-wrapper">
            <div className="feature-icon-container">
              <Icon3D type="dollar" />
            </div>
            <h3 className="feature-card-title">
              Cost-Effective Solution
            </h3>
            <p className="feature-card-description">
              <strong style={{ color: '#fff', fontSize: '1.3rem' }}>$20 per test</strong> — significantly more affordable than traditional diagnostic methods
            </p>
            <div className="feature-comparison">
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>vs. EEG/fMRI</span>
              <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>150x cheaper</span>
            </div>
          </div>

          {/* Fast Results */}
          <div className="feature-card-wrapper">
            <div className="feature-icon-container">
              <Icon3D type="lightning" />
            </div>
            <h3 className="feature-card-title">
              Quick Assessment
            </h3>
            <p className="feature-card-description">
              <strong style={{ color: '#fff', fontSize: '1.3rem' }}>15 minutes</strong> — streamlined testing process with rapid results
            </p>
            <div className="feature-comparison">
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>vs. Neuroimaging</span>
              <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>6x faster</span>
            </div>
          </div>

          {/* Highly Accessible */}
          <div className="feature-card-wrapper">
            <div className="feature-icon-container">
              <Icon3D type="globe" />
            </div>
            <h3 className="feature-card-title">
              Broad Accessibility
            </h3>
            <p className="feature-card-description">
              <strong style={{ color: '#fff', fontSize: '1.3rem' }}>Device-agnostic</strong> — works on standard computers without specialized equipment
            </p>
            <div className="feature-comparison">
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Geographic Reach</span>
              <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>Unlimited</span>
            </div>
          </div>

          {/* Zero Bias */}
          <div className="feature-card-wrapper">
            <div className="feature-icon-container">
              <Icon3D type="shield" />
            </div>
            <h3 className="feature-card-title">
              Objective Measurement
            </h3>
            <p className="feature-card-description">
              <strong style={{ color: '#fff', fontSize: '1.3rem' }}>Cognitive biomarker</strong> — designed to minimize demographic bias in assessment
            </p>
            <div className="feature-comparison">
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Demographic Variance</span>
              <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>0%</span>
            </div>
          </div>


        </div>

        {/* Competitive Advantage Section */}
        <div style={{ 
          marginTop: '8rem', 
          padding: '5rem 3rem',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
          borderRadius: '32px',
          border: '1px solid rgba(255,255,255,0.15)',
          maxWidth: '1400px',
          margin: '8rem auto 0'
        }}>
          <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '3rem', textAlign: 'center' }}>
            How We Compare
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
            {/* Column Headers */}
            <div></div>
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', fontWeight: '600' }}>COST</div>
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', fontWeight: '600' }}>TIME</div>
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', fontWeight: '600' }}>ACCURACY</div>
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', fontWeight: '600' }}>ACCESS</div>

            {/* Conners Scale */}
            <div style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>Conners Scale</div>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', color: 'rgba(255,255,255,0.6)' }}>$50</div>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', color: 'rgba(255,255,255,0.6)' }}>5 min</div>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,100,100,0.1)', borderRadius: '8px', color: 'rgba(255,100,100,0.8)' }}>68%</div>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', color: 'rgba(255,255,255,0.6)' }}>High</div>

            {/* CPT */}
            <div style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>CPT (QbTest)</div>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,150,100,0.1)', borderRadius: '8px', color: 'rgba(255,150,100,0.8)' }}>$3,000</div>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', color: 'rgba(255,255,255,0.6)' }}>20 min</div>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,100,100,0.1)', borderRadius: '8px', color: 'rgba(255,100,100,0.8)' }}>71%</div>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,200,100,0.1)', borderRadius: '8px', color: 'rgba(255,200,100,0.8)' }}>Medium</div>

            {/* fMRI */}
            <div style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>fMRI</div>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,100,100,0.1)', borderRadius: '8px', color: 'rgba(255,100,100,0.8)' }}>$2,000</div>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,100,100,0.1)', borderRadius: '8px', color: 'rgba(255,100,100,0.8)' }}>90 min</div>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,200,100,0.1)', borderRadius: '8px', color: 'rgba(255,200,100,0.8)' }}>74%</div>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,100,100,0.1)', borderRadius: '8px', color: 'rgba(255,100,100,0.8)' }}>Very Low</div>

            {/* EEG */}
            <div style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>EEG/ERP</div>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,0,0,0.15)', borderRadius: '8px', color: 'rgba(255,100,100,0.9)' }}>$15,000</div>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,150,100,0.1)', borderRadius: '8px', color: 'rgba(255,150,100,0.8)' }}>60 min</div>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,200,100,0.1)', borderRadius: '8px', color: 'rgba(255,200,100,0.8)' }}>75%</div>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,200,100,0.1)', borderRadius: '8px', color: 'rgba(255,200,100,0.8)' }}>Medium</div>

            {/* MC Biomarker - Winner */}
            <div style={{ 
              color: '#fff', 
              fontWeight: '700', 
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              MC Biomarker
              <span style={{ 
                fontSize: '0.7rem', 
                padding: '0.2rem 0.6rem', 
                background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)', 
                color: '#000',
                borderRadius: '12px',
                fontWeight: '700'
              }}>YOU</span>
            </div>
            <div style={{ 
              textAlign: 'center', 
              padding: '0.8rem', 
              background: 'linear-gradient(135deg, rgba(100,255,150,0.2) 0%, rgba(100,255,150,0.1) 100%)', 
              borderRadius: '12px', 
              color: 'rgba(150,255,200,1)',
              fontWeight: '700',
              fontSize: '1.1rem',
              border: '2px solid rgba(100,255,150,0.3)'
            }}>$20</div>
            <div style={{ 
              textAlign: 'center', 
              padding: '0.8rem', 
              background: 'linear-gradient(135deg, rgba(100,255,150,0.2) 0%, rgba(100,255,150,0.1) 100%)', 
              borderRadius: '12px', 
              color: 'rgba(150,255,200,1)',
              fontWeight: '700',
              fontSize: '1.1rem',
              border: '2px solid rgba(100,255,150,0.3)'
            }}>15 min</div>
            <div style={{ 
              textAlign: 'center', 
              padding: '0.8rem', 
              background: 'linear-gradient(135deg, rgba(100,255,150,0.2) 0%, rgba(100,255,150,0.1) 100%)', 
              borderRadius: '12px', 
              color: 'rgba(150,255,200,1)',
              fontWeight: '700',
              fontSize: '1.1rem',
              border: '2px solid rgba(100,255,150,0.3)'
            }}>91%</div>
            <div style={{ 
              textAlign: 'center', 
              padding: '0.8rem', 
              background: 'linear-gradient(135deg, rgba(100,255,150,0.2) 0%, rgba(100,255,150,0.1) 100%)', 
              borderRadius: '12px', 
              color: 'rgba(150,255,200,1)',
              fontWeight: '700',
              fontSize: '1.1rem',
              border: '2px solid rgba(100,255,150,0.3)'
            }}>Unlimited</div>
          </div>

          {/* Key Metrics Highlight */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '4rem', 
            marginTop: '4rem',
            padding: '2rem',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>750x</div>
              <div style={{ color: 'rgba(255,255,255,0.7)' }}>Cheaper than EEG</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>6x</div>
              <div style={{ color: 'rgba(255,255,255,0.7)' }}>Faster than fMRI</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>23%</div>
              <div style={{ color: 'rgba(255,255,255,0.7)' }}>More Accurate</div>
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

export default FeaturesPage;
