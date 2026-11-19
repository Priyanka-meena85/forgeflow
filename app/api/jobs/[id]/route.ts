import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { errorResponse } from "@/lib/http";
import { getJobStatus } from "@/lib/jobs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) return errorResponse("Sign in to check job status.", 401);

    const { id } = await params;
    const job = await getJobStatus(id);
    if (!job || job.organizationId !== user.organizationId) {
      return errorResponse("Job not found.", 404);
    }

    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        status: job.status,
        progress: job.progress,
        currentStep: job.currentStep,
        totalItems: job.totalItems,
        completedItems: job.completedItems,
        resultDraftIds: job.resultDraftIdsJson ? JSON.parse(job.resultDraftIdsJson) : [],
        error: job.error,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
      },
    });
  } catch (error) {
    console.error("Fetch job status error:", error);
    return errorResponse("Failed to fetch job status.", 500);
  }
}
