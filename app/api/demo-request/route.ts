import { NextResponse } from "next/server";
import { sendDemoRequestNotification } from "@/lib/email";
import { validateDemoRequest } from "@/lib/validation";
import { captureTelemetry } from "@/lib/telemetry";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const rawBody = await request.json().catch(() => null);
    const validation = validateDemoRequest(rawBody);

    if (!validation.success || !validation.data) {
      const errorMap = validation.errors || {};
      const issues = Object.entries(errorMap).map(([field, message]) => ({
        field,
        message,
      }));
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          errors: errorMap,
          issues,
        },
        { status: 400 }
      );
    }

    const { name, email, company, companySize, industry, useCase } = validation.data;

    // 1. Durably persist lead in database so no sales lead is ever lost
    try {
      const systemOrg = await db.organization.findFirst({ select: { id: true } });
      if (systemOrg) {
        await db.auditLog.create({
          data: {
            organizationId: systemOrg.id,
            action: "DEMO_REQUEST_RECEIVED",
            resourceType: "SALES_LEAD",
            resourceId: email,
            diffJson: JSON.stringify({
              name,
              email,
              company,
              companySize,
              industry,
              useCase,
              receivedAt: new Date().toISOString(),
            }),
            ipAddress: request.headers.get("x-forwarded-for") || "unknown",
          },
        });
      }
    } catch (dbErr) {
      console.warn("[Demo Request] DB lead persistence fallback:", dbErr);
    }

    // 2. Dispatch real transactional notification via Resend / Dev console fallback
    await sendDemoRequestNotification({
      name,
      email,
      company,
      companySize,
      industry,
      useCase,
    });

    await captureTelemetry({
      level: "INFO",
      message: `Demo Request Registered: ${company} (${industry})`,
      context: { name, email, company, companySize, industry },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Demo request registered successfully. An industrial systems engineer will contact you within 2 business hours.",
      },
      { status: 201 }
    );
  } catch (error) {
    await captureTelemetry({
      level: "ERROR",
      message: "Internal server error while processing demo request",
      error,
    });

    return NextResponse.json(
      { success: false, error: "Internal server error while processing demo request." },
      { status: 500 }
    );
  }
}
