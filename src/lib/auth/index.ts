/**
 * Auth Module
 * Centralized authentication state management and actions
 */

// Export all auth store functionality
export {
  // Atoms
  accessTokenAtom,
  authLoadingAtom,
  checkAndRefreshToken,
  clearUserState,
  currentUserAtom,
  fetchMeAction,
  // Auth actions
  loginAction,
  loginWithGithubAction,
  // Firebase OAuth actions
  loginWithGoogleAction,
  loginWithXAction,
  logoutAction,
  // OTP actions
  requestOTPAction,
  // State management
  setUserProfileLoading,
  signupAction,
  // Hooks
  useUserProfileLoading,
  userProfileLoadingAtom,
  verifyOTPAction,
} from "./auth-store";

// Export Firebase utilities
export {
  auth,
  convertFirebaseUserToUser,
  githubProvider,
  googleProvider,
  signInWithGithub,
  signInWithGoogle,
  signInWithX,
  signOutFirebase,
  xProvider,
} from "./firebase";
