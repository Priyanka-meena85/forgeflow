import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-humanist">
      <PublicNavbar />

      <main className="flex-1 py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full">
              Legal Agreement
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mt-4">Terms of Service</h1>
            <p className="text-xs text-slate-400 font-mono mt-2">
              Last updated: November 20, 2026 • Applicable to all ForgeFlow commercial tiers
            </p>
          </div>

          <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-8">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">1. Subscription Agreement</h2>
              <p>
                By creating an account, initiating a pilot, or executing an order form with ForgeFlow Systems Inc., you (&quot;Customer&quot; or &quot;Subscriber&quot;) agree to be bound by these Terms of Service. If you are accepting on behalf of an enterprise entity, you represent and warrant that you possess full corporate authority to bind such entity.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">2. Industrial Intellectual Property &amp; Ownership</h2>
              <p>
                <strong className="text-white">Customer Data:</strong> Subscriber retains 100% unrestricted intellectual property ownership of all CAD files, STEP assemblies, engineering tolerances, brand assets, and technical documentation uploaded to ForgeFlow.
              </p>
              <p>
                <strong className="text-white">Generated AEO Schema &amp; Whitepapers:</strong> All output schema graphs, TechArticle syndications, and localized DIN/JIS documentation produced by the ForgeFlow engine are work-for-hire assigned exclusively to Customer upon creation.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">3. Acceptable Use Policy (AUP)</h2>
              <p>Customer agrees not to:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                <li>Reverse engineer or decompile the CAD schema parsing algorithms or answer engine attribution heuristics.</li>
                <li>Utilize automated crawlers to harvest cross-organization taxonomy data or benchmark metrics without explicit authorization.</li>
                <li>Upload ITAR-controlled, defense-restricted, or prohibited dual-use military CAD assemblies to commercial cloud environments without pre-arranged GovCloud isolation.</li>
                <li>Attempt to bypass multi-tenant PostgreSQL Row-Level Security checks or rate limits.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">4. Service Level Agreement (SLA) &amp; Uptime</h2>
              <p>
                ForgeFlow commits to a 99.9% monthly uptime SLA for Enterprise and OEM tier subscribers. Service credits are automatically calculated and credited toward subsequent billing cycles in the event of unscheduled downtime exceeding threshold limits.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">5. Billing, Invoicing &amp; Cancellation</h2>
              <p>
                Subscription fees are billed in advance on an annual or monthly cadence via Stripe or automated ACH bank transfer. Subscriptions renew automatically unless cancelled at least thirty (30) days prior to the expiration of the active term.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">6. Limitation of Liability</h2>
              <p>
                In no event shall either party be liable for any indirect, incidental, punitive, or consequential damages resulting from lost profits, engineering downtime, or third-party search engine indexing updates.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">7. Engineering GD&amp;T Tolerances, Product Safety &amp; Disclaimers</h2>
              <p>
                <strong className="text-white">Informational and Marketing Syndication Use Only:</strong> ForgeFlow provides software for marketing schema graph generation, answer engine syndication, and search metadata organization. ForgeFlow is not a certified computer-aided engineering (CAE) analysis tool, finite element analysis (FEA) solver, or life-safety certification platform.
              </p>
              <p>
                <strong className="text-white">Customer Verification Requirement:</strong> Customer’s certified professional engineers (PE), quality assurance managers, or metallurgists retain sole and non-delegable legal responsibility for verifying all mechanical tolerance boundaries, yield strengths, pressure ratings, DIN/JIS alloy crosswalk equivalences, and safety factors before using such data in manufacturing, stamping, CNC machining, or publishing publicly.
              </p>
              <p>
                <strong className="text-white">Equipment &amp; Bodily Harm Disclaimer:</strong> To the maximum extent permitted by applicable law, ForgeFlow expressly disclaims all liability for physical damage to industrial equipment, tooling breakage, plant assembly line stoppages, product recalls, or personal injury resulting from unverified technical data or AI-assisted content revisions.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">8. ITAR, EAR &amp; Military Defense Export Control Compliance</h2>
              <p>
                <strong className="text-white">Strict Non-Military Data Policy:</strong> Customer expressly covenants and warrants that it shall not upload, ingest, or process any technical data, CAD models, drawings, or engineering specifications that are controlled under the International Traffic in Arms Regulations (ITAR, 22 CFR 120-130) or the Export Administration Regulations (EAR, 15 CFR 730-774) with a restricted Export Control Classification Number (ECCN) without an executed Enterprise Air-Gapped Dedicated Infrastructure Addendum.
              </p>
              <p>
                <strong className="text-white">Ephemeral Processing &amp; Zero Retention:</strong> Customer acknowledges that ForgeFlow operates under a cryptographic zero-retention policy for 3D CAD/STEP geometries, wherein raw vertex and surface coordinate definitions are sanitized and purged from volatile RAM upon generation of public Schema.org semantic metadata.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">9. Governing Law &amp; Jurisdiction</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to conflict of law principles.
              </p>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
