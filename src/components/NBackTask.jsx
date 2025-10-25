import React, { useState, useEffect, useRef } from 'react';
import { logResults, calculateAccuracy, calculateAverageReactionTime, formatTime, generateRandomLetters } from '../utils/taskUtils';

/**
 * N-Back Task
 * 
 * Present a sequence of letters/numbers one by one.
 * User indicates if current item matches the one n steps back.
 * Tracks accuracy, correct matches, and reaction time.
 */

const NBackTask = () => {
  const [taskStarted, setTaskStarted] = useState(false);
  const [taskFinished, setTaskFinished] = useState(false);
  const [nBackLevel, setNBackLevel] = useState(2); // 1-back or 2-back
  const [currentStimulus, setCurrentStimulus] = useState('');
  const [stimulusIndex, setStimulusIndex] = useState(0);
  const [stimulusSequence, setStimulusSequence] = useState([]);
  
  // Results tracking
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [falseAlarms, setFalseAlarms] = useState(0);
  const [correctRejections, setCorrectRejections] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  
  // State variables
  const stimulusStartTimeRef = useRef(null);
  const stimulusTimeoutRef = useRef(null);
  const taskIntervalRef = useRef(null);
  const totalStimuliRef = useRef(25);
  const respondedRef = useRef(false);
  const currentCountRef = useRef(0); // Track actual count for progression
  
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
    currentCountRef.current = 0;
    respondedRef.current = false;
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

  // Auto-advance when stimulus is visible and task is running
  useEffect(() => {
    if (!taskStarted || taskFinished || !currentStimulus) {
      return;
    }

    // Clear any pending timeouts
    if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
    if (taskIntervalRef.current) clearTimeout(taskIntervalRef.current);

    // Check if there should be a match
    const shouldMatch = stimulusIndex >= nBackLevel && stimulusSequence[stimulusIndex] === stimulusSequence[stimulusIndex - nBackLevel];

    let timerFired = false;

    // Set timeout to clear stimulus after 2.5 seconds
    stimulusTimeoutRef.current = setTimeout(() => {
      timerFired = true;
      if (!respondedRef.current) {
        if (shouldMatch) {
          // User didn't respond but there was a match = miss
          setMisses(prev => prev + 1);
        } else {
          // User didn't respond and no match = correct rejection
          setCorrectRejections(prev => prev + 1);
        }
      }
      
      setCurrentStimulus('');
    }, 2500);

    return () => {
      // If timer didn't fire and user didn't respond, apply appropriate scoring
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

  // Auto-present next stimulus after ISI when stimulus is cleared
  useEffect(() => {
    if (!taskStarted || taskFinished || currentStimulus !== '') {
      return;
    }

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

    const stimulus = stimulusSequence[stimulusIndex];
    const shouldMatch = stimulusIndex >= nBackLevel && stimulus === stimulusSequence[stimulusIndex - nBackLevel];

    if (shouldMatch) {
      // Correct response to a match - track RT only for hits
      setHits(prev => prev + 1);
      setReactionTimes(prev => [...prev, reactionTime]);
    } else {
      // Wrong response (no match but user said there was)
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

    const stimulus = stimulusSequence[stimulusIndex];
    const shouldMatch = stimulusIndex >= nBackLevel && stimulus === stimulusSequence[stimulusIndex - nBackLevel];

    if (!shouldMatch) {
      // Correct response to non-match - track RT only for correct rejections
      setCorrectRejections(prev => prev + 1);
      setReactionTimes(prev => [...prev, reactionTime]);
    } else {
      // Wrong response (there was a match but user said no)
      setMisses(prev => prev + 1);
    }

    setCurrentStimulus('');
    taskIntervalRef.current = setTimeout(() => presentNextStimulus(stimulusSequence, stimulusIndex + 1), 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === '1' || e.key === 'ArrowUp') {
      e.preventDefault();
      handleMatch();
    } else if (e.key === '2' || e.key === 'ArrowDown') {
      e.preventDefault();
      handleNoMatch();
    }
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
    return () => {
      window.removeEventListener('keydown', handleKeyPressCallback);
    };
  }, [taskStarted, taskFinished, currentStimulus]);

  const finishTask = () => {
    setTaskFinished(true);
    setTaskStarted(false);
    setCurrentStimulus('');
    clearTimeout(stimulusTimeoutRef.current);
    clearTimeout(taskIntervalRef.current);

    const totalTrials = totalStimuliRef.current;
    const totalMatches = stimulusSequence.filter((item, index) => 
      index >= nBackLevel && item === stimulusSequence[index - nBackLevel]
    ).length;

    // Calculate accuracy as correct responses / total trials
    // (Correct = hits + correct rejections)
    const accuracy = hits + correctRejections + misses + falseAlarms > 0 
      ? Math.round(((hits + correctRejections) / (hits + correctRejections + misses + falseAlarms)) * 100)
      : 0;

    const results = {
      nBackLevel,
      totalTrials,
      hits,
      misses,
      falseAlarms,
      correctRejections,
      totalMatches,
      accuracy,
      averageReactionTime: calculateAverageReactionTime(reactionTimes),
      averageReactionTimeMs: reactionTimes.length > 0 ? calculateAverageReactionTime(reactionTimes) : 'N/A',
      reactionTimesMs: reactionTimes,
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
  };

  const totalTrials = totalStimuliRef.current;
  const totalMatches = stimulusSequence.filter((item, index) => 
    index >= nBackLevel && item === stimulusSequence[index - nBackLevel]
  ).length;
  const avgReactionTime = calculateAverageReactionTime(reactionTimes);

  return (
    <div className="task-container">
      <div className="task-header">
        <h2>N-Back Task</h2>
        <p className="task-description">
          Letters will be presented one by one.
          <br />
          Press <strong>1 or ↑</strong> if the current letter <strong>MATCHES</strong> the one {nBackLevel} step{nBackLevel > 1 ? 's' : ''} back.
          <br />
          Press <strong>2 or ↓</strong> if it does <strong>NOT MATCH</strong>.
        </p>
      </div>

      <div className="controls">
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
          <label>
            N-Back Level:
            <select
              value={nBackLevel}
              onChange={(e) => setNBackLevel(parseInt(e.target.value))}
              disabled={taskStarted || taskFinished}
              style={{
                marginLeft: '10px',
                padding: '8px 15px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '16px'
              }}
            >
              <option value={1}>1-Back</option>
              <option value={2}>2-Back</option>
              <option value={3}>3-Back</option>
            </select>
          </label>
        </div>
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
        {currentStimulus || (taskFinished ? 'Task Complete' : 'Waiting...')}
      </div>

      <div className="nback-options">
        <button
          className="nback-button nback-match"
          onClick={handleMatch}
          disabled={!taskStarted || taskFinished || !currentStimulus}
        >
          ↑ Match (1)
        </button>
        <button
          className="nback-button nback-nomatch"
          onClick={handleNoMatch}
          disabled={!taskStarted || taskFinished || !currentStimulus}
        >
          ↓ No Match (2)
        </button>
      </div>

      <div className="stats-display">
        <div className="stat-card">
          <div className="stat-label">Progress</div>
          <div className="stat-value">{stimulusIndex}/{totalStimuliRef.current}</div>
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
        <div className="stat-card">
          <div className="stat-label">Correct Rejections</div>
          <div className="stat-value">{correctRejections}</div>
        </div>
      </div>

      {taskFinished && (
        <div className="results-container">
          <h3>Task Results ({nBackLevel}-Back)</h3>
          <div className="result-item">
            <strong>Total Trials:</strong> {totalStimuliRef.current}
          </div>
          <div className="result-item">
            <strong>Hits (Correct Matches):</strong> {hits}
          </div>
          <div className="result-item">
            <strong>Misses (Missed Matches):</strong> {misses}
          </div>
          <div className="result-item">
            <strong>False Alarms (Wrong Matches):</strong> {falseAlarms}
          </div>
          <div className="result-item">
            <strong>Correct Rejections (Correct Non-Matches):</strong> {correctRejections}
          </div>
          <div className="result-item">
            <strong>Total Expected Matches:</strong> {totalMatches}
          </div>
          <div className="result-item">
            <strong>Accuracy:</strong> {((hits + correctRejections + misses + falseAlarms > 0) ? Math.round(((hits + correctRejections) / (hits + correctRejections + misses + falseAlarms)) * 100) : 0)}%
          </div>
          <div className="result-item">
            <strong>Average Reaction Time:</strong> {reactionTimes.length > 0 ? formatTime(parseFloat(avgReactionTime)) : 'N/A'}
          </div>
          <div className="result-item" style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
            <strong>Stimulus Sequence:</strong> {stimulusSequence.join(' ')}
          </div>
        </div>
      )}
    </div>
  );
};

export default NBackTask;
