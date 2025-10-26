import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../styles/aiprofile.css';

const AIProfileGenerator = ({ onClose, isOpen }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const reportRef = useRef(null);

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  const fetchAllResults = async () => {
    try {
      setLoading(true);
      setError(null);

      const resultsRef = collection(db, 'results');
      const q = query(
        resultsRef,
        where('userId', '==', currentUser.uid),
        orderBy('recordedAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const allResults = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Check if user has at least one result
      if (allResults.length === 0) {
        setError('Please complete at least one cognitive task to generate a profile.');
        setLoading(false);
        return;
      }

      // Get latest result from each task
      const latestResults = {};
      allResults.forEach(result => {
        const taskName = result.taskName;
        if (!latestResults[taskName]) {
          latestResults[taskName] = result;
        }
      });

      // Generate cognitive profile (now async)
      const profile = await generateCognitiveProfile(allResults);
      setProfileData(profile);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Failed to fetch your results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateCognitiveProfile = async (results) => {
    // Extract metrics from each task
    const cptResults = results.find(r => r.taskName && r.taskName.includes('CPT'));
    const goNoGoResults = results.find(r => r.taskName && r.taskName.includes('Go/No-Go'));
    const nbackResults = results.find(r => r.taskName && r.taskName.includes('N-Back'));
    const flankerResults = results.find(r => r.taskName && r.taskName.includes('Flanker'));
    const trailResults = results.find(r => r.taskName && r.taskName.includes('Trail'));

    // Calculate composite metrics
    const focusScore = calculateFocusScore(cptResults, nbackResults, trailResults);
    const impulsivityScore = calculateImpulsivityScore(cptResults, goNoGoResults, flankerResults);
    const workingMemoryScore = calculateWorkingMemoryScore(nbackResults, flankerResults);
    const responseVariability = calculateResponseVariability(cptResults, goNoGoResults);

    // Generate AI insights using comprehensive prompt
    const aiInsights = await generateAIInsights({
      cpt: cptResults,
      goNoGo: goNoGoResults,
      nback: nbackResults,
      flanker: flankerResults,
      trail: trailResults
    }, {
      focusScore,
      impulsivityScore,
      workingMemoryScore,
      responseVariability
    });

    // Generate profile insights
    const insights = generateInsights(focusScore, impulsivityScore, workingMemoryScore, responseVariability, {
      cpt: cptResults,
      goNoGo: goNoGoResults,
      nback: nbackResults,
      flanker: flankerResults,
      trail: trailResults
    }, aiInsights);

    return {
      focusScore,
      impulsivityScore,
      workingMemoryScore,
      responseVariability,
      insights,
      aiInsights,
      profileName: aiInsights.profileName || insights.profileName,
      rawResults: {
        cpt: cptResults,
        goNoGo: goNoGoResults,
        nback: nbackResults,
        flanker: flankerResults,
        trail: trailResults
      },
      timestamp: new Date()
    };
  };

  const generateAIInsights = async (results, scores) => {
    try {
      const systemPrompt = `You are an expert behavioral analyst specializing in cognitive assessment and ADHD patterns. Analyze this cognitive test data and generate a comprehensive personal profile. Some tasks may not be present - analyze whatever data is available.

IMPORTANT: Generate ONLY a valid JSON object with these exact fields (no markdown, no extra text):
{
  "profileName": "A creative 2-3 word personalized profile name",
  "overallSummary": "1-2 sentence summary of their current cognitive profile based on available data",
  "focusPattern": "Analysis of sustained attention based on available tasks",
  "impulsivityLevel": "Assessment of response control based on available data",
  "workingMemory": "Evaluation of working memory capacity based on available tasks",
  "processingStyle": "How they process information under pressure",
  "strengths": ["strength1", "strength2", "strength3"],
  "challenges": ["challenge1", "challenge2", "challenge3"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "cognitiveStyle": "A paragraph describing their unique cognitive style"
}

Use warm, encouraging, ADHD-informed language. Avoid clinical terms. Focus on behavioral patterns and growth potential. Acknowledge if limited data is available.`;

      // Build result summary, only including tasks that were completed
      const completedTasks = [];
      if (results.cpt) completedTasks.push(`CPT: Accuracy: ${results.cpt?.accuracy || 'N/A'}%, Avg RT: ${results.cpt?.avgReactionTimeMs || 'N/A'}ms, False Alarms: ${results.cpt?.falseAlarms || 'N/A'}`);
      if (results.goNoGo) completedTasks.push(`Go/No-Go: Go Acc: ${results.goNoGo?.goAccuracy || 'N/A'}%, No-Go Acc: ${results.goNoGo?.nogoAccuracy || 'N/A'}%, Commission Errors: ${results.goNoGo?.commissionErrors || 'N/A'}`);
      if (results.nback) completedTasks.push(`N-Back: Accuracy: ${results.nback?.accuracy || 'N/A'}%, Avg RT: ${results.nback?.averageReactionTime || 'N/A'}ms`);
      if (results.flanker) completedTasks.push(`Flanker: Congruent: ${results.flanker?.congruentAccuracy || 'N/A'}%, Incongruent: ${results.flanker?.incongruentAccuracy || 'N/A'}%`);
      if (results.trail) completedTasks.push(`Trail: Time: ${results.trail?.timeMs || 'N/A'}ms, Errors: ${results.trail?.errors || 'N/A'}`);

      const userPrompt = `Analyze this cognitive test data and generate a personalized profile. User has completed ${completedTasks.length} out of 5 available tasks.

Composite Scores (where available): Focus: ${scores.focusScore}%, Impulse Control: ${scores.impulsivityScore}%, Working Memory: ${scores.workingMemoryScore}%, Response Consistency: ${100 - scores.responseVariability}%

Completed Tasks:
${completedTasks.join('\n')}

Generate a comprehensive, personalized cognitive profile based on available data.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GOOGLE_GENERATIVE_AI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: systemPrompt + '\n\n' + userPrompt }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2000
            }
          })
        }
      );

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Extract JSON from AI response
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error('Failed to parse AI JSON:', e);
          return getDefaultAIInsights();
        }
      }

      return getDefaultAIInsights();
    } catch (error) {
      console.error('Error generating AI insights:', error);
      return getDefaultAIInsights();
    }
  };

  const getDefaultAIInsights = () => ({
    profileName: 'Adaptive Processor',
    overallSummary: 'You demonstrate consistent cognitive engagement across diverse tasks with notable strengths in attention and problem-solving.',
    focusPattern: 'Your attention patterns show adaptive responses to varying task demands and complexity levels.',
    impulsivityLevel: 'You balance responsiveness with careful decision-making, showing good impulse control in most situations.',
    workingMemory: 'Your working memory capacity supports multi-step problem solving and information retention.',
    processingStyle: 'You process information efficiently under various conditions, adapting your approach based on task requirements.',
    strengths: ['Adaptive thinking', 'Task engagement', 'Response consistency', 'Problem-solving ability'],
    challenges: ['Managing fatigue over extended tasks', 'Context switching efficiency', 'Maintaining focus during repetitive activities'],
    recommendations: ['Take regular breaks using the Pomodoro technique', 'Use external cues for task management', 'Practice mindfulness during transitions', 'Leverage body-doubling for complex tasks'],
    cognitiveStyle: 'You appear to have a flexible cognitive style that adapts well to changing task requirements. Your strengths lie in your ability to engage with diverse cognitive demands while maintaining reasonable consistency across different types of challenges.'
  });

  const calculateFocusScore = (cpt, nback, trail) => {
    let score = 0;
    let count = 0;

    if (cpt?.results?.accuracy) {
      score += cpt.results.accuracy;
      count++;
    }
    if (nback?.results?.accuracy) {
      score += nback.results.accuracy;
      count++;
    }
    if (trail?.results) {
      // Lower time is better (inverse scoring)
      const timeInSeconds = trail.results.timeInSeconds || 0;
      const timeScore = Math.max(0, 100 - (timeInSeconds / 60) * 10);
      score += timeScore;
      count++;
    }

    return count > 0 ? Math.round(score / count) : 0;
  };

  const calculateImpulsivityScore = (cpt, goNoGo, flanker) => {
    let impulsivityIndicators = 0;
    let totalIndicators = 0;

    // CPT false alarms
    if (cpt?.results?.falseAlarms) {
      impulsivityIndicators += cpt.results.falseAlarms;
      totalIndicators += 40; // Total non-targets in CPT
    }

    // Go/No-Go commission errors
    if (goNoGo?.results?.commissionErrors) {
      impulsivityIndicators += goNoGo.results.commissionErrors;
      totalIndicators += goNoGo.results.nogoTrials || 18;
    }

    // Flanker incongruent errors (harder task = more impulsive mistakes)
    if (flanker?.results?.incongruentCorrect !== undefined && flanker?.results?.incongruentTotal) {
      const incongruentErrors = flanker.results.incongruentTotal - flanker.results.incongruentCorrect;
      impulsivityIndicators += incongruentErrors;
      totalIndicators += flanker.results.incongruentTotal;
    }

    // Calculate impulsivity as percentage of errors
    const impulsivityRate = totalIndicators > 0 ? (impulsivityIndicators / totalIndicators) * 100 : 0;
    return Math.round(100 - impulsivityRate); // Higher score = lower impulsivity
  };

  const calculateWorkingMemoryScore = (nback, flanker) => {
    let score = 0;
    let count = 0;

    if (nback?.results?.accuracy) {
      score += nback.results.accuracy;
      count++;
    }

    if (flanker?.results?.congruentCorrect !== undefined && flanker?.results?.congruentTotal) {
      const congruentAccuracy = (flanker.results.congruentCorrect / flanker.results.congruentTotal) * 100;
      score += congruentAccuracy;
      count++;
    }

    return count > 0 ? Math.round(score / count) : 0;
  };

  const calculateResponseVariability = (cpt, goNoGo) => {
    let variability = 0;
    let count = 0;

    // CPT reaction time variability
    if (cpt?.results?.reactionTimesMs && cpt.results.reactionTimesMs.length > 1) {
      const mean = cpt.results.avgReactionTimeMs;
      const variance = cpt.results.reactionTimesMs.reduce((sum, rt) => sum + Math.pow(rt - mean, 2), 0) / cpt.results.reactionTimesMs.length;
      const stdDev = Math.sqrt(variance);
      variability += stdDev;
      count++;
    }

    // Go/No-Go reaction time variability
    if (goNoGo?.results?.reactionTimes && goNoGo.results.reactionTimes.length > 1) {
      const mean = goNoGo.results.averageReactionTime;
      const variance = goNoGo.results.reactionTimes.reduce((sum, rt) => sum + Math.pow(rt - mean, 2), 0) / goNoGo.results.reactionTimes.length;
      const stdDev = Math.sqrt(variance);
      variability += stdDev;
      count++;
    }

    return count > 0 ? Math.round(variability / count) : 0;
  };

  const generateInsights = (focusScore, impulsivityScore, workingMemoryScore, responseVariability, results, aiInsights = {}) => {
    const traits = [];
    const strengths = aiInsights.strengths || [];
    const challenges = aiInsights.challenges || [];

    // Focus analysis
    if (focusScore >= 80) {
      traits.push('Highly Focused');
    } else if (focusScore >= 60) {
      traits.push('Moderately Focused');
    } else {
      traits.push('Variable Focus');
    }

    // Impulsivity analysis
    if (impulsivityScore >= 80) {
      traits.push('Reflective');
    } else if (impulsivityScore >= 60) {
      traits.push('Balanced Reactor');
    } else {
      traits.push('Quick Reactor');
    }

    // Working memory analysis
    if (workingMemoryScore >= 80) {
      traits.push('Strong Working Memory');
    } else if (workingMemoryScore >= 60) {
      traits.push('Adequate Working Memory');
    } else {
      traits.push('Support-Seeking Working Memory');
    }

    // Generate unique profile name based on scores
    const profileName = aiInsights.profileName || generateProfileName(focusScore, impulsivityScore, workingMemoryScore);

    return {
      traits,
      strengths,
      challenges,
      profileName,
      detailedInsights: aiInsights.cognitiveStyle ? [aiInsights.cognitiveStyle] : generateDetailedInsights(focusScore, impulsivityScore, workingMemoryScore, results),
      recommendations: aiInsights.recommendations || []
    };
  };

  const generateDetailedInsights = (focusScore, impulsivityScore, workingMemoryScore, results) => {
    const insights = [];

    // CPT specific
    if (results.cpt?.results) {
      const { accuracy, falseAlarms, misses } = results.cpt.results;
      if (falseAlarms > misses) {
        insights.push('You may be prone to impulsive responses rather than missed targets.');
      }
    }

    // Go/No-Go specific
    if (results.goNoGo?.results) {
      const { commissionErrors, omissionErrors } = results.goNoGo.results;
      if (commissionErrors > omissionErrors) {
        insights.push('In inhibition tasks, you tend to respond when you should hold back.');
      }
    }

    // Flanker specific
    if (results.flanker?.results) {
      const { congruentCorrect, incongruentCorrect, congruentTotal, incongruentTotal } = results.flanker.results;
      const congruentAcc = (congruentCorrect / congruentTotal) * 100;
      const incongruentAcc = (incongruentCorrect / incongruentTotal) * 100;
      const interference = congruentAcc - incongruentAcc;
      if (interference > 15) {
        insights.push('Distracting information significantly impacts your performance.');
      }
    }

    return insights;
  };

  const generateProfileName = (focus, impulsivity, workingMemory) => {
    const profiles = {
      'Strategic Analyst': focus >= 75 && impulsivity >= 75 && workingMemory >= 75,
      'Careful Planner': focus >= 75 && impulsivity >= 70 && workingMemory >= 60,
      'Quick Thinker': focus >= 60 && impulsivity >= 60 && workingMemory >= 75,
      'Adaptive Reactor': focus >= 60 && impulsivity >= 50 && workingMemory >= 60,
      'Focused Sprinter': focus >= 80 && impulsivity >= 50,
      'Conscious Navigator': focus >= 65 && impulsivity >= 75,
      'Dynamic Processor': focus >= 70 && impulsivity >= 60,
      'Steady Performer': focus >= 65 && workingMemory >= 65
    };

    for (const [name, condition] of Object.entries(profiles)) {
      if (condition) return name;
    }

    return 'Unique Processor';
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      setLoading(true);
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(`Cognitive-Profile-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to download PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-generator-modal">
      <div className="profile-generator-content">
        <button className="close-button" onClick={onClose}>×</button>
        
        {!profileData ? (
          <div className="profile-generator-intro">
            <h2>🧠 AI Cognitive Profile Generator</h2>
            <p>Analyze all your test results and get a comprehensive cognitive profile with personalized insights.</p>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
              className="btn btn-primary generate-button"
              onClick={fetchAllResults}
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Generate My Profile'}
            </button>
            
            <p className="info-text">
              ℹ️ Generate an AI cognitive profile from whatever tasks you've completed so far. More tasks = more comprehensive analysis!
            </p>
          </div>
        ) : (
          <div className="profile-report-container">
            <div className="profile-report" ref={reportRef}>
              <div className="report-header">
                <h1>🧠 Your Cognitive Profile</h1>
                <h2 className="profile-name">{profileData.profileName}</h2>
                <p className="report-date">Generated on {profileData.timestamp.toLocaleDateString()}</p>
              </div>

              {/* Composite Scores */}
              <section className="scores-section">
                <h3>📊 Composite Scores</h3>
                <div className="scores-grid">
                  <div className="score-card">
                    <div className="score-value" style={{ color: '#667eea' }}>
                      {profileData.focusScore}%
                    </div>
                    <div className="score-label">Focus & Attention</div>
                  </div>
                  <div className="score-card">
                    <div className="score-value" style={{ color: '#764ba2' }}>
                      {profileData.impulsivityScore}%
                    </div>
                    <div className="score-label">Impulse Control</div>
                  </div>
                  <div className="score-card">
                    <div className="score-value" style={{ color: '#f093fb' }}>
                      {profileData.workingMemoryScore}%
                    </div>
                    <div className="score-label">Working Memory</div>
                  </div>
                  <div className="score-card">
                    <div className="score-value" style={{ color: '#4facfe' }}>
                      {100 - profileData.responseVariability}%
                    </div>
                    <div className="score-label">Response Consistency</div>
                  </div>
                </div>
              </section>

              {/* AI-Generated Insights */}
              {profileData.aiInsights && (
                <>
                  <section className="ai-summary-section">
                    <h3>✨ Your Cognitive Insight</h3>
                    <p className="ai-insight">{profileData.aiInsights.overallSummary}</p>
                  </section>

                  <section className="ai-dimensions-section">
                    <h3>🧭 Cognitive Dimensions</h3>
                    <div className="dimensions-grid">
                      <div className="dimension-card">
                        <h4>🎯 Focus Pattern</h4>
                        <p>{profileData.aiInsights.focusPattern}</p>
                      </div>
                      <div className="dimension-card">
                        <h4>⚡ Impulsivity Level</h4>
                        <p>{profileData.aiInsights.impulsivityLevel}</p>
                      </div>
                      <div className="dimension-card">
                        <h4>🧠 Working Memory</h4>
                        <p>{profileData.aiInsights.workingMemory}</p>
                      </div>
                      <div className="dimension-card">
                        <h4>⚙️ Processing Style</h4>
                        <p>{profileData.aiInsights.processingStyle}</p>
                      </div>
                    </div>
                  </section>

                  <section className="ai-strengths-section">
                    <h3>💪 Your Strengths</h3>
                    <ul className="insights-list">
                      {profileData.aiInsights.strengths && profileData.aiInsights.strengths.map((strength, idx) => (
                        <li key={idx}>✓ {strength}</li>
                      ))}
                    </ul>
                  </section>

                  <section className="ai-challenges-section">
                    <h3>🌱 Growth Opportunities</h3>
                    <ul className="insights-list">
                      {profileData.aiInsights.challenges && profileData.aiInsights.challenges.map((challenge, idx) => (
                        <li key={idx}>{challenge}</li>
                      ))}
                    </ul>
                  </section>

                  <section className="ai-recommendations-section">
                    <h3>💡 Personalized Recommendations</h3>
                    <ul className="recommendations-list">
                      {profileData.aiInsights.recommendations && profileData.aiInsights.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </section>

                  {profileData.aiInsights.cognitiveStyle && (
                    <section className="ai-cognitive-style-section">
                      <h3>🎨 Your Cognitive Style</h3>
                      <p className="cognitive-style-text">{profileData.aiInsights.cognitiveStyle}</p>
                    </section>
                  )}
                </>
              )}

              {/* Task Breakdown */}
              <section className="task-breakdown-section">
                <h3>📈 Task Performance Breakdown</h3>
                <div className="task-cards">
                  {profileData.rawResults.cpt && (
                    <div className="task-detail-card">
                      <h4>Continuous Performance Task</h4>
                      <p>Accuracy: {profileData.rawResults.cpt.results?.accuracy}%</p>
                      <p>Avg Reaction Time: {profileData.rawResults.cpt.results?.avgReactionTimeMs?.toFixed(0)}ms</p>
                    </div>
                  )}
                  {profileData.rawResults.goNoGo && (
                    <div className="task-detail-card">
                      <h4>Go/No-Go Task</h4>
                      <p>Go Accuracy: {profileData.rawResults.goNoGo.results?.goAccuracy}%</p>
                      <p>Commission Errors: {profileData.rawResults.goNoGo.results?.commissionErrors}</p>
                    </div>
                  )}
                  {profileData.rawResults.nback && (
                    <div className="task-detail-card">
                      <h4>N-Back Task</h4>
                      <p>Accuracy: {profileData.rawResults.nback.results?.accuracy}%</p>
                      <p>Working Memory Level: {profileData.rawResults.nback.results?.nBackLevel}</p>
                    </div>
                  )}
                  {profileData.rawResults.flanker && (
                    <div className="task-detail-card">
                      <h4>Flanker Task</h4>
                      <p>Congruent Acc: {profileData.rawResults.flanker.results?.congruentCorrect}/{profileData.rawResults.flanker.results?.congruentTotal}</p>
                      <p>Incongruent Acc: {profileData.rawResults.flanker.results?.incongruentCorrect}/{profileData.rawResults.flanker.results?.incongruentTotal}</p>
                    </div>
                  )}
                  {profileData.rawResults.trail && (
                    <div className="task-detail-card">
                      <h4>Trail-Making Task</h4>
                      <p>Time: {profileData.rawResults.trail.results?.timeInSeconds?.toFixed(1)}s</p>
                      <p>Errors: {profileData.rawResults.trail.results?.errors}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Growth Recommendations */}
              <section className="growth-section">
                <h3>🚀 Personalized Growth Suggestions</h3>
                <ul className="insights-list">
                  <li>Practice micro-focus sessions: 15-minute focused work blocks with 5-minute breaks</li>
                  <li>Use external reminders and checklists to support your attention management</li>
                  <li>Track patterns: Notice when you're most focused and replicate those conditions</li>
                  <li>Try body-doubling: Work alongside others or in accountability groups</li>
                  <li>Gamify tasks: Turn routine work into point-based or time-based challenges</li>
                </ul>
              </section>

              {/* Reflection Questions */}
              <section className="reflection-section">
                <h3>💭 Reflection Questions</h3>
                <ul className="insights-list">
                  <li>When do you naturally hyperfocus? What conditions make that possible?</li>
                  <li>In which situations do you feel most impulsive or reactive?</li>
                  <li>How does your performance change when tasks are novel vs. repetitive?</li>
                </ul>
              </section>
            </div>

            <div className="profile-actions">
              <button className="btn btn-primary" onClick={downloadPDF} disabled={loading}>
                📥 Download PDF Report
              </button>
              <button className="btn btn-secondary" onClick={() => setProfileData(null)}>
                ← Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIProfileGenerator;
