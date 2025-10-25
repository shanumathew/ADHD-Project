/**
 * Utility functions for ADHD assessment tasks
 */

export const logResults = (taskName, results) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    task: taskName,
    results
  };
  
  // Log to console
  console.log(`[${taskName}] Results:`, logEntry);
  
  // Save to localStorage
  try {
    const existingData = JSON.parse(localStorage.getItem('adhd_assessment_results') || '[]');
    existingData.push(logEntry);
    localStorage.setItem('adhd_assessment_results', JSON.stringify(existingData));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
  
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
  return total === 0 ? 0 : ((correct / total) * 100).toFixed(2);
};

export const calculateAverageReactionTime = (times) => {
  if (times.length === 0) return 0;
  const sum = times.reduce((acc, val) => acc + val, 0);
  return (sum / times.length).toFixed(2);
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
