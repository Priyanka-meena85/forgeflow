async function run() {
  const baseUrl = "http://localhost:8080";
  console.log("Starting verification of hardened endpoints against " + baseUrl);

  // 1. SCIM ServiceProviderConfig (Bearer Token Auth)
  try {
    const res = await fetch(`${baseUrl}/api/scim/v2/ServiceProviderConfig`, {
      headers: { Authorization: "Bearer scim_live_okta_7f9a2b8e4c1d6e3f5a0b9c8d7e6f5a4b" }
    });
    console.log(`[1] SCIM ServiceProviderConfig: HTTP ${res.status}`);
    const data = await res.json();
    console.log(`    Schemas: ${JSON.stringify(data.schemas)}`);
    console.log(`    Patch Supported: ${data.patch?.supported}`);
  } catch (err) {
    console.error("[1] SCIM ServiceProviderConfig Error:", err.message);
  }

  // 2. SCIM Users Listing (Bearer Token Auth)
  try {
    const res = await fetch(`${baseUrl}/api/scim/v2/Users`, {
      headers: { Authorization: "Bearer scim_live_okta_7f9a2b8e4c1d6e3f5a0b9c8d7e6f5a4b" }
    });
    console.log(`[2] SCIM Users: HTTP ${res.status}`);
    const data = await res.json();
    console.log(`    Total Results: ${data.totalResults}`);
    console.log(`    Sample User: ${data.Resources?.[0]?.userName} (Active: ${data.Resources?.[0]?.active})`);
  } catch (err) {
    console.error("[2] SCIM Users Error:", err.message);
  }

  // 3. SCIM User De-provisioning (active: false via PATCH)
  try {
    const res = await fetch(`${baseUrl}/api/scim/v2/Users/seed-usr-author`, {
      method: "PATCH",
      headers: {
        Authorization: "Bearer scim_live_okta_7f9a2b8e4c1d6e3f5a0b9c8d7e6f5a4b",
        "Content-Type": "application/scim+json"
      },
      body: JSON.stringify({
        schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
        Operations: [{ op: "replace", path: "active", value: false }]
      })
    });
    console.log(`[3] SCIM Deprovisioning PATCH: HTTP ${res.status}`);
    const data = await res.json();
    console.log(`    User: ${data.userName}, Active Status: ${data.active}`);
  } catch (err) {
    console.error("[3] SCIM Deprovisioning Error:", err.message);
  }

  // Login to acquire session cookie
  let cookieHeader = "";
  try {
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@accudrive.io",
        password: "ForgeFlow2026!"
      })
    });
    const setCookie = loginRes.headers.get("set-cookie");
    if (setCookie) {
      cookieHeader = setCookie.split(";")[0];
      console.log(`[Auth] Logged in successfully as admin@accudrive.io, cookie acquired`);
    } else {
      console.log(`[Auth] Login status ${loginRes.status}, no cookie returned`);
    }
  } catch (err) {
    console.error("[Auth] Login error:", err.message);
  }

  // 4. RLS Compliance Isolation Check
  try {
    const res = await fetch(`${baseUrl}/api/compliance/rls-check`, {
      headers: { Cookie: cookieHeader }
    });
    console.log(`[4] RLS Compliance Check: HTTP ${res.status}`);
    const data = await res.json();
    console.log(`    Status: ${data.status}`);
    console.log(`    Verification: Penetration blocked = ${data.verificationDetails?.penetrationAttemptBlocked}`);
    console.log(`    Cross Tenant Leaked Count: ${data.verificationDetails?.crossTenantLeakageCount}`);
    console.log(`    PgBouncer Parameters Active: ${data.connectionPool?.pgBouncerActive}`);
  } catch (err) {
    console.error("[4] RLS Compliance Check Error:", err.message);
  }

  // 5. DLQ & Queue Status
  try {
    const res = await fetch(`${baseUrl}/api/jobs/queue`, {
      headers: { Cookie: cookieHeader }
    });
    console.log(`[5] Jobs Queue & DLQ: HTTP ${res.status}`);
    const data = await res.json();
    console.log(`    Success: ${data.success}`);
    console.log(`    Active Queue Jobs: ${data.jobs?.length}`);
    console.log(`    Dead-Letter Queue (DLQ) Count: ${data.dlqJobs?.length}`);
  } catch (err) {
    console.error("[5] Jobs Queue Error:", err.message);
  }

  // 6. Test DLQ Replay and Purge Actions
  try {
    const purgeRes = await fetch(`${baseUrl}/api/jobs/queue`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookieHeader },
      body: JSON.stringify({ action: "purge_dlq" })
    });
    console.log(`[6] DLQ Purge Action: HTTP ${purgeRes.status}`);
    const purgeData = await purgeRes.json();
    console.log(`    Purged DLQ: ${purgeData.success}`);
  } catch (err) {
    console.error("[6] DLQ Purge Error:", err.message);
  }

  // 7. Root UI Verification
  try {
    const res = await fetch(`${baseUrl}/`);
    console.log(`[7] Root UI (:8080): HTTP ${res.status}`);
    const html = await res.text();
    console.log(`    HTML length: ${html.length} chars, includes EnterpriseScim: ${html.includes("SCIM") || html.includes("Enterprise Identity")}`);
  } catch (err) {
    console.error("[7] Root UI Error:", err.message);
  }
}

run();
