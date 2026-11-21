import { NextResponse } from "next/server";
import { sendDemoRequestNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, companySize, industry, useCase } = body;

    if (!name || !email || !company) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (name, email, company are mandatory)." },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid business email address." },
        { status: 400 }
      );
    }

    // Dispatch real transactional notification via Resend / Dev console fallback
    await sendDemoRequestNotification({
      name,
      email,
      company,
      companySize,
      industry,
      useCase,
    });

    console.info(`[Demo Request Registered] ${name} (${email}) for ${company}`);

    return NextResponse.json(
      {
        success: true,
        message: "Demo request registered successfully. An industrial systems engineer will contact you within 2 business hours.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Demo Request API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error while processing demo request." },
      { status: 500 }
    );
  }
}
