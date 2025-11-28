import React, { useState, useEffect, useRef } from 'react';
import { logResults, shuffleArray } from '../utils/taskUtils';

/**
 * Trail-Making / Sorting Task
 * 
 * Display numbered or lettered items in random positions.
 * User must click them in order.
 */

const TrailMakingTask = ({ onTaskStart, onTaskEnd }) => {
  const [taskStarted, setTaskStarted] = useState(false);
  const [taskFinished, setTaskFinished] = useState(false);
  const [taskType, setTaskType] = useState('numbers');
  const [items, setItems] = useState([]);
  const [nextExpectedIndex, setNextExpectedIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [completedSequence, setCompletedSequence] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const nextExpectedIndexRef = useRef(0);
  const errorsRef = useRef(0);
  const completedSequenceRef = useRef([]);
  
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const totalItemsRef = useRef(15);

  const generateItems = (type) => {
    let itemList;
    
    if (type === 'numbers') {
      itemList = Array.from({ length: totalItemsRef.current }, (_, i) => ({
        id: i,
        label: (i + 1).toString(),
        index: i
      }));
    } else {
      itemList = Array.from({ length: totalItemsRef.current }, (_, i) => ({
        id: i,
        label: String.fromCharCode(65 + i),
        index: i
      }));
    }

    return shuffleArray(itemList).map((item, position) => ({
      ...item,
      position
    }));
  };

  const startTask = () => {
    const newItems = generateItems(taskType);
    setItems(newItems);
    setTaskStarted(true);
    setTaskFinished(false);
    setNextExpectedIndex(0);
    setErrors(0);
    setCompletedSequence([]);
    setElapsedTime(0);
    
    nextExpectedIndexRef.current = 0;
    errorsRef.current = 0;
    completedSequenceRef.current = [];
    
    startTimeRef.current = performance.now();
    
    // Start timer for live elapsed time
    timerIntervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        setElapsedTime(performance.now() - startTimeRef.current);
      }
    }, 100);
    
    if (onTaskStart) onTaskStart();
  };

  const handleItemClick = (item) => {
    if (!taskStarted || taskFinished) return;

    if (item.index === nextExpectedIndexRef.current) {
      completedSequenceRef.current.push(item.label);
      setCompletedSequence(prev => [...prev, item.label]);
      nextExpectedIndexRef.current += 1;
      setNextExpectedIndex(prev => prev + 1);

      if (nextExpectedIndexRef.current === totalItemsRef.current) {
        finishTask();
      }
    } else {
      errorsRef.current += 1;
      setErrors(prev => prev + 1);
    }
  };

  const finishTask = () => {
    endTimeRef.current = performance.now();
    setTaskFinished(true);
    setTaskStarted(false);
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    if (onTaskEnd) onTaskEnd();

    const completionTime = endTimeRef.current - startTimeRef.current;
    const results = {
      taskType,
      totalItems: totalItemsRef.current,
      completionTime,
      completionTimeSeconds: (completionTime / 1000).toFixed(2),
      errors: errorsRef.current,
      timePerItem: (completionTime / totalItemsRef.current).toFixed(2),
      sequence: completedSequenceRef.current.join(' → '),
      accuracy: (((totalItemsRef.current - errorsRef.current) / totalItemsRef.current) * 100).toFixed(2)
    };

    const taskConfig = {
      taskName: 'Trail Making Task',
      taskType: taskType,
      taskTypeLabel: taskType === 'numbers' ? 'Numbers (1-15)' : 'Letters (A-O)',
      totalItems: totalItemsRef.current,
      measureType: 'Completion Time & Errors'
    };

    logResults('Trail Making Task', results, taskConfig);
  };

  const resetTask = () => {
    setTaskStarted(false);
    setTaskFinished(false);
    setItems([]);
    setNextExpectedIndex(0);
    setErrors(0);
    setCompletedSequence([]);
    setElapsedTime(0);
    startTimeRef.current = null;
    endTimeRef.current = null;
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    if (onTaskEnd) onTaskEnd();
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const completionTime = startTimeRef.current && endTimeRef.current 
    ? endTimeRef.current - startTimeRef.current 
    : null;
  const progressPercent = (nextExpectedIndex / totalItemsRef.current) * 100;

  return (
    <div className="task-container">
      <div className="task-header">
        <h2>Trail-Making Task</h2>
        <p className="task-description">
          Click on the items in order ({taskType === 'numbers' ? '1 → 2 → 3 → ...' : 'A → B → C → ...'}).
          Complete as quickly as possible without errors.
        </p>
      </div>

      <div className="task-controls">
        <div className="task-select-wrapper">
          <span className="task-select-label">Type:</span>
          <select
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
            disabled={taskStarted || taskFinished}
            className="task-select"
          >
            <option value="numbers">Numbers (1-15)</option>
            <option value="letters">Letters (A-O)</option>
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
          <span className="progress-count">{nextExpectedIndex} / {totalItemsRef.current}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="next-target-display">
        <span className="next-target-label">Find Next:</span>
        <span className="next-target-value">
          {nextExpectedIndex < totalItemsRef.current 
            ? items.find(item => item.index === nextExpectedIndex)?.label 
            : '✓'}
        </span>
      </div>

      <div className="trail-items-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className={`trail-item ${item.index < nextExpectedIndex ? 'completed' : ''} ${taskStarted && item.index >= nextExpectedIndex ? 'clickable' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            <span className="trail-item-label">{item.label}</span>
            {item.index < nextExpectedIndex && (
              <span className="trail-item-check">✓</span>
            )}
          </div>
        ))}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-value">{nextExpectedIndex}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Errors</div>
          <div className="stat-value error">{errors}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Time</div>
          <div className="stat-value">{(elapsedTime / 1000).toFixed(1)}s</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Accuracy</div>
          <div className="stat-value success">
            {nextExpectedIndex > 0 
              ? Math.round(((nextExpectedIndex) / (nextExpectedIndex + errors)) * 100)
              : 100}%
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
              <span className="result-label">Task Type</span>
              <span className="result-value">{taskType === 'numbers' ? 'Numbers (1-15)' : 'Letters (A-O)'}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Items</span>
              <span className="result-value">{totalItemsRef.current}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Completion Time</span>
              <span className="result-value good">{completionTime && (completionTime / 1000).toFixed(2)}s</span>
            </div>
            <div className="result-item">
              <span className="result-label">Time Per Item</span>
              <span className="result-value">{completionTime && (completionTime / totalItemsRef.current).toFixed(0)}ms</span>
            </div>
            <div className="result-item">
              <span className="result-label">Errors</span>
              <span className="result-value bad">{errors}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Accuracy</span>
              <span className="result-value good">{((totalItemsRef.current) / (totalItemsRef.current + errors) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrailMakingTask;
