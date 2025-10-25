# 🧠 ADHD Assessment Suite v2.0

**A professional, full-featured web-based cognitive assessment platform with user authentication, personalized profiles, and 5 scientifically-designed cognitive tasks.**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Version](https://img.shields.io/badge/version-2.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

## ✨ Key Highlights

✅ **Complete Authentication System** - Email/Password + Google OAuth  
✅ **User Management** - Profiles with auto-generated Tester IDs  
✅ **5 Cognitive Tasks** - Research-backed assessments  
✅ **Real-time Results** - Firestore database integration  
✅ **Responsive Design** - Mobile, tablet, desktop ready  
✅ **Production Ready** - Security rules, error handling, optimization  

---

## 🚀 Quick Start (3 Steps)

### Step 1: Get Firebase Web API Key
1. Visit: https://console.firebase.google.com/
2. Select: `adhdproject-5f8e0`
3. Go to: ⚙️ **Project Settings** → **Your apps** → **Web**
4. Copy the `apiKey` value

### Step 2: Configure Environment
Create `.env.local` in project root:
```
VITE_FIREBASE_API_KEY=AIzaSy_YOUR_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=adhdproject-5f8e0.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=adhdproject-5f8e0
VITE_FIREBASE_STORAGE_BUCKET=adhdproject-5f8e0.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=109218361716425596781
VITE_FIREBASE_APP_ID=1:109218361716425596781:web:YOUR_APP_ID
```

### Step 3: Run the App
```bash
npm install
npm run dev
# Open http://localhost:5173/
```

---

## 📋 5 Cognitive Tasks

| Task | Focus | Duration | Format |
|------|-------|----------|--------|
| **CPT** | Sustained Attention | ~1 min | Letter detection (25% target) |
| **Go/No-Go** | Impulse Control | ~2 min | Color response inhibition (70/30) |
| **N-Back** | Working Memory | ~1.5 min | Sequence matching (1/2/3-back) |
| **Flanker** | Selective Attention | ~2 min | Arrow direction (congruent/incongruent) |
| **Trail-Making** | Processing Speed | Variable | Click sequence ordering |

### Metrics Collected Per Task
- **Accuracy %**
- **Reaction Time (ms)**
- **Hits / Misses**
- **False Alarms**
- **Correct Rejections**
- **Task-specific scores**

---

## 🏗️ Architecture

```
User Flow:
┌─────────────────┐
│   Login/Signup  │ ← Email or Google OAuth
└────────┬────────┘
         ↓
┌─────────────────┐
│  Profile Setup  │ ← Auto-generate Tester ID
└────────┬────────┘
         ↓
┌─────────────────┐
│   Dashboard     │ ← Select tasks
└────────┬────────┘
         ↓
┌─────────────────┐
│ Run Assessment  │ ← Collect metrics
└────────┬────────┘
         ↓
┌─────────────────┐
│  Save Results   │ ← Firestore storage
└────────┬────────┘
         ↓
┌─────────────────┐
│  View Results   │ ← Dashboard display
└─────────────────┘

Technology Stack:
React 18 ↔ Vite ↔ Firebase Auth ↔ Firestore
```

---

## 📁 Project Structure

```
ADHD-Project/
├── src/
│   ├── components/              # React components
│   │   ├── Login.jsx           # Auth page
│   │   ├── TesterProfile.jsx   # Profile setup
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   ├── CPTTask.jsx         # Assessment tasks
│   │   ├── GoNoGoTask.jsx
│   │   ├── NBackTask.jsx
│   │   ├── FlankerTask.jsx
│   │   └── TrailMakingTask.jsx
│   ├── context/
│   │   └── AuthContext.jsx     # Auth state management
│   ├── styles/                 # CSS files
│   │   ├── auth.css
│   │   ├── dashboard.css
│   │   ├── profile.css
│   │   └── task.css
│   ├── firebase.js             # Firebase config
│   ├── App.jsx                 # Routing
│   └── main.jsx
├── .env.local                  # Firebase credentials (CREATE THIS!)
├── .env.local.example          # Example config
├── index.html
├── vite.config.js
├── package.json
├── QUICK_START.md              # 👈 Start here!
├── FIREBASE_SETUP.md           # Detailed Firebase guide
├── README.md                   # This file
└── public/
```

---

## 🔐 Authentication Flow

```javascript
User visits app
  ↓
Email/Password OR Google Sign-In
  ↓
Firebase Authentication
  ↓
Create user in Firestore
  ↓
Redirect to Profile Setup
  ↓
Generate Tester ID (ADHD-YYYYMMDD-XXXXX)
  ↓
Save profile to Firestore
  ↓
Redirect to Dashboard
```

---

## 💾 Firestore Data Structure

### Users Collection
```javascript
/users/{uid}
{
  uid: "firebase-uid",
  email: "user@example.com",
  displayName: "John Doe",
  name: "John Doe",              // Or initials if anonymous
  age: 25,
  gender: "male",
  adhdStatus: "diagnosed",       // diagnosed | suspected | control
  testerId: "ADHD-20251025-ABC12", // Auto-generated
  profileComplete: true,
  createdAt: "2025-10-25T10:30:00Z"
}
```

### Results Collection
```javascript
/results/{resultId}
{
  userId: "firebase-uid",
  taskId: "cpt",
  testerId: "ADHD-20251025-ABC12",
  timestamp: "2025-10-25T10:45:00Z",
  
  // CPT specific metrics
  totalTrials: 40,
  hits: 15,
  misses: 2,
  falseAlarms: 1,
  accuracy: 88.2,
  avgReactionTimeMs: 425.5,
  reactionTimesMs: [410, 430, 420, ...]
}
```

---

## 🔒 Security

### Firebase Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Only users can read/write their own results
    match /results/{resultId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### Features
- ✅ Firebase Authentication (encrypted credentials)
- ✅ HTTPS only communication
- ✅ Firestore security rules (user-level access control)
- ✅ No sensitive data in local storage
- ✅ Token-based session management

---

## 🛠️ Development

### Install Dependencies
```bash
npm install
```

### Start Dev Server
```bash
npm run dev
```
Open: http://localhost:5173/

### Build for Production
```bash
npm run build
```
Output: `dist/` folder

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

### Deploy to Vercel/Netlify
- Push to GitHub
- Connect repo to Vercel/Netlify
- Set environment variables
- Auto-deploy on push

---

## 📊 Firestore Setup

### Enable Features
1. **Authentication**
   - Go to Firebase Console → Authentication
   - Enable: Email/Password, Google
   - Add authorized domains: `localhost:5173`, your production domain

2. **Firestore Database**
   - Go to Firestore Database
   - Create Database → Test Mode → Region: `us-central1`
   - Copy security rules above

3. **Indexes** (if needed)
   - Firestore auto-creates indexes for queries
   - Check Composite Indexes if queries fail

---

## 🎯 Task Specifications

### CPT - Continuous Performance Task
- **Duration:** 1.5 sec per stimulus
- **ISI:** 0.5 sec (inter-stimulus interval)
- **Total Stimuli:** 40 (25% target "X")
- **Measures:** Hits, Misses, False Alarms, Reaction Time
- **Keyboard:** SPACEBAR on target

### Go/No-Go Task
- **Duration:** 2 sec per stimulus
- **ISI:** 0.5 sec
- **Trials:** 60 (70% green Go, 30% red No-Go)
- **Measures:** Go Accuracy, No-Go Accuracy, Errors, RT
- **Keyboard:** SPACEBAR only on green

### N-Back Task
- **Duration:** 2.5 sec per stimulus
- **ISI:** 0.5 sec
- **Levels:** 1-Back, 2-Back, 3-Back
- **Trials:** 25 per level
- **Measures:** Hits, Misses, False Alarms, RT, Accuracy
- **Keyboard:** 1/↑ for match, 2/↓ for no-match

### Flanker Task
- **Duration:** 3 sec per trial
- **ISI:** 0.5 sec
- **Trials:** 40 (20 congruent, 20 incongruent)
- **Measures:** Accuracy, Congruency Effect, RT
- **Keyboard:** ← for left, → for right arrow

### Trail-Making Task
- **Format:** Click-based (no timing)
- **Items:** 15 (numbers or letters)
- **Measures:** Completion Time, Errors, Accuracy
- **Mouse:** Click items in order

---

## ❓ FAQ

**Q: Can I use this without Firebase?**  
A: The app requires Firebase for auth/storage. Use Firebase Emulator for local development.

**Q: Can I modify the tasks?**  
A: Yes! Edit task parameters in each component (timing, trial count, target probability, etc.)

**Q: How do I download results?**  
A: Extend the dashboard with an "Export" button that uses Firestore queries to download results as CSV/JSON.

**Q: Is this clinically validated?**  
A: Tasks are based on established paradigms but results need professional interpretation.

**Q: Can I run this offline?**  
A: No, authentication and storage require Firebase connectivity.

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Firebase config missing" | Add all 6 env vars to `.env.local` |
| Can't login | Enable Email/Password in Firebase Auth |
| Google sign-in fails | Add `localhost:5173` to authorized domains in Firebase |
| Results not saving | Check Firestore security rules allow your uid |
| App is slow | Clear browser cache, restart dev server |
| Keyboard not responding | Focus the stimulus area first, ensure Task is active |

See `QUICK_START.md` and `FIREBASE_SETUP.md` for detailed help.

---

## 📚 Additional Resources

- **QUICK_START.md** - Get up and running in 5 minutes
- **FIREBASE_SETUP.md** - Complete Firebase configuration guide
- **GET_WEB_API_KEY.md** - Step-by-step API key retrieval

---

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.x",
  "firebase": "^10.x",
  "vite": "^5.4.0"
}
```

---

## 🚀 Deployment Checklist

- [ ] Add Firebase Web API Key to `.env.local`
- [ ] Enable Email/Password auth in Firebase
- [ ] Enable Google OAuth in Firebase
- [ ] Add authorized domains
- [ ] Set Firestore security rules
- [ ] Test login flow locally
- [ ] Test all 5 tasks
- [ ] Build: `npm run build`
- [ ] Test production build: `npm run preview`
- [ ] Deploy to Firebase Hosting / Vercel / Netlify
- [ ] Test on production URL

---

## 📄 License

MIT License - Free to use and modify

---

## 🤝 Support

- **Documentation:** See guides in root directory
- **Issues:** Check troubleshooting section
- **Firebase Help:** https://firebase.google.com/support
- **React Help:** https://react.dev

---

**Version:** 2.0  
**Last Updated:** October 25, 2025  
**Status:** ✅ Production Ready  
**Maintainer:** Shanu Mathew
