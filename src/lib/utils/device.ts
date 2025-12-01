/**
 * Device detection utilities
 * Used for responsive behavior and OAuth flow selection
 */

/**
 * Check if the current device is a mobile device
 * Based on user agent and screen width
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;

  const userAgent = navigator.userAgent || navigator.userAgentData?.userAgent || "";
  const platform = navigator.platform || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  // Check user agent for mobile indicators
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUA = mobileRegex.test(userAgent);

  // Check for touch capability
  const hasTouchScreen = maxTouchPoints > 0 || "ontouchstart" in window;

  // Check screen width (mobile-first: < 768px is considered mobile)
  const isSmallScreen = window.innerWidth < 768;

  // Consider mobile if:
  // 1. User agent indicates mobile, OR
  // 2. Has touch screen AND small screen
  return isMobileUA || (hasTouchScreen && isSmallScreen);
}

/**
 * Check if popup windows are likely to be blocked
 * This is a heuristic check - actual blocking can only be detected after attempting to open
 */
export function isPopupLikelyBlocked(): boolean {
  // On mobile devices, popups are almost always blocked
  return isMobileDevice();
}

