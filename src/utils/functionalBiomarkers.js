/**
 * Functional Biomarkers Engine v1.0
 * 
 * Translates millisecond-level cognitive data into real-world impairment predictions.
 * These 4 biomarkers predict specific daily life challenges with high clinical utility.
 * 
 * BIOMARKERS:
 * 1. IES (Inverse Efficiency Score) → Burnout/Energy Drain Risk
 * 2. MSSD (Micro-Lapse Index) → Attention Flickering/Conversational Drifting
 * 3. Fatigue Slope → Task Endurance/Project Abandonment Risk
 * 4. Switching Cost → Executive Flexibility/Task Paralysis
 * 
 * @version 1.0.0
 * @author ADHD Assessment Engine
 */

// ============================================================================
// BIOMARKER 1: INVERSE EFFICIENCY SCORE (IES) - "The Energy Tax"
// ============================================================================
/**
 * Calculates how much cognitive "fuel" you burn to maintain accuracy.
 * 
 * FORMULA: IES = Mean RT / Accuracy
 * 
 * INTERPRETATION:
 * - Low IES (<500): Efficient - Fast AND accurate
 * - Normal IES (500-750): Typical cognitive cost
 * - High IES (750-900): Elevated cost - Working harder than needed
 * - Severe IES (>900): Burning 2-3x more energy than neurotypical
 * 
 * REAL-LIFE PREDICTION: Afternoon crashes, chronic fatigue, burnout risk
 */
export const calculateIES = (meanRT, accuracyPercentage) => {
  // Validation
  if (!meanRT || meanRT <= 0 || !accuracyPercentage || accuracyPercentage <= 0) {
    return {
      score: 0,
      rating: 'Insufficient Data',
      available: false,
      interpretation: 'Unable to calculate - missing reaction time or accuracy data.'
    };
  }
  
  // Convert percentage to decimal (e.g., 95 -> 0.95)
  // Floor at 0.01 to prevent division by zero
  const accuracyDecimal = Math.max(0.01, accuracyPercentage / 100);
  
  // Core Formula: RT / Accuracy
  // Fast (400ms) + Accurate (1.0) = 400 (Efficient)
  // Slow (800ms) + Accurate (1.0) = 800 (High Cost)
  // Slow (800ms) + Inaccurate (0.7) = 1143 (Very High Cost)
  const ies = Math.round(meanRT / accuracyDecimal);
  
  // Determine rating with clinical thresholds
  let rating, interpretation, realLifeImpact, color;
  
  if (ies > 900) {
    rating = 'Severe';
    color = '#ef4444'; // Red
    interpretation = 'Your brain is burning 2-3x more cognitive fuel than typical to maintain accuracy. This is unsustainable long-term.';
    realLifeImpact = [
      'Likely experiencing "crash" fatigue by mid-afternoon',
      'May feel mentally exhausted even after "easy" days',
      'High risk of burnout if not managed',
      'Weekends spent recovering rather than enjoying'
    ];
  } else if (ies > 750) {
    rating = 'High';
    color = '#f59e0b'; // Orange
    interpretation = 'You\'re working harder than necessary to achieve accuracy. This cognitive overhead adds up over time.';
    realLifeImpact = [
      'May feel tired earlier than peers',
      'Needs more recovery time after focused work',
      'Concentration becomes harder as day progresses',
      'May rely on caffeine or stimulation to push through'
    ];
  } else if (ies > 500) {
    rating = 'Normal';
    color = '#22c55e'; // Green
    interpretation = 'Your cognitive efficiency is within typical ranges. You\'re not overworking to maintain performance.';
    realLifeImpact = [
      'Energy levels likely stable throughout day',
      'Can sustain focus without excessive fatigue',
      'Recovery time is appropriate'
    ];
  } else {
    rating = 'Efficient';
    color = '#3b82f6'; // Blue
    interpretation = 'Excellent cognitive efficiency. You achieve accuracy with minimal mental effort.';
    realLifeImpact = [
      'Strong cognitive stamina',
      'Likely handles demanding tasks with ease',
      'Low burnout risk from cognitive demands'
    ];
  }
  
  return {
    score: ies,
    rating,
    color,
    interpretation,
    realLifeImpact,
    available: true,
    formula: 'RT ÷ Accuracy',
    unit: 'ms efficiency units',
    thresholds: {
      efficient: '<500',
      normal: '500-750',
      high: '750-900',
      severe: '>900'
    }
  };
};

// ============================================================================
// BIOMARKER 2: MSSD (Mean Squared Successive Difference) - "Micro-Lapse Index"
// ============================================================================
/**
 * Measures trial-to-trial attention "flickering" or jitter.
 * 
 * FORMULA: √(Σ(RT[i+1] - RT[i])² / n)
 * 
 * INTERPRETATION:
 * - Stable (<150ms): Consistent attention - rare lapses
 * - Moderate (150-300ms): Some attention flickering
 * - High (>300ms): Frequent micro-lapses - attention "blinks"
 * 
 * REAL-LIFE PREDICTION: Missing parts of conversations, re-reading paragraphs,
 *                       "zoning out" during meetings
 */
export const calculateMSSD = (reactionTimes) => {
  // Validation
  if (!reactionTimes || !Array.isArray(reactionTimes) || reactionTimes.length < 2) {
    return {
      score: 0,
      rating: 'Insufficient Data',
      available: false,
      interpretation: 'Unable to calculate - need at least 2 reaction time data points.'
    };
  }
  
  let sumSquaredDiff = 0;
  let validPairs = 0;
  
  for (let i = 0; i < reactionTimes.length - 1; i++) {
    const current = reactionTimes[i];
    const next = reactionTimes[i + 1];
    
    // Filter out technical artifacts (too fast or too slow)
    // Keep cognitive lapses (100ms - 5000ms range)
    if (current > 100 && next > 100 && current < 5000 && next < 5000) {
      const diff = next - current;
      sumSquaredDiff += diff * diff;
      validPairs++;
    }
  }
  
  if (validPairs === 0) {
    return {
      score: 0,
      rating: 'Insufficient Data',
      available: false,
      interpretation: 'Unable to calculate - no valid reaction time pairs found.'
    };
  }
  
  // Root Mean Square of Successive Differences
  const mssd = Math.round(Math.sqrt(sumSquaredDiff / validPairs));
  
  // Determine rating with clinical thresholds
  let rating, interpretation, realLifeImpact, color;
  
  if (mssd > 300) {
    rating = 'Severe';
    color = '#ef4444'; // Red
    interpretation = 'Your attention "flickers" significantly between moments. This creates frequent micro-gaps in awareness.';
    realLifeImpact = [
      'Likely missing middle sentences in conversations',
      'Need to re-read paragraphs multiple times',
      'May ask "what?" frequently even when listening',
      'Difficulty following multi-step verbal instructions',
      'Partners may feel ignored even when you\'re trying to pay attention'
    ];
  } else if (mssd > 150) {
    rating = 'Elevated';
    color = '#f59e0b'; // Orange
    interpretation = 'Some attention flickering detected. Your focus has occasional "blinks" that may cause information gaps.';
    realLifeImpact = [
      'May lose track occasionally during long conversations',
      'Sometimes needs information repeated',
      'Works best with written backup for verbal instructions',
      'May miss details in fast-paced discussions'
    ];
  } else {
    rating = 'Stable';
    color = '#22c55e'; // Green
    interpretation = 'Your attention is consistent moment-to-moment. Minimal "flickering" between trials.';
    realLifeImpact = [
      'Can follow conversations reliably',
      'Rarely needs information repeated',
      'Good at catching details in real-time'
    ];
  }
  
  return {
    score: mssd,
    rating,
    color,
    interpretation,
    realLifeImpact,
    available: true,
    formula: '√(Σ(RT[i+1] - RT[i])² / n)',
    unit: 'ms jitter',
    validPairs,
    thresholds: {
      stable: '<150ms',
      elevated: '150-300ms',
      severe: '>300ms'
    }
  };
};

// ============================================================================
// BIOMARKER 3: FATIGUE SLOPE - "Time-on-Task Endurance"
// ============================================================================
/**
 * Measures how quickly your cognitive "battery" drains during sustained effort.
 * 
 * FORMULA: Linear regression slope of RT over trial number
 * 
 * INTERPRETATION:
 * - Stable (<3): Excellent endurance - no significant slowdown
 * - Moderate Drain (3-10): Some fatigue effect
 * - Rapid Drain (>10): Quick cognitive depletion
 * - Speeding (<-3): Getting faster (rushing, practice effect, or disengagement)
 * 
 * REAL-LIFE PREDICTION: Project abandonment, "last 10%" completion difficulty,
 *                       performance decline in long meetings
 */
export const calculateFatigueSlope = (reactionTimes) => {
  // Validation
  if (!reactionTimes || !Array.isArray(reactionTimes) || reactionTimes.length < 5) {
    return {
      score: 0,
      rating: 'Insufficient Data',
      available: false,
      interpretation: 'Unable to calculate - need at least 5 reaction time data points.'
    };
  }
  
  // Filter valid RTs
  const validRTs = reactionTimes.filter(rt => rt > 100 && rt < 5000);
  
  if (validRTs.length < 5) {
    return {
      score: 0,
      rating: 'Insufficient Data',
      available: false,
      interpretation: 'Unable to calculate - insufficient valid reaction times.'
    };
  }
  
  const n = validRTs.length;
  let sumX = 0;  // Trial index
  let sumY = 0;  // RT value
  let sumXY = 0; // Product
  let sumXX = 0; // X squared
  
  for (let i = 0; i < n; i++) {
    const x = i;
    const y = validRTs[i];
    
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }
  
  // Linear Regression Slope (m = (nΣxy - ΣxΣy) / (nΣx² - (Σx)²))
  const denominator = n * sumXX - sumX * sumX;
  if (denominator === 0) {
    return {
      score: 0,
      rating: 'Unable to Calculate',
      available: false,
      interpretation: 'Mathematical error in slope calculation.'
    };
  }
  
  const slope = (n * sumXY - sumX * sumY) / denominator;
  const roundedSlope = Math.round(slope * 100) / 100; // 2 decimal places
  
  // Calculate total drift (slope × number of trials)
  const totalDrift = Math.round(slope * n);
  
  // Determine rating with clinical thresholds
  let rating, interpretation, realLifeImpact, color, direction;
  
  if (slope > 10) {
    rating = 'Rapid Drain';
    color = '#ef4444'; // Red
    direction = 'slowing';
    interpretation = `Your cognitive battery drains rapidly. Performance slowed by ~${totalDrift}ms over ${n} trials.`;
    realLifeImpact = [
      'Starts projects with high energy but struggles with final 10%',
      'Performance drops significantly in long meetings',
      'May avoid tasks that require sustained effort',
      'Deadline work often rushed at the end',
      'Needs frequent breaks to maintain quality'
    ];
  } else if (slope > 3) {
    rating = 'Moderate Drain';
    color = '#f59e0b'; // Orange
    direction = 'slowing';
    interpretation = `Some cognitive fatigue detected. Performance slowed by ~${totalDrift}ms over ${n} trials.`;
    realLifeImpact = [
      'May need breaks during long tasks',
      'Quality may decline toward end of workday',
      'Benefits from task chunking',
      'Second half of tasks takes more effort'
    ];
  } else if (slope < -5) {
    rating = 'Speeding';
    color = '#8b5cf6'; // Purple
    direction = 'speeding';
    interpretation = `Unusual speeding pattern detected. RTs decreased by ~${Math.abs(totalDrift)}ms over ${n} trials.`;
    realLifeImpact = [
      'May indicate rushing or reduced care over time',
      'Could reflect practice effect',
      'Possible disengagement from task',
      'Worth monitoring accuracy alongside speed'
    ];
  } else {
    rating = 'Stable';
    color = '#22c55e'; // Green
    direction = 'stable';
    interpretation = 'Excellent cognitive endurance. Performance remained consistent throughout testing.';
    realLifeImpact = [
      'Good sustained attention capacity',
      'Can maintain quality over longer tasks',
      'Reliable performer throughout workday',
      'Low risk of fatigue-related errors'
    ];
  }
  
  return {
    score: roundedSlope,
    rating,
    color,
    direction,
    interpretation,
    realLifeImpact,
    available: true,
    totalDrift,
    trialCount: n,
    formula: 'Linear regression slope of RT over trials',
    unit: 'ms/trial',
    thresholds: {
      stable: '-3 to +3',
      moderateDrain: '+3 to +10',
      rapidDrain: '>+10',
      speeding: '<-5'
    }
  };
};

// ============================================================================
// BIOMARKER 4: SWITCHING COST - "Executive Tax"
// ============================================================================
/**
 * Measures the cognitive "toll" of shifting between mental tasks.
 * 
 * FORMULA: Trail B Time / Trail A Time (ratio)
 *          Also: Trail B - Trail A (raw difference)
 * 
 * INTERPRETATION:
 * - Efficient (<2.0x): Good mental gear-shifting
 * - Elevated (2.0-2.5x): Some executive overhead
 * - Severe (>2.5x): High cost to switch tasks
 * 
 * REAL-LIFE PREDICTION: Task paralysis, "waiting mode" before appointments,
 *                       difficulty transitioning between activities
 */
export const calculateSwitchingCost = (trailATime, trailBTime) => {
  // Validation
  if (!trailATime || trailATime <= 0 || !trailBTime || trailBTime <= 0) {
    return {
      rawMs: 0,
      ratio: 0,
      rating: 'Insufficient Data',
      available: false,
      interpretation: 'Unable to calculate - missing Trail Making data.'
    };
  }
  
  // Calculate raw difference (ms)
  const rawDiff = Math.round(trailBTime - trailATime);
  
  // Calculate ratio (B/A)
  const ratio = trailBTime / trailATime;
  const roundedRatio = Math.round(ratio * 100) / 100; // 2 decimal places
  
  // Determine rating with clinical thresholds
  let rating, interpretation, realLifeImpact, color;
  
  if (ratio > 2.5) {
    rating = 'Severe';
    color = '#ef4444'; // Red
    interpretation = `Shifting mental gears is very "expensive" for your brain. Trail B took ${roundedRatio}x longer than Trail A.`;
    realLifeImpact = [
      'Gets "stuck" in waiting mode before appointments',
      'Difficulty transitioning from work mode to relaxation',
      'May procrastinate starting tasks due to switching cost',
      'Struggles when interrupted mid-task',
      'Benefits from minimal context-switching in work environment'
    ];
  } else if (ratio > 2.0) {
    rating = 'Elevated';
    color = '#f59e0b'; // Orange
    interpretation = `Some executive overhead when switching tasks. Trail B took ${roundedRatio}x longer than Trail A.`;
    realLifeImpact = [
      'May need transition time between different activities',
      'Works best with predictable schedules',
      'Interruptions are more disruptive than for others',
      'Benefits from task batching'
    ];
  } else {
    rating = 'Efficient';
    color = '#22c55e'; // Green
    interpretation = `Excellent mental flexibility. Trail B took only ${roundedRatio}x longer than Trail A.`;
    realLifeImpact = [
      'Shifts gears smoothly between tasks',
      'Handles interruptions relatively well',
      'May actually thrive in dynamic environments',
      'Good at multitasking when needed',
      'Performs well in crisis/high-pressure situations'
    ];
  }
  
  return {
    rawMs: rawDiff,
    ratio: roundedRatio,
    rating,
    color,
    interpretation,
    realLifeImpact,
    available: true,
    trailATime: Math.round(trailATime),
    trailBTime: Math.round(trailBTime),
    formula: 'Trail B Time ÷ Trail A Time',
    unit: 'x ratio',
    thresholds: {
      efficient: '<2.0x',
      elevated: '2.0-2.5x',
      severe: '>2.5x'
    }
  };
};

// ============================================================================
// MASTER ANALYZER: Calculate All 4 Biomarkers
// ============================================================================
/**
 * Calculates all 4 functional biomarkers from raw task data.
 * 
 * @param {Object} taskData - Raw data from cognitive tasks
 * @param {Array} taskData.reactionTimes - Array of RT values (ms)
 * @param {number} taskData.meanRT - Mean reaction time (ms)
 * @param {number} taskData.accuracy - Accuracy percentage (0-100)
 * @param {number} taskData.trailATime - Trail Making A completion time (ms)
 * @param {number} taskData.trailBTime - Trail Making B completion time (ms)
 * 
 * @returns {Object} All 4 biomarker results
 */
export const calculateAllBiomarkers = (taskData) => {
  const {
    reactionTimes = [],
    meanRT = 0,
    accuracy = 0,
    trailATime = 0,
    trailBTime = 0,
    // Alternative sources
    cptRTs = [],
    flankerRTs = [],
    goNoGoRTs = [],
    nbackRTs = []
  } = taskData;
  
  // Use best available RT array for MSSD and Fatigue
  const bestRTArray = reactionTimes.length > 0 ? reactionTimes :
                      cptRTs.length > 0 ? cptRTs :
                      flankerRTs.length > 0 ? flankerRTs :
                      goNoGoRTs.length > 0 ? goNoGoRTs :
                      nbackRTs.length > 0 ? nbackRTs : [];
  
  // Calculate all biomarkers
  const ies = calculateIES(meanRT, accuracy);
  const mssd = calculateMSSD(bestRTArray);
  const fatigue = calculateFatigueSlope(bestRTArray);
  const switching = calculateSwitchingCost(trailATime, trailBTime);
  
  // Count how many biomarkers show concern
  const concernCount = [
    ies.rating === 'Severe' || ies.rating === 'High',
    mssd.rating === 'Severe' || mssd.rating === 'Elevated',
    fatigue.rating === 'Rapid Drain' || fatigue.rating === 'Moderate Drain',
    switching.rating === 'Severe' || switching.rating === 'Elevated'
  ].filter(Boolean).length;
  
  // Overall summary
  let overallRisk, overallColor;
  if (concernCount >= 3) {
    overallRisk = 'High Functional Impact';
    overallColor = '#ef4444';
  } else if (concernCount >= 2) {
    overallRisk = 'Moderate Functional Impact';
    overallColor = '#f59e0b';
  } else if (concernCount >= 1) {
    overallRisk = 'Mild Functional Impact';
    overallColor = '#eab308';
  } else {
    overallRisk = 'Minimal Functional Impact';
    overallColor = '#22c55e';
  }
  
  return {
    ies,
    mssd,
    fatigue,
    switching,
    summary: {
      concernCount,
      totalBiomarkers: 4,
      overallRisk,
      overallColor,
      interpretation: concernCount >= 2
        ? `${concernCount} of 4 functional biomarkers indicate daily life challenges. These patterns predict specific real-world difficulties.`
        : concernCount === 1
          ? 'One functional biomarker shows elevation. Targeted support may help in this area.'
          : 'All functional biomarkers are within typical ranges. No significant daily life impairments predicted from cognitive testing.'
    }
  };
};

// ============================================================================
// PREDICTION GENERATOR: Create "Real Life Guesses"
// ============================================================================
/**
 * Generates specific, actionable real-life predictions based on biomarker results.
 * These are the "guesses" about daily life challenges.
 * 
 * @param {Object} biomarkers - Results from calculateAllBiomarkers()
 * @returns {Array} Array of prediction objects
 */
export const generateLifePredictions = (biomarkers) => {
  const predictions = [];
  const { ies, mssd, fatigue, switching } = biomarkers;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. BURNOUT PREDICTION (IES)
  // ═══════════════════════════════════════════════════════════════════════════
  if (ies.available && (ies.rating === 'Severe' || ies.rating === 'High')) {
    predictions.push({
      id: 'burnout',
      metric: 'Efficiency Tax (IES)',
      icon: '🔋',
      value: ies.score,
      unit: 'efficiency units',
      severity: ies.rating,
      color: ies.color,
      prediction: 'Chronic Exhaustion Risk',
      headline: "You're Running on Premium Fuel",
      explanation: ies.rating === 'Severe'
        ? "Your brain maintains accuracy by burning 2-3x more cognitive energy than a neurotypical brain. You're essentially running a economy car with premium fuel consumption. This is unsustainable."
        : "Your brain works harder than typical to maintain performance. This elevated cognitive cost accumulates over time.",
      dailyLifeExamples: [
        "😴 'Crash' fatigue hits between 2-4pm even on 'easy' days",
        "☕ You rely on caffeine more than others to push through",
        "🛋️ Weekends feel like 'recovery time' rather than enjoyment",
        "😓 Feel like you're 'faking it' while actually working twice as hard"
      ],
      strategies: [
        "Schedule demanding cognitive tasks for your peak energy window",
        "Build in 'nothing' breaks - not phone scrolling, actual rest",
        "Consider if ADHD medication could reduce this cognitive tax",
        "Advocate for flexible work arrangements if possible"
      ]
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // 2. CONVERSATIONAL DRIFTING PREDICTION (MSSD)
  // ═══════════════════════════════════════════════════════════════════════════
  if (mssd.available && (mssd.rating === 'Severe' || mssd.rating === 'Elevated')) {
    predictions.push({
      id: 'drifting',
      metric: 'Micro-Lapse Index (MSSD)',
      icon: '🗣️',
      value: mssd.score,
      unit: 'ms jitter',
      severity: mssd.rating,
      color: mssd.color,
      prediction: 'Conversational Drifting',
      headline: "Your Attention 'Blinks' Without You Noticing",
      explanation: mssd.rating === 'Severe'
        ? "Your attention flickers dramatically between moments - like a fluorescent light with a bad ballast. These micro-gaps create 'blind spots' in conversations and reading."
        : "Some attention flickering detected. You may have occasional 'blind spots' where information slips through.",
      dailyLifeExamples: [
        "🗨️ Often need to ask 'wait, what?' even when you were trying to listen",
        "📖 Re-read paragraphs because you realize you absorbed nothing",
        "💭 Partners say you don't listen, but you genuinely were trying",
        "📝 Miss middle steps in verbal instructions"
      ],
      strategies: [
        "Ask for written backup when receiving important information",
        "Take notes during conversations (it keeps attention anchored)",
        "Request 'headlines first' - main point before details",
        "In meetings, have a specific 'listening job' (note-taker, question-asker)"
      ]
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // 3. PROJECT ABANDONMENT PREDICTION (Fatigue Slope)
  // ═══════════════════════════════════════════════════════════════════════════
  if (fatigue.available && (fatigue.rating === 'Rapid Drain' || fatigue.rating === 'Moderate Drain')) {
    predictions.push({
      id: 'abandonment',
      metric: 'Fatigue Slope',
      icon: '📉',
      value: fatigue.score > 0 ? '+' + fatigue.score : fatigue.score,
      unit: 'ms/trial',
      severity: fatigue.rating,
      color: fatigue.color,
      prediction: "The '90% Complete' Problem",
      headline: "Your Battery Drains Faster Than Others'",
      explanation: fatigue.rating === 'Rapid Drain'
        ? `Your cognitive battery depleted rapidly during testing. Performance slowed by ${fatigue.totalDrift}ms over ${fatigue.trialCount} trials. This predicts difficulty with the 'boring last 10%' of any project.`
        : `Some cognitive drain detected over time. You may find sustained tasks increasingly difficult.`,
      dailyLifeExamples: [
        "🚀 Projects start with huge energy, then stall near completion",
        "📑 The 'final details' (proofreading, formatting, filing) get skipped",
        "⏰ Performance drops noticeably in long meetings",
        "🔄 Pattern of many started projects, few finished ones"
      ],
      strategies: [
        "Do the 'boring parts' FIRST when energy is high",
        "Use body-doubling (work alongside someone) for finishing tasks",
        "Set artificial deadlines before real ones",
        "Break the last 10% into tiny 2-minute steps",
        "Reward completion, not just starting"
      ]
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // 4A. TASK PARALYSIS PREDICTION (Switching - Severe)
  // ═══════════════════════════════════════════════════════════════════════════
  if (switching.available && (switching.rating === 'Severe' || switching.rating === 'Elevated')) {
    predictions.push({
      id: 'paralysis',
      metric: 'Switching Cost',
      icon: '🛑',
      value: switching.ratio,
      unit: 'x ratio',
      severity: switching.rating,
      color: switching.color,
      prediction: 'Task Paralysis',
      headline: "Changing Gears Is Expensive For Your Brain",
      explanation: switching.rating === 'Severe'
        ? `Shifting between mental tasks costs your brain ${switching.ratio}x more effort than simple sequential work. This "executive tax" explains why transitions feel so hard.`
        : `Some overhead when switching tasks. Transitions may require more effort than for others.`,
      dailyLifeExamples: [
        "⏳ Get stuck in 'waiting mode' hours before appointments",
        "🏠 Hard to switch from 'work mode' to 'relax mode'",
        "😫 Interruptions completely derail your flow",
        "🔄 Resist starting tasks because the 'gear shift' is painful"
      ],
      strategies: [
        "Batch similar tasks together to minimize switching",
        "Use 'transition rituals' - a specific action that signals mode change",
        "Build buffer time between different types of activities",
        "Request 'do not disturb' time for focused work",
        "Front-load your most demanding task switches"
      ]
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // 4B. CRISIS RESPONDER (Switching - Efficient) - Positive Finding!
  // ═══════════════════════════════════════════════════════════════════════════
  if (switching.available && switching.rating === 'Efficient') {
    predictions.push({
      id: 'crisis',
      metric: 'Switching Cost',
      icon: '🚑',
      value: switching.ratio,
      unit: 'x ratio',
      severity: 'Strength',
      color: '#3b82f6', // Blue for strength
      prediction: 'Crisis Responder Advantage',
      headline: "You Shift Gears Better Than Most",
      explanation: `Unlike many with attention challenges, your brain switches contexts efficiently (${switching.ratio}x ratio). This is a genuine cognitive STRENGTH.`,
      dailyLifeExamples: [
        "✅ May actually perform BETTER in chaotic/high-pressure situations",
        "⚡ Can pivot quickly when plans change",
        "🎯 Handles interruptions better than expected",
        "🔥 Thrives in emergency/crisis roles"
      ],
      strategies: [
        "Consider careers that leverage rapid context-switching",
        "Volunteer for 'firefighting' roles at work",
        "This strength may compensate for other challenges",
        "Don't assume all ADHD traits are deficits - this one isn't"
      ],
      isStrength: true
    });
  }
  
  return predictions;
};

// ============================================================================
// NARRATIVE GENERATOR: Create Report-Ready Text
// ============================================================================
/**
 * Generates narrative text suitable for the clinical report.
 * 
 * @param {Object} biomarkers - Results from calculateAllBiomarkers()
 * @returns {Object} Report-ready narrative content
 */
export const generateBiomarkerNarrative = (biomarkers) => {
  const predictions = generateLifePredictions(biomarkers);
  const { ies, mssd, fatigue, switching, summary } = biomarkers;
  
  // Build narrative paragraphs
  const paragraphs = [];
  
  // Opening
  paragraphs.push(
    `Functional biomarker analysis translates your millisecond-level cognitive data into predictions about real-world challenges. This analysis identified ${summary.concernCount} of 4 biomarkers with clinical significance.`
  );
  
  // IES narrative
  if (ies.available) {
    paragraphs.push(
      `**Cognitive Efficiency (IES):** Your Inverse Efficiency Score of ${ies.score} is rated "${ies.rating}". ${ies.interpretation}`
    );
  }
  
  // MSSD narrative
  if (mssd.available) {
    paragraphs.push(
      `**Attention Stability (MSSD):** Your micro-lapse index of ${mssd.score}ms is rated "${mssd.rating}". ${mssd.interpretation}`
    );
  }
  
  // Fatigue narrative
  if (fatigue.available) {
    paragraphs.push(
      `**Cognitive Endurance (Fatigue Slope):** Your fatigue slope of ${fatigue.score} ms/trial is rated "${fatigue.rating}". ${fatigue.interpretation}`
    );
  }
  
  // Switching narrative
  if (switching.available) {
    paragraphs.push(
      `**Executive Flexibility (Switching Cost):** Your switching ratio of ${switching.ratio}x is rated "${switching.rating}". ${switching.interpretation}`
    );
  }
  
  return {
    title: "Functional Biomarkers Analysis",
    subtitle: "Predicting Real-World Challenges from Cognitive Data",
    summary: summary,
    paragraphs,
    predictions,
    biomarkers: {
      ies: ies.available ? {
        name: 'Cognitive Efficiency Tax',
        value: ies.score,
        rating: ies.rating,
        color: ies.color
      } : null,
      mssd: mssd.available ? {
        name: 'Attention Stability',
        value: mssd.score + 'ms',
        rating: mssd.rating,
        color: mssd.color
      } : null,
      fatigue: fatigue.available ? {
        name: 'Cognitive Endurance',
        value: fatigue.score + ' ms/trial',
        rating: fatigue.rating,
        color: fatigue.color
      } : null,
      switching: switching.available ? {
        name: 'Executive Flexibility',
        value: switching.ratio + 'x',
        rating: switching.rating,
        color: switching.color
      } : null
    },
    clinicalRelevance: summary.concernCount >= 2 ? 'HIGH' : summary.concernCount >= 1 ? 'MODERATE' : 'LOW'
  };
};

// ============================================================================
// EXPORTS
// ============================================================================
export default {
  calculateIES,
  calculateMSSD,
  calculateFatigueSlope,
  calculateSwitchingCost,
  calculateAllBiomarkers,
  generateLifePredictions,
  generateBiomarkerNarrative
};
