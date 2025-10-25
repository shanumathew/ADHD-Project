# 🚀 ADHD Assessment Suite - Quick Start Guide

## What's Been Built

✅ **Full Authentication System**
- Email/Password login & signup
- Google OAuth integration
- Profile management with auto-generated Tester IDs

✅ **User Dashboard**
- Personalized profile display
- 5 cognitive assessment tasks
- Results tracking

✅ **5 Cognitive Tasks**
1. **CPT** - Continuous Performance Task (sustained attention)
2. **Go/No-Go** - Impulse control assessment
3. **N-Back** - Working memory evaluation
4. **Flanker** - Selective attention test
5. **Trail-Making** - Processing speed measurement

## Step 1: Add Firebase Web API Key

### Get Your API Key:
1. Go to: https://console.firebase.google.com/
2. Select project: `adhdproject-5f8e0`
3. Click ⚙️ **Project Settings**
4. Go to **"Your apps"** → **Web** section
5. Copy the `firebaseConfig` object
6. Get the **apiKey** value

### Update .env.local:
Open `c:\Users\shanu.Nustartz\Desktop\ADHD Project\.env.local`

Replace:
```
VITE_FIREBASE_API_KEY=AIzaSyA_placeholder_get_from_firebase_console
```

With:
```
VITE_FIREBASE_API_KEY=AIzaSy_YOUR_ACTUAL_KEY_HERE
```

Also update `VITE_FIREBASE_APP_ID` if needed.

## Step 2: Enable Authentication Methods

1. Go to Firebase Console → **Authentication**
2. Go to **Sign-in method** tab
3. Enable:
   - ✅ **Email/Password**
   - ✅ **Google**

### For Google Sign-In:
1. Click **Google** → **Edit**
2. Add authorized domains:
   - `localhost:5173` (development)
   - Your production domain later

## Step 3: Create Test User (Optional)

In Firebase Console → **Authentication** → **Users**:
- Click **Create user**
- Email: `test@example.com`
- Password: `test123456`

## Step 4: Start the App

```bash
cd "c:\Users\shanu.Nustartz\Desktop\ADHD Project"
npm run dev
```

Then open: **http://localhost:5173/**

## Step 5: Test the Flow

1. **Login Page** → Try "Sign up" or "Sign in with Google"
2. **Profile Setup** → Fill in Name, Age, Gender, ADHD Status
   - Auto-generates unique Tester ID (e.g., `ADHD-20251025-ABC12`)
3. **Dashboard** → See all 5 tasks
4. **Run a Task** → Complete CPT or any task
5. **View Results** → Results auto-save to Firestore

## File Structure Created

```
src/
├── components/
│   ├── Login.jsx              ← Authentication page
│   ├── TesterProfile.jsx      ← Profile setup with Tester ID
│   ├── Dashboard.jsx          ← Main dashboard
│   ├── CPTTask.jsx            ← Task components (existing)
│   ├── GoNoGoTask.jsx
│   ├── NBackTask.jsx
│   ├── FlankerTask.jsx
│   └── TrailMakingTask.jsx
├── context/
│   └── AuthContext.jsx        ← Auth state management
├── styles/
│   ├── auth.css              ← Login/signup styles
│   ├── dashboard.css         ← Dashboard styles
│   └── profile.css           ← Profile form styles
├── firebase.js               ← Firebase configuration
├── App.jsx                   ← Routing setup
└── main.jsx

docs/
├── FIREBASE_SETUP.md         ← Detailed Firebase guide
├── GET_WEB_API_KEY.md        ← How to get API key
└── .env.local               ← Your configuration file
```

## Firestore Database Rules

Once you've tested everything, update your Firestore security rules:

**Go to:** Firestore Database → **Rules** → Update to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Assessment results
    match /results/{resultId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Data Flow

```
User Signup
    ↓
Email/Password or Google OAuth
    ↓
Create user in Firebase Auth
    ↓
User redirected to Profile Setup
    ↓
Fill in demographics + generate Tester ID
    ↓
Save profile to Firestore
    ↓
Dashboard - Select Task
    ↓
Complete Assessment
    ↓
Save Results to Firestore
    ↓
View Results on Dashboard
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Firebase configuration is missing" | Add `VITE_FIREBASE_API_KEY` to `.env.local` |
| Can't login | Check Email/Password is enabled in Firebase → Auth |
| Google sign-in fails | Add `localhost:5173` to authorized domains |
| Results not saving | Check Firestore rules allow `userId` matches |
| "Profile not found" | Restart dev server after updating `.env.local` |

## Next Steps

1. ✅ Add Firebase Web API Key to `.env.local`
2. ✅ Enable Email/Password & Google in Firebase Auth
3. ✅ Create a test user or use Google sign-in
4. ✅ Run `npm run dev` and test the complete flow
5. ✅ View stored results in Firestore console

## Production Deployment

When ready to deploy:

```bash
# Build for production
npm run build

# Deploy to Firebase Hosting (optional)
firebase deploy

# Or deploy to Vercel/Netlify
# Set environment variables on the platform
```

---

**Questions?** Check the detailed guides:
- `FIREBASE_SETUP.md` - Complete Firebase configuration
- `GET_WEB_API_KEY.md` - Step-by-step API key retrieval
