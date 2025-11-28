import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import '../styles/loading.css';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (!authLoading && currentUser && userProfile) {
      // Check if profile is complete
      if (userProfile.profileComplete === true) {
        navigate('/dashboard');
      } else {
        // profileComplete is false or undefined - go to profile
        navigate('/profile');
      }
    }
  }, [currentUser, userProfile, authLoading, navigate]);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user;
      if (isSignup) {
        // Create new user
        const result = await createUserWithEmailAndPassword(auth, email, password);
        user = result.user;
        
        // Update profile with display name
        if (displayName) {
          await updateProfile(user, { displayName });
        }
      } else {
        // Sign in existing user
        const result = await signInWithEmailAndPassword(auth, email, password);
        user = result.user;
      }

      console.log('User authenticated:', user.email);
      // Profile redirect is handled by useEffect
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('Google user:', result.user);
      // Profile redirect is handled by useEffect
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <a href="/" className="back-to-home">← Back to Home</a>
      <div className="auth-card">
        <div className="auth-header">
          <h1>ADHD Assessment Suite</h1>
          <p>{isSignup ? 'Create Account' : 'Sign In'}</p>
        </div>

        <form onSubmit={handleEmailAuth} className="auth-form">
          {isSignup && (
            <div className="form-group">
              <label>Display Name (optional)</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="form-input"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="form-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full"
            style={{ marginBottom: '15px' }}
          >
            {loading ? (
              <span className="loading-spinner-small">
                <span className="spinner"></span>
                Processing
              </span>
            ) : isSignup ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="btn btn-google"
        >
          <img src="https://www.gstatic.com/firebaseapp/images/social/google.svg" alt="Google" />
          Sign {isSignup ? 'up' : 'in'} with Google
        </button>

        <div className="auth-toggle">
          <p>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              className="toggle-link"
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
