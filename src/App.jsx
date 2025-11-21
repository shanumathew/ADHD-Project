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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Task Wrapper with back button
const TaskWrapper = ({ children }) => {
  return (
    <div className="task-wrapper">
      <a href="/dashboard" className="back-button">← Back to Dashboard</a>
      {children}
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
            <TaskWrapper>
              <CPTTask />
            </TaskWrapper>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/gonogo"
        element={
          <ProtectedRoute>
            <TaskWrapper>
              <GoNoGoTask />
            </TaskWrapper>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/nback"
        element={
          <ProtectedRoute>
            <TaskWrapper>
              <NBackTask />
            </TaskWrapper>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/flanker"
        element={
          <ProtectedRoute>
            <TaskWrapper>
              <FlankerTask />
            </TaskWrapper>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/trail"
        element={
          <ProtectedRoute>
            <TaskWrapper>
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
        <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>Loading...</div>}>
          <AppContent />
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
