import React, { useState } from 'react';
import './App.css';
import CPTTask from './components/CPTTask';
import GoNoGoTask from './components/GoNoGoTask';
import NBackTask from './components/NBackTask';
import FlankerTask from './components/FlankerTask';
import TrailMakingTask from './components/TrailMakingTask';

function App() {
  const [currentTask, setCurrentTask] = useState(null);

  const tasks = [
    { id: 'cpt', name: 'Continuous Performance Task', component: CPTTask },
    { id: 'gonogo', name: 'Go/No-Go Task', component: GoNoGoTask },
    { id: 'nback', name: 'N-Back Task', component: NBackTask },
    { id: 'flanker', name: 'Flanker Task', component: FlankerTask },
    { id: 'trailmaking', name: 'Trail-Making Task', component: TrailMakingTask },
  ];

  if (currentTask) {
    const task = tasks.find(t => t.id === currentTask);
    const TaskComponent = task.component;
    return (
      <div className="app-container">
        <button className="back-button" onClick={() => setCurrentTask(null)}>
          ← Back to Menu
        </button>
        <TaskComponent />
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="menu">
        <h1>ADHD Assessment Suite</h1>
        <p className="subtitle">Digital Cognitive Tasks</p>
        <div className="task-grid">
          {tasks.map(task => (
            <button
              key={task.id}
              className="task-button"
              onClick={() => setCurrentTask(task.id)}
            >
              <div className="task-icon">📋</div>
              <div className="task-name">{task.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
