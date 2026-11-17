"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type AuthUser = {
  id: string;
  email: string;
  organization: { id: string; name: string; plan: string };
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
        if (!response.ok) throw new Error("Could not verify the current session.");
        const data = (await response.json()) as { user: AuthUser | null };
        if (active) setUser(data.user);
      } catch (error) {
        console.error(error);
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
      <main className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-700">
        <p className="text-sm font-medium">Loading your workspace…</p>
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
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, companyName }),
      });
      const data = (await response.json()) as { user?: AuthUser; error?: string };
      if (!response.ok || !data.user) throw new Error(data.error ?? "Could not authenticate.");
      onAuthenticated(data.user);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not authenticate.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5 py-10 text-slate-900">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600 text-lg font-bold text-white">F</div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">Industrial SEO</p>
            <h1 className="text-xl font-bold">ForgeFlow</h1>
          </div>
        </div>
        <h2 className="text-2xl font-bold">{mode === "register" ? "Create your workspace" : "Welcome back"}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {mode === "register"
            ? "Create a private workspace for your company’s industrial content."
            : "Sign in to continue to your content workspace."}
        </p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          {mode === "register" ? (
            <label className="block text-sm font-medium text-slate-700">
              Company name
              <input
                autoComplete="organization"
                required
                minLength={2}
                maxLength={100}
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </label>
          ) : null}
          <label className="block text-sm font-medium text-slate-700">
            Work email
            <input
              autoComplete="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              type="password"
              required
              minLength={mode === "register" ? 12 : undefined}
              maxLength={128}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            {mode === "register" ? <span className="mt-1 block text-xs text-slate-500">Use at least 12 characters.</span> : null}
          </label>
          {error ? <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
          <button
            disabled={busy}
            className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-wait disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "register" ? "Create workspace" : "Sign in"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => {
            setError("");
            setMode(mode === "register" ? "login" : "register");
          }}
          className="mt-5 w-full text-center text-sm font-medium text-sky-700 hover:text-sky-900"
        >
          {mode === "register" ? "Already have an account? Sign in" : "New to ForgeFlow? Create a workspace"}
        </button>
      </section>
    </main>
  );
}
