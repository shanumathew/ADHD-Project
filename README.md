# ADHD Assessment Suite

A comprehensive web-based ADHD assessment suite built with React that includes five digital cognitive tasks for evaluating attention, executive function, and processing speed.

## Features

### Five Cognitive Tasks

1. **Continuous Performance Task (CPT)**
   - Detect target stimuli (letter "X") among random letters
   - Measures: Hits, Misses, False Alarms, Reaction Time
   - Duration: 40 stimuli presentations

2. **Go/No-Go Task**
   - Respond to green circles, inhibit response to red circles
   - Measures: Commission errors, Omission errors, Reaction Time
   - Duration: 60 trials (70% Go, 30% No-Go)

3. **N-Back Task**
   - Match current stimulus to one n steps back (1-back, 2-back, or 3-back)
   - Measures: Hits, Misses, False Alarms, Correct Rejections, Accuracy
   - Duration: 25 letter presentations

4. **Flanker Task**
   - Identify central target direction while ignoring distractors
   - Measures: Accuracy, Reaction Time, Congruency Effect
   - Duration: 40 trials (20 congruent + 20 incongruent)

5. **Trail-Making / Sorting Task**
   - Click items in sequential order (numbers 1-15 or letters A-O)
   - Measures: Completion Time, Errors, Accuracy
   - Duration: 15 items

## Project Structure

```
ADHD-Assessment/
├── src/
│   ├── components/
│   │   ├── CPTTask.jsx
│   │   ├── GoNoGoTask.jsx
│   │   ├── NBackTask.jsx
│   │   ├── FlankerTask.jsx
│   │   └── TrailMakingTask.jsx
│   ├── utils/
│   │   └── taskUtils.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## Installation

1. Navigate to the project directory:
```bash
cd "c:\Users\shanu.Nustartz\Desktop\ADHD Project"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` (or the URL shown in terminal)

## Usage

### Running the Application

1. Click on any task from the main menu
2. Read the task instructions
3. Click "Start Task" to begin
4. Follow the on-screen instructions for each task
5. Results are automatically logged to console and localStorage

### Key Controls

- **CPT Task**: Press SPACEBAR for target letter
- **Go/No-Go Task**: Press SPACEBAR for green circles, inhibit for red
- **N-Back Task**: Press 1/↑ for match, 2/↓ for no-match
- **Flanker Task**: Press ← for left arrow, → for right arrow
- **Trail-Making**: Click items in sequential order

### Viewing Results

All results are:
- Logged to browser console
- Saved to localStorage
- Displayed after task completion

To view all stored results in the browser console:
```javascript
console.log(JSON.parse(localStorage.getItem('adhd_assessment_results')));
```

To download results as JSON:
The app can be extended with a download button in the main menu.

## Technical Details

### Technologies Used
- React 18.2.0
- Vite 5.0.8
- CSS3 for styling
- JavaScript (ES6+)

### Key Features

- **Reaction Time Measurement**: All tasks track reaction times in milliseconds
- **Error Tracking**: Comprehensive error tracking for each task type
- **Real-time Stats**: Live updates during task execution
- **LocalStorage Integration**: Persistent result storage
- **Responsive Design**: Works on desktop and tablet devices
- **Modular Components**: Each task is self-contained and independent

### Performance Metrics Calculated

- Accuracy (percentage)
- Average Reaction Time (ms)
- Hits/Misses
- False Alarms
- Correct Rejections
- Commission/Omission Errors
- Congruency Effect (Flanker task)
- Completion Time (Trail-Making task)

## Data Storage

Results are stored locally in the browser's localStorage. Each entry contains:
- Timestamp
- Task name
- Detailed results object
- All raw reaction times

Example stored data structure:
```json
{
  "timestamp": "2025-10-25T10:30:00.000Z",
  "task": "Continuous Performance Task (CPT)",
  "results": {
    "totalTrials": 40,
    "hits": 35,
    "misses": 2,
    "falseAlarms": 1,
    "accuracy": "87.50",
    "averageReactionTime": "450.25"
  }
}
```

## Accessibility Considerations

- Keyboard-friendly controls for all tasks
- Clear visual feedback for responses
- High contrast color schemes
- Responsive design for different screen sizes

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Future Enhancements

- Export results to CSV
- Generate PDF reports
- User profiles and history tracking
- Customizable task parameters
- Remote data submission
- Statistical analysis tools
- Multi-language support

## Notes

- Tasks are designed for brief assessments (not clinical diagnosis)
- Results should be interpreted by qualified professionals
- For accurate results, ensure minimal distractions during testing
- Recommended completion order: CPT → Go/No-Go → N-Back → Flanker → Trail-Making

## License

This project is provided as-is for educational and research purposes.

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port.

### Results Not Appearing
- Check browser console for errors
- Clear localStorage and try again
- Ensure JavaScript is enabled
- Try a different browser

### Performance Issues
- Close other browser tabs
- Clear browser cache
- Restart the development server

## Support

For issues or questions, refer to the console output and ensure all dependencies are properly installed.
