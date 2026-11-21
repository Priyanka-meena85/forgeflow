"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LandingPage, type AuthUser } from "@/components/LandingPage";

export default function HomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Check if user already has an active session
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setCurrentUser(data.user);
          }
        }
      } catch {
        // Unauthenticated visitor
      }
    }
    void checkSession();
  }, []);

  const handleAuthenticated = (user: AuthUser) => {
    setCurrentUser(user);
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <>
      {currentUser && (
        <div className="bg-cyan-950/90 border-b border-cyan-800 text-cyan-200 text-xs py-2 px-4 text-center font-humanist flex items-center justify-center gap-3 sticky top-0 z-50 backdrop-blur-sm">
          <span>
            Signed in as <strong>{currentUser.email}</strong> ({currentUser.organization.name})
          </span>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-[11px] uppercase tracking-wider transition cursor-pointer"
          >
            Open Mission Control Console &rarr;
          </button>
        </div>
      )}
      <LandingPage onAuthenticated={handleAuthenticated} />
    </>
  );
}
