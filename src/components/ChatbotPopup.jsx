import React, { useState } from 'react';
import AIChat from './AIChat';
import '../styles/aichat.css';

const ChatbotPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <button
          className="chat-toggle-btn"
          onClick={() => setIsOpen(true)}
          title="Open AI Assistant"
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="ai-chat-popup">
          <div
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 10000
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(0, 0, 0, 0.1)',
                border: 'none',
                color: 'white',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.2)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.1)'}
              title="Close chat"
            >
              ✕
            </button>
          </div>
          <AIChat />
        </div>
      )}
    </>
  );
};

export default ChatbotPopup;
