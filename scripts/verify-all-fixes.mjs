async function run() {
  const baseUrl = process.env.TEST_BASE_URL || "http://localhost:8080";
  console.log(`[TEST SUITE] Comprehensive Enterprise Fixes Verification against ${baseUrl}`);
  let allPass = true;

  // Login to acquire session cookie
  let cookieHeader = "";
  try {
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@accudrive.io", password: "ForgeFlow2026!" }),
    });
    const setCookie = loginRes.headers.get("set-cookie");
    if (setCookie) cookieHeader = setCookie.split(";")[0];
  } catch (err) {
    console.error("Login failed:", err.message);
  }

  // 1. Edge Middleware Security Headers Check
  try {
    const res = await fetch(`${baseUrl}/api/health`);
    const hsts = res.headers.get("strict-transport-security");
    const nosniff = res.headers.get("x-content-type-options");
    const frameOptions = res.headers.get("x-frame-options");
    const corrId = res.headers.get("x-correlation-id");

    console.log(`[1] Middleware Security Headers: HTTP ${res.status}`);
    console.log(`    HSTS: ${hsts ? "PRESENT" : "MISSING"}`);
    console.log(`    X-Content-Type-Options: ${nosniff}`);
    console.log(`    X-Frame-Options: ${frameOptions}`);
    console.log(`    Correlation ID: ${corrId}`);
    if (!hsts || !nosniff || !frameOptions) allPass = false;
  } catch (err) {
    console.error("[1] Security Headers Error:", err.message);
    allPass = false;
  }

  // 2. SOC 2 Automated Backup & PITR Endpoint (/api/compliance/backup-status)
  try {
    const res = await fetch(`${baseUrl}/api/compliance/backup-status`, {
      headers: { Cookie: cookieHeader },
    });
    const data = await res.json();
    console.log(`[2] /api/compliance/backup-status: HTTP ${res.status}`);
    console.log(`    WAL Archiving: ${data.databaseBackupPolicy?.continuousWalArchiving}`);
    console.log(`    RPO: <${data.databaseBackupPolicy?.recoveryPointObjectiveMinutes} mins, RTO: <${data.databaseBackupPolicy?.recoveryTimeObjectiveMinutes} mins`);
    console.log(`    Audit Status: ${data.auditVerificationStatus}`);
    if (res.status !== 200 || data.auditVerificationStatus !== "VERIFIED_COMPLIANT") allPass = false;
  } catch (err) {
    console.error("[2] Backup Status Error:", err.message);
    allPass = false;
  }

  // 3. Lead Decision Maker Enrichment Engine (/api/intent/enrich)
  try {
    const res = await fetch(`${baseUrl}/api/intent/enrich`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookieHeader },
      body: JSON.stringify({ companyName: "Lockheed Martin", domain: "lockheedmartin.com" }),
    });
    const data = await res.json();
    console.log(`[3] /api/intent/enrich: HTTP ${res.status}`);
    console.log(`    Enriched Leads: ${data.leadCount} contacts`);
    console.log(`    Sample: ${data.decisionMakers?.[0]?.name} (${data.decisionMakers?.[0]?.role})`);
    console.log(`    Email: ${data.decisionMakers?.[0]?.email}, Confidence: ${data.decisionMakers?.[0]?.confidenceScore}%`);
    if (res.status !== 200 || data.leadCount === 0) allPass = false;
  } catch (err) {
    console.error("[3] Lead Enrichment Error:", err.message);
    allPass = false;
  }

  // 4. Autonomous AEO Radar & Auto-Remediation (/api/aeo/autopilot)
  try {
    const getRes = await fetch(`${baseUrl}/api/aeo/autopilot`, {
      headers: { Cookie: cookieHeader },
    });
    const getData = await getRes.json();
    console.log(`[4A] /api/aeo/autopilot (GET): HTTP ${getRes.status}`);
    console.log(`     Monitored Queries: ${getData.totalQueriesMonitored}, Primary Citation: ${getData.primaryCitationRate}`);

    const postRes = await fetch(`${baseUrl}/api/aeo/autopilot`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookieHeader },
      body: JSON.stringify({ action: "auto_remediate" }),
    });
    const postData = await postRes.json();
    console.log(`[4B] /api/aeo/autopilot (POST Remediation): HTTP ${postRes.status}`);
    console.log(`     Citation Reclaimed: ${postData.citationReclaimed}`);
    console.log(`     Search Engines Notified: ${postData.searchEnginesNotified?.join(", ")}`);
    if (getRes.status !== 200 || postRes.status !== 200 || !postData.citationReclaimed) allPass = false;
  } catch (err) {
    console.error("[4] AEO Autopilot Error:", err.message);
    allPass = false;
  }

  // 5. Multi-Brand Custom Domain Registry (/api/domains/multi-brand)
  try {
    const getRes = await fetch(`${baseUrl}/api/domains/multi-brand`, {
      headers: { Cookie: cookieHeader },
    });
    const getData = await getRes.json();
    console.log(`[5A] /api/domains/multi-brand (GET): HTTP ${getRes.status}`);
    console.log(`     Active Brand Domains: ${getData.domains?.length}`);

    const postRes = await fetch(`${baseUrl}/api/domains/multi-brand`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookieHeader },
      body: JSON.stringify({ brandName: "AccuDrive Robotics", domain: "robotics-specs.accudrive.com" }),
    });
    const postData = await postRes.json();
    console.log(`[5B] /api/domains/multi-brand (POST): HTTP ${postRes.status}`);
    console.log(`     Provisioned Domain: ${postData.domain?.domain} (SSL: ${postData.domain?.sslStatus})`);
    if (getRes.status !== 200 || postRes.status !== 200 || !postData.domain) allPass = false;
  } catch (err) {
    console.error("[5] Multi-Brand Domain Error:", err.message);
    allPass = false;
  }

  console.log(`\n======================================================`);
  console.log(allPass ? "ALL PRODUCTION FIXES & EXTENSIONS VERIFIED (100% OK)" : "SOME CHECKS FAILED");
  console.log(`======================================================\n`);

  if (!allPass) process.exit(1);
}

run();
