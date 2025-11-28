/**
 * Utility functions for ADHD assessment tasks
 */

// Task name mapping for pre-task questionnaire lookup
const TASK_NAME_MAP = {
  'Continuous Performance Task (CPT)': 'Continuous Performance Task',
  'Go/No-Go Task': 'Go/No-Go Task',
  'N-Back Task': 'N-Back Task',
  'Flanker Task': 'Flanker Task',
  'Trail Making Task': 'Trail Making Task',
  'Trail-Making / Sorting Task': 'Trail Making Task'
};

export const logResults = (taskName, results, taskConfig = {}) => {
  const timestamp = new Date().toISOString();
  
  // Get pre-task questionnaire data from sessionStorage
  // Try multiple possible key formats
  let preTaskData = null;
  try {
    const mappedName = TASK_NAME_MAP[taskName] || taskName;
    const possibleKeys = [
      `preTaskResponses_${taskName}`,
      `preTaskResponses_${mappedName}`,
      'pretask_responses'
    ];
    
    for (const key of possibleKeys) {
      const stored = sessionStorage.getItem(key);
      if (stored) {
        preTaskData = JSON.parse(stored);
        console.log('✅ Found pre-task data with key:', key);
        break;
      }
    }
  } catch (err) {
    console.warn('Could not retrieve pre-task data:', err);
  }
  
  // Build comprehensive log entry
  const logEntry = {
    timestamp,
    task: taskName,
    taskType: 'cognitive_task',
    taskConfig: {
      ...taskConfig,
      completedAt: timestamp
    },
    results,
    preTaskContext: preTaskData
  };
  
  // Log to console
  console.log(`[${taskName}] Results:`, logEntry);
  console.log('📝 Attempting to save results for task:', taskName);
  if (preTaskData) {
    console.log('📋 Pre-task context included:', preTaskData);
  }
  if (Object.keys(taskConfig).length > 0) {
    console.log('⚙️ Task config included:', taskConfig);
  }
  
  // Save to localStorage
  try {
    const existingData = JSON.parse(localStorage.getItem('adhd_assessment_results') || '[]');
    existingData.push(logEntry);
    localStorage.setItem('adhd_assessment_results', JSON.stringify(existingData));
    console.log('✅ Saved to localStorage');
    
    // Emit custom event to notify ResultsPanel to refresh
    window.dispatchEvent(new Event('resultsUpdated'));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }

  // Also save to Firestore (if configured)
  (async () => {
    try {
      console.log('🔄 Starting Firestore save...');
      
      const fb = await import('../firebase');
      const firestore = await import('firebase/firestore');
      const db = fb.db;
      const auth = fb.auth;
      
      console.log('📦 Firebase imported, db:', db ? '✓' : '✗', 'auth:', auth ? '✓' : '✗');

      // Wait a moment for auth to be ready
      let user = auth?.currentUser;
      let retries = 0;
      
      while (!user && retries < 5) {
        console.log('⏳ Waiting for auth to be ready... (attempt', retries + 1, ')');
        await new Promise(r => setTimeout(r, 500));
        user = auth?.currentUser;
        retries++;
      }

      console.log('👤 Current user:', user?.uid, 'Email:', user?.email);

      if (!user) {
        console.error('❌ No authenticated user found after retries');
        return;
      }

      const docData = {
        userId: user.uid,
        email: user.email || 'no-email',
        displayName: user.displayName || 'User',
        taskName,
        taskType: 'cognitive_task',
        taskConfig: {
          ...taskConfig,
          completedAt: timestamp
        },
        results,
        preTaskContext: preTaskData,
        recordedAt: firestore.serverTimestamp()
      };

      console.log('💾 Saving document:', docData);

      const docRef = await firestore.addDoc(
        firestore.collection(db, 'results'),
        docData
      );
      
      console.log('✅ Result saved to Firestore with ID:', docRef.id);
      console.log('🎉 Full path: results/', docRef.id);
      
      // Emit event after Firestore save
      window.dispatchEvent(new Event('resultsUpdated'));
      
    } catch (err) {
      console.error('❌ Error in Firestore save:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      console.error('Error code:', err.code);
    }
  })();
  
  return logEntry;
};

export const downloadResults = () => {
  try {
    const results = JSON.parse(localStorage.getItem('adhd_assessment_results') || '[]');
    if (results.length === 0) {
      alert('No results to download');
      return;
    }
    
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `adhd_assessment_results_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading results:', error);
  }
};

export const calculateAccuracy = (correct, total) => {
  return total === 0 ? 0 : parseFloat(((correct / total) * 100).toFixed(2));
};

export const calculateAverageReactionTime = (times) => {
  if (times.length === 0) return 0;
  const sum = times.reduce((acc, val) => acc + val, 0);
  return parseFloat((sum / times.length).toFixed(2));
};

export const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const formatTime = (ms) => {
  return `${ms.toFixed(0)}ms`;
};

export const generateRandomLetters = (count, length = 1) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(letters.charAt(Math.floor(Math.random() * letters.length)));
  }
  return result;
};

export const generateRandomNumbers = (count, max = 9) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(Math.floor(Math.random() * (max + 1)));
  }
  return result;
};
