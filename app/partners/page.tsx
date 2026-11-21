import Link from "next/link";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";

export default function PartnersPage() {
  const PARTNER_TIERS = [
    {
      name: "Referral Partner",
      badge: "Consultants & Tech Advisors",
      commission: "20% Recurring",
      period: "First 12 Months",
      description:
        "Ideal for independent manufacturing consultants, industrial fractional CMOs, and technical SEO advisors recommending solutions to OEM clients.",
      features: [
        "Dedicated partner referral link & tracking dashboard",
        "Direct access to ForgeFlow technical solutions engineers",
        "Co-branded one-pagers and sample diagnostic audits",
        "Quarterly commission payouts via automated Stripe ACH",
      ],
      ctaText: "Join Referral Program",
      highlight: false,
    },
    {
      name: "Solution Agency Partner",
      badge: "Industrial B2B Marketing Agencies",
      commission: "25% Recurring",
      period: "Lifetime of Client Contract",
      description:
        "For marketing and digital transformation agencies managing content and search programs for manufacturing, energy, and precision engineering accounts.",
      features: [
        "Multi-tenant agency master dashboard with client switching",
        "White-label executive ROI and Share-of-Voice reports",
        "Co-op MDF marketing development fund allocation (up to $5K/yr)",
        "Priority Slack channel with our core engineering team",
        "Quarterly product roadmap briefings & feature input",
      ],
      ctaText: "Apply as Solution Agency",
      highlight: true,
    },
    {
      name: "Technology & ERP Partner",
      badge: "CMS, PIM & ERP Platforms",
      commission: "Custom Revenue Share",
      period: "Bilateral Partnership",
      description:
        "For enterprise PIM (Inriver, Akeneo), ERP (SAP S/4HANA), and industrial eCommerce platforms integrating native AEO syndication webhooks.",
      features: [
        "Certified marketplace app listing and developer sandbox",
        "Bilateral engineering integration support and webhook APIs",
        "Joint press release and co-marketing webinar sponsorship",
        "Dedicated enterprise partner success executive",
      ],
      ctaText: "Partner with Us",
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-humanist">
      <PublicNavbar />

      <main className="flex-1 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full">
              ForgeFlow Partner Ecosystem
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Grow Your Practice Modernizing Industrial Search
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Industrial manufacturers are actively seeking solutions to protect their technical catalogs in AI answer engines. Partner with ForgeFlow to deliver high-margin AEO programs.
            </p>
          </div>

          {/* Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PARTNER_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 ${
                  tier.highlight
                    ? "bg-slate-900 border-2 border-cyan-500 shadow-xl shadow-cyan-500/10"
                    : "bg-slate-900/60 border border-slate-800"
                }`}
              >
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold">
                      {tier.badge}
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">{tier.name}</h2>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-2xl font-black text-cyan-400 font-humanist">
                      {tier.commission}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">{tier.period}</div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{tier.description}</p>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="text-[11px] font-mono uppercase font-bold text-slate-400">
                      Partner Inclusions:
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {tier.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2">
                          <span className="css-icon-check text-cyan-400 shrink-0 mt-0.5"></span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <Link
                    href="/demo"
                    className={`block w-full py-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider transition ${
                      tier.highlight
                        ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20"
                        : "bg-slate-800 hover:bg-slate-700 text-white"
                    }`}
                  >
                    {tier.ctaText} &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
