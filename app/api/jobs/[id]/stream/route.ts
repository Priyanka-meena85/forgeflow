import { getSessionUser } from "@/lib/auth";
import { errorResponse } from "@/lib/http";
import { getJobStatus, subscribeToJob, type JobUpdateEvent } from "@/lib/jobs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) return errorResponse("Sign in to stream job updates.", 401);

    const { id } = await params;
    const initialJob = await getJobStatus(id);
    if (!initialJob || initialJob.organizationId !== user.organizationId) {
      return errorResponse("Job not found.", 404);
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      start(controller) {
        // Send initial state immediately
        const initialPayload = JSON.stringify({
          jobId: initialJob.id,
          status: initialJob.status,
          progress: initialJob.progress,
          currentStep: initialJob.currentStep,
          completedItems: initialJob.completedItems,
          totalItems: initialJob.totalItems,
          resultDraftIds: initialJob.resultDraftIdsJson
            ? JSON.parse(initialJob.resultDraftIdsJson)
            : undefined,
          error: initialJob.error,
        });
        controller.enqueue(encoder.encode(`data: ${initialPayload}\n\n`));

        if (initialJob.status === "COMPLETED" || initialJob.status === "FAILED") {
          controller.close();
          return;
        }

        const unsubscribe = subscribeToJob(id, (update: JobUpdateEvent) => {
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(update)}\n\n`));
            if (update.status === "COMPLETED" || update.status === "FAILED") {
              unsubscribe();
              controller.close();
            }
          } catch {
            unsubscribe();
          }
        });

        // Safety timeout after 5 minutes
        const timeout = setTimeout(() => {
          unsubscribe();
          try {
            controller.close();
          } catch {}
        }, 5 * 60 * 1000);

        request.signal.addEventListener("abort", () => {
          clearTimeout(timeout);
          unsubscribe();
        });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("SSE stream error:", error);
    return errorResponse("Failed to establish SSE stream.", 500);
  }
}
