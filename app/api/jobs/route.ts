import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { enqueueJob, getJob, listJobs, cancelJob, type JobType } from "@/lib/queue";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("id");
    const orgId = session.user.organizationId || "seed-org-industrial";

    if (jobId) {
      const job = getJob(jobId);
      if (!job || job.organizationId !== orgId) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, job });
    }

    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const jobs = listJobs(orgId, limit);
    return NextResponse.json({ success: true, jobs });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, payload } = body;

    const validTypes: JobType[] = [
      "CAD_INGESTION",
      "BATCH_SCHEMA_CRAWL",
      "COMPETITOR_SERP_HARVEST",
      "SITEMAP_INDEXING",
      "AEO_DISCLOSURE_AUDIT",
    ];

    if (!type || !validTypes.includes(type as JobType)) {
      return NextResponse.json({
        error: `Invalid job type. Valid types are: ${validTypes.join(", ")}`,
      }, { status: 400 });
    }

    const orgId = session.user.organizationId || "seed-org-industrial";
    const job = enqueueJob({
      type: type as JobType,
      organizationId: orgId,
      userId: session.user.id,
      payload: payload || {},
    });

    return NextResponse.json({ success: true, job }, { status: 202 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("id");

    if (!jobId) {
      return NextResponse.json({ error: "Job id is required" }, { status: 400 });
    }

    const cancelled = cancelJob(jobId);
    if (!cancelled) {
      return NextResponse.json({ error: "Job cannot be cancelled (either not found or already terminal)" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Job ${jobId} cancelled successfully` });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
