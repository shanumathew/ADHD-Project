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
        '✓ Sustained Attention: Your ability to stay focused over time',
        '✓ Impulse Control: Avoiding premature or incorrect responses',
        '✓ Vigilance: Detecting targets in a repetitive task',
        '✓ Processing Speed: How quickly you identify patterns',
        '✓ Working Memory: Remembering the target pattern'
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
        '✓ Response Inhibition: Stopping a prepared response',
        '✓ Impulse Control: Resisting automatic urges to respond',
        '✓ Attention: Maintaining focus on current stimulus',
        '✓ Error Monitoring: Recognizing when you make mistakes',
        '✓ Executive Control: Managing behavioral responses'
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
        '✓ Working Memory: Holding information in mind temporarily',
        '✓ Mental Updating: Updating representations as new info arrives',
        '✓ Attention Shifting: Moving focus as task difficulty changes',
        '✓ Processing Speed: How quickly you recognize matches',
        '✓ Cognitive Load: Performance under increasing mental demands'
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
        '✓ Selective Attention: Focusing on relevant information',
        '✓ Cognitive Control: Suppressing attention to distractors',
        '✓ Conflict Resolution: Resolving competing stimulus information',
        '✓ Processing Speed: How fast you process target information',
        '✓ Distraction Susceptibility: Measuring flanker interference effects'
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
        '✓ Visual Scanning: Finding target items quickly',
        '✓ Processing Speed: How fast you complete the task',
        '✓ Mental Flexibility: Switching between numbers and letters',
        '✓ Task Switching: Speed cost of alternating between categories',
        '✓ Executive Function: Planning and organizing your response strategy'
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
            <h3>📋 Overview</h3>
            <p>{details.description}</p>
          </section>

          {/* How to Use */}
          <section className="modal-section">
            <h3>🎮 How to Use This Task</h3>
            <ul className="instruction-list">
              {details.howToUse?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          {/* What to Expect */}
          <section className="modal-section">
            <h3>⏱️ What to Expect</h3>
            <ul className="info-list">
              {details.whatToExpect?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          {/* What It Assesses */}
          <section className="modal-section">
            <h3>📊 What This Task Assesses</h3>
            <div className="assessment-list">
              {details.assesses?.map((item, idx) => (
                <div key={idx} className="assessment-item">{item}</div>
              ))}
            </div>
          </section>

          {/* ADHD Context */}
          <section className="modal-section">
            <h3>🧠 About ADHD & This Task</h3>
            <p className="adhd-context">{details.adhd}</p>
          </section>

          {/* Important Notes */}
          <section className="modal-section">
            <h3>⚠️ Important Notes</h3>
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
