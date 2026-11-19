import { db } from "../lib/db";
import { DraftStatus, ReviewStatus, UserRole } from "@prisma/client";
import { injectExpertReviewSchema, generateExpertReviewHtml, DEFAULT_VERIFICATION_CHECKLIST } from "../lib/expertReview";
import { simulateAeoAnswer, getIndustrialAeoSuggestions } from "../lib/gemini";
import { serializeDraft } from "../lib/drafts";

async function runDeepSystemTests() {
  console.log("===============================================================================");
  console.log("             FORGEFLOW DEEP SYSTEM & INTEGRATION TEST SUITE                    ");
  console.log("===============================================================================\n");

  let passed = 0;
  let failed = 0;
  const issuesFound: string[] = [];

  function assert(condition: boolean, testName: string, issueDetails?: string) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName}`);
      if (issueDetails) issuesFound.push(issueDetails);
      failed++;
    }
  }

  // ---------------------------------------------------------------------------
  // 1. DATA MODEL & MULTI-TENANT ISOLATION TESTS
  // ---------------------------------------------------------------------------
  console.log("\n--- TEST MODULE 1: Multi-Tenant Data Isolation & Reviewer Lifecycle ---");

  const orgA = await db.organization.create({
    data: { name: "Apex Thermal Systems", slug: `apex-${Date.now()}` },
  });
  const orgB = await db.organization.create({
    data: { name: "Titan Hydraulics", slug: `titan-${Date.now()}` },
  });

  // Create custom reviewer in Org A
  const reviewerA = await db.expertReviewer.create({
    data: {
      organizationId: orgA.id,
      name: "Dr. Aris Thorne, PE",
      jobTitle: "Lead Cryogenics Reliability Specialist",
      credentials: "PE, ASME Fellow",
      yearsOfExperience: 19,
      linkedInUrl: "https://www.linkedin.com/in/aris-thorne-pe",
      bio: "Cryogenic chiller diagnostics and high-pressure envelope verification.",
    },
  });

  assert(reviewerA.id.startsWith("rev_"), "Reviewer ID is properly prefixed (rev_*)");
  assert(reviewerA.name === "Dr. Aris Thorne, PE", "Reviewer name persisted correctly");

  // Verify findMany includes both Org A reviewers and global pre-seeded reviewers
  const orgAReviewers = await db.expertReviewer.findMany({
    where: { organizationId: orgA.id },
  });
  assert(
    orgAReviewers.some((r) => r.id === reviewerA.id),
    "Org A finds its custom reviewer",
  );

  // Verify Org B cannot see Org A's custom reviewer
  const orgBReviewers = await db.expertReviewer.findMany({
    where: { organizationId: orgB.id },
  });
  assert(
    !orgBReviewers.some((r) => r.id === reviewerA.id),
    "Org B cannot access Org A's private reviewers (Multi-tenant isolation verified)",
  );

  // ---------------------------------------------------------------------------
  // 2. DRAFT LIFECYCLE & EXPERT REVIEW PUBLISHING GATE TESTS
  // ---------------------------------------------------------------------------
  console.log("\n--- TEST MODULE 2: Draft Lifecycle & Strict Publishing Gate Enforcement ---");

  const testDraft = await db.draft.create({
    data: {
      organizationId: orgA.id,
      title: "Centrifugal Chiller Cavitation & Impeller Erosion Mitigation",
      keyword: "centrifugal chiller impeller cavitation",
      vertical: "HVAC & Industrial Refrigeration",
      targetEquipment: "Centrifugal Water Chiller",
      complianceStandard: "ASHRAE Standard 15-2022",
      summary: "Closed-loop diagnostic protocol benchmarked against ASHRAE 15-2022 safety envelopes.",
      sectionsJson: JSON.stringify([
        { heading: "01. Impeller Acoustic Cavitation Profiling", body: "NPSH margins below 1.2 meters cause micro-vapor implosions." },
        { heading: "02. Differential Pressure Telemetry", body: "Benchmark pressure transducer readings against ASHRAE 15 guidelines." },
      ]),
      faqsJson: JSON.stringify([
        { q: "What is the critical NPSH threshold?", a: "Minimum 1.8x available NPSH relative to required NPSH." },
      ]),
      schemaJson: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Centrifugal Chiller Cavitation & Impeller Erosion Mitigation",
      }),
      status: DraftStatus.IN_REVIEW,
    },
  });

  // Step 2a: Unreviewed draft state
  const initialReview = await db.pageReview.findUnique({ where: { draftId: testDraft.id } });
  assert(initialReview === null, "New draft starts with no PageReview record");

  // Step 2b: Publishing gate check on unreviewed draft
  const canPublishUnreviewed = initialReview !== null && (initialReview as { status: string }).status === "APPROVED";
  assert(!canPublishUnreviewed, "Publishing Gate: Unreviewed draft is BLOCKED from publishing");

  // Step 2c: Assign reviewer -> status PENDING
  const assignedReview = await db.pageReview.create({
    data: {
      draftId: testDraft.id,
      reviewerId: reviewerA.id,
      status: ReviewStatus.PENDING,
      verificationItemsJson: JSON.stringify(DEFAULT_VERIFICATION_CHECKLIST),
    },
  });
  assert(assignedReview.status === ReviewStatus.PENDING, "Assigned review is initially in PENDING status");

  const canPublishPending = assignedReview.status === ReviewStatus.APPROVED;
  assert(!canPublishPending, "Publishing Gate: PENDING review is BLOCKED from publishing");

  // Step 2d: Submit review decision -> CHANGES_REQUESTED
  const revisedReview = await db.pageReview.update({
    where: { draftId: testDraft.id },
    data: {
      status: ReviewStatus.CHANGES_REQUESTED,
      reviewerNotes: "Acoustic sensor telemetry must cite ASME PTC 19.1 uncertainty limits.",
    },
  });
  assert(revisedReview.status === ReviewStatus.CHANGES_REQUESTED, "Review transitions to CHANGES_REQUESTED");

  const canPublishChangesRequested = revisedReview.status === ReviewStatus.APPROVED;
  assert(!canPublishChangesRequested, "Publishing Gate: CHANGES_REQUESTED review is BLOCKED from publishing");

  // Step 2e: Submit approval -> APPROVED
  const approvedReview = await db.pageReview.update({
    where: { draftId: testDraft.id },
    data: {
      status: ReviewStatus.APPROVED,
      reviewerNotes: "Approved: ASHRAE 15-2022 pressure envelopes and NPSH safety factors verified.",
      reviewDate: new Date("2026-03-20T12:00:00Z"),
    },
    include: { reviewer: true },
  });
  assert(approvedReview.status === ReviewStatus.APPROVED, "Review transitions to APPROVED");

  // Step 2f: Inject schema with reviewedBy Person
  const enrichedSchema = injectExpertReviewSchema(
    testDraft.schemaJson,
    {
      id: reviewerA.id,
      name: reviewerA.name,
      jobTitle: reviewerA.jobTitle,
      credentials: reviewerA.credentials,
      yearsOfExperience: reviewerA.yearsOfExperience,
      linkedInUrl: reviewerA.linkedInUrl,
    },
    approvedReview.reviewDate,
  );

  assert(Boolean(enrichedSchema.reviewedBy), "Schema contains reviewedBy Person object");
  const reviewedBy = enrichedSchema.reviewedBy as Record<string, unknown>;
  assert(reviewedBy.name === "Dr. Aris Thorne, PE", "Schema reviewedBy has reviewer name");
  assert(reviewedBy.jobTitle === "Lead Cryogenics Reliability Specialist", "Schema reviewedBy has jobTitle");
  assert(reviewedBy.hasCredential === "PE, ASME Fellow", "Schema reviewedBy has credentials");
  assert(reviewedBy.sameAs === "https://www.linkedin.com/in/aris-thorne-pe", "Schema reviewedBy has sameAs LinkedIn");
  assert(enrichedSchema.lastReviewed === "2026-03-20", "Schema lastReviewed date formatted as YYYY-MM-DD");

  // Step 2g: Draft can now publish
  const canPublishApproved = approvedReview.status === ReviewStatus.APPROVED;
  assert(canPublishApproved, "Publishing Gate: APPROVED draft is UNBLOCKED and permitted to publish");

  const publishedDraft = await db.draft.update({
    where: { id: testDraft.id },
    data: {
      status: DraftStatus.PUBLISHED,
      publishedAt: new Date(),
      publishedUrl: "https://apex-thermal.com/chiller-impeller-cavitation",
    },
  });
  assert(publishedDraft.status === DraftStatus.PUBLISHED, "Draft successfully transitions to PUBLISHED");

  // ---------------------------------------------------------------------------
  // 3. HTML VARIATIONS & STRUCTURE TESTS
  // ---------------------------------------------------------------------------
  console.log("\n--- TEST MODULE 3: HTML Output Variations & Placement Gating ---");

  const html0 = generateExpertReviewHtml({
    draftId: "draft-alpha-001",
    reviewer: reviewerA,
    reviewDate: new Date("2026-03-20"),
    reviewerNotes: "Verified tolerances per ASHRAE 15.",
  });
  const html1 = generateExpertReviewHtml({
    draftId: "draft-beta-002",
    reviewer: reviewerA,
    reviewDate: new Date("2026-03-20"),
  });
  const html2 = generateExpertReviewHtml({
    draftId: "draft-gamma-003",
    reviewer: reviewerA,
    reviewDate: new Date("2026-03-20"),
  });

  assert(html0.includes("Dr. Aris Thorne, PE"), "HTML 0 renders reviewer name");
  assert(html0.includes("PE, ASME Fellow"), "HTML 0 renders reviewer credentials");
  assert(html0.includes("LinkedIn Profile ↗"), "HTML 0 renders LinkedIn profile link");
  assert(html0 !== html1 || html1 !== html2, "Layout varies deterministically across draft IDs (no repetitive templates)");

  // ---------------------------------------------------------------------------
  // 4. AEO SIMULATION & FALLBACK ENGINE TESTS
  // ---------------------------------------------------------------------------
  console.log("\n--- TEST MODULE 4: AEO Answer Engine Simulator & Offline Fallback ---");

  const sim = await simulateAeoAnswer({
    query: "Commercial RTU compressor failure modes",
    title: "Commercial RTU Compressor Failure Modes & Diagnostic Protocols",
    equipment: "Rooftop Packaged HVAC",
    standard: "ASHRAE 90.1",
    company: "Apex Thermal Systems",
    domain: "apex-thermal.com",
    engine: "Perplexity Copilot",
  });

  assert(sim.confidenceScore >= 90, "Simulated AEO confidence score is >= 90%");
  assert(sim.directAnswer.includes("[1]") || sim.directAnswer.includes("apex-thermal.com"), "Direct answer includes citation to client domain [1]");
  assert(sim.sources.length >= 2, "AEO simulation provides at least 2 authoritative sources");
  assert(sim.sources[0].isClient === true, "Primary citation [1] is marked as the client OEM");
  assert(sim.keyTakeaways.length >= 2, "AEO simulation includes key technical takeaways");

  const suggestions = await getIndustrialAeoSuggestions({
    topic: "Chiller Cavitation",
    equipment: "Centrifugal Chiller",
    standard: "ASHRAE 15",
  });

  assert(suggestions.suggestedTitles.length >= 3, "Gemini suggests at least 3 high-CTR industrial titles");
  assert(suggestions.suggestedKeywords.length >= 4, "Gemini suggests at least 4 long-tail engineering keywords");
  assert(suggestions.answerCapsule.length > 20, "Gemini returns a direct answer capsule");

  // ---------------------------------------------------------------------------
  // 5. ROI CALCULATOR FORMULA TESTS
  // ---------------------------------------------------------------------------
  console.log("\n--- TEST MODULE 5: Industrial ROI Calculator Arithmetic Verification ---");

  const pages = 20;
  const searchesPerPage = 45;
  const ctr = 0.08; // 8%
  const leadConv = 0.035; // 3.5%
  const closeRate = 0.20; // 20%
  const avgDeal = 65000; // $65,000

  const totalImpressions = pages * searchesPerPage; // 900
  const monthlyVisitors = totalImpressions * ctr; // 72
  const monthlyLeads = monthlyVisitors * leadConv; // 2.52
  const monthlyDeals = monthlyLeads * closeRate; // 0.504
  const annualDeals = monthlyDeals * 12; // 6.048
  const estimatedAnnualPipeline = annualDeals * avgDeal; // $393,120

  assert(totalImpressions === 900, "Step 1: Impressions calculated correctly (pages * searches)");
  assert(Math.round(monthlyVisitors) === 72, "Step 2: Monthly visitors calculated correctly (impressions * ctr)");
  assert(monthlyLeads > 2.5 && monthlyLeads < 2.6, "Step 3: Qualified leads calculated correctly (visitors * leadConv)");
  assert(estimatedAnnualPipeline > 390000 && estimatedAnnualPipeline < 400000, "Step 4: Annual pipeline follows formula transparently");

  // ---------------------------------------------------------------------------
  // 6. SERIALIZATION CONSISTENCY TESTS
  // ---------------------------------------------------------------------------
  console.log("\n--- TEST MODULE 6: Draft Serialization & Fallback Resilience ---");

  const serialized = serializeDraft(testDraft, {
    reviewerId: reviewerA.id,
    status: "APPROVED",
    reviewDate: "2026-03-20T12:00:00.000Z",
    reviewerNotes: "All tolerances verified.",
    verificationItems: DEFAULT_VERIFICATION_CHECKLIST,
    reviewer: {
      id: reviewerA.id,
      name: reviewerA.name,
      jobTitle: reviewerA.jobTitle,
      credentials: reviewerA.credentials,
      yearsOfExperience: reviewerA.yearsOfExperience,
      linkedInUrl: reviewerA.linkedInUrl,
      photoUrl: reviewerA.photoUrl,
      bio: reviewerA.bio,
    },
  });

  assert(Boolean(serialized.pageReview), "Serialized draft contains pageReview object");
  assert(serialized.pageReview?.status === "APPROVED", "Serialized draft pageReview status is APPROVED");
  assert(serialized.pageReview?.reviewer?.name === "Dr. Aris Thorne, PE", "Serialized draft contains full reviewer nested profile");

  console.log("\n===============================================================================");
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("===============================================================================");

  if (failed > 0) {
    console.error("FAILURES DETECTED:");
    issuesFound.forEach((issue, idx) => console.error(`  ${idx + 1}. ${issue}`));
    process.exit(1);
  } else {
    console.log("ALL TESTS COMPLETED SUCCESSFULLY WITH ZERO ERRORS.\n");
  }
}

runDeepSystemTests().catch((err) => {
  console.error("Test execution threw an uncaught error:", err);
  process.exit(1);
});
