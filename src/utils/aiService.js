/**
 * ADHD Assessment Report Service
 * 
 * NO AI REQUIRED - Pure deterministic narrative generation
 * Uses the Narrative Engine for clinical-grade report generation
 * 
 * This replaces all AI calls with local calculation and narrative generation
 */

import { generateCompleteReport, calculateAllMetrics } from './narrativeEngine.js';

/**
 * Generate a complete ADHD assessment report
 * 
 * @param {Object} rawAssessmentData - Raw data from all cognitive tests
 * @param {Object} userInfo - Patient information (name, age, etc.)
 * @returns {Object} Complete report with metrics, narrative, and recommendations
 */
export const generateAIReport = async (rawAssessmentData, userInfo = {}) => {
  console.log('📊 Generating report using Narrative Engine (no AI)...');
  
  try {
    // Generate complete report using deterministic narrative engine
    const report = generateCompleteReport(rawAssessmentData, userInfo);
    
    console.log('✅ Report generated successfully');
    console.log('📈 ALS Score:', report.calculatedMetrics.compositeScores.als.value);
    console.log('📋 Sections generated:', report.sections.length);
    console.log('📋 Section titles:', report.sections.map(s => s.title));
    
    // Log clinical enhancement sections
    console.log('🏥 Clinical Sections Available:', !!report.clinicalSections);
    console.log('🏥 Level 1 Sections:', report.clinicalSections?.level1?.sections?.length || 0);
    console.log('🏥 Level 2 Sections:', report.clinicalSections?.level2?.sections?.length || 0);
    console.log('🏥 Level 3 Sections:', report.clinicalSections?.level3?.sections?.length || 0);
    console.log('🏥 Real-World Impairment:', !!report.realWorldImpairment);
    console.log('🏥 Pattern Labels:', !!report.patternLabels);
    console.log('🏥 Risk Indicators:', !!report.riskIndicators);
    
    // Extract key sections using flexible lookup
    const executiveSummarySection = report.executiveSummary;
    const patientResultsSection = report.sections.find(s => 
      s.title?.includes('Understanding') || 
      s.title?.includes('Brain Patterns') ||
      s.title?.includes('Patient') ||
      s.title?.includes('Real-Life')
    );
    
    // Debug patient results
    console.log('🧠 Patient Results Section found:', !!patientResultsSection);
    console.log('🧠 Patient Results Title:', patientResultsSection?.title);
    console.log('🧠 Patient Results Content:', patientResultsSection?.content);
    console.log('🧠 Patient Results Sections:', patientResultsSection?.content?.sections);
    
    const clinicalSection = report.sections.find(s => 
      s.title?.includes('Clinical Neurological') || 
      s.title?.includes('Professional') ||
      s.title?.includes('Neuroscience') ||
      s.title?.includes('Medical')
    );
    
    // Debug clinical section
    console.log('🔬 Clinical Section found:', !!clinicalSection);
    console.log('🔬 Clinical Content:', clinicalSection?.content);
    
    const recommendationsSection = report.sections.find(s => s.title?.includes('Recommendations') || s.title?.includes('Personalized'));
    
    // Transform compensation analysis to match UI expectations
    const compensationAnalysis = report.calculatedMetrics.compensationAnalysis;
    const transformedCompensation = compensationAnalysis.detected ? {
      detected: true,
      accuracyLevel: formatAccuracy(compensationAnalysis.accuracy),
      reactionTimeMs: Math.round(compensationAnalysis.avgRT),
      variabilityIndicator: formatVariability(compensationAnalysis.rtCV),
      interpretation: `Your brain achieved ${Math.round(compensationAnalysis.accuracy)}% accuracy, but at a cognitive cost. Average reaction time: ${Math.round(compensationAnalysis.avgRT)}ms. Response time variability (τ): ${Math.round(compensationAnalysis.tau)}ms. This pattern indicates compensatory effort - you're working harder than typical to maintain performance.`,
      tau: compensationAnalysis.tau,
      rtCV: compensationAnalysis.rtCV,
      penalty: compensationAnalysis.penalty
    } : null;
    
    // Transform to match expected format from frontend
    return {
      calculatedMetrics: {
        ...report.calculatedMetrics,
        compensationAnalysis: transformedCompensation
      },
      report: {
        title: 'ADHD Cognitive Assessment Report',
        patientName: userInfo.name || 'Patient',
        assessmentDate: new Date().toLocaleDateString(),
        executiveSummary: Array.isArray(executiveSummarySection?.paragraphs) 
          ? executiveSummarySection.paragraphs.join('\n\n')
          : (typeof executiveSummarySection === 'object' ? JSON.stringify(executiveSummarySection) : 'Summary generated'),
        compensationAnalysis: transformedCompensation,
        domainAnalysis: transformDomainAnalysis(report.calculatedMetrics.domainScores),
        strengths: extractStrengths(report.calculatedMetrics.domainScores),
        areasOfConcern: extractConcerns(report.calculatedMetrics.domainScores, report.calculatedMetrics.flags),
        recommendations: recommendationsSection?.content?.recommendations || [],
        patientResults: patientResultsSection?.content?.sections || [],
        clinicalAnalysis: clinicalSection?.content || {},
        disclaimer: 'This is a SCREENING TOOL only. It does NOT constitute a clinical diagnosis. ADHD can only be formally diagnosed by qualified healthcare professionals. Please share this report with your healthcare provider.',
        
        // NEW: Clinical Enhancement Sections (Level 1, 2, 3)
        realWorldImpairment: report.realWorldImpairment || null,
        symptomPatternMapping: report.symptomPatternMapping || null,
        clinicalQuestions: report.clinicalQuestions || null,
        functionalDomainTable: report.functionalDomainTable || null,
        patternLabels: report.patternLabels || null,
        environmentInterpretation: report.environmentInterpretation || null,
        personalizedInterventions: report.personalizedInterventions || null,
        traitBasedSummary: report.traitBasedSummary || null,
        riskIndicators: report.riskIndicators || null,
        // NEW: Hidden Markers (MSSD, Fatigue Slope)
        hiddenMarkers: report.calculatedMetrics?.hiddenMarkers || null,
        // NEW: Functional Biomarkers (IES, MSSD, Fatigue, Switching)
        functionalBiomarkers: report.calculatedMetrics?.functionalBiomarkers || null,
        lifePredictions: report.lifePredictions || null
      },
      // Full narrative sections for detailed display
      narrativeSections: report.sections,
      // NEW: Clinical Sections organized by level
      clinicalSections: report.clinicalSections || null,
      metadata: report.metadata,
      generatedAt: new Date().toISOString(),
      modelUsed: 'NarrativeEngine v3.0',
      engine: 'NarrativeEngine v3.0 (Clinical Enhancements)'
    };
  } catch (error) {
    console.error('❌ Report generation failed:', error);
    throw new Error(`Report generation failed: ${error.message}`);
  }
};

/**
 * Validate assessment data completeness
 */
export const validateAssessmentData = (data) => {
  const tests = [
    { name: 'CPT', data: data.cptResults || data.cpt },
    { name: 'Go/No-Go', data: data.goNoGoResults || data.goNoGo },
    { name: 'N-Back', data: data.nBackResults || data.nback },
    { name: 'Flanker', data: data.flankerResults || data.flanker },
    { name: 'Trail Making', data: data.trailMakingResults || data.trail },
    { name: 'DSM-5', data: data.dsm5Results || data.dsm5 }
  ];

  const completed = tests.filter(t => t.data && Object.keys(t.data).length > 0);
  const missing = tests.filter(t => !t.data || Object.keys(t.data).length === 0);

  return {
    isValid: completed.length >= 2,
    completedTests: completed.map(t => t.name),
    missingTests: missing.map(t => t.name),
    completionPercentage: Math.round((completed.length / tests.length) * 100)
  };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatAccuracy(accuracy) {
  if (accuracy >= 95) return 'Excellent';
  if (accuracy >= 85) return 'Good';
  if (accuracy >= 75) return 'Average';
  if (accuracy >= 65) return 'Below Average';
  return 'Impaired';
}

function formatVariability(rtCV) {
  if (rtCV <= 0.20) return 'Low (Consistent)';
  if (rtCV <= 0.30) return 'Moderate';
  if (rtCV <= 0.45) return 'High';
  return 'Very High (Highly Variable)';
}

function transformDomainAnalysis(domainScores) {
  const domainAnalysis = {};
  
  Object.entries(domainScores).forEach(([key, data]) => {
    domainAnalysis[key] = {
      score: data.score,
      label: data.label,
      description: data.description,
      interpretation: scoreToInterpretation(data.score),
      concern: data.score >= 70 ? 'STRENGTH' : data.score >= 55 ? 'NEUTRAL' : 'CONCERN'
    };
  });
  
  return domainAnalysis;
}

function scoreToInterpretation(score) {
  if (score >= 85) return 'Excellent performance';
  if (score >= 70) return 'Good performance';
  if (score >= 55) return 'Average performance';
  if (score >= 40) return 'Below average performance';
  return 'Significantly impaired performance';
}

function extractStrengths(domainScores) {
  return Object.entries(domainScores)
    .filter(([_, data]) => data.score >= 70)
    .map(([_, data]) => `${data.label}: ${scoreToInterpretation(data.score)} (${data.score}/100)`);
}

function extractConcerns(domainScores, flags) {
  const concerns = [];
  
  // Domain-based concerns
  Object.entries(domainScores)
    .filter(([_, data]) => data.score < 55)
    .forEach(([_, data]) => {
      concerns.push(`${data.label}: Below average performance (${data.score}/100)`);
    });
  
  // Flag-based concerns
  if (flags.compensation) {
    concerns.push('Compensatory effort detected: High accuracy achieved at significant cognitive cost');
  }
  if (flags.variability) {
    concerns.push('Response variability: Attention fluctuations throughout testing');
  }
  if (flags.inattention) {
    concerns.push('Inattention markers: Elevated omission errors or reduced hit rate');
  }
  if (flags.impulsivity) {
    concerns.push('Impulsivity markers: Elevated commission errors');
  }
  if (flags.workingMemoryDeficit) {
    concerns.push('Working memory deficit: Difficulty maintaining information in mind');
  }
  if (flags.switchingDeficit) {
    concerns.push('Task switching difficulty: High cognitive cost when changing tasks');
  }
  
  return concerns;
}

export default { generateAIReport, validateAssessmentData };
