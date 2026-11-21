import { Metadata } from "next";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";

export const metadata: Metadata = {
  title: "Trust Center & Security Architecture | ForgeFlow",
  description: "Enterprise security architecture, SOC 2 Type II compliance, ISO 27001 data protection, and ITAR zero-retention CAD policies.",
};

export default function TrustCenterPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <PublicNavbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="space-y-4 text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
            ENTERPRISE TRUST &amp; COMPLIANCE PORTAL
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Security, Compliance &amp; CAD Data Sovereignty
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            ForgeFlow is architected from the ground up for industrial OEMs, aerospace suppliers, and mission-critical engineering manufacturers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-950 flex items-center justify-center text-indigo-400 font-bold font-mono text-sm border border-indigo-800">
              SOC2
            </div>
            <h3 className="text-base font-bold text-white">SOC 2 Type II Aligned</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Audited security controls covering Security, Availability, and Confidentiality. Encrypted in-transit via TLS 1.3 and at-rest via AES-256.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 flex items-center justify-center text-emerald-400 font-bold font-mono text-sm border border-emerald-800">
              ITAR
            </div>
            <h3 className="text-base font-bold text-white">ITAR CAD Zero-Retention</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Proprietary 3D geometry vertices and toolpaths are purged from RAM immediately upon metadata extraction. Zero raw geometry persists in storage.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-950 flex items-center justify-center text-purple-400 font-bold font-mono text-sm border border-purple-800">
              ISO
            </div>
            <h3 className="text-base font-bold text-white">ISO 27001 Controls</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cryptographic chain-of-custody tracking with SHA-256 hashing for all technical drawing inputs and Schema.org export bundles.
            </p>
          </div>
        </div>

        {/* Security Architecture Deep Dive */}
        <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-8 text-sm">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">CAD IP Protection Guarantee</h2>
            <p className="text-slate-400 leading-relaxed text-xs sm:text-sm">
              We understand that manufacturing tolerances and CAD geometry represent your company’s core intellectual property. ForgeFlow employs an ephemeral parsing sandbox:
            </p>
            <ul className="mt-3 space-y-2 text-xs text-slate-300 list-disc list-inside">
              <li>Raw STEP/IGES assembly models are processed solely in volatile memory and de-referenced within 60 seconds.</li>
              <li>Only non-proprietary public metadata (ASME Y14.5 tolerance limits, ASTM/DIN material callouts, and Schema.org semantic nodes) are stored.</li>
              <li>Every sanitization action generates a verifiable cryptographic SHA-256 audit certificate.</li>
            </ul>
          </div>

          <div className="border-t border-slate-800 pt-6">
            <h2 className="text-xl font-bold text-white mb-2">Verified Enterprise Subprocessors</h2>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs border border-slate-800 rounded-lg">
                <thead className="bg-slate-900 text-slate-400 font-mono uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Subprocessor</th>
                    <th className="py-2.5 px-4">Purpose</th>
                    <th className="py-2.5 px-4">Data Location</th>
                    <th className="py-2.5 px-4">Certifications</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/40 text-slate-300">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Cloudflare, Inc.</td>
                    <td className="py-3 px-4">DDoS Protection, WAF &amp; Global CDN</td>
                    <td className="py-3 px-4">United States / Global Edge</td>
                    <td className="py-3 px-4 font-mono text-emerald-400">SOC 2 Type II, ISO 27001</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Supabase / AWS</td>
                    <td className="py-3 px-4">Managed PostgreSQL with PgBouncer Pooling</td>
                    <td className="py-3 px-4">US-East (N. Virginia)</td>
                    <td className="py-3 px-4 font-mono text-emerald-400">SOC 2 Type II, HIPAA, ISO 27001</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Stripe, Inc.</td>
                    <td className="py-3 px-4">Payment Processing &amp; Net-30 Invoicing</td>
                    <td className="py-3 px-4">United States</td>
                    <td className="py-3 px-4 font-mono text-emerald-400">PCI-DSS Level 1, SOC 1/2</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Resend Inc.</td>
                    <td className="py-3 px-4">Transactional Notification Transport</td>
                    <td className="py-3 px-4">United States</td>
                    <td className="py-3 px-4 font-mono text-emerald-400">SOC 2 Type II</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Need a Signed DPA or SOC 2 Report?</h3>
              <p className="text-xs text-slate-400">Our security team executes custom Data Processing Agreements (DPA) for Enterprise tier accounts.</p>
            </div>
            <a
              href="mailto:security@forgeflow.ai"
              className="px-5 py-2.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition whitespace-nowrap"
            >
              Contact Security Team
            </a>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
