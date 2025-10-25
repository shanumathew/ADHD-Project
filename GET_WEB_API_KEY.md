# Get Your Web API Key from Firebase Console

## Follow These Steps:

1. **Go to Firebase Console**
   - https://console.firebase.google.com/
   - Select project: `adhdproject-5f8e0`

2. **Click Project Settings (⚙️ icon)**
   - Top left of console

3. **Go to "Your apps" section**
   - Look for "Web" apps

4. **If no web app exists, click "</> Add app"**
   - Choose Web platform
   - Name: `ADHD Assessment Suite`
   - Register app

5. **Copy the firebaseConfig object**
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",  // ← COPY THIS
     authDomain: "adhdproject-5f8e0.firebaseapp.com",
     projectId: "adhdproject-5f8e0",
     storageBucket: "adhdproject-5f8e0.appspot.com",
     messagingSenderId: "109218361716425596781",
     appId: "1:109218361716425596781:web:..."
   };
   ```

6. **Update .env.local with your actual values:**
   ```
   VITE_FIREBASE_API_KEY=AIzaSy_YOUR_ACTUAL_KEY_HERE
   VITE_FIREBASE_APP_ID=1:109218361716425596781:web:YOUR_APP_ID
   ```

## Quick Commands to Test

Once you've added the API key:

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser to http://localhost:5173/
```

## Your Firebase Project Details
- **Project ID:** adhdproject-5f8e0
- **Auth Domain:** adhdproject-5f8e0.firebaseapp.com
- **Storage Bucket:** adhdproject-5f8e0.appspot.com
- **Sender ID:** 109218361716425596781

---
**Note:** The Admin SDK key you provided is for backend/server use only. We need the Web API Key for the frontend application.
