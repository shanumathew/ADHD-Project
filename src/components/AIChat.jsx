import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/aichat.css';

export default function AIChat() {
  const { currentUser, userProfile, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${userProfile?.displayName || 'there'}! I'm here to help you understand your assessment results. Tell me about any tasks you've completed, and I'll provide personalized insights about your performance.`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    // Simulate a response delay
    setTimeout(() => {
      const responses = [
        "Based on your input, I can see you're making good progress with your assessments. Keep up the great work!",
        "That's interesting feedback. Cognitive assessments like these help identify patterns in attention and focus.",
        "Thank you for sharing. Your results will help build a comprehensive picture of your cognitive profile.",
        "I understand. These tasks are designed to measure different aspects of attention and executive function.",
        "Great question! The assessment suite measures sustained attention, working memory, and impulse control across multiple tasks."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [...prev, { role: 'assistant', content: randomResponse }]);
      setLoading(false);
    }, 1000);
  };

  if (!currentUser || authLoading) {
    return <div className="aichat-container">Please log in to use AI Chat</div>;
  }

  return (
    <div className="aichat-container">
      <div className="aichat-header">
        <h2>AI Assessment Assistant</h2>
      </div>

      <div className="aichat-messages">
        {messages.length === 0 && (
          <div className="empty-state">
            <p>Hello {userProfile?.displayName || currentUser?.email}!</p>
            <p>I'm your ADHD assessment assistant. Ask me about your task results or get personalized insights.</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-badge">{msg.role === 'user' ? 'You' : 'AI'}</div>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {loading && <div className="message assistant loading"><div className="message-content">Generating response...</div></div>}
        <div ref={chatEndRef} />
      </div>

      <form className="aichat-input" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your assessment results..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

