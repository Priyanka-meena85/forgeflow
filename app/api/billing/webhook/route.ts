import Stripe from "stripe";
import { db } from "@/lib/db";
import { errorResponse } from "@/lib/http";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secretKey || !webhookSecret) {
    return errorResponse("Stripe webhook is not configured.", 503);
  }
  if (!signature) return errorResponse("Missing Stripe signature.", 400);

  const stripe = new Stripe(secretKey);
  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return errorResponse("Invalid Stripe signature.", 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const organizationId = session.metadata?.organizationId ?? session.client_reference_id;
    const plan = session.metadata?.plan;
    if (organizationId && (plan === "starter" || plan === "growth")) {
      await db.organization.update({
        where: { id: organizationId },
        data: {
          plan,
          stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
          stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : null,
        },
      });
    }
  } else if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object;
    const organizationId = subscription.metadata.organizationId;
    if (organizationId) {
      const isActive = event.type !== "customer.subscription.deleted" && subscription.status === "active";
      await db.organization.update({
        where: { id: organizationId },
        data: {
          plan: isActive ? subscription.metadata.plan ?? "starter" : "free",
          stripeSubscriptionId: isActive ? subscription.id : null,
        },
      });
    }
  }

  return Response.json({ received: true });
}
