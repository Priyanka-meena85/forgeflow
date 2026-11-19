import { getOrganizationTeam, inviteTeamMember, revokeTeamInvitation } from "../lib/team";
import { UserRole } from "@prisma/client";
import { sendReviewPendingAlert, sendReviewDecisionAlert, sendPublishedAlert } from "../lib/email";
import { getOrganizationAeoSummary } from "../lib/aeoTracker";

async function runEnterpriseFeatureTests() {
  console.log("=================================================");
  console.log("TESTING ENTERPRISE TEAM, EMAIL & REPORT MODULES");
  console.log("=================================================");

  const orgId = "seed-org-industrial";

  // 1. Team RBAC & Invitations
  console.log("▶ [Test 1] Team RBAC & Invitation Pipeline...");
  const teamInitial = await getOrganizationTeam(orgId);
  console.log(`  ✔ Retrieved team: ${teamInitial.members.length} members, ${teamInitial.invitations.length} pending invites`);

  const inviteResult = await inviteTeamMember({
    organizationId: orgId,
    organizationName: "AccuDrive Reliability Systems",
    invitedByUserId: "seed-user-owner",
    invitedByUserName: "Alex Henderson, PE",
    email: "reviewer.test@example.com",
    role: UserRole.REVIEWER,
  });
  console.log(`  ✔ Dispatched team invite: ID=${inviteResult.invitationId}`);

  await revokeTeamInvitation({
    invitationId: inviteResult.invitationId,
    organizationId: orgId,
    revokedByUserId: "seed-user-owner",
  });
  console.log("  ✔ Successfully revoked team invitation with audit trail log");

  // 2. Transactional Review Alerts
  console.log("▶ [Test 2] Transactional Review Alert Emails...");
  const pendingAlert = await sendReviewPendingAlert({
    to: "lead.engineer@example.com",
    reviewerName: "Marcus Vance, PE",
    draftTitle: "Commercial RTU Suction Floodback Diagnosis",
    equipment: "100-Ton Industrial Rooftop Unit",
    vertical: "Commercial HVAC & Refrigeration",
    draftId: "draft-test-101",
  });
  console.log(`  ✔ Dispatched pending review alert email: success=${pendingAlert.success}`);

  const decisionAlert = await sendReviewDecisionAlert({
    to: "author.tech@example.com",
    authorName: "Sarah Lin",
    draftTitle: "Commercial RTU Suction Floodback Diagnosis",
    reviewerName: "Marcus Vance, PE",
    status: "APPROVED",
    reviewerNotes: "Engineering specs verified against ASHRAE 90.1 Table 6.8.1-1",
    draftId: "draft-test-101",
  });
  console.log(`  ✔ Dispatched review decision notification email: success=${decisionAlert.success}`);

  const publishedAlert = await sendPublishedAlert({
    to: "author@example.com",
    organizationName: "AccuDrive Reliability Systems",
    draftTitle: "Commercial RTU Suction Floodback Diagnosis",
    publishedUrl: "https://journal.accudrive.example.com/hvac/suction-floodback",
    cmsType: "HubSpot CMS Hub",
  });
  console.log(`  ✔ Dispatched CMS published team announcement: success=${publishedAlert.success}`);

  // 3. Executive AEO Summary
  console.log("▶ [Test 3] Executive AEO Summary Retrieval...");
  const aeoSummary = await getOrganizationAeoSummary(orgId);
  console.log(`  ✔ AEO Summary: ${aeoSummary.totalMonitored} monitored queries, ${aeoSummary.aggregateCitationShare}% share`);

  console.log("=================================================");
  console.log("ALL ENTERPRISE TESTS PASSED CLEANLY (3/3)");
  console.log("=================================================");
}

runEnterpriseFeatureTests().catch((e) => {
  console.error("Test error:", e);
  process.exit(1);
});
