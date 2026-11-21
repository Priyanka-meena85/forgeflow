import type { Metadata } from "next";
import Link from "next/link";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";

export const metadata: Metadata = {
  title: "404 — Page Not Found | ForgeFlow",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 font-humanist">
      <PublicNavbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-24">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Code */}
          <div className="mb-6">
            <span className="text-[8rem] font-bold leading-none text-slate-800 select-none">
              404
            </span>
          </div>

          {/* Accent bar */}
          <div className="w-16 h-1 bg-cyan-400 mx-auto mb-8 rounded-full" />

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto">
            The page you are looking for may have been moved, renamed, or no
            longer exists. Use the links below to find your way back.
          </p>

          {/* Nav links */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-400 text-slate-900 font-semibold text-sm hover:bg-cyan-300 transition-colors"
            >
              <span className="css-icon-home" aria-hidden="true" />
              Back to Home
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 text-slate-200 font-semibold text-sm hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <span className="css-icon-layers" aria-hidden="true" />
              Platform Features
            </Link>
            <Link
              href="/industries"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 text-slate-200 font-semibold text-sm hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <span className="css-icon-factory" aria-hidden="true" />
              Industries
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 text-slate-200 font-semibold text-sm hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <span className="css-icon-tag" aria-hidden="true" />
              Pricing
            </Link>
          </div>

          {/* Help text */}
          <p className="text-slate-500 text-sm">
            Need help?{" "}
            <Link
              href="/demo"
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
            >
              Book a live demo
            </Link>{" "}
            or{" "}
            <a
              href="mailto:support@forgeflow.ai"
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
            >
              contact support
            </a>
            .
          </p>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
