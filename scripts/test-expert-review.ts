import { injectExpertReviewSchema, generateExpertReviewHtml, DEFAULT_VERIFICATION_CHECKLIST } from "../lib/expertReview";
import { db } from "../lib/db";
import { DraftStatus, ReviewStatus } from "@prisma/client";

async function runTests() {
  console.log("=== STARTING EXPERT REVIEW & SCHEMA GENERATOR TESTS ===\n");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${msg}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      failed++;
    }
  }

  // 1. Test Schema Generator
  console.log("[Test Suite 1: Schema Generator (reviewedBy, lastReviewed, dateModified)]");
  const testReviewer = {
    id: "rev_test_1",
    name: "Dr. Marcus Vance, PE",
    jobTitle: "Senior Applications Engineer",
    credentials: "PE, ASHRAE Fellow",
    yearsOfExperience: 18,
    linkedInUrl: "https://www.linkedin.com/in/marcus-vance-pe",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    bio: "HVAC rooftop unit specialist",
  };
  const testDate = new Date("2026-03-15T10:00:00Z");

  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Automating FDD for RTU Compressors",
  };

  const enriched = injectExpertReviewSchema(baseSchema, testReviewer, testDate);
  assert(Boolean(enriched.reviewedBy), "Schema contains reviewedBy property");
  const reviewedBy = enriched.reviewedBy as Record<string, unknown>;
  assert(reviewedBy["@type"] === "Person", "reviewedBy is of @type Person");
  assert(reviewedBy.name === "Dr. Marcus Vance, PE", "reviewedBy has reviewer name");
  assert(reviewedBy.jobTitle === "Senior Applications Engineer", "reviewedBy has jobTitle");
  assert(reviewedBy.hasCredential === "PE, ASHRAE Fellow", "reviewedBy has credentials");
  assert(reviewedBy.sameAs === "https://www.linkedin.com/in/marcus-vance-pe", "reviewedBy has LinkedIn URL");
  assert(enriched.lastReviewed === "2026-03-15", "Schema has formatted lastReviewed date");
  assert(enriched.dateModified === "2026-03-15T10:00:00.000Z", "Schema has dateModified ISO date");

  // 2. Test HTML Export with Layout Variations
  console.log("\n[Test Suite 2: HTML Output Layout Variations]");
  const html0 = generateExpertReviewHtml({
    draftId: "draft_sample_0",
    reviewer: testReviewer,
    reviewDate: testDate,
    reviewerNotes: "Verified tolerances and failure modes.",
    verificationItems: DEFAULT_VERIFICATION_CHECKLIST,
  });
  assert(html0.includes("Dr. Marcus Vance, PE"), "HTML includes reviewer name");
  assert(html0.includes("PE, ASHRAE Fellow"), "HTML includes reviewer credentials");
  assert(html0.includes("March 15, 2026"), "HTML includes formatted review date");
  assert(html0.includes("Verified tolerances and failure modes."), "HTML includes reviewer notes");

  const html1 = generateExpertReviewHtml({
    draftId: "draft_sample_1",
    reviewer: testReviewer,
    reviewDate: testDate,
  });
  const html2 = generateExpertReviewHtml({
    draftId: "draft_sample_2",
    reviewer: testReviewer,
    reviewDate: testDate,
  });
  assert(html0 !== html1 || html1 !== html2, "Different draft IDs generate distinct layout designs");

  // 3. Test Database Model & Publishing Enforcement
  console.log("\n[Test Suite 3: Database Storage & Publishing Enforcement]");
  const org = await db.organization.create({
    data: { name: "Test HVAC OEM", slug: `test-org-${Date.now()}` },
  });

  const draft = await db.draft.create({
    data: {
      organizationId: org.id,
      title: "Commercial RTU Compressor Diagnostics",
      keyword: "rtu compressor diagnostics",
      summary: "Technical guide to commercial RTU compressor failure modes.",
      sectionsJson: JSON.stringify([{ heading: "Failure Modes", body: "Suction liquid floodback." }]),
      faqsJson: JSON.stringify([{ q: "What causes floodback?", a: "Low superheat." }]),
      schemaJson: JSON.stringify(baseSchema),
      status: DraftStatus.IN_REVIEW,
    },
  });

  // Verify unreviewed draft cannot be published
  const initialReview = await db.pageReview.findUnique({ where: { draftId: draft.id } });
  assert(initialReview === null, "Draft starts without an expert review");

  // Assign reviewer
  const reviewer = await db.expertReviewer.create({
    data: {
      organizationId: org.id,
      name: "Sarah Jenkins, PE",
      jobTitle: "Senior Mechanical Engineer",
      credentials: "PE, ASME Member",
    },
  });

  const pageReview = await db.pageReview.create({
    data: {
      draftId: draft.id,
      reviewerId: reviewer.id,
      status: ReviewStatus.PENDING,
      reviewerNotes: "Pending examination",
    },
  });
  assert(pageReview.status === ReviewStatus.PENDING, "Assigned review is initially PENDING");

  // Approve review
  const approvedReview = await db.pageReview.update({
    where: { draftId: draft.id },
    data: {
      status: ReviewStatus.APPROVED,
      reviewerNotes: "All operating envelope and ASHRAE tolerances verified.",
    },
    include: { reviewer: true },
  });
  assert(approvedReview.status === ReviewStatus.APPROVED, "Review status transitions to APPROVED");
  assert(approvedReview.reviewer?.name === "Sarah Jenkins, PE", "Included reviewer loaded correctly");

  console.log(`\n=== TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);
  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
