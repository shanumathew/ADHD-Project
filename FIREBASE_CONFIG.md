# Firebase Project Configuration

## Your Firebase Project Details

**Project Name:** adhdproject-5f8e0  
**Project ID:** adhdproject-5f8e0  
**Region:** us-central1  

---

## Step-by-Step: Get Your Web API Key

### 1. Open Firebase Console
Go to: https://console.firebase.google.com/

### 2. Select Your Project
- Click on **"adhdproject-5f8e0"**

### 3. Open Project Settings
- Click ⚙️ icon (top-left, next to project name)
- Select **"Project Settings"**

### 4. Go to "Your apps" Section
- Scroll down to **"Your apps"**
- Look for **Web** section

### 5. Find Your Web App Configuration
If you see a web app, click on it. If not, click **"</> Add app"**:
- Platform: **Web**
- App nickname: `ADHD Assessment Suite`
- Check: "Also set up Firebase Hosting for this app"
- Click **"Register app"**

### 6. Copy the Configuration
You'll see a code block like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy_YOUR_KEY_HERE",          // ← COPY THIS
  authDomain: "adhdproject-5f8e0.firebaseapp.com",
  projectId: "adhdproject-5f8e0",
  storageBucket: "adhdproject-5f8e0.appspot.com",
  messagingSenderId: "109218361716425596781",
  appId: "1:109218361716425596781:web:_YOUR_APP_ID_HERE"
};
```

### 7. Update .env.local File
Open: `c:\Users\shanu.Nustartz\Desktop\ADHD Project\.env.local`

Update these values:
```
VITE_FIREBASE_API_KEY=AIzaSy_YOUR_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=adhdproject-5f8e0.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=adhdproject-5f8e0
VITE_FIREBASE_STORAGE_BUCKET=adhdproject-5f8e0.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=109218361716425596781
VITE_FIREBASE_APP_ID=1:109218361716425596781:web:_YOUR_APP_ID_HERE
```

---

## Enable Authentication

1. **Go to Authentication**
   - Firebase Console → **Authentication** (left menu)

2. **Enable Email/Password**
   - Click **"Sign-in method"**
   - Find **"Email/Password"**
   - Toggle to **ON**
   - Click **"Save"**

3. **Enable Google**
   - Click **"Google"**
   - Toggle to **ON**
   - Support email: (auto-filled)
   - Click **"Save"**

4. **Add Authorized Domains**
   - Still in **"Sign-in method"**
   - Scroll down to **"Authorized domains"**
   - Click **"Add domain"**
   - Add: `localhost:5173` (for development)
   - Later add your production domain

---

## Create Firestore Database

1. **Open Firestore**
   - Firebase Console → **Firestore Database** (left menu)

2. **Create Database**
   - Click **"Create database"**
   - Start mode: **"Start in test mode"**
   - Location: **"us-central1"** (or closest to you)
   - Click **"Create"**

3. **Update Security Rules**
   - Go to **"Rules"** tab
   - Replace everything with:

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

   - Click **"Publish"**

---

## Create Test User (Optional)

1. **Go to Authentication Users**
   - Firebase Console → Authentication → **Users** tab

2. **Create User**
   - Click **"Create user"** button
   - Email: `test@example.com`
   - Password: `test123456` (or any password)
   - Click **"Create"**

---

## Verify Setup

### Checklist
- [ ] Web API Key added to `.env.local`
- [ ] Email/Password enabled in Firebase
- [ ] Google sign-in enabled in Firebase
- [ ] `localhost:5173` added to authorized domains
- [ ] Firestore database created
- [ ] Security rules updated
- [ ] Test user created (optional)

---

## Quick Test Commands

```bash
# Navigate to project
cd "c:\Users\shanu.Nustartz\Desktop\ADHD Project"

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev

# Open browser: http://localhost:5173/
```

## Common Issues & Fixes

### Issue: "Firebase configuration is missing"
**Fix:** Make sure `.env.local` has all 6 variables with correct values

### Issue: "Cannot sign up / login"
**Fix:** 
- Check Email/Password is enabled in Firebase → Authentication → Sign-in method
- Restart dev server after enabling

### Issue: "Google sign-in not working"
**Fix:**
- Add `localhost:5173` to authorized domains in Firebase Console
- Restart dev server
- Clear browser cache

### Issue: "Can't save profile data"
**Fix:**
- Check Firestore exists (Firebase Console → Firestore Database)
- Verify security rules are correct
- Check that Firestore rules allow create permission

---

## Configuration Summary

| Setting | Value |
|---------|-------|
| Project ID | adhdproject-5f8e0 |
| Auth Domain | adhdproject-5f8e0.firebaseapp.com |
| Storage Bucket | adhdproject-5f8e0.appspot.com |
| Sender ID | 109218361716425596781 |
| Auth Methods | Email/Password, Google OAuth |
| Database | Firestore (us-central1) |
| Mode | Test Mode (for development) |

---

## Files That Use This Config

- `src/firebase.js` - Firebase initialization
- `src/context/AuthContext.jsx` - Authentication logic
- `.env.local` - Environment variables (CREATE THIS!)

---

## Security Notes

⚠️ **Important:**
- The API Key in `.env.local` is visible in the browser (this is OK for web apps)
- Never commit `.env.local` to git (add to `.gitignore`)
- Use Firestore rules to restrict access (already provided)
- Never put admin keys in frontend code

---

## Production Deployment

Before deploying to production:

1. **Update authorized domains:**
   - Firebase Console → Authentication → Authorized domains
   - Add your production domain (e.g., `adhd-app.com`)

2. **Switch from Test Mode:**
   - Firestore → Settings
   - Change mode from "Test" to "Locked" (when rules are ready)
   - Keep security rules updated

3. **Set environment variables:**
   - On your hosting platform (Vercel, Netlify, Firebase)
   - All 6 Firebase config variables

4. **Enable appropriate security:**
   - HTTPS only
   - CORS headers
   - Firestore backups

---

## Need Help?

- **Firebase Docs:** https://firebase.google.com/docs
- **Firestore Setup:** https://firebase.google.com/docs/firestore/quickstart
- **Auth Setup:** https://firebase.google.com/docs/auth/web/start
- **Troubleshooting:** See `QUICK_START.md` and `FIREBASE_SETUP.md`

---

**Last Updated:** October 25, 2025  
**Next Step:** Add your API Key to `.env.local` then run `npm run dev`
