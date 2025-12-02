"use client";

import { currentUserAtom } from "@/lib/auth/auth-store";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

/**
 * Mobile One Tap Test Page
 *
 * Use this page to debug Google One Tap on mobile devices
 *
 * Access: /test-mobile-one-tap
 *
 * Features:
 * - Device detection
 * - SDK status check
 * - Manual trigger button
 * - Debug logs
 * - Real-time monitoring
 */
export default function TestMobileOneTapPage() {
  const [currentUser] = useAtom(currentUserAtom);
  const [logs, setLogs] = useState<string[]>([]);
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    screenSize: "",
    userAgent: "",
    platform: "",
  });

  const addLog = (
    message: string,
    type: "info" | "success" | "error" = "info",
  ) => {
    const timestamp = new Date().toLocaleTimeString();
    const icon = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";
    setLogs((prev) => [...prev, `[${timestamp}] ${icon} ${message}`]);
  };

  useEffect(() => {
    // Device detection
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    const screenSize = `${window.innerWidth}x${window.innerHeight}`;
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;

    setDeviceInfo({
      isMobile,
      screenSize,
      userAgent,
      platform,
    });

    addLog(`Device type: ${isMobile ? "Mobile" : "Desktop"}`, "info");
    addLog(`Screen size: ${screenSize}`, "info");
    addLog(`Platform: ${platform}`, "info");
    addLog(`User agent: ${userAgent.substring(0, 50)}...`, "info");

    // Check Google SDK
    const checkSDK = setInterval(() => {
      if (window.google?.accounts?.id) {
        addLog("Google SDK loaded successfully", "success");
        clearInterval(checkSDK);
      }
    }, 100);

    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkSDK);
      if (!window.google?.accounts?.id) {
        addLog("Google SDK failed to load after 5s", "error");
      }
    }, 5000);

    // Check auth state
    if (currentUser) {
      addLog(`User authenticated: ${currentUser.email}`, "info");
    } else {
      addLog("User not authenticated", "info");
    }

    return () => clearInterval(checkSDK);
  }, [currentUser]);

  const handleTriggerOneTap = () => {
    addLog("Attempting to trigger One Tap manually...", "info");

    if (!window.google?.accounts?.id) {
      addLog("Google SDK not loaded!", "error");
      return;
    }

    try {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          const reason = notification.getNotDisplayedReason();
          addLog(`One Tap not displayed: ${reason}`, "error");
        } else if (notification.isDisplayed()) {
          addLog("One Tap displayed successfully!", "success");
        } else if (notification.isSkippedMoment()) {
          addLog(`One Tap skipped: ${notification.getSkippedReason()}`, "info");
        } else if (notification.isDismissedMoment()) {
          addLog(
            `One Tap dismissed: ${notification.getDismissedReason()}`,
            "info",
          );
        }
      });
    } catch (error) {
      addLog(`Error: ${error}`, "error");
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog("Logs cleared", "info");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">📱 Mobile One Tap Test</h1>
          <p className="text-muted-foreground">
            Debug Google One Tap on mobile devices
          </p>
        </div>

        {/* Device Info Card */}
        <div className="bg-card border border-border rounded-lg p-4 md:p-6 mb-4">
          <h2 className="text-xl font-semibold mb-4">Device Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <span className="text-sm text-muted-foreground">Type:</span>
              <p className="font-mono">
                {deviceInfo.isMobile ? "📱 Mobile" : "💻 Desktop"}
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Screen:</span>
              <p className="font-mono">{deviceInfo.screenSize}</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-sm text-muted-foreground">Platform:</span>
              <p className="font-mono">{deviceInfo.platform}</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-sm text-muted-foreground">User Agent:</span>
              <p className="font-mono text-xs break-all">
                {deviceInfo.userAgent}
              </p>
            </div>
          </div>
        </div>

        {/* Auth Status Card */}
        <div className="bg-card border border-border rounded-lg p-4 md:p-6 mb-4">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-2xl">✅</span>
              <div>
                <p className="font-semibold">Authenticated</p>
                <p className="text-sm text-muted-foreground">
                  {currentUser.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 text-2xl">⚠️</span>
              <div>
                <p className="font-semibold">Not Authenticated</p>
                <p className="text-sm text-muted-foreground">
                  One Tap should be visible
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions Card */}
        <div className="bg-card border border-border rounded-lg p-4 md:p-6 mb-4">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleTriggerOneTap}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Trigger One Tap
            </button>
            <button
              onClick={clearLogs}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              🗑️ Clear Logs
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              🔃 Reload Page
            </button>
          </div>
        </div>

        {/* Debug Logs Card */}
        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-4 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-400">No logs yet...</p>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className="font-mono text-xs md:text-sm mb-1 break-all"
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-lg p-4 md:p-6 mt-4">
          <h2 className="text-xl font-semibold mb-2">📝 Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Ensure you are logged in to a Google account</li>
            <li>Check device information above</li>
            <li>Look for One Tap popup (if not authenticated)</li>
            <li>Click "Trigger One Tap" to manually show popup</li>
            <li>Check debug logs for any errors</li>
            <li>
              If popup doesn&apos;t show, check console for{" "}
              <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">
                getNotDisplayedReason()
              </code>
            </li>
          </ol>
        </div>

        {/* Common Issues Card */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg p-4 md:p-6 mt-4">
          <h2 className="text-xl font-semibold mb-2">🐛 Common Issues</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              <strong>opt_out_or_no_session:</strong> User dismissed previously
              or not logged in to Google
            </li>
            <li>
              <strong>unauthorized_client:</strong> Domain not authorized in
              Google Cloud Console
            </li>
            <li>
              <strong>suppressed_by_user:</strong> User disabled One Tap in
              browser settings
            </li>
            <li>
              <strong>SDK not loaded:</strong> Script failed to load, check
              network
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
