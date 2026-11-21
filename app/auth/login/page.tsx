"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Please verify your credentials.");
      }

      // Successful login - redirect to root console
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 font-humanist px-4 py-16">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500 flex items-center justify-center text-slate-950 font-black text-lg">
              F
            </div>
            <span className="text-xl font-bold text-white tracking-tight">ForgeFlow</span>
          </Link>
          <p className="text-xs text-slate-400 font-mono">Industrial AEO &amp; SEO Content Engine</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h1 className="text-lg font-bold text-white">Sign In to Your Workspace</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Access your content pipeline, AEO analytics, and publishing queue.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-medium text-slate-300 mb-1">
                Work Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="engineer@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="login-password" className="text-xs font-medium text-slate-300">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[11px] text-cyan-400 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/20 disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          {/* SSO */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[11px] font-mono">
              <span className="bg-slate-900 px-3 text-slate-500">Enterprise SSO</span>
            </div>
          </div>

          <button
            type="button"
            disabled
            className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-500 text-xs font-medium cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span className="css-icon-lock text-xs"></span>
            <span>Sign in with Okta SAML 2.0 (Enterprise only)</span>
          </button>
        </div>

        {/* Register CTA */}
        <p className="text-center text-xs text-slate-400">
          No account yet?{" "}
          <Link href="/auth/register" className="text-cyan-400 hover:underline font-medium">
            Start your free 14-day pilot
          </Link>
        </p>
      </div>
    </div>
  );
}
