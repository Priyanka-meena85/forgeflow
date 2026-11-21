"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("forgeflow_cookie_consent");
      if (!consent) {
        setIsVisible(true);
      }
    } catch {
      // LocalStorage blocked/unavailable
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(
        "forgeflow_cookie_consent",
        JSON.stringify({
          essential: true,
          analytics: true,
          marketing: true,
          timestamp: new Date().toISOString(),
        })
      );
    } catch {
      // noop
    }
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleSavePreferences = () => {
    try {
      localStorage.setItem(
        "forgeflow_cookie_consent",
        JSON.stringify({
          essential: true,
          analytics: analyticsEnabled,
          marketing: marketingEnabled,
          timestamp: new Date().toISOString(),
        })
      );
    } catch {
      // noop
    }
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleDeclineOptional = () => {
    try {
      localStorage.setItem(
        "forgeflow_cookie_consent",
        JSON.stringify({
          essential: true,
          analytics: false,
          marketing: false,
          timestamp: new Date().toISOString(),
        })
      );
    } catch {
      // noop
    }
    setIsVisible(false);
    setShowPreferences(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie Consent"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 shadow-2xl text-slate-200 font-humanist animate-fade-in"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Industrial Privacy &amp; Cookie Notice
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            ForgeFlow utilizes strictly necessary cookies to ensure system security, auth token persistence, and CAD parsing session state. We use anonymized analytics to measure answer engine indexation telemetry. Read our{" "}
            <Link href="/privacy" className="text-cyan-400 hover:underline">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="text-cyan-400 hover:underline">
              Terms
            </Link>
            .
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-center">
          <button
            type="button"
            onClick={() => setShowPreferences(!showPreferences)}
            className="px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          >
            Preferences
          </button>
          <button
            type="button"
            onClick={handleDeclineOptional}
            className="px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            Reject Optional
          </button>
          <button
            type="button"
            onClick={handleAcceptAll}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>

      {showPreferences && (
        <div className="mt-4 pt-4 border-t border-slate-800 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-white">Essential System Cookies</div>
              <div className="text-[11px] text-slate-400">Required for RLS auth, CSRF &amp; workspace routing.</div>
            </div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
              ALWAYS ON
            </span>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-white">Telemetry &amp; Diagnostics</div>
              <div className="text-[11px] text-slate-400">Anonymized performance and error reporting.</div>
            </div>
            <input
              type="checkbox"
              checked={analyticsEnabled}
              onChange={(e) => setAnalyticsEnabled(e.target.checked)}
              className="accent-cyan-400 h-4 w-4 rounded cursor-pointer"
            />
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-white">Conversion Optimization</div>
              <div className="text-[11px] text-slate-400">Measures demo requests &amp; pilot onboarding attribution.</div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={marketingEnabled}
                onChange={(e) => setMarketingEnabled(e.target.checked)}
                className="accent-cyan-400 h-4 w-4 rounded cursor-pointer"
              />
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[11px] font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
