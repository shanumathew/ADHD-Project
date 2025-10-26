import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/aichat.css';

const AIChat = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your ADHD Assessment Assistant. I can help you understand the cognitive tasks, provide tips for better focus, analyze your test results, or discuss assessment results. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userResults, setUserResults] = useState(null);
  const messagesEndRef = useRef(null);
  const modelRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch user's results from Firestore
  const fetchUserResults = async () => {
    try {
      const fb = await import('../firebase');
      const fs = await import('firebase/firestore');
      const db = fb.db;
      const auth = fb.auth;
      const uid = auth?.currentUser?.uid || currentUser?.uid;

      if (!uid) {
        console.log('No user ID for fetching results');
        return;
      }

      const q = fs.query(
        fs.collection(db, 'results'),
        fs.where('userId', '==', uid),
        fs.orderBy('recordedAt', 'desc')
      );
      
      const snap = await fs.getDocs(q);
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      setUserResults(docs);
      console.log('✅ Fetched user results:', docs.length, 'documents');
    } catch (err) {
      console.error('Error fetching user results:', err);
    }
  };

  // Initialize on component mount and fetch results
  useEffect(() => {
    initializeModel();
    fetchUserResults();
  }, [currentUser]);

  // Initialize the Google Generative AI model
  const initializeModel = async () => {
    try {
      if (modelRef.current) return; // Already initialized

      const API_KEY = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_KEY;
      
      if (!API_KEY) {
        throw new Error('API key not configured. Please check your .env.local file.');
      }

      modelRef.current = true; // Just flag that we've checked
      console.log('✅ AI Model initialized successfully');
    } catch (err) {
      console.error('❌ Error initializing AI model:', err);
      setError('Failed to initialize AI. Please refresh the page.');
    }
  };

  // Format results for analysis
  const formatResultsForAnalysis = () => {
    if (!userResults || userResults.length === 0) {
      return 'No test results available yet.';
    }

    let summary = 'User Test Results Summary:\n\n';
    userResults.forEach((result, index) => {
      summary += `Test ${index + 1}: ${result.taskName}\n`;
      summary += `Date: ${new Date(result.recordedAt?.toDate?.() || result.recordedAt).toLocaleDateString()}\n`;
      
      if (result.results) {
        const resultsObj = result.results;
        summary += `Results: ${JSON.stringify(resultsObj, null, 2)}\n`;
      }
      summary += '\n';
    });

    return summary;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    const userInput = input;
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const API_KEY = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_KEY;
      
      if (!API_KEY) {
        throw new Error('API key not configured. Please check your .env.local file.');
      }

      // Build comprehensive system prompt with user's test results
      const resultsContext = formatResultsForAnalysis();
      
      const systemPrompt = `You are an AI behavioral analyst and ADHD-informed coach. You help users interpret their cognitive and attention-based test results in a detailed, emotionally intelligent, and practical way. 

You are NOT a therapist or psychologist — your tone is friendly, reflective, and growth-oriented, like a mentor who understands neurodiversity and ADHD.

WHEN ANALYZING TEST RESULTS, STRUCTURE YOUR RESPONSE WITH THESE SECTIONS:

1. **Summary of Results:** Briefly explain what the test measures and what the user's results indicate overall.

2. **Interpretation & Insights:** 
   - What do the numbers or patterns say about the user's cognitive style, strengths, and possible struggles?
   - Explain the results as *behavioral patterns*, not clinical diagnoses.
   - Highlight ADHD-like traits if relevant (e.g., impulsivity, task-switching, hyperfocus, boredom sensitivity).

3. **Strengths Identified:** 
   - Point out what the user seems naturally good at.
   - Use encouraging but realistic language (e.g., "You seem to thrive when…").

4. **Potential Challenges:** 
   - Gently highlight areas where the user might struggle or feel friction.
   - Focus on *why* those patterns happen (e.g., dopamine-seeking, interest-based nervous system).

5. **Behavioral Insight:** 
   - Connect patterns together.
   - Offer "this might mean that…" type insights that feel deep and personal.

6. **Growth Suggestions:** 
   - Suggest practical steps, routines, or habits that can help improve focus, impulse control, or consistency.
   - Include ADHD-friendly strategies (like body-doubling, external reminders, breaking tasks into micro-goals).

7. **Reflection Questions:** 
   - Add 2–3 reflective prompts for the user to think about.
   - Example: "When do you notice yourself hyperfocusing naturally?" or "Which kind of tasks make you lose track of time?"

TONE GUIDELINES:
- Empathetic but honest.
- Conversational but not overly casual.
- Insightful but grounded in behavior and cognition, not clinical terms.
- Avoid medical labels or diagnostic phrasing.

FOR GENERAL QUESTIONS (non-result analysis), provide friendly, practical advice in 2-3 sentences while maintaining this ADHD-informed perspective.

TEST INFORMATION:
- CPT (Continuous Performance Task): Measures sustained attention, visual discrimination, and impulse control
- Go/No-Go Task: Assesses response inhibition, impulsivity, and behavioral control
- N-Back Task: Evaluates working memory and cognitive flexibility
- Flanker Task: Tests selective attention and conflict resolution under distractions
- Trail-Making Task: Measures processing speed, visual scanning, and task-switching ability

USER'S TEST RESULTS:
${resultsContext}

User's Current Question: ${userInput}`;

      // Use REST API directly with the API key
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: systemPrompt
                  }
                ]
              }
            ],
            generationConfig: {
              maxOutputTokens: 500,
              temperature: 0.7,
              topP: 0.95,
              topK: 40,
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        
        if (response.status === 404) {
          console.log('Trying fallback model...');
          throw new Error('Model not available. Please check your API credentials in Google AI Studio.');
        }
        
        throw new Error(`API Error: ${response.status} - ${errorData?.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response. Please try again.';

      const aiMessage = {
        id: messages.length + 2,
        text: responseText,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      console.log('✅ AI response received');
    } catch (err) {
      console.error('❌ Error sending message:', err);
      
      let errorText = 'I apologize, but I encountered an error. ';
      
      if (err.message?.includes('API key')) {
        errorText += 'Please verify your API key is correct in .env.local';
      } else if (err.message?.includes('Model not available')) {
        errorText += 'The AI model is not available with your current API key. Please ensure you have the Generative Language API enabled in Google Cloud.';
      } else if (err.message?.includes('rate')) {
        errorText += 'Too many requests. Please wait a moment and try again.';
      } else {
        errorText += 'Please try again.';
      }
      
      setError(err.message || 'Failed to get response');

      const errorMessage = {
        id: messages.length + 2,
        text: errorText,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hi! I'm your ADHD Assessment Assistant. I can help you understand the cognitive tasks, provide tips for better focus, analyze your test results, or discuss assessment results. How can I help you today?",
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
    setError(null);
  };

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <h3>🤖 ADHD Assistant</h3>
        <button 
          className="clear-btn" 
          onClick={clearChat}
          title="Clear conversation"
        >
          ↻
        </button>
      </div>

      <div className="ai-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message message-${msg.sender}`}>
            <div className="message-content">
              {msg.sender === 'ai' && <span className="ai-badge">🤖</span>}
              {msg.sender === 'user' && <span className="user-badge">👤</span>}
              <div className="message-text">{msg.text}</div>
            </div>
            <div className="message-time">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message message-ai">
            <div className="message-content">
              <span className="ai-badge">🤖</span>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={sendMessage} className="ai-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about your results, tasks, or tips..."
          disabled={loading}
          className="ai-input"
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          className="ai-send-btn"
        >
          {loading ? '...' : '➤'}
        </button>
      </form>
    </div>
  );
};

export default AIChat;

