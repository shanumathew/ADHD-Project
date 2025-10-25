/**
 * ADHD Assessment Suite Configuration & Task Parameters
 * 
 * This file documents the default parameters and structure of each task.
 * Modify these values to customize the assessment experience.
 */

// ============================================================
// TASK PARAMETERS CONFIGURATION
// ============================================================

export const TASK_CONFIG = {
  CPT: {
    name: 'Continuous Performance Task',
    description: 'Detect target stimuli among random letters',
    totalStimuli: 40,
    targetLetter: 'X',
    targetProbability: 0.25, // 25% of stimuli are target
    stimulusDuration: 1500, // milliseconds
    interStimulusInterval: 500, // milliseconds between stimuli
    keyMapping: 'SPACEBAR',
    estimatedDuration: '2-3 minutes',
    metrics: [
      'Hits (correct responses to target)',
      'Misses (failed to respond to target)',
      'False Alarms (incorrect responses)',
      'Correct Rejections',
      'Accuracy (%)',
      'Average Reaction Time (ms)'
    ]
  },

  GO_NOGO: {
    name: 'Go/No-Go Task',
    description: 'Respond to Go stimuli, inhibit to No-Go stimuli',
    totalTrials: 60,
    goProbability: 0.70, // 70% Go trials
    noGoProbability: 0.30, // 30% No-Go trials
    stimulusDuration: 2000, // milliseconds
    interTrialInterval: 500, // milliseconds
    keyMapping: 'SPACEBAR',
    estimatedDuration: '2-3 minutes',
    metrics: [
      'Commission Errors (false responses)',
      'Omission Errors (missed Go)',
      'Correct Rejections (No-Go)',
      'Go Accuracy (%)',
      'No-Go Accuracy (%)',
      'Average Reaction Time (ms)'
    ]
  },

  NBACK: {
    name: 'N-Back Task',
    description: 'Match current stimulus to n steps back',
    totalTrials: 25,
    levels: [1, 2, 3], // Supported n-back levels
    defaultLevel: 2,
    stimulusDuration: 2500, // milliseconds
    interTrialInterval: 500, // milliseconds
    keyMapping: ['1/↑ for Match', '2/↓ for No-Match'],
    estimatedDuration: '1.5-2 minutes per level',
    metrics: [
      'Hits (correct matches)',
      'Misses (failed to detect match)',
      'False Alarms (incorrect matches)',
      'Correct Rejections (correct non-matches)',
      'Accuracy (%)',
      'Average Reaction Time (ms)'
    ]
  },

  FLANKER: {
    name: 'Flanker Task',
    description: 'Identify central target while ignoring distractors',
    totalTrials: 40,
    congruentTrials: 20, // Target and distractors same direction
    incongruentTrials: 20, // Target and distractors opposite direction
    targetSymbols: ['<', '>'],
    stimulusDuration: 3000, // milliseconds
    interTrialInterval: 500, // milliseconds
    keyMapping: ['← for Left', '→ for Right'],
    estimatedDuration: '2-3 minutes',
    metrics: [
      'Congruent Accuracy (%)',
      'Incongruent Accuracy (%)',
      'Overall Accuracy (%)',
      'Congruency Effect (RT difference)',
      'Average Reaction Time (ms)',
      'Congruent vs Incongruent RT comparison'
    ]
  },

  TRAIL_MAKING: {
    name: 'Trail-Making / Sorting Task',
    description: 'Connect items in sequential order',
    totalItems: 15,
    modes: ['numbers', 'letters'],
    estimatedDuration: '1-2 minutes',
    metrics: [
      'Completion Time (seconds)',
      'Time Per Item (ms)',
      'Errors (incorrect selections)',
      'Accuracy (%)',
      'Efficiency (items/second)'
    ]
  }
};

// ============================================================
// RESULT METRICS DEFINITIONS
// ============================================================

export const METRICS = {
  ACCURACY: 'Percentage of correct responses',
  REACTION_TIME: 'Time taken to respond (milliseconds)',
  HITS: 'Correct responses to target stimuli',
  MISSES: 'Failed responses to target stimuli',
  FALSE_ALARMS: 'Incorrect responses to non-target stimuli',
  CORRECT_REJECTIONS: 'Correct non-responses to non-target stimuli',
  COMMISSION_ERROR: 'Response when should inhibit',
  OMISSION_ERROR: 'No response when should respond',
  CONGRUENCY_EFFECT: 'RT increase for incongruent vs congruent trials'
};

// ============================================================
// INTERPRETATION GUIDELINES
// ============================================================

export const INTERPRETATION = {
  CPT: {
    highAccuracy: 'Good sustained attention and vigilance',
    lowAccuracy: 'Difficulty with sustained attention',
    slowRT: 'Potential processing speed concerns',
    highFalseAlarms: 'Impulsivity or reduced inhibitory control',
    highMisses: 'Attention lapses or fatigue'
  },

  GO_NOGO: {
    highCommissionErrors: 'Impulsivity, poor response inhibition',
    highOmissionErrors: 'Attention deficit, motor slowing',
    asymmetricalAccuracy: 'Selective attention or inhibition problems'
  },

  NBACK: {
    decreasedAccuracyHigherLevel: 'Working memory limitations',
    highReactionTime: 'Processing speed or working memory load',
    falseAlarms: 'Impulsivity in decision making'
  },

  FLANKER: {
    largeCongruencyEffect: 'Difficulty filtering irrelevant information',
    lowIncongruentAccuracy: 'Executive control problems',
    consistentRT: 'Stable attentional processing'
  },

  TRAIL_MAKING: {
    slowCompletion: 'Processing speed or planning difficulties',
    highErrors: 'Attention or sequencing problems',
    acceleratingErrors: 'Fatigue or declining attention'
  }
};

// ============================================================
// STIMULUS PARAMETERS
// ============================================================

export const STIMULI = {
  ALPHABET: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  LOWERCASE_ALPHABET: 'abcdefghijklmnopqrstuvwxyz'.split(''),
  DIGITS: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  ARROWS: ['<', '>'],
  COLORS: {
    GO: '#2ecc71', // Green
    NO_GO: '#e74c3c', // Red
    TARGET: '#667eea', // Blue
    DISTRACTOR: '#bdc3c7', // Gray
    SUCCESS: '#27ae60', // Dark Green
    ERROR: '#c0392b' // Dark Red
  }
};

// ============================================================
// TIMING PARAMETERS (in milliseconds)
// ============================================================

export const TIMING = {
  MIN_REACTION_TIME: 100, // Minimum plausible reaction time
  MAX_REALISTIC_REACTION_TIME: 2000, // Maximum for task analysis
  STIMULUS_PRESENTATION: 1500, // Default stimulus display duration
  INTER_TRIAL_INTERVAL: 500, // Rest between trials
  INTER_BLOCK_INTERVAL: 2000, // Rest between task blocks
  DEBOUNCE_RESPONSE: 100 // Prevent multiple responses to single stimulus
};

// ============================================================
// ACCESSIBILITY & CUSTOMIZATION
// ============================================================

export const ACCESSIBILITY = {
  ENABLE_AUDIO_FEEDBACK: false, // Sound cues for responses
  ENABLE_HAPTIC_FEEDBACK: false, // Vibration feedback
  HIGH_CONTRAST_MODE: false, // Enhanced colors
  DYSLEXIA_FONT: false, // Special font support
  FONT_SIZE_ADJUSTMENT: 1.0, // Scale factor (0.8 - 1.5)
  KEY_REPEAT_DELAY: 300, // Milliseconds before key repeat
  RESPONSE_WINDOW_EXTENSION: 0 // Additional time for responses
};

// ============================================================
// DATA MANAGEMENT
// ============================================================

export const DATA_MANAGEMENT = {
  STORAGE_BACKEND: 'localStorage', // 'localStorage' or 'indexedDB'
  MAX_STORED_RESULTS: 100, // Maximum results to keep
  AUTO_SAVE: true, // Save results automatically
  INCLUDE_RAW_REACTION_TIMES: true, // Store all RT measurements
  INCLUDE_STIMULUS_SEQUENCE: true, // Store stimulus order
  ANONYMIZE_DATA: false // Remove timestamps/identifiers
};

// ============================================================
// EXPORT & REPORTING
// ============================================================

export const EXPORT_OPTIONS = {
  FORMATS: ['JSON', 'CSV', 'PDF'],
  INCLUDE_GRAPHS: true,
  INCLUDE_NORMATIVE_DATA: false,
  INCLUDE_INTERPRETATIONS: false,
  TIMESTAMP_FORMAT: 'ISO' // ISO or local time
};

// ============================================================
// VALIDATION THRESHOLDS
// ============================================================

export const VALIDATION = {
  MIN_TASK_COMPLETION_PERCENT: 80, // Mark valid if > 80% completed
  FLAG_UNUSUAL_RT: true, // Flag if RT < 100ms or > 2000ms
  FLAG_PERFECT_PERFORMANCE: true, // Flag suspicious perfect scores
  FLAG_ZERO_VARIANCE_RT: true, // Flag suspiciously consistent times
  VALID_RT_RANGE: [100, 2000] // Milliseconds
};

export default TASK_CONFIG;
