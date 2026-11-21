"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PricingCTAButtonProps {
  planName: string;
  priceId: string;
  label: string;
  billingCycle: "annual" | "monthly";
  highlight?: boolean;
}

export function PricingCTAButton({
  planName,
  priceId,
  label,
  billingCycle,
  highlight = false,
}: PricingCTAButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    if (planName.toLowerCase() === "enterprise") {
      router.push("/demo?tier=enterprise");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName,
          priceId,
          billingCycle,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        router.push("/demo?tier=" + encodeURIComponent(planName));
      }
    } catch (err) {
      console.error("Checkout initiation failed:", err);
      router.push("/demo?tier=" + encodeURIComponent(planName));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`block w-full py-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer ${
        highlight
          ? "bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20"
          : "bg-slate-900 hover:bg-slate-800 text-white"
      } disabled:opacity-60`}
    >
      {loading ? "Preparing Pilot..." : label}
    </button>
  );
}
