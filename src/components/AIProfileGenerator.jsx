import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { generateAIReport, validateAssessmentData } from '../utils/aiService';
import jsPDF from 'jspdf';
import '../styles/aiprofile.css';

/**
 * AIProfileGenerator v6.0 - Complete AI-Calculated Reports
 * 
 * The AI receives ALL raw assessment data and our formulas.
 * It calculates all metrics and generates the entire report.
 * Everything displayed comes from the AI response.
 */
const AIProfileGenerator = ({ onClose, isOpen }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [aiReport, setAiReport] = useState(null);
  const [error, setError] = useState(null);
  const [validationInfo, setValidationInfo] = useState(null);
  const reportRef = useRef(null);

  if (!isOpen) return null;

  /**
   * Fetch raw assessment data from Firebase and send to AI
   */
  const fetchAndGenerateReport = async () => {
    try {
      setLoading(true);
      setError(null);
      setAiReport(null);

      // Fetch all results from Firebase
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

      // Organize raw results by test type
      const rawAssessmentData = organizeRawResults(allResults);
      
      // Validate we have enough data
      const validation = validateAssessmentData(rawAssessmentData);
      setValidationInfo(validation);
      
      if (!validation.isValid) {
        setError(`Please complete at least 2 cognitive tests. You've completed: ${validation.completedTests.join(', ') || 'none'}`);
        setLoading(false);
        return;
      }

      // Get user info
      const userInfo = {
        name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Patient',
        age: null  // Could be fetched from user profile if available
      };

      console.log('📊 Sending raw data to AI for calculation and analysis...');
      console.log('Completed tests:', validation.completedTests);
      
      // Call AI with raw data - AI will calculate everything
      const result = await generateAIReport(rawAssessmentData, userInfo);
      
      console.log('✅ AI report received:', result);
      setAiReport(result);
      
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.message || 'Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Organize raw Firebase results into structured format for AI
   */
  const organizeRawResults = (allResults) => {
    // Separate DSM-5 from cognitive tests
    const dsm5Result = allResults.find(r => 
      r.taskType === 'dsm5_questionnaire' || 
      r.taskName?.toLowerCase().includes('dsm')
    );
    
    const cognitiveResults = allResults.filter(r => 
      r.taskType !== 'dsm5_questionnaire' && 
      !r.taskName?.toLowerCase().includes('dsm')
    );

    // Get latest result from each task type
    const cptResult = cognitiveResults.find(r => r.taskName?.toLowerCase().includes('cpt'));
    const goNoGoResult = cognitiveResults.find(r => r.taskName?.toLowerCase().includes('go'));
    const nbackResult = cognitiveResults.find(r => r.taskName?.toLowerCase().includes('back'));
    const flankerResult = cognitiveResults.find(r => r.taskName?.toLowerCase().includes('flanker'));
    const trailResult = cognitiveResults.find(r => r.taskName?.toLowerCase().includes('trail'));

    // Return raw data - preserve all fields for AI to analyze
    return {
      cptResults: cptResult ? extractCPTData(cptResult) : null,
      goNoGoResults: goNoGoResult ? extractGoNoGoData(goNoGoResult) : null,
      nBackResults: nbackResult ? extractNBackData(nbackResult) : null,
      flankerResults: flankerResult ? extractFlankerData(flankerResult) : null,
      trailMakingResults: trailResult ? extractTrailData(trailResult) : null,
      dsm5Results: dsm5Result ? extractDSM5Data(dsm5Result) : null
    };
  };

  // Data extraction helpers - preserve raw values for AI
  // Note: Data is stored as { results: {...}, taskConfig: {...} } so we need to extract from result.results
  const extractCPTData = (result) => {
    const data = result.results || result;
    console.log('🔍 extractCPTData - Raw result keys:', Object.keys(result || {}));
    console.log('🔍 extractCPTData - result.results exists:', !!result.results);
    console.log('🔍 extractCPTData - result.results keys:', Object.keys(result.results || {}));
    console.log('🔍 extractCPTData - data keys:', Object.keys(data || {}));
    console.log('🔍 extractCPTData - data.reactionTimesMs:', (data.reactionTimesMs || []).length, 'items');
    console.log('🔍 extractCPTData - data.reactionTimes:', (data.reactionTimes || []).length, 'items');
    
    const extractedData = {
      taskName: result.taskName || result.task,
      completedAt: result.recordedAt || result.timestamp,
      // Core metrics
      correctHits: data.correctHits ?? data.correct ?? data.hits,
      totalTargets: data.totalTargets ?? data.totalTrials,
      commissionErrors: data.commissionErrors ?? data.falseAlarms,
      omissionErrors: data.omissionErrors ?? data.missedTargets ?? data.misses,
      totalNonTargets: data.totalNonTargets,
      // RT metrics
      meanRT: data.meanRT ?? data.averageRT ?? data.avgReactionTime ?? data.avgReactionTimeMs,
      rtSD: data.rtSD ?? data.reactionTimeSD ?? data.stdDev,
      rtCV: data.rtCV ?? data.coefficientOfVariation,
      // IMPORTANT: Check both property names for reaction times
      reactionTimes: data.reactionTimes ?? data.reactionTimesMs ?? data.allRTs ?? [],
      // Computed rates (if available)
      hitRate: data.hitRate ?? data.accuracy,
      falseAlarmRate: data.falseAlarmRate ?? data.commissionRate,
      // Advanced metrics
      dPrime: data.dPrime ?? data.dprime,
      tau: data.tau,
      ...data  // Include any other fields
    };
    console.log('🔍 extractCPTData - Final reactionTimes:', extractedData.reactionTimes.length, 'items');
    return extractedData;
  };

  const extractGoNoGoData = (result) => {
    const data = result.results || result;
    return {
      taskName: result.taskName || result.task,
      completedAt: result.recordedAt || result.timestamp,
      correctGo: data.correctGo ?? data.correctResponses,
      correctNoGo: data.correctNoGo ?? data.correctInhibitions,
      totalGoTrials: data.totalGoTrials ?? data.goTrials,
      totalNoGoTrials: data.totalNoGoTrials ?? data.noGoTrials,
      commissionErrors: data.commissionErrors ?? data.falseAlarms,
      omissionErrors: data.omissionErrors ?? data.missedGo,
      commissionRate: data.commissionRate,
      omissionRate: data.omissionRate,
      meanRT: data.meanRT ?? data.averageRT ?? data.avgReactionTime ?? data.avgReactionTimeMs,
      rtSD: data.rtSD ?? data.reactionTimeSD ?? data.stdDev,
      accuracy: data.accuracy,
      // IMPORTANT: Check both property names for reaction times
      reactionTimes: data.reactionTimes ?? data.reactionTimesMs ?? [],
      ...data
    };
  };

  const extractNBackData = (result) => {
    const data = result.results || result;
    return {
      taskName: result.taskName || result.task,
      completedAt: result.recordedAt || result.timestamp,
      level: data.level ?? data.nBackLevel ?? 1,
      correctResponses: data.correctResponses ?? data.hits,
      totalTrials: data.totalTrials,
      accuracy: data.accuracy,
      meanRT: data.meanRT ?? data.averageRT ?? data.avgReactionTime ?? data.avgReactionTimeMs,
      rtSD: data.rtSD ?? data.reactionTimeSD ?? data.stdDev,
      dPrime: data.dPrime,
      hits: data.hits,
      misses: data.misses,
      falseAlarms: data.falseAlarms,
      correctRejections: data.correctRejections,
      // IMPORTANT: Check both property names for reaction times
      reactionTimes: data.reactionTimes ?? data.reactionTimesMs ?? [],
      ...data
    };
  };

  const extractFlankerData = (result) => {
    const data = result.results || result;
    return {
      taskName: result.taskName || result.task,
      completedAt: result.recordedAt || result.timestamp,
      congruentRT: data.congruentRT ?? data.congruentMeanRT,
      incongruentRT: data.incongruentRT ?? data.incongruentMeanRT,
      congruentAccuracy: data.congruentAccuracy,
      incongruentAccuracy: data.incongruentAccuracy,
      flankerEffect: data.flankerEffect ?? data.interferenceEffect,
      accuracy: data.accuracy ?? data.overallAccuracy,
      meanRT: data.meanRT ?? data.averageRT ?? data.avgReactionTime ?? data.avgReactionTimeMs,
      totalTrials: data.totalTrials,
      correctResponses: data.correctResponses,
      errors: data.errors,
      // IMPORTANT: Check both property names for reaction times
      reactionTimes: data.reactionTimes ?? data.reactionTimesMs ?? [],
      ...data
    };
  };

  const extractTrailData = (result) => {
    const data = result.results || result;
    return {
      taskName: result.taskName || result.task,
      completedAt: result.recordedAt || result.timestamp,
      partA_time: data.partA_time ?? data.trailATime ?? data.partATime,
      partB_time: data.partB_time ?? data.trailBTime ?? data.partBTime,
      partA_errors: data.partA_errors ?? data.trailAErrors ?? data.partAErrors,
      partB_errors: data.partB_errors ?? data.trailBErrors ?? data.partBErrors,
      bMinusA: data.bMinusA ?? ((data.partB_time ?? data.trailBTime ?? data.partBTime) - (data.partA_time ?? data.trailATime ?? data.partATime)),
      ...data
    };
  };

  const extractDSM5Data = (result) => {
    const data = result.results || result;
    return {
      taskName: result.taskName || result.task,
      completedAt: result.recordedAt || result.timestamp,
      inattentionScore: data.inattentionScore ?? data.inattention,
      hyperactivityScore: data.hyperactivityScore ?? data.hyperactivity,
      totalScore: data.totalScore,
      responses: data.responses ?? data.answers,
      ...data
    };
  };

  /**
   * Retry AI generation with existing data
   */
  const retryGeneration = async () => {
    setLoading(true);
    setError(null);
    await fetchAndGenerateReport();
  };

  /**
   * Generate PDF from AI report
   */
  const downloadPDF = async () => {
    if (!aiReport) return;
    
    try {
      setLoading(true);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      let yPos = 20;
      
      const colors = {
        background: [15, 15, 20],
        cardBg: [26, 26, 46],
        primary: [138, 43, 226],
        primaryLight: [168, 85, 247],
        text: [224, 224, 224],
        textMuted: [156, 163, 175],
        success: [34, 197, 94],
        warning: [251, 191, 36],
        error: [239, 68, 68],
        white: [255, 255, 255]
      };

      const addPageBackground = () => {
        pdf.setFillColor(...colors.background);
        pdf.rect(0, 0, pageWidth, 297, 'F');
      };

      addPageBackground();
      
      const checkNewPage = (height = 20) => {
        if (yPos + height > 275) {
          pdf.addPage();
          addPageBackground();
          yPos = 20;
        }
      };

      const addText = (text, size = 10, style = 'normal', color = colors.text) => {
        if (!text) return;
        pdf.setFontSize(size);
        pdf.setFont('helvetica', style);
        pdf.setTextColor(...color);
        const lines = pdf.splitTextToSize(String(text), contentWidth);
        checkNewPage(lines.length * size * 0.4 + 5);
        pdf.text(lines, margin, yPos);
        yPos += lines.length * size * 0.4 + 4;
      };
      
      const addSection = (title) => {
        yPos += 8;
        checkNewPage(15);
        pdf.setFillColor(...colors.primary);
        pdf.roundedRect(margin, yPos - 4, contentWidth, 10, 2, 2, 'F');
        pdf.setTextColor(...colors.white);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, margin + 4, yPos + 2);
        yPos += 14;
      };

      const metrics = aiReport.calculatedMetrics;
      const report = aiReport.report;
      
      // Header
      pdf.setFillColor(...colors.cardBg);
      pdf.rect(0, 0, pageWidth, 50, 'F');
      pdf.setFillColor(...colors.primary);
      pdf.rect(0, 47, pageWidth, 3, 'F');
      
      pdf.setTextColor(...colors.white);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(report?.title || 'ADHD Cognitive Assessment Report', margin, 20);
      
      pdf.setFontSize(10);
      pdf.setTextColor(...colors.primaryLight);
      pdf.text(`Patient: ${report?.patientName || 'Patient'}`, margin, 30);
      pdf.setTextColor(...colors.textMuted);
      pdf.text(`Generated: ${report?.assessmentDate || new Date().toLocaleDateString()} | AI Model: ${aiReport.modelUsed || 'Gemini'}`, margin, 40);
      
      yPos = 60;
      
      // ADHD Likelihood Score
      addSection('ADHD LIKELIHOOD SCORE (ALS)');
      const als = metrics?.compositeScores?.als;
      
      pdf.setFillColor(...colors.cardBg);
      pdf.roundedRect(margin, yPos - 2, contentWidth, 35, 3, 3, 'F');
      
      pdf.setTextColor(...colors.primaryLight);
      pdf.setFontSize(32);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${als?.value ?? 'N/A'}/100`, margin + 10, yPos + 15);
      
      pdf.setFontSize(12);
      pdf.setTextColor(...colors.white);
      const categoryDisplay = als?.category?.replace(/_/g, ' ') || 'Assessment Complete';
      pdf.text(categoryDisplay, margin + 60, yPos + 15);
      
      pdf.setFontSize(8);
      pdf.setTextColor(...colors.error);
      pdf.text('SCREENING RESULT - Clinical diagnosis required', margin + 10, yPos + 28);
      yPos += 42;
      
      // Executive Summary
      if (report?.executiveSummary) {
        addSection('EXECUTIVE SUMMARY');
        addText(report.executiveSummary, 10, 'normal', colors.text);
      }
      
      // Domain Scores
      if (metrics?.domainScores) {
        addSection('COGNITIVE DOMAIN SCORES');
        Object.entries(metrics.domainScores).forEach(([key, domain]) => {
          addText(`${domain.label || key}: ${domain.score}/100`, 10, 'bold', colors.primaryLight);
          addText(domain.description || '', 9, 'normal', colors.textMuted);
          
          const domainAnalysis = report?.domainAnalysis?.[key];
          if (domainAnalysis?.interpretation) {
            addText(domainAnalysis.interpretation, 9, 'normal', colors.text);
          }
          if (domainAnalysis?.realWorldImpact) {
            addText(`Daily Impact: ${domainAnalysis.realWorldImpact}`, 9, 'italic', colors.textMuted);
          }
          yPos += 3;
        });
      }
      
      // Flags
      if (report?.flagsAnalysis) {
        addSection('CLINICAL FLAGS & PATTERNS');
        addText(report.flagsAnalysis, 10, 'normal', colors.text);
      }
      
      // Strengths & Areas for Support
      addSection('STRENGTHS & AREAS FOR SUPPORT');
      if (report?.strengths?.length > 0) {
        addText('Strengths:', 10, 'bold', colors.success);
        report.strengths.forEach(s => addText(`• ${s}`, 9, 'normal', colors.text));
      }
      if (report?.areasForSupport?.length > 0) {
        yPos += 3;
        addText('Areas for Support:', 10, 'bold', colors.warning);
        report.areasForSupport.forEach(a => addText(`• ${a}`, 9, 'normal', colors.text));
      }
      
      // Recommendations
      if (report?.recommendations?.length > 0) {
        addSection('RECOMMENDATIONS');
        report.recommendations.forEach((rec, idx) => {
          let text;
          if (typeof rec === 'string') {
            text = rec;
          } else {
            const title = rec.title ? `${rec.title}: ` : (rec.category ? `[${rec.category}] ` : '');
            const desc = rec.description || rec.recommendation || '';
            text = `${title}${desc}`;
          }
          addText(`${idx + 1}. ${text}`, 9, 'normal', colors.text);
        });
      }
      
      // Clinical Notes
      if (report?.clinicalNotes) {
        addSection('CLINICAL NOTES');
        addText(report.clinicalNotes, 9, 'normal', colors.text);
      }
      
      // Disclaimer
      yPos += 5;
      checkNewPage(40);
      pdf.setFillColor(60, 45, 20);
      pdf.roundedRect(margin, yPos - 4, contentWidth, 30, 3, 3, 'F');
      pdf.setTextColor(...colors.warning);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text('IMPORTANT DISCLAIMER', margin + 4, yPos + 3);
      pdf.setFont('helvetica', 'normal');
      const disclaimer = report?.disclaimer || 'This is a SCREENING TOOL only. It does NOT constitute a clinical diagnosis. ADHD can only be formally diagnosed by qualified healthcare professionals. Please share this report with your healthcare provider.';
      const disclaimerLines = pdf.splitTextToSize(disclaimer, contentWidth - 8);
      pdf.text(disclaimerLines, margin + 4, yPos + 10);
      
      pdf.save(`ADHD-Assessment-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to download PDF.');
    } finally {
      setLoading(false);
    }
  };

  // Get score color based on value
  const getScoreColor = (score) => {
    if (score >= 85) return '#22c55e';  // Green - typical
    if (score >= 70) return '#eab308';  // Yellow - mild
    if (score >= 55) return '#f97316';  // Orange - moderate  
    if (score >= 40) return '#ef4444';  // Red - significant
    return '#dc2626';  // Dark red - severe
  };

  return (
    <div className="report-modal">
      <div className="report-content">
        <button className="close-btn" onClick={onClose}>×</button>
        
        {!aiReport ? (
          /* INTRO SCREEN */
          <div className="intro-screen">
            <div className="intro-icon"></div>
            <h1>ADHD Cognitive Assessment</h1>
            <p className="intro-subtitle">Complete AI-Powered Analysis</p>
            
            <div className="intro-description">
              <p>The AI will analyze your raw test data and calculate:</p>
              <ul>
                <li>ADHD Likelihood Score (ALS) using clinical formulas</li>
                <li>6 Cognitive Domain Scores</li>
                <li>Focus Consistency & Attention Lapse metrics</li>
                <li>Clinical flags and patterns</li>
                <li>Personalized interpretations & recommendations</li>
              </ul>
            </div>

            {validationInfo && (
              <div className="validation-info">
                <p>Tests completed: {validationInfo.completedTests.join(', ') || 'None'}</p>
                <p>Completion: {validationInfo.completionPercentage}%</p>
              </div>
            )}
            
            {error && <div className="error-msg">{error}</div>}
            
            <button 
              className="generate-btn"
              onClick={fetchAndGenerateReport}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing with AI...
                </>
              ) : (
                'Generate My Report'
              )}
            </button>
            
            <p className="intro-note">
              Best results with all 6 assessments completed (5 cognitive tasks + DSM-5).
            </p>
          </div>
        ) : (
          /* FULL AI REPORT - 3 SECTION STRUCTURE */
          <div className="report-body" ref={reportRef}>
            
            {/* Header */}
            <header className="report-header">
              <div className="header-top">
                <span className="report-badge">Cognitive Assessment Report</span>
                <span className="report-model">Engine: {aiReport.modelUsed}</span>
              </div>
              <h1>{aiReport.report?.title || 'ADHD Cognitive Assessment Report'}</h1>
              <p className="report-meta">
                {aiReport.report?.patientName} • {aiReport.report?.assessmentDate}
              </p>
            </header>

            {/* ═══════════════════════════════════════════════════════════════════════════
                SECTION 1: RESULTS
                All objective scores and measurements
            ═══════════════════════════════════════════════════════════════════════════ */}
            <section className="report-major-section results-section">
              <div className="section-header">
                <h2>Section 1: Assessment Results</h2>
                <p className="section-subtitle">Objective cognitive performance measurements</p>
              </div>

              {/* Primary Score: ALS */}
              <div className="als-card" style={{ borderColor: getScoreColor(aiReport.calculatedMetrics?.compositeScores?.als?.value) }}>
                <div className="als-score" style={{ color: getScoreColor(aiReport.calculatedMetrics?.compositeScores?.als?.value) }}>
                  {aiReport.calculatedMetrics?.compositeScores?.als?.value ?? '—'}
                  <span className="als-max">/100</span>
                </div>
                <div className="als-info">
                  <h3>ADHD Likelihood Score (ALS)</h3>
                  <span className="als-category" style={{ backgroundColor: getScoreColor(aiReport.calculatedMetrics?.compositeScores?.als?.value) }}>
                    {aiReport.calculatedMetrics?.compositeScores?.als?.category?.replace(/_/g, ' ') || 'Assessment Complete'}
                  </span>
                  <p className="als-interpretation">
                    {aiReport.calculatedMetrics?.compositeScores?.als?.interpretation}
                  </p>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="metrics-grid">
                {aiReport.calculatedMetrics?.compositeScores?.mcIndex && (
                  <div className="metric-card">
                    <div className="metric-value">{aiReport.calculatedMetrics.compositeScores.mcIndex.value}</div>
                    <div className="metric-label">Focus Consistency (MC Index)</div>
                    <p className="metric-interpretation">{aiReport.calculatedMetrics.compositeScores.mcIndex.interpretation}</p>
                  </div>
                )}
                {aiReport.calculatedMetrics?.compositeScores?.tau && (
                  <div className="metric-card">
                    <div className="metric-value">{aiReport.calculatedMetrics.compositeScores.tau.value}ms</div>
                    <div className="metric-label">Attention Lapses (Tau)</div>
                    <span className={`severity-badge ${aiReport.calculatedMetrics.compositeScores.tau.severity?.toLowerCase()}`}>
                      {aiReport.calculatedMetrics.compositeScores.tau.severity}
                    </span>
                  </div>
                )}
                {aiReport.calculatedMetrics?.compositeScores?.cpi && (
                  <div className="metric-card">
                    <div className="metric-value">{aiReport.calculatedMetrics.compositeScores.cpi.value}</div>
                    <div className="metric-label">Cognitive Processing Index</div>
                  </div>
                )}
              </div>

              {/* Domain Scores */}
              {aiReport.calculatedMetrics?.domainScores && (
                <div className="subsection">
                  <h3>🧩 Cognitive Domains</h3>
                  <div className="domains-grid">
                    {Object.entries(aiReport.calculatedMetrics.domainScores).map(([key, domain]) => (
                      <div className="domain-card" key={key}>
                        <div className="domain-header">
                          <span className="domain-name">{domain.label}</span>
                          <span className="domain-score" style={{ color: getScoreColor(domain.score) }}>
                            {domain.score}%
                          </span>
                        </div>
                        <div className="domain-bar">
                          <div 
                            className="domain-bar-fill" 
                            style={{ width: `${domain.score}%`, backgroundColor: getScoreColor(domain.score) }}
                          ></div>
                        </div>
                        <p className="domain-desc">{domain.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DSM-5 Self-Report */}
              {aiReport.calculatedMetrics?.dsm5Summary && (
                <div className="subsection">
                  <h3>📝 DSM-5 Self-Report Symptoms</h3>
                  <div className="dsm5-grid">
                    <div className="dsm5-card">
                      <span className="dsm5-label">Inattention</span>
                      <span className="dsm5-score">{aiReport.calculatedMetrics.dsm5Summary.inattentionScore}/36</span>
                      <span className={`dsm5-severity ${aiReport.calculatedMetrics.dsm5Summary.inattentionSeverity?.toLowerCase()}`}>
                        {aiReport.calculatedMetrics.dsm5Summary.inattentionSeverity}
                      </span>
                    </div>
                    <div className="dsm5-card">
                      <span className="dsm5-label">Hyperactivity/Impulsivity</span>
                      <span className="dsm5-score">{aiReport.calculatedMetrics.dsm5Summary.hyperactivityScore}/36</span>
                      <span className={`dsm5-severity ${aiReport.calculatedMetrics.dsm5Summary.hyperactivitySeverity?.toLowerCase()}`}>
                        {aiReport.calculatedMetrics.dsm5Summary.hyperactivitySeverity}
                      </span>
                    </div>
                    <div className="dsm5-type">
                      <span>Presentation Type: </span>
                      <strong>{aiReport.calculatedMetrics.dsm5Summary.presentation || 'Not Determined'}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Clinical Indicators (Objective Cognitive Metrics Only) */}
              {(aiReport.calculatedMetrics?.clinicalIndicators || aiReport.calculatedMetrics?.flags) && (
                <div className="subsection">
                  <h3>🧠 Objective Clinical Indicators</h3>
                  <p className="indicators-note"><em>Based entirely on cognitive task performance, not self-report.</em></p>
                  <div className="flags-grid compact">
                    {aiReport.calculatedMetrics?.clinicalIndicators ? (
                      // Use new Clinical Indicators object with source info
                      Object.entries(aiReport.calculatedMetrics.clinicalIndicators).map(([key, indicator]) => (
                        <div className={`flag-item ${indicator.detected ? 'detected' : 'clear'} ${indicator.severity || ''}`} key={key} title={indicator.source ? `Source: ${indicator.source}` : ''}>
                          <span className={`flag-indicator ${indicator.detected ? (indicator.severity === 'severe' ? 'severe' : indicator.severity === 'moderate' ? 'moderate' : 'detected') : 'clear'}`}></span>
                          <span className="flag-name">{indicator.label || key}</span>
                          {indicator.source && <span className="flag-source">({indicator.source})</span>}
                        </div>
                      ))
                    ) : (
                      // Fallback to old flags
                      Object.entries(aiReport.calculatedMetrics.flags).map(([key, flag]) => {
                        const isDetected = typeof flag === 'boolean' ? flag : flag?.detected;
                        return (
                          <div className={`flag-item ${isDetected ? 'detected' : 'clear'}`} key={key}>
                            <span className={`flag-indicator ${isDetected ? 'detected' : 'clear'}`}></span>
                            <span className="flag-name">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* Hidden Markers (MSSD + Fatigue Slope) */}
              {aiReport.report?.hiddenMarkers && (
                <div className="subsection hidden-markers-section">
                  <h3>🔬 Micro-Behavioral Analysis</h3>
                  <p className="hidden-markers-intro">
                    Advanced detection of compensated ADHD patterns through trial-by-trial reaction time analysis.
                  </p>
                  
                  {/* Show data unavailable message if no RT data */}
                  {!aiReport.report.hiddenMarkers.available ? (
                    <div className="hidden-marker-alert info">
                      <span className="alert-icon">ℹ️</span>
                      <span className="alert-text">
                        Reaction time data was insufficient for micro-behavioral analysis. 
                        This advanced analysis requires trial-by-trial reaction time data from CPT, Go/No-Go, N-Back, or Flanker tasks.
                        Complete more tasks to enable this analysis.
                      </span>
                    </div>
                  ) : (
                    <>
                      {/* Summary Alert for Compensated Pattern */}
                      {aiReport.report.hiddenMarkers.compensatedPattern ? (
                        <div className="hidden-marker-alert warning">
                          <span className="alert-icon">⚠️</span>
                          <span className="alert-text">{aiReport.report.hiddenMarkers.summary}</span>
                        </div>
                      ) : (
                        <div className="hidden-marker-alert success">
                          <span className="alert-icon">✅</span>
                          <span className="alert-text">
                            No hidden compensated ADHD pattern was detected. Your trial-by-trial performance was relatively consistent, 
                            suggesting you're not expending excessive cognitive effort to maintain accuracy.
                          </span>
                        </div>
                      )}
                      
                      <div className="hidden-markers-grid">
                        {/* MSSD Card */}
                        <div className={`hidden-marker-card mssd ${aiReport.report.hiddenMarkers.mssd?.avgStatus || 'normal'}`}>
                          <div className="marker-header">
                            <span className="marker-name">Trial-to-Trial Volatility (MSSD)</span>
                            <span className={`marker-status ${aiReport.report.hiddenMarkers.mssd?.avgStatus}`}>
                              {aiReport.report.hiddenMarkers.mssd?.avgStatus === 'high' ? '🔴 High' : 
                               aiReport.report.hiddenMarkers.mssd?.avgStatus === 'elevated' ? '🟡 Elevated' : '🟢 Normal'}
                            </span>
                          </div>
                          <div className="marker-value">{aiReport.report.hiddenMarkers.mssd?.avgValue || 0}</div>
                          <p className="marker-interpretation">{aiReport.report.hiddenMarkers.mssd?.interpretation}</p>
                          <p className="marker-explanation">
                            <small>MSSD measures how much your reaction times jump from one trial to the next. High volatility is a hidden ADHD marker often missed by standard tests.</small>
                          </p>
                        </div>
                        
                        {/* Fatigue Slope Card */}
                        <div className={`hidden-marker-card fatigue ${aiReport.report.hiddenMarkers.fatigueSlope?.hasSignificantDecline ? 'elevated' : 'normal'}`}>
                          <div className="marker-header">
                            <span className="marker-name">Cognitive Fatigue (RT Slope)</span>
                            <span className={`marker-status ${aiReport.report.hiddenMarkers.fatigueSlope?.hasSignificantDecline ? 'elevated' : 'normal'}`}>
                              {aiReport.report.hiddenMarkers.fatigueSlope?.hasSignificantDecline ? '🟡 Decline Detected' : '🟢 Stable'}
                            </span>
                          </div>
                          <div className="marker-value">{aiReport.report.hiddenMarkers.fatigueSlope?.avgValue || 0} ms/trial</div>
                          <p className="marker-interpretation">{aiReport.report.hiddenMarkers.fatigueSlope?.interpretation}</p>
                          <p className="marker-explanation">
                            <small>Fatigue slope measures how much your performance declines over time. Steeper decline suggests cognitive fatigue from sustained effort.</small>
                          </p>
                        </div>
                      </div>
                      
                      {/* Per-Task Breakdown */}
                      {aiReport.report.hiddenMarkers.tasks && aiReport.report.hiddenMarkers.tasks.length > 0 && (
                        <div className="hidden-markers-breakdown">
                          <h4>📊 Per-Task Analysis</h4>
                          <table className="hidden-markers-table">
                            <thead>
                              <tr>
                                <th>Task</th>
                                <th>MSSD Value</th>
                                <th>MSSD Status</th>
                                <th>Fatigue Slope</th>
                                <th>Fatigue Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {aiReport.report.hiddenMarkers.tasks.map((task, idx) => (
                                <tr key={idx}>
                                  <td><strong>{task.name}</strong></td>
                                  <td>{Math.round(task.mssd?.value) || '—'}</td>
                                  <td className={task.mssd?.status}>{task.mssd?.status || '—'}</td>
                                  <td>{task.fatigueSlope?.value?.toFixed(2) || '—'} ms/trial</td>
                                  <td className={task.fatigueSlope?.significance !== 'none' ? 'elevated' : 'normal'}>
                                    {task.fatigueSlope?.direction || 'stable'} ({task.fatigueSlope?.significance || 'none'})
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      
                      {/* Clinical Relevance */}
                      <div className="hidden-markers-clinical">
                        <h4>🏥 Clinical Relevance</h4>
                        <p className={`clinical-relevance-text ${aiReport.report.hiddenMarkers.compensatedPattern ? 'high' : 'low'}`}>
                          {aiReport.report.hiddenMarkers.compensatedPattern 
                            ? '⚠️ HIGH - These hidden markers strongly suggest compensated ADHD. Standard tests may show "normal" results while the individual is working 2-3x harder to achieve them. Recommend thorough clinical evaluation.'
                            : '✅ LOW - No hidden ADHD markers detected in this analysis. Micro-behavioral patterns are within normal ranges.'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Functional Biomarkers - Real Life Predictions */}
              {aiReport.report?.functionalBiomarkers && (
                <div className="subsection functional-biomarkers-section">
                  <h3>🎯 Real-Life Impact Predictions</h3>
                  <p className="biomarkers-intro">
                    These 4 functional biomarkers translate your cognitive data into specific daily life predictions.
                  </p>
                  
                  {/* Overall Summary */}
                  {aiReport.report.functionalBiomarkers.summary && (
                    <div className={`biomarkers-summary ${aiReport.report.functionalBiomarkers.summary.overallRisk?.toLowerCase().replace(/\s+/g, '-')}`}>
                      <span className="summary-badge" style={{backgroundColor: aiReport.report.functionalBiomarkers.summary.overallColor}}>
                        {aiReport.report.functionalBiomarkers.summary.concernCount}/4 Biomarkers Elevated
                      </span>
                      <span className="summary-risk">{aiReport.report.functionalBiomarkers.summary.overallRisk}</span>
                    </div>
                  )}
                  
                  {/* Biomarker Cards */}
                  <div className="biomarkers-grid">
                    {/* IES Card */}
                    {aiReport.report.functionalBiomarkers.ies?.available && (
                      <div className={`biomarker-card ${aiReport.report.functionalBiomarkers.ies.rating?.toLowerCase()}`}>
                        <div className="biomarker-header">
                          <span className="biomarker-icon">🔋</span>
                          <span className="biomarker-name">Efficiency Tax (IES)</span>
                        </div>
                        <div className="biomarker-value" style={{color: aiReport.report.functionalBiomarkers.ies.color}}>
                          {aiReport.report.functionalBiomarkers.ies.score}
                        </div>
                        <div className={`biomarker-rating ${aiReport.report.functionalBiomarkers.ies.rating?.toLowerCase()}`}>
                          {aiReport.report.functionalBiomarkers.ies.rating}
                        </div>
                        <p className="biomarker-interpretation">{aiReport.report.functionalBiomarkers.ies.interpretation}</p>
                      </div>
                    )}
                    
                    {/* MSSD Card */}
                    {aiReport.report.functionalBiomarkers.mssd?.available && (
                      <div className={`biomarker-card ${aiReport.report.functionalBiomarkers.mssd.rating?.toLowerCase()}`}>
                        <div className="biomarker-header">
                          <span className="biomarker-icon">🗣️</span>
                          <span className="biomarker-name">Micro-Lapse Index</span>
                        </div>
                        <div className="biomarker-value" style={{color: aiReport.report.functionalBiomarkers.mssd.color}}>
                          {aiReport.report.functionalBiomarkers.mssd.score}ms
                        </div>
                        <div className={`biomarker-rating ${aiReport.report.functionalBiomarkers.mssd.rating?.toLowerCase()}`}>
                          {aiReport.report.functionalBiomarkers.mssd.rating}
                        </div>
                        <p className="biomarker-interpretation">{aiReport.report.functionalBiomarkers.mssd.interpretation}</p>
                      </div>
                    )}
                    
                    {/* Fatigue Card */}
                    {aiReport.report.functionalBiomarkers.fatigue?.available && (
                      <div className={`biomarker-card ${aiReport.report.functionalBiomarkers.fatigue.rating?.toLowerCase().replace(/\s+/g, '-')}`}>
                        <div className="biomarker-header">
                          <span className="biomarker-icon">📉</span>
                          <span className="biomarker-name">Fatigue Slope</span>
                        </div>
                        <div className="biomarker-value" style={{color: aiReport.report.functionalBiomarkers.fatigue.color}}>
                          {aiReport.report.functionalBiomarkers.fatigue.score > 0 ? '+' : ''}{aiReport.report.functionalBiomarkers.fatigue.score}
                        </div>
                        <div className={`biomarker-rating ${aiReport.report.functionalBiomarkers.fatigue.rating?.toLowerCase().replace(/\s+/g, '-')}`}>
                          {aiReport.report.functionalBiomarkers.fatigue.rating}
                        </div>
                        <p className="biomarker-interpretation">{aiReport.report.functionalBiomarkers.fatigue.interpretation}</p>
                      </div>
                    )}
                    
                    {/* Switching Card */}
                    {aiReport.report.functionalBiomarkers.switching?.available && (
                      <div className={`biomarker-card ${aiReport.report.functionalBiomarkers.switching.rating?.toLowerCase()}`}>
                        <div className="biomarker-header">
                          <span className="biomarker-icon">{aiReport.report.functionalBiomarkers.switching.rating === 'Efficient' ? '🚑' : '🛑'}</span>
                          <span className="biomarker-name">Switching Cost</span>
                        </div>
                        <div className="biomarker-value" style={{color: aiReport.report.functionalBiomarkers.switching.color}}>
                          {aiReport.report.functionalBiomarkers.switching.ratio}x
                        </div>
                        <div className={`biomarker-rating ${aiReport.report.functionalBiomarkers.switching.rating?.toLowerCase()}`}>
                          {aiReport.report.functionalBiomarkers.switching.rating}
                        </div>
                        <p className="biomarker-interpretation">{aiReport.report.functionalBiomarkers.switching.interpretation}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Life Predictions */}
                  {aiReport.report?.lifePredictions && aiReport.report.lifePredictions.length > 0 && (
                    <div className="life-predictions">
                      <h4>📋 What This Means For Your Daily Life</h4>
                      <div className="predictions-grid">
                        {aiReport.report.lifePredictions.map((prediction, idx) => (
                          <div className={`prediction-card ${prediction.isStrength ? 'strength' : 'concern'} ${prediction.severity?.toLowerCase()}`} key={idx}>
                            <div className="prediction-header">
                              <span className="prediction-icon">{prediction.icon}</span>
                              <div className="prediction-titles">
                                <span className="prediction-name">{prediction.prediction}</span>
                                <span className="prediction-metric">{prediction.metric}: {prediction.value}{prediction.unit ? ` ${prediction.unit}` : ''}</span>
                              </div>
                            </div>
                            <h5 className="prediction-headline">{prediction.headline}</h5>
                            <p className="prediction-explanation">{prediction.explanation}</p>
                            
                            {prediction.dailyLifeExamples && (
                              <div className="prediction-examples">
                                <strong>How this shows up:</strong>
                                <ul>
                                  {prediction.dailyLifeExamples.map((example, i) => (
                                    <li key={i}>{example}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {prediction.strategies && (
                              <div className="prediction-strategies">
                                <strong>Strategies:</strong>
                                <ul>
                                  {prediction.strategies.slice(0, 3).map((strategy, i) => (
                                    <li key={i}>{strategy}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* ═══════════════════════════════════════════════════════════════════════════
                SECTION 2: CANDIDATE ANALYSIS & SUGGESTIONS
                Patient-friendly explanations, real-life impact, recommendations
            ═══════════════════════════════════════════════════════════════════════════ */}
            <section className="report-major-section analysis-section">
              <div className="section-header">
                <h2>Section 2: Your Cognitive Profile & Recommendations</h2>
                <p className="section-subtitle">Understanding what the results mean for you</p>
              </div>

              {/* Executive Summary */}
              {aiReport.report?.executiveSummary && (
                <div className="subsection summary-box">
                  <h3>Summary</h3>
                  {typeof aiReport.report.executiveSummary === 'string' ? (
                    <p>{aiReport.report.executiveSummary}</p>
                  ) : (
                    <div className="executive-summary-content">
                      <p><strong>Primary Finding:</strong> {aiReport.report.executiveSummary.primaryFinding}</p>
                      <p><strong>Subtype:</strong> {aiReport.report.executiveSummary.subtype}</p>
                      {aiReport.report.executiveSummary.keyStrengths && (
                        <p><strong>Key Strengths:</strong> {aiReport.report.executiveSummary.keyStrengths.join(', ')}</p>
                      )}
                      {aiReport.report.executiveSummary.keyConcerns && (
                        <p><strong>Key Concerns:</strong> {aiReport.report.executiveSummary.keyConcerns.join(', ')}</p>
                      )}
                      {aiReport.report.executiveSummary.clinicalNotes && (
                        <p><strong>Clinical Notes:</strong> {aiReport.report.executiveSummary.clinicalNotes}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Compensation Pattern Alert */}
              {aiReport.calculatedMetrics?.compensationAnalysis?.detected && (
                <div className="subsection compensation-alert">
                  <h3>Compensation Pattern Detected</h3>
                  <div className="compensation-card">
                    <div className="compensation-header">
                      <span className="compensation-icon"></span>
                      <span className="compensation-title">Your Brain is Working Overtime</span>
                    </div>
                    <div className="compensation-stats">
                      <div className="comp-stat">
                        <span className="comp-label">Accuracy</span>
                        <span className="comp-value">{aiReport.calculatedMetrics.compensationAnalysis.accuracyLevel}</span>
                      </div>
                      <div className="comp-stat">
                        <span className="comp-label">Reaction Time</span>
                        <span className="comp-value warning">{aiReport.calculatedMetrics.compensationAnalysis.reactionTimeMs}ms</span>
                      </div>
                      <div className="comp-stat">
                        <span className="comp-label">Variability</span>
                        <span className="comp-value warning">{aiReport.calculatedMetrics.compensationAnalysis.variabilityIndicator}</span>
                      </div>
                    </div>
                    <p className="compensation-interpretation">{aiReport.calculatedMetrics.compensationAnalysis.interpretation}</p>
                  </div>
                </div>
              )}

              {/* Strengths & Areas for Support */}
              <div className="subsection">
                <h3>Strengths & Areas for Support</h3>
                <div className="balance-grid">
                  <div className="balance-card strengths">
                    <h4>Your Strengths</h4>
                    <ul>
                      {(aiReport.report?.strengths || []).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="balance-card challenges">
                    <h4>Areas for Support</h4>
                    <ul>
                      {(aiReport.report?.areasForSupport || aiReport.report?.areasOfConcern || []).map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Patient Results - COMPREHENSIVE DETAILED SECTIONS */}
              {aiReport.report?.patientResults && aiReport.report.patientResults.length > 0 && (
                <div className="subsection patient-results-content">
                  {aiReport.report.patientResults.map((section, idx) => (
                    <div className="patient-result-subsection" key={idx}>
                      <h3>{section.title}</h3>
                      
                      {/* DOMAIN BREAKDOWN - Detailed explanations for each cognitive domain */}
                      {section.type === 'domain_breakdown' && section.content?.domains && (
                        <div className="domain-breakdown-container">
                          {section.content.domains.map((domain, i) => (
                            <div className={`domain-detail-card ${domain.isConcern ? 'concern' : ''} ${domain.isStrength ? 'strength' : ''}`} key={i}>
                              <div className="domain-detail-header">
                                <span className="domain-detail-name">{domain.name}</span>
                                <span className={`domain-detail-score ${domain.isConcern ? 'low' : 'normal'}`}>{domain.score}/100</span>
                              </div>
                              
                              <p className="domain-simple">{domain.simple}</p>
                              <p className="domain-detailed">{domain.detailed}</p>
                              
                              <div className="domain-what-it-means">
                                <strong>What this means for you:</strong>
                                <p>{domain.whatItMeans}</p>
                              </div>
                              
                              {domain.everydayImpact && domain.everydayImpact.length > 0 && (
                                <div className="domain-impact">
                                  <strong>How this shows up in daily life:</strong>
                                  <ul>
                                    {domain.everydayImpact.map((impact, j) => (
                                      <li key={j}>{impact}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {domain.workImpact && domain.workImpact.length > 0 && (
                                <div className="domain-work-impact">
                                  <strong>At work or school:</strong>
                                  <ul>
                                    {domain.workImpact.map((impact, j) => (
                                      <li key={j}>{impact}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {domain.strategies && domain.strategies.length > 0 && (
                                <div className="domain-strategies">
                                  <strong>Strategies that help:</strong>
                                  {domain.strategies.map((strat, j) => (
                                    <div className="strategy-item" key={j}>
                                      <span className="strategy-method">{strat.method}:</span>
                                      <span className="strategy-desc">{strat.description}</span>
                                      {strat.why && <span className="strategy-why">({strat.why})</span>}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* COGNITIVE INTERACTIONS - How traits work together */}
                      {section.type === 'cognitive_interactions' && section.content?.interactions && (
                        <div className="interactions-grid">
                          {section.content.interactions.map((inter, i) => (
                            <div className="interaction-card" key={i}>
                              <div className="interaction-header">
                                <span className="interaction-traits">{inter.traits.join(' + ')}</span>
                                <span className="interaction-problem">{inter.problem}</span>
                              </div>
                              <div className="interaction-body">
                                <p className="interaction-explanation"><strong>What happens:</strong> {inter.explanation}</p>
                                <p className="interaction-example"><strong>Real-life example:</strong> {inter.realWorldExample}</p>
                                <p className="interaction-tip"><strong>Solution:</strong> {inter.tip}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* REAL-LIFE SCENARIOS - Detailed workplace/education/personal life */}
                      {section.type === 'real_life_scenarios' && section.content?.scenarios && (
                        <div className="scenarios-container">
                          {section.content.scenarios.map((scenario, i) => (
                            <div className="scenario-section" key={i}>
                              <h4 className="scenario-context">{scenario.context}</h4>
                              <div className="situations-grid">
                                {scenario.situations.map((sit, j) => (
                                  <div className="situation-card" key={j}>
                                    <div className="situation-header">
                                      <span className="situation-icon">{sit.icon}</span>
                                      <h5>{sit.situation}</h5>
                                    </div>
                                    <div className="situation-body">
                                      <div className="situation-block what-happens">
                                        <strong>What happens:</strong>
                                        <p>{sit.whatHappens}</p>
                                      </div>
                                      <div className="situation-block why">
                                        <strong>Why it happens:</strong>
                                        <p>{sit.whyItHappens}</p>
                                      </div>
                                      <div className="situation-block solutions">
                                        <strong>💡 Solutions:</strong>
                                        <ul>
                                          {sit.solutions.map((sol, k) => (
                                            <li key={k}>{sol}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* STRENGTHS & CHALLENGES */}
                      {section.type === 'strengths_challenges' && section.content && (
                        <div className="strengths-challenges-container">
                          {section.content.strengths && section.content.strengths.length > 0 && (
                            <div className="strengths-section">
                              <h4>Your Cognitive Strengths</h4>
                              {section.content.strengths.map((s, i) => (
                                <div className="strength-card" key={i}>
                                  <div className="strength-header">
                                    <span className="strength-area">{s.area}</span>
                                    {s.score && <span className="strength-score">{s.score}/100</span>}
                                  </div>
                                  <p className="strength-meaning">{s.whatItMeans}</p>
                                  <p className="strength-leverage"><strong>How to use this:</strong> {s.howToLeverage}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {section.content.challenges && section.content.challenges.length > 0 && (
                            <div className="challenges-section">
                              <h4>Areas That Need Support</h4>
                              {section.content.challenges.map((c, i) => (
                                <div className={`challenge-card ${c.severity}`} key={i}>
                                  <div className="challenge-header">
                                    <span className="challenge-area">{c.area}</span>
                                    {c.score && <span className="challenge-score">{c.score}/100</span>}
                                    <span className={`challenge-severity ${c.severity}`}>{c.severity}</span>
                                  </div>
                                  <p className="challenge-meaning">{c.whatItMeans}</p>
                                  {c.supportStrategies && (
                                    <div className="challenge-strategies">
                                      <strong>Support strategies:</strong>
                                      <ul>
                                        {c.supportStrategies.map((strat, j) => (
                                          <li key={j}>{strat}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* PERSONALIZED STRATEGIES */}
                      {section.type === 'personalized_strategies' && section.content?.strategies && (
                        <div className="personalized-strategies-container">
                          {section.content.strategies.map((strat, i) => (
                            <div className={`strategy-card priority-${strat.priority.toLowerCase()}`} key={i}>
                              <div className="strategy-header">
                                <span className={`priority-badge ${strat.priority.toLowerCase()}`}>{strat.priority} PRIORITY</span>
                                <h4>{strat.targetArea}</h4>
                              </div>
                              <p className="strategy-why"><strong>Why this matters:</strong> {strat.why}</p>
                              <div className="strategy-actions">
                                <strong>Action steps:</strong>
                                <ul>
                                  {strat.strategies.map((s, j) => (
                                    <li key={j}>{s}</li>
                                  ))}
                                </ul>
                              </div>
                              {strat.tools && (
                                <div className="strategy-tools">
                                  <strong>Recommended tools:</strong>
                                  <div className="tools-list">
                                    {strat.tools.map((tool, j) => (
                                      <span className="tool-tag" key={j}>{tool}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Legacy support for old section types */}
                      {section.type === 'capacity_analysis' && section.content && Array.isArray(section.content) && (
                        <div className="capacity-analysis">
                          {section.content.map((analysis, i) => (
                            <div className="capacity-card" key={i}>
                              <h4>{analysis.title}</h4>
                              {analysis.framework && (
                                <div className="framework-items">
                                  {Object.entries(analysis.framework).map(([key, item]) => (
                                    <div className="framework-item" key={key}>
                                      <strong>{item.score}/100 - {key}</strong>
                                      <p><strong>Capacity:</strong> {item.capacity}</p>
                                      <p><strong>Implication:</strong> {item.implication}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {section.type === 'problem_solving' && section.content?.solutions && (
                        <div className="problem-solutions">
                          {section.content.solutions.map((ps, i) => (
                            <div className="problem-card" key={i}>
                              <h4>{ps.problem}</h4>
                              <p>{ps.technicalExplanation}</p>
                              <div className="solutions-list">
                                {ps.solutions && ps.solutions.map((sol, j) => (
                                  <div className="solution-item" key={j}>
                                    <strong>{sol.method}:</strong> {sol.description}
                                    {sol.tools && <em> (Tools: {sol.tools})</em>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Recommendations */}
              {aiReport.report?.recommendations?.length > 0 && (
                <div className="subsection">
                  <h3>💡 Personalized Recommendations</h3>
                  <div className="recommendations-list">
                    {aiReport.report.recommendations.map((rec, idx) => (
                      <div className="recommendation-item" key={idx}>
                        <span className="rec-number">{idx + 1}</span>
                        <div className="rec-content">
                          {typeof rec === 'string' ? (
                            <p>{rec}</p>
                          ) : (
                            <>
                              {rec.category && <span className="rec-category">{rec.category}</span>}
                              {rec.title && <div className="rec-title"><strong>{rec.title}</strong></div>}
                              <p>{rec.description || rec.recommendation}</p>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* ═══════════════════════════════════════════════════════════════════════════
                SECTION 3: NEURAL ANALYSIS & CLINICAL NOTES (For Doctors)
                Comprehensive clinical analysis with no room for doubt
            ═══════════════════════════════════════════════════════════════════════════ */}
            <section className="report-major-section clinical-section">
              <div className="section-header">
                <h2>Section 3: Clinical Neurological Analysis</h2>
                <p className="section-subtitle">For Healthcare Professionals - Comprehensive Clinical Decision Support</p>
              </div>

              <div className="clinical-disclaimer-box">
                <strong>Healthcare Professional Use Only:</strong> This analysis is based on cognitive performance data and algorithmic pattern matching. Use as clinical decision support only. Not a substitute for clinical neurological evaluation.
              </div>

              {aiReport.report?.clinicalAnalysis && Object.keys(aiReport.report.clinicalAnalysis).length > 0 ? (
                <div className="clinical-analysis-content">
                  
                  {/* NEW: Clinical Summary - Quick Reference */}
                  {aiReport.report.clinicalAnalysis.clinicalSummary && (
                    <div className="clinical-subsection clinical-summary-box">
                      <h3>Clinical Summary (Quick Reference)</h3>
                      <div className="summary-grid">
                        <div className="summary-item">
                          <span className="summary-label">ALS Score:</span>
                          <span className="summary-value">{aiReport.report.clinicalAnalysis.clinicalSummary.alsScore}/100</span>
                        </div>
                        <div className="summary-item">
                          <span className="summary-label">Category:</span>
                          <span className="summary-value">{aiReport.report.clinicalAnalysis.clinicalSummary.alsCategory}</span>
                        </div>
                        <div className="summary-item">
                          <span className="summary-label">Presentation:</span>
                          <span className="summary-value">{aiReport.report.clinicalAnalysis.clinicalSummary.presentation}</span>
                        </div>
                        <div className="summary-item">
                          <span className="summary-label">Confidence:</span>
                          <span className="summary-value">{aiReport.report.clinicalAnalysis.clinicalSummary.confidenceLevel}</span>
                        </div>
                      </div>
                      
                      {aiReport.report.clinicalAnalysis.clinicalSummary.keyFindings?.length > 0 && (
                        <div className="key-findings">
                          <h4>Key Findings:</h4>
                          <ul>
                            {aiReport.report.clinicalAnalysis.clinicalSummary.keyFindings.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {aiReport.report.clinicalAnalysis.clinicalSummary.redFlags?.length > 0 && (
                        <div className="red-flags">
                          <h4>Red Flags:</h4>
                          <ul>
                            {aiReport.report.clinicalAnalysis.clinicalSummary.redFlags.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* NEW: Clinical Flag Analysis with DSM-5 Mapping */}
                  {aiReport.report.clinicalAnalysis.clinicalFlagAnalysis?.length > 0 && (
                    <div className="clinical-subsection">
                      <h3>Clinical Indicator Analysis (DSM-5 Mapped)</h3>
                      <div className="flag-analysis-container">
                        {aiReport.report.clinicalAnalysis.clinicalFlagAnalysis.map((flag, i) => (
                          <div className={`clinical-flag-card ${flag.status === 'INTACT_IN_ISOLATION' || flag.status === 'NOT_DETECTED' ? 'intact' : flag.status === 'BORDERLINE' ? 'borderline' : ''}`} key={i}>
                            <div className="flag-card-header">
                              <span className="flag-name">{flag.flag}</span>
                              <span className={`flag-status ${flag.status === 'INTACT_IN_ISOLATION' || flag.status === 'NOT_DETECTED' ? 'flag-intact' : flag.status === 'BORDERLINE' ? 'flag-borderline' : 'flag-detected'}`}>
                                {flag.statusLabel || (flag.status === 'INTACT_IN_ISOLATION' ? 'HIGH TASK PERFORMANCE' : flag.status === 'NOT_DETECTED' ? 'NOT DETECTED' : flag.status === 'BORDERLINE' ? 'BORDERLINE' : 'DETECTED')}
                              </span>
                            </div>
                            <div className="flag-card-body">
                              <p><strong>Clinical Meaning:</strong> {flag.clinicalMeaning}</p>
                              {flag.dsm5Mapping && <p><strong>DSM-5:</strong> {flag.dsm5Mapping}</p>}
                              <p><strong>Neurobiological Basis:</strong> {flag.neurobiological}</p>
                              
                              {flag.supportingEvidence?.length > 0 && (
                                <div className="supporting-evidence">
                                  <strong>Supporting Evidence:</strong>
                                  <ul>
                                    {flag.supportingEvidence.map((e, j) => (
                                      <li key={j}>{e}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {flag.clinicalSignificance && (
                                <p className="clinical-significance"><strong>Clinical Significance:</strong> {flag.clinicalSignificance}</p>
                              )}
                              
                              <p className="treatment-implication"><strong>Treatment Implication:</strong> {flag.treatmentImplication}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* NEW: Score Interpretation Guide */}
                  {aiReport.report.clinicalAnalysis.scoreInterpretation && (
                    <div className="clinical-subsection">
                      <h3>Score Interpretation Guide</h3>
                      <div className="score-interpretation-grid">
                        {aiReport.report.clinicalAnalysis.scoreInterpretation.als && (
                          <div className="score-card">
                            <h4>ALS (ADHD Likelihood Score): {aiReport.report.clinicalAnalysis.scoreInterpretation.als.score}/100</h4>
                            <p><strong>Interpretation:</strong> {aiReport.report.clinicalAnalysis.scoreInterpretation.als.interpretation?.interpretation || 'N/A'}</p>
                            <p><strong>Clinical Action:</strong> {aiReport.report.clinicalAnalysis.scoreInterpretation.als.interpretation?.clinicalAction || 'N/A'}</p>
                            <p className="score-limitation"><em>Limitation: {aiReport.report.clinicalAnalysis.scoreInterpretation.als.limitations}</em></p>
                          </div>
                        )}
                        
                        {aiReport.report.clinicalAnalysis.scoreInterpretation.tau && (
                          <div className="score-card">
                            <h4>Tau (Attention Lapses): {aiReport.report.clinicalAnalysis.scoreInterpretation.tau.score}ms</h4>
                            <p><strong>Meaning:</strong> {aiReport.report.clinicalAnalysis.scoreInterpretation.tau.interpretation?.meaning || 'N/A'}</p>
                            <p><strong>Clinical Significance:</strong> {aiReport.report.clinicalAnalysis.scoreInterpretation.tau.clinicalSignificance}</p>
                          </div>
                        )}
                        
                        {aiReport.report.clinicalAnalysis.scoreInterpretation.mcIndex && (
                          <div className="score-card">
                            <h4>MC Index (Focus Consistency): {aiReport.report.clinicalAnalysis.scoreInterpretation.mcIndex.score}/100</h4>
                            <p><strong>Meaning:</strong> {aiReport.report.clinicalAnalysis.scoreInterpretation.mcIndex.interpretation?.meaning || 'N/A'}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Brain Region Analysis */}
                  {aiReport.report.clinicalAnalysis.brainRegionAnalysis && (
                    <div className="clinical-subsection">
                      <h3>🧠 Brain Region Involvement</h3>
                      <p><em>{aiReport.report.clinicalAnalysis.brainRegionAnalysis.summary}</em></p>
                      {aiReport.report.clinicalAnalysis.brainRegionAnalysis.regions && (
                        <div className="brain-regions-grid">
                          {aiReport.report.clinicalAnalysis.brainRegionAnalysis.regions.map((region, i) => (
                            <div className={`brain-region-card ${region.status.toLowerCase().includes('implicated') || region.status.toLowerCase().includes('dysregulated') ? 'implicated' : 'adequate'}`} key={i}>
                              <h4>{region.name}</h4>
                              <span className={`status-badge ${region.status.toLowerCase().replace(/ /g, '-')}`}>
                                {region.status}
                              </span>
                              {region.finding && <p><small>{region.finding}</small></p>}
                            </div>
                          ))}
                        </div>
                      )}
                      {aiReport.report.clinicalAnalysis.brainRegionAnalysis.detailedInterpretation && (
                        <div className="brain-interpretation">
                          <h4>Detailed Interpretation:</h4>
                          <p>{aiReport.report.clinicalAnalysis.brainRegionAnalysis.detailedInterpretation}</p>
                        </div>
                      )}
                      {aiReport.report.clinicalAnalysis.brainRegionAnalysis.clinicalImplication && (
                        <div className="clinical-implication-box">
                          <strong>Clinical Implication:</strong>
                          <p>{aiReport.report.clinicalAnalysis.brainRegionAnalysis.clinicalImplication}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Neurochemical Analysis */}
                  {aiReport.report.clinicalAnalysis.neurochemicalAnalysis && (
                    <div className="clinical-subsection">
                      <h3>⚗️ Neurochemical Pathway Analysis</h3>
                      <p><em>{aiReport.report.clinicalAnalysis.neurochemicalAnalysis.summary}</em></p>
                      <div className="neurochemical-cards">
                        {aiReport.report.clinicalAnalysis.neurochemicalAnalysis.dopamine && (
                          <div className={`neuro-card ${aiReport.report.clinicalAnalysis.neurochemicalAnalysis.dopamine.status?.includes('dysregulated') ? 'dysregulated' : ''}`}>
                            <h4>Dopamine System</h4>
                            <p><strong>Status:</strong> <span className="status-text">{aiReport.report.clinicalAnalysis.neurochemicalAnalysis.dopamine.status}</span></p>
                            <p><strong>Implication:</strong> {aiReport.report.clinicalAnalysis.neurochemicalAnalysis.dopamine.implication}</p>
                            {aiReport.report.clinicalAnalysis.neurochemicalAnalysis.dopamine.details && (
                              <p className="neuro-details">{aiReport.report.clinicalAnalysis.neurochemicalAnalysis.dopamine.details}</p>
                            )}
                            {aiReport.report.clinicalAnalysis.neurochemicalAnalysis.dopamine.treatmentImplication && (
                              <p className="treatment-note"><strong>Treatment:</strong> {aiReport.report.clinicalAnalysis.neurochemicalAnalysis.dopamine.treatmentImplication}</p>
                            )}
                          </div>
                        )}
                        {aiReport.report.clinicalAnalysis.neurochemicalAnalysis.norepinephrine && (
                          <div className={`neuro-card ${aiReport.report.clinicalAnalysis.neurochemicalAnalysis.norepinephrine.status?.includes('dysregulated') ? 'dysregulated' : ''}`}>
                            <h4>Norepinephrine System</h4>
                            <p><strong>Status:</strong> <span className="status-text">{aiReport.report.clinicalAnalysis.neurochemicalAnalysis.norepinephrine.status}</span></p>
                            <p><strong>Implication:</strong> {aiReport.report.clinicalAnalysis.neurochemicalAnalysis.norepinephrine.implication}</p>
                            {aiReport.report.clinicalAnalysis.neurochemicalAnalysis.norepinephrine.treatmentImplication && (
                              <p className="treatment-note"><strong>Treatment:</strong> {aiReport.report.clinicalAnalysis.neurochemicalAnalysis.norepinephrine.treatmentImplication}</p>
                            )}
                          </div>
                        )}
                        {aiReport.report.clinicalAnalysis.neurochemicalAnalysis.acetylcholine && (
                          <div className={`neuro-card ${aiReport.report.clinicalAnalysis.neurochemicalAnalysis.acetylcholine.status?.includes('suboptimal') ? 'suboptimal' : ''}`}>
                            <h4>Acetylcholine System</h4>
                            <p><strong>Status:</strong> <span className="status-text">{aiReport.report.clinicalAnalysis.neurochemicalAnalysis.acetylcholine.status}</span></p>
                            <p><strong>Implication:</strong> {aiReport.report.clinicalAnalysis.neurochemicalAnalysis.acetylcholine.implication}</p>
                            {aiReport.report.clinicalAnalysis.neurochemicalAnalysis.acetylcholine.treatmentImplication && (
                              <p className="treatment-note"><strong>Treatment:</strong> {aiReport.report.clinicalAnalysis.neurochemicalAnalysis.acetylcholine.treatmentImplication}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Compensation Mechanism Analysis */}
                  {aiReport.report.clinicalAnalysis.compensationMechanisms && aiReport.report.clinicalAnalysis.compensationMechanisms.detected && (
                    <div className="clinical-subsection compensation-alert-clinical">
                      <h3>⚡ Compensation Pattern Analysis (CRITICAL)</h3>
                      <div className="compensation-clinical-box">
                        <p><strong>Status:</strong> {aiReport.report.clinicalAnalysis.compensationMechanisms.status}</p>
                        <p><strong>Details:</strong> {aiReport.report.clinicalAnalysis.compensationMechanisms.details}</p>
                        <p><strong>Burnout Risk:</strong> <span className={`risk-level ${aiReport.report.clinicalAnalysis.compensationMechanisms.burnoutRisk?.toLowerCase()}`}>{aiReport.report.clinicalAnalysis.compensationMechanisms.burnoutRisk}</span></p>
                        {aiReport.report.clinicalAnalysis.compensationMechanisms.clinicalImportance && (
                          <div className="clinical-importance-box">
                            <strong>⚠️ Clinical Importance:</strong>
                            <p>{aiReport.report.clinicalAnalysis.compensationMechanisms.clinicalImportance}</p>
                          </div>
                        )}
                        {aiReport.report.clinicalAnalysis.compensationMechanisms.managementRecommendation && (
                          <div className="management-rec">
                            <strong>Management Recommendation:</strong>
                            <p>{aiReport.report.clinicalAnalysis.compensationMechanisms.managementRecommendation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Medication Considerations - Enhanced */}
                  {aiReport.report.clinicalAnalysis.medicationConsiderations && (
                    <div className="clinical-subsection">
                      <h3>💊 Typical Pharmacological Interventions (Educational)</h3>
                      <p className="disclaimer-text"><strong>⚠️ Disclaimer:</strong> {aiReport.report.clinicalAnalysis.medicationConsiderations.disclaimer}</p>
                      
                      {(aiReport.report.clinicalAnalysis.medicationConsiderations.typicalIntervention || aiReport.report.clinicalAnalysis.medicationConsiderations.recommendation) && (
                        <div className="recommendation-box">
                          <h4>Commonly Discussed Intervention:</h4>
                          <p>{aiReport.report.clinicalAnalysis.medicationConsiderations.typicalIntervention || aiReport.report.clinicalAnalysis.medicationConsiderations.recommendation}</p>
                        </div>
                      )}
                      
                      {/* Intervention Options */}
                      {(aiReport.report.clinicalAnalysis.medicationConsiderations.interventionOptions || aiReport.report.clinicalAnalysis.medicationConsiderations.firstLineOptions)?.length > 0 && (
                        <div className="medication-options">
                          <h4>Standard Treatment Approaches (Per Clinical Literature):</h4>
                          {(aiReport.report.clinicalAnalysis.medicationConsiderations.interventionOptions || aiReport.report.clinicalAnalysis.medicationConsiderations.firstLineOptions).map((med, i) => (
                            <div className="medication-card" key={i}>
                              <h5>{med.medication}</h5>
                              <p><strong>Rationale:</strong> {med.rationale}</p>
                              {med.typicalApproach && <p><strong>Typical Approach:</strong> {med.typicalApproach}</p>}
                              {med.startingDose && <p><strong>Starting Dose:</strong> {med.startingDose}</p>}
                              {med.monitoring && <p><strong>Monitoring:</strong> {med.monitoring}</p>}
                              {med.when && <p><strong>When Considered:</strong> {med.when}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Second-line Options */}
                      {aiReport.report.clinicalAnalysis.medicationConsiderations.secondLineOptions?.length > 0 && (
                        <div className="medication-options secondary">
                          <h4>Second-Line Options:</h4>
                          {aiReport.report.clinicalAnalysis.medicationConsiderations.secondLineOptions.map((med, i) => (
                            <div className="medication-card secondary" key={i}>
                              <h5>{med.medication}</h5>
                              <p><strong>Rationale:</strong> {med.rationale}</p>
                              <p><strong>When to Consider:</strong> {med.when}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Contraindication Checklist */}
                      {aiReport.report.clinicalAnalysis.medicationConsiderations.contraindicationChecks?.length > 0 && (
                        <div className="contraindication-checklist">
                          <h4>⚠️ Contraindication Checklist:</h4>
                          <ul>
                            {aiReport.report.clinicalAnalysis.medicationConsiderations.contraindicationChecks.map((check, i) => (
                              <li key={i}>{check}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Differential Diagnosis */}
                  {aiReport.report.clinicalAnalysis.differentialDiagnosis?.length > 0 && (
                    <div className="clinical-subsection">
                      <h3>🔍 Differential Diagnosis Considerations</h3>
                      <div className="differential-grid">
                        {aiReport.report.clinicalAnalysis.differentialDiagnosis.map((diff, i) => (
                          <div className="differential-card" key={i}>
                            <h4>{diff.condition}</h4>
                            <p><strong>Similarity:</strong> {diff.similarity}</p>
                            <p><strong>Differentiating:</strong> {diff.differentiating}</p>
                            <p><strong>Screening:</strong> {diff.screeningRecommendation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comorbidity Risks */}
                  {aiReport.report.clinicalAnalysis.comorbidityRisks && aiReport.report.clinicalAnalysis.comorbidityRisks.risks?.length > 0 && (
                    <div className="clinical-subsection">
                      <h3>⚠️ Comorbidity Risk Assessment</h3>
                      <div className="risk-cards">
                        {aiReport.report.clinicalAnalysis.comorbidityRisks.risks.map((risk, i) => (
                          <div className={`risk-card urgency-${risk.urgency?.toLowerCase() || 'moderate'}`} key={i}>
                            <div className="risk-header">
                              <h4>{risk.condition}</h4>
                              {risk.urgency && <span className={`urgency-badge ${risk.urgency.toLowerCase()}`}>{risk.urgency}</span>}
                            </div>
                            <p><strong>Mechanism:</strong> {risk.mechanism}</p>
                            <p><strong>Recommendation:</strong> {risk.recommendation}</p>
                            {risk.screeningRecommendation && <p><strong>Screening:</strong> {risk.screeningRecommendation}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Treatment Plan */}
                  {aiReport.report.clinicalAnalysis.treatmentFocusAreas?.detailedPlan && (
                    <div className="clinical-subsection">
                      <h3>📋 Detailed Treatment Plan</h3>
                      <div className="treatment-plan-phases">
                        {Object.entries(aiReport.report.clinicalAnalysis.treatmentFocusAreas.detailedPlan).map(([key, phase]) => (
                          <div className="phase-card" key={key}>
                            <h4>{phase.name}</h4>
                            <ul>
                              {phase.actions.map((action, i) => (
                                <li key={i}>{action}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up Recommendations */}
                  {aiReport.report.clinicalAnalysis.followUpRecommendations?.length > 0 && (
                    <div className="clinical-subsection">
                      <h3>📅 Follow-Up Schedule</h3>
                      <div className="followup-grid">
                        {aiReport.report.clinicalAnalysis.followUpRecommendations.map((fu, i) => (
                          <div className="followup-card" key={i}>
                            <h4>{fu.timeframe}</h4>
                            <p><strong>Purpose:</strong> {fu.purpose}</p>
                            <div className="measures">
                              <strong>Measures:</strong>
                              <ul>
                                {fu.measures.map((m, j) => (
                                  <li key={j}>{m}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="clinical-placeholder">
                  <p>Clinical neurological analysis data not available for this assessment.</p>
                </div>
              )}
            </section>

            {/* ═══════════════════════════════════════════════════════════════════════════
                SECTION 4: CLINICAL ENHANCEMENT SECTIONS (NEW)
                Level 1, 2, 3 Clinical Enhancements
            ═══════════════════════════════════════════════════════════════════════════ */}
            {aiReport.clinicalSections && (
              <section className="report-major-section clinical-enhancements-section">
                <div className="section-header">
                  <h2>Section 4: Advanced Clinical Insights</h2>
                  <p className="section-subtitle">Comprehensive pattern analysis and personalized recommendations</p>
                </div>

                {/* LEVEL 1: Clinically Useful Must-Haves */}
                {aiReport.clinicalSections.level1 && (
                  <div className="clinical-level level-1">
                    <h3 className="level-title">🔥 {aiReport.clinicalSections.level1.title}</h3>
                    
                    {aiReport.clinicalSections.level1.sections.map((section, idx) => (
                      <div className="clinical-enhancement-card" key={idx}>
                        <div className="enhancement-header">
                          <h4>{section.title}</h4>
                          <span className="enhancement-subtitle">{section.subtitle}</span>
                        </div>
                        <div className="enhancement-content">
                          {/* Real-World Impairment */}
                          {section.content?.impairmentAreas && (
                            <div className="impairment-areas">
                              {section.content.impairmentAreas.map((area, i) => (
                                <div className={`impairment-card severity-${area.severity?.toLowerCase() || 'moderate'}`} key={i}>
                                  <div className="impairment-header">
                                    <span className="impairment-domain">{area.domain}</span>
                                    <span className={`severity-badge ${area.severity?.toLowerCase()}`}>{area.severity}</span>
                                  </div>
                                  <p className="impairment-description">{area.description}</p>
                                  {area.examples && (
                                    <ul className="impairment-examples">
                                      {area.examples.map((ex, j) => <li key={j}>{ex}</li>)}
                                    </ul>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Symptom Pattern Mapping */}
                          {section.content?.domains && (
                            <div className="symptom-domains">
                              {section.content.domains.map((domain, i) => (
                                <div className="symptom-domain-card" key={i}>
                                  <h5>{domain.domain}</h5>
                                  <div className="symptom-score">Score: {domain.score}/100</div>
                                  {domain.behaviors && (
                                    <div className="behaviors-list">
                                      <strong>Observable Behaviors:</strong>
                                      <ul>
                                        {domain.behaviors.map((b, j) => <li key={j}>{b}</li>)}
                                      </ul>
                                    </div>
                                  )}
                                  {domain.cognitivePattern && (
                                    <p className="cognitive-pattern"><strong>Pattern:</strong> {domain.cognitivePattern}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Clinical Questions */}
                          {section.content?.questions && (
                            <div className="clinical-questions-list">
                              {section.content.questions.map((q, i) => (
                                <div className="clinical-question-card" key={i}>
                                  <div className="question-category">{q.category}</div>
                                  <p className="question-text">"{q.question}"</p>
                                  <p className="question-rationale"><em>Rationale: {q.rationale}</em></p>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Summary text fallback */}
                          {section.content?.summary && (
                            <p className="enhancement-summary">{section.content.summary}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* LEVEL 2: Professional Level Enhancements */}
                {aiReport.clinicalSections.level2 && (
                  <div className="clinical-level level-2">
                    <h3 className="level-title">⚡ {aiReport.clinicalSections.level2.title}</h3>
                    
                    {aiReport.clinicalSections.level2.sections.map((section, idx) => (
                      <div className="clinical-enhancement-card" key={idx}>
                        <div className="enhancement-header">
                          <h4>{section.title}</h4>
                          <span className="enhancement-subtitle">{section.subtitle}</span>
                        </div>
                        <div className="enhancement-content">
                          {/* Functional Domain Table */}
                          {section.content?.domains && section.title?.includes('Functional') && (
                            <div className="functional-domain-table">
                              <table>
                                <thead>
                                  <tr>
                                    <th>Life Domain</th>
                                    <th>Expected Strengths</th>
                                    <th>Likely Challenges</th>
                                    <th>Recommendations</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {section.content.domains.map((d, i) => (
                                    <tr key={i}>
                                      <td><strong>{d.domain}</strong></td>
                                      <td>{d.strengths?.join(', ') || d.expectedStrengths?.join(', ') || '—'}</td>
                                      <td>{d.challenges?.join(', ') || d.likelyChallenges?.join(', ') || '—'}</td>
                                      <td>{d.recommendations?.join(', ') || '—'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                          
                          {/* Pattern Labels */}
                          {section.content?.patterns && (
                            <div className="pattern-labels-grid">
                              {section.content.patterns.map((pattern, i) => (
                                <div className={`pattern-label-card ${pattern.detected ? 'detected' : 'not-detected'}`} key={i}>
                                  <div className="pattern-header">
                                    <span className="pattern-name">{pattern.pattern || pattern.label}</span>
                                    <span className={`pattern-status ${pattern.detected ? 'detected' : ''}`}>
                                      {pattern.detected ? '✓ Detected' : '○ Not Detected'}
                                    </span>
                                  </div>
                                  {pattern.description && <p className="pattern-desc">{pattern.description}</p>}
                                  {pattern.implications && (
                                    <div className="pattern-implications">
                                      <strong>Implications:</strong>
                                      <ul>
                                        {pattern.implications.map((imp, j) => <li key={j}>{imp}</li>)}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Environment Interpretation */}
                          {section.content?.environments && (
                            <div className="environment-grid">
                              {section.content.environments.map((env, i) => (
                                <div className={`environment-card ${env.performance?.toLowerCase() || 'variable'}`} key={i}>
                                  <h5>{env.environment}</h5>
                                  <div className={`performance-badge ${env.performance?.toLowerCase()}`}>
                                    {env.performance}
                                  </div>
                                  <p>{env.prediction || env.description}</p>
                                  {env.tips && (
                                    <div className="env-tips">
                                      <strong>Tips:</strong>
                                      <ul>
                                        {env.tips.map((tip, j) => <li key={j}>{tip}</li>)}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* LEVEL 3: Next Level Unique Features */}
                {aiReport.clinicalSections.level3 && (
                  <div className="clinical-level level-3">
                    <h3 className="level-title">🧠 {aiReport.clinicalSections.level3.title}</h3>
                    
                    {aiReport.clinicalSections.level3.sections.map((section, idx) => (
                      <div className="clinical-enhancement-card" key={idx}>
                        <div className="enhancement-header">
                          <h4>{section.title}</h4>
                          <span className="enhancement-subtitle">{section.subtitle}</span>
                        </div>
                        <div className="enhancement-content">
                          {/* Personalized Interventions */}
                          {section.content?.interventions && (
                            <div className="interventions-grid">
                              {section.content.interventions.map((intervention, i) => (
                                <div className={`intervention-card priority-${intervention.priority?.toLowerCase() || 'medium'}`} key={i}>
                                  <div className="intervention-header">
                                    <span className="intervention-target">{intervention.targetArea || intervention.area}</span>
                                    <span className={`priority-badge ${intervention.priority?.toLowerCase()}`}>
                                      {intervention.priority} Priority
                                    </span>
                                  </div>
                                  <p className="intervention-rationale">{intervention.rationale}</p>
                                  {intervention.strategies && (
                                    <div className="intervention-strategies">
                                      <strong>Strategies:</strong>
                                      <ul>
                                        {intervention.strategies.map((s, j) => <li key={j}>{s}</li>)}
                                      </ul>
                                    </div>
                                  )}
                                  {intervention.tools && (
                                    <div className="intervention-tools">
                                      <strong>Tools:</strong> {intervention.tools.join(', ')}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Trait-Based Summary */}
                          {section.content?.traits && (
                            <div className="traits-grid">
                              {section.content.traits.map((trait, i) => (
                                <div className={`trait-card ${trait.valence?.toLowerCase() || 'neutral'}`} key={i}>
                                  <div className="trait-header">
                                    <span className="trait-name">{trait.trait || trait.name}</span>
                                    <span className={`trait-valence ${trait.valence?.toLowerCase()}`}>
                                      {trait.valence}
                                    </span>
                                  </div>
                                  <p className="trait-description">{trait.description}</p>
                                  {trait.impact && <p className="trait-impact"><strong>Impact:</strong> {trait.impact}</p>}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Profile Summary */}
                          {section.content?.profileSummary && (
                            <div className="profile-summary-box">
                              <p>{section.content.profileSummary}</p>
                            </div>
                          )}
                          
                          {/* Risk Indicators */}
                          {section.content?.risks && (
                            <div className="risks-grid">
                              {section.content.risks.map((risk, i) => (
                                <div className={`risk-indicator-card severity-${risk.severity?.toLowerCase() || 'moderate'}`} key={i}>
                                  <div className="risk-header">
                                    <span className="risk-name">{risk.indicator || risk.risk}</span>
                                    <span className={`risk-severity ${risk.severity?.toLowerCase()}`}>
                                      {risk.severity}
                                    </span>
                                  </div>
                                  <p className="risk-description">{risk.description}</p>
                                  {risk.recommendation && (
                                    <p className="risk-recommendation">
                                      <strong>Recommendation:</strong> {risk.recommendation}
                                    </p>
                                  )}
                                  {risk.monitoringNeeded && (
                                    <div className="risk-monitoring">
                                      <strong>Monitor:</strong> {risk.monitoringNeeded}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Hidden Markers (MSSD + Fatigue Slope) */}
                          {(section.content?.mssd || section.content?.fatigueSlope || section.content?.interpretation) && (
                            <div className="hidden-markers-content">
                              {/* Compensated Pattern Alert */}
                              {section.content.compensatedPattern ? (
                                <div className="hidden-marker-alert warning">
                                  <span className="alert-icon">⚠️</span>
                                  <span className="alert-text">{section.content.summary}</span>
                                </div>
                              ) : section.content.available !== false && (
                                <div className="hidden-marker-alert success">
                                  <span className="alert-icon">✅</span>
                                  <span className="alert-text">No hidden compensated ADHD pattern detected. Trial-by-trial performance was consistent.</span>
                                </div>
                              )}
                              
                              {/* MSSD + Fatigue Cards */}
                              {section.content.available !== false && (
                                <div className="hidden-markers-grid">
                                  {section.content.mssd && (
                                    <div className={`hidden-marker-card ${section.content.mssd.avgStatus || 'normal'}`}>
                                      <div className="marker-header">
                                        <span className="marker-name">Trial-to-Trial Volatility (MSSD)</span>
                                        <span className={`marker-status ${section.content.mssd.avgStatus}`}>
                                          {section.content.mssd.avgStatus === 'high' ? '🔴 High' : 
                                           section.content.mssd.avgStatus === 'elevated' ? '🟡 Elevated' : '🟢 Normal'}
                                        </span>
                                      </div>
                                      <div className="marker-value">{section.content.mssd.avgValue || 0}</div>
                                      <p className="marker-interpretation">{section.content.mssd.interpretation}</p>
                                    </div>
                                  )}
                                  
                                  {section.content.fatigueSlope && (
                                    <div className={`hidden-marker-card ${section.content.fatigueSlope.hasSignificantDecline ? 'elevated' : 'normal'}`}>
                                      <div className="marker-header">
                                        <span className="marker-name">Cognitive Fatigue (RT Slope)</span>
                                        <span className={`marker-status ${section.content.fatigueSlope.hasSignificantDecline ? 'elevated' : 'normal'}`}>
                                          {section.content.fatigueSlope.hasSignificantDecline ? '🟡 Decline' : '🟢 Stable'}
                                        </span>
                                      </div>
                                      <div className="marker-value">{section.content.fatigueSlope.avgValue || 0} ms/trial</div>
                                      <p className="marker-interpretation">{section.content.fatigueSlope.interpretation}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* Interpretation Text */}
                              {section.content.interpretation && (
                                <div className="hidden-markers-interpretation">
                                  <pre className="interpretation-text">{section.content.interpretation}</pre>
                                </div>
                              )}
                              
                              {/* Per-Task Breakdown */}
                              {section.content.tasks && section.content.tasks.length > 0 && (
                                <div className="hidden-markers-breakdown">
                                  <h4>📊 Per-Task Analysis</h4>
                                  <table className="hidden-markers-table">
                                    <thead>
                                      <tr>
                                        <th>Task</th>
                                        <th>MSSD</th>
                                        <th>Status</th>
                                        <th>Fatigue</th>
                                        <th>Direction</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {section.content.tasks.map((task, i) => (
                                        <tr key={i}>
                                          <td><strong>{task.name}</strong></td>
                                          <td>{Math.round(task.mssd?.value) || '—'}</td>
                                          <td className={task.mssd?.status}>{task.mssd?.status || '—'}</td>
                                          <td>{task.fatigueSlope?.value?.toFixed(2) || '—'}</td>
                                          <td className={task.fatigueSlope?.significance !== 'none' ? 'elevated' : 'normal'}>
                                            {task.fatigueSlope?.direction || '—'}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                              
                              {/* Clinical Relevance */}
                              {section.content.clinicalRelevance && (
                                <div className="hidden-markers-clinical">
                                  <h4>🏥 Clinical Relevance</h4>
                                  <p className={`clinical-relevance-text ${section.content.clinicalRelevance.includes('HIGH') ? 'high' : 'low'}`}>
                                    {section.content.clinicalRelevance}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Disclaimer */}
            <div className="report-disclaimer">
              <strong>⚠️ Important Disclaimer:</strong> {aiReport.report?.disclaimer || 'This is a screening tool only. It does NOT constitute a clinical diagnosis. ADHD can only be formally diagnosed by qualified healthcare professionals. Please share this report with your healthcare provider for proper evaluation.'}
            </div>

            {/* Actions */}
            <div className="report-actions">
              <button className="action-btn primary" onClick={downloadPDF} disabled={loading}>
                {loading ? 'Generating...' : '📄 Download PDF'}
              </button>
              <button className="action-btn secondary" onClick={retryGeneration} disabled={loading}>
                🔄 Regenerate
              </button>
              <button className="action-btn tertiary" onClick={() => { setAiReport(null); setError(null); }}>
                ← Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIProfileGenerator;
