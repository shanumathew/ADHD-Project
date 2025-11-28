import React, { useState, useEffect, useRef } from 'react';
import { logResults, calculateAverageReactionTime, formatTime } from '../utils/taskUtils';

/**
 * Continuous Performance Task (CPT)
 * 
 * The user must press a key only for the target letter (e.g., "X").
 * Tracks hits, misses, false alarms, and reaction time.
 */

const CPTTask = ({ onTaskStart, onTaskEnd }) => {
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
  const targetProbabilityRef = useRef(0.25);
  const currentCountRef = useRef(0);
  const isTargetRef = useRef(false);
  const respondedRef = useRef(false);
  
  const startTask = () => {
    setTaskStarted(true);
    setTaskFinished(false);
    setHits(0);
    setMisses(0);
    setFalseAlarms(0);
    setReactionTimes([]);
    
    hitsRef.current = 0;
    missesRef.current = 0;
    falseAlarmsRef.current = 0;
    reactionTimesRef.current = [];
    
    setStimulusCount(0);
    currentCountRef.current = 0;
    
    if (onTaskStart) onTaskStart();
    presentNextStimulus();
  };

  const presentNextStimulus = () => {
    if (currentCountRef.current >= totalStimuliRef.current) {
      finishTask();
      return;
    }

    const isTarget = Math.random() < targetProbabilityRef.current;
    isTargetRef.current = isTarget;
    respondedRef.current = false;
    
    let stimulus;
    if (isTarget) {
      stimulus = targetLetter;
    } else {
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

    respondedRef.current = true;
    const reactionTime = performance.now() - stimulusStartTimeRef.current;

    clearTimeout(stimulusTimeoutRef.current);
    clearTimeout(taskIntervalRef.current);

    if (currentStimulus === targetLetter) {
      hitsRef.current += 1;
      setHits(prev => prev + 1);
      reactionTimesRef.current.push(reactionTime);
      setReactionTimes(prev => [...prev, reactionTime]);
    } else {
      falseAlarmsRef.current += 1;
      setFalseAlarms(prev => prev + 1);
    }

    setCurrentStimulus('');
    taskIntervalRef.current = setTimeout(presentNextStimulus, 500);
  };

  useEffect(() => {
    if (!taskStarted || taskFinished || !currentStimulus) return;

    if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
    if (taskIntervalRef.current) clearTimeout(taskIntervalRef.current);

    let timerFired = false;

    stimulusTimeoutRef.current = setTimeout(() => {
      timerFired = true;
      if (!respondedRef.current && isTargetRef.current) {
        missesRef.current += 1;
        setMisses(prev => prev + 1);
      }
      setCurrentStimulus('');
    }, 1500);

    return () => {
      if (!timerFired && !respondedRef.current && isTargetRef.current) {
        missesRef.current += 1;
        setMisses(prev => prev + 1);
      }
      if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
      if (taskIntervalRef.current) clearTimeout(taskIntervalRef.current);
    };
  }, [taskStarted, taskFinished, currentStimulus]);

  useEffect(() => {
    if (!taskStarted || taskFinished || currentStimulus !== '') return;

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
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [taskStarted, taskFinished, currentStimulus]);

  const finishTask = () => {
    setTaskFinished(true);
    setTaskStarted(false);
    setCurrentStimulus('');
    clearTimeout(stimulusTimeoutRef.current);
    clearTimeout(taskIntervalRef.current);
    
    if (onTaskEnd) onTaskEnd();

    const totalTrials = totalStimuliRef.current;
    const totalTargets = Math.round(totalTrials * targetProbabilityRef.current);
    const totalNonTargets = totalTrials - totalTargets;
    const correctRejections = totalNonTargets - falseAlarmsRef.current;
    const accuracy = hitsRef.current + missesRef.current > 0 ? Math.round((hitsRef.current / (hitsRef.current + missesRef.current)) * 100) : 0;
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

    logResults('Continuous Performance Task (CPT)', results);
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
    if (onTaskEnd) onTaskEnd();
  };

  const totalTargets = Math.round(totalStimuliRef.current * targetProbabilityRef.current);
  const avgReactionTime = calculateAverageReactionTime(reactionTimes);
  const progressPercent = (stimulusCount / totalStimuliRef.current) * 100;

  return (
    <div className="task-container">
      <div className="task-header">
        <h2>Continuous Performance Task</h2>
        <p className="task-description">
          Press <span className="key-highlight">SPACE</span> when you see the letter <strong>{targetLetter}</strong>.
          React as quickly as possible! Letters change every 1.5 seconds.
        </p>
      </div>

      <div className="task-controls">
        <button
          className="task-btn task-btn-primary"
          onClick={startTask}
          disabled={taskStarted}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          {taskStarted ? 'Running...' : 'Start Task'}
        </button>
        <button
          className="task-btn task-btn-secondary"
          onClick={resetTask}
          disabled={!taskFinished && !taskStarted}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          Reset
        </button>
      </div>

      <div className="progress-section">
        <div className="progress-info">
          <span className="progress-label">Progress</span>
          <span className="progress-count">{stimulusCount} / {totalStimuliRef.current}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div 
        className={`stimulus-area ${taskStarted && currentStimulus ? 'active' : ''}`} 
        onClick={handleStimulusClick}
      >
        {currentStimulus ? (
          <span style={{ color: currentStimulus === targetLetter ? '#667eea' : '#fff' }}>
            {currentStimulus}
          </span>
        ) : (
          <span className={taskFinished ? 'stimulus-complete' : 'stimulus-waiting'}>
            {taskFinished ? 'Task Complete!' : 'Press Start to begin...'}
          </span>
        )}
      </div>

      <div className="keyboard-hints">
        <div className="keyboard-hint">
          <span className="keyboard-key">SPACE</span>
          <span>Press when you see "{targetLetter}"</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Hits</div>
          <div className="stat-value success">{hits}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Misses</div>
          <div className="stat-value error">{misses}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">False Alarms</div>
          <div className="stat-value error">{falseAlarms}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg RT</div>
          <div className="stat-value highlight">
            {reactionTimes.length > 0 ? `${Math.round(avgReactionTime)}ms` : '—'}
          </div>
        </div>
      </div>

      {taskFinished && (
        <div className="results-container">
          <div className="results-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h3>Task Results</h3>
          </div>
          <div className="results-body">
            <div className="result-item">
              <span className="result-label">Total Trials</span>
              <span className="result-value">{totalStimuliRef.current}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Targets</span>
              <span className="result-value">{totalTargets}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Hits (Correct)</span>
              <span className="result-value good">{hits}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Misses</span>
              <span className="result-value bad">{misses}</span>
            </div>
            <div className="result-item">
              <span className="result-label">False Alarms</span>
              <span className="result-value bad">{falseAlarms}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Correct Rejections</span>
              <span className="result-value good">{totalStimuliRef.current - totalTargets - falseAlarms}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Target Accuracy</span>
              <span className="result-value">{totalTargets > 0 ? Math.round((hits / totalTargets) * 100) : 0}%</span>
            </div>
            <div className="result-item">
              <span className="result-label">Avg Reaction Time</span>
              <span className="result-value">{reactionTimes.length > 0 ? formatTime(parseFloat(avgReactionTime)) : 'N/A'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CPTTask;
