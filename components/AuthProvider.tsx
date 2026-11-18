"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { LandingPage, type AuthUser } from "./LandingPage";

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
  const [loading, setLoading] = useState(false);

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
        <LandingPage onAuthenticated={setUser} />
      </AuthContext.Provider>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
