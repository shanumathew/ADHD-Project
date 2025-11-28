import React from 'react';
import '../styles/modal.css';

const TaskDetailsModal = ({ task, isOpen, onClose }) => {
  if (!isOpen || !task) return null;

  const taskDetails = {
    cpt: {
      fullName: 'Continuous Performance Task (CPT)',
      shortDesc: 'Measures sustained attention and response inhibition',
      description: 'This test measures your ability to maintain focus over time and control impulsive responses. You\'ll see a series of letters appear on the screen — your task is to respond only when specific target letters appear in the correct sequence.',
      
      howToUse: [
        'Watch for a target letter pattern (e.g., "X" appearing after "A")',
        'Press the SPACEBAR quickly when you see the target',
        'Stay alert throughout the entire task',
        'Avoid false alarms — only respond to correct targets',
        'Focus on consistency more than speed'
      ],
      
      whatToExpect: [
        'The test lasts approximately 5 minutes',
        'You\'ll see 100+ letter presentations',
        'Difficulty increases gradually',
        'Visual and audio feedback for responses',
        'Rest periods between sections'
      ],
      
      assesses: [
        'Sustained Attention: Your ability to stay focused over time',
        'Impulse Control: Avoiding premature or incorrect responses',
        'Vigilance: Detecting targets in a repetitive task',
        'Processing Speed: How quickly you identify patterns',
        'Working Memory: Remembering the target pattern'
      ],
      
      adhd: 'People with ADHD often show increased false alarms, slower reaction times, and difficulty maintaining consistency throughout the task.'
    },
    
    gonogo: {
      fullName: 'Go/No-Go Task',
      shortDesc: 'Tests impulse control and response inhibition',
      description: 'A test of your ability to inhibit automatic responses. You must respond quickly to "Go" signals but suppress your response when you see "No-Go" signals. This measures your executive control and self-regulation.',
      
      howToUse: [
        'Press the SPACEBAR for "Go" trials (e.g., green circles)',
        'Do NOT press anything for "No-Go" trials (e.g., red circles)',
        'Speed matters, but accuracy is more important',
        'Stay ready between trials',
        'Try to anticipate the pattern without being impulsive'
      ],
      
      whatToExpect: [
        'The test lasts approximately 4-5 minutes',
        'You\'ll complete 200 trials (about 75% Go, 25% No-Go)',
        'Trials appear at random intervals',
        'Immediate feedback for each response',
        'Difficulty increases as speed increases'
      ],
      
      assesses: [
        'Response Inhibition: Stopping a prepared response',
        'Impulse Control: Resisting automatic urges to respond',
        'Attention: Maintaining focus on current stimulus',
        'Error Monitoring: Recognizing when you make mistakes',
        'Executive Control: Managing behavioral responses'
      ],
      
      adhd: 'Individuals with ADHD typically show more commission errors (responding on No-Go trials) and higher impulsivity patterns.'
    },
    
    nback: {
      fullName: 'N-Back Task',
      shortDesc: 'Evaluates working memory capacity and mental updating',
      description: 'A working memory test where you identify when the current stimulus matches one shown N positions earlier. This measures your ability to hold and manipulate information in real-time. The difficulty progressively increases.',
      
      howToUse: [
        'You\'ll see letters displayed one at a time',
        'For 1-Back: Press SPACEBAR when the current letter matches the PREVIOUS letter',
        'For 2-Back: Press SPACEBAR when the current letter matches the letter from TWO steps back',
        'For 3-Back: Press SPACEBAR when the current letter matches the letter from THREE steps back',
        'Stay alert — the task gets harder as N increases'
      ],
      
      whatToExpect: [
        'Total duration: approximately 5-6 minutes',
        'You\'ll complete 3 levels: 1-Back, 2-Back, and 3-Back',
        'Each level has 30+ letter presentations',
        'Difficulty progressively increases',
        'Real-time feedback and encouragement between levels'
      ],
      
      assesses: [
        'Working Memory: Holding information in mind temporarily',
        'Mental Updating: Updating representations as new info arrives',
        'Attention Shifting: Moving focus as task difficulty changes',
        'Processing Speed: How quickly you recognize matches',
        'Cognitive Load: Performance under increasing mental demands'
      ],
      
      adhd: 'People with ADHD often show reduced accuracy on higher N levels and struggle more with working memory demands than controls.'
    },
    
    flanker: {
      fullName: 'Flanker Task (Eriksen Flanker)',
      shortDesc: 'Tests selective attention and distraction resistance',
      description: 'This test measures how well you can focus on a target while ignoring distracting information. You\'ll see rows of arrows and must identify the direction of the MIDDLE arrow only, while ignoring the arrows around it that try to mislead you.',
      
      howToUse: [
        'Press the key for the MIDDLE arrow\'s direction only',
        'LEFT arrow (←): Press the LEFT key',
        'RIGHT arrow (→): Press the RIGHT key',
        'Ignore all surrounding arrows — they don\'t matter',
        'Try to be both fast and accurate'
      ],
      
      whatToExpect: [
        'Duration: approximately 4-5 minutes',
        'You\'ll complete 200+ trials',
        'Trials alternate between congruent (matching direction) and incongruent (conflicting directions)',
        'Real-time feedback after each response',
        'Arrow arrangements vary to maintain engagement'
      ],
      
      assesses: [
        'Selective Attention: Focusing on relevant information',
        'Cognitive Control: Suppressing attention to distractors',
        'Conflict Resolution: Resolving competing stimulus information',
        'Processing Speed: How fast you process target information',
        'Distraction Susceptibility: Measuring flanker interference effects'
      ],
      
      adhd: 'Individuals with ADHD typically show larger interference effects (bigger difference between congruent and incongruent trials) and slower processing overall.'
    },
    
    trail: {
      fullName: 'Trail-Making Task',
      shortDesc: 'Measures processing speed and mental flexibility',
      description: 'This test measures your ability to quickly connect visual elements in a sequence. You\'ll click or tap circles in numerical (1→2→3) or alternating order (1→A→2→B). It tests both speed and accuracy, including your mental flexibility.',
      
      howToUse: [
        'Click the circles in numerical order: 1 → 2 → 3 → ... → 25',
        'Try to connect them as quickly and accurately as possible',
        'Avoid clicking the wrong circles — accuracy counts',
        'Keep your attention on finding the next number',
        'There\'s a time limit, so work efficiently'
      ],
      
      whatToExpect: [
        'Duration: approximately 3-5 minutes total',
        'Part A: Connect 25 numbers in sequence (warm-up)',
        'Part B: Connect 25 items alternating between numbers and letters (1→A→2→B→3→C)',
        'Timed performance with visual guidance',
        'Immediate feedback on completion'
      ],
      
      assesses: [
        'Visual Scanning: Finding target items quickly',
        'Processing Speed: How fast you complete the task',
        'Mental Flexibility: Switching between numbers and letters',
        'Task Switching: Speed cost of alternating between categories',
        'Executive Function: Planning and organizing your response strategy'
      ],
      
      adhd: 'People with ADHD typically show slower completion times, especially on Part B, indicating slower processing speed and difficulty with task-switching.'
    }
  };

  const details = taskDetails[task.id] || {};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-header" style={{ borderLeftColor: task.color }}>
          <div className="modal-icon">{task.icon}</div>
          <div>
            <h2>{details.fullName}</h2>
            <p className="modal-subtitle">{details.shortDesc}</p>
          </div>
        </div>

        <div className="modal-body">
          {/* Overview */}
          <section className="modal-section">
            <h3>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
              Overview
            </h3>
            <p>{details.description}</p>
          </section>

          {/* How to Use */}
          <section className="modal-section">
            <h3>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z"/>
              </svg>
              How to Use This Task
            </h3>
            <ul className="instruction-list">
              {details.howToUse?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          {/* What to Expect */}
          <section className="modal-section">
            <h3>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              What to Expect
            </h3>
            <ul className="info-list">
              {details.whatToExpect?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          {/* What It Assesses */}
          <section className="modal-section">
            <h3>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
              What This Task Assesses
            </h3>
            <div className="assessment-list">
              {details.assesses?.map((item, idx) => (
                <div key={idx} className="assessment-item">{item}</div>
              ))}
            </div>
          </section>

          {/* ADHD Context */}
          <section className="modal-section">
            <h3>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              About ADHD & This Task
            </h3>
            <p className="adhd-context">{details.adhd}</p>
          </section>

          {/* Important Notes */}
          <section className="modal-section">
            <h3>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              Important Notes
            </h3>
            <ul className="notes-list">
              <li>Take your time reading these instructions</li>
              <li>There will be a practice round before the actual test</li>
              <li>You can take a break between tasks</li>
              <li>Your results are automatically saved to your profile</li>
              <li>If you feel stressed, take a moment to breathe before starting</li>
            </ul>
          </section>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Back
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Ready to Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
