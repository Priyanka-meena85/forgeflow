import { NextResponse } from "next/server";
import { sendContactSalesNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, message } = body;

    if (!name || !email || !company) {
      return NextResponse.json(
        { success: false, error: "Name, email, and company are mandatory." },
        { status: 400 }
      );
    }

    // Dispatch real transactional email alert
    await sendContactSalesNotification({
      name,
      email,
      company,
      message,
    });

    console.info(`[Contact Sales Lead] ${name} <${email}> from ${company}`);

    return NextResponse.json({
      success: true,
      message: "Thank you. Our enterprise solution team will respond within 24 hours.",
    });
  } catch (err) {
    console.error("[Contact Sales Error]:", err);
    return NextResponse.json(
      { success: false, error: "Failed to process message." },
      { status: 500 }
    );
  }
}
