import React, { useState } from 'react';
import '../styles/pretask.css';

const PreTaskQuestionnaire = ({ isOpen, onClose, onSubmit, taskName }) => {
  const [responses, setResponses] = useState({
    hoursOfSleep: '',
    tookMedication: null,
    medicationName: '',
    timeSinceMedication: '',
    hadCaffeine: null,
    stressLevel: 5,
    environmentNoise: '',
    interruptionChance: '',
    focusLevel: 5
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setResponses(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user makes a selection
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!responses.hoursOfSleep) {
      newErrors.hoursOfSleep = 'Please select hours of sleep';
    }
    // Medication questions are optional - no validation needed
    if (responses.hadCaffeine === null) {
      newErrors.hadCaffeine = 'Please select an option';
    }
    if (!responses.environmentNoise) {
      newErrors.environmentNoise = 'Please select noise level';
    }
    if (!responses.interruptionChance) {
      newErrors.interruptionChance = 'Please select an option';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(responses);
    }
  };

  const resetForm = () => {
    setResponses({
      hoursOfSleep: '',
      tookMedication: null,
      medicationName: '',
      timeSinceMedication: '',
      hadCaffeine: null,
      stressLevel: 5,
      environmentNoise: '',
      interruptionChance: '',
      focusLevel: 5
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="pretask-overlay">
      <div className="pretask-modal">
        <div className="pretask-header">
          <h2>Pre-Task Check-In</h2>
          <p>Please answer these questions before starting {taskName}</p>
        </div>

        <div className="pretask-content">
          {/* Hours of Sleep */}
          <div className="pretask-question">
            <label>How many hours did you sleep last night?</label>
            <div className="options-grid sleep-options">
              {['< 4', '4-5', '5-6', '6-7', '7-8', '8+'].map(option => (
                <button
                  key={option}
                  className={`option-btn ${responses.hoursOfSleep === option ? 'selected' : ''}`}
                  onClick={() => handleChange('hoursOfSleep', option)}
                >
                  {option} hrs
                </button>
              ))}
            </div>
            {errors.hoursOfSleep && <span className="error-text">{errors.hoursOfSleep}</span>}
          </div>

          {/* Medication (Optional) */}
          <div className="pretask-question">
            <label>Have you taken any ADHD or psychiatric medication today? <span className="optional-tag">(Optional)</span></label>
            <div className="options-grid binary-options">
              <button
                className={`option-btn ${responses.tookMedication === true ? 'selected' : ''}`}
                onClick={() => handleChange('tookMedication', true)}
              >
                Yes
              </button>
              <button
                className={`option-btn ${responses.tookMedication === false ? 'selected' : ''}`}
                onClick={() => handleChange('tookMedication', false)}
              >
                No
              </button>
              <button
                className={`option-btn ${responses.tookMedication === 'skip' ? 'selected' : ''}`}
                onClick={() => handleChange('tookMedication', 'skip')}
              >
                Prefer not to say
              </button>
            </div>
          </div>

          {/* Medication Details (conditional, optional) */}
          {responses.tookMedication === true && (
            <div className="pretask-question conditional">
              <div className="medication-details">
                <div className="detail-field">
                  <label>Medication name <span className="optional-tag">(Optional)</span></label>
                  <input
                    type="text"
                    placeholder="e.g., Adderall, Ritalin, Vyvanse..."
                    value={responses.medicationName}
                    onChange={(e) => handleChange('medicationName', e.target.value)}
                  />
                </div>
                <div className="detail-field">
                  <label>Time since taking medication <span className="optional-tag">(Optional)</span></label>
                  <div className="options-grid time-options">
                    {['< 1 hr', '1-2 hrs', '2-4 hrs', '4-6 hrs', '6+ hrs'].map(option => (
                      <button
                        key={option}
                        className={`option-btn small ${responses.timeSinceMedication === option ? 'selected' : ''}`}
                        onClick={() => handleChange('timeSinceMedication', option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Caffeine */}
          <div className="pretask-question">
            <label>Have you had caffeine in the last 2 hours?</label>
            <div className="options-grid binary-options">
              <button
                className={`option-btn ${responses.hadCaffeine === true ? 'selected' : ''}`}
                onClick={() => handleChange('hadCaffeine', true)}
              >
                Yes
              </button>
              <button
                className={`option-btn ${responses.hadCaffeine === false ? 'selected' : ''}`}
                onClick={() => handleChange('hadCaffeine', false)}
              >
                No
              </button>
            </div>
            {errors.hadCaffeine && <span className="error-text">{errors.hadCaffeine}</span>}
          </div>

          {/* Stress Level */}
          <div className="pretask-question">
            <label>What is your current stress level? <span className="value-display">{responses.stressLevel}/10</span></label>
            <div className="slider-container">
              <span className="slider-label">Low</span>
              <input
                type="range"
                min="0"
                max="10"
                value={responses.stressLevel}
                onChange={(e) => handleChange('stressLevel', parseInt(e.target.value))}
                className="slider"
              />
              <span className="slider-label">High</span>
            </div>
            <div className="slider-markers">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <span key={num} className={responses.stressLevel === num ? 'active' : ''}>{num}</span>
              ))}
            </div>
          </div>

          {/* Environment Noise */}
          <div className="pretask-question">
            <label>How noisy is your current environment?</label>
            <div className="options-grid noise-options">
              {[
                { value: 'silent', label: 'Silent' },
                { value: 'quiet', label: 'Quiet' },
                { value: 'moderate', label: 'Moderate' },
                { value: 'noisy', label: 'Noisy' },
                { value: 'very-noisy', label: 'Very Noisy' }
              ].map(option => (
                <button
                  key={option.value}
                  className={`option-btn ${responses.environmentNoise === option.value ? 'selected' : ''}`}
                  onClick={() => handleChange('environmentNoise', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {errors.environmentNoise && <span className="error-text">{errors.environmentNoise}</span>}
          </div>

          {/* Interruption Chance */}
          <div className="pretask-question">
            <label>What is the chance of being interrupted during this task?</label>
            <div className="options-grid interruption-options">
              {[
                { value: 'none', label: 'Very Low' },
                { value: 'low', label: 'Low' },
                { value: 'moderate', label: 'Moderate' },
                { value: 'high', label: 'High' },
                { value: 'very-high', label: 'Very High' }
              ].map(option => (
                <button
                  key={option.value}
                  className={`option-btn ${responses.interruptionChance === option.value ? 'selected' : ''}`}
                  onClick={() => handleChange('interruptionChance', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {errors.interruptionChance && <span className="error-text">{errors.interruptionChance}</span>}
          </div>

          {/* Focus Level */}
          <div className="pretask-question">
            <label>How would you rate your current focus level? <span className="value-display">{responses.focusLevel}/10</span></label>
            <div className="slider-container">
              <span className="slider-label">Unfocused</span>
              <input
                type="range"
                min="0"
                max="10"
                value={responses.focusLevel}
                onChange={(e) => handleChange('focusLevel', parseInt(e.target.value))}
                className="slider"
              />
              <span className="slider-label">Very Focused</span>
            </div>
            <div className="slider-markers">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <span key={num} className={responses.focusLevel === num ? 'active' : ''}>{num}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="pretask-footer">
          <button className="btn btn-outline" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Start Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreTaskQuestionnaire;
