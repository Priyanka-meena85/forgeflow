import Stripe from "stripe";
import { getSessionUser } from "@/lib/auth";
import { errorResponse } from "@/lib/http";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PLAN_CONFIGS } from "@/lib/billing";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return errorResponse("Sign in to manage billing.", 401);

  const body: unknown = await request.json().catch(() => null);
  const planRaw = body && typeof body === "object" ? (body as { plan?: unknown }).plan : null;
  const plan = typeof planRaw === "string" ? planRaw.toLowerCase() : "pilot";

  const targetPlan = PLAN_CONFIGS[plan] || PLAN_CONFIGS.pilot;

  // Development / Demo Mode Mock Checkout (if Stripe Secret Key is not configured)
  if (!process.env.STRIPE_SECRET_KEY) {
    if (user.organizationId) {
      await db.organization.update({
        where: { id: user.organizationId },
        data: {
          plan: targetPlan.id,
          monthlyPagesLimit: targetPlan.monthlyLimit,
          subscriptionStatus: "active",
        },
      }).catch((e) => console.warn("Could not update org plan in mock checkout:", e));
    }
    const origin = new URL(request.url).origin;
    return NextResponse.json({
      url: `${origin}/?billing=success&plan=${targetPlan.id}&mock=true`,
      isMock: true,
      message: `Demo checkout: Upgraded organization to ${targetPlan.name} (${targetPlan.monthlyLimit} pages/mo).`,
    });
  }

  const priceId =
    plan === "growth"
      ? process.env.STRIPE_GROWTH_PRICE_ID
      : plan === "fleet"
      ? process.env.STRIPE_FLEET_PRICE_ID
      : process.env.STRIPE_STARTER_PRICE_ID || process.env.STRIPE_PILOT_PRICE_ID;

  if (!priceId) {
    return errorResponse(`Stripe price ID is not configured for plan ${plan}. Add to your environment variables.`, 503);
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const origin = new URL(request.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email,
    client_reference_id: user.organizationId,
    metadata: { organizationId: user.organizationId, plan: targetPlan.id },
    subscription_data: { metadata: { organizationId: user.organizationId, plan: targetPlan.id } },
    success_url: `${origin}/?billing=success&plan=${targetPlan.id}`,
    cancel_url: `${origin}/?billing=cancelled`,
  });

  if (!session.url) return errorResponse("Stripe did not return a checkout URL.", 502);
  return NextResponse.json({ url: session.url });
}
