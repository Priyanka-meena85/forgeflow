"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ForgeFlow Global Error]:", error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Critical Error | ForgeFlow</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          body{background:#020617;color:#f8fafc;font-family:system-ui,-apple-system,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1.5rem}
          .card{max-width:480px;width:100%;text-align:center}
          .badge{display:inline-flex;align-items:center;justify-content:center;width:4rem;height:4rem;border-radius:50%;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);margin:0 auto 1.5rem;font-size:1.5rem;color:#f87171}
          .bar{width:3rem;height:4px;background:#ef4444;border-radius:2px;margin:0 auto 1.5rem}
          h1{font-size:1.75rem;font-weight:700;margin-bottom:.75rem;color:#f8fafc}
          .msg{color:#94a3b8;margin-bottom:.5rem;font-size:.95rem}
          .sub{color:#64748b;font-size:.85rem;margin-bottom:2rem}
          .actions{display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap}
          .btn-primary{padding:.625rem 1.25rem;border-radius:.5rem;background:#22d3ee;color:#0f172a;font-weight:600;font-size:.875rem;border:none;cursor:pointer;text-decoration:none;display:inline-block}
          .btn-primary:hover{background:#67e8f9}
          .btn-secondary{padding:.625rem 1.25rem;border-radius:.5rem;background:#1e293b;color:#e2e8f0;font-weight:600;font-size:.875rem;border:1px solid #334155;cursor:pointer;text-decoration:none;display:inline-block}
          .btn-secondary:hover{background:#334155}
        `}</style>
      </head>
      <body>
        <div className="card">
          <div className="badge">!</div>
          <div className="bar" />
          <h1>Critical System Error</h1>
          <p className="msg">{error?.message || "An unexpected root-level exception occurred."}</p>
          <p className="sub">Please reload the application or verify network connectivity.</p>
          <div className="actions">
            <button className="btn-primary" onClick={() => reset()}>
              Try Again
            </button>
            <a className="btn-secondary" href="/">
              Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
