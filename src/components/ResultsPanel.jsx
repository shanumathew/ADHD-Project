import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import '../styles/results.css';

const ResultsPanel = () => {
  const { currentUser } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const fb = await import('../firebase');
      const fs = await import('firebase/firestore');
      const db = fb.db;
      const auth = fb.auth;
      const uid = auth?.currentUser?.uid || currentUser?.uid;

      console.log('🔍 Fetching results for user:', uid);

      if (!uid) {
        console.log('⚠️ No user ID found');
        setResults([]);
        setLoading(false);
        return;
      }

      const q = fs.query(fs.collection(db, 'results'), fs.where('userId', '==', uid), fs.orderBy('recordedAt', 'desc'));
      const snap = await fs.getDocs(q);
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      console.log('✅ Fetched results from Firestore:', docs.length, 'documents');
      console.log('Results:', docs);
      
      setResults(docs);
    } catch (err) {
      console.error('❌ Error fetching from Firestore:', err);
      console.log('Falling back to localStorage...');
      
      try {
        const local = JSON.parse(localStorage.getItem('adhd_assessment_results') || '[]');
        console.log('✅ Found in localStorage:', local.length, 'results');
        setResults(local.reverse());
      } catch (e) {
        console.error('❌ Error with localStorage fallback:', e);
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [currentUser, refreshTrigger]);

  // Listen for storage changes (other tasks completing)
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('📢 Storage changed, refreshing results...');
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

  const deleteResult = async (resultId) => {
    if (!window.confirm('Are you sure you want to delete this result? This action cannot be undone.')) {
      return;
    }

    try {
      const fb = await import('../firebase');
      const fs = await import('firebase/firestore');
      const db = fb.db;

      await fs.deleteDoc(fs.doc(db, 'results', resultId));
      
      // Remove from local state
      setResults(prev => prev.filter(r => r.id !== resultId));
      alert('Result deleted successfully');
    } catch (err) {
      console.error('Failed to delete result:', err);
      alert('Failed to delete result. Please try again.');
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
      const fb = await import('../firebase');
      const fs = await import('firebase/firestore');
      const db = fb.db;
      const auth = fb.auth;
      const uid = auth?.currentUser?.uid;

      if (!uid) return;

      // Delete all results for this user
      const q = fs.query(fs.collection(db, 'results'), fs.where('userId', '==', uid));
      const snap = await fs.getDocs(q);
      
      const deletePromises = snap.docs.map(doc => fs.deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      setResults([]);
      alert(`Deleted ${snap.docs.length} result(s) successfully`);
    } catch (err) {
      console.error('Failed to delete all results:', err);
      alert('Failed to delete results. Please try again.');
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

    results.forEach((r, idx) => {
      if (y > 720) { doc.addPage(); y = 60; }
      doc.setFontSize(13);
      doc.text(`${idx + 1}. ${r.taskName || r.task || 'Task'}`, margin, y);
      y += 16;
      doc.setFontSize(10);
      const content = JSON.stringify(r.results || r.results || r, null, 2);
      const lines = doc.splitTextToSize(content, 520);
      doc.text(lines, margin, y);
      y += (lines.length + 1) * 12;
      y += 8;
    });

    doc.save(`adhd_report_${Date.now()}.pdf`);
  };

  return (
    <div className="results-panel">
      <div className="results-header">
        <h3>Your Test Results</h3>
        <div className="results-actions">
          <button className="btn btn-outline-small" onClick={() => setRefreshTrigger(prev => prev + 1)} style={{ marginRight: 8 }} title="Refresh results">🔄 Refresh</button>
          <button className="btn btn-primary" onClick={downloadPDF} style={{ marginRight: 8 }}>📥 Download PDF</button>
          {results.length > 0 && (
            <button className="btn btn-danger" onClick={deleteAllResults}>🗑️ Clear All</button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Loading results...</div>
      ) : results.length === 0 ? (
        <div className="empty-state">No results yet. Complete a task to see results here.</div>
      ) : (
        <div className="results-list">
          {results.map((r) => (
            <div key={r.id || JSON.stringify(r)} className="result-card">
              <div className="result-header">
                <div>
                  <strong>{r.taskName || r.task}</strong>
                  <span className="result-time">{r.recordedAt?.seconds ? new Date(r.recordedAt.seconds * 1000).toLocaleString() : (r.timestamp || r.recordedAt || '')}</span>
                </div>
                {r.id && (
                  <button 
                    className="btn-delete-small" 
                    onClick={() => deleteResult(r.id)}
                    title="Delete this result"
                  >
                    ✕
                  </button>
                )}
              </div>
              <pre className="result-body">{JSON.stringify(r.results || r.results || r, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;
