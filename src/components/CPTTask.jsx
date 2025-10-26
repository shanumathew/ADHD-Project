import React, { useState, useEffect, useRef } from 'react';
import { logResults, calculateAccuracy, calculateAverageReactionTime, formatTime, generateRandomLetters } from '../utils/taskUtils';

/**
 * Continuous Performance Task (CPT)
 * 
 * The user must press a key only for the target letter (e.g., "X").
 * Tracks hits, misses, false alarms, and reaction time.
 */

const CPTTask = () => {
  const [taskStarted, setTaskStarted] = useState(false);
  const [taskFinished, setTaskFinished] = useState(false);
  const [currentStimulus, setCurrentStimulus] = useState('');
  const [stimulusCount, setStimulusCount] = useState(0);
  const [targetLetter] = useState('X');
  
  // Results tracking - use refs for accurate values
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [falseAlarms, setFalseAlarms] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  
  // Refs to track actual current values (not stale closures)
  const hitsRef = useRef(0);
  const missesRef = useRef(0);
  const falseAlarmsRef = useRef(0);
  const reactionTimesRef = useRef([]);
  
  // State variables
  const stimulusStartTimeRef = useRef(null);
  const stimulusTimeoutRef = useRef(null);
  const taskIntervalRef = useRef(null);
  const totalStimuliRef = useRef(40);
  const targetProbabilityRef = useRef(0.25); // 25% of stimuli should be target
  const currentCountRef = useRef(0); // Track actual count for progression
  const isTargetRef = useRef(false); // Store whether current stimulus is target
  const respondedRef = useRef(false); // Track if user has already responded to this stimulus
  
  const startTask = () => {
    setTaskStarted(true);
    setTaskFinished(false);
    setHits(0);
    setMisses(0);
    setFalseAlarms(0);
    setReactionTimes([]);
    
    // Initialize refs
    hitsRef.current = 0;
    missesRef.current = 0;
    falseAlarmsRef.current = 0;
    reactionTimesRef.current = [];
    
    setStimulusCount(0);
    currentCountRef.current = 0;
    presentNextStimulus();
  };

  const presentNextStimulus = () => {
    // Check if we've completed all stimuli
    if (currentCountRef.current >= totalStimuliRef.current) {
      finishTask();
      return;
    }

    // 25% chance of target letter, 75% random letters
    const isTarget = Math.random() < targetProbabilityRef.current;
    isTargetRef.current = isTarget;
    respondedRef.current = false; // Reset response tracking for new stimulus
    
    let stimulus;
    if (isTarget) {
      stimulus = targetLetter;
    } else {
      // Generate random letter that is NOT the target letter
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(l => l !== targetLetter);
      stimulus = letters[Math.floor(Math.random() * letters.length)];
    }
    
    setCurrentStimulus(stimulus);
    stimulusStartTimeRef.current = performance.now();
    setStimulusCount(prev => prev + 1);
    currentCountRef.current += 1;
  };

  const handleStimulusClick = () => {
    if (!taskStarted || taskFinished || !currentStimulus || respondedRef.current) return;

    respondedRef.current = true; // Mark that user responded to this stimulus
    const reactionTime = performance.now() - stimulusStartTimeRef.current;

    clearTimeout(stimulusTimeoutRef.current);
    clearTimeout(taskIntervalRef.current);

    if (currentStimulus === targetLetter) {
      // Hit: correct response to target
      hitsRef.current += 1;
      setHits(prev => prev + 1);
      reactionTimesRef.current.push(reactionTime);
      setReactionTimes(prev => [...prev, reactionTime]); // Only track RT for hits
    } else {
      // False alarm: responded to non-target
      falseAlarmsRef.current += 1;
      setFalseAlarms(prev => prev + 1);
    }

    setCurrentStimulus('');
    taskIntervalRef.current = setTimeout(presentNextStimulus, 500);
  };

  // Auto-advance when stimulus is visible and task is running
  useEffect(() => {
    if (!taskStarted || taskFinished || !currentStimulus) {
      return;
    }

    // Clear any pending timeouts from previous renders
    if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
    if (taskIntervalRef.current) clearTimeout(taskIntervalRef.current);

    let timerFired = false;

    // Set timeout to clear stimulus after 1.5 seconds
    stimulusTimeoutRef.current = setTimeout(() => {
      timerFired = true;
      // Only count as miss if user didn't respond AND it was a target
      if (!respondedRef.current && isTargetRef.current) {
        missesRef.current += 1;
        setMisses(prev => prev + 1);
      }
      setCurrentStimulus('');
    }, 1500);

    return () => {
      // If timer didn't fire (stimulus changed by user response), only count miss if no response and was target
      if (!timerFired && !respondedRef.current && isTargetRef.current) {
        missesRef.current += 1;
        setMisses(prev => prev + 1);
      }
      if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
      if (taskIntervalRef.current) clearTimeout(taskIntervalRef.current);
    };
  }, [taskStarted, taskFinished, currentStimulus]);

  // Auto-present next stimulus after ISI when stimulus is cleared
  useEffect(() => {
    if (!taskStarted || taskFinished || currentStimulus !== '') {
      return;
    }

    taskIntervalRef.current = setTimeout(() => {
      presentNextStimulus();
    }, 500);

    return () => {
      if (taskIntervalRef.current) clearTimeout(taskIntervalRef.current);
    };
  }, [taskStarted, taskFinished, currentStimulus]);

  useEffect(() => {
    if (!taskStarted || taskFinished) return;

    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleStimulusClick();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [taskStarted, taskFinished, currentStimulus]);

  const finishTask = () => {
    try {
      console.log('🏁 finishTask called');
      console.log('hitsRef.current:', hitsRef.current);
      console.log('missesRef.current:', missesRef.current);
      console.log('falseAlarmsRef.current:', falseAlarmsRef.current);
      console.log('reactionTimesRef.current:', reactionTimesRef.current);
      console.log('totalStimuliRef.current:', totalStimuliRef.current);
      
      setTaskFinished(true);
      setTaskStarted(false);
      setCurrentStimulus('');
      clearTimeout(stimulusTimeoutRef.current);
      clearTimeout(taskIntervalRef.current);

      const totalTrials = totalStimuliRef.current;
      const totalTargets = Math.round(totalTrials * targetProbabilityRef.current);
      const totalNonTargets = totalTrials - totalTargets;
      const correctRejections = totalNonTargets - falseAlarmsRef.current;
      
      console.log('totalTrials:', totalTrials, 'totalTargets:', totalTargets);
      
      // Accuracy = (Hits / Targets) * 100
      const accuracy = hitsRef.current + missesRef.current > 0 ? Math.round((hitsRef.current / (hitsRef.current + missesRef.current)) * 100) : 0;
      
      // calculateAverageReactionTime now returns a number (not a string)
      const avgRTNum = reactionTimesRef.current.length > 0 ? calculateAverageReactionTime(reactionTimesRef.current) : 0;

      const results = {
        totalTrials,
        totalTargets,
        totalNonTargets,
        hits: hitsRef.current,
        misses: missesRef.current,
        falseAlarms: falseAlarmsRef.current,
        correctRejections,
        accuracy,
        avgReactionTimeMs: avgRTNum,
        reactionTimesMs: reactionTimesRef.current.map(rt => parseFloat(rt.toFixed(2)))
      };

      console.log('📊 CPT Results object:', results);
      logResults('Continuous Performance Task (CPT)', results);
      console.log('✅ logResults called for CPT');
    } catch (error) {
      console.error('❌ ERROR in finishTask:', error);
      console.error('Stack:', error.stack);
    }
  };

  const resetTask = () => {
    setTaskStarted(false);
    setTaskFinished(false);
    setCurrentStimulus('');
    setStimulusCount(0);
    setHits(0);
    setMisses(0);
    setFalseAlarms(0);
    setReactionTimes([]);
    clearTimeout(stimulusTimeoutRef.current);
    clearTimeout(taskIntervalRef.current);
  };

  const totalTrials = stimulusCount;
  const totalTargets = Math.round(totalStimuliRef.current * targetProbabilityRef.current);
  const avgReactionTime = calculateAverageReactionTime(reactionTimes);

  return (
    <div className="task-container">
      <div className="task-header">
        <h2>Continuous Performance Task (CPT)</h2>
        <p className="task-description">
          Press <strong>SPACEBAR</strong> when you see the letter <strong>{targetLetter}</strong>.
          React as quickly as possible! The letter will change every 1.5 seconds.
        </p>
      </div>

      <div className="controls">
        <button
          className="btn btn-primary"
          onClick={startTask}
          disabled={taskStarted}
        >
          {taskStarted ? 'Task Running...' : 'Start Task'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={resetTask}
          disabled={!taskFinished && !taskStarted}
        >
          Reset
        </button>
      </div>

      <div className="stimulus-area" onClick={handleStimulusClick}>
        {currentStimulus || (taskFinished ? 'Task Complete' : 'Waiting...')}
      </div>

      <div className="stats-display">
        <div className="stat-card">
          <div className="stat-label">Progress</div>
          <div className="stat-value">{stimulusCount}/{totalStimuliRef.current}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Hits</div>
          <div className="stat-value">{hits}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Misses</div>
          <div className="stat-value">{misses}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">False Alarms</div>
          <div className="stat-value">{falseAlarms}</div>
        </div>
      </div>

      {taskFinished && (
        <div className="results-container">
          <h3>Task Results</h3>
          <div className="result-item">
            <strong>Total Trials:</strong> {totalStimuliRef.current}
          </div>
          <div className="result-item">
            <strong>Hits:</strong> {hits} (Correct responses to target)
          </div>
          <div className="result-item">
            <strong>Misses:</strong> {misses} (Missed target presentations)
          </div>
          <div className="result-item">
            <strong>False Alarms:</strong> {falseAlarms} (Responded to non-target)
          </div>
          <div className="result-item">
            <strong>Correct Rejections:</strong> {totalStimuliRef.current - totalTargets - falseAlarms}
          </div>
          <div className="result-item">
            <strong>Target Accuracy (Hits/Targets):</strong> {totalTargets > 0 ? Math.round((hits / totalTargets) * 100) : 0}%
          </div>
          <div className="result-item">
            <strong>Overall Performance:</strong> {hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0}%
          </div>
          <div className="result-item">
            <strong>Average Reaction Time:</strong> {reactionTimes.length > 0 ? formatTime(parseFloat(avgReactionTime)) : 'N/A'}
          </div>
          <div className="result-item" style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
            Hit Reaction Times (ms): {reactionTimes.length > 0 ? reactionTimes.map(rt => rt.toFixed(0)).join(', ') : 'N/A'}
          </div>
        </div>
      )}
    </div>
  );
};

export default CPTTask;
