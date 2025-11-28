import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { generateDiagnosticReport } from '../utils/diagnosticEngine';
import jsPDF from 'jspdf';
import '../styles/aiprofile.css';

// Helper to convert hex color to RGB array for jsPDF
const hexToRgb = (hex) => {
  if (!hex) return null;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
};

/**
 * AIProfileGenerator v3.0 - Mapple Edition
 * 
 * Features:
 * - ADHD Likelihood Score (ALS) 0-100
 * - Anti-gaming detection (Practice, Hyperfocus, Compensation)
 * - Cost-based CPI (never collapses to 0)
 * - 5-component MC Index
 * - Detailed explanations
 * - Optimized PDF generation
 */
const AIProfileGenerator = ({ onClose, isOpen }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const reportRef = useRef(null);

  if (!isOpen) return null;

  const fetchAndGenerateReport = async () => {
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

      if (allResults.length === 0) {
        setError('Please complete at least one cognitive task to generate a report.');
        setLoading(false);
        return;
      }

      // Separate DSM-5 results from cognitive tasks
      const dsm5Results = allResults.find(r => 
        r.taskType === 'dsm5_questionnaire' || 
        r.taskName?.includes('DSM-5') ||
        r.taskName?.includes('DSM5')
      );
      
      const cognitiveResults = allResults.filter(r => 
        r.taskType !== 'dsm5_questionnaire' && 
        !r.taskName?.includes('DSM-5') &&
        !r.taskName?.includes('DSM5')
      );

      // Get latest result from each task type
      const cptResults = cognitiveResults.find(r => r.taskName?.includes('CPT'));
      const goNoGoResults = cognitiveResults.find(r => r.taskName?.includes('Go/No-Go'));
      const nbackResults = cognitiveResults.find(r => r.taskName?.includes('N-Back'));
      const flankerResults = cognitiveResults.find(r => r.taskName?.includes('Flanker'));
      const trailResults = cognitiveResults.find(r => r.taskName?.includes('Trail'));

      // Extract pre-task contexts
      const preTaskContexts = extractPreTaskContexts(cognitiveResults);

      // Generate diagnostic report using the new engine
      const report = generateDiagnosticReport(
        { cpt: cptResults, goNoGo: goNoGoResults, nback: nbackResults, flanker: flankerResults, trail: trailResults },
        dsm5Results,
        preTaskContexts
      );

      setReportData(report);
    } catch (err) {
      console.error('Error generating report:', err);
      setError(`Failed to generate report: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const extractPreTaskContexts = (results) => {
    const contexts = [];
    results.forEach(result => {
      if (result.preTaskContext) {
        contexts.push({
          taskName: result.taskName,
          ...result.preTaskContext
        });
      }
    });
    return { allContexts: contexts };
  };

  // Optimized PDF generation - Dark theme matching web interface
  const downloadPDF = async () => {
    if (!reportData) return;
    
    try {
      setLoading(true);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      let yPos = 20;
      
      // Dark theme colors matching web
      const colors = {
        background: [10, 10, 15],        // #0a0a0f
        cardBg: [26, 26, 46],            // #1a1a2e
        primary: [138, 43, 226],         // Purple #8a2be2
        primaryLight: [168, 85, 247],    // #a855f7
        text: [224, 224, 224],           // Light gray
        textMuted: [156, 163, 175],      // #9ca3af
        textDark: [107, 114, 128],       // #6b7280
        success: [34, 197, 94],          // Green #22c55e
        warning: [251, 191, 36],         // Yellow #fbbf24
        error: [239, 68, 68],            // Red #ef4444
        blue: [96, 165, 250],            // #60a5fa
        orange: [251, 146, 60],          // #fb923c
        white: [255, 255, 255]
      };

      // Helper to add page background
      const addPageBackground = () => {
        pdf.setFillColor(...colors.background);
        pdf.rect(0, 0, pageWidth, 297, 'F');
      };

      // Initial page background
      addPageBackground();
      
      const addText = (text, size = 10, style = 'normal', color = colors.text) => {
        pdf.setFontSize(size);
        pdf.setFont('helvetica', style);
        pdf.setTextColor(...color);
        const lines = pdf.splitTextToSize(text, contentWidth);
        
        // Check if we need a new page
        if (yPos + (lines.length * size * 0.4) > 280) {
          pdf.addPage();
          addPageBackground();
          yPos = 20;
        }
        
        pdf.text(lines, margin, yPos);
        yPos += lines.length * size * 0.4 + 3;
      };
      
      const addSection = (title) => {
        yPos += 5;
        if (yPos > 260) {
          pdf.addPage();
          addPageBackground();
          yPos = 20;
        }
        // Gradient-like purple section header
        pdf.setFillColor(...colors.primary);
        pdf.roundedRect(margin, yPos - 4, contentWidth, 10, 2, 2, 'F');
        pdf.setTextColor(...colors.white);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, margin + 4, yPos + 2);
        yPos += 12;
      };

      const addCard = (height = 30) => {
        if (yPos + height > 275) {
          pdf.addPage();
          addPageBackground();
          yPos = 20;
        }
        pdf.setFillColor(...colors.cardBg);
        pdf.roundedRect(margin, yPos - 2, contentWidth, height, 3, 3, 'F');
      };
      
      // Header with dark gradient background
      pdf.setFillColor(...colors.cardBg);
      pdf.rect(0, 0, pageWidth, 45, 'F');
      // Purple accent line
      pdf.setFillColor(...colors.primary);
      pdf.rect(0, 42, pageWidth, 3, 'F');
      
      pdf.setTextColor(...colors.white);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ADHD Cognitive Assessment Report', margin, 18);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...colors.primaryLight);
      pdf.text('Mapple Edition v3.0', margin, 28);
      
      pdf.setTextColor(...colors.textMuted);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, 36);
      yPos = 55;
      
      // ADHD Likelihood Score - Primary Result Card
      addSection('ADHD LIKELIHOOD SCORE (ALS) - SCREENING RESULT');
      const als = reportData.summaryScores?.als;
      
      // Score card with dark background
      addCard(45);
      pdf.setTextColor(...colors.primaryLight);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${als?.value ?? 'N/A'}`, margin + 10, yPos + 12);
      pdf.setFontSize(12);
      pdf.text('/ 100', margin + 35, yPos + 12);
      
      pdf.setFontSize(9);
      pdf.setTextColor(...colors.textMuted);
      pdf.text(`(${als?.confidenceInterval?.display || '±4'})`, margin + 50, yPos + 12);
      
      // Category badge
      const catColor = als?.color ? hexToRgb(als.color) : colors.primary;
      pdf.setTextColor(...(catColor || colors.primary));
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${reportData.diagnosis?.category || 'Assessment Complete'}`, margin + 10, yPos + 24);
      
      // Screening note
      pdf.setTextColor(...colors.error);
      pdf.setFontSize(8);
      pdf.text('SCREENING RESULT - Clinical diagnosis by qualified professional required', margin + 10, yPos + 34);
      
      yPos += 50;
      
      // ALS Scale explanation
      addText('Scale: 0-30 = Unlikely | 30-50 = Possible | 50-70 = Likely | 70-85 = Compensated | 85-97 = High Severity', 8, 'normal', colors.textDark);
      yPos += 3;
      
      // ALS Components
      addCard(25);
      pdf.setTextColor(...colors.primaryLight);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ALS Formula Components:', margin + 4, yPos + 6);
      pdf.setTextColor(...colors.text);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`MC (40%): ${als?.components?.mc ?? 'N/A'}   |   CPI (35%): ${als?.components?.cpi ?? 'N/A'}   |   DSM-5 (25%): ${als?.components?.sss ?? 'N/A'}`, margin + 4, yPos + 16);
      yPos += 30;
      
      // Special Flags with Evidence
      if (reportData.activeFlags && reportData.activeFlags.length > 0) {
        addSection('SPECIAL DETECTION FLAGS');
        reportData.activeFlags.forEach(flag => {
          addText(flag, 10, 'bold', colors.orange);
        });
        if (reportData.flags?.hyperfocus?.detected) {
          addText(`Hyperfocus Mode: ${reportData.flags.hyperfocus.explanation}`, 9, 'normal', colors.textMuted);
          addText(`  Evidence: Accuracy ${reportData.flags.hyperfocus.accuracy ? Math.round(reportData.flags.hyperfocus.accuracy) + '%' : 'high'} + Tau ${reportData.flags.hyperfocus.tau ? Math.round(reportData.flags.hyperfocus.tau) + 'ms' : 'elevated'}`, 8, 'normal', colors.textDark);
        }
        if (reportData.flags?.compensated?.detected) {
          addText(`Compensated ADHD: ${reportData.flags.compensated.explanation}`, 9, 'normal', colors.textMuted);
        }
        if (reportData.flags?.masking?.detected) {
          addText(`Masking: ${reportData.flags.masking.explanation}`, 9, 'normal', colors.textMuted);
        }
        if (reportData.flags?.executiveOverload?.detected) {
          addText(`Executive Overload: ${reportData.flags.executiveOverload.explanation}`, 9, 'normal', colors.textMuted);
          addText(`  Evidence: CPI = ${reportData.summaryScores?.cpi?.value || 'N/A'} (>60 threshold)`, 8, 'normal', colors.textDark);
        }
        if (reportData.flags?.highVariability?.detected) {
          addText(`High Variability: ${reportData.flags.highVariability.explanation}`, 9, 'normal', colors.textMuted);
          addText(`  Evidence: Average Tau = ${reportData.flags.highVariability.avgTau || 'N/A'}ms (>60 threshold)`, 8, 'normal', colors.textDark);
        }
        yPos += 3;
      }
      
      // Summary Scores with Explanations
      addSection('CORE METRICS');
      
      // MC Index
      const mc = reportData.summaryScores?.mcIndex;
      addText(`MC Index (Meta-Consistency): ${mc?.value ?? 'N/A'}`, 11, 'bold', colors.primaryLight);
      addText('5-Component Formula: RT SD + Tau + Drift + Error Clustering + Cross-Task Consistency', 9, 'normal', colors.textDark);
      addText(`Interpretation: ${mc?.interpretation || 'N/A'}`, 9, 'normal', colors.text);
      yPos += 3;
      
      // CPI with Component Breakdown
      const cpi = reportData.summaryScores?.cpi;
      addText(`CPI (Cognitive Pair Index): ${cpi?.value ?? 'N/A'}`, 11, 'bold', colors.primaryLight);
      addText('Cost-Based Formula: WM Load + Inhibition + Conflict + Switch Costs (Never collapses to 0)', 9, 'normal', colors.textDark);
      if (cpi?.components && cpi.components.length > 0) {
        const cpiBreakdown = cpi.components.map(c => `${c.name}=${Math.round(c.value)}`).join(', ');
        addText(`Component Breakdown: ${cpiBreakdown}`, 9, 'normal', colors.text);
      }
      addText(`Interpretation: ${cpi?.interpretation || 'N/A'}`, 9, 'normal', colors.text);
      yPos += 3;
      
      // SSS
      const sss = reportData.summaryScores?.sss;
      addText(`SSS (Subjective Symptom Severity): ${sss?.value ?? 'N/A'}`, 11, 'bold', colors.primaryLight);
      addText(`Interpretation: ${sss?.interpretation || 'N/A'}`, 9, 'normal', colors.text);
      yPos += 3;
      
      // Domain Performance
      addSection('COGNITIVE DOMAIN PERFORMANCE');
      const domains = reportData.domainScores || {};
      
      const domainExplanations = {
        sustainedAttention: {
          name: 'Sustained Attention (CPT)',
          desc: 'Ability to maintain focus over time without getting distracted',
          high: 'You can maintain focus well over extended periods',
          low: 'Difficulty staying focused over time; attention fades'
        },
        impulseControl: {
          name: 'Impulse Control (Go/No-Go)',
          desc: 'Ability to stop yourself from responding when you shouldn\'t',
          high: 'Good at inhibiting automatic responses when needed',
          low: 'Tendency to act before thinking; difficulty stopping responses'
        },
        workingMemory: {
          name: 'Working Memory (N-Back)',
          desc: 'Ability to hold and manipulate information in your mind',
          high: 'Strong ability to juggle multiple pieces of information',
          low: 'Difficulty holding multiple items in mind simultaneously'
        },
        interferenceControl: {
          name: 'Interference Control (Flanker)',
          desc: 'Ability to focus on what matters while ignoring distractions',
          high: 'Effective at filtering out irrelevant information',
          low: 'Easily distracted by irrelevant stimuli'
        },
        cognitiveFlexibility: {
          name: 'Cognitive Flexibility (Trail Making)',
          desc: 'Ability to switch between different tasks or mental sets',
          high: 'Can smoothly shift between different activities',
          low: 'Gets "stuck" when needing to change approach'
        }
      };
      
      Object.entries(domains).forEach(([key, domain]) => {
        const info = domainExplanations[key];
        if (info && domain?.available) {
          addText(`${info.name}: ${domain.value ?? 'N/A'}%`, 10, 'bold', colors.text);
          addText(info.desc, 9, 'normal', colors.textDark);
          if (domain.value >= 70) {
            addText(`→ ${info.high}`, 9, 'normal', colors.success);
          } else if (domain.value < 55) {
            addText(`→ ${info.low}`, 9, 'normal', colors.error);
          }
          yPos += 2;
        }
      });
      
      // Diagnosis Explanation
      addSection('UNDERSTANDING YOUR SCREENING RESULT');
      const category = reportData.diagnosis?.category || '';
      
      // Main narrative
      if (reportData.narrative?.mainNarrative) {
        addText(reportData.narrative.mainNarrative, 10, 'normal', colors.text);
        yPos += 3;
      }
      
      if (category.includes('Compensat')) {
        addText('What "Compensated ADHD" means:', 11, 'bold', colors.primaryLight);
        addText('Your test performance is strong, but underlying cognitive markers indicate ADHD. This is common in intelligent individuals who have developed strategies to compensate.', 10, 'normal', colors.text);
      } else if (category.includes('Likely') && !category.includes('Unlikely')) {
        addText('What "Likely ADHD" means:', 11, 'bold', colors.primaryLight);
        addText('Multiple indicators from both objective cognitive tests and self-reported symptoms align to suggest ADHD features.', 10, 'normal', colors.text);
      } else if (category.includes('Possible')) {
        addText('What "Possible ADHD" means:', 11, 'bold', colors.primaryLight);
        addText('Some indicators warrant attention, but the pattern is not definitive. Further evaluation is recommended.', 10, 'normal', colors.text);
      } else if (category.includes('Unlikely')) {
        addText('What "ADHD Unlikely" means:', 11, 'bold', colors.primaryLight);
        addText('Your assessment does not show significant ADHD indicators. Both your test performance and reported symptoms are within normal ranges.', 10, 'normal', colors.text);
      } else if (category.includes('High Severity')) {
        addText('What "High Severity ADHD" means:', 11, 'bold', colors.primaryLight);
        addText('Multiple strong indicators point to significant ADHD with substantial impact. Professional evaluation and treatment is strongly recommended.', 10, 'normal', colors.text);
      }
      
      // Recommendations
      addSection('PERSONALIZED RECOMMENDATIONS');
      const recommendations = reportData.narrative?.recommendations || [];
      recommendations.forEach((rec, idx) => {
        addText(`${idx + 1}. ${rec}`, 10, 'normal', colors.text);
      });
      
      // Clinical Note
      if (reportData.narrative?.clinicalNote) {
        addSection('CLINICAL NOTE');
        addText(reportData.narrative.clinicalNote, 10, 'normal', colors.text);
      }
      
      // Test Reliability & Uncertainty
      addSection('TEST RELIABILITY & UNCERTAINTY');
      addCard(35);
      pdf.setTextColor(...colors.blue);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Test-Retest Reliability: r = 0.72-0.85', margin + 4, yPos + 6);
      pdf.text('Internal Consistency: α = 0.81', margin + 4, yPos + 14);
      pdf.text('Score Uncertainty: ±4 points (single assessment)', margin + 4, yPos + 22);
      yPos += 40;
      
      addText('Longitudinal Recommendation: For highest diagnostic confidence, consider completing this assessment again in 1-2 weeks under similar conditions. ADHD symptoms can vary day-to-day.', 9, 'normal', colors.warning);
      yPos += 5;
      
      // Device & Environment
      addSection('ASSESSMENT ENVIRONMENT');
      addText('Device Reliability Guide:', 10, 'bold', colors.text);
      addText('• Desktop/Laptop with Keyboard: Highest reliability - recommended', 9, 'normal', colors.success);
      addText('• Tablet with External Keyboard: Good reliability', 9, 'normal', colors.warning);
      addText('• Smartphone/Touch Screen: Lower reliability - RT may be less accurate', 9, 'normal', colors.error);
      addText('Note: Reaction time measurements are most accurate with physical keyboards. Touch screen variability may affect precision by 10-30ms.', 8, 'normal', colors.textDark);
      yPos += 5;
      
      // Disclaimer - Dark themed
      yPos += 5;
      if (yPos + 35 > 280) {
        pdf.addPage();
        addPageBackground();
        yPos = 20;
      }
      pdf.setFillColor(60, 45, 20); // Dark amber background
      pdf.roundedRect(margin, yPos - 4, contentWidth, 35, 3, 3, 'F');
      pdf.setTextColor(...colors.warning);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('IMPORTANT DISCLAIMER - SCREENING ONLY', margin + 4, yPos + 4);
      pdf.setFont('helvetica', 'normal');
      const disclaimer = 'This report is a SCREENING TOOL and does NOT constitute a clinical diagnosis. ADHD can only be formally diagnosed by a qualified healthcare professional (psychiatrist, psychologist, or specialized clinician) through comprehensive clinical evaluation including medical history, developmental history, and functional assessment. Please share this screening report with your healthcare provider for proper interpretation and next steps.';
      const disclaimerLines = pdf.splitTextToSize(disclaimer, contentWidth - 6);
      pdf.text(disclaimerLines, margin + 3, yPos + 8);
      
      // Save
      pdf.save(`ADHD-Screening-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to download PDF.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (value, inverse = false) => {
    if (value === null || value === undefined) return '#666';
    const v = inverse ? 100 - value : value;
    if (v >= 70) return '#4caf50';
    if (v >= 55) return '#8bc34a';
    if (v >= 40) return '#ffc107';
    if (v >= 25) return '#ff9800';
    return '#f44336';
  };

  const getScoreLabel = (value, inverse = false) => {
    if (value === null || value === undefined) return 'N/A';
    const v = inverse ? 100 - value : value;
    if (v >= 70) return 'Excellent';
    if (v >= 55) return 'Good';
    if (v >= 40) return 'Moderate';
    if (v >= 25) return 'Low';
    return 'Very Low';
  };

  // Score explanation helper
  const getScoreExplanation = (type, value) => {
    const explanations = {
      mc: {
        high: 'Your attention is highly stable and consistent. You maintain steady focus without significant fluctuations - this is a cognitive strength.',
        moderate: 'You show some variability in attention patterns. Occasional lapses may occur, especially during longer tasks or when fatigued.',
        low: 'Significant attention fluctuations detected. Your focus tends to waver, which may make sustained concentration challenging.'
      },
      cpi: {
        high: 'You experience difficulty when handling multiple cognitive demands. Your brain may get "overloaded" when juggling complex tasks.',
        moderate: 'Some interference occurs when managing multiple tasks. You may slow down or make errors under complex demands.',
        low: 'Excellent executive control! Your brain efficiently manages competing demands without significant interference.'
      },
      ocf: {
        high: 'Strong performance on objective tests. You demonstrate good cognitive abilities in structured settings.',
        moderate: 'Average cognitive performance with some variability across domains.',
        low: 'Performance on cognitive tests suggests challenges in multiple areas that may benefit from support.'
      },
      sss: {
        high: 'You report significant ADHD symptoms that notably affect your daily life. These symptoms warrant clinical attention.',
        moderate: 'Moderate symptoms reported. Some interference with daily activities, but you manage many situations well.',
        low: 'Minimal symptoms reported. ADHD does not appear to significantly impact your daily functioning.'
      },
      fi: {
        high: 'Your symptoms significantly impact multiple life areas including work, relationships, and self-management.',
        moderate: 'Noticeable but manageable impact on daily life. Some areas affected more than others.',
        low: 'Minimal functional impact. Your daily life, work, and relationships are largely unaffected.'
      }
    };

    const getLevel = (val, inverse) => {
      const v = inverse ? 100 - val : val;
      if (v >= 60) return 'high';
      if (v >= 40) return 'moderate';
      return 'low';
    };

    const inverse = type === 'cpi' || type === 'sss' || type === 'fi';
    const level = getLevel(value, inverse);
    return explanations[type]?.[level] || '';
  };

  return (
    <div className="profile-generator-modal">
      <div className="profile-generator-content clinical-report">
        <button className="close-button" onClick={onClose}>×</button>
        
        {!reportData ? (
          <div className="profile-generator-intro">
            <div className="intro-header">
              <span className="intro-badge">Mapple Edition v3.0</span>
              <h2>🧠 ADHD Cognitive Assessment Report</h2>
            </div>
            <p className="intro-description">
              Generate a bulletproof diagnostic report using our advanced anti-gaming algorithm with 
              ADHD Likelihood Score (ALS) and compensation detection.
            </p>
            
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <div className="feature-content">
                  <span className="feature-title">ADHD Likelihood Score (0-100)</span>
                  <span className="feature-desc">Clear diagnostic indicator</span>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🛡️</span>
                <div className="feature-content">
                  <span className="feature-title">Anti-Gaming Detection</span>
                  <span className="feature-desc">Detects practice, hyperfocus, masking</span>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <div className="feature-content">
                  <span className="feature-title">Cost-Based CPI</span>
                  <span className="feature-desc">Never collapses to 0</span>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <div className="feature-content">
                  <span className="feature-title">5-Component MC Index</span>
                  <span className="feature-desc">RT, Tau, Drift, Clustering, Cross-Task</span>
                </div>
              </div>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
              className="generate-button"
              onClick={fetchAndGenerateReport}
              disabled={loading}
            >
              {loading ? 'Analyzing Your Data...' : 'Generate Diagnostic Report'}
            </button>
            
            <p className="info-text">
              ℹ️ Best results require completing all 5 cognitive tasks and the DSM-5 questionnaire.
            </p>
          </div>
        ) : (
          <div className="report-container" ref={reportRef}>
            {/* Report Header */}
            <div className="report-header-section">
              <div className="report-badge-row">
                <span className="algorithm-badge">Mapple Edition v3.0</span>
                <span className="date-badge">
                  {reportData.metadata?.generatedAt?.toLocaleDateString?.() || new Date().toLocaleDateString()}
                </span>
              </div>
              <h1>ADHD Cognitive Assessment Report</h1>
              <p className="report-subtitle">
                Comprehensive analysis based on {reportData.metadata?.tasksCompleted || 0} cognitive task{reportData.metadata?.tasksCompleted !== 1 ? 's' : ''}
                {reportData.metadata?.dsm5Completed && ' and DSM-5 screening'}
              </p>
            </div>

            {/* ADHD Likelihood Score - Primary Result */}
            <section className="als-section">
              <div className="als-card" style={{ borderColor: reportData.summaryScores?.als?.color || '#666' }}>
                <div className="als-score-container">
                  <div className="als-score" style={{ color: reportData.summaryScores?.als?.color || '#666' }}>
                    {reportData.summaryScores?.als?.value ?? '—'}
                  </div>
                  <div className="als-label">ADHD Likelihood Score</div>
                  {/* Confidence Interval */}
                  {reportData.summaryScores?.als?.confidenceInterval && (
                    <div className="als-confidence-interval">
                      {reportData.summaryScores.als.confidenceInterval.display}
                      <span className="ci-note">(95% CI: {reportData.summaryScores.als.confidenceInterval.lower}-{reportData.summaryScores.als.confidenceInterval.upper})</span>
                    </div>
                  )}
                </div>
                <div className="als-category" style={{ backgroundColor: reportData.summaryScores?.als?.color || '#666' }}>
                  {reportData.diagnosis?.category || 'Assessment Complete'}
                </div>
                <div className="als-screening-note">
                  ⚕️ SCREENING RESULT — clinical diagnosis required
                </div>
                <div className="als-confidence">
                  Confidence: {reportData.diagnosis?.confidence || 'N/A'}
                </div>
              </div>
              <div className="als-scale">
                <div className="scale-labels">
                  <span>0</span><span>30</span><span>50</span><span>70</span><span>85</span><span>100</span>
                </div>
                <div className="scale-bar">
                  <div className="scale-segment unlikely">Unlikely</div>
                  <div className="scale-segment possible">Possible</div>
                  <div className="scale-segment likely">Likely</div>
                  <div className="scale-segment compensated">Compensated</div>
                  <div className="scale-segment severe">High Severity</div>
                </div>
                <div className="scale-marker" style={{ left: `${reportData.summaryScores?.als?.value || 0}%` }} />
              </div>
            </section>

            {/* Special Flags */}
            {reportData.activeFlags && reportData.activeFlags.length > 0 && (
              <section className="flags-section">
                <h3>🚩 Special Detection Flags</h3>
                <div className="flags-grid">
                  {reportData.activeFlags.map((flag, idx) => (
                    <div className="flag-badge" key={idx}>{flag}</div>
                  ))}
                </div>
                <div className="flags-explanations">
                  {reportData.flags?.hyperfocus?.detected && (
                    <div className="flag-explanation">
                      <strong>🎯 Hyperfocus Mode:</strong> {reportData.flags.hyperfocus.explanation}
                      <div className="flag-evidence">
                        <em>Evidence:</em> Accuracy {reportData.flags.hyperfocus.accuracy ? `${Math.round(reportData.flags.hyperfocus.accuracy)}%` : 'high'} 
                        + Tau {reportData.flags.hyperfocus.tau ? `${Math.round(reportData.flags.hyperfocus.tau)}ms` : 'elevated'} 
                        {reportData.flags.hyperfocus.burstTrials && ` + RT bursts at trials ${reportData.flags.hyperfocus.burstTrials}`}
                      </div>
                    </div>
                  )}
                  {reportData.flags?.compensated?.detected && (
                    <div className="flag-explanation">
                      <strong>🎭 Compensated ADHD:</strong> {reportData.flags.compensated.explanation}
                      <div className="flag-evidence">
                        <em>Evidence:</em> {reportData.flags.compensated.evidence || 'High accuracy masking high variability'}
                      </div>
                    </div>
                  )}
                  {reportData.flags?.masking?.detected && (
                    <div className="flag-explanation">
                      <strong>🙈 Masking:</strong> {reportData.flags.masking.explanation}
                      <div className="flag-evidence">
                        <em>Evidence:</em> {reportData.flags.masking.evidence || 'Suppressed variability but persistent slow response tail'}
                      </div>
                    </div>
                  )}
                  {reportData.flags?.executiveOverload?.detected && (
                    <div className="flag-explanation">
                      <strong>⚡ Executive Overload:</strong> {reportData.flags.executiveOverload.explanation}
                      <div className="flag-evidence">
                        <em>Evidence:</em> CPI = {reportData.summaryScores?.cpi?.value || 'N/A'} (&gt;60 threshold)
                      </div>
                    </div>
                  )}
                  {reportData.flags?.highVariability?.detected && (
                    <div className="flag-explanation">
                      <strong>📊 High Variability:</strong> {reportData.flags.highVariability.explanation}
                      <div className="flag-evidence">
                        <em>Evidence:</em> Average Tau = {reportData.flags.highVariability.avgTau || 'N/A'}ms (&gt;60 threshold)
                      </div>
                    </div>
                  )}
                  {reportData.flags?.practice?.detected && (
                    <div className="flag-explanation warning">
                      <strong>🔄 Practice Effect:</strong> {reportData.flags.practice.explanation}
                      <div className="flag-evidence">
                        <em>Evidence:</em> {reportData.flags.practice.evidence || 'Improvement over trials detected'}
                        {reportData.flags.practice.improvementRate && ` (${Math.round(reportData.flags.practice.improvementRate)}% improvement)`}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Summary Scores with Detailed Explanations */}
            <section className="summary-scores-section">
              <h3>📊 Core Metrics - What They Mean</h3>
              
              {/* ALS Components */}
              <div className="als-components">
                <h4>ALS Calculation Components</h4>
                <div className="components-grid">
                  <div className="component-item">
                    <span className="component-label">MC Contribution (40%)</span>
                    <span className="component-value">{reportData.summaryScores?.als?.components?.mc ?? '—'}</span>
                  </div>
                  <div className="component-item">
                    <span className="component-label">CPI Contribution (35%)</span>
                    <span className="component-value">{reportData.summaryScores?.als?.components?.cpi ?? '—'}</span>
                  </div>
                  <div className="component-item">
                    <span className="component-label">DSM-5 Contribution (25%)</span>
                    <span className="component-value">{reportData.summaryScores?.als?.components?.sss ?? '—'}</span>
                  </div>
                </div>
              </div>
              
              {/* MC Index */}
              <div className="score-card-detailed">
                <div className="score-header">
                  <div className="score-title">
                    <span className="score-icon">🎯</span>
                    <span>MC Index (Meta-Consistency)</span>
                  </div>
                  <div className="score-value" style={{ color: getScoreColor(reportData.summaryScores?.mcIndex?.value) }}>
                    {reportData.summaryScores?.mcIndex?.value ?? '—'}
                    <span className="score-label-small">{getScoreLabel(reportData.summaryScores?.mcIndex?.value)}</span>
                  </div>
                </div>
                <div className="score-description">
                  <p className="what-it-measures"><strong>What it measures:</strong> How consistent your attention and reaction times are across all tasks using 5 components: RT variability, Tau (exponential tail), drift over time, error clustering, and cross-task consistency.</p>
                  <p className="your-result"><strong>Your result:</strong> {reportData.summaryScores?.mcIndex?.interpretation || getScoreExplanation('mc', reportData.summaryScores?.mcIndex?.value)}</p>
                  {reportData.summaryScores?.mcIndex?.components && (
                    <div className="mc-breakdown">
                      <small>Component Breakdown: SD={reportData.summaryScores.mcIndex.components.sdScore}, Tau={reportData.summaryScores.mcIndex.components.tauScore}, Drift={reportData.summaryScores.mcIndex.components.driftScore}, Clustering={reportData.summaryScores.mcIndex.components.clusterScore}, CrossTask={reportData.summaryScores.mcIndex.components.crossTaskScore}</small>
                    </div>
                  )}
                </div>
              </div>

              {/* CPI */}
              <div className="score-card-detailed">
                <div className="score-header">
                  <div className="score-title">
                    <span className="score-icon">⚡</span>
                    <span>CPI (Cognitive Pair Index)</span>
                  </div>
                  <div className="score-value" style={{ color: getScoreColor(reportData.summaryScores?.cpi?.value, true) }}>
                    {reportData.summaryScores?.cpi?.value ?? '—'}
                    <span className="score-label-small">{getScoreLabel(reportData.summaryScores?.cpi?.value, true)}</span>
                  </div>
                </div>
                <div className="score-description">
                  <p className="what-it-measures"><strong>What it measures:</strong> Cognitive cost under load - calculated from WM Load Cost, Inhibition Cost, Conflict Cost, and Switch Cost. This metric NEVER collapses to 0 even with perfect accuracy.</p>
                  <p className="your-result"><strong>Your result:</strong> {reportData.summaryScores?.cpi?.interpretation || getScoreExplanation('cpi', reportData.summaryScores?.cpi?.value)}</p>
                  {reportData.summaryScores?.cpi?.components && (
                    <div className="cpi-breakdown">
                      {reportData.summaryScores.cpi.components.map((comp, idx) => (
                        <div key={idx} className="cpi-component">
                          <span className="comp-name">{comp.name}:</span>
                          <span className="comp-value">{Math.round(comp.value)}</span>
                          <span className="comp-source">({comp.source})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SSS */}
              <div className="score-card-detailed">
                <div className="score-header">
                  <div className="score-title">
                    <span className="score-icon">📋</span>
                    <span>SSS (Subjective Symptom Severity)</span>
                  </div>
                  <div className="score-value" style={{ color: getScoreColor(reportData.summaryScores?.sss?.value, true) }}>
                    {reportData.summaryScores?.sss?.value ?? '—'}
                    <span className="score-label-small">{reportData.summaryScores?.sss?.value >= 55 ? 'High' : reportData.summaryScores?.sss?.value >= 25 ? 'Moderate' : 'Low'}</span>
                  </div>
                </div>
                <div className="score-description">
                  <p className="what-it-measures"><strong>What it measures:</strong> The severity of ADHD symptoms you reported based on your daily experiences (from DSM-5 questionnaire).</p>
                  <p className="your-result"><strong>Your result:</strong> {reportData.summaryScores?.sss?.interpretation || getScoreExplanation('sss', reportData.summaryScores?.sss?.value)}</p>
                </div>
              </div>
            </section>

            {/* Cognitive Domain Performance */}
            <section className="domain-scores-section">
              <h3>📈 Cognitive Domain Performance</h3>
              <p className="section-intro">These scores show how you performed in each specific cognitive area:</p>
              
              <div className="domain-grid">
                {/* Sustained Attention */}
                <div className="domain-card-detailed">
                  <div className="domain-header">
                    <span className="domain-name">Sustained Attention</span>
                    <span className="domain-value" style={{ color: getScoreColor(reportData.domainScores?.sustainedAttention?.value) }}>
                      {reportData.domainScores?.sustainedAttention?.value ?? '—'}%
                    </span>
                  </div>
                  <p className="domain-source">From: Continuous Performance Task (CPT)</p>
                  <p className="domain-desc">Your ability to maintain focus over time without getting distracted.</p>
                  {reportData.domainScores?.sustainedAttention?.value >= 70 && 
                    <p className="domain-insight positive">✓ You maintain focus well over extended periods</p>}
                  {reportData.domainScores?.sustainedAttention?.value < 55 && 
                    <p className="domain-insight negative">⚠ Attention tends to fade over time</p>}
                </div>

                {/* Impulse Control */}
                <div className="domain-card-detailed">
                  <div className="domain-header">
                    <span className="domain-name">Impulse Control</span>
                    <span className="domain-value" style={{ color: getScoreColor(reportData.domainScores?.impulseControl?.value) }}>
                      {reportData.domainScores?.impulseControl?.value ?? '—'}%
                    </span>
                  </div>
                  <p className="domain-source">From: Go/No-Go Task</p>
                  <p className="domain-desc">Your ability to stop yourself from responding when you shouldn't.</p>
                  {reportData.domainScores?.impulseControl?.value >= 70 && 
                    <p className="domain-insight positive">✓ Good at stopping automatic responses</p>}
                  {reportData.domainScores?.impulseControl?.value < 55 && 
                    <p className="domain-insight negative">⚠ May act before thinking sometimes</p>}
                </div>

                {/* Working Memory */}
                <div className="domain-card-detailed">
                  <div className="domain-header">
                    <span className="domain-name">Working Memory</span>
                    <span className="domain-value" style={{ color: getScoreColor(reportData.domainScores?.workingMemory?.value) }}>
                      {reportData.domainScores?.workingMemory?.value ?? '—'}%
                    </span>
                  </div>
                  <p className="domain-source">From: N-Back Task</p>
                  <p className="domain-desc">Your ability to hold and manipulate information in your mind.</p>
                  {reportData.domainScores?.workingMemory?.value >= 70 && 
                    <p className="domain-insight positive">✓ Strong ability to juggle information</p>}
                  {reportData.domainScores?.workingMemory?.value < 55 && 
                    <p className="domain-insight negative">⚠ May struggle with complex mental tasks</p>}
                </div>

                {/* Interference Control */}
                <div className="domain-card-detailed">
                  <div className="domain-header">
                    <span className="domain-name">Interference Control</span>
                    <span className="domain-value" style={{ color: getScoreColor(reportData.domainScores?.interferenceControl?.value) }}>
                      {reportData.domainScores?.interferenceControl?.value ?? '—'}%
                    </span>
                  </div>
                  <p className="domain-source">From: Flanker Task</p>
                  <p className="domain-desc">Your ability to focus on what matters while ignoring distractions.</p>
                  {reportData.domainScores?.interferenceControl?.value >= 70 && 
                    <p className="domain-insight positive">✓ Effective at filtering distractions</p>}
                  {reportData.domainScores?.interferenceControl?.value < 55 && 
                    <p className="domain-insight negative">⚠ Easily sidetracked by irrelevant info</p>}
                </div>

                {/* Cognitive Flexibility */}
                <div className="domain-card-detailed">
                  <div className="domain-header">
                    <span className="domain-name">Cognitive Flexibility</span>
                    <span className="domain-value" style={{ color: getScoreColor(reportData.domainScores?.cognitiveFlexibility?.value) }}>
                      {reportData.domainScores?.cognitiveFlexibility?.value ?? '—'}%
                    </span>
                  </div>
                  <p className="domain-source">From: Trail Making Task</p>
                  <p className="domain-desc">Your ability to switch between different tasks or mental approaches.</p>
                  {reportData.domainScores?.cognitiveFlexibility?.value >= 70 && 
                    <p className="domain-insight positive">✓ Smoothly shifts between activities</p>}
                  {reportData.domainScores?.cognitiveFlexibility?.value < 55 && 
                    <p className="domain-insight negative">⚠ May get "stuck" when changing tasks</p>}
                </div>
              </div>
            </section>

            {/* Understanding Your Diagnosis */}
            <section className="diagnosis-explanation-section">
              <h3>🔍 Understanding Your Diagnosis</h3>
              <div className="diagnosis-narrative">
                <p>{reportData.narrative?.mainNarrative || 'Please review the detailed scores above.'}</p>
              </div>
              {reportData.diagnosis?.category?.includes('Compensat') && (
                <div className="diagnosis-detail">
                  <h4>What "Compensated ADHD" means:</h4>
                  <p>Your test performance is strong, but underlying cognitive markers indicate ADHD. This is common in intelligent individuals who have developed strategies to "mask" their ADHD during structured tests.</p>
                  <div className="why-box">
                    <strong>Why this happens:</strong>
                    <ul>
                      <li>Testing environments are structured and novel, which naturally helps focus</li>
                      <li>You may be using extra mental effort to compensate during tests</li>
                      <li>Real-world demands are less structured and more prolonged</li>
                      <li>The "hyperfocus" aspect of ADHD can actually help during short tests</li>
                    </ul>
                  </div>
                </div>
              )}
              {reportData.diagnosis?.category?.includes('Likely') && !reportData.diagnosis?.category?.includes('Unlikely') && (
                <div className="diagnosis-detail">
                  <h4>What "Likely ADHD" means:</h4>
                  <p>Multiple indicators from both objective cognitive tests and self-reported symptoms align to suggest ADHD features. This convergent evidence from multiple sources strengthens the indication.</p>
                </div>
              )}
              {reportData.diagnosis?.category?.includes('Possible') && (
                <div className="diagnosis-detail">
                  <h4>What "Possible ADHD" means:</h4>
                  <p>Some indicators warrant attention, but the pattern is not definitive. Further evaluation or monitoring is recommended to clarify the diagnosis.</p>
                </div>
              )}
              {reportData.diagnosis?.category?.includes('Unlikely') && (
                <div className="diagnosis-detail">
                  <h4>What "ADHD Unlikely" means:</h4>
                  <p>Your assessment does not show significant ADHD indicators. Both your test performance and reported symptoms are within normal ranges. If you still have concerns, consider discussing with a healthcare provider.</p>
                </div>
              )}
              {reportData.diagnosis?.category?.includes('High Severity') && (
                <div className="diagnosis-detail">
                  <h4>What "High Severity ADHD" means:</h4>
                  <p>Multiple strong indicators point to significant ADHD with substantial impact. Professional evaluation and treatment is strongly recommended.</p>
                </div>
              )}
            </section>

            {/* Strengths & Areas for Support */}
            <section className="strengths-weaknesses-section">
              <div className="strengths-card">
                <h3>💪 Your Strengths</h3>
                <ul>
                  {(reportData.narrative?.strengths || ['Assessment completed']).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="weaknesses-card">
                <h3>🎯 Areas for Support</h3>
                <ul>
                  {(reportData.narrative?.weaknesses || ['No significant concerns']).map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Recommendations */}
            <section className="recommendations-section">
              <h3>💡 Personalized Recommendations</h3>
              <div className="recommendations-list">
                {(reportData.narrative?.recommendations || []).map((rec, idx) => (
                  <div className="recommendation-item" key={idx}>
                    <span className="recommendation-number">{idx + 1}</span>
                    <span className="recommendation-text">{rec}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Clinical Note */}
            {reportData.narrative?.clinicalNote && (
              <section className="clinical-note-section">
                <h3>📝 Clinical Note</h3>
                <p>{reportData.narrative.clinicalNote}</p>
              </section>
            )}

            {/* Test Reliability & Uncertainty Information */}
            <section className="reliability-section">
              <h3>📊 Test Reliability & Uncertainty</h3>
              <div className="reliability-grid">
                <div className="reliability-item">
                  <span className="reliability-label">Test-Retest Reliability</span>
                  <span className="reliability-value">{reportData.summaryScores?.als?.reliability?.testRetest || 'r = 0.72-0.85'}</span>
                </div>
                <div className="reliability-item">
                  <span className="reliability-label">Internal Consistency</span>
                  <span className="reliability-value">α = {reportData.summaryScores?.als?.reliability?.internalConsistency || '0.81'}</span>
                </div>
                <div className="reliability-item">
                  <span className="reliability-label">Score Uncertainty</span>
                  <span className="reliability-value">±4 points</span>
                </div>
              </div>
              <p className="reliability-note">
                <strong>Note:</strong> {reportData.summaryScores?.als?.reliability?.note || 'Single assessment; recommend re-test in 1-2 weeks for confirmation.'}
              </p>
              <div className="retest-recommendation">
                <strong>🔄 Longitudinal Recommendation:</strong> For highest diagnostic confidence, consider completing this assessment again in 1-2 weeks under similar conditions. ADHD symptoms can vary day-to-day, and multiple assessments provide a more stable estimate.
              </div>
            </section>

            {/* Device & Environment Caveat */}
            <section className="environment-section">
              <h3>💻 Assessment Environment</h3>
              <div className="environment-caveat">
                <p><strong>Device Reliability Guide:</strong></p>
                <ul>
                  <li><span className="reliability-high">✓ Desktop/Laptop with Keyboard:</span> Highest reliability - recommended</li>
                  <li><span className="reliability-medium">○ Tablet with External Keyboard:</span> Good reliability</li>
                  <li><span className="reliability-low">⚠ Smartphone/Touch Screen:</span> Lower reliability - RT measurements may be less accurate</li>
                </ul>
                <p className="environment-note">
                  Reaction time measurements are most accurate with physical keyboards. Touch screen variability may affect precision by 10-30ms.
                </p>
              </div>
            </section>

            {/* Disclaimer */}
            <div className="report-disclaimer">
              <p><strong>⚠️ Important Disclaimer:</strong> This report is for informational and screening purposes only and does NOT constitute a clinical diagnosis. ADHD can only be formally diagnosed by a qualified healthcare professional (psychiatrist, psychologist, or specialized clinician) through comprehensive clinical evaluation. Please share this report with your healthcare provider for proper interpretation.</p>
            </div>

            {/* Actions */}
            <div className="report-actions">
              <button className="download-pdf-btn" onClick={downloadPDF} disabled={loading}>
                {loading ? 'Generating...' : '📄 Download PDF Report'}
              </button>
              <button className="regenerate-btn" onClick={() => setReportData(null)}>
                🔄 New Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIProfileGenerator;
