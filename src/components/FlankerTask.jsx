import React, { useState, useEffect, useRef } from 'react';
import { logResults, calculateAccuracy, calculateAverageReactionTime, formatTime } from '../utils/taskUtils';

/**
 * Flanker Task
 * 
 * Show a central target (arrow) with surrounding distractors.
 * User must identify the direction of the central target.
 */

const FlankerTask = ({ onTaskStart, onTaskEnd }) => {
  const [taskStarted, setTaskStarted] = useState(false);
  const [taskFinished, setTaskFinished] = useState(false);
  const [currentTrial, setCurrentTrial] = useState(null);
  const [trialIndex, setTrialIndex] = useState(0);
  
  const [congruentCorrect, setCongruentCorrect] = useState(0);
  const [congruentTotal, setCongruentTotal] = useState(0);
  const [incongruentCorrect, setIncongruentCorrect] = useState(0);
  const [incongruentTotal, setIncongruentTotal] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [congruentRTimes, setCongruentRTimes] = useState([]);
  const [incongruentRTimes, setIncongruentRTimes] = useState([]);
  
  const congruentCorrectRef = useRef(0);
  const congruentTotalRef = useRef(0);
  const incongruentCorrectRef = useRef(0);
  const incongruentTotalRef = useRef(0);
  const reactionTimesRef = useRef([]);
  const congruentRTimesRef = useRef([]);
  const incongruentRTimesRef = useRef([]);
  
  const stimulusStartTimeRef = useRef(null);
  const stimulusTimeoutRef = useRef(null);
  const taskIntervalRef = useRef(null);
  const totalTrialsRef = useRef(40);
  const respondedRef = useRef(false);
  const currentCountRef = useRef(0);
  
  const generateTrial = (isCongruent) => {
    const directions = ['<', '>'];
    const targetIndex = Math.floor(Math.random() * 2);
    const target = directions[targetIndex];
    
    let distractors;
    if (isCongruent) {
      distractors = [target, target, target, target];
    } else {
      distractors = [
        directions[1 - targetIndex],
        directions[1 - targetIndex],
        directions[1 - targetIndex],
        directions[1 - targetIndex]
      ];
    }
    
    return { target, distractors, isCongruent, correctAnswer: target };
  };

  const startTask = () => {
    setTaskStarted(true);
    setTaskFinished(false);
    setCongruentCorrect(0);
    setCongruentTotal(0);
    setIncongruentCorrect(0);
    setIncongruentTotal(0);
    setReactionTimes([]);
    setCongruentRTimes([]);
    setIncongruentRTimes([]);
    setTrialIndex(0);
    
    congruentCorrectRef.current = 0;
    congruentTotalRef.current = 0;
    incongruentCorrectRef.current = 0;
    incongruentTotalRef.current = 0;
    reactionTimesRef.current = [];
    congruentRTimesRef.current = [];
    incongruentRTimesRef.current = [];
    currentCountRef.current = 0;
    
    if (onTaskStart) onTaskStart();
    presentNextTrial(0);
  };

  const presentNextTrial = (index) => {
    if (currentCountRef.current >= totalTrialsRef.current) {
      finishTask();
      return;
    }

    const isCongruent = index % 2 === 0;
    const trial = generateTrial(isCongruent);
    
    setCurrentTrial(trial);
    respondedRef.current = false;
    stimulusStartTimeRef.current = performance.now();
    setTrialIndex(index);
    currentCountRef.current += 1;

    if (isCongruent) {
      setCongruentTotal(prev => prev + 1);
    } else {
      setIncongruentTotal(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (!taskStarted || taskFinished || !currentTrial) return;

    if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
    if (taskIntervalRef.current) clearTimeout(taskIntervalRef.current);

    stimulusTimeoutRef.current = setTimeout(() => {
      setCurrentTrial(null);
    }, 3000);

    return () => {
      if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
      if (taskIntervalRef.current) clearTimeout(taskIntervalRef.current);
    };
  }, [taskStarted, taskFinished, currentTrial]);

  useEffect(() => {
    if (!taskStarted || taskFinished || currentTrial !== null) return;

    taskIntervalRef.current = setTimeout(() => {
      presentNextTrial(trialIndex + 1);
    }, 500);

    return () => {
      if (taskIntervalRef.current) clearTimeout(taskIntervalRef.current);
    };
  }, [taskStarted, taskFinished, currentTrial, trialIndex]);

  const handleResponse = (direction) => {
    if (!taskStarted || taskFinished || !currentTrial || respondedRef.current) return;

    respondedRef.current = true;
    const reactionTime = performance.now() - stimulusStartTimeRef.current;

    clearTimeout(stimulusTimeoutRef.current);
    clearTimeout(taskIntervalRef.current);

    const isCorrect = direction === currentTrial.correctAnswer;

    if (currentTrial.isCongruent) {
      congruentTotalRef.current += 1;
      setCongruentTotal(prev => prev + 1);
      if (isCorrect) {
        congruentCorrectRef.current += 1;
        setCongruentCorrect(prev => prev + 1);
        reactionTimesRef.current.push(reactionTime);
        setReactionTimes(prev => [...prev, reactionTime]);
        congruentRTimesRef.current.push(reactionTime);
        setCongruentRTimes(prev => [...prev, reactionTime]);
      }
    } else {
      incongruentTotalRef.current += 1;
      setIncongruentTotal(prev => prev + 1);
      if (isCorrect) {
        incongruentCorrectRef.current += 1;
        setIncongruentCorrect(prev => prev + 1);
        reactionTimesRef.current.push(reactionTime);
        setReactionTimes(prev => [...prev, reactionTime]);
        incongruentRTimesRef.current.push(reactionTime);
        setIncongruentRTimes(prev => [...prev, reactionTime]);
      }
    }

    setCurrentTrial(null);
    taskIntervalRef.current = setTimeout(() => presentNextTrial(trialIndex + 1), 500);
  };

  useEffect(() => {
    if (!taskStarted || taskFinished) return;

    const handleKeyPressCallback = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleResponse('<');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleResponse('>');
      }
    };

    window.addEventListener('keydown', handleKeyPressCallback);
    return () => window.removeEventListener('keydown', handleKeyPressCallback);
  }, [taskStarted, taskFinished, currentTrial]);

  const finishTask = () => {
    setTaskFinished(true);
    setTaskStarted(false);
    setCurrentTrial(null);
    clearTimeout(stimulusTimeoutRef.current);
    clearTimeout(taskIntervalRef.current);
    
    if (onTaskEnd) onTaskEnd();

    const totalCorrect = congruentCorrectRef.current + incongruentCorrectRef.current;
    const totalTrials = totalTrialsRef.current;
    const congruencyEffect = calculateAverageReactionTime(incongruentRTimesRef.current) - calculateAverageReactionTime(congruentRTimesRef.current);

    const results = {
      totalTrials,
      congruentTotal: congruentTotalRef.current,
      incongruentTotal: incongruentTotalRef.current,
      congruentCorrect: congruentCorrectRef.current,
      incongruentCorrect: incongruentCorrectRef.current,
      totalCorrect,
      congruentAccuracy: calculateAccuracy(congruentCorrectRef.current, congruentTotalRef.current),
      incongruentAccuracy: calculateAccuracy(incongruentCorrectRef.current, incongruentTotalRef.current),
      overallAccuracy: calculateAccuracy(totalCorrect, totalTrials),
      averageReactionTime: calculateAverageReactionTime(reactionTimesRef.current),
      congruentAvgRT: calculateAverageReactionTime(congruentRTimesRef.current),
      incongruentAvgRT: calculateAverageReactionTime(incongruentRTimesRef.current),
      congruencyEffect: congruencyEffect.toFixed(2),
      reactionTimes: reactionTimesRef.current
    };

    const taskConfig = {
      taskName: 'Flanker Task',
      totalTrials: totalTrialsRef.current,
      stimulusDuration: '3000ms',
      interTrialInterval: '500ms',
      targetStimulus: 'Center Arrow',
      distractorStimulus: 'Surrounding Arrows'
    };

    logResults('Flanker Task', results, taskConfig);
  };

  const resetTask = () => {
    setTaskStarted(false);
    setTaskFinished(false);
    setCurrentTrial(null);
    setTrialIndex(0);
    setCongruentCorrect(0);
    setCongruentTotal(0);
    setIncongruentCorrect(0);
    setIncongruentTotal(0);
    setReactionTimes([]);
    setCongruentRTimes([]);
    setIncongruentRTimes([]);
    clearTimeout(stimulusTimeoutRef.current);
    clearTimeout(taskIntervalRef.current);
    if (onTaskEnd) onTaskEnd();
  };

  const avgReactionTime = calculateAverageReactionTime(reactionTimes);
  const totalCorrect = congruentCorrect + incongruentCorrect;
  const totalTrials = totalTrialsRef.current;
  const progressPercent = (trialIndex / totalTrialsRef.current) * 100;

  return (
    <div className="task-container">
      <div className="task-header">
        <h2>Flanker Task</h2>
        <p className="task-description">
          Identify the direction of the <strong>CENTER ARROW</strong> (ignore surrounding arrows).
          Press <span className="key-highlight">←</span> for left or <span className="key-highlight">→</span> for right.
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
          <span className="progress-count">{trialIndex} / {totalTrialsRef.current}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className={`stimulus-area ${taskStarted && currentTrial ? 'active' : ''}`}>
        {currentTrial ? (
          <div className="flanker-display">
            <span className="flanker-arrow distractor">{currentTrial.distractors[0]}</span>
            <span className="flanker-arrow distractor">{currentTrial.distractors[1]}</span>
            <span className="flanker-arrow target">{currentTrial.target}</span>
            <span className="flanker-arrow distractor">{currentTrial.distractors[2]}</span>
            <span className="flanker-arrow distractor">{currentTrial.distractors[3]}</span>
          </div>
        ) : (
          <span className={taskFinished ? 'stimulus-complete' : 'stimulus-waiting'}>
            {taskFinished ? 'Task Complete!' : 'Press Start to begin...'}
          </span>
        )}
      </div>

      <div className="response-buttons">
        <button
          className="response-btn left"
          onClick={() => handleResponse('<')}
          disabled={!taskStarted || taskFinished || !currentTrial}
        >
          <span className="response-btn-icon">←</span>
          <span className="response-btn-text">Left</span>
        </button>
        <button
          className="response-btn right"
          onClick={() => handleResponse('>')}
          disabled={!taskStarted || taskFinished || !currentTrial}
        >
          <span className="response-btn-icon">→</span>
          <span className="response-btn-text">Right</span>
        </button>
      </div>

      <div className="keyboard-hints">
        <div className="keyboard-hint">
          <span className="keyboard-key">←</span>
          <span>Left Arrow</span>
        </div>
        <div className="keyboard-hint">
          <span className="keyboard-key">→</span>
          <span>Right Arrow</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Congruent</div>
          <div className="stat-value">{congruentCorrect}/{congruentTotal}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Incongruent</div>
          <div className="stat-value">{incongruentCorrect}/{incongruentTotal}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Correct</div>
          <div className="stat-value success">{totalCorrect}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Accuracy</div>
          <div className="stat-value">{calculateAccuracy(totalCorrect, trialIndex)}%</div>
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
              <span className="result-value">{totalTrialsRef.current}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Congruent Trials</span>
              <span className="result-value">{congruentTotal} (Correct: {congruentCorrect})</span>
            </div>
            <div className="result-item">
              <span className="result-label">Incongruent Trials</span>
              <span className="result-value">{incongruentTotal} (Correct: {incongruentCorrect})</span>
            </div>
            <div className="result-item">
              <span className="result-label">Overall Accuracy</span>
              <span className="result-value good">{calculateAccuracy(totalCorrect, totalTrials)}%</span>
            </div>
            <div className="result-item">
              <span className="result-label">Congruent Accuracy</span>
              <span className="result-value">{calculateAccuracy(congruentCorrect, congruentTotal)}%</span>
            </div>
            <div className="result-item">
              <span className="result-label">Incongruent Accuracy</span>
              <span className="result-value">{calculateAccuracy(incongruentCorrect, incongruentTotal)}%</span>
            </div>
            <div className="result-item">
              <span className="result-label">Avg RT (Overall)</span>
              <span className="result-value">{reactionTimes.length > 0 ? formatTime(parseFloat(avgReactionTime)) : 'N/A'}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Avg RT (Congruent)</span>
              <span className="result-value">{congruentRTimes.length > 0 ? formatTime(parseFloat(calculateAverageReactionTime(congruentRTimes))) : 'N/A'}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Avg RT (Incongruent)</span>
              <span className="result-value">{incongruentRTimes.length > 0 ? formatTime(parseFloat(calculateAverageReactionTime(incongruentRTimes))) : 'N/A'}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Congruency Effect</span>
              <span className="result-value">{reactionTimes.length > 0 ? (parseFloat(calculateAverageReactionTime(incongruentRTimes) - calculateAverageReactionTime(congruentRTimes)).toFixed(2) > 0 ? '+' : '') + parseFloat(calculateAverageReactionTime(incongruentRTimes) - calculateAverageReactionTime(congruentRTimes)).toFixed(2) + 'ms' : 'N/A'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlankerTask;
