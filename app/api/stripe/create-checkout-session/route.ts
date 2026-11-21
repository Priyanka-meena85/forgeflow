import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { priceId, planName, billingCycle } = body;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:8080";
    const secretKey = process.env.STRIPE_SECRET_KEY;

    // Graceful fallback for development / test mode when real Stripe keys are not configured
    if (!secretKey || secretKey === "sk_test_placeholder" || secretKey.startsWith("sk_test_")) {
      console.info(
        `[Stripe Checkout Demo Mode] Initiating pilot for plan: ${planName || "Industrial"} (${billingCycle || "annual"}). Redirecting to demo/checkout.`
      );
      return NextResponse.json({
        url: `${baseUrl}/demo?plan=${encodeURIComponent(planName || "growth")}&billing=${billingCycle || "annual"}&flow=checkout`,
      });
    }

    // Real production Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      metadata: {
        planName: planName || "Growth",
        billingCycle: billingCycle || "annual",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[Stripe Session Creation Error]:", error);
    return NextResponse.json(
      { error: "Failed to generate checkout session" },
      { status: 500 }
    );
  }
}
