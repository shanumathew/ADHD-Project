import React, { useState, useEffect, useRef } from 'react';
import { logResults, calculateAccuracy, calculateAverageReactionTime, formatTime } from '../utils/taskUtils';

/**
 * Go/No-Go Task
 * 
 * Display "Go" (green circle) and "No-Go" (red circle) stimuli randomly.
 * User must respond to Go only.
 * Tracks commission errors, omission errors, and reaction time.
 */

const GoNoGoTask = ({ onTaskStart, onTaskEnd }) => {
  const [taskStarted, setTaskStarted] = useState(false);
  const [taskFinished, setTaskFinished] = useState(false);
  const [currentStimulus, setCurrentStimulus] = useState(null);
  const [stimulusCount, setStimulusCount] = useState(0);
  
  const [goTrials, setGoTrials] = useState(0);
  const [nogoTrials, setNogoTrials] = useState(0);
  const [correctGo, setCorrectGo] = useState(0);
  const [omissionErrors, setOmissionErrors] = useState(0);
  const [commissionErrors, setCommissionErrors] = useState(0);
  const [correctReject, setCorrectReject] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  
  const goTrialsRef = useRef(0);
  const nogoTrialsRef = useRef(0);
  const correctGoRef = useRef(0);
  const omissionErrorsRef = useRef(0);
  const commissionErrorsRef = useRef(0);
  const correctRejectRef = useRef(0);
  const reactionTimesRef = useRef([]);
  
  const stimulusStartTimeRef = useRef(null);
  const stimulusTimeoutRef = useRef(null);
  const taskIntervalRef = useRef(null);
  const totalStimuliRef = useRef(60);
  const goProbabilityRef = useRef(0.7);
  const respondedRef = useRef(false);
  const currentCountRef = useRef(0);
  const currentStimulusRef = useRef(null);
  
  const startTask = () => {
    setTaskStarted(true);
    setTaskFinished(false);
    setGoTrials(0);
    setNogoTrials(0);
    setCorrectGo(0);
    setOmissionErrors(0);
    setCommissionErrors(0);
    setCorrectReject(0);
    setReactionTimes([]);
    setStimulusCount(0);
    
    goTrialsRef.current = 0;
    nogoTrialsRef.current = 0;
    correctGoRef.current = 0;
    omissionErrorsRef.current = 0;
    commissionErrorsRef.current = 0;
    correctRejectRef.current = 0;
    reactionTimesRef.current = [];
    currentCountRef.current = 0;
    
    if (onTaskStart) onTaskStart();
    presentNextStimulus();
  };

  const presentNextStimulus = () => {
    if (currentCountRef.current >= totalStimuliRef.current) {
      finishTask();
      return;
    }

    const isGo = Math.random() < goProbabilityRef.current;
    const stimulus = isGo ? 'go' : 'nogo';
    currentStimulusRef.current = stimulus;
    
    setCurrentStimulus(stimulus);
    respondedRef.current = false;
    stimulusStartTimeRef.current = performance.now();
    
    if (isGo) {
      goTrialsRef.current += 1;
      setGoTrials(prev => prev + 1);
    } else {
      nogoTrialsRef.current += 1;
      setNogoTrials(prev => prev + 1);
    }
    
    setStimulusCount(prev => prev + 1);
    currentCountRef.current += 1;
  };

  useEffect(() => {
    if (!taskStarted || taskFinished || !currentStimulus) return;

    if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
    if (taskIntervalRef.current) clearTimeout(taskIntervalRef.current);

    stimulusTimeoutRef.current = setTimeout(() => {
      const wasGo = currentStimulusRef.current === 'go';
      
      if (!respondedRef.current) {
        if (wasGo) {
          omissionErrorsRef.current += 1;
          setOmissionErrors(prev => prev + 1);
        } else {
          correctRejectRef.current += 1;
          setCorrectReject(prev => prev + 1);
        }
      }
      
      setCurrentStimulus(null);
    }, 2000);

    return () => {
      if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
      if (taskIntervalRef.current) clearTimeout(taskIntervalRef.current);
    };
  }, [taskStarted, taskFinished, currentStimulus]);

  useEffect(() => {
    if (!taskStarted || taskFinished || currentStimulus !== null) return;

    taskIntervalRef.current = setTimeout(() => {
      presentNextStimulus();
    }, 500);

    return () => {
      if (taskIntervalRef.current) clearTimeout(taskIntervalRef.current);
    };
  }, [taskStarted, taskFinished, currentStimulus]);

  const handleResponse = () => {
    if (!taskStarted || taskFinished || !currentStimulus || respondedRef.current) return;

    respondedRef.current = true;
    const reactionTime = performance.now() - stimulusStartTimeRef.current;

    clearTimeout(stimulusTimeoutRef.current);
    clearTimeout(taskIntervalRef.current);

    if (currentStimulus === 'go') {
      correctGoRef.current += 1;
      setCorrectGo(prev => prev + 1);
      reactionTimesRef.current.push(reactionTime);
      setReactionTimes(prev => [...prev, reactionTime]);
    } else {
      commissionErrorsRef.current += 1;
      setCommissionErrors(prev => prev + 1);
    }

    setCurrentStimulus(null);
    taskIntervalRef.current = setTimeout(presentNextStimulus, 500);
  };

  useEffect(() => {
    if (!taskStarted || taskFinished) return;

    const handleKeyPressCallback = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleResponse();
      }
    };

    window.addEventListener('keydown', handleKeyPressCallback);
    return () => window.removeEventListener('keydown', handleKeyPressCallback);
  }, [taskStarted, taskFinished, currentStimulus]);

  const finishTask = () => {
    setTaskFinished(true);
    setTaskStarted(false);
    setCurrentStimulus(null);
    clearTimeout(stimulusTimeoutRef.current);
    clearTimeout(taskIntervalRef.current);
    
    if (onTaskEnd) onTaskEnd();

    const results = {
      totalTrials: totalStimuliRef.current,
      goTrials: goTrialsRef.current,
      nogoTrials: nogoTrialsRef.current,
      correctGo: correctGoRef.current,
      omissionErrors: omissionErrorsRef.current,
      commissionErrors: commissionErrorsRef.current,
      correctReject: correctRejectRef.current,
      goAccuracy: calculateAccuracy(correctGoRef.current, goTrialsRef.current),
      nogoAccuracy: calculateAccuracy(correctRejectRef.current, nogoTrialsRef.current),
      averageReactionTime: calculateAverageReactionTime(reactionTimesRef.current),
      reactionTimes: reactionTimesRef.current
    };

    logResults('Go/No-Go Task', results);
  };

  const resetTask = () => {
    setTaskStarted(false);
    setTaskFinished(false);
    setCurrentStimulus(null);
    setStimulusCount(0);
    setGoTrials(0);
    setNogoTrials(0);
    setCorrectGo(0);
    setOmissionErrors(0);
    setCommissionErrors(0);
    setCorrectReject(0);
    setReactionTimes([]);
    clearTimeout(stimulusTimeoutRef.current);
    clearTimeout(taskIntervalRef.current);
    if (onTaskEnd) onTaskEnd();
  };

  const avgReactionTime = calculateAverageReactionTime(reactionTimes);
  const progressPercent = (stimulusCount / totalStimuliRef.current) * 100;

  return (
    <div className="task-container">
      <div className="task-header">
        <h2>Go/No-Go Task</h2>
        <p className="task-description">
          Press <span className="key-highlight">SPACE</span> when you see the <span style={{ color: '#2ecc71', fontWeight: 700 }}>GREEN</span> circle.
          <br />
          Do NOT press when you see the <span style={{ color: '#e74c3c', fontWeight: 700 }}>RED</span> circle.
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

      <div className="stimulus-area" onClick={handleResponse}>
        {currentStimulus ? (
          <div className={`stimulus-circle ${currentStimulus}`}>
            {currentStimulus === 'go' ? 'GO' : 'STOP'}
          </div>
        ) : (
          <span className={taskFinished ? 'stimulus-complete' : 'stimulus-waiting'}>
            {taskFinished ? 'Task Complete!' : 'Press Start to begin...'}
          </span>
        )}
      </div>

      <div className="keyboard-hints">
        <div className="keyboard-hint">
          <span className="keyboard-key">SPACE</span>
          <span>Press for GREEN only</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Go Trials</div>
          <div className="stat-value">{goTrials}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Correct Go</div>
          <div className="stat-value success">{correctGo}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Commission Err</div>
          <div className="stat-value error">{commissionErrors}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Omission Err</div>
          <div className="stat-value error">{omissionErrors}</div>
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
              <span className="result-label">Go Trials</span>
              <span className="result-value">{goTrials}</span>
            </div>
            <div className="result-item">
              <span className="result-label">No-Go Trials</span>
              <span className="result-value">{nogoTrials}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Correct Go</span>
              <span className="result-value good">{correctGo}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Omission Errors</span>
              <span className="result-value bad">{omissionErrors}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Commission Errors</span>
              <span className="result-value bad">{commissionErrors}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Correct Rejections</span>
              <span className="result-value good">{correctReject}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Go Accuracy</span>
              <span className="result-value">{calculateAccuracy(correctGo, goTrials)}%</span>
            </div>
            <div className="result-item">
              <span className="result-label">No-Go Accuracy</span>
              <span className="result-value">{calculateAccuracy(correctReject, nogoTrials)}%</span>
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

export default GoNoGoTask;
