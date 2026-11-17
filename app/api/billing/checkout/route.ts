import Stripe from "stripe";
import { getSessionUser } from "@/lib/auth";
import { errorResponse } from "@/lib/http";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return errorResponse("Sign in to manage billing.", 401);
  if (!process.env.STRIPE_SECRET_KEY) {
    return errorResponse("Billing is not configured. Add STRIPE_SECRET_KEY to your environment.", 503);
  }

  const body: unknown = await request.json().catch(() => null);
  const plan = body && typeof body === "object" ? (body as { plan?: unknown }).plan : null;
  if (plan !== "starter" && plan !== "growth") {
    return errorResponse("Choose a supported plan.", 400);
  }
  const priceId =
    plan === "starter" ? process.env.STRIPE_STARTER_PRICE_ID : process.env.STRIPE_GROWTH_PRICE_ID;
  if (!priceId) return errorResponse(`Configure STRIPE_${plan.toUpperCase()}_PRICE_ID to continue.`, 503);

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const origin = new URL(request.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email,
    client_reference_id: user.organizationId,
    metadata: { organizationId: user.organizationId, plan },
    subscription_data: { metadata: { organizationId: user.organizationId, plan } },
    success_url: `${origin}/?billing=success`,
    cancel_url: `${origin}/?billing=cancelled`,
  });
  if (!session.url) return errorResponse("Stripe did not return a checkout URL.", 502);
  return NextResponse.json({ url: session.url });
}
