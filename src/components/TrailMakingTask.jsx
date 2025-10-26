import React, { useState, useEffect, useRef } from 'react';
import { logResults, shuffleArray } from '../utils/taskUtils';

/**
 * Trail-Making / Sorting Task
 * 
 * Display numbered or lettered items in random positions.
 * User must click them in order (or drag & drop).
 * Tracks completion time, errors, and sequence deviations.
 */

const TrailMakingTask = () => {
  const [taskStarted, setTaskStarted] = useState(false);
  const [taskFinished, setTaskFinished] = useState(false);
  const [taskType, setTaskType] = useState('numbers'); // 'numbers' or 'letters'
  const [items, setItems] = useState([]);
  const [nextExpectedIndex, setNextExpectedIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [completedSequence, setCompletedSequence] = useState([]);
  
  // Refs for accurate result tracking (to avoid stale closures)
  const nextExpectedIndexRef = useRef(0);
  const errorsRef = useRef(0);
  const completedSequenceRef = useRef([]);
  
  // State variables
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
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
        label: String.fromCharCode(65 + i), // A, B, C, ...
        index: i
      }));
    }

    // Randomize positions
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
    
    // Initialize refs
    nextExpectedIndexRef.current = 0;
    errorsRef.current = 0;
    completedSequenceRef.current = [];
    
    startTimeRef.current = performance.now();
  };

  const handleItemClick = (item) => {
    if (!taskStarted || taskFinished) return;

    if (item.index === nextExpectedIndexRef.current) {
      // Correct item clicked
      completedSequenceRef.current.push(item.label);
      setCompletedSequence(prev => [...prev, item.label]);
      nextExpectedIndexRef.current += 1;
      setNextExpectedIndex(prev => prev + 1);

      // Check if task is complete
      if (nextExpectedIndexRef.current === totalItemsRef.current) {
        finishTask();
      }
    } else {
      // Wrong item clicked
      errorsRef.current += 1;
      setErrors(prev => prev + 1);
    }
  };

  const finishTask = () => {
    endTimeRef.current = performance.now();
    setTaskFinished(true);
    setTaskStarted(false);

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

    logResults('Trail-Making / Sorting Task', results);
  };

  const resetTask = () => {
    setTaskStarted(false);
    setTaskFinished(false);
    setItems([]);
    setNextExpectedIndex(0);
    setErrors(0);
    setCompletedSequence([]);
    startTimeRef.current = null;
    endTimeRef.current = null;
  };

  const completionTime = startTimeRef.current && endTimeRef.current 
    ? endTimeRef.current - startTimeRef.current 
    : null;

  return (
    <div className="task-container">
      <div className="task-header">
        <h2>Trail-Making / Sorting Task</h2>
        <p className="task-description">
          Click on the items in order ({taskType === 'numbers' ? '1 → 2 → 3 → ...' : 'A → B → C → ...'}).
          <br />
          Complete the sequence as quickly as possible without errors.
        </p>
      </div>

      <div className="controls">
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <label>
            Task Type:
            <select
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              disabled={taskStarted || taskFinished}
              style={{
                marginLeft: '10px',
                padding: '8px 15px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '16px'
              }}
            >
              <option value="numbers">Numbers (1-15)</option>
              <option value="letters">Letters (A-O)</option>
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

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2em', marginBottom: '20px', color: '#667eea', fontWeight: 'bold' }}>
          Next: <span style={{ fontSize: '1.5em' }}>{nextExpectedIndex < items.length ? items.find(item => item.index === nextExpectedIndex)?.label : 'Done!' }</span>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.9em', color: '#666' }}>
            Progress: {nextExpectedIndex}/{totalItemsRef.current}
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e0e0e0',
            borderRadius: '4px',
            marginTop: '8px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(nextExpectedIndex / totalItemsRef.current) * 100}%`,
              height: '100%',
              backgroundColor: '#667eea',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>
      </div>

      <div className="trail-items-display">
        {items.map((item) => (
          <div
            key={item.id}
            /* Do NOT highlight the next expected item: only show completed state */
            className={`trail-item ${item.index < nextExpectedIndex ? 'completed' : ''}`}
            onClick={() => handleItemClick(item)}
            style={{
              cursor: taskStarted ? 'pointer' : 'default',
              opacity: item.index < nextExpectedIndex ? 0.6 : 1
            }}
          >
            {item.label}
          </div>
        ))}
      </div>

      <div className="stats-display" style={{ marginTop: '30px' }}>
        <div className="stat-card">
          <div className="stat-label">Completed Items</div>
          <div className="stat-value">{nextExpectedIndex}/{totalItemsRef.current}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Errors</div>
          <div className="stat-value" style={{ color: errors > 0 ? '#e74c3c' : '#2ecc71' }}>{errors}</div>
        </div>
        {taskStarted && startTimeRef.current && (
          <div className="stat-card">
            <div className="stat-label">Time Elapsed</div>
            <div className="stat-value">
              {((performance.now() - startTimeRef.current) / 1000).toFixed(1)}s
            </div>
          </div>
        )}
      </div>

      {taskFinished && (
        <div className="results-container">
          <h3>Task Results</h3>
          <div className="result-item">
            <strong>Task Type:</strong> {taskType === 'numbers' ? 'Numbers (1-15)' : 'Letters (A-O)'}
          </div>
          <div className="result-item">
            <strong>Total Items:</strong> {totalItemsRef.current}
          </div>
          <div className="result-item">
            <strong>Completion Time:</strong> {completionTime && (completionTime / 1000).toFixed(2)}s
          </div>
          <div className="result-item">
            <strong>Time Per Item:</strong> {completionTime && (completionTime / totalItemsRef.current).toFixed(2)}ms
          </div>
          <div className="result-item">
            <strong>Errors:</strong> {errors}
          </div>
          <div className="result-item">
            <strong>Accuracy:</strong> {((totalItemsRef.current - errors) / totalItemsRef.current * 100).toFixed(2)}%
          </div>
          <div className="result-item">
            <strong>Sequence Completed:</strong> {completedSequence.join(' → ')}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrailMakingTask;
