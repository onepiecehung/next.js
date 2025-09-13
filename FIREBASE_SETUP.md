# Firebase Authentication Setup

This project now includes Firebase authentication support for Google login. Follow these steps to set up Firebase in your project.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name and follow the setup wizard
4. Enable Google Analytics (optional)

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Google" as a sign-in provider
5. Add your domain to the authorized domains list

## 3. Get Firebase Configuration

1. In your Firebase project, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web icon (</>)
4. Register your app with a nickname
5. Copy the Firebase configuration object

## 4. Set Environment Variables

Create a `.env.local` file in your project root and add your Firebase configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 5. Configure OAuth Consent Screen (if needed)

If you haven't set up OAuth consent screen for Google:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to "APIs & Services" > "OAuth consent screen"
4. Configure the consent screen with your app information
5. Add your domain to authorized domains

## 6. Test the Integration

1. Start your development server: `yarn dev`
2. Navigate to the login page or open the login dialog
3. Click "Login with Google" button
4. Complete the Google OAuth flow
5. Verify that the user is logged in successfully

## Features Added

- ✅ Firebase configuration setup
- ✅ Google OAuth authentication
- ✅ User data conversion from Firebase to app format
- ✅ Integration with existing auth store
- ✅ Login dialog with Google button
- ✅ Login page with Google button
- ✅ Internationalization support (English/Vietnamese)
- ✅ Error handling and loading states
- ✅ Automatic token management

## File Structure

```
src/
├── lib/
│   ├── firebase.ts          # Firebase configuration and auth functions
│   └── auth-store.ts        # Updated with Firebase login action
├── components/auth/
│   └── login-dialog.tsx     # Updated with Google login button
├── app/auth/login/
│   └── page.tsx             # Updated with Google login button
└── i18n/locales/
    ├── en/auth.json         # English translations
    └── vi/auth.json         # Vietnamese translations
```

## Security Notes

- Firebase ID tokens are used for backend authentication
- Tokens are stored in memory and cookies (not localStorage for security)
- All Firebase configuration is client-side safe (NEXT_PUBLIC_ prefix)
- OAuth consent screen should be properly configured for production

## Troubleshooting

1. **"Firebase: Error (auth/unauthorized-domain)":** Add your domain to Firebase authorized domains
2. **"Firebase: Error (auth/popup-closed-by-user)":** User closed the popup, this is normal (no error message shown)
3. **"Firebase: Error (auth/cancelled-popup-request)":** User cancelled the popup, this is normal (no error message shown)
4. **"Firebase: Error (auth/popup-blocked)":** Browser blocked the popup, ask user to allow popups
5. **"Firebase: Error (auth/account-exists-with-different-credential)":** User already exists with different provider
6. **Environment variables not loading:** Make sure `.env.local` is in the project root and restart the dev server
7. **DNS_PROBE_FINISHED_NXDOMAIN:** Check your Firebase project configuration and domain settings

## Next Steps

- Configure your backend to verify Firebase ID tokens
- Add more OAuth providers (Facebook, Apple, etc.)
- Implement user profile synchronization
- Add proper error handling for different Firebase auth errors
