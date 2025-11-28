import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ResultsPanel from './ResultsPanel';
import ChatbotPopup from './ChatbotPopup';
import AIProfileGenerator from './AIProfileGenerator';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);
  const [isProfileGeneratorOpen, setIsProfileGeneratorOpen] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Redirect to profile if not complete
    if (!userProfile?.profileComplete) {
      navigate('/profile');
    }
  }, [currentUser, userProfile, navigate]);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await logout();
      navigate('/login');
    }
  };

  const displayName = userProfile?.name || currentUser?.displayName || 'User';

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="branding">
            <h1>ADHD Assessment Suite</h1>
            <p>Comprehensive Cognitive Assessment Platform</p>
          </div>
          <div className="header-actions">
            <button onClick={() => navigate('/')} className="btn btn-outline-small">
              Home
            </button>
            <button onClick={handleLogout} className="btn btn-secondary">
              Log Out
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-text">
            <h2>Welcome back, {displayName}!</h2>
            <p>Choose an option below to get started with your cognitive assessment.</p>
          </div>
          <button 
            onClick={() => navigate('/profile')} 
            className="btn btn-outline-small"
          >
            Edit Profile
          </button>
        </div>

        {/* User Info Bar */}
        <div className="user-info-bar">
          <div className="info-item">
            <span className="label">Tester ID:</span>
            <span className="value">{userProfile?.testerId}</span>
          </div>
          <div className="info-item">
            <span className="label">Age:</span>
            <span className="value">{userProfile?.age}</span>
          </div>
          <div className="info-item">
            <span className="label">Gender:</span>
            <span className="value capitalize">{userProfile?.gender}</span>
          </div>
          <div className="info-item">
            <span className="label">ADHD Status:</span>
            <span className={`value status-badge status-${userProfile?.adhdStatus}`}>
              {userProfile?.adhdStatus}
            </span>
          </div>
        </div>

        {/* Main Dashboard Cards */}
        {!activeSection && (
          <div className="dashboard-cards">
            {/* Take Assessment Card */}
            <div className="dashboard-card assessment-card" onClick={() => navigate('/assessment')}>
              <div className="card-icon">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <div className="card-content">
                <h3>Take Assessment</h3>
                <p>Complete cognitive tasks and DSM-5 questionnaire to evaluate attention, memory, and impulse control.</p>
                <div className="card-meta">
                  <span>5 Tasks + 22 Questions</span>
                  <span>~30 min total</span>
                </div>
              </div>
              <div className="card-arrow">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </div>
            </div>

            {/* View Results Card */}
            <div className="dashboard-card results-card" onClick={() => setActiveSection('results')}>
              <div className="card-icon">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>
              <div className="card-content">
                <h3>View Results</h3>
                <p>Review your assessment scores, track progress over time, and see detailed performance metrics.</p>
                <div className="card-meta">
                  <span>Task Scores</span>
                  <span>Performance Analysis</span>
                </div>
              </div>
              <div className="card-arrow">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </div>
            </div>

            {/* Generate Cognitive Profile Card */}
            <div className="dashboard-card profile-card" onClick={() => setIsProfileGeneratorOpen(true)}>
              <div className="card-icon">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <div className="card-content">
                <h3>AI Cognitive Profile</h3>
                <p>Generate a comprehensive AI-powered cognitive profile report based on your assessment data.</p>
                <div className="card-meta">
                  <span>AI Analysis</span>
                  <span>Detailed Report</span>
                </div>
              </div>
              <div className="card-arrow">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {activeSection === 'results' && (
          <div className="section-container">
            <div className="section-back">
              <button className="btn btn-outline-small" onClick={() => setActiveSection(null)}>
                Back to Dashboard
              </button>
            </div>
            <ResultsPanel />
          </div>
        )}

        {/* Footer Info */}
        <div className="dashboard-footer">
          <p>All data is securely stored and private to your account</p>
        </div>
      </div>

      {/* AI Cognitive Profile Generator Modal */}
      <AIProfileGenerator 
        isOpen={isProfileGeneratorOpen}
        onClose={() => setIsProfileGeneratorOpen(false)}
      />

      {/* AI Chatbot Popup */}
      <ChatbotPopup />
    </div>
  );
};

export default Dashboard;
