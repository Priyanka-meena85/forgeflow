import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { enqueueAsyncJob, listJobsForOrg, getQueueMetrics, type JobType } from "@/lib/queue";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.user.organizationId || "seed-org-industrial";
    const jobs = listJobsForOrg(orgId, 25);
    const metrics = getQueueMetrics();

    return NextResponse.json({
      success: true,
      metrics,
      jobs,
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

    const orgId = session.user.organizationId || "seed-org-industrial";
    const body = await req.json();

    const { type, payload } = body as { type: JobType; payload?: Record<string, unknown> };

    if (!type) {
      return NextResponse.json({ error: "Job type is required." }, { status: 400 });
    }

    const job = await enqueueAsyncJob({
      type,
      organizationId: orgId,
      userId: session.user.id,
      payload: payload || {},
    });

    return NextResponse.json({
      success: true,
      message: `Job ${job.id} enqueued successfully.`,
      job,
    }, { status: 202 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
