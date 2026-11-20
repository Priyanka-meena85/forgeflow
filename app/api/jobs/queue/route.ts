import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { enqueueAsyncJob, listJobsForOrg, listDlqJobs, replayDlqJob, purgeDlq, getQueueMetrics, type JobType } from "@/lib/queue";
import { recordAuditLog } from "@/lib/audit";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.user.organizationId || "seed-org-industrial";
    const jobs = listJobsForOrg(orgId, 25);
    const dlqJobs = listDlqJobs(orgId);
    const metrics = getQueueMetrics();

    return NextResponse.json({
      success: true,
      metrics,
      jobs,
      dlqJobs,
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

    const { type, payload, action, jobId } = body as {
      type?: JobType;
      payload?: Record<string, unknown>;
      action?: "replay_dlq" | "purge_dlq";
      jobId?: string;
    };

    if (action === "replay_dlq") {
      if (!jobId) return NextResponse.json({ error: "jobId required to replay from DLQ." }, { status: 400 });
      const replayed = replayDlqJob(jobId);
      if (!replayed) return NextResponse.json({ error: "Job not found in DLQ." }, { status: 404 });

      await recordAuditLog({
        organizationId: orgId,
        userId: session.user.id,
        userRole: session.user.role,
        action: "DLQ_JOB_REPLAYED",
        resourceType: "ASYNC_QUEUE",
        resourceId: jobId,
        details: { summary: `Replayed failed job ${jobId} from Dead-Letter Queue.` },
      });

      return NextResponse.json({ success: true, message: `Replayed job ${jobId} from DLQ.`, job: replayed });
    }

    if (action === "purge_dlq") {
      const purgedCount = purgeDlq(orgId);
      await recordAuditLog({
        organizationId: orgId,
        userId: session.user.id,
        userRole: session.user.role,
        action: "DLQ_PURGED",
        resourceType: "ASYNC_QUEUE",
        resourceId: orgId,
        details: { summary: `Purged ${purgedCount} jobs from DLQ.` },
      });
      return NextResponse.json({ success: true, message: `Purged ${purgedCount} dead jobs.` });
    }

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
