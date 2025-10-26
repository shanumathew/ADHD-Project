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
          💬
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
