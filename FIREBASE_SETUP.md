# Firebase Setup Guide for ADHD Assessment Suite

## Quick Start (Choose One Option)

### Option 1: Use Firebase Emulator (For Development - No Real Firebase Project Needed)
```bash
npm install -g firebase-tools
firebase init emulator
firebase emulators:start
```

### Option 2: Create a Real Firebase Project (Production)

#### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Name it `ADHD-Assessment` (or your choice)
4. Enable Google Analytics (optional)
5. Click **"Create project"**

#### Step 2: Enable Authentication Methods
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable:
   - ✅ **Email/Password**
   - ✅ **Google** (you'll need a Google Cloud API key)

#### Step 3: Set Up Google OAuth
1. Go to **Authentication** → **Sign-in method** → **Google**
2. Add your domain to authorized redirect URIs:
   - `http://localhost:5173` (development)
   - `https://yourdomain.com` (production)

#### Step 4: Create Firestore Database
1. Go to **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select region (e.g., `us-central1`)

#### Step 5: Get Your Credentials
1. Go to **Project Settings** (⚙️ icon)
2. Click on **"Your apps"** section
3. Click **"Web"** (</> icon)
4. Copy the config object
5. Paste into `.env.local`:

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=adhd-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=adhd-project
VITE_FIREBASE_STORAGE_BUCKET=adhd-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

#### Step 6: Set Firestore Security Rules
Go to **Firestore Database** → **Rules** and update to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /results/{resultId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Testing the Setup

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# http://localhost:5173/

# 4. Test login with:
# - Email: test@example.com
# - Password: test123456
```

## Firestore Data Structure

After setup, your Firestore will have:

```
/users
  /uid-1
    {
      uid: "user-id",
      email: "user@example.com",
      displayName: "John Doe",
      name: "John Doe",
      age: 25,
      gender: "male",
      adhdStatus: "diagnosed",
      testerId: "ADHD-20251025-ABC12",
      profileComplete: true
    }

/results
  /result-1
    {
      userId: "uid-1",
      taskId: "cpt",
      timestamp: "2025-10-25T...",
      hits: 15,
      misses: 2,
      falseAlarms: 1,
      accuracy: 88
    }
```

## Troubleshooting

### Issue: "Firebase configuration is missing"
**Solution:** Make sure `.env.local` has all 6 Firebase variables

### Issue: "Google sign-in not working"
**Solution:** 
1. Check authorized domains in Firebase Console
2. Make sure redirect URI is correct: `http://localhost:5173`

### Issue: "Permission denied" on Firestore
**Solution:** 
1. Check security rules (set to test mode for development)
2. Restart dev server: `npm run dev`

### Issue: Can't create test user
**Solution:** 
1. Go to Firebase Console → Authentication
2. Manually create a test user with Email/Password method

## For Production Deployment

1. Set environment variables on hosting platform:
   - Vercel: Settings → Environment Variables
   - Netlify: Site settings → Build & Deploy → Environment
   - Firebase Hosting: Via `.env.production`

2. Update authorized domains in Firebase Console

3. Deploy: `npm run build && firebase deploy`

---

**Questions?** Check [Firebase Documentation](https://firebase.google.com/docs)
