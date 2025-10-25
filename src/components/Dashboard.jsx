import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TaskDetailsModal from './TaskDetailsModal';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tasks');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (!currentUser) {
      navigate('/');
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
      navigate('/');
    }
  };

  const handleTaskInfo = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const tasks = [
    {
      id: 'cpt',
      name: 'Continuous Performance Task',
      shortName: 'CPT',
      description: 'Test sustained attention and response inhibition',
      icon: '👁️',
      color: '#667eea',
      route: '/tasks/cpt',
      duration: '~5 min'
    },
    {
      id: 'gonogo',
      name: 'Go/No-Go Task',
      shortName: 'Go/No-Go',
      description: 'Assess impulse control and inhibition',
      icon: '🎯',
      color: '#764ba2',
      route: '/tasks/gonogo',
      duration: '~4 min'
    },
    {
      id: 'nback',
      name: 'N-Back Task',
      shortName: 'N-Back',
      description: 'Evaluate working memory capacity',
      icon: '📊',
      color: '#f093fb',
      route: '/tasks/nback',
      duration: '~5 min'
    },
    {
      id: 'flanker',
      name: 'Flanker Task',
      shortName: 'Flanker',
      description: 'Test selective attention and distraction resistance',
      icon: '➜',
      color: '#4facfe',
      route: '/tasks/flanker',
      duration: '~4 min'
    },
    {
      id: 'trail',
      name: 'Trail-Making Task',
      shortName: 'Trail-Making',
      description: 'Measure processing speed and sequencing',
      icon: '🔗',
      color: '#43e97b',
      route: '/tasks/trail',
      duration: '~3 min'
    }
  ];

  const displayName = userProfile?.name || currentUser?.displayName || 'User';

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="branding">
            <h1>🧠 ADHD Assessment Suite</h1>
            <p>Comprehensive Cognitive Assessment Platform</p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary">
            Log Out
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-text">
            <h2>Welcome back, {displayName}! 👋</h2>
            <p>Ready to take cognitive assessment tasks? Select a task below to begin.</p>
          </div>
          <button 
            onClick={() => navigate('/profile')} 
            className="btn btn-outline-small"
          >
            ⚙️ Edit Profile
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

        {/* Main Content Tabs */}
        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              📋 Assessment Tasks
            </button>
            <button
              className={`tab ${activeTab === 'results' ? 'active' : ''}`}
              onClick={() => setActiveTab('results')}
            >
              📈 Your Results
            </button>
          </div>

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div className="tab-content">
              <div className="tasks-header">
                <h3>Available Cognitive Tasks</h3>
                <p>Complete all 5 tasks for a comprehensive assessment. Total time: ~20 minutes</p>
              </div>
              
              <div className="tasks-grid">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className="task-card"
                    style={{ '--task-color': task.color }}
                  >
                    <div className="task-header">
                      <div className="task-icon">{task.icon}</div>
                      <div className="task-duration">{task.duration}</div>
                    </div>
                    
                    <h3>{task.name}</h3>
                    <p className="task-description">{task.description}</p>
                    
                    <div className="task-actions">
                      <button
                        className="btn btn-outline-small task-info-btn"
                        onClick={() => handleTaskInfo(task)}
                        title="Learn more about this task"
                      >
                        ℹ️ Info
                      </button>
                      <button
                        className="btn btn-primary task-btn"
                        onClick={() => navigate(task.route)}
                      >
                        Start Task
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && (
            <div className="tab-content">
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <h3>No Results Yet</h3>
                <p>Complete a task to see your results here</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setActiveTab('tasks')}
                  style={{ marginTop: '20px' }}
                >
                  Go to Tasks
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="dashboard-footer">
          <p>✨ All data is securely stored and private to your account</p>
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

export default Dashboard;
