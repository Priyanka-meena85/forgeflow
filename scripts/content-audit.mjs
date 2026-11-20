/**
 * ForgeFlow Comprehensive Content & API Deep Audit
 * Tests all pages for 200 OK + key content, and all real API endpoints with auth.
 */

const baseUrl = "http://localhost:8080";

const pageTests = [
  { url: "/", checks: ["ForgeFlow", "Industrial Content", "Platform Features", "Start a free pilot"] },
  { url: "/pricing", checks: ["Industrial Pilot", "199", "Growth OEM", "479", "Enterprise Global", "Monthly", "Annual", "ROI"] },
  { url: "/features", checks: ["AEO", "Schema", "QA", "CMS", "ForgeFlow"] },
  { url: "/industries", checks: ["HVAC", "Food", "Automotive", "Precision CNC", "Plastics", "Hydraulics", "Mining"] },
  { url: "/industries/hvac-commercial-refrigeration", checks: ["HVAC", "ASHRAE", "Refrigeration", "Industries Directory"] },
  { url: "/industries/food-beverage-manufacturing", checks: ["Food", "Beverage", "Sanitary", "CIP"] },
  { url: "/industries/automotive-tier1-stamping", checks: ["Automotive", "Stamping", "IATF"] },
  { url: "/industries/precision-cnc-tooling", checks: ["CNC", "precision", "spindle"] },
  { url: "/industries/plastics-polymer-extrusion", checks: ["Plastics", "Extrusion", "ASTM"] },
  { url: "/industries/industrial-hydraulics-fluid", checks: ["Hydraulics", "Fluid", "ISO 4406"] },
  { url: "/industries/heavy-mining-materials", checks: ["Mining", "MSHA", "materials"] },
  { url: "/integrations", checks: ["WordPress", "Webflow", "Shopify", "Contentful", "REST API"] },
];

console.log("\n=================================================================");
console.log("     FORGEFLOW ENTERPRISE SAAS: FULL CONTENT & API DEEP AUDIT");
console.log(`     Target: ${baseUrl}`);
console.log("=================================================================\n");

let pass = 0; let fail = 0;
const failures = [];

// 1. PAGE CONTENT TESTS
console.log("--- 1. PAGE CONTENT TESTS ---\n");
for (const t of pageTests) {
  try {
    const res = await fetch(baseUrl + t.url);
    const html = await res.text();
    const missing = t.checks.filter(c => !html.includes(c));
    const hasRuntimeErr = html.includes("Application error") || html.includes("Unhandled Runtime Error");
    const ok = res.status === 200 && missing.length === 0 && !hasRuntimeErr;
    if (ok) pass++; else { fail++; failures.push({ url: t.url, missing, status: res.status }); }
    console.log(`[${ok ? "PASS" : "FAIL"}] ${t.url} (${res.status}, ${html.length} bytes)${missing.length ? " | MISSING: " + missing.join(", ") : ""}${hasRuntimeErr ? " | RUNTIME ERROR" : ""}`);
  } catch(e) {
    fail++;
    failures.push({ url: t.url, error: e.message });
    console.log(`[FAIL] ${t.url} | ERROR: ${e.message}`);
  }
}

// 2. AUTH LOGIN
console.log("\n--- 2. AUTH & SESSION TESTS ---\n");
let session = "";
try {
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@accudrive.io", password: "ForgeFlow2026!" }),
  });
  const cookie = loginRes.headers.get("set-cookie");
  if (cookie) session = cookie.split(";")[0];
  const ok = loginRes.status === 200 && Boolean(session);
  if (ok) pass++; else fail++;
  console.log(`[${ok ? "PASS" : "FAIL"}] POST /api/auth/login | ${loginRes.status} | Cookie: ${Boolean(session)}`);
} catch(e) {
  fail++;
  console.log(`[FAIL] POST /api/auth/login | ${e.message}`);
}

// Unauthenticated test - should block
try {
  const res = await fetch(`${baseUrl}/api/team`);
  const ok = res.status === 401 || res.status === 403;
  if (ok) pass++; else fail++;
  console.log(`[${ok ? "PASS" : "FAIL"}] GET /api/team (unauth should 401/403) | ${res.status}`);
} catch(e) { fail++; console.log(`[FAIL] /api/team unauth | ${e.message}`); }

// 3. AUTHENTICATED API TESTS
console.log("\n--- 3. AUTHENTICATED API TESTS ---\n");
const authHeaders = session ? { "Cookie": session, "Content-Type": "application/json" } : { "Content-Type": "application/json" };

const apiTests = [
  { label: "GET /api/health", url: "/api/health", expect: 200 },
  { label: "GET /api/workspace (admin)", url: "/api/workspace", expect: 200 },
  { label: "GET /api/team (admin)", url: "/api/team", expect: 200 },
  { label: "GET /api/drafts", url: "/api/drafts", expect: 200 },
  { label: "GET /api/aeo/tracked-queries", url: "/api/aeo/tracked-queries", expect: 200 },
  { label: "GET /api/aeo/share-of-voice", url: "/api/aeo/share-of-voice", expect: 200 },
  { label: "GET /api/aeo/scan", url: "/api/aeo/scan", expect: [200, 404, 405] },
  { label: "GET /api/cms", url: "/api/cms", expect: 200 },
  { label: "GET /api/leads", url: "/api/leads", expect: 200 },
  { label: "GET /api/reports/executive-roi", url: "/api/reports/executive-roi", expect: 200 },
  { label: "GET /api/storage/presigned", url: "/api/storage/presigned", expect: [200, 400, 405] },
  { label: "GET /api/integrations/gsc", url: "/api/integrations/gsc", expect: 200 },
  { label: "GET /api/billing", url: "/api/billing", expect: 200 },
  { label: "GET /api/notifications/webhook", url: "/api/notifications/webhook", expect: [200, 405] },
  { label: "GET /api/crm", url: "/api/crm", expect: 200 },
  { label: "GET /api/distributor", url: "/api/distributor", expect: 200 },
  { label: "GET /api/domains", url: "/api/domains", expect: 200 },
  { label: "GET /api/jobs/queue", url: "/api/jobs/queue", expect: 200 },
  { label: "GET /api/reviewers", url: "/api/reviewers", expect: 200 },
  { label: "GET /api/taxonomy/ingest-spec", url: "/api/taxonomy/ingest-spec", expect: [200, 405] },
  { label: "GET /api/widgets", url: "/api/widgets", expect: 200 },
  { label: "GET /api/audit-logs", url: "/api/audit-logs", expect: 200 },
  { label: "GET /api/scim/v2/ServiceProviderConfig", url: "/api/scim/v2/ServiceProviderConfig", expect: 200 },
  { label: "GET /api/v1/generate (dev REST API)", url: "/api/v1/generate", expect: [200, 400, 405] },
];

for (const t of apiTests) {
  try {
    const res = await fetch(`${baseUrl}${t.url}`, { headers: authHeaders });
    const expected = Array.isArray(t.expect) ? t.expect : [t.expect];
    const ok = expected.includes(res.status);
    if (ok) pass++; else fail++;
    console.log(`[${ok ? "PASS" : "FAIL"}] ${t.label} | ${res.status}`);
  } catch(e) {
    fail++;
    console.log(`[FAIL] ${t.label} | ERROR: ${e.message}`);
  }
}

// 4. AI SIMULATE AEO
console.log("\n--- 4. CORE AI FEATURES ---\n");
try {
  const res = await fetch(`${baseUrl}/api/ai/simulate-aeo`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ query: "HVAC RTU high head pressure failure causes", engine: "google_sge", industrySlug: "hvac-commercial-refrigeration" }),
  });
  const ok = res.status === 200;
  if (ok) pass++; else fail++;
  const text = await res.text();
  console.log(`[${ok ? "PASS" : "FAIL"}] POST /api/ai/simulate-aeo | ${res.status} | len: ${text.length}`);
} catch(e) { fail++; console.log(`[FAIL] /api/ai/simulate-aeo | ${e.message}`); }

try {
  const res = await fetch(`${baseUrl}/api/tools/localize-standard`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ value: "206.8 bar", from: "imperial", to: "metric", alloy: "4140 steel" }),
  });
  const ok = res.status === 200;
  if (ok) pass++; else fail++;
  console.log(`[${ok ? "PASS" : "FAIL"}] POST /api/tools/localize-standard | ${res.status}`);
} catch(e) { fail++; console.log(`[FAIL] /api/tools/localize-standard | ${e.message}`); }

// FINAL SCORECARD
const total = pass + fail;
const score = Math.round((pass / total) * 100);
console.log("\n=================================================================");
console.log(`     FINAL SCORECARD: ${pass} PASS | ${fail} FAIL | ${total} TESTS`);
console.log(`     SCORE: ${score}% ${score === 100 ? "✓ FULLY CERTIFIED" : score >= 90 ? "✓ PRODUCTION READY" : score >= 75 ? "⚠ MOSTLY PASSING" : "✗ NEEDS FIXES"}`);
if (failures.length > 0) {
  console.log("\n     PAGE FAILURES:");
  failures.forEach(f => console.log(`       - ${f.url}: ${f.missing ? "Missing: " + f.missing.join(", ") : f.error}`));
}
console.log("=================================================================\n");
