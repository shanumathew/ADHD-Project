import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import '../styles/results.css';
import '../styles/loading.css';

const ResultsPanel = () => {
  const { currentUser } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isFromLocalStorage, setIsFromLocalStorage] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const [activeSection, setActiveSection] = useState('all');

  const fetchResults = async () => {
    setLoading(true);
    try {
      const fb = await import('../firebase');
      const fs = await import('firebase/firestore');
      const db = fb.db;
      const auth = fb.auth;
      const uid = auth?.currentUser?.uid || currentUser?.uid;

      console.log('Fetching results for user:', uid);

      if (!uid) {
        console.log('No user ID found, falling back to localStorage');
        loadFromLocalStorage();
        return;
      }

      const q = fs.query(fs.collection(db, 'results'), fs.where('userId', '==', uid), fs.orderBy('recordedAt', 'desc'));
      const snap = await fs.getDocs(q);
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      console.log('Fetched results from Firestore:', docs.length, 'documents');
      
      if (docs.length > 0) {
        setResults(docs);
        setIsFromLocalStorage(false);
      } else {
        // If no Firestore results, try localStorage
        loadFromLocalStorage();
      }
    } catch (err) {
      console.error('Error fetching from Firestore:', err);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const local = JSON.parse(localStorage.getItem('adhd_assessment_results') || '[]');
      console.log('Found in localStorage:', local.length, 'results');
      setResults([...local].reverse());
      setIsFromLocalStorage(true);
    } catch (e) {
      console.error('Error with localStorage:', e);
      setResults([]);
      setIsFromLocalStorage(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, [currentUser, refreshTrigger]);

  // Listen for storage changes (other tasks completing)
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('Storage changed, refreshing results...');
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom event from logResults
    window.addEventListener('resultsUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('resultsUpdated', handleStorageChange);
    };
  }, []);

  const toggleCardExpand = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Categorize results
  const categorizedResults = {
    dsm5: results.filter(r => r.taskType === 'dsm5_questionnaire'),
    cognitive: results.filter(r => r.taskType === 'cognitive_task' || !r.taskType)
  };

  const getFilteredResults = () => {
    if (activeSection === 'dsm5') return categorizedResults.dsm5;
    if (activeSection === 'cognitive') return categorizedResults.cognitive;
    return results;
  };

  const deleteResult = async (resultId, displayIndex) => {
    if (!window.confirm('Are you sure you want to delete this result? This action cannot be undone.')) {
      return;
    }

    console.log('Deleting result:', { resultId, displayIndex, isFromLocalStorage });

    try {
      if (isFromLocalStorage) {
        // Delete from localStorage - displayIndex is the index in the displayed (reversed) list
        // So we need to convert it back to the original array index
        const local = JSON.parse(localStorage.getItem('adhd_assessment_results') || '[]');
        const originalIndex = local.length - 1 - displayIndex;
        console.log('Deleting localStorage item at original index:', originalIndex);
        
        local.splice(originalIndex, 1);
        localStorage.setItem('adhd_assessment_results', JSON.stringify(local));
        
        // Update state
        const newResults = [...results];
        newResults.splice(displayIndex, 1);
        setResults(newResults);
        
        alert('Result deleted successfully');
      } else if (resultId) {
        // Try to delete from Firestore
        try {
          const fb = await import('../firebase');
          const { deleteDoc, doc } = await import('firebase/firestore');
          const db = fb.db;

          console.log('Deleting from Firestore:', resultId);
          await deleteDoc(doc(db, 'results', resultId));
          
          // Remove from local state
          setResults(prev => prev.filter(r => r.id !== resultId));
          alert('Result deleted successfully');
        } catch (firestoreErr) {
          console.error('Firestore delete failed:', firestoreErr);
          
          // If permission denied, offer to remove from view
          if (firestoreErr.code === 'permission-denied') {
            if (window.confirm('Unable to delete from cloud (permission denied). Would you like to hide this result from your view? (It may reappear after refresh)')) {
              setResults(prev => prev.filter(r => r.id !== resultId));
            }
          } else {
            throw firestoreErr;
          }
        }
      } else {
        // No ID - just remove from display
        const newResults = [...results];
        newResults.splice(displayIndex, 1);
        setResults(newResults);
        alert('Result removed from view');
      }
    } catch (err) {
      console.error('Failed to delete result:', err);
      alert('Failed to delete result: ' + err.message);
    }
  };

  const deleteAllResults = async () => {
    if (!window.confirm('Are you sure you want to DELETE ALL RESULTS? This action cannot be undone and all your test data will be lost.')) {
      return;
    }

    if (!window.confirm('This is your final confirmation. Delete all results?')) {
      return;
    }

    try {
      // Clear localStorage first
      localStorage.removeItem('adhd_assessment_results');
      
      // Then try to clear Firestore
      const fb = await import('../firebase');
      const { collection, query, where, getDocs, deleteDoc } = await import('firebase/firestore');
      const db = fb.db;
      const auth = fb.auth;
      const uid = auth?.currentUser?.uid;

      let deletedCount = 0;

      if (uid) {
        // Delete all results for this user from Firestore
        const q = query(collection(db, 'results'), where('userId', '==', uid));
        const snap = await getDocs(q);
        
        const deletePromises = snap.docs.map(docSnap => deleteDoc(docSnap.ref));
        await Promise.all(deletePromises);
        deletedCount = snap.docs.length;
      }

      setResults([]);
      alert(`Deleted all results successfully${deletedCount > 0 ? ` (${deletedCount} from cloud)` : ''}`);
    } catch (err) {
      console.error('Failed to delete all results:', err);
      // Still clear localStorage even if Firestore fails
      localStorage.removeItem('adhd_assessment_results');
      setResults([]);
      alert('Cleared local results. Cloud deletion may have failed.');
    }
  };

  const downloadPDF = () => {
    if (!results || results.length === 0) {
      alert('No results to include in the report');
      return;
    }

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 40;
    let y = 60;

    doc.setFontSize(16);
    doc.text('ADHD Assessment Report', margin, y);
    doc.setFontSize(11);
    y += 24;
    doc.text(`User: ${currentUser?.email || 'Unknown'}`, margin, y);
    y += 18;
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
    y += 24;

    // Add DSM-5 Results Section
    if (categorizedResults.dsm5.length > 0) {
      doc.setFontSize(14);
      doc.text('DSM-5 ADHD Assessment Results', margin, y);
      y += 20;
      doc.setFontSize(10);

      categorizedResults.dsm5.forEach((r, idx) => {
        if (y > 720) { doc.addPage(); y = 60; }
        const content = JSON.stringify(r.results || r, null, 2);
        const lines = doc.splitTextToSize(content, 520);
        doc.text(lines, margin, y);
        y += (lines.length + 1) * 12;
        y += 16;
      });
    }

    // Add Cognitive Task Results Section
    if (categorizedResults.cognitive.length > 0) {
      if (y > 600) { doc.addPage(); y = 60; }
      doc.setFontSize(14);
      doc.text('Cognitive Task Results', margin, y);
      y += 20;

      categorizedResults.cognitive.forEach((r, idx) => {
        if (y > 720) { doc.addPage(); y = 60; }
        doc.setFontSize(12);
        doc.text(`${idx + 1}. ${r.taskName || r.task || 'Task'}`, margin, y);
        y += 16;
        doc.setFontSize(10);
        
        // Add pre-task context if available
        if (r.preTaskContext) {
          doc.text('Pre-Task Context:', margin, y);
          y += 12;
          const preTaskContent = JSON.stringify(r.preTaskContext, null, 2);
          const preTaskLines = doc.splitTextToSize(preTaskContent, 500);
          doc.text(preTaskLines, margin + 10, y);
          y += (preTaskLines.length + 1) * 10;
        }
        
        doc.text('Results:', margin, y);
        y += 12;
        const content = JSON.stringify(r.results || r, null, 2);
        const lines = doc.splitTextToSize(content, 500);
        doc.text(lines, margin + 10, y);
        y += (lines.length + 1) * 10;
        y += 16;
      });
    }

    doc.save(`adhd_report_${Date.now()}.pdf`);
  };

  const formatDate = (r) => {
    if (r.recordedAt?.seconds) {
      return new Date(r.recordedAt.seconds * 1000).toLocaleString();
    }
    return r.timestamp || r.recordedAt || 'Unknown date';
  };

  const renderDSM5ResultCard = (r, idx) => {
    const cardId = r.id || `dsm5-${idx}`;
    const isExpanded = expandedCards[cardId];
    
    return (
      <div key={cardId} className="result-card dsm5-card">
        <div className="result-card-header" onClick={() => toggleCardExpand(cardId)}>
          <div className="result-card-info">
            <div className="result-card-icon dsm5-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <div className="result-card-title">
              <strong>DSM-5 ADHD Assessment</strong>
              <span className="result-time">{formatDate(r)}</span>
            </div>
          </div>
          <div className="result-card-actions">
            <span className={`result-badge ${r.results?.riskLevel || 'low'}`}>
              {r.results?.riskLevel === 'high' ? 'High Risk' : 
               r.results?.riskLevel === 'moderate' ? 'Moderate' : 'Low Risk'}
            </span>
            <button 
              className="btn-expand"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
            </button>
            <button 
              className="btn-delete-small" 
              onClick={(e) => { e.stopPropagation(); deleteResult(r.id, idx); }}
              title="Delete this result"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="result-card-content">
            <div className="dsm5-summary">
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Inattention Symptoms</span>
                  <span className="summary-value">{r.results?.inattentionCount || 0}/9</span>
                  <div className="mini-progress">
                    <div className="mini-progress-fill" style={{ width: `${((r.results?.inattentionCount || 0) / 9) * 100}%` }}></div>
                  </div>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Hyperactivity Symptoms</span>
                  <span className="summary-value">{r.results?.hyperactivityCount || 0}/9</span>
                  <div className="mini-progress">
                    <div className="mini-progress-fill" style={{ width: `${((r.results?.hyperactivityCount || 0) / 9) * 100}%` }}></div>
                  </div>
                </div>
                <div className="summary-item full-width">
                  <span className="summary-label">Total Score</span>
                  <span className="summary-value">{r.results?.totalScore || 0}/{r.results?.maxScore || 72}</span>
                  <div className="mini-progress">
                    <div className="mini-progress-fill" style={{ width: `${((r.results?.totalScore || 0) / (r.results?.maxScore || 72)) * 100}%` }}></div>
                  </div>
                </div>
              </div>
              
              <div className="presentation-info">
                <span className="presentation-label">Indicated Presentation:</span>
                <span className={`presentation-value ${r.results?.riskLevel}`}>{r.results?.presentation || 'N/A'}</span>
              </div>
              
              {r.results?.additionalNotes && (
                <div className="additional-notes">
                  <span className="notes-label">Additional Notes:</span>
                  <p className="notes-content">{r.results.additionalNotes}</p>
                </div>
              )}

              {/* Detailed Responses Section */}
              {r.results?.detailedResponses && (
                <div className="dsm5-detailed-responses">
                  <h4 className="section-title">Detailed Responses</h4>
                  
                  {/* Inattention Section */}
                  {Object.keys(r.results.detailedResponses).filter(key => key.startsWith('inattention')).length > 0 && (
                    <div className="response-section">
                      <h5 className="response-section-title">Part A: Inattention</h5>
                      <div className="responses-list">
                        {Object.entries(r.results.detailedResponses)
                          .filter(([key]) => key.startsWith('inattention'))
                          .map(([key, data]) => (
                            <div key={key} className="response-item">
                              <div className="response-question">
                                <span className="question-id">{key.replace('_', ' ').replace('inattention', 'Q')}</span>
                                <span className="question-text">{data.questionText}</span>
                              </div>
                              <div className="response-answer">
                                <span className={`response-label response-${data.response}`}>{data.responseLabel}</span>
                                <span className="response-value">({data.response}/3)</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Hyperactivity Section */}
                  {Object.keys(r.results.detailedResponses).filter(key => key.startsWith('hyperactivity')).length > 0 && (
                    <div className="response-section">
                      <h5 className="response-section-title">Part B: Hyperactivity/Impulsivity</h5>
                      <div className="responses-list">
                        {Object.entries(r.results.detailedResponses)
                          .filter(([key]) => key.startsWith('hyperactivity'))
                          .map(([key, data]) => (
                            <div key={key} className="response-item">
                              <div className="response-question">
                                <span className="question-id">{key.replace('_', ' ').replace('hyperactivity', 'Q')}</span>
                                <span className="question-text">{data.questionText}</span>
                              </div>
                              <div className="response-answer">
                                <span className={`response-label response-${data.response}`}>{data.responseLabel}</span>
                                <span className="response-value">({data.response}/3)</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Impairment Section */}
                  {Object.keys(r.results.detailedResponses).filter(key => key.startsWith('impairment')).length > 0 && (
                    <div className="response-section">
                      <h5 className="response-section-title">Part C: Impairment & History</h5>
                      <div className="responses-list">
                        {Object.entries(r.results.detailedResponses)
                          .filter(([key]) => key.startsWith('impairment'))
                          .map(([key, data]) => (
                            <div key={key} className="response-item">
                              <div className="response-question">
                                <span className="question-id">{key.replace('_', ' ').replace('impairment', 'Q')}</span>
                                <span className="question-text">{data.questionText}</span>
                              </div>
                              <div className="response-answer">
                                <span className={`response-label response-${data.response}`}>{data.responseLabel}</span>
                                <span className="response-value">({data.response}/3)</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Raw responses for older data */}
              {!r.results?.detailedResponses && r.results?.responses && (
                <div className="dsm5-raw-responses">
                  <h4 className="section-title">Response Values</h4>
                  <div className="raw-responses-grid">
                    {Object.entries(r.results.responses).map(([key, value]) => (
                      <div key={key} className="raw-response-item">
                        <span className="raw-response-key">{key}</span>
                        <span className="raw-response-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCognitiveResultCard = (r, idx) => {
    const cardId = r.id || `task-${idx}`;
    const isExpanded = expandedCards[cardId];
    const taskName = r.taskName || r.task || 'Cognitive Task';
    
    // Get task-specific icon
    const getTaskIcon = () => {
      const name = taskName.toLowerCase();
      if (name.includes('cpt') || name.includes('continuous')) {
        return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>;
      }
      if (name.includes('go') || name.includes('nogo')) {
        return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>;
      }
      if (name.includes('n-back') || name.includes('nback')) {
        return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>;
      }
      if (name.includes('flanker')) {
        return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>;
      }
      if (name.includes('trail')) {
        return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M22 18V3H2v15H0v2h24v-2h-2zm-8 0h-4v-1h4v1zm6-3H4V5h16v10z"/></svg>;
      }
      return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"/></svg>;
    };
    
    // Get primary metric for badge
    const getPrimaryMetric = () => {
      const res = r.results || {};
      if (res.accuracy !== undefined) return `${res.accuracy}%`;
      if (res.overallAccuracy !== undefined) return `${res.overallAccuracy}%`;
      if (res.goAccuracy !== undefined) return `${res.goAccuracy}%`;
      if (res.completionTimeSeconds !== undefined) return `${res.completionTimeSeconds}s`;
      return null;
    };

    const primaryMetric = getPrimaryMetric();
    
    return (
      <div key={cardId} className="result-card cognitive-card">
        <div className="result-card-header" onClick={() => toggleCardExpand(cardId)}>
          <div className="result-card-info">
            <div className="result-card-icon cognitive-icon">
              {getTaskIcon()}
            </div>
            <div className="result-card-title">
              <strong>{taskName}</strong>
              <span className="result-time">{formatDate(r)}</span>
            </div>
          </div>
          <div className="result-card-actions">
            {primaryMetric && (
              <span className="result-metric-badge">
                {primaryMetric}
              </span>
            )}
            <button 
              className="btn-expand"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
            </button>
            <button 
              className="btn-delete-small" 
              onClick={(e) => { e.stopPropagation(); deleteResult(r.id, idx); }}
              title="Delete this result"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="result-card-content">
            {/* Task Configuration Section */}
            {r.taskConfig && (
              <div className="config-section">
                <div className="section-header">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                  </svg>
                  <span>Task Configuration</span>
                </div>
                <div className="config-grid">
                  {Object.entries(r.taskConfig).filter(([key]) => key !== 'completedAt' && key !== 'taskName').map(([key, value]) => (
                    <div key={key} className="config-item">
                      <span className="config-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                      <span className="config-value">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pre-Task Context Section */}
            {r.preTaskContext && (
              <div className="pretask-context-section">
                <div className="section-header">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                  <span>Pre-Task Questionnaire</span>
                </div>
                <div className="pretask-grid">
                  {r.preTaskContext.hoursOfSleep && (
                    <div className="pretask-item">
                      <span className="pretask-label">Hours of Sleep</span>
                      <span className="pretask-value">{r.preTaskContext.hoursOfSleep}</span>
                    </div>
                  )}
                  {r.preTaskContext.stressLevel !== undefined && (
                    <div className="pretask-item">
                      <span className="pretask-label">Stress Level</span>
                      <span className="pretask-value">{r.preTaskContext.stressLevel}/10</span>
                    </div>
                  )}
                  {r.preTaskContext.focusLevel !== undefined && (
                    <div className="pretask-item">
                      <span className="pretask-label">Focus Level</span>
                      <span className="pretask-value">{r.preTaskContext.focusLevel}/10</span>
                    </div>
                  )}
                  {r.preTaskContext.hadCaffeine !== undefined && (
                    <div className="pretask-item">
                      <span className="pretask-label">Had Caffeine (2hrs)</span>
                      <span className="pretask-value">{r.preTaskContext.hadCaffeine ? 'Yes' : 'No'}</span>
                    </div>
                  )}
                  {r.preTaskContext.environmentNoise && (
                    <div className="pretask-item">
                      <span className="pretask-label">Environment Noise</span>
                      <span className="pretask-value" style={{textTransform: 'capitalize'}}>{r.preTaskContext.environmentNoise.replace('-', ' ')}</span>
                    </div>
                  )}
                  {r.preTaskContext.interruptionChance && (
                    <div className="pretask-item">
                      <span className="pretask-label">Interruption Chance</span>
                      <span className="pretask-value" style={{textTransform: 'capitalize'}}>{r.preTaskContext.interruptionChance.replace('-', ' ')}</span>
                    </div>
                  )}
                  {r.preTaskContext.tookMedication === true && (
                    <div className="pretask-item medication">
                      <span className="pretask-label">Took Medication</span>
                      <span className="pretask-value">Yes</span>
                    </div>
                  )}
                  {r.preTaskContext.tookMedication === false && (
                    <div className="pretask-item">
                      <span className="pretask-label">Took Medication</span>
                      <span className="pretask-value">No</span>
                    </div>
                  )}
                  {r.preTaskContext.tookMedication === 'skip' && (
                    <div className="pretask-item">
                      <span className="pretask-label">Took Medication</span>
                      <span className="pretask-value">Prefer not to say</span>
                    </div>
                  )}
                  {r.preTaskContext.medicationName && (
                    <div className="pretask-item medication">
                      <span className="pretask-label">Medication Name</span>
                      <span className="pretask-value">{r.preTaskContext.medicationName}</span>
                    </div>
                  )}
                  {r.preTaskContext.timeSinceMedication && (
                    <div className="pretask-item">
                      <span className="pretask-label">Time Since Medication</span>
                      <span className="pretask-value">{r.preTaskContext.timeSinceMedication}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Task Results Section */}
            <div className="task-results-section">
              <div className="section-header">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
                <span>Task Results</span>
              </div>
              
              <div className="metrics-grid">
                {r.results && Object.entries(r.results)
                  .filter(([key]) => !['reactionTimes', 'reactionTimesMs', 'sequence'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="metric-item">
                      <span className="metric-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                      <span className="metric-value">
                        {typeof value === 'number' 
                          ? (key.toLowerCase().includes('time') && !key.toLowerCase().includes('seconds') 
                              ? `${Math.round(value)}ms` 
                              : key.toLowerCase().includes('accuracy') || key.toLowerCase().includes('percent')
                                ? `${value}%`
                                : value)
                          : String(value)}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Show sequence if available */}
              {r.results?.sequence && (
                <div className="sequence-section">
                  <span className="sequence-label">Stimulus Sequence:</span>
                  <span className="sequence-value">{r.results.sequence}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="results-panel">
      <div className="results-header">
        <h3>Your Test Results</h3>
        <div className="results-actions">
          <button className="btn btn-outline-small" onClick={() => setRefreshTrigger(prev => prev + 1)} title="Refresh results">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style={{ marginRight: 6 }}>
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
            Refresh
          </button>
          <button className="btn btn-primary" onClick={downloadPDF}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style={{ marginRight: 6 }}>
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Download PDF
          </button>
          {results.length > 0 && (
            <button className="btn btn-danger" onClick={deleteAllResults}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style={{ marginRight: 6 }}>
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Section Tabs */}
      {results.length > 0 && (
        <div className="results-tabs">
          <button 
            className={`tab-btn ${activeSection === 'all' ? 'active' : ''}`}
            onClick={() => setActiveSection('all')}
          >
            All Results
            <span className="tab-count">{results.length}</span>
          </button>
          <button 
            className={`tab-btn ${activeSection === 'dsm5' ? 'active' : ''}`}
            onClick={() => setActiveSection('dsm5')}
          >
            DSM-5 Assessment
            <span className="tab-count">{categorizedResults.dsm5.length}</span>
          </button>
          <button 
            className={`tab-btn ${activeSection === 'cognitive' ? 'active' : ''}`}
            onClick={() => setActiveSection('cognitive')}
          >
            Cognitive Tasks
            <span className="tab-count">{categorizedResults.cognitive.length}</span>
          </button>
        </div>
      )}

      {loading ? (
        <div className="results-loading">
          <div className="mini-loader"></div>
          <span className="loading-label">Loading your results</span>
        </div>
      ) : results.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
          <h4>No Results Yet</h4>
          <p>Complete a DSM-5 assessment or cognitive task to see your results here.</p>
        </div>
      ) : (
        <div className="results-list">
          {getFilteredResults().map((r, idx) => 
            r.taskType === 'dsm5_questionnaire' 
              ? renderDSM5ResultCard(r, idx)
              : renderCognitiveResultCard(r, idx)
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;
