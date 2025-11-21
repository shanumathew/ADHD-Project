import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const TasksPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <nav className="navbar scrolled">
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="logo-text">MC Biomarker</span>
        </div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/features">Features</a></li>
          <li><a href="/tasks" className="active">Tasks</a></li>
          <li><a href="/why-us">Why Us</a></li>
          <li><a href="/benefits">Benefits</a></li>
        </ul>
        <button className="nav-cta" onClick={() => navigate('/login')}>
          Get Started →
        </button>
      </nav>

      <section id="tasks" className="tasks-section" style={{ paddingTop: '8rem' }}>
        <div className="section-header">
          <h2 className="section-title">Five Cognitive Tasks</h2>
          <p className="section-subtitle">Each task measures reaction time variability — together they reveal the cross-task consistency pattern unique to ADHD</p>
        </div>
        <div className="tasks-grid">
          <div className="task-card">
            <div className="task-number">01</div>
            <h3>Go/No-Go Task</h3>
            <p>Measures response inhibition and impulsivity. Subjects respond to "Go" signals but withhold response to "No-Go" signals. RT variability on Go trials reveals attention inconsistency.</p>
            <div className="task-metrics">
              <span>RT Variability: High in ADHD</span>
              <span>Duration: 3 min</span>
            </div>
          </div>
          <div className="task-card">
            <div className="task-number">02</div>
            <h3>Stroop Task</h3>
            <p>Tests cognitive control and interference resolution. Color-word conflicts (e.g., "RED" in blue) require executive function. RT variability measures attention lapses during conflict trials.</p>
            <div className="task-metrics">
              <span>RT Variability: Inconsistent in ADHD</span>
              <span>Duration: 3 min</span>
            </div>
          </div>
          <div className="task-card">
            <div className="task-number">03</div>
            <h3>N-Back Task</h3>
            <p>Evaluates working memory and sustained attention. Subjects identify if current stimulus matches one from N steps earlier. RT variability reveals attention fluctuations during memory load.</p>
            <div className="task-metrics">
              <span>RT Variability: Erratic in ADHD</span>
              <span>Duration: 3 min</span>
            </div>
          </div>
          <div className="task-card">
            <div className="task-number">04</div>
            <h3>Flanker Task</h3>
            <p>Measures selective attention and distractor interference. Target arrows surrounded by congruent or incongruent flankers test attention focus. RT variability shows attention drift.</p>
            <div className="task-metrics">
              <span>RT Variability: Unstable in ADHD</span>
              <span>Duration: 3 min</span>
            </div>
          </div>
          <div className="task-card">
            <div className="task-number">05</div>
            <h3>Stop-Signal Task</h3>
            <p>Assesses motor inhibition and response cancellation. "Stop" signals require halting initiated responses. RT variability on non-stop trials reveals baseline attention inconsistency.</p>
            <div className="task-metrics">
              <span>RT Variability: Variable in ADHD</span>
              <span>Duration: 3 min</span>
            </div>
          </div>
        </div>

        <div className="cross-task-section">
          <h2 className="section-title">The Cross-Task Consistency Innovation</h2>
          <p className="cross-task-description">
            Each task alone shows RT variability — but <strong>the pattern across all five tasks</strong> is what differentiates ADHD from non-ADHD.
          </p>
          <div className="innovation-grid">
            <div className="innovation-card traditional">
              <h4>Traditional Methods</h4>
              <p>
                Look at single-task performance or average across tasks. Misses the <strong>consistency pattern</strong> that defines ADHD.
              </p>
            </div>
            <div className="innovation-card mc-biomarker">
              <h4>MC Biomarker Innovation</h4>
              <p>
                Measures <strong>cross-task RT variability consistency</strong> — the signature cognitive fingerprint of ADHD. Patent-protected metric achieving 0.91 AUC.
              </p>
            </div>
          </div>
          <div className="key-finding">
            <p>
              <strong>Key Finding:</strong> ADHD subjects show consistently high RT variability <em>across all five tasks</em> — non-ADHD subjects show variable patterns task-to-task.
            </p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>MC Biomarker</h4>
            <p>Revolutionary cross-task consistency metric for ADHD diagnosis. Patent-protected innovation achieving 91% diagnostic accuracy.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/features">Features</a></li>
              <li><a href="/tasks">Tasks</a></li>
              <li><a href="/why-us">Why Us</a></li>
              <li><a href="/benefits">Benefits</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#documentation">Documentation</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 MC Biomarker Assessment Suite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TasksPage;
