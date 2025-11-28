import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/questionnaire.css';

const DSM5Questionnaire = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('inattention');
  const [responses, setResponses] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [showExample, setShowExample] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // DSM-5 ADHD Criteria Questions with clear descriptions and examples
  const sections = {
    inattention: {
      title: 'Part A: Inattention',
      description: 'Over the past 6 months, how often have you experienced the following?',
      questions: [
        {
          id: 'ia1',
          text: 'Difficulty paying attention to details',
          description: 'Do you often make careless mistakes or overlook important details in work, school, or other activities?',
          example: 'Missing typos in emails, overlooking errors in calculations, skipping steps in instructions, or making mistakes on forms due to not reading carefully.'
        },
        {
          id: 'ia2',
          text: 'Trouble staying focused',
          description: 'Do you find it hard to maintain attention during tasks, conversations, or while reading?',
          example: 'Mind wandering during meetings, difficulty finishing a book chapter, losing track of what someone is saying mid-conversation, or zoning out while watching a movie.'
        },
        {
          id: 'ia3',
          text: 'Not listening when spoken to',
          description: 'Do people often tell you that you seem like you are not listening or your mind is elsewhere?',
          example: 'Being told "you never listen to me," needing people to repeat themselves frequently, or appearing distracted even when someone is speaking directly to you.'
        },
        {
          id: 'ia4',
          text: 'Failing to complete tasks',
          description: 'Do you often start tasks but have difficulty following through to completion?',
          example: 'Starting multiple projects but finishing none, leaving household chores half-done, or abandoning work assignments before they are complete.'
        },
        {
          id: 'ia5',
          text: 'Difficulty with organization',
          description: 'Do you struggle to organize tasks, manage time, or keep things in order?',
          example: 'Messy workspace, missing deadlines, difficulty planning sequential tasks, frequently losing track of appointments, or struggling to manage multiple responsibilities.'
        },
        {
          id: 'ia6',
          text: 'Avoiding mentally demanding tasks',
          description: 'Do you avoid, dislike, or feel reluctant to do tasks that require sustained mental effort?',
          example: 'Putting off paperwork, avoiding reading lengthy documents, delaying tax preparation, or dreading tasks that require concentrated thinking.'
        },
        {
          id: 'ia7',
          text: 'Frequently losing things',
          description: 'Do you often misplace items needed for daily tasks and activities?',
          example: 'Regularly losing keys, wallet, phone, glasses, important documents, or tools needed for work. Spending significant time searching for misplaced items.'
        },
        {
          id: 'ia8',
          text: 'Easily distracted',
          description: 'Are you frequently distracted by unrelated thoughts or things happening around you?',
          example: 'Getting sidetracked by notifications, background noise, or random thoughts. Starting to do one thing but ending up doing something completely different.'
        },
        {
          id: 'ia9',
          text: 'Forgetful in daily activities',
          description: 'Do you often forget to do routine tasks or forget appointments and obligations?',
          example: 'Forgetting to return calls, missing bill payments, forgetting to take medication, or not remembering to complete promised tasks for others.'
        }
      ]
    },
    hyperactivity: {
      title: 'Part B: Hyperactivity and Impulsivity',
      description: 'Over the past 6 months, how often have you experienced the following?',
      questions: [
        {
          id: 'hi1',
          text: 'Fidgeting or squirming',
          description: 'Do you often fidget, tap your hands or feet, or squirm when seated?',
          example: 'Tapping fingers on desk, bouncing legs, playing with pens or objects, difficulty sitting still in meetings, or constantly shifting position in your seat.'
        },
        {
          id: 'hi2',
          text: 'Difficulty staying seated',
          description: 'Do you often leave your seat in situations where you are expected to remain seated?',
          example: 'Getting up during meetings, leaving your desk frequently at work, difficulty sitting through movies or meals, or feeling compelled to stand up and move around.'
        },
        {
          id: 'hi3',
          text: 'Feeling restless',
          description: 'Do you often feel restless or have an inner sense of needing to move?',
          example: 'Feeling like you cannot sit still, internal sense of restlessness or agitation, needing to pace or move around, or feeling uncomfortable when required to be still for long periods.'
        },
        {
          id: 'hi4',
          text: 'Difficulty with quiet activities',
          description: 'Do you find it hard to engage in leisure activities quietly?',
          example: 'Making noise unconsciously, humming or talking to yourself, difficulty reading silently, or being told you are too loud during activities that others do quietly.'
        },
        {
          id: 'hi5',
          text: 'Always "on the go"',
          description: 'Do you feel driven by a motor or constantly need to be doing something?',
          example: 'Difficulty relaxing, always busy with something, uncomfortable during downtime, feeling like you cannot slow down, or others describing you as always moving.'
        },
        {
          id: 'hi6',
          text: 'Talking excessively',
          description: 'Do you often talk more than others in conversations or find it hard to stop talking?',
          example: 'Dominating conversations, talking over others, giving long-winded explanations, or being told you talk too much or do not let others speak.'
        },
        {
          id: 'hi7',
          text: 'Blurting out answers',
          description: 'Do you often answer questions before they are fully asked or finish other people\'s sentences?',
          example: 'Interrupting with answers before questions are complete, finishing sentences for others, or responding immediately without waiting for the full context.'
        },
        {
          id: 'hi8',
          text: 'Difficulty waiting your turn',
          description: 'Do you find it hard to wait in lines or wait for your turn in activities?',
          example: 'Feeling impatient in queues, cutting in line, difficulty waiting for your turn to speak, or feeling frustrated when having to wait for anything.'
        },
        {
          id: 'hi9',
          text: 'Interrupting or intruding',
          description: 'Do you often interrupt conversations or take over what others are doing?',
          example: 'Butting into conversations, using others belongings without asking, starting to use equipment others are waiting for, or inserting yourself into activities uninvited.'
        }
      ]
    },
    impairment: {
      title: 'Part C: Impairment and History',
      description: 'Please answer the following questions about the impact of symptoms.',
      questions: [
        {
          id: 'imp1',
          text: 'Symptoms present in childhood',
          description: 'Were several of these symptoms present before you were 12 years old?',
          example: 'Think back to elementary school: Were you often described as "daydreamy," "hyperactive," or "easily distracted"? Did teachers comment on attention or behavior issues?',
          type: 'yesno'
        },
        {
          id: 'imp2',
          text: 'Symptoms in multiple settings',
          description: 'Do these symptoms occur in two or more different settings in your life?',
          example: 'Symptoms appear both at work AND at home, or at school AND in social situations, or at home AND with friends/relatives.',
          type: 'yesno'
        },
        {
          id: 'imp3',
          text: 'Symptoms affecting daily functioning',
          description: 'Do these symptoms clearly interfere with or reduce the quality of your work, school, or social life?',
          example: 'Poor work performance, strained relationships, academic difficulties, problems managing household responsibilities, or social awkwardness due to symptoms.',
          type: 'yesno'
        },
        {
          id: 'imp4',
          text: 'Overall severity of impact',
          description: 'How much do these symptoms interfere with your ability to function in daily life?',
          example: 'Consider impact on work/school performance, relationships, self-care, household management, and overall quality of life.',
          type: 'severity'
        }
      ]
    }
  };

  const [additionalNotes, setAdditionalNotes] = useState('');

  const frequencyOptions = [
    { value: 0, label: 'Never' },
    { value: 1, label: 'Rarely' },
    { value: 2, label: 'Sometimes' },
    { value: 3, label: 'Often' },
    { value: 4, label: 'Very Often' }
  ];

  const severityOptions = [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Slightly' },
    { value: 2, label: 'Moderately' },
    { value: 3, label: 'Considerably' },
    { value: 4, label: 'Extremely' }
  ];

  const handleResponse = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateResults = () => {
    const inattentionQuestions = sections.inattention.questions;
    const hyperactivityQuestions = sections.hyperactivity.questions;
    
    // Count symptoms that meet threshold (Often or Very Often = 3 or 4)
    let inattentionCount = 0;
    let hyperactivityCount = 0;
    let inattentionScore = 0;
    let hyperactivityScore = 0;

    inattentionQuestions.forEach(q => {
      const score = responses[q.id] || 0;
      inattentionScore += score;
      if (score >= 3) inattentionCount++;
    });

    hyperactivityQuestions.forEach(q => {
      const score = responses[q.id] || 0;
      hyperactivityScore += score;
      if (score >= 3) hyperactivityCount++;
    });

    // Check impairment criteria
    const beforeAge12 = responses['imp1'] === 1;
    const multipleSettings = responses['imp2'] === 1;
    const functionalImpairment = responses['imp3'] === 1;
    const severityLevel = responses['imp4'] || 0;

    // DSM-5 requires 6+ symptoms in either category for diagnosis
    const meetsInattentionCriteria = inattentionCount >= 6;
    const meetsHyperactivityCriteria = hyperactivityCount >= 6;
    const meetsSupportingCriteria = beforeAge12 && multipleSettings && functionalImpairment;

    let presentation = 'No significant indicators';
    let riskLevel = 'low';
    
    if (meetsSupportingCriteria) {
      if (meetsInattentionCriteria && meetsHyperactivityCriteria) {
        presentation = 'Combined Presentation';
        riskLevel = 'high';
      } else if (meetsInattentionCriteria) {
        presentation = 'Predominantly Inattentive Presentation';
        riskLevel = 'high';
      } else if (meetsHyperactivityCriteria) {
        presentation = 'Predominantly Hyperactive-Impulsive Presentation';
        riskLevel = 'high';
      } else if (inattentionCount >= 4 || hyperactivityCount >= 4) {
        presentation = 'Subclinical symptoms present';
        riskLevel = 'moderate';
      }
    } else if (inattentionCount >= 4 || hyperactivityCount >= 4) {
      presentation = 'Some symptoms present but criteria not fully met';
      riskLevel = 'moderate';
    }

    return {
      inattentionCount,
      hyperactivityCount,
      inattentionScore,
      hyperactivityScore,
      totalScore: inattentionScore + hyperactivityScore,
      maxScore: (inattentionQuestions.length + hyperactivityQuestions.length) * 4,
      presentation,
      riskLevel,
      meetsInattentionCriteria,
      meetsHyperactivityCriteria,
      meetsSupportingCriteria,
      severityLevel
    };
  };

  const handleSubmit = () => {
    const calculatedResults = calculateResults();
    setResults(calculatedResults);
    setShowResults(true);
  };

  const isCurrentSectionComplete = () => {
    const currentQuestions = sections[currentSection].questions;
    return currentQuestions.every(q => responses[q.id] !== undefined);
  };

  const getTotalQuestions = () => {
    return Object.values(sections).reduce((total, section) => total + section.questions.length, 0);
  };

  const getAnsweredQuestions = () => {
    return Object.keys(responses).length;
  };

  const progress = (getAnsweredQuestions() / getTotalQuestions()) * 100;

  const sectionKeys = Object.keys(sections);
  const currentSectionIndex = sectionKeys.indexOf(currentSection);

  const goToNextSection = () => {
    if (currentSectionIndex < sectionKeys.length - 1) {
      setCurrentSection(sectionKeys[currentSectionIndex + 1]);
    }
  };

  const goToPrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSection(sectionKeys[currentSectionIndex - 1]);
    }
  };

  const resetQuestionnaire = () => {
    setResponses({});
    setResults(null);
    setShowResults(false);
    setCurrentSection('inattention');
    setAdditionalNotes('');
  };

  if (showResults && results) {
    return (
      <div className="questionnaire-container">
        <header className="questionnaire-header">
          <div className="header-content">
            <div className="branding">
              <h1>DSM-5 ADHD Assessment</h1>
              <p>Self-Report Questionnaire Results</p>
            </div>
            <div className="header-actions">
              <button onClick={() => navigate('/dashboard')} className="btn btn-outline-small">
                Back to Dashboard
              </button>
            </div>
          </div>
        </header>

        <div className="questionnaire-content">
          <div className="results-container">
            <div className="results-header">
              <div className="results-icon">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
              <h2>Assessment Complete</h2>
              <p>Review your DSM-5 ADHD screening results below</p>
            </div>

            <div className="results-grid">
              <div className="result-card">
                <div className="result-label">Inattention Symptoms</div>
                <div className="result-value">{results.inattentionCount} / 9</div>
                <div className="result-sublabel">
                  {results.meetsInattentionCriteria ? 'Meets threshold (6+)' : 'Below threshold'}
                </div>
                <div className="result-bar">
                  <div 
                    className="result-bar-fill" 
                    style={{ width: `${(results.inattentionCount / 9) * 100}%` }}
                  />
                </div>
              </div>

              <div className="result-card">
                <div className="result-label">Hyperactivity-Impulsivity Symptoms</div>
                <div className="result-value">{results.hyperactivityCount} / 9</div>
                <div className="result-sublabel">
                  {results.meetsHyperactivityCriteria ? 'Meets threshold (6+)' : 'Below threshold'}
                </div>
                <div className="result-bar">
                  <div 
                    className="result-bar-fill" 
                    style={{ width: `${(results.hyperactivityCount / 9) * 100}%` }}
                  />
                </div>
              </div>

              <div className="result-card full-width">
                <div className="result-label">Total Symptom Score</div>
                <div className="result-value">{results.totalScore} / {results.maxScore}</div>
                <div className="result-bar">
                  <div 
                    className="result-bar-fill" 
                    style={{ width: `${(results.totalScore / results.maxScore) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className={`presentation-card risk-${results.riskLevel}`}>
              <div className="presentation-label">Indicated Presentation</div>
              <div className="presentation-value">{results.presentation}</div>
              <div className="presentation-note">
                {results.riskLevel === 'high' && 
                  'Based on your responses, you may benefit from a professional evaluation for ADHD.'}
                {results.riskLevel === 'moderate' && 
                  'Some symptoms are present. Consider discussing these with a healthcare provider.'}
                {results.riskLevel === 'low' && 
                  'Your responses do not indicate significant ADHD symptoms at this time.'}
              </div>
            </div>

            <div className="supporting-criteria">
              <h3>Supporting Criteria Met</h3>
              <div className="criteria-list">
                <div className={`criteria-item ${results.meetsSupportingCriteria ? 'met' : ''}`}>
                  <span className="criteria-icon">
                    {responses['imp1'] === 1 ? (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    )}
                  </span>
                  Symptoms present before age 12
                </div>
                <div className={`criteria-item ${responses['imp2'] === 1 ? 'met' : ''}`}>
                  <span className="criteria-icon">
                    {responses['imp2'] === 1 ? (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    )}
                  </span>
                  Present in multiple settings
                </div>
                <div className={`criteria-item ${responses['imp3'] === 1 ? 'met' : ''}`}>
                  <span className="criteria-icon">
                    {responses['imp3'] === 1 ? (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    )}
                  </span>
                  Functional impairment present
                </div>
              </div>
            </div>

            {additionalNotes && additionalNotes.trim() && (
              <div className="additional-notes-result">
                <h3>Your Additional Notes</h3>
                <div className="notes-content">
                  <p>{additionalNotes}</p>
                </div>
              </div>
            )}

            <div className="disclaimer-box">
              <div className="disclaimer-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              </div>
              <div className="disclaimer-text">
                <strong>Important Disclaimer</strong>
                <p>This screening tool is for informational purposes only and is not a diagnostic instrument. 
                Only a qualified healthcare professional can diagnose ADHD. Please consult with a psychiatrist, 
                psychologist, or other qualified clinician for a comprehensive evaluation.</p>
              </div>
            </div>

            <div className="results-actions">
              <button className="btn btn-outline-small" onClick={resetQuestionnaire}>
                Retake Assessment
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="questionnaire-container">
      <header className="questionnaire-header">
        <div className="header-content">
          <div className="branding">
            <h1>DSM-5 ADHD Assessment</h1>
            <p>Self-Report Screening Questionnaire</p>
          </div>
          <div className="header-actions">
            <button onClick={() => navigate('/dashboard')} className="btn btn-outline-small">
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="questionnaire-content">
        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-info">
            <span>Progress: {getAnsweredQuestions()} of {getTotalQuestions()} questions</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Section Navigation */}
        <div className="section-tabs">
          {sectionKeys.map((key, index) => (
            <button
              key={key}
              className={`section-tab ${currentSection === key ? 'active' : ''} ${
                sections[key].questions.every(q => responses[q.id] !== undefined) ? 'complete' : ''
              }`}
              onClick={() => setCurrentSection(key)}
            >
              <span className="tab-number">{index + 1}</span>
              <span className="tab-label">{sections[key].title.replace('Part ', '').split(':')[0]}</span>
            </button>
          ))}
        </div>

        {/* Current Section */}
        <div className="section-content">
          <div className="section-header">
            <h2>{sections[currentSection].title}</h2>
            <p>{sections[currentSection].description}</p>
          </div>

          <div className="questions-list">
            {sections[currentSection].questions.map((question, index) => (
              <div key={question.id} className="question-card">
                <div className="question-number">{index + 1}</div>
                <div className="question-content">
                  <div className="question-header-row">
                    <h4 className="question-title">{question.text}</h4>
                    <button 
                      className="example-btn"
                      onClick={() => setShowExample(showExample === question.id ? null : question.id)}
                      title="View example"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                      </svg>
                      Example
                    </button>
                  </div>
                  <p className="question-text">{question.description}</p>
                  
                  {showExample === question.id && (
                    <div className="example-box">
                      <div className="example-label">Example situations:</div>
                      <p>{question.example}</p>
                    </div>
                  )}
                  
                  {question.type === 'yesno' ? (
                    <div className="options-row yesno">
                      <button
                        className={`option-btn ${responses[question.id] === 1 ? 'selected' : ''}`}
                        onClick={() => handleResponse(question.id, 1)}
                      >
                        Yes
                      </button>
                      <button
                        className={`option-btn ${responses[question.id] === 0 ? 'selected' : ''}`}
                        onClick={() => handleResponse(question.id, 0)}
                      >
                        No
                      </button>
                    </div>
                  ) : question.type === 'severity' ? (
                    <div className="options-row severity">
                      {severityOptions.map(option => (
                        <button
                          key={option.value}
                          className={`option-btn ${responses[question.id] === option.value ? 'selected' : ''}`}
                          onClick={() => handleResponse(question.id, option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="options-row frequency">
                      {frequencyOptions.map(option => (
                        <button
                          key={option.value}
                          className={`option-btn ${responses[question.id] === option.value ? 'selected' : ''}`}
                          onClick={() => handleResponse(question.id, option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Notes Section - Only show on last section */}
        {currentSectionIndex === sectionKeys.length - 1 && (
          <div className="additional-notes-section">
            <div className="additional-notes-header">
              <h3>Additional Information (Optional)</h3>
              <p>Share any extra details about habits, concerns, or experiences you feel are relevant to your assessment.</p>
            </div>
            <div className="additional-notes-content">
              <textarea
                className="additional-notes-textarea"
                placeholder="Examples: problematic habits (nail biting, excessive phone use), coping strategies you use, sleep issues, family history of ADHD, previous diagnoses, specific triggers, or any other concerns you would like to share..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={6}
              />
              <div className="textarea-hint">
                This field is optional. Share as much or as little as you feel comfortable with.
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          <button
            className="btn btn-outline-small"
            onClick={goToPrevSection}
            disabled={currentSectionIndex === 0}
          >
            Previous Section
          </button>
          
          {currentSectionIndex < sectionKeys.length - 1 ? (
            <button
              className="btn btn-primary nav-btn"
              onClick={goToNextSection}
            >
              Next Section
            </button>
          ) : (
            <button
              className="btn btn-primary nav-btn"
              onClick={handleSubmit}
              disabled={getAnsweredQuestions() < getTotalQuestions()}
            >
              Submit Assessment
            </button>
          )}
        </div>

        {/* Info Box */}
        <div className="info-box">
          <div className="info-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>
          <p>
            This questionnaire is based on the DSM-5 diagnostic criteria for ADHD. 
            Answer each question honestly based on your experiences over the past 6 months.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DSM5Questionnaire;
