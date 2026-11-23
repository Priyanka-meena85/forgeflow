"use client";

import React, { useState } from "react";

interface SlackReviewBotConfigProps {
  onActionMessage: (msg: string) => void;
}

export function SlackReviewBotConfig({ onActionMessage }: SlackReviewBotConfigProps) {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [channel, setChannel] = useState("#engineering-reviews");
  const [busy, setBusy] = useState(false);
  const [lastDispatchedPayload, setLastDispatchedPayload] = useState<Record<string, unknown> | null>(null);

  const handleTestDispatch = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/notifications/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl,
          channelName: channel,
          eventType: "DRAFT_PENDING_SIGN_OFF",
          draftTitle: "Root Cause Protocol: Stamping Die Galling & Weld Inspection Defects",
          equipment: "1200T Servo Stamping Press",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Webhook dispatch failed");

      setLastDispatchedPayload(data.payload);
      onActionMessage(`Dispatched interactive engineering review alert to ${channel}.`);
    } catch (e: unknown) {
      onActionMessage(e instanceof Error ? e.message : "Webhook failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase font-mono flex items-center gap-2">
            <span>Slack &amp; Microsoft Teams Review Bot</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Interactive Approvals
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Dispatches automated review cards to your engineering team&apos;s private Slack/Teams channel with 1-click &lsquo;Approve Tolerances&rsquo; action buttons.
          </p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={handleTestDispatch}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition shrink-0 cursor-pointer disabled:opacity-50"
        >
          <span className="css-icon-bolt"></span>
          <span>{busy ? "Dispatching…" : "Test Slack Alert Dispatch"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Target Channel
          </label>
          <input
            type="text"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-xs font-mono text-slate-900 outline-none focus:border-sky-600 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Incoming Webhook URL
          </label>
          <input
            type="text"
            value={webhookUrl}
            placeholder="https://hooks.slack.com/services/..."
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-xs font-mono text-slate-900 outline-none focus:border-sky-600 focus:bg-white"
          />
        </div>
      </div>

      {lastDispatchedPayload && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-1.5 border border-slate-800">
          <div className="text-emerald-400 font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="css-icon-check"></span>
              <span>Live Outbound Payload Generated:</span>
            </span>
            <span className="text-[10px] text-slate-400">{channel}</span>
          </div>
          <pre className="text-[10px] overflow-x-auto text-slate-300 max-h-36">
            {JSON.stringify(lastDispatchedPayload, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
