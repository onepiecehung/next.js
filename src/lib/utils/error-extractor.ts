/**
 * Utility function to extract error messages from various error types
 * Handles API error responses with messageKey, message, and details fields
 */

export interface ApiErrorResponse {
  messageKey?: string;
  message?: string;
  details?: string;
}

/**
 * Extract error message from various error types with priority handling
 * 
 * Priority order:
 * 1. messageKey (for i18n translation)
 * 2. message (fallback message)
 * 3. details (additional details)
 * 4. defaultMessage (final fallback)
 * 
 * @param error - The error object to extract message from
 * @param defaultMessage - Default message if no error message found
 * @returns Extracted error message or default message
 */
export function extractErrorMessage(error: unknown, defaultMessage: string): string {
  // // Handle Error instances
  // if (error instanceof Error) {
  //   return error.message;
  // }

  // Handle API response errors
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: unknown }).response;
    
    if (typeof response === "object" && response !== null && "data" in response) {
      const data = (response as { data?: unknown }).data;
      
      if (typeof data === "object" && data !== null) {
        const errorData = data as ApiErrorResponse;

        // Priority 1: Use messageKey for i18n (if available)
        if (errorData.messageKey && typeof errorData.messageKey === "string") {
          return errorData.messageKey;
        }

        // Priority 2: Use message field
        if (errorData.message && typeof errorData.message === "string") {
          return errorData.message;
        }

        // Priority 3: Use details field
        if (errorData.details && typeof errorData.details === "string") {
          return errorData.details;
        }
      }
    }
  }

  // Return default message if no error message found
  return defaultMessage;
}

/**
 * Extract error message and attempt i18n translation
 * 
 * @param error - The error object to extract message from
 * @param defaultKey - Default i18n key if no error message found
 * @param t - Translation function
 * @param namespace - i18n namespace (optional)
 * @returns Translated error message or raw error message
 */
export function extractAndTranslateErrorMessage(
  error: unknown,
  defaultKey: string,
  t: (key: string, ns?: string) => string,
  namespace?: string
): string {
  const errorKey = extractErrorMessage(error, defaultKey);
  
  // Try to get translated message, fallback to raw error message
  return t(errorKey, namespace) || errorKey;
}
