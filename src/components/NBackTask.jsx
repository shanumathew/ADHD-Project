import React, { useState, useEffect, useRef } from 'react';
import { logResults, calculateAverageReactionTime, formatTime } from '../utils/taskUtils';

/**
 * N-Back Task
 * 
 * Present a sequence of letters one by one.
 * User indicates if current item matches the one n steps back.
 */

const NBackTask = ({ onTaskStart, onTaskEnd }) => {
  const [taskStarted, setTaskStarted] = useState(false);
  const [taskFinished, setTaskFinished] = useState(false);
  const [nBackLevel, setNBackLevel] = useState(2);
  const [currentStimulus, setCurrentStimulus] = useState('');
  const [stimulusIndex, setStimulusIndex] = useState(0);
  const [stimulusSequence, setStimulusSequence] = useState([]);
  
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [falseAlarms, setFalseAlarms] = useState(0);
  const [correctRejections, setCorrectRejections] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  
  const hitsRef = useRef(0);
  const missesRef = useRef(0);
  const falseAlarmsRef = useRef(0);
  const correctRejectionsRef = useRef(0);
  const reactionTimesRef = useRef([]);
  
  const stimulusStartTimeRef = useRef(null);
  const stimulusTimeoutRef = useRef(null);
  const taskIntervalRef = useRef(null);
  const totalStimuliRef = useRef(25);
  const respondedRef = useRef(false);
  const currentCountRef = useRef(0);
  
  const generateSequence = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const sequence = [];
    for (let i = 0; i < totalStimuliRef.current; i++) {
      sequence.push(letters[Math.floor(Math.random() * letters.length)]);
    }
    return sequence;
  };

  const startTask = () => {
    if (nBackLevel < 1 || nBackLevel > 3) {
      alert('N-Back level must be between 1 and 3');
      return;
    }

    const sequence = generateSequence();
    setStimulusSequence(sequence);
    setTaskStarted(true);
    setTaskFinished(false);
    setHits(0);
    setMisses(0);
    setFalseAlarms(0);
    setCorrectRejections(0);
    setReactionTimes([]);
    setStimulusIndex(0);
    
    hitsRef.current = 0;
    missesRef.current = 0;
    falseAlarmsRef.current = 0;
    correctRejectionsRef.current = 0;
    reactionTimesRef.current = [];
    currentCountRef.current = 0;
    respondedRef.current = false;
    
    if (onTaskStart) onTaskStart();
    presentNextStimulus(sequence, 0);
  };

  const presentNextStimulus = (sequence, index) => {
    if (!sequence || index >= sequence.length || currentCountRef.current >= totalStimuliRef.current) {
      finishTask();
      return;
    }

    const stimulus = sequence[index];
    setCurrentStimulus(stimulus);
    respondedRef.current = false;
    stimulusStartTimeRef.current = performance.now();
    setStimulusIndex(index);
    currentCountRef.current += 1;
  };

  useEffect(() => {
    if (!taskStarted || taskFinished || !currentStimulus) return;

    if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
    if (taskIntervalRef.current) clearTimeout(taskIntervalRef.current);

    const shouldMatch = stimulusIndex >= nBackLevel && stimulusSequence[stimulusIndex] === stimulusSequence[stimulusIndex - nBackLevel];
    let timerFired = false;

    stimulusTimeoutRef.current = setTimeout(() => {
      timerFired = true;
      if (!respondedRef.current) {
        if (shouldMatch) {
          setMisses(prev => prev + 1);
        } else {
          setCorrectRejections(prev => prev + 1);
        }
      }
      setCurrentStimulus('');
    }, 2500);

    return () => {
      if (!timerFired && !respondedRef.current) {
        if (shouldMatch) {
          setMisses(prev => prev + 1);
        } else {
          setCorrectRejections(prev => prev + 1);
        }
      }
      if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
      if (taskIntervalRef.current) clearTimeout(taskIntervalRef.current);
    };
  }, [taskStarted, taskFinished, currentStimulus, stimulusIndex, nBackLevel, stimulusSequence]);

  useEffect(() => {
    if (!taskStarted || taskFinished || currentStimulus !== '') return;

    taskIntervalRef.current = setTimeout(() => {
      presentNextStimulus(stimulusSequence, stimulusIndex + 1);
    }, 500);

    return () => {
      if (taskIntervalRef.current) clearTimeout(taskIntervalRef.current);
    };
  }, [taskStarted, taskFinished, currentStimulus, stimulusSequence, stimulusIndex]);

  const handleMatch = () => {
    if (!taskStarted || taskFinished || !currentStimulus || respondedRef.current) return;

    respondedRef.current = true;
    const reactionTime = performance.now() - stimulusStartTimeRef.current;

    clearTimeout(stimulusTimeoutRef.current);
    clearTimeout(taskIntervalRef.current);

    const shouldMatch = stimulusIndex >= nBackLevel && stimulusSequence[stimulusIndex] === stimulusSequence[stimulusIndex - nBackLevel];

    if (shouldMatch) {
      hitsRef.current += 1;
      setHits(prev => prev + 1);
      reactionTimesRef.current.push(reactionTime);
      setReactionTimes(prev => [...prev, reactionTime]);
    } else {
      falseAlarmsRef.current += 1;
      setFalseAlarms(prev => prev + 1);
    }

    setCurrentStimulus('');
    taskIntervalRef.current = setTimeout(() => presentNextStimulus(stimulusSequence, stimulusIndex + 1), 500);
  };

  const handleNoMatch = () => {
    if (!taskStarted || taskFinished || !currentStimulus || respondedRef.current) return;

    respondedRef.current = true;
    const reactionTime = performance.now() - stimulusStartTimeRef.current;

    clearTimeout(stimulusTimeoutRef.current);
    clearTimeout(taskIntervalRef.current);

    const shouldMatch = stimulusIndex >= nBackLevel && stimulusSequence[stimulusIndex] === stimulusSequence[stimulusIndex - nBackLevel];

    if (!shouldMatch) {
      correctRejectionsRef.current += 1;
      setCorrectRejections(prev => prev + 1);
      reactionTimesRef.current.push(reactionTime);
      setReactionTimes(prev => [...prev, reactionTime]);
    } else {
      missesRef.current += 1;
      setMisses(prev => prev + 1);
    }

    setCurrentStimulus('');
    taskIntervalRef.current = setTimeout(() => presentNextStimulus(stimulusSequence, stimulusIndex + 1), 500);
  };

  useEffect(() => {
    if (!taskStarted || taskFinished) return;

    const handleKeyPressCallback = (e) => {
      if (e.key === '1' || e.key === 'ArrowUp') {
        e.preventDefault();
        handleMatch();
      } else if (e.key === '2' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleNoMatch();
      }
    };

    window.addEventListener('keydown', handleKeyPressCallback);
    return () => window.removeEventListener('keydown', handleKeyPressCallback);
  }, [taskStarted, taskFinished, currentStimulus]);

  const finishTask = () => {
    setTaskFinished(true);
    setTaskStarted(false);
    setCurrentStimulus('');
    clearTimeout(stimulusTimeoutRef.current);
    clearTimeout(taskIntervalRef.current);
    
    if (onTaskEnd) onTaskEnd();

    const totalMatches = stimulusSequence.filter((item, index) => 
      index >= nBackLevel && item === stimulusSequence[index - nBackLevel]
    ).length;

    const accuracy = hitsRef.current + correctRejectionsRef.current + missesRef.current + falseAlarmsRef.current > 0 
      ? Math.round(((hitsRef.current + correctRejectionsRef.current) / (hitsRef.current + correctRejectionsRef.current + missesRef.current + falseAlarmsRef.current)) * 100)
      : 0;

    const results = {
      nBackLevel,
      totalTrials: totalStimuliRef.current,
      hits: hitsRef.current,
      misses: missesRef.current,
      falseAlarms: falseAlarmsRef.current,
      correctRejections: correctRejectionsRef.current,
      totalMatches,
      accuracy,
      averageReactionTime: calculateAverageReactionTime(reactionTimesRef.current),
      averageReactionTimeMs: calculateAverageReactionTime(reactionTimesRef.current),
      reactionTimesMs: reactionTimesRef.current,
      sequence: stimulusSequence.join('')
    };

    logResults(`N-Back Task (${nBackLevel}-Back)`, results);
  };

  const resetTask = () => {
    setTaskStarted(false);
    setTaskFinished(false);
    setCurrentStimulus('');
    setStimulusIndex(0);
    setStimulusSequence([]);
    setHits(0);
    setMisses(0);
    setFalseAlarms(0);
    setCorrectRejections(0);
    setReactionTimes([]);
    clearTimeout(stimulusTimeoutRef.current);
    clearTimeout(taskIntervalRef.current);
    if (onTaskEnd) onTaskEnd();
  };

  const totalMatches = stimulusSequence.filter((item, index) => 
    index >= nBackLevel && item === stimulusSequence[index - nBackLevel]
  ).length;
  const avgReactionTime = calculateAverageReactionTime(reactionTimes);
  const progressPercent = (stimulusIndex / totalStimuliRef.current) * 100;

  return (
    <div className="task-container">
      <div className="task-header">
        <h2>N-Back Task</h2>
        <p className="task-description">
          Letters will appear one by one. Press <span className="key-highlight">↑</span> or <span className="key-highlight">1</span> if the letter <strong>MATCHES</strong> the one {nBackLevel} step{nBackLevel > 1 ? 's' : ''} back.
          Press <span className="key-highlight">↓</span> or <span className="key-highlight">2</span> if it does <strong>NOT</strong> match.
        </p>
      </div>

      <div className="task-controls">
        <div className="task-select-wrapper">
          <span className="task-select-label">Level:</span>
          <select
            value={nBackLevel}
            onChange={(e) => setNBackLevel(parseInt(e.target.value))}
            disabled={taskStarted || taskFinished}
            className="task-select"
          >
            <option value={1}>1-Back</option>
            <option value={2}>2-Back</option>
            <option value={3}>3-Back</option>
          </select>
        </div>
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
          <span className="progress-count">{stimulusIndex} / {totalStimuliRef.current}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className={`stimulus-area ${taskStarted && currentStimulus ? 'active' : ''}`}>
        {currentStimulus ? (
          <span>{currentStimulus}</span>
        ) : (
          <span className={taskFinished ? 'stimulus-complete' : 'stimulus-waiting'}>
            {taskFinished ? 'Task Complete!' : 'Press Start to begin...'}
          </span>
        )}
      </div>

      <div className="response-buttons">
        <button
          className="response-btn match"
          onClick={handleMatch}
          disabled={!taskStarted || taskFinished || !currentStimulus}
        >
          <span className="response-btn-icon">↑</span>
          <span className="response-btn-text">Match (1)</span>
        </button>
        <button
          className="response-btn nomatch"
          onClick={handleNoMatch}
          disabled={!taskStarted || taskFinished || !currentStimulus}
        >
          <span className="response-btn-icon">↓</span>
          <span className="response-btn-text">No Match (2)</span>
        </button>
      </div>

      <div className="keyboard-hints">
        <div className="keyboard-hint">
          <span className="keyboard-key">↑</span> or <span className="keyboard-key">1</span>
          <span>Match</span>
        </div>
        <div className="keyboard-hint">
          <span className="keyboard-key">↓</span> or <span className="keyboard-key">2</span>
          <span>No Match</span>
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
          <div className="stat-label">Correct Rej.</div>
          <div className="stat-value success">{correctRejections}</div>
        </div>
      </div>

      {taskFinished && (
        <div className="results-container">
          <div className="results-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h3>Task Results ({nBackLevel}-Back)</h3>
          </div>
          <div className="results-body">
            <div className="result-item">
              <span className="result-label">Total Trials</span>
              <span className="result-value">{totalStimuliRef.current}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Matches</span>
              <span className="result-value">{totalMatches}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Hits</span>
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
              <span className="result-value good">{correctRejections}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Accuracy</span>
              <span className="result-value">{((hits + correctRejections + misses + falseAlarms > 0) ? Math.round(((hits + correctRejections) / (hits + correctRejections + misses + falseAlarms)) * 100) : 0)}%</span>
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

export default NBackTask;
