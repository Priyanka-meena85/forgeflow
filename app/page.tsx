"use client";

import { useEffect, useMemo, useState } from "react";
import { AuthProvider, useAuth } from "@/components/AuthProvider";

type TabKey =
  | "Dashboard"
  | "Topics & Batches"
  | "Content Review"
  | "Published Pages"
  | "Analytics"
  | "Team & Settings"
  | "Billing";

type QAStatus = "Pass" | "Review" | "Fail";

type Draft = {
  id: string | number;
  title: string;
  stage: "Suggested" | "Approved" | "In Review" | "Changes requested" | "Rejected" | "Published";
  keyword: string;
  qa: Record<string, QAStatus>;
  summary: string;
  sections: Array<{ heading: string; body: string }>;
  faqs: Array<{ q: string; a: string }>;
  schema: string;
  updatedAt?: string;
};

const navItems: Array<{ label: TabKey; badge?: string }> = [
  { label: "Dashboard" },
  { label: "Topics & Batches" },
  { label: "Content Review" },
  { label: "Published Pages" },
  { label: "Analytics", badge: "V1" },
  { label: "Team & Settings" },
  { label: "Billing" },
];

const industries = [
  "Food & beverage manufacturing",
  "Steel and metals processing",
  "Industrial automation",
  "Construction technology",
  "Predictive maintenance",
  "Logistics optimization",
];

const defaultForm = {
  companyName: "ForgeFlow Industrial",
  website: "https://forgeflowindustrial.com",
  productDescription:
    "AI-powered predictive maintenance and production intelligence software for discrete manufacturing teams.",
  industry: "Food & beverage manufacturing",
  keywords: "predictive maintenance, conveyors, fillers, bakery ovens, line downtime",
};

const topicMap: Record<string, string[]> = {
  "Food & beverage manufacturing": [
    "Bakery oven predictive maintenance",
    "Conveyor monitoring software",
    "Filler line downtime analytics",
    "Packaging line quality monitoring",
    "Food plant energy optimization",
  ],
  "Steel and metals processing": [
    "EAF energy optimization software",
    "Continuous casting quality monitoring",
    "Rolling mill predictive maintenance",
    "Steel plant process analytics",
    "Hot strip defect detection",
  ],
  "Industrial automation": [
    "SCADA system integration software",
    "MES dashboard automation tools",
    "Factory automation analytics",
    "Process visibility software",
    "Industrial controls optimization",
  ],
  "Construction technology": [
    "Jobsite equipment monitoring software",
    "Construction fleet analytics",
    "Heavy equipment maintenance software",
    "Asset optimization for contractors",
    "Site energy and safety analytics",
  ],
  "Predictive maintenance": [
    "CMMS predictive maintenance software",
    "Bearing failure detection platform",
    "Machine health analytics",
    "Industrial IoT monitoring software",
    "PdM software for equipment uptime",
  ],
  "Logistics optimization": [
    "Warehouse conveyor analytics",
    "Cold chain monitoring software",
    "Fleet maintenance optimization",
    "Dock scheduling and visibility",
    "Warehouse equipment uptime analytics",
  ],
};

const demoReviewDrafts: Draft[] = [
  {
    id: 1,
    title: "Bakery oven predictive maintenance",
    stage: "In Review",
    keyword: "bakery oven maintenance software",
    qa: {
      wordCount: "Pass",
      faqCount: "Pass",
      ctaCount: "Review",
      linkAllowlist: "Pass",
      uniqueness: "Pass",
    },
    summary:
      "A technical SEO page built for food & beverage plants that need continuous oven reliability and lower unplanned downtime.",
    sections: [
      {
        heading: "Why it matters",
        body: "Bakery ovens are high-heat, high-throughput assets where downtime directly hits output, maintenance cost, and yield. Teams need a single source of truth across temperature drift, cycle health, and service history.",
      },
      {
        heading: "What to look for",
        body: "Evaluate platforms that combine sensor telemetry, actionable alerts, and maintenance workflow automation rather than static dashboards or spreadsheet-based tracking.",
      },
      {
        heading: "Operational impact",
        body: "Shorter unplanned stoppages, better line utilization, and more consistent product output create immediate ROI for plant reliability and operations teams.",
      },
    ],
    faqs: [
      { q: "What is predictive maintenance for bakery ovens?", a: "It uses thermal, runtime, and sensor data to detect degradation before equipment fails." },
      { q: "How do teams justify the investment?", a: "By tying uptime gains, maintenance savings, and quality consistency to a measurable operational KPI dashboard." },
    ],
    schema:
      '{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What is predictive maintenance for bakery ovens?","acceptedAnswer":{"@type":"Answer","text":"It uses thermal, runtime, and sensor data to detect degradation before equipment fails."}}]}',
  },
  {
    id: 2,
    title: "Conveyor monitoring software",
    stage: "Approved",
    keyword: "conveyor monitoring tools",
    qa: {
      wordCount: "Pass",
      faqCount: "Pass",
      ctaCount: "Pass",
      linkAllowlist: "Pass",
      uniqueness: "Pass",
    },
    summary:
      "A page optimized for manufacturing teams optimizing throughput, maintenance planning, and in-line visibility across packaging and processing systems.",
    sections: [
      {
        heading: "Why it matters",
        body: "Conveyors are a common bottleneck in process manufacturing. Monitoring them effectively means detecting anomalies before jams, slowdowns, or missed throughput targets affect output.",
      },
      {
        heading: "Key features",
        body: "Look for rules-based alerts, sensor integrations, line performance reporting, and clear issue triage that connects to maintenance and production workflows.",
      },
      {
        heading: "Business value",
        body: "Improved uptime, less manual inspection, and lower production loss can quickly justify deeper deployment across plants and lines.",
      },
    ],
    faqs: [
      { q: "Why is conveyor monitoring important?", a: "Because it turns operational blind spots into measurable, actionable signals before disruption becomes expensive." },
      { q: "What metrics matter most?", a: "Throughput, stoppage rate, mean time to repair, seasonal load variability, and alert precision all matter." },
    ],
    schema:
      '{"@context":"https://schema.org","@type":"HowTo","name":"Conveyor monitoring setup guide","step":[{"@type":"HowToStep","text":"Map each conveyor and sensor group to a production KPI."},{"@type":"HowToStep","text":"Create rules that surface anomalies before line disruption occurs."}]}',
  },
  {
    id: 3,
    title: "EAF energy optimization software",
    stage: "Published",
    keyword: "EAF energy optimization",
    qa: {
      wordCount: "Pass",
      faqCount: "Pass",
      ctaCount: "Pass",
      linkAllowlist: "Pass",
      uniqueness: "Pass",
    },
    summary:
      "A steel and metals page built for operators seeking lower energy usage and tighter process control in electric arc furnace environments.",
    sections: [
      {
        heading: "Why it matters",
        body: "Energy consumption and process stability are critical in electric arc furnace operations, where minor inefficiencies can compound quickly across a shift.",
      },
      {
        heading: "Operational approach",
        body: "The best tools connect energy use, furnace conditions, and production variables so operators can tune process windows instead of reacting after the fact.",
      },
      {
        heading: "Long-term impact",
        body: "Steel teams can reduce cost per ton, improve consistency, and maintain a clear operational story around efficiency and sustainability goals.",
      },
    ],
    faqs: [
      { q: "How does energy optimization software help steel operations?", a: "It identifies the combinations of furnace conditions and energy inputs that maximize stability and throughput without waste." },
      { q: "What is the biggest adoption barrier?", a: "Data quality, team alignment, and a clear operating model for acting on alerts are usually the blockers." },
    ],
    schema:
      '{"@context":"https://schema.org","@type":"Article","headline":"EAF energy optimization software","author":{"@type":"Organization","name":"ForgeFlow Industrial"}}',
  },
];

function StatusPill({ value }: { value: QAStatus | string }) {
  const colorMap: Record<string, string> = {
    Pass: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Review: "bg-amber-100 text-amber-700 border-amber-200",
    Fail: "bg-rose-100 text-rose-700 border-rose-200",
    Live: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Reviewing: "bg-amber-100 text-amber-700 border-amber-200",
    Ready: "bg-sky-100 text-sky-700 border-sky-200",
    Queued: "bg-violet-100 text-violet-700 border-violet-200",
    Running: "bg-cyan-100 text-cyan-700 border-cyan-200",
    Waiting: "bg-slate-200 text-slate-700 border-slate-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${colorMap[value] ?? "bg-slate-100 text-slate-700 border-slate-200"}`}
    >
      {value}
    </span>
  );
}

function PagePreview({ draft }: { draft: Draft }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">Page preview</p>
      <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{draft.title}</h3>
      <p className="mt-3 text-base leading-7 text-slate-600">{draft.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {Object.entries(draft.qa).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600">
            <span className="font-medium uppercase tracking-wide text-slate-500">{key}</span>
            <StatusPill value={value} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  const { user, signOut } = useAuth();
  const organizationName = user?.organization.name ?? "";
  const organizationPlan = user?.organization.plan ?? "free";
  const userEmail = user?.email ?? "";
  const [activeTab, setActiveTab] = useState<TabKey>("Dashboard");
  const [selectedDraftId, setSelectedDraftId] = useState<string | number>(1);
  const [reviewView, setReviewView] = useState<"Overview" | "Sections" | "FAQ" | "Schema">("Overview");
  const [form, setForm] = useState(defaultForm);
  const [reviewDrafts, setReviewDrafts] = useState<Draft[]>([]);
  const [draftsLoaded, setDraftsLoaded] = useState(false);
  const [generationBusy, setGenerationBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  const selectedDraft =
    reviewDrafts.find((draft) => draft.id === selectedDraftId) ??
    reviewDrafts[0] ??
    demoReviewDrafts[0];

  const suggestionCards = useMemo(() => {
    const topics = topicMap[form.industry] ?? topicMap["Food & beverage manufacturing"];
    return topics.slice(0, 5);
  }, [form.industry]);
  const batchRows = [
    { stage: "Suggested", count: suggestionCards.length, owner: "Industrial taxonomy", status: "Ready" },
    { stage: "Approved", count: reviewDrafts.filter((draft) => draft.stage === "Approved").length, owner: "Approved drafts", status: "Queued" },
    { stage: "In Generation", count: generationBusy ? 1 : 0, owner: "Active generation", status: generationBusy ? "Running" : "Idle" },
    { stage: "In Review", count: reviewDrafts.filter((draft) => draft.stage === "In Review").length, owner: "Draft review", status: "Waiting" },
    { stage: "Published", count: reviewDrafts.filter((draft) => draft.stage === "Published").length, owner: "Published content", status: "Live" },
  ];
  const dashboardStats = [
    { label: "Saved drafts", value: String(reviewDrafts.length), sub: "in this workspace" },
    { label: "Awaiting review", value: String(reviewDrafts.filter((draft) => draft.stage === "In Review").length), sub: "human review required" },
    { label: "Approved", value: String(reviewDrafts.filter((draft) => draft.stage === "Approved").length), sub: "ready for publishing" },
    { label: "Published pages", value: String(reviewDrafts.filter((draft) => draft.stage === "Published").length), sub: "tracked in workspace" },
  ];

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/drafts", { cache: "no-store" }),
      fetch("/api/workspace", { cache: "no-store" }),
    ])
      .then(async ([draftResponse, workspaceResponse]) => {
        const [draftData, workspaceData] = await Promise.all([
          draftResponse.json() as Promise<{
            drafts?: Array<Omit<Draft, "stage" | "qa" | "schema"> & { status: string; schema: unknown }>;
            error?: string;
          }>,
          workspaceResponse.json() as Promise<{
            organization?: {
              name: string;
              website: string | null;
              productDescription: string | null;
              industry: string | null;
              keywords: string | null;
            };
            error?: string;
          }>,
        ]);
        if (!draftResponse.ok) throw new Error(draftData.error ?? "Could not load drafts.");
        if (!workspaceResponse.ok) throw new Error(workspaceData.error ?? "Could not load workspace settings.");
        const organization = workspaceData.organization;
        const drafts = (draftData.drafts ?? []).map((draft): Draft => ({
          ...draft,
          id: draft.id,
          stage:
            draft.status === "published"
              ? "Published"
              : draft.status === "approved"
                ? "Approved"
                : draft.status === "changes_requested"
                  ? "Changes requested"
                  : draft.status === "rejected"
                    ? "Rejected"
                    : "In Review",
          qa: {
            wordCount: "Review",
            faqCount: "Pass",
            ctaCount: "Review",
            linkAllowlist: "Review",
            uniqueness: "Review",
          },
          schema:
            typeof draft.schema === "string"
              ? draft.schema
              : JSON.stringify(draft.schema, null, 2),
        }));
        if (active) {
          setReviewDrafts(drafts);
          setSelectedDraftId(drafts[0]?.id ?? "");
          setDraftsLoaded(true);
          if (organization) {
            setForm({
              companyName: organization.name,
              website: organization.website ?? "",
              productDescription: organization.productDescription ?? defaultForm.productDescription,
              industry: organization.industry ?? defaultForm.industry,
              keywords: organization.keywords ?? defaultForm.keywords,
            });
          }
        }
      })
      .catch((error: unknown) => {
        console.error(error);
        if (active) {
          setActionMessage(error instanceof Error ? error.message : "Could not load drafts.");
          setDraftsLoaded(true);
        }
      });
    return () => {
      active = false;
    };
  }, [organizationName]);

  async function generateBatch() {
    setGenerationBusy(true);
    setActionMessage("");
    try {
      const workspaceResponse = await fetch("/api/workspace", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.companyName,
          website: form.website,
          productDescription: form.productDescription,
          industry: form.industry,
          keywords: form.keywords,
        }),
      });
      const workspaceData = (await workspaceResponse.json()) as { error?: string };
      if (!workspaceResponse.ok) throw new Error(workspaceData.error ?? "Could not save workspace profile.");

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topics: suggestionCards.slice(0, 3),
          productDescription: form.productDescription,
          industry: form.industry,
          keywords: form.keywords,
        }),
      });
      const data = (await response.json()) as {
        drafts?: Array<Omit<Draft, "stage" | "qa" | "schema"> & { status: string; schema: unknown }>;
        error?: string;
      };
      if (!response.ok) throw new Error(data.error ?? "Draft generation failed.");
      const generated = (data.drafts ?? []).map((draft): Draft => ({
        ...draft,
        stage: "In Review",
        qa: {
          wordCount: "Review",
          faqCount: "Pass",
          ctaCount: "Review",
          linkAllowlist: "Review",
          uniqueness: "Review",
        },
        schema: JSON.stringify(draft.schema, null, 2),
      }));
      setReviewDrafts((current) => [...generated, ...current]);
      if (generated[0]) {
        setSelectedDraftId(generated[0].id);
        setActiveTab("Content Review");
      }
      setActionMessage(`Generated ${generated.length} drafts. Review them before publishing.`);
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Draft generation failed.");
    } finally {
      setGenerationBusy(false);
    }
  }

  async function saveWorkspaceProfile() {
    setActionMessage("");
    try {
      const response = await fetch("/api/workspace", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.companyName,
          website: form.website,
          productDescription: form.productDescription,
          industry: form.industry,
          keywords: form.keywords,
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Could not save workspace profile.");
      setActionMessage("Workspace profile saved.");
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Could not save workspace profile.");
    }
  }

  async function updateDraft(action: "approve" | "request_changes" | "reject" | "publish") {
    if (!selectedDraft) return;
    setActionMessage("");
    try {
      const response = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, draftId: selectedDraft.id, comment: reviewComment }),
      });
      const data = (await response.json()) as { draft?: { status: string }; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Could not update this draft.");
      const stage: Draft["stage"] =
        data.draft?.status === "published"
          ? "Published"
          : data.draft?.status === "approved"
            ? "Approved"
            : data.draft?.status === "changes_requested"
              ? "Changes requested"
              : data.draft?.status === "rejected"
                ? "Rejected"
                : "In Review";
      setReviewDrafts((current) =>
        current.map((draft) => (draft.id === selectedDraft.id ? { ...draft, stage } : draft)),
      );
      setActionMessage(
        action === "request_changes"
          ? "Changes requested."
          : action === "publish"
            ? "Draft marked as published."
            : action === "reject"
              ? "Draft rejected."
              : "Draft approved.",
      );
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Could not update this draft.");
    }
  }

  async function startCheckout(plan: "starter" | "growth") {
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error ?? "Could not start checkout.");
      window.location.assign(data.url);
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Could not start checkout.");
    }
  }

  async function openBillingPortal() {
    try {
      const response = await fetch("/api/billing/portal", { method: "POST" });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error ?? "Could not open billing portal.");
      window.location.assign(data.url);
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Could not open billing portal.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex max-w-[1600px] gap-6 p-6">
        <aside className="hidden w-[260px] shrink-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600 text-lg font-bold text-white">
              F
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-sky-700">
                Industrial SEO
              </div>
              <div className="text-lg font-bold text-slate-900">ForgeFlow</div>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveTab(item.label)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                    isActive
                      ? "bg-sky-50 text-sky-800 ring-1 ring-sky-200"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 rounded-2xl border border-sky-100 bg-sky-50 p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">Plan</div>
            <div className="mt-3 text-2xl font-bold capitalize text-slate-900">{organizationPlan}</div>
            <div className="mt-2 text-sm text-slate-600">{reviewDrafts.length} saved drafts</div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-sky-100">
              <div className="h-full w-[18%] rounded-full bg-sky-600" />
            </div>
          </div>
        </aside>

        <section className="flex-1 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <header className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">{activeTab}</div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{form.companyName || organizationName}</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-slate-500 md:inline">{userEmail}</span>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600">
                {reviewDrafts.filter((draft) => draft.stage === "In Review").length} drafts in review
              </div>
              <button onClick={() => setActiveTab("Topics & Batches")} className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500">
                New batch
              </button>
              <button
                type="button"
                onClick={() => signOut().catch((error: unknown) => setActionMessage(error instanceof Error ? error.message : "Could not sign out."))}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Sign out
              </button>
            </div>
          </header>

          {actionMessage ? (
            <div role="status" className="mb-5 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
              {actionMessage}
            </div>
          ) : null}

          {activeTab === "Dashboard" ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {dashboardStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">{stat.label}</div>
                    <div className="mt-3 text-3xl font-bold text-slate-900">{stat.value}</div>
                    <div className="mt-2 text-xs font-medium text-slate-500">{stat.sub}</div>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Activity feed</h2>
                    <button className="text-sm font-medium text-sky-700">View all</button>
                  </div>
                  <div className="space-y-4">
                    {reviewDrafts.slice(0, 3).map((draft) => (
                    <div key={draft.id} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" />
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">{draft.title}</div>
                        <div className="mt-1 text-sm leading-6 text-slate-600">Content status: {draft.stage}</div>
                      </div>
                      <div className="text-xs font-medium text-slate-400">
                        {draft.updatedAt ? new Date(draft.updatedAt).toLocaleDateString() : ""}
                      </div>
                    </div>
                    ))}
                    {reviewDrafts.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm leading-6 text-slate-500">
                      Workspace activity will appear here as you create and review drafts.
                    </p>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h2 className="text-xl font-bold text-slate-900">First run onboarding</h2>
                  <div className="mt-5 space-y-4">
                    {[
                      "Company & product info",
                      "Vertical & taxonomy picker",
                      "Brand voice & approved links",
                      "Review & launch first batch",
                    ].map((step, index) => (
                      <div key={step} className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-slate-200">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${index === 0 ? "bg-sky-600 text-white" : "bg-slate-200 text-slate-700"}`}>
                          {index + 1}
                        </div>
                        <div className="text-sm font-medium text-slate-700">{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ) : null}

          {activeTab === "Topics & Batches" ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Topics & Batches</h2>
                  <p className="mt-1 text-sm text-slate-500">Browse vertical taxonomy and batch generation state</p>
                </div>
                <div className="flex gap-2">
                  {['Suggested', 'Approved', 'In Generation', 'In Review', 'Published'].map((stage) => (
                    <span key={stage} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700">
                      {stage}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {batchRows.map((row) => (
                  <div key={row.stage} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">{row.stage}</div>
                    <div className="mt-3 text-3xl font-bold text-slate-900">{row.count}</div>
                    <div className="mt-3 text-xs text-slate-500">{row.owner}</div>
                    <div className="mt-4">
                      <StatusPill value={row.status} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Taxonomy explorer</h3>
                  <button
                    type="button"
                    disabled={generationBusy}
                    onClick={() => generateBatch()}
                    className="rounded-full bg-sky-600 px-3.5 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {generationBusy ? "Generating…" : "Generate batch"}
                  </button>
                </div>

                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="space-y-3">
                    {industries.map((industry) => (
                      <button
                        key={industry}
                        type="button"
                        onClick={() => setForm((current) => ({ ...current, industry }))}
                        className={`w-full rounded-xl border p-3 text-left transition ${
                          form.industry === industry
                            ? "border-sky-200 bg-sky-50 text-sky-800"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <div className="font-semibold">{industry}</div>
                        <div className="mt-1 text-xs text-slate-500">{industry === form.industry ? "Default vertical" : "Ready taxonomy"}</div>
                      </button>
                    ))}
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Suggested topics</div>
                    <div className="space-y-2">
                      {suggestionCards.map((topic) => (
                        <div key={topic} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                          <span className="font-medium text-slate-800">{topic}</span>
                          <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">approved</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 grid gap-4 border-t border-slate-200 pt-5 md:grid-cols-2">
                    <label className="text-sm font-medium text-slate-700">
                      Company name
                      <input
                        value={form.companyName}
                        onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))}
                        className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-sky-500"
                      />
                    </label>
                    <label className="text-sm font-medium text-slate-700">
                      Website
                      <input
                        type="url"
                        value={form.website}
                        onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))}
                        placeholder="https://example.com"
                        className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-sky-500"
                      />
                    </label>
                    <label className="text-sm font-medium text-slate-700 md:col-span-2">
                      Product description
                      <textarea
                        rows={3}
                        value={form.productDescription}
                        onChange={(event) => setForm((current) => ({ ...current, productDescription: event.target.value }))}
                        className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-sky-500"
                      />
                    </label>
                    <label className="text-sm font-medium text-slate-700 md:col-span-2">
                      Keyword examples
                      <input
                        value={form.keywords}
                        onChange={(event) => setForm((current) => ({ ...current, keywords: event.target.value }))}
                        className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-sky-500"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => saveWorkspaceProfile()}
                      className="justify-self-start rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Save workspace profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "Content Review" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Content Review</h2>
                  <p className="mt-1 text-sm text-slate-500">Approve, route changes, and verify publish-readiness</p>
                </div>
                {reviewDrafts.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => updateDraft("request_changes")} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700">Request changes</button>
                    <button type="button" onClick={() => updateDraft("reject")} className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-700">Reject</button>
                    <button type="button" onClick={() => updateDraft("approve")} className="rounded-full bg-sky-600 px-3.5 py-1.5 text-sm font-semibold text-white">Approve</button>
                    <button type="button" onClick={() => updateDraft("publish")} className="rounded-full bg-emerald-600 px-3.5 py-1.5 text-sm font-semibold text-white">Mark published</button>
                  </div>
                ) : null}
              </div>

              {reviewDrafts.length > 0 ? (
                <label className="block text-sm font-medium text-slate-700">
                  Reviewer comment
                  <textarea
                    rows={2}
                    maxLength={2000}
                    value={reviewComment}
                    onChange={(event) => setReviewComment(event.target.value)}
                    placeholder="Add a note for the writer or reviewer…"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-sky-500"
                  />
                </label>
              ) : null}

              {draftsLoaded && reviewDrafts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                  <div className="text-lg font-semibold text-slate-700">No drafts yet</div>
                  <p className="mt-2 text-sm text-slate-500">Choose a vertical in Topics &amp; Batches and generate your first content batch.</p>
                </div>
              ) : (
              <div className="grid gap-5 xl:grid-cols-[0.7fr_1.3fr]">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Drafts</div>
                  <div className="space-y-2">
                    {reviewDrafts.map((draft) => (
                      <button
                        key={draft.id}
                        type="button"
                        onClick={() => setSelectedDraftId(draft.id)}
                        className={`w-full rounded-xl border p-3 text-left transition ${
                          selectedDraftId === draft.id
                            ? "border-sky-200 bg-sky-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-semibold text-slate-800">{draft.title}</div>
                          <StatusPill value={draft.stage} />
                        </div>
                        <div className="mt-2 text-xs text-slate-500">{draft.keyword}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  <PagePreview draft={selectedDraft} />
                  <div className="flex justify-end">
                    <a
                      href={`/api/drafts/${encodeURIComponent(String(selectedDraft.id))}/export`}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Export HTML
                    </a>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-4 flex flex-wrap gap-2">
                      {['Overview', 'Sections', 'FAQ', 'Schema'].map((view) => (
                        <button
                          key={view}
                          type="button"
                          onClick={() => setReviewView(view as "Overview" | "Sections" | "FAQ" | "Schema")}
                          className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                            reviewView === view
                              ? "bg-sky-600 text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {view}
                        </button>
                      ))}
                    </div>

                    {reviewView === "Overview" ? (
                      <div className="space-y-4">
                        {selectedDraft.sections.map((section) => (
                          <div key={section.heading} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <div className="mb-2 text-base font-bold text-slate-900">{section.heading}</div>
                            <p className="leading-7 text-slate-600">{section.body}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {reviewView === "Sections" ? (
                      <div className="space-y-3">
                        {selectedDraft.sections.map((section) => (
                          <div key={section.heading} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{section.heading}</div>
                            <div className="mt-2 text-sm leading-7 text-slate-600">{section.body}</div>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {reviewView === "FAQ" ? (
                      <div className="space-y-3">
                        {selectedDraft.faqs.map((faq) => (
                          <div key={faq.q} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <div className="font-semibold text-slate-900">{faq.q}</div>
                            <div className="mt-2 text-sm leading-7 text-slate-600">{faq.a}</div>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {reviewView === "Schema" ? (
                      <pre className="whitespace-pre-wrap rounded-xl bg-slate-900 p-4 text-sm text-sky-100">{selectedDraft.schema}</pre>
                    ) : null}
                  </div>
                </div>
              </div>
              )}
            </div>
          ) : null}

          {activeTab === "Published Pages" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Published Pages</h2>
                  <p className="mt-1 text-sm text-slate-500">Track live pages across batches and traffic performance</p>
                </div>
                <button className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white">Export report</button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full text-left">
                  <thead className="bg-slate-50 text-sm text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Page</th>
                      <th className="px-4 py-3 font-semibold">Batch</th>
                      <th className="px-4 py-3 font-semibold">Publish date</th>
                      <th className="px-4 py-3 font-semibold">Traffic</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewDrafts.filter((draft) => draft.stage === "Published").map((draft) => (
                      <tr key={draft.id} className="border-t border-slate-200">
                        <td className="px-4 py-3 font-medium text-slate-800">{draft.title}</td>
                        <td className="px-4 py-3 text-slate-600">{form.industry}</td>
                        <td className="px-4 py-3 text-slate-600">{draft.updatedAt ? new Date(draft.updatedAt).toLocaleDateString() : "—"}</td>
                        <td className="px-4 py-3 text-slate-600">—</td>
                        <td className="px-4 py-3"><StatusPill value="Live" /></td>
                        <td className="px-4 py-3 text-sm font-medium text-sky-700">
                          <a className="mr-3" href={`/api/drafts/${encodeURIComponent(String(draft.id))}/export`}>export</a>
                          <button type="button" onClick={() => { setSelectedDraftId(draft.id); setActiveTab("Content Review"); }}>review</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {activeTab === "Billing" ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Plans &amp; billing</h2>
                <p className="mt-1 text-sm text-slate-500">Choose a subscription. Payment and subscription status are managed securely by Stripe.</p>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {[
                  { plan: "starter" as const, price: "$99", pages: "20 pages / month", domains: "1 domain" },
                  { plan: "growth" as const, price: "$249", pages: "100 pages / month", domains: "3 domains" },
                ].map((plan) => (
                  <div key={plan.plan} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-bold capitalize text-slate-900">{plan.plan}</h3>
                      {organizationPlan === plan.plan ? <StatusPill value="Current plan" /> : null}
                    </div>
                    <p className="mt-4 text-3xl font-bold text-slate-900">{plan.price}<span className="text-sm font-medium text-slate-500"> / month</span></p>
                    <p className="mt-3 text-sm text-slate-600">{plan.pages} · {plan.domains}</p>
                    {organizationPlan !== "free" ? (
                      <button
                        type="button"
                        onClick={() => openBillingPortal()}
                        className="mt-6 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-500"
                      >
                        Manage or change plan
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startCheckout(plan.plan)}
                        className="mt-6 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-500"
                      >
                        Choose plan
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {activeTab === "Analytics" || activeTab === "Team & Settings" ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
              <div className="text-lg font-semibold text-slate-700">{activeTab}</div>
              <p className="mt-2 text-sm text-slate-500">This is the blueprint roadmapped module for the next product milestone.</p>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}
