"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  role?: string;
  emailVerified?: string | null;
  organization: { id: string; name: string; plan: string; industry?: string | null; website?: string | null };
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadSession() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        if (!response.ok) return;
        const text = await response.text();
        const data = (text ? JSON.parse(text) : {}) as { user?: AuthUser | null };
        if (active && data.user) setUser(data.user);
      } catch (error) {
        console.error("Session load error:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadSession();
    return () => {
      active = false;
    };
  }, []);

  const signOut = useCallback(async () => {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (!response.ok) throw new Error("Could not sign out.");
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, signOut }), [user, loading, signOut]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-mono tracking-wider uppercase text-slate-500 font-semibold">
            Connecting to ForgeFlow Workspace…
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <AuthContext.Provider value={value}>
        <AuthScreen onAuthenticated={setUser} />
      </AuthContext.Provider>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function AuthScreen({ onAuthenticated }: { onAuthenticated: (user: AuthUser) => void }) {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, companyName }),
      });
      const text = await response.text();
      let data: { user?: AuthUser; error?: string } = {};
      try {
        data = text ? (JSON.parse(text) as { user?: AuthUser; error?: string }) : {};
      } catch {
        throw new Error("Server returned an invalid response. Please try again.");
      }
      if (!response.ok || !data.user) {
        throw new Error(data.error ?? "Authentication failed. Please verify your details.");
      }
      onAuthenticated(data.user);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not authenticate.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12 text-slate-900">
      <section className="w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-8 shadow-xl shadow-slate-200/50">
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-lg font-bold text-white shadow-md shadow-sky-600/20">
              FF
            </div>
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-sky-700">Industrial SEO & AEO</p>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">ForgeFlow</h1>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
            Enterprise Console
          </span>
        </div>

        <h2 className="text-xl font-bold text-slate-900">
          {mode === "register" ? "Create Enterprise Tenant" : "Sign In to Industrial Console"}
        </h2>
        <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
          {mode === "register"
            ? "Configure a dedicated workspace with pre-built industrial taxonomies, QA validation, and AEO schema."
            : "Access your programmatic batches, structural QA studio, and JSON-LD schema exports."}
        </p>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          {mode === "register" ? (
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Company / Manufacturing Plant Name
              <input
                id="company-name"
                autoComplete="organization"
                required
                minLength={2}
                maxLength={100}
                placeholder="e.g. Acme Thermal Dynamics"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-600 focus:bg-white focus:ring-2 focus:ring-sky-100 transition"
              />
            </label>
          ) : null}

          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            <span>Corporate / Work Email</span>
            <input
              id="email"
              autoComplete="email"
              type="email"
              required
              maxLength={254}
              placeholder="engineer@acmeindustrialtech.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-600 focus:bg-white focus:ring-2 focus:ring-sky-100 transition"
            />
          </label>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Password
              </label>
              {mode === "login" && (
                <a href="/forgot-password" className="text-2xs text-sky-600 hover:text-sky-800 hover:underline font-semibold transition">
                  Forgot password?
                </a>
              )}
            </div>
            <div className="mt-1.5 flex rounded-xl border border-slate-300 bg-slate-50/50 focus-within:border-sky-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100 transition">
              <input
                id="password"
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                type={showPassword ? "text" : "password"}
                required
                minLength={mode === "register" ? 8 : undefined}
                maxLength={128}
                placeholder="••••••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-w-0 flex-1 rounded-l-xl bg-transparent px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="rounded-r-xl px-3 text-xs font-mono font-semibold text-slate-500 hover:text-slate-800"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            {mode === "register" ? (
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className={password.length >= 8 ? "text-emerald-700 font-medium" : "text-slate-500"}>
                  {password.length >= 8 ? "✓ Minimum 8 characters met" : "Requires minimum 8 characters"}
                </span>
                <span className="font-mono text-slate-400">{password.length}/8+</span>
              </div>
            ) : null}
          </div>

          {mode === "register" ? (
            <div>
              <label htmlFor="confirm-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                autoComplete="new-password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                maxLength={128}
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-600 focus:bg-white focus:ring-2 focus:ring-sky-100 transition"
              />
            </div>
          ) : null}

          {error ? (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-sky-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-sky-600/20 transition hover:bg-sky-500 disabled:opacity-60"
          >
            {busy ? "Authenticating…" : mode === "register" ? "Create Workspace & Launch Console" : "Enter Console"}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-5 text-center text-xs text-slate-500">
          {mode === "register" ? (
            <span>
              Already have an enterprise tenant?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setPassword("");
                  setConfirmPassword("");
                  setShowPassword(false);
                }}
                className="font-bold text-sky-600 hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Need a new organization workspace?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                  setPassword("");
                  setConfirmPassword("");
                  setShowPassword(false);
                }}
                className="font-bold text-sky-600 hover:underline"
              >
                Register Tenant
              </button>
            </span>
          )}
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-400">
          Your password is kept masked unless you choose to reveal it.
        </div>
      </section>
    </main>
  );
}
