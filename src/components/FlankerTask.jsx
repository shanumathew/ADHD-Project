import React, { useState, useEffect, useRef } from 'react';
import { logResults, calculateAccuracy, calculateAverageReactionTime, formatTime } from '../utils/taskUtils';

/**
 * Flanker Task
 * 
 * Show a central target (arrow or letter) with surrounding distractors.
 * User must identify the direction of the central target.
 * Tracks accuracy and reaction time, including congruent/incongruent trials.
 */

const FlankerTask = () => {
  const [taskStarted, setTaskStarted] = useState(false);
  const [taskFinished, setTaskFinished] = useState(false);
  const [currentTrial, setCurrentTrial] = useState(null); // { target, distractors, isCongruent }
  const [trialIndex, setTrialIndex] = useState(0);
  
  // Results tracking
  const [congruentCorrect, setCongruentCorrect] = useState(0);
  const [congruentTotal, setCongruentTotal] = useState(0);
  const [incongruentCorrect, setIncongruentCorrect] = useState(0);
  const [incongruentTotal, setIncongruentTotal] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [congruentRTimes, setCongruentRTimes] = useState([]);
  const [incongruentRTimes, setIncongruentRTimes] = useState([]);
  
  // State variables
  const stimulusStartTimeRef = useRef(null);
  const stimulusTimeoutRef = useRef(null);
  const taskIntervalRef = useRef(null);
  const totalTrialsRef = useRef(40); // 20 congruent + 20 incongruent
  const respondedRef = useRef(false);
  const currentCountRef = useRef(0); // Track actual count for progression
  
  const generateTrial = (isCongruent) => {
    const directions = ['<', '>'];
    const targetIndex = Math.floor(Math.random() * 2);
    const target = directions[targetIndex];
    
    let distractors;
    if (isCongruent) {
      // All distractors match target direction
      distractors = [target, target, target, target];
    } else {
      // Distractors are opposite to target
      distractors = [
        directions[1 - targetIndex],
        directions[1 - targetIndex],
        directions[1 - targetIndex],
        directions[1 - targetIndex]
      ];
    }
    
    // Shuffle distractors order (keep target in middle)
    return {
      target,
      distractors,
      isCongruent,
      correctAnswer: target
    };
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
    currentCountRef.current = 0;
    presentNextTrial(0);
  };

  const presentNextTrial = (index) => {
    if (currentCountRef.current >= totalTrialsRef.current) {
      finishTask();
      return;
    }

    // 50% congruent, 50% incongruent
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

  // Auto-advance when trial is visible and task is running
  useEffect(() => {
    if (!taskStarted || taskFinished || !currentTrial) {
      return;
    }

    // Clear any pending timeouts
    if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
    if (taskIntervalRef.current) clearTimeout(taskIntervalRef.current);

    // Set timeout to clear trial after 3 seconds
    stimulusTimeoutRef.current = setTimeout(() => {
      setCurrentTrial(null);
    }, 3000);

    return () => {
      if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
      if (taskIntervalRef.current) clearTimeout(taskIntervalRef.current);
    };
  }, [taskStarted, taskFinished, currentTrial]);

  // Auto-present next trial after ISI when trial is cleared
  useEffect(() => {
    if (!taskStarted || taskFinished || currentTrial !== null) {
      return;
    }

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
      if (isCorrect) {
        setCongruentCorrect(prev => prev + 1);
        setReactionTimes(prev => [...prev, reactionTime]);
        setCongruentRTimes(prev => [...prev, reactionTime]);
      }
    } else {
      if (isCorrect) {
        setIncongruentCorrect(prev => prev + 1);
        setReactionTimes(prev => [...prev, reactionTime]);
        setIncongruentRTimes(prev => [...prev, reactionTime]);
      }
    }

    setCurrentTrial(null);
    taskIntervalRef.current = setTimeout(() => presentNextTrial(trialIndex + 1), 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleResponse('<');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleResponse('>');
    }
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
    return () => {
      window.removeEventListener('keydown', handleKeyPressCallback);
    };
  }, [taskStarted, taskFinished, currentTrial]);

  const finishTask = () => {
    setTaskFinished(true);
    setTaskStarted(false);
    setCurrentTrial(null);
    clearTimeout(stimulusTimeoutRef.current);
    clearTimeout(taskIntervalRef.current);

    const totalCorrect = congruentCorrect + incongruentCorrect;
    const totalTrials = totalTrialsRef.current;
    const congruencyEffect = calculateAverageReactionTime(incongruentRTimes) - calculateAverageReactionTime(congruentRTimes);

    const results = {
      totalTrials,
      congruentTotal,
      incongruentTotal,
      congruentCorrect,
      incongruentCorrect,
      totalCorrect,
      congruentAccuracy: calculateAccuracy(congruentCorrect, congruentTotal),
      incongruentAccuracy: calculateAccuracy(incongruentCorrect, incongruentTotal),
      overallAccuracy: calculateAccuracy(totalCorrect, totalTrials),
      averageReactionTime: calculateAverageReactionTime(reactionTimes),
      congruentAvgRT: calculateAverageReactionTime(congruentRTimes),
      incongruentAvgRT: calculateAverageReactionTime(incongruentRTimes),
      congruencyEffect: congruencyEffect.toFixed(2),
      reactionTimes
    };

    logResults('Flanker Task', results);
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
  };

  const avgReactionTime = calculateAverageReactionTime(reactionTimes);
  const totalCorrect = congruentCorrect + incongruentCorrect;
  const totalTrials = totalTrialsRef.current;

  return (
    <div className="task-container">
      <div className="task-header">
        <h2>Flanker Task</h2>
        <p className="task-description">
          Identify the direction of the <strong>CENTER ARROW</strong> (ignore the surrounding arrows).
          <br />
          Press <strong>← (Left Arrow)</strong> if center points left, or <strong>→ (Right Arrow)</strong> if points right.
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
        {currentTrial ? (
          <div className="flanker-display">
            <span className="flanker-distractor">{currentTrial.distractors[0]}</span>
            <span className="flanker-distractor">{currentTrial.distractors[1]}</span>
            <span className="flanker-target">{currentTrial.target}</span>
            <span className="flanker-distractor">{currentTrial.distractors[2]}</span>
            <span className="flanker-distractor">{currentTrial.distractors[3]}</span>
          </div>
        ) : (
          <span>{taskFinished ? 'Task Complete' : 'Waiting...'}</span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '20px 0' }}>
        <button
          className="btn btn-primary"
          onClick={() => handleResponse('<')}
          disabled={!taskStarted || taskFinished || !currentTrial}
          style={{ fontSize: '20px', padding: '15px 40px' }}
        >
          ← Left
        </button>
        <button
          className="btn btn-primary"
          onClick={() => handleResponse('>')}
          disabled={!taskStarted || taskFinished || !currentTrial}
          style={{ fontSize: '20px', padding: '15px 40px' }}
        >
          Right →
        </button>
      </div>

      <div className="stats-display">
        <div className="stat-card">
          <div className="stat-label">Progress</div>
          <div className="stat-value">{trialIndex}/{totalTrialsRef.current}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Congruent Correct</div>
          <div className="stat-value">{congruentCorrect}/{congruentTotal}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Incongruent Correct</div>
          <div className="stat-value">{incongruentCorrect}/{incongruentTotal}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Correct</div>
          <div className="stat-value">{totalCorrect}/{totalTrials}</div>
        </div>
      </div>

      {taskFinished && (
        <div className="results-container">
          <h3>Task Results</h3>
          <div className="result-item">
            <strong>Total Trials:</strong> {totalTrialsRef.current}
          </div>
          <div className="result-item">
            <strong>Congruent Trials:</strong> {congruentTotal} (Correct: {congruentCorrect})
          </div>
          <div className="result-item">
            <strong>Incongruent Trials:</strong> {incongruentTotal} (Correct: {incongruentCorrect})
          </div>
          <div className="result-item">
            <strong>Overall Accuracy:</strong> {calculateAccuracy(totalCorrect, totalTrials)}%
          </div>
          <div className="result-item">
            <strong>Congruent Accuracy:</strong> {calculateAccuracy(congruentCorrect, congruentTotal)}%
          </div>
          <div className="result-item">
            <strong>Incongruent Accuracy:</strong> {calculateAccuracy(incongruentCorrect, incongruentTotal)}%
          </div>
          <div className="result-item">
            <strong>Average Reaction Time (Overall):</strong> {reactionTimes.length > 0 ? formatTime(parseFloat(avgReactionTime)) : 'N/A'}
          </div>
          <div className="result-item">
            <strong>Average Reaction Time (Congruent):</strong> {congruentRTimes.length > 0 ? formatTime(parseFloat(calculateAverageReactionTime(congruentRTimes))) : 'N/A'}
          </div>
          <div className="result-item">
            <strong>Average Reaction Time (Incongruent):</strong> {incongruentRTimes.length > 0 ? formatTime(parseFloat(calculateAverageReactionTime(incongruentRTimes))) : 'N/A'}
          </div>
          <div className="result-item">
            <strong>Congruency Effect:</strong> {reactionTimes.length > 0 ? (parseFloat(calculateAverageReactionTime(incongruentRTimes) - calculateAverageReactionTime(congruentRTimes)).toFixed(2) > 0 ? '+' : '') + parseFloat(calculateAverageReactionTime(incongruentRTimes) - calculateAverageReactionTime(congruentRTimes)).toFixed(2) + 'ms' : 'N/A'}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlankerTask;
