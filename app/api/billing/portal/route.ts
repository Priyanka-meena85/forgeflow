import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse } from "@/lib/http";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return errorResponse("Sign in to manage billing.", 401);
  if (!process.env.STRIPE_SECRET_KEY) {
    return errorResponse("Billing is not configured. Add STRIPE_SECRET_KEY to your environment.", 503);
  }

  const organization = await db.organization.findUnique({
    where: { id: user.organizationId },
    select: { stripeCustomerId: true },
  });
  if (!organization?.stripeCustomerId) {
    return errorResponse("No Stripe customer is linked to this workspace yet.", 409);
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.billingPortal.sessions.create({
    customer: organization.stripeCustomerId,
    return_url: new URL(request.url).origin,
  });
  return NextResponse.json({ url: session.url });
}
