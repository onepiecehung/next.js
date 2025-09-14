import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";

// Firebase configuration
// You need to replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Initialize GitHub Auth Provider
export const githubProvider = new GithubAuthProvider();

// Configure GitHub provider
githubProvider.addScope("user:email");

/**
 * Sign in with Google using Firebase Auth
 * @returns Promise<FirebaseUser> - The authenticated Firebase user
 */
export const signInWithGoogle = async (): Promise<FirebaseUser> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

/**
 * Sign in with GitHub using Firebase Auth
 * @returns Promise<FirebaseUser> - The authenticated Firebase user
 */
export const signInWithGithub = async (): Promise<FirebaseUser> => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with GitHub:", error);
    throw error;
  }
};

/**
 * Sign out from Firebase Auth
 */
export const signOutFirebase = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

/**
 * Convert Firebase User to our User type
 * @param firebaseUser - Firebase user object
 * @returns User object compatible with our auth system
 * @deprecated This function is no longer used as backend returns user data
 */
export const convertFirebaseUserToUser = (firebaseUser: FirebaseUser) => {
  return {
    id: firebaseUser.uid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    version: 1,
    name: firebaseUser.displayName || null,
    username:
      firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "",
    status: "active",
    role: "user",
    email: firebaseUser.email || "",
    dob: null,
    phoneNumber: null,
    oauthProvider: "google",
    oauthId: firebaseUser.uid,
    authMethod: "oauth",
    isEmailVerified: firebaseUser.emailVerified,
    isPhoneVerified: false,
    avatar: {
      url: firebaseUser.photoURL || "",
      key: firebaseUser.photoURL || "",
    },
  };
};

export default app;
