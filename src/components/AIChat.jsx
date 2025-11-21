import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/aichat.css';

export default function AIChat() {
  const BACKEND = 'google';  // 'google' or 'ollama'
  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_KEY;
  const OLLAMA_URL = 'http://localhost:11434/api/generate';
  const OLLAMA_MODEL = 'adhd-phi3';
  
  const { currentUser, userProfile, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${userProfile?.displayName || 'there'}! 👋 I'm here to help you understand your assessment results. Tell me about any tasks you've completed, and I'll provide personalized insights about your performance.`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const chatEndRef = useRef(null);

  const SYSTEM_PROMPT = `You are a supportive ADHD assessment specialist. Your role is to:
- Provide personalized feedback on assessment task results
- Identify patterns in attention, executive function, and impulse control
- Recognize strengths and areas for growth
- Suggest practical strategies for symptom management
- Maintain a supportive, non-judgmental tone

Keep responses concise (2-3 paragraphs max). Focus on the user's specific task results and provide actionable insights only.`;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkBackendStatus = async () => {
    try {
      if (BACKEND === 'google') {
        setBackendStatus('ready');
      } else if (BACKEND === 'ollama') {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        try {
          const response = await fetch(OLLAMA_URL.replace('/api/generate', '/api/tags'), {
            method: 'GET',
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          setBackendStatus(response.ok ? 'ready' : 'unavailable');
        } catch (e) {
          clearTimeout(timeoutId);
          setBackendStatus('unavailable');
        }
      }
    } catch (error) {
      setBackendStatus('unavailable');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      if (BACKEND === 'google') {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GOOGLE_API_KEY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ role: 'user', parts: [{ text: userMessage }] }],
            generation_config: {
              temperature: 0.7,
              top_p: 0.95,
              max_output_tokens: 2000,
            },
          }),
        });

        if (!response.ok) throw new Error('Google API request failed');

        const data = await response.json();
        const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
        setMessages((prev) => [...prev, { role: 'assistant', content: assistantMessage }]);
      } else if (BACKEND === 'ollama') {
        const fullPrompt = `${SYSTEM_PROMPT}\n\n---\n\nUser: ${userMessage}\n\nAssistant: `;

        const response = await fetch(OLLAMA_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: OLLAMA_MODEL,
            prompt: fullPrompt,
            stream: false,
            temperature: 0.5,
            num_predict: 256,
            top_p: 0.9,
            top_k: 30,
          }),
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.error || `Ollama request failed with status ${response.status}`);
        }

        const data = await response.json();
        const assistantMessage = (data.response || '').trim();
        
        if (!assistantMessage) {
          throw new Error('No response from model');
        }

        setMessages((prev) => [...prev, { role: 'assistant', content: assistantMessage }]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof TypeError 
        ? (BACKEND === 'ollama' ? 'Cannot connect to Ollama. Make sure to run: ollama serve' : 'Network error')
        : error.message || 'Unknown error occurred';
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ Error: ${errorMessage}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || authLoading) {
    return <div className="aichat-container">Please log in to use AI Chat</div>;
  }

  return (
    <div className="aichat-container">
      <div className="aichat-header">
        <h2>🤖 AI Assessment Assistant</h2>
        <div className="status-indicator" title={`Backend: ${BACKEND} (${backendStatus})`}>
          <span className={`status-dot ${backendStatus}`}></span>
          {BACKEND === 'google' ? '☁️ Google API' : '💻 Local Ollama'}
        </div>
      </div>

      <div className="aichat-messages">
        {messages.length === 0 && (
          <div className="empty-state">
            <p>👋 Hello {userProfile?.displayName || currentUser?.email}!</p>
            <p>I'm your ADHD assessment assistant. Ask me about your task results or get personalized insights.</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-badge">{msg.role === 'user' ? '👤' : '🤖'}</div>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {loading && <div className="message assistant loading">⏳ Generating response...</div>}
        <div ref={chatEndRef} />
      </div>

      <form className="aichat-input" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your assessment results..."
          disabled={loading || backendStatus === 'unavailable'}
        />
        <button type="submit" disabled={loading || !input.trim() || backendStatus === 'unavailable'}>
          Send
        </button>
        {backendStatus === 'unavailable' && (
          <div className="backend-warning">
            {BACKEND === 'ollama' 
              ? '⚠️ Ollama not running. Start with: ollama serve' 
              : '⚠️ API unavailable'}
          </div>
        )}
      </form>
    </div>
  );
}

