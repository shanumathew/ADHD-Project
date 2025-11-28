import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TaskDetailsModal from './TaskDetailsModal';
import '../styles/assessment.css';

const AssessmentPage = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!userProfile?.profileComplete) {
      navigate('/profile');
    }
  }, [currentUser, userProfile, navigate]);

  const handleTaskInfo = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // SVG icons for each task
  const TaskIcon = ({ type }) => {
    const icons = {
      cpt: (
        <svg viewBox="0 0 100 100" className="task-icon-svg">
          <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="3"/>
          <circle cx="50" cy="50" r="8" fill="rgba(255,255,255,0.9)"/>
          <line x1="50" y1="20" x2="50" y2="35" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
          <line x1="50" y1="65" x2="50" y2="80" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
          <line x1="20" y1="50" x2="35" y2="50" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
          <line x1="65" y1="50" x2="80" y2="50" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
        </svg>
      ),
      gonogo: (
        <svg viewBox="0 0 100 100" className="task-icon-svg">
          <circle cx="35" cy="50" r="20" fill="rgba(100,255,100,0.3)" stroke="rgba(100,255,100,0.8)" strokeWidth="2"/>
          <circle cx="65" cy="50" r="20" fill="rgba(255,100,100,0.3)" stroke="rgba(255,100,100,0.8)" strokeWidth="2"/>
          <path d="M30 50 L33 53 L40 45" stroke="rgba(255,255,255,0.9)" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <line x1="60" y1="45" x2="70" y2="55" stroke="rgba(255,255,255,0.9)" strokeWidth="3" strokeLinecap="round"/>
          <line x1="70" y1="45" x2="60" y2="55" stroke="rgba(255,255,255,0.9)" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      ),
      nback: (
        <svg viewBox="0 0 100 100" className="task-icon-svg">
          <rect x="15" y="30" width="20" height="40" rx="3" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
          <rect x="40" y="20" width="20" height="50" rx="3" fill="rgba(255,255,255,0.4)" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
          <rect x="65" y="25" width="20" height="45" rx="3" fill="rgba(255,255,255,0.6)" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
          <text x="25" y="55" fill="rgba(255,255,255,0.9)" fontSize="14" fontWeight="bold" textAnchor="middle">N</text>
          <text x="50" y="50" fill="rgba(255,255,255,0.9)" fontSize="14" fontWeight="bold" textAnchor="middle">-1</text>
          <text x="75" y="52" fill="rgba(255,255,255,0.9)" fontSize="14" fontWeight="bold" textAnchor="middle">-2</text>
        </svg>
      ),
      flanker: (
        <svg viewBox="0 0 100 100" className="task-icon-svg">
          <polygon points="25,50 35,40 35,45 50,45 50,55 35,55 35,60" fill="rgba(255,255,255,0.5)"/>
          <polygon points="75,50 65,40 65,45 50,45 50,55 65,55 65,60" fill="rgba(255,255,255,0.5)"/>
          <polygon points="50,35 60,50 50,65 40,50" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,1)" strokeWidth="2"/>
        </svg>
      ),
      trail: (
        <svg viewBox="0 0 100 100" className="task-icon-svg">
          <circle cx="25" cy="30" r="12" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
          <circle cx="75" cy="30" r="12" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
          <circle cx="50" cy="70" r="12" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
          <text x="25" y="35" fill="rgba(255,255,255,0.9)" fontSize="12" fontWeight="bold" textAnchor="middle">1</text>
          <text x="75" y="35" fill="rgba(255,255,255,0.9)" fontSize="12" fontWeight="bold" textAnchor="middle">2</text>
          <text x="50" y="75" fill="rgba(255,255,255,0.9)" fontSize="12" fontWeight="bold" textAnchor="middle">3</text>
          <line x1="35" y1="35" x2="63" y2="35" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeDasharray="4,2"/>
          <line x1="70" y1="42" x2="55" y2="60" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeDasharray="4,2"/>
        </svg>
      )
    };
    return icons[type] || null;
  };

  const tasks = [
    {
      id: 'cpt',
      name: 'Continuous Performance Task',
      shortName: 'CPT',
      description: 'Test sustained attention and response inhibition',
      color: '#667eea',
      route: '/tasks/cpt',
      duration: '~5 min'
    },
    {
      id: 'gonogo',
      name: 'Go/No-Go Task',
      shortName: 'Go/No-Go',
      description: 'Assess impulse control and inhibition',
      color: '#764ba2',
      route: '/tasks/gonogo',
      duration: '~4 min'
    },
    {
      id: 'nback',
      name: 'N-Back Task',
      shortName: 'N-Back',
      description: 'Evaluate working memory capacity',
      color: '#f093fb',
      route: '/tasks/nback',
      duration: '~5 min'
    },
    {
      id: 'flanker',
      name: 'Flanker Task',
      shortName: 'Flanker',
      description: 'Test selective attention and distraction resistance',
      color: '#4facfe',
      route: '/tasks/flanker',
      duration: '~4 min'
    },
    {
      id: 'trail',
      name: 'Trail-Making Task',
      shortName: 'Trail-Making',
      description: 'Measure processing speed and sequencing',
      color: '#43e97b',
      route: '/tasks/trail',
      duration: '~3 min'
    }
  ];

  return (
    <div className="assessment-container">
      {/* Header */}
      <header className="assessment-header">
        <div className="header-content">
          <div className="branding">
            <h1>Take Assessment</h1>
            <p>Complete cognitive tasks and questionnaire</p>
          </div>
          <div className="header-actions">
            <button onClick={() => navigate('/dashboard')} className="btn btn-outline-small">
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="assessment-content">
        {/* DSM-5 Questionnaire Section */}
        <div className="assessment-section">
          <div className="section-header-bar">
            <div className="section-icon questionnaire-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
            </div>
            <div className="section-header-text">
              <h2>DSM-5 ADHD Questionnaire</h2>
              <p>22 questions based on official diagnostic criteria</p>
            </div>
            <button 
              className="btn btn-primary section-btn"
              onClick={() => navigate('/questionnaire')}
            >
              Start Questionnaire
            </button>
          </div>
          <div className="section-details">
            <div className="detail-item">
              <span className="detail-label">Duration</span>
              <span className="detail-value">~10 min</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Parts</span>
              <span className="detail-value">3 sections</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Type</span>
              <span className="detail-value">Self-report</span>
            </div>
          </div>
        </div>

        {/* Cognitive Tasks Section */}
        <div className="assessment-section">
          <div className="section-header-bar tasks-header-bar">
            <div className="section-icon tasks-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <div className="section-header-text">
              <h2>Cognitive Performance Tasks</h2>
              <p>5 scientifically validated tests measuring attention, memory, and impulse control</p>
            </div>
          </div>
          
          <div className="tasks-grid">
            {tasks.map(task => (
              <div
                key={task.id}
                className="task-card"
                style={{ '--task-color': task.color }}
              >
                <div className="task-header">
                  <div className="task-icon"><TaskIcon type={task.id} /></div>
                  <div className="task-duration">{task.duration}</div>
                </div>
                
                <h3>{task.name}</h3>
                <p className="task-description">{task.description}</p>
                
                <div className="task-actions">
                  <button
                    className="btn btn-primary task-btn"
                    onClick={() => navigate(task.route)}
                  >
                    Start Task
                  </button>
                  <button
                    className="task-info-icon"
                    onClick={() => handleTaskInfo(task)}
                    title="Learn more about this task"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="section-footer">
            <p>Total time for all tasks: ~21 minutes</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="info-box">
          <div className="info-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>
          <p>
            Complete both the questionnaire and cognitive tasks for the most comprehensive assessment. 
            Results from all assessments will be combined in your cognitive profile.
          </p>
        </div>
      </div>

      {/* Task Details Modal */}
      <TaskDetailsModal 
        task={selectedTask} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default AssessmentPage;
