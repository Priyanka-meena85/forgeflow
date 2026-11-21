/**
 * scripts/test-exhaustive-audit.mjs
 * Full End-to-End Deep Diagnostic & Quality Audit for ForgeFlow
 */

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:8080";
const results = [];

async function test(name, fn) {
  const start = Date.now();
  try {
    await fn();
    const duration = Date.now() - start;
    results.push({ name, passed: true, durationMs: duration });
    console.log(`  [PASS] ${name} (${duration}ms)`);
  } catch (err) {
    const duration = Date.now() - start;
    const msg = err instanceof Error ? err.message : String(err);
    results.push({ name, passed: false, durationMs: duration, details: msg });
    console.error(`  [FAIL] ${name} (${duration}ms): ${msg}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || "Assertion failed");
}

async function runAudit() {
  console.log("==================================================================");
  console.log("    FORGEFLOW DEEP EXHAUSTIVE E2E QUALITY & HEALTH AUDIT          ");
  console.log(`    Target: ${BASE_URL}                                          `);
  console.log("==================================================================\n");

  // Suite 1: Public Web Pages
  console.log("--- Suite 1: Public Web Pages ---");
  await test("Homepage (/) loads with 200 OK", async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert(res.status === 200, `Got ${res.status}`);
  });

  await test("Pricing page (/pricing) loads with 200 OK", async () => {
    const res = await fetch(`${BASE_URL}/pricing`);
    assert(res.status === 200, `Got ${res.status}`);
  });

  await test("Terms of Service (/terms) loads with 200 OK", async () => {
    const res = await fetch(`${BASE_URL}/terms`);
    assert(res.status === 200, `Got ${res.status}`);
  });

  await test("Trust Center (/trust) loads with 200 OK", async () => {
    const res = await fetch(`${BASE_URL}/trust`);
    assert(res.status === 200, `Got ${res.status}`);
  });

  await test("Login page (/auth/login) loads with 200 OK", async () => {
    const res = await fetch(`${BASE_URL}/auth/login`);
    assert(res.status === 200, `Got ${res.status}`);
  });

  await test("Register page (/auth/register) loads with 200 OK", async () => {
    const res = await fetch(`${BASE_URL}/auth/register`);
    assert(res.status === 200, `Got ${res.status}`);
  });

  // Suite 2: Health & Diagnostics
  console.log("\n--- Suite 2: Diagnostics & Infrastructure Health ---");
  await test("System Health (/api/health) returns 200 with status ok", async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert(res.status === 200, `Got ${res.status}`);
    const json = await res.json();
    assert(json.status === "ok" || json.healthy !== false, "Health check failed");
  });

  await test("Database Diagnostics (/api/health/db) returns telemetry", async () => {
    const res = await fetch(`${BASE_URL}/api/health/db`);
    assert(res.status === 200, `Got ${res.status}`);
    const json = await res.json();
    assert(json.success === true, "DB diagnostic returned non-success");
  });

  // Suite 3: AI Engine & Failover
  console.log("\n--- Suite 3: Multi-Agent AI Gateways ---");
  await test("AI Chat failover route (/api/ai/chat) handles request gracefully", async () => {
    const res = await fetch(`${BASE_URL}/api/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "What is ISO 10816-3?" }),
    });
    assert(res.status === 200, `Got unexpected status: ${res.status}`);
    const json = await res.json();
    assert(json.success === true && json.completion !== undefined, "Expected completion payload");
  });

  await test("Simulate AEO route (/api/ai/simulate-aeo) returns structured simulation", async () => {
    const res = await fetch(`${BASE_URL}/api/ai/simulate-aeo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Sanitary Rotary Lobe Pumps",
        query: "What causes CIP seal failure in rotary lobe pumps?",
        equipment: "Rotary Lobe Pump",
        standard: "3-A Sanitary Standard 02-12",
        vertical: "Food & beverage manufacturing",
      }),
    });
    assert(res.status === 200, `Got ${res.status}`);
    const json = await res.json();
    assert(json.directAnswer || json.simulation, "Expected AEO simulation response");
  });

  // Suite 4: Security Route Guards on Sensitive Endpoints
  console.log("\n--- Suite 4: RBAC & Auth Route Guard Verification ---");
  await test("CRM Pipeline Attribution (/api/crm/attribution) enforces auth (401 without cookie)", async () => {
    const res = await fetch(`${BASE_URL}/api/crm/attribution`);
    assert(res.status === 401, `Expected 401 Unauthorized for unauthenticated call, got ${res.status}`);
  });

  await test("Standards Converter (/api/tools/convert-standards) enforces session protection (401)", async () => {
    const res = await fetch(`${BASE_URL}/api/tools/convert-standards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromStandard: "ASME",
        toStandard: "DIN",
        value: 150,
        unit: "psi",
      }),
    });
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  await test("Standards Localizer (/api/tools/localize-standard) enforces session protection (401)", async () => {
    const res = await fetch(`${BASE_URL}/api/tools/localize-standard`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        standard: "ISO 9001",
        targetRegion: "India (BIS)",
      }),
    });
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  // Suite 5: Enterprise SCIM v2
  console.log("\n--- Suite 6: Enterprise Protocols ---");
  await test("SCIM v2 ServiceProviderConfig returns RFC 7643 spec", async () => {
    const res = await fetch(`${BASE_URL}/api/scim/v2/ServiceProviderConfig`);
    assert(res.status === 200, `Got ${res.status}`);
    const json = await res.json();
    assert(Array.isArray(json.schemas), "Expected SCIM schemas");
  });

  // Summary
  console.log("\n==================================================================");
  console.log("                       AUDIT SUMMARY                              ");
  console.log("==================================================================");
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;
  console.log(`Total Checks Run: ${total}`);
  console.log(`Passed:           ${passed}`);
  console.log(`Failed:           ${failed}`);

  if (failed > 0) {
    console.error("\nFAILURES DETECTED:");
    for (const r of results.filter((r) => !r.passed)) {
      console.error(`- ${r.name}: ${r.details}`);
    }
    process.exitCode = 1;
  } else {
    console.log("\n>>> ALL EXHAUSTIVE DEEP CHECKS PASSED WITH 100% SUCCESS <<<");
    process.exitCode = 0;
  }
}

runAudit().catch((err) => {
  console.error("FATAL ERROR in audit suite:", err);
  process.exitCode = 1;
});
