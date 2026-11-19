import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export interface RfqLead {
  id: string;
  organizationId: string;
  draftId?: string;
  draftTitle?: string;
  contactName: string;
  contactEmail: string;
  companyName: string;
  equipmentModel?: string;
  inquiryType: "PARTS_REPLACEMENT" | "DIAGNOSTIC_SOP_DOWNLOAD" | "OEM_QUOTE_REQUEST" | "RETROFIT";
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED_WON";
  estimatedValueUsd: number;
  notes?: string;
  createdAt: string;
}

// In-memory fallback leads store for immediate out-of-the-box readiness
const fallbackLeads: RfqLead[] = [
  {
    id: "lead-01",
    organizationId: "seed-org-industrial",
    draftId: "seed-draft-automotive",
    draftTitle: "Root Cause Protocol: Stamping Die Galling & Weld Inspection Defects",
    contactName: "David Miller",
    contactEmail: "d.miller@automotive-tier1.com",
    companyName: "Great Lakes Precision Stamping LLC",
    equipmentModel: "Schuler 1200T Servo Stamping Press",
    inquiryType: "OEM_QUOTE_REQUEST",
    status: "QUALIFIED",
    estimatedValueUsd: 145000,
    notes: "Requires immediate replacement die guide bushings and IATF 16949 compliant calibration SOP.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "lead-02",
    organizationId: "seed-org-industrial",
    draftId: "seed-draft-automotive",
    draftTitle: "Root Cause Protocol: Stamping Die Galling & Weld Inspection Defects",
    contactName: "Karen Zhao",
    contactEmail: "kzhao@midwest-reliability.org",
    companyName: "Midwest Assembly & Robotics Corp",
    equipmentModel: "Fanuc Spot Welding Cell 4",
    inquiryType: "DIAGNOSTIC_SOP_DOWNLOAD",
    status: "NEW",
    estimatedValueUsd: 65000,
    notes: "Downloaded verified ultrasonic weld inspection tolerance checklist.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "lead-03",
    organizationId: "seed-org-industrial",
    contactName: "Robert Kovacs",
    contactEmail: "rkovacs@packaging-automation.de",
    companyName: "Bavaria Packaging Systems",
    equipmentModel: "Rotary Lobe Pump 400 Series",
    inquiryType: "PARTS_REPLACEMENT",
    status: "CONTACTED",
    estimatedValueUsd: 95000,
    notes: "Seeking 3-A certified EPDM seal rebuild kit after CIP acid wash swelling.",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.user.organizationId || "seed-org-industrial";
    const leads = fallbackLeads.filter((l) => l.organizationId === orgId);

    const totalPipeline = leads.reduce((sum, l) => sum + l.estimatedValueUsd, 0);

    return NextResponse.json({
      success: true,
      count: leads.length,
      totalPipelineUsd: totalPipeline,
      leads,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch leads";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      organizationId,
      draftId,
      draftTitle,
      contactName,
      contactEmail,
      companyName,
      equipmentModel,
      inquiryType,
      estimatedValueUsd,
      notes,
    } = body;

    if (!contactName || !contactEmail || !companyName) {
      return NextResponse.json({ error: "Name, email, and company are required." }, { status: 400 });
    }

    const newLead: RfqLead = {
      id: `lead-${Date.now()}`,
      organizationId: organizationId || "seed-org-industrial",
      draftId,
      draftTitle,
      contactName,
      contactEmail,
      companyName,
      equipmentModel,
      inquiryType: inquiryType || "OEM_QUOTE_REQUEST",
      status: "NEW",
      estimatedValueUsd: Number(estimatedValueUsd) || 85000,
      notes,
      createdAt: new Date().toISOString(),
    };

    fallbackLeads.unshift(newLead);

    return NextResponse.json({
      success: true,
      message: "Inbound RFQ inquiry logged successfully.",
      lead: newLead,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create lead";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
