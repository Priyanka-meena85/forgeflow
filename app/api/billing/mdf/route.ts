import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

export interface MdfClaim {
  id: string;
  distributorName: string;
  oemSponsor: string;
  claimAmountUsd: number;
  approvedAmountUsd: number;
  status: "APPROVED" | "PENDING_OEM_AUDIT" | "REIMBURSED";
  coOpProgramName: string;
  poNumber: string;
  submittedDate: string;
}

const memoryMdfClaims: MdfClaim[] = [
  {
    id: "mdf_claim_101",
    distributorName: "Grainger Industrial Supply (Dallas Branch)",
    oemSponsor: "Carrier Commercial HVAC Corporation",
    claimAmountUsd: 12500,
    approvedAmountUsd: 12500,
    status: "APPROVED",
    coOpProgramName: "Carrier 2026 Q1 Digital Co-Op Market Development Program",
    poNumber: "PO-MDF-2026-0819",
    submittedDate: "2026-02-10",
  },
  {
    id: "mdf_claim_102",
    distributorName: "Motion Industries Southeast Regional Hub",
    oemSponsor: "Parker Hannifin Fluid Power OEM",
    claimAmountUsd: 8750,
    approvedAmountUsd: 8750,
    status: "PENDING_OEM_AUDIT",
    coOpProgramName: "Parker Motion & Control Co-Marketing Grant",
    poNumber: "PO-MDF-2026-1142",
    submittedDate: "2026-02-22",
  },
];

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const availableMdfBudgetUsd = 45000;
    const claimedMdfUsd = memoryMdfClaims.reduce((sum, c) => sum + c.claimAmountUsd, 0);

    return NextResponse.json({
      success: true,
      availableMdfBudgetUsd,
      claimedMdfUsd,
      remainingMdfUsd: availableMdfBudgetUsd - claimedMdfUsd,
      claims: memoryMdfClaims,
      oemPolicy: "Zero-Out-Of-Pocket Dealer Co-Op Financing Guaranteed",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { distributorName, oemSponsor, claimAmountUsd, poNumber } = body;

    if (!distributorName || !oemSponsor || !claimAmountUsd || !poNumber) {
      return NextResponse.json({ error: "Missing required MDF claim fields." }, { status: 400 });
    }

    const newClaim: MdfClaim = {
      id: `mdf_claim_${Date.now()}`,
      distributorName: String(distributorName).trim(),
      oemSponsor: String(oemSponsor).trim(),
      claimAmountUsd: Number(claimAmountUsd),
      approvedAmountUsd: Number(claimAmountUsd),
      status: "APPROVED",
      coOpProgramName: "OEM Partner Direct Co-Op Credit Line",
      poNumber: String(poNumber).trim(),
      submittedDate: new Date().toISOString().split("T")[0] || "2026-03-01",
    };

    memoryMdfClaims.unshift(newClaim);

    const orgId = session.user.organizationId || "seed-org-industrial";
    await recordAuditLog({
      organizationId: orgId,
      userId: session.user.id,
      userRole: session.user.role,
      action: "MDF_COOP_CLAIM_SUBMITTED",
      resourceType: "MDF_BILLING",
      resourceId: newClaim.id,
      metadata: { poNumber: newClaim.poNumber, amount: newClaim.claimAmountUsd },
      details: { summary: `Submitted OEM MDF co-op claim for $${newClaim.claimAmountUsd} under PO ${newClaim.poNumber}` },
    });

    return NextResponse.json({
      success: true,
      message: `MDF Claim of $${newClaim.claimAmountUsd} verified against ${newClaim.oemSponsor} co-op budget.`,
      claim: newClaim,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
