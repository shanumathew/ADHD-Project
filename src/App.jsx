import React, { useState, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import TesterProfile from './components/TesterProfile';
import Dashboard from './components/Dashboard';
import CPTTask from './components/CPTTask';
import GoNoGoTask from './components/GoNoGoTask';
import NBackTask from './components/NBackTask';
import FlankerTask from './components/FlankerTask';
import TrailMakingTask from './components/TrailMakingTask';
import LandingPage from './components/LandingPage';
import FeaturesPage from './components/FeaturesPage';
import TasksPage from './components/TasksPage';
import WhyUsPage from './components/WhyUsPage';
import BenefitsPage from './components/BenefitsPage';
import DSM5Questionnaire from './components/DSM5Questionnaire';
import AssessmentPage from './components/AssessmentPage';
import PreTaskQuestionnaire from './components/PreTaskQuestionnaire';
import LoadingScreen from './components/LoadingScreen';
import './styles/tasks.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Authenticating" />;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Task Wrapper with navigation and pre-task questionnaire
const TaskWrapper = ({ children, taskName }) => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(true);
  const [taskStarted, setTaskStarted] = useState(false);
  const [preTaskResponses, setPreTaskResponses] = useState(null);

  const handlePreTaskSubmit = (responses) => {
    setPreTaskResponses(responses);
    setShowQuestionnaire(false);
    // Store responses in sessionStorage for later use with task results
    sessionStorage.setItem(`preTaskResponses_${taskName}`, JSON.stringify(responses));
  };

  const handleQuestionnaireClose = () => {
    // Navigate back to assessment page if user cancels
    window.location.href = '/assessment';
  };

  return (
    <div className="task-wrapper">
      <PreTaskQuestionnaire
        isOpen={showQuestionnaire}
        onClose={handleQuestionnaireClose}
        onSubmit={handlePreTaskSubmit}
        taskName={taskName}
      />
      {!showQuestionnaire && (
        <>
          <nav className="task-nav">
            <div className="task-nav-left">
              <a href="/assessment" className="task-back-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
              </a>
              <span className="task-nav-title">{taskName}</span>
            </div>
            <div className="task-nav-right">
              <div className={`task-nav-indicator ${taskStarted ? 'active' : ''}`}>
                <span className="status-dot"></span>
                {taskStarted ? 'In Progress' : 'Ready'}
              </div>
            </div>
          </nav>
          {React.cloneElement(children, { onTaskStart: () => setTaskStarted(true), onTaskEnd: () => setTaskStarted(false) })}
        </>
      )}
    </div>
  );
};

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/why-us" element={<WhyUsPage />} />
      <Route path="/benefits" element={<BenefitsPage />} />
      <Route
        path="/questionnaire"
        element={
          <ProtectedRoute>
            <DSM5Questionnaire />
          </ProtectedRoute>
        }
      />

      <Route
        path="/assessment"
        element={
          <ProtectedRoute>
            <AssessmentPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/login"
        element={<Login />}
      />
      
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <TesterProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Task Routes */}
      <Route
        path="/tasks/cpt"
        element={
          <ProtectedRoute>
            <TaskWrapper taskName="Continuous Performance Task">
              <CPTTask />
            </TaskWrapper>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/gonogo"
        element={
          <ProtectedRoute>
            <TaskWrapper taskName="Go/No-Go Task">
              <GoNoGoTask />
            </TaskWrapper>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/nback"
        element={
          <ProtectedRoute>
            <TaskWrapper taskName="N-Back Task">
              <NBackTask />
            </TaskWrapper>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/flanker"
        element={
          <ProtectedRoute>
            <TaskWrapper taskName="Flanker Task">
              <FlankerTask />
            </TaskWrapper>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/trail"
        element={
          <ProtectedRoute>
            <TaskWrapper taskName="Trail Making Task">
              <TrailMakingTask />
            </TaskWrapper>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingScreen message="Loading" />}>
          <AppContent />
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
