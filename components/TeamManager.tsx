"use client";

import React, { useState, useEffect, useCallback } from "react";
import { UserRole } from "@prisma/client";

export interface TeamMemberItem {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  createdAt: string;
  isCurrentUser?: boolean;
}

export interface TeamInviteItem {
  id: string;
  email: string;
  role: UserRole;
  status: string;
  expiresAt: string;
  createdAt: string;
}

interface TeamManagerProps {
  currentUserRole?: UserRole;
  onActionMessage: (msg: string) => void;
}

export function TeamManager({ currentUserRole = UserRole.OWNER, onActionMessage }: TeamManagerProps) {
  const [members, setMembers] = useState<TeamMemberItem[]>([]);
  const [invitations, setInvitations] = useState<TeamInviteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>(UserRole.REVIEWER);
  const [inviting, setInviting] = useState(false);

  const fetchTeam = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      if (res.ok && data.success) {
        setMembers(data.members || []);
        setInvitations(data.invitations || []);
      }
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success) {
          setMembers(data.members || []);
          setInvitations(data.invitations || []);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteEmail.includes("@")) {
      onActionMessage("Please enter a valid work email address.");
      return;
    }
    setInviting(true);
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to invite teammate");

      onActionMessage(`Invitation sent to ${inviteEmail} as ${inviteRole}.`);
      setInviteEmail("");
      setShowInviteModal(false);
      fetchTeam();
    } catch (err: unknown) {
      onActionMessage(err instanceof Error ? err.message : "Invitation failed.");
    } finally {
      setInviting(false);
    }
  };

  const handleRevoke = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to revoke the invitation for ${email}?`)) return;
    try {
      const res = await fetch(`/api/team/invites/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to revoke invitation");

      onActionMessage(`Revoked invitation for ${email}.`);
      fetchTeam();
    } catch (err: unknown) {
      onActionMessage(err instanceof Error ? err.message : "Revocation failed.");
    }
  };

  const canInvite = currentUserRole === UserRole.OWNER || currentUserRole === UserRole.ADMIN;

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.OWNER:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case UserRole.ADMIN:
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case UserRole.REVIEWER:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case UserRole.AUTHOR:
        return "bg-sky-100 text-sky-800 border-sky-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Role Legend */}
      <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase font-mono flex items-center gap-2">
              <span>Team Roster &amp; Application Engineers (RBAC)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-200">
                {members.length} Active Members
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enforce role separation between Content Strategists (drafting) and Certified Application Engineers (spec sign-off).
            </p>
          </div>
          {canInvite && (
            <button
              type="button"
              onClick={() => setShowInviteModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition shrink-0 cursor-pointer"
            >
              <span>+ Invite Team Member</span>
            </button>
          )}
        </div>

        {/* Role Permissions Reference */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              REVIEWER (Application Engineer)
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed font-normal">
              Reviews operating envelopes, verifies ASHRAE/ISO standards, checks failure modes, and issues formal Schema.org PE sign-off.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200 space-y-1">
            <div className="font-bold text-sky-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-600"></span>
              AUTHOR (Content Strategist)
            </div>
            <p className="text-[11px] text-sky-800 leading-relaxed font-normal">
              Plans topics, runs RAG spec queries, and triggers AI drafts. Cannot approve or publish unreviewed content.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 space-y-1">
            <div className="font-bold text-purple-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              OWNER / ADMIN (Plant Leadership)
            </div>
            <p className="text-[11px] text-purple-800 leading-relaxed font-normal">
              Full workspace governance: invites team members, configures CMS webhook connectors, and manages Net-30 billing.
            </p>
          </div>
        </div>
      </div>

      {/* Active Members Table */}
      <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
          Active Workspace Members
        </h4>

        {loading ? (
          <div className="text-xs text-slate-400 py-4 text-center">Loading team members…</div>
        ) : members.length === 0 ? (
          <div className="text-xs text-slate-500 py-3 italic">No active members found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-mono border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Member</th>
                  <th className="py-2.5 px-3">Role &amp; Permissions</th>
                  <th className="py-2.5 px-3">Joined Date</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{m.name || m.email.split("@")[0]}</span>
                        {m.isCurrentUser && (
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                            (You)
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{m.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getRoleBadge(m.role)}`}>
                        {m.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pending Invitations Table */}
      {invitations.length > 0 && (
        <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-xs space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900 flex items-center justify-between">
            <span>Pending Email Invitations ({invitations.length})</span>
            <span className="text-[10px] text-amber-700 font-normal">Expires in 7 days</span>
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-amber-100/60 text-amber-800 font-mono border-b border-amber-200">
                <tr>
                  <th className="py-2 px-3">Invited Email</th>
                  <th className="py-2 px-3">Assigned Role</th>
                  <th className="py-2 px-3">Expires</th>
                  <th className="py-2 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {invitations.map((inv) => (
                  <tr key={inv.id}>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">{inv.email}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getRoleBadge(inv.role)}`}>
                        {inv.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                      {new Date(inv.expiresAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {canInvite && (
                        <button
                          type="button"
                          onClick={() => handleRevoke(inv.id, inv.email)}
                          className="text-red-600 hover:text-red-800 hover:underline text-[11px] font-bold cursor-pointer"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-sm">Invite Colleague to Workspace</h4>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition"
              >
                <span className="css-icon-cross"></span>
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Work / Corporate Email
                </label>
                <input
                  required
                  type="email"
                  placeholder="engineer@manufacturer.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-sky-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Assigned Industrial Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-sky-600"
                >
                  <option value={UserRole.REVIEWER}>REVIEWER — Certified Application Engineer (Sign-Off &amp; Approvals)</option>
                  <option value={UserRole.AUTHOR}>AUTHOR — Content Strategist (Draft Planning &amp; RAG)</option>
                  <option value={UserRole.ADMIN}>ADMIN — Workspace Administrator (Team, Billing &amp; CMS)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <strong>Email Delivery:</strong>
                <p>An automated secure invitation link will be dispatched. Recipient will be prompted to create their password and will be directly assigned to your workspace.</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition cursor-pointer shadow-xs disabled:opacity-60"
                >
                  {inviting ? "Dispatching Invite…" : "Send Workspace Invite →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
