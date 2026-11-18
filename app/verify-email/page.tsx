"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function getInitialState(statusParam: string | null, token: string | null): {
  state: "loading" | "success" | "expired" | "invalid";
  message: string;
} {
  if (statusParam === "success") {
    return {
      state: "success",
      message: "Your work email has been successfully verified! Your ForgeFlow workspace is now fully activated.",
    };
  }
  if (statusParam === "expired") {
    return {
      state: "expired",
      message: "This email verification link has expired (links are valid for 24 hours).",
    };
  }
  if (statusParam === "invalid" || statusParam === "missing") {
    return {
      state: "invalid",
      message: "This verification link is invalid or has already been used.",
    };
  }
  if (!token) {
    return {
      state: "invalid",
      message: "No verification token found in URL.",
    };
  }
  return {
    state: "loading",
    message: "Verifying your work email address…",
  };
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const statusParam = searchParams.get("status");

  const initial = getInitialState(statusParam, token);
  const [state, setState] = useState<"loading" | "success" | "expired" | "invalid">(initial.state);
  const [message, setMessage] = useState<string>(initial.message);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token || statusParam) return;

    let ignore = false;
    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, status: res.status, data })))
      .then(({ ok, status, data }) => {
        if (ignore) return;
        if (ok) {
          setState("success");
          setMessage(data.message || "Your work email has been verified successfully!");
        } else if (status === 410) {
          setState("expired");
          setMessage(data.error || "This verification link has expired.");
        } else {
          setState("invalid");
          setMessage(data.error || "Invalid or used verification link.");
        }
      })
      .catch(() => {
        if (ignore) return;
        setState("invalid");
        setMessage("Network error verifying email. Please check your connection.");
      });

    return () => {
      ignore = true;
    };
  }, [token, statusParam]);

  async function handleResend() {
    setResending(true);
    setResendMessage(null);
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setResendMessage(data.message || "A new verification link has been sent to your inbox.");
      } else {
        setResendMessage(data.error || "Unable to resend. Please sign in first.");
      }
    } catch {
      setResendMessage("Network error resending verification email.");
    } finally {
      setResending(false);
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
          Industrial SEO & AEO Content Engine
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10 space-y-6">
          <div className="text-center">
            {state === "loading" && (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-3 border-sky-200 border-t-sky-600 animate-spin mb-4"></div>
                <h2 className="text-lg font-bold text-slate-900">Verifying Email…</h2>
                <p className="text-xs text-slate-500 mt-1">{message}</p>
              </div>
            )}

            {state === "success" && (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 text-2xl font-bold mb-4">
                  ✓
                </div>
                <h2 className="text-lg font-bold text-slate-900">Email Verified</h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{message}</p>
                <Link
                  href="/"
                  className="mt-6 w-full inline-flex justify-center py-2.5 px-4 rounded-xl shadow-xs text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 transition"
                >
                  Enter Mission Control →
                </Link>
              </div>
            )}

            {(state === "expired" || state === "invalid") && (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 text-2xl font-bold mb-4">
                  !
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  {state === "expired" ? "Link Expired" : "Verification Failed"}
                </h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{message}</p>

                <div className="mt-6 w-full space-y-3">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition disabled:opacity-50 cursor-pointer"
                  >
                    {resending ? "Sending New Link…" : "Request New Verification Link"}
                  </button>

                  {resendMessage && (
                    <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-800 font-medium">
                      {resendMessage}
                    </div>
                  )}

                  <Link
                    href="/"
                    className="block text-center text-xs font-medium text-slate-500 hover:text-slate-800 transition"
                  >
                    Return to Home
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">
          Loading email verification…
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
