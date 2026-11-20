async function run() {
  const baseUrl = process.env.TEST_BASE_URL || "http://localhost:8080";
  console.log(`[TEST SUITE] Starting Pure Software SaaS Verification against ${baseUrl}`);
  let allPass = true;

  // 1. Deep Health Check Endpoint (/api/health)
  try {
    const res = await fetch(`${baseUrl}/api/health`);
    const data = await res.json();
    console.log(`[1] /api/health: HTTP ${res.status}`);
    console.log(`    Status: ${data.status}, Version: ${data.version}`);
    console.log(`    Database: ${data.checks?.database?.status} (${data.checks?.database?.latencyMs}ms)`);
    console.log(`    Distributed Queue: ${data.checks?.distributedQueue?.status} (Jitter: ${data.checks?.distributedQueue?.jitterMode})`);
    console.log(`    Cloud Storage: ${data.checks?.cloudStorage?.status} (Presigned: ${data.checks?.cloudStorage?.presignedUploads})`);
    if (res.status !== 200 || data.status !== "HEALTHY") allPass = false;
  } catch (err) {
    console.error("[1] /api/health ERROR:", err.message);
    allPass = false;
  }

  // 2. Direct-to-Cloud Presigned Uploads (/api/storage/presigned)
  let cookieHeader = "";
  try {
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@accudrive.io", password: "ForgeFlow2026!" }),
    });
    const setCookie = loginRes.headers.get("set-cookie");
    if (setCookie) cookieHeader = setCookie.split(";")[0];

    const presignedRes = await fetch(`${baseUrl}/api/storage/presigned`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookieHeader },
      body: JSON.stringify({ fileName: "Carrier_RTU_50MB_Service_Manual.pdf", contentType: "application/pdf" }),
    });
    const presignedData = await presignedRes.json();
    console.log(`[2] /api/storage/presigned: HTTP ${presignedRes.status}`);
    console.log(`    FileKey: ${presignedData.presigned?.fileKey}`);
    console.log(`    UploadUrl: ${presignedData.presigned?.uploadUrl?.slice(0, 50)}...`);
    console.log(`    ExpiresIn: ${presignedData.presigned?.expiresInSeconds}s`);
    if (presignedRes.status !== 200 || !presignedData.presigned?.uploadUrl) allPass = false;
  } catch (err) {
    console.error("[2] /api/storage/presigned ERROR:", err.message);
    allPass = false;
  }

  // 3. Public Developer REST API with Rate Limiting (/api/v1/generate)
  try {
    const apiKey = "ff_live_48f7d92a1_enterprise_test";
    const apiRes = await fetch(`${baseUrl}/api/v1/generate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vertical: "Precision CNC machining & tooling",
        equipment: "5-Axis CNC Milling Center",
        failureMode: "Thermal Spindle Drift",
      }),
    });
    const apiData = await apiRes.json();
    const limitHeader = apiRes.headers.get("x-ratelimit-limit");
    const remainingHeader = apiRes.headers.get("x-ratelimit-remaining");

    console.log(`[3] /api/v1/generate: HTTP ${apiRes.status}`);
    console.log(`    RateLimit-Limit: ${limitHeader}, Remaining: ${remainingHeader}`);
    console.log(`    Generated Spec: "${apiData.data?.title}"`);
    console.log(`    Tolerance Veracity: ${apiData.data?.qaVerification?.physicalToleranceVeracity}`);
    console.log(`    Schema Type: ${apiData.data?.schemaOrg?.["@type"]}`);
    if (apiRes.status !== 200 || !apiData.data?.id) allPass = false;
  } catch (err) {
    console.error("[3] /api/v1/generate ERROR:", err.message);
    allPass = false;
  }

  // 4. Distributed Queue & DLQ Metrics (/api/jobs/queue)
  try {
    const qRes = await fetch(`${baseUrl}/api/jobs/queue`, {
      headers: { Cookie: cookieHeader },
    });
    const qData = await qRes.json();
    console.log(`[4] /api/jobs/queue: HTTP ${qRes.status}`);
    console.log(`    Active: ${qData.metrics?.active}, Waiting: ${qData.metrics?.waiting}`);
    console.log(`    DLQ Count: ${qData.dlqJobs?.length}`);
    console.log(`    Distributed Redis Active: ${qData.metrics?.distributedRedisActive}`);
    if (qRes.status !== 200) allPass = false;
  } catch (err) {
    console.error("[4] /api/jobs/queue ERROR:", err.message);
    allPass = false;
  }

  // 5. SCIM 2.0 Directory Sync (/api/scim/v2/ServiceProviderConfig)
  try {
    const scimRes = await fetch(`${baseUrl}/api/scim/v2/ServiceProviderConfig`, {
      headers: { Authorization: "Bearer scim_live_okta_7f9a2b8e4c1d6e3f5a0b9c8d7e6f5a4b" },
    });
    console.log(`[5] /api/scim/v2/ServiceProviderConfig: HTTP ${scimRes.status}`);
    if (scimRes.status !== 200) allPass = false;
  } catch (err) {
    console.error("[5] /api/scim/v2 ERROR:", err.message);
    allPass = false;
  }

  console.log(`\n========================================`);
  console.log(allPass ? "ALL PURE SOFTWARE TESTS PASSED (100% OK)" : "SOME TESTS FAILED");
  console.log(`========================================\n`);

  if (!allPass) process.exit(1);
}

run();
