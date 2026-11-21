import { NextResponse } from "next/server";
import { sendDemoRequestNotification } from "@/lib/email";
import { validateDemoRequest } from "@/lib/validation";
import { captureTelemetry } from "@/lib/telemetry";

export async function POST(request: Request) {
  try {
    const rawBody = await request.json().catch(() => null);
    const validation = validateDemoRequest(rawBody);

    if (!validation.success || !validation.data) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const { name, email, company, companySize, industry, useCase } = validation.data;

    // Dispatch real transactional notification via Resend / Dev console fallback
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
