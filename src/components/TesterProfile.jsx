import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';

const generateTesterId = () => {
  // Format: ADHD-YYYYMMDD-XXXXX (5 random alphanumeric)
  const date = new Date();
  const dateStr = date.getFullYear() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0');
  
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ADHD-${dateStr}-${randomStr}`;
};

const TesterProfile = () => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'prefer-not-to-say',
    adhdStatus: 'control',
    testerId: generateTesterId()
  });

  useEffect(() => {
    // Redirect if not authenticated
    if (!currentUser) {
      navigate('/');
      return;
    }

    // Pre-fill from profile if available
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        name: userProfile.name || '',
        age: userProfile.age || '',
        gender: userProfile.gender || 'prefer-not-to-say',
        adhdStatus: userProfile.adhdStatus || 'control',
        testerId: userProfile.testerId || prev.testerId
      }));
    }
  }, [currentUser, userProfile, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGenerateNewId = () => {
    setFormData(prev => ({
      ...prev,
      testerId: generateTesterId()
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        setError('Please enter your name');
        setLoading(false);
        return;
      }

      if (!formData.age) {
        setError('Please enter your age');
        setLoading(false);
        return;
      }

      const profileData = {
        ...formData,
        profileComplete: true,
        lastUpdated: new Date().toISOString()
      };

      const success = await updateUserProfile(profileData);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Failed to save profile. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      {userProfile?.profileComplete && (
        <a href="/dashboard" className="profile-back-link">
          ← Back to Dashboard
        </a>
      )}
      <div className="profile-card">
        <div className="profile-header">
          <h1>{userProfile?.profileComplete ? 'Edit Your Profile' : 'Complete Your Profile'}</h1>
          <p>{userProfile?.profileComplete ? 'Update your information' : 'Help us personalize your assessment experience'}</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {/* Name Section */}
          <div className="form-section">
            <h3>Identity Information</h3>
            
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                className="form-input"
              />
            </div>
          </div>

          {/* Demographics Section */}
          <div className="form-section">
            <h3>Demographics</h3>
            
            <div className="form-group">
              <label>Age *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="18"
                min="6"
                max="120"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-input"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div className="form-group">
              <label>ADHD Status</label>
              <select
                name="adhdStatus"
                value={formData.adhdStatus}
                onChange={handleChange}
                className="form-input"
              >
                <option value="control">Control (no diagnosis)</option>
                <option value="suspected">Suspected ADHD</option>
                <option value="diagnosed">Diagnosed ADHD</option>
              </select>
            </div>
          </div>

          {/* Tester ID Section */}
          <div className="form-section">
            <h3>Unique Tester ID</h3>
            <p className="info-text">
              This ID will be used to track your results across multiple sessions.
            </p>
            
            <div className="tester-id-display">
              <div className="id-value">
                {formData.testerId}
              </div>
              <button
                type="button"
                onClick={handleGenerateNewId}
                className="btn btn-secondary"
              >
                Generate New ID
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full"
            style={{ marginTop: '20px' }}
          >
            {loading ? 'Saving Profile...' : userProfile?.profileComplete ? 'Save Changes' : 'Continue to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TesterProfile;
