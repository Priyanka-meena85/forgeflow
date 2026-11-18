"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setErrorMessage("Missing reset token. Please request a new password reset link.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccess(true);
      } else {
        setErrorMessage(data.error || "Failed to reset password. The link may have expired.");
      }
    } catch {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
              !
            </div>
            <h2 className="text-base font-bold text-slate-900">Missing Reset Token</h2>
            <p className="text-xs text-slate-600">
              No reset token was provided in the URL. Please click the link in your email or request a new reset link.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block w-full py-2.5 px-4 rounded-xl bg-sky-600 text-white text-xs font-bold shadow-xs hover:bg-sky-500 transition"
            >
              Request Password Reset →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
            FF
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 font-mono">ForgeFlow</span>
        </div>
        <p className="text-center text-xs font-mono uppercase tracking-wider text-slate-500">
          Account Security & Recovery
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Set New Password</h2>
            <p className="text-xs text-slate-500 mt-1">
              Choose a strong password with at least 8 characters to secure your workspace.
            </p>
          </div>

          {success ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-2xl">
                ✓
              </div>
              <h3 className="text-base font-bold text-slate-900">Password Updated Successfully</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your password has been changed and all prior active sessions were securely revoked. You can now log in with your new password.
              </p>
              <Link
                href="/"
                className="w-full inline-flex justify-center py-2.5 px-4 rounded-xl shadow-xs text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 transition"
              >
                Sign In to ForgeFlow →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                  {errorMessage}
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="new-pass" className="block text-xs font-mono font-bold text-slate-700 uppercase">
                    New Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-2xs font-mono text-slate-500 hover:text-slate-800"
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
                <input
                  id="new-pass"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono shadow-2xs"
                />
                <div className="text-2xs font-mono text-slate-400 mt-1 flex justify-between">
                  <span>Minimum 8 characters</span>
                  <span>{password.length}/8+</span>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-pass" className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                  Confirm New Password
                </label>
                <input
                  id="confirm-pass"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono shadow-2xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl shadow-xs text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Updating Password…" : "Update Password & Continue →"}
              </button>

              <div className="text-center pt-2">
                <Link href="/" className="text-xs text-slate-500 hover:text-slate-800 font-medium transition">
                  ← Cancel & Return to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">
          Loading password reset…
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
