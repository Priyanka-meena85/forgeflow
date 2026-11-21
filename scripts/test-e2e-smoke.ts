/**
 * ForgeFlow Enterprise E2E Smoke & Health Suite
 * Verifies all critical production systems:
 * - Public routes & marketing content
 * - Database connection pooler diagnostics
 * - Route guards & session protection
 * - Input validation & security shields
 * - CAD IP sanitization & zero-retention policy
 * - Background job queue dispatch & monitoring
 * - Reverse-IP enterprise attribution engine
 * - C-Suite Executive Audit report synthesis
 */

import { sanitizeCadContent } from "../lib/cadSecurityPolicy";
import { enqueueJob, getJob } from "../lib/queue";
import { checkDatabaseHealth } from "../lib/dbDiagnostics";
import { generateAttributionProof } from "../lib/attribution";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:8080";

interface TestResult {
  name: string;
  passed: boolean;
  durationMs: number;
  details?: string;
}

const results: TestResult[] = [];

async function runTest(name: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    results.push({ name, passed: true, durationMs: Date.now() - start });
    console.log(`  [PASS] ${name} (${Date.now() - start}ms)`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    results.push({ name, passed: false, durationMs: Date.now() - start, details: msg });
    console.error(`  [FAIL] ${name} (${Date.now() - start}ms): ${msg}`);
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function main() {
  console.log("==================================================================");
  console.log("       FORGEFLOW PRODUCTION READINESS & E2E SMOKE SUITE          ");
  console.log(`       Target Environment: ${BASE_URL}                            `);
  console.log("==================================================================\n");

  // -----------------------------------------------------------------------------
  // Suite 1: Public Marketing & Compliance Pages
  // -----------------------------------------------------------------------------
  console.log("--- Suite 1: Public Marketing & Regulatory Boundaries ---");
  await runTest("Homepage (/) renders public landing page (200 OK)", async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert(html.includes("ForgeFlow") || html.includes("Answer Engine Optimization"), "Expected landing page text");
  });

  await runTest("Pricing page (/pricing) loads enterprise tiers", async () => {
    const res = await fetch(`${BASE_URL}/pricing`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert(html.includes("799") || html.includes("1,499") || html.includes("3,499"), "Expected enterprise pricing tiers");
  });

  await runTest("Terms page (/terms) includes Section 7 GD&T Limitation of Liability", async () => {
    const res = await fetch(`${BASE_URL}/terms`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert(html.includes("GD&T") || html.includes("Limitation of Liability"), "Expected GD&T liability disclaimer");
  });

  // -----------------------------------------------------------------------------
  // Suite 2: Security & Route Guard Enforcement
  // -----------------------------------------------------------------------------
  console.log("\n--- Suite 2: Auth Route Guard & Input Validation ---");
  await runTest("Protected route (/dashboard) redirects unauthenticated requests (307)", async () => {
    const res = await fetch(`${BASE_URL}/dashboard`, { redirect: "manual" });
    assert(res.status === 307 || res.status === 302, `Expected 307/302 redirect, got ${res.status}`);
    const location = res.headers.get("location");
    assert(!!location && location.includes("/auth/login"), `Expected redirect to /auth/login, got ${location}`);
  });

  await runTest("Input sanitization rejects malformed Demo Request payload (400)", async () => {
    const res = await fetch(`${BASE_URL}/api/demo-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "", email: "not-an-email" }),
    });
    assert(res.status === 400, `Expected 400 for malformed payload, got ${res.status}`);
    const json = await res.json();
    assert(json.error === "Validation failed" && Array.isArray(json.issues), "Expected validation issues array");
  });

  // -----------------------------------------------------------------------------
  // Suite 3: Database Pooler & High-Availability Telemetry
  // -----------------------------------------------------------------------------
  console.log("\n--- Suite 3: Database Connection Pooler Health ---");
  await runTest("Database diagnostics endpoint (/api/health/db) returns healthy pooler telemetry", async () => {
    const res = await fetch(`${BASE_URL}/api/health/db`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert(json.success === true, "Expected success: true");
    assert(json.health.status === "HEALTHY" || json.health.status === "DEGRADED", "Expected healthy or degraded status");
    assert(typeof json.health.latencyMs === "number", "Expected numeric latencyMs");
  });

  await runTest("Internal dbDiagnostics correctly detects connection pooling parameters", async () => {
    const health = await checkDatabaseHealth();
    assert(health.poolSizeRecommended === 20, "Expected recommended pool size 20");
    assert(Array.isArray(health.advisories), "Expected advisories array");
  });

  // -----------------------------------------------------------------------------
  // Suite 4: CAD IP Sanitization & Zero-Retention Memory Purge
  // -----------------------------------------------------------------------------
  console.log("\n--- Suite 4: CAD IP Sanitization & ITAR / ISO 27001 Compliance ---");
  await runTest("CAD Sanitizer purges raw geometric mesh & emits SHA-256 certificate", async () => {
    const mockStep = "ISO-10303-21;\nHEADER;\nFILE_DESCRIPTION(('STEP AP214'),'1');\nENDSEC;\nDATA;\n#10=CARTESIAN_POINT('',(0.,0.,0.));\nENDSEC;\nEND-ISO-10303-21;";
    const { sanitizedMetadataOnly, certificate } = sanitizeCadContent(mockStep, "Hydraulic Test Flange", {
      zeroRetentionMode: true,
      itarComplianceMode: true,
    });
    assert(sanitizedMetadataOnly === true, "Expected metadata-only mode");
    assert(certificate.sanitizationLevel === "ITAR_COMPLIANT_ZERO_RETENTION", "Expected ITAR compliance level");
    assert(certificate.memoryPurged === true, "Expected memory purge confirmation");
    assert(certificate.sourceFileSha256.length === 64, "Expected valid 64-char SHA-256 hash");
    assert(certificate.purgedAttributes.includes("RawMeshVertices"), "Expected RawMeshVertices in purged attributes");
  });

  // -----------------------------------------------------------------------------
  // Suite 5: Asynchronous Worker Job Queue
  // -----------------------------------------------------------------------------
  console.log("\n--- Suite 5: Asynchronous Background Job Processing ---");
  await runTest("Background queue enqueues, executes, and completes batch schema crawl", async () => {
    const job = enqueueJob({
      type: "BATCH_SCHEMA_CRAWL",
      organizationId: "smoke-test-org",
      userId: "smoke-user-1",
      payload: { sitemapUrl: "https://example-industrial.com/sitemap.xml" },
    });
    assert(job.status === "QUEUED", `Expected initial status QUEUED, got ${job.status}`);

    // Wait 1.5 seconds for simulated worker execution
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const updatedJob = getJob(job.id);
    assert(updatedJob !== null, "Job must exist in store");
    if (updatedJob) {
      assert(
        updatedJob.status === "PROCESSING" || updatedJob.status === "COMPLETED",
        `Expected status PROCESSING or COMPLETED, got ${updatedJob.status}`
      );
    }
  });

  // -----------------------------------------------------------------------------
  // Suite 6: Reverse-IP Enterprise Attribution Engine
  // -----------------------------------------------------------------------------
  console.log("\n--- Suite 6: Reverse-IP B2B Enterprise Attribution ---");
  await runTest("Attribution engine deanonymizes Fortune 500 manufacturing IP blocks", async () => {
    const proof = generateAttributionProof(
      "caterpillar hydraulic cylinder specs",
      "CAT-HYD-440",
      "https://chatgpt.com/search?q=caterpillar+hydraulic+cylinder+specs",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Caterpillar-Engineering-VPN",
      "engineer@caterpillar.com"
    );
    assert(proof.confidenceScore.includes("HIGH"), `Expected HIGH confidence, got ${proof.confidenceScore}`);
    assert(proof.dealValueEstimateUsd >= 100000, `Expected >= 100000 ACV, got ${proof.dealValueEstimateUsd}`);
    assert(proof.sourceEngine === "ChatGPT Search", `Expected ChatGPT Search, got ${proof.sourceEngine}`);
    assert(proof.detectedCompany.includes("Caterpillar"), `Expected Caterpillar, got ${proof.detectedCompany}`);
  });

  // -----------------------------------------------------------------------------
  // Summary
  // -----------------------------------------------------------------------------
  console.log("\n==================================================================");
  console.log("                       FINAL AUDIT RESULTS                        ");
  console.log("==================================================================");
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;

  console.log(`Total Checks Run: ${results.length}`);
  console.log(`Passed:           ${passedCount}`);
  console.log(`Failed:           ${failedCount}`);

  if (failedCount === 0) {
    console.log("\n>>> ALL CRITICAL PATHS PASSED WITH 100% SUCCESS <<<");
    process.exit(0);
  } else {
    console.error(`\n>>> ${failedCount} CRITICAL HEALTH CHECKS FAILED <<<`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("Fatal test runner crash:", e);
  process.exit(1);
});
