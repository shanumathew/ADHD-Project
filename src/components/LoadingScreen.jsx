import React from 'react';
import '../styles/loading.css';

const LoadingScreen = ({ message = 'Loading', variant = 'default' }) => {
  return (
    <div className={`loading-screen ${variant}`}>
      <div className="loading-content">
        {/* Brain-inspired animated loader */}
        <div className="brain-loader">
          <div className="neuron-ring ring-1">
            <div className="neuron"></div>
            <div className="neuron"></div>
            <div className="neuron"></div>
            <div className="neuron"></div>
          </div>
          <div className="neuron-ring ring-2">
            <div className="neuron"></div>
            <div className="neuron"></div>
            <div className="neuron"></div>
            <div className="neuron"></div>
          </div>
          <div className="core-pulse"></div>
        </div>
        
        <div className="loading-text">
          <span className="loading-message">{message}</span>
          <span className="loading-dots">
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
