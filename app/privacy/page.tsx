import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-humanist">
      <PublicNavbar />

      <main className="flex-1 py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full">
              Legal &amp; Compliance
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mt-4">Privacy Policy</h1>
            <p className="text-xs text-slate-400 font-mono mt-2">
              Last updated: November 20, 2026 • Effective Date: January 1, 2026
            </p>
          </div>

          <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-8">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">1. Introduction</h2>
              <p>
                ForgeFlow Systems Inc. (&quot;ForgeFlow&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) provides a multi-tenant Industrial Answer Engine Optimization (AEO) and Search Engine Optimization (SEO) software platform. We respect the proprietary nature of industrial engineering data and are committed to protecting your organizational and personal data in accordance with global regulations, including the European General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA/CPRA).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">2. Industrial Data We Collect</h2>
              <p>When using our software platform, we may collect the following classes of data:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                <li><strong className="text-slate-200">Account Credentials:</strong> Work email, user full name, cryptographic password hash, organization identifier, and SCIM/SAML SSO tokens.</li>
                <li><strong className="text-slate-200">Industrial Catalog Metadata:</strong> Part numbers, tolerance boundaries, alloy designations (e.g. AISI 4140, DIN EN 10083), failure mode taxonomies, and technical specs uploaded for syndication.</li>
                <li><strong className="text-slate-200">CAD Models &amp; STEP Geometry:</strong> 3D CAD files uploaded for schema parsing are processed ephemerally in isolated secure memory spaces and stored in customer-isolated Cloudflare R2 buckets.</li>
                <li><strong className="text-slate-200">Telemetry &amp; Usage Logs:</strong> Query latency, AEO answer engine crawl frequencies, API invocation rates, and audit log entries for enterprise governance.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">3. Zero Cross-Organization Data Sharing</h2>
              <p>
                ForgeFlow strictly enforces PostgreSQL Row-Level Security (RLS) across every organization workspace. Your technical whitepapers, proprietary tooling tolerances, and engineering CAD data are never pooled, never used to train public LLM weights, and never accessible by other tenants.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">4. Cookies &amp; Tracking Technologies</h2>
              <p>
                We use strictly necessary session cookies for user authentication, CSRF mitigation, and workspace state preservation. Optional analytics cookies are only activated when explicit consent is provided via our Cookie Preference Center. You can adjust your cookie settings at any time.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">5. Third-Party Service Providers</h2>
              <p>We work with vetted enterprise infrastructure providers who maintain SOC 2 Type II or ISO 27001 certifications:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                <li><strong className="text-slate-200">Stripe Payments:</strong> Secure PCI-DSS Level 1 subscription billing and invoicing processing.</li>
                <li><strong className="text-slate-200">Cloudflare R2:</strong> Encrypted object storage with customer-managed encryption key support.</li>
                <li><strong className="text-slate-200">Answer Engine APIs:</strong> Automated citation benchmarking against Perplexity and OpenAI answer interfaces using anonymized queries.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">6. Your Rights (GDPR &amp; CCPA)</h2>
              <p>
                As an enterprise user or authorized representative, you have the right to request access to your stored personal and catalog records, request data portability, rectify inaccuracies, or exercise your Right to Erasure (&quot;Right to be Forgotten&quot;) via our compliance API or privacy desk.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">7. Contact Information</h2>
              <p>
                For inquiries regarding this Privacy Policy or to request a signed Data Processing Agreement (DPA) with Standard Contractual Clauses (SCCs), contact our Data Protection Officer:
              </p>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono text-cyan-400">
                ForgeFlow Systems Inc. — Data Protection Office<br />
                Email: privacy@forgeflow.ai | security@forgeflow.ai
              </div>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
