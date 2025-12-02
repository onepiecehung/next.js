import { initializeApp, setLogLevel } from "firebase/app";
import {
  User as FirebaseUser,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  TwitterAuthProvider,
} from "firebase/auth";
setLogLevel("debug");
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

// Initialize X (Twitter) Auth Provider
export const xProvider = new TwitterAuthProvider();

// Configure X provider
xProvider.addScope("users.read");

/**
 * Sign in with Google using Firebase Auth
 * Uses popup on desktop, redirect on mobile or when popup is blocked
 * @returns Promise<FirebaseUser> - The authenticated Firebase user
 */
export const signInWithGoogle = async (): Promise<FirebaseUser> => {
  // Check if we should use redirect (mobile or popup likely blocked)
  const { isMobileDevice, isPopupLikelyBlocked } = await import(
    "@/lib/utils/device"
  );
  const useRedirect = isMobileDevice() || isPopupLikelyBlocked();

  if (useRedirect) {
    // Use redirect flow for mobile devices
    try {
      await signInWithRedirect(auth, googleProvider);
      // This will redirect the page, so we won't reach here
      // The result will be handled in the callback page
      throw new Error("Redirect initiated");
    } catch (error) {
      // If it's the redirect error, that's expected
      if (error instanceof Error && error.message === "Redirect initiated") {
        throw error;
      }
      console.error("Error signing in with Google (redirect):", error);
      throw error;
    }
  }

  // Use popup flow for desktop
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: unknown) {
    // If popup is blocked, fallback to redirect
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error.code === "auth/popup-blocked" ||
        error.code === "auth/popup-closed-by-user")
    ) {
      console.log("Popup blocked or closed, falling back to redirect...");
      try {
        await signInWithRedirect(auth, googleProvider);
        // This will redirect the page
        throw new Error("Redirect initiated");
      } catch (redirectError) {
        if (
          redirectError instanceof Error &&
          redirectError.message === "Redirect initiated"
        ) {
          throw redirectError;
        }
        console.error("Error with redirect fallback:", redirectError);
        throw redirectError;
      }
    }
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

/**
 * Sign in with GitHub using Firebase Auth
 * Uses popup on desktop, redirect on mobile or when popup is blocked
 * @returns Promise<FirebaseUser> - The authenticated Firebase user
 */
export const signInWithGithub = async (): Promise<FirebaseUser> => {
  // Check if we should use redirect (mobile or popup likely blocked)
  const { isMobileDevice, isPopupLikelyBlocked } = await import(
    "@/lib/utils/device"
  );
  const useRedirect = isMobileDevice() || isPopupLikelyBlocked();

  if (useRedirect) {
    // Use redirect flow for mobile devices
    try {
      await signInWithRedirect(auth, githubProvider);
      // This will redirect the page, so we won't reach here
      throw new Error("Redirect initiated");
    } catch (error) {
      if (error instanceof Error && error.message === "Redirect initiated") {
        throw error;
      }
      console.error("Error signing in with GitHub (redirect):", error);
      throw error;
    }
  }

  // Use popup flow for desktop
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return result.user;
  } catch (error: unknown) {
    // If popup is blocked, fallback to redirect
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error.code === "auth/popup-blocked" ||
        error.code === "auth/popup-closed-by-user")
    ) {
      console.log("Popup blocked or closed, falling back to redirect...");
      try {
        await signInWithRedirect(auth, githubProvider);
        throw new Error("Redirect initiated");
      } catch (redirectError) {
        if (
          redirectError instanceof Error &&
          redirectError.message === "Redirect initiated"
        ) {
          throw redirectError;
        }
        console.error("Error with redirect fallback:", redirectError);
        throw redirectError;
      }
    }
    console.error("Error signing in with GitHub:", error);
    throw error;
  }
};

/**
 * Sign in with X (Twitter) using Firebase Auth
 * Uses popup on desktop, redirect on mobile or when popup is blocked
 * @returns Promise<FirebaseUser> - The authenticated Firebase user
 */
export const signInWithX = async (): Promise<FirebaseUser> => {
  // Check if we should use redirect (mobile or popup likely blocked)
  const { isMobileDevice, isPopupLikelyBlocked } = await import(
    "@/lib/utils/device"
  );
  const useRedirect = isMobileDevice() || isPopupLikelyBlocked();

  if (useRedirect) {
    // Use redirect flow for mobile devices
    try {
      await signInWithRedirect(auth, xProvider);
      // This will redirect the page, so we won't reach here
      throw new Error("Redirect initiated");
    } catch (error) {
      if (error instanceof Error && error.message === "Redirect initiated") {
        throw error;
      }
      console.error("Error signing in with X (redirect):", error);
      throw error;
    }
  }

  // Use popup flow for desktop
  try {
    const result = await signInWithPopup(auth, xProvider);
    return result.user;
  } catch (error: unknown) {
    // If popup is blocked, fallback to redirect
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error.code === "auth/popup-blocked" ||
        error.code === "auth/popup-closed-by-user")
    ) {
      console.log("Popup blocked or closed, falling back to redirect...");
      try {
        await signInWithRedirect(auth, xProvider);
        throw new Error("Redirect initiated");
      } catch (redirectError) {
        if (
          redirectError instanceof Error &&
          redirectError.message === "Redirect initiated"
        ) {
          throw redirectError;
        }
        console.error("Error with redirect fallback:", redirectError);
        throw redirectError;
      }
    }
    console.error("Error signing in with X:", error);
    throw error;
  }
};

/**
 * Get the result of a redirect-based sign-in
 * Call this on the OAuth callback page to complete the authentication
 * @returns Promise<FirebaseUser | null> - The authenticated Firebase user, or null if no redirect result
 */
export const getOAuthRedirectResult =
  async (): Promise<FirebaseUser | null> => {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        return result.user;
      }
      return null;
    } catch (error) {
      console.error("Error getting redirect result:", error);
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
