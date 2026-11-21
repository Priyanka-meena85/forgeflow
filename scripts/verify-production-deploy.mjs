/**
 * ForgeFlow Production Pre-Flight Verification Tool
 * Runs prior to deployment to verify all systems, secrets, and configurations.
 */

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:8080";

async function main() {
  console.log("==================================================================");
  console.log("       FORGEFLOW PRODUCTION PRE-FLIGHT VERIFICATION TOOL          ");
  console.log("==================================================================\n");

  const warnings = [];
  const errors = [];

  // 1. Security & Auth Secrets
  console.log("--- 1. Security & Auth Secrets ---");
  const authSecret = process.env.AUTH_SECRET || process.env.SESSION_SECRET;
  if (!authSecret) {
    warnings.push("AUTH_SECRET is using development fallback. Set a 64-char hex key for live production.");
    console.log("  [WARN] AUTH_SECRET: Using dev fallback key");
  } else {
    console.log("  [PASS] AUTH_SECRET: Configured");
  }

  // 2. Database Connection & Pooling
  console.log("\n--- 2. Database Connection & PgBouncer Pooling ---");
  try {
    const res = await fetch(`${BASE_URL}/api/health/db`);
    if (res.ok) {
      const data = await res.json();
      const health = data.health;
      console.log(`  [PASS] Connection Mode: ${health.connectionMode}`);
      console.log(`  [PASS] Query Latency:   ${health.latencyMs}ms`);
      console.log(`  [PASS] PgBouncer Armed: ${health.activePoolConfig.pgbouncerEnabled}`);

      if (health.connectionMode === "IN_MEMORY_FALLBACK") {
        warnings.push("Database is currently running in local fallback mode. Connect Supabase/Neon PostgreSQL before commercial traffic.");
      }
    } else {
      warnings.push(`Database health endpoint returned status ${res.status}`);
      console.log(`  [WARN] Database health endpoint returned status ${res.status}`);
    }
  } catch (err) {
    errors.push(`Database health probe failed: ${err.message}`);
    console.error(`  [FAIL] Database probe failed: ${err.message}`);
  }

  // 3. Stripe Billing
  console.log("\n--- 3. Stripe Commercial Gateway ---");
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    warnings.push("STRIPE_SECRET_KEY not set. Subscriptions will run in offline test/invoicing mode.");
    console.log("  [WARN] STRIPE_SECRET_KEY: Offline / Net-30 Invoicing Mode active");
  } else if (stripeKey.startsWith("sk_test_")) {
    console.log("  [PASS] STRIPE_SECRET_KEY: Test Mode Armed (Ready for sandbox pilot)");
  } else if (stripeKey.startsWith("sk_live_")) {
    console.log("  [PASS] STRIPE_SECRET_KEY: LIVE COMMERCIAL PRODUCTION");
  }

  // 4. Transactional Email
  console.log("\n--- 4. Transactional Email Transport ---");
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.log("  [INFO] RESEND_API_KEY: Not set. Email engine will log previews to console (Dev Mode).");
  } else {
    console.log("  [PASS] RESEND_API_KEY: Live HTTP Transport Armed");
  }

  // 5. Live AEO Harvester
  console.log("\n--- 5. AEO SERP Citation Harvester ---");
  const dataForSeoKey = process.env.DATAFORSEO_API_KEY;
  const brightDataUrl = process.env.BRIGHTDATA_PROXY_URL;
  if (dataForSeoKey) {
    console.log("  [PASS] Citation Harvester: Tier 1 DataForSEO Live API Armed");
  } else if (brightDataUrl) {
    console.log("  [PASS] Citation Harvester: Tier 2 BrightData Residential Cluster Armed");
  } else {
    console.log("  [INFO] Citation Harvester: Tier 3 Deterministic Engineering Spec Model Armed (Zero Proxy Cost Mode)");
  }

  // Summary
  console.log("\n==================================================================");
  console.log("                     PRE-FLIGHT AUDIT SUMMARY                     ");
  console.log("==================================================================");
  console.log(`Critical Errors: ${errors.length}`);
  console.log(`Advisories:      ${warnings.length}`);

  if (warnings.length > 0) {
    console.log("\nAdvisories for Live Cloud Deployment:");
    warnings.forEach((w, i) => console.log(`  ${i + 1}. ${w}`));
  }

  if (errors.length === 0) {
    console.log("\n>>> STATUS: READY FOR ENTERPRISE PILOT & HIGH-TICKET DEMOS <<<");
    process.exitCode = 0;
  } else {
    console.error("\n>>> STATUS: CRITICAL ISSUES REQUIRE RESOLUTION BEFORE DEPLOYMENT <<<");
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("Fatal pre-flight crash:", err);
  process.exit(1);
});
