"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setPreviewUrl(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccessMessage(data.message || "Password reset instructions have been sent to your email.");
        if (data.previewUrl) {
          setPreviewUrl(data.previewUrl);
        }
      } else {
        setErrorMessage(data.error || "Failed to process request. Please check the email format.");
      }
    } catch {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
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
            <h2 className="text-lg font-bold text-slate-900">Reset Your Password</h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your corporate email address and we will send you a secure link to reset your account password.
            </p>
          </div>

          {successMessage ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 leading-relaxed font-medium flex items-center gap-2">
                <span className="css-icon-check text-emerald-700 shrink-0"></span>
                <span>{successMessage}</span>
              </div>

              {previewUrl && (
                <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-xs space-y-1.5">
                  <div className="font-mono font-bold text-sky-900 uppercase text-2xs">Development Shortcut:</div>
                  <a
                    href={previewUrl}
                    className="text-sky-700 underline font-mono break-all hover:text-sky-900 font-medium block"
                  >
                    Open Reset Password Link →
                  </a>
                </div>
              )}

              <Link
                href="/"
                className="w-full inline-flex justify-center py-2.5 px-4 rounded-xl shadow-xs text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition"
              >
                Return to Sign In
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
                <label htmlFor="email" className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                  Corporate / Work Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono shadow-2xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl shadow-xs text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Sending Instructions…" : "Send Reset Instructions →"}
              </button>

              <div className="text-center pt-2">
                <Link href="/" className="text-xs text-slate-500 hover:text-slate-800 font-medium transition">
                  ← Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
