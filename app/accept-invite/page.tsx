"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleAccept(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setErrorMessage("Missing invitation token.");
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
      const res = await fetch("/api/workspace/invites/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, name, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        // Redirect directly into Mission Control
        router.push("/");
      } else {
        setErrorMessage(data.error || "Failed to accept invitation. It may have expired or been revoked.");
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
            <h2 className="text-base font-bold text-slate-900">Missing Invitation Token</h2>
            <p className="text-xs text-slate-600">
              No invitation token was found in the URL. Please click the link in your invitation email.
            </p>
            <Link
              href="/"
              className="inline-block w-full py-2.5 px-4 rounded-xl bg-sky-600 text-white text-xs font-bold shadow-xs hover:bg-sky-500 transition"
            >
              Go to Homepage
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
          Team Workspace Invitation
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10 space-y-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Workspace Invitation
            </span>
            <h2 className="text-lg font-bold text-slate-900">Join Your Team Workspace</h2>
            <p className="text-xs text-slate-500 mt-1">
              Set up your profile and password to start reviewing and publishing technical content.
            </p>
          </div>

          <form onSubmit={handleAccept} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                {errorMessage}
              </div>
            )}

            <div>
              <label htmlFor="full-name" className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                Full Name
              </label>
              <input
                id="full-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
              />
            </div>

            <div>
              <label htmlFor="invite-password" className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                Create Password
              </label>
              <input
                id="invite-password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono shadow-2xs"
              />
            </div>

            <div>
              <label htmlFor="confirm-invite-password" className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                Confirm Password
              </label>
              <input
                id="confirm-invite-password"
                type="password"
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
              className="w-full py-2.5 px-4 rounded-xl shadow-xs text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Joining Workspace…" : "Accept Invitation & Enter →"}
            </button>

            <div className="text-center pt-2">
              <Link href="/" className="text-xs text-slate-500 hover:text-slate-800 font-medium transition">
                Already have an account? Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">
          Loading invitation…
        </div>
      }
    >
      <AcceptInviteContent />
    </Suspense>
  );
}
