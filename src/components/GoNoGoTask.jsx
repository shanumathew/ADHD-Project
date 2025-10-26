import React, { useState, useEffect, useRef } from 'react';
import { logResults, calculateAccuracy, calculateAverageReactionTime, formatTime } from '../utils/taskUtils';

/**
 * Go/No-Go Task
 * 
 * Display "Go" (green circle) and "No-Go" (red circle) stimuli randomly.
 * User must respond to Go only.
 * Tracks commission errors, omission errors, and reaction time.
 */

const GoNoGoTask = () => {
  const [taskStarted, setTaskStarted] = useState(false);
  const [taskFinished, setTaskFinished] = useState(false);
  const [currentStimulus, setCurrentStimulus] = useState(null); // 'go' or 'nogo'
  const [stimulusCount, setStimulusCount] = useState(0);
  
  // Results tracking
  const [goTrials, setGoTrials] = useState(0);
  const [nogoTrials, setNogoTrials] = useState(0);
  const [correctGo, setCorrectGo] = useState(0); // Responded to Go
  const [omissionErrors, setOmissionErrors] = useState(0); // Didn't respond to Go
  const [commissionErrors, setCommissionErrors] = useState(0); // Responded to No-Go
  const [correctReject, setCorrectReject] = useState(0); // Didn't respond to No-Go
  const [reactionTimes, setReactionTimes] = useState([]);
  
  // Refs for accurate result tracking (to avoid stale closures)
  const goTrialsRef = useRef(0);
  const nogoTrialsRef = useRef(0);
  const correctGoRef = useRef(0);
  const omissionErrorsRef = useRef(0);
  const commissionErrorsRef = useRef(0);
  const correctRejectRef = useRef(0);
  const reactionTimesRef = useRef([]);
  
  // State variables
  const stimulusStartTimeRef = useRef(null);
  const stimulusTimeoutRef = useRef(null);
  const taskIntervalRef = useRef(null);
  const totalStimuliRef = useRef(60);
  const goProbabilityRef = useRef(0.7); // 70% Go, 30% No-Go
  const respondedRef = useRef(false);
  const currentCountRef = useRef(0); // Track actual count for progression
  
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
    
    // Initialize refs
    goTrialsRef.current = 0;
    nogoTrialsRef.current = 0;
    correctGoRef.current = 0;
    omissionErrorsRef.current = 0;
    commissionErrorsRef.current = 0;
    correctRejectRef.current = 0;
    reactionTimesRef.current = [];
    
    currentCountRef.current = 0;
    presentNextStimulus();
  };

  // Store stimulus type in ref so we can reference it in cleanup
  const currentStimulusRef = useRef(null);

  const presentNextStimulus = () => {
    if (currentCountRef.current >= totalStimuliRef.current) {
      finishTask();
      return;
    }

    // 70% Go, 30% No-Go
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

  // Auto-advance when stimulus is visible and task is running
  useEffect(() => {
    if (!taskStarted || taskFinished || !currentStimulus) {
      return;
    }

    // Clear any pending timeouts
    if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
    if (taskIntervalRef.current) clearTimeout(taskIntervalRef.current);

    // Set timeout to clear stimulus after 2 seconds
    stimulusTimeoutRef.current = setTimeout(() => {
      const wasGo = currentStimulusRef.current === 'go';
      
      if (!respondedRef.current) {
        if (wasGo) {
          // Go trial with no response = omission error
          omissionErrorsRef.current += 1;
          setOmissionErrors(prev => prev + 1);
        } else {
          // No-Go trial with no response = correct rejection
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

  // Auto-present next stimulus after ISI when stimulus is cleared
  useEffect(() => {
    if (!taskStarted || taskFinished || currentStimulus !== null) {
      return;
    }

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
      // Go trial with response = correct - track RT only for correct Go responses
      correctGoRef.current += 1;
      setCorrectGo(prev => prev + 1);
      reactionTimesRef.current.push(reactionTime);
      setReactionTimes(prev => [...prev, reactionTime]);
    } else {
      // No-Go trial with response = commission error - don't track RT
      commissionErrorsRef.current += 1;
      setCommissionErrors(prev => prev + 1);
    }

    setCurrentStimulus(null);
    taskIntervalRef.current = setTimeout(presentNextStimulus, 500);
  };

  const handleKeyPress = (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      handleResponse();
    }
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
    return () => {
      window.removeEventListener('keydown', handleKeyPressCallback);
    };
  }, [taskStarted, taskFinished, currentStimulus]);

  const finishTask = () => {
    setTaskFinished(true);
    setTaskStarted(false);
    setCurrentStimulus(null);
    clearTimeout(stimulusTimeoutRef.current);
    clearTimeout(taskIntervalRef.current);

    const totalTrials = totalStimuliRef.current;
    const goAccuracy = calculateAccuracy(correctGoRef.current, goTrialsRef.current);
    const nogoAccuracy = calculateAccuracy(correctRejectRef.current, nogoTrialsRef.current);
    const avgRT = calculateAverageReactionTime(reactionTimesRef.current);

    const results = {
      totalTrials,
      goTrials: goTrialsRef.current,
      nogoTrials: nogoTrialsRef.current,
      correctGo: correctGoRef.current,
      omissionErrors: omissionErrorsRef.current,
      commissionErrors: commissionErrorsRef.current,
      correctReject: correctRejectRef.current,
      goAccuracy,
      nogoAccuracy,
      averageReactionTime: avgRT,
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
  };

  const avgReactionTime = calculateAverageReactionTime(reactionTimes);

  return (
    <div className="task-container">
      <div className="task-header">
        <h2>Go/No-Go Task</h2>
        <p className="task-description">
          Press <strong>SPACEBAR</strong> when you see a <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>GREEN</span> circle.
          <br />
          Do <strong>NOT</strong> press when you see a <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>RED</span> circle.
          <br />
          React as quickly as possible!
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

      <div className="stimulus-area">
        {currentStimulus ? (
          <div
            className="stimulus-circle"
            style={{
              backgroundColor: currentStimulus === 'go' ? '#2ecc71' : '#e74c3c'
            }}
            onClick={handleResponse}
          >
            {currentStimulus === 'go' ? 'GO' : 'NOGO'}
          </div>
        ) : (
          <span>{taskFinished ? 'Task Complete' : 'Waiting...'}</span>
        )}
      </div>

      <div className="stats-display">
        <div className="stat-card">
          <div className="stat-label">Progress</div>
          <div className="stat-value">{stimulusCount}/{totalStimuliRef.current}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Go Trials</div>
          <div className="stat-value">{goTrials}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">No-Go Trials</div>
          <div className="stat-value">{nogoTrials}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Correct Go</div>
          <div className="stat-value">{correctGo}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Commission Errors</div>
          <div className="stat-value" style={{ color: '#e74c3c' }}>{commissionErrors}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Omission Errors</div>
          <div className="stat-value" style={{ color: '#e74c3c' }}>{omissionErrors}</div>
        </div>
      </div>

      {taskFinished && (
        <div className="results-container">
          <h3>Task Results</h3>
          <div className="result-item">
            <strong>Total Trials:</strong> {totalStimuliRef.current}
          </div>
          <div className="result-item">
            <strong>Go Trials:</strong> {goTrials}
          </div>
          <div className="result-item">
            <strong>No-Go Trials:</strong> {nogoTrials}
          </div>
          <div className="result-item">
            <strong>Correct Go Responses:</strong> {correctGo}
          </div>
          <div className="result-item">
            <strong>Omission Errors (missed Go):</strong> {omissionErrors}
          </div>
          <div className="result-item">
            <strong>Commission Errors (wrong No-Go response):</strong> {commissionErrors}
          </div>
          <div className="result-item">
            <strong>Correct Rejections (No-Go):</strong> {correctReject}
          </div>
          <div className="result-item">
            <strong>Go Accuracy:</strong> {calculateAccuracy(correctGo, goTrials)}%
          </div>
          <div className="result-item">
            <strong>No-Go Accuracy:</strong> {calculateAccuracy(correctReject, nogoTrials)}%
          </div>
          <div className="result-item">
            <strong>Average Reaction Time:</strong> {reactionTimes.length > 0 ? formatTime(parseFloat(avgReactionTime)) : 'N/A'}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoNoGoTask;
