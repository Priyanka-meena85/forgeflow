import Stripe from "stripe";
import { db } from "@/lib/db";
import { errorResponse } from "@/lib/http";
import { getPlanConfig } from "@/lib/billing";
import { logAuditEvent } from "@/lib/audit";

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

  // 1. Strict 300-Second Replay Defense Window
  const nowUnix = Math.floor(Date.now() / 1000);
  if (Math.abs(nowUnix - event.created) > 300) {
    console.warn(`[Stripe Webhook] Replay window exceeded. Event timestamp: ${event.created}, current: ${nowUnix}`);
    return errorResponse("Webhook replay threshold exceeded (300s window).", 400);
  }

  // 2. Serverless Durable Deduplication (PostgreSQL-backed Idempotency)
  try {
    const existingEvent = await db.auditLog.findFirst({
      where: {
        action: `STRIPE_EVENT_PROCESSED:${event.id}`,
      },
    });
    if (existingEvent) {
      return Response.json({ received: true, deduplicated: true });
    }
  } catch (dedupErr) {
    console.warn("[Stripe Webhook] DB dedup check fallback:", dedupErr);
  }

  // Process the webhook events
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const organizationId = session.metadata?.organizationId ?? session.client_reference_id;
    const plan = session.metadata?.plan || "pilot";
    const config = getPlanConfig(plan);

    if (organizationId) {
      await db.organization.update({
        where: { id: organizationId },
        data: {
          plan,
          subscriptionStatus: "active",
          monthlyPagesLimit: config.monthlyLimit,
          monthlyPagesUsed: 0,
          billingCycleStart: new Date(),
          stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
          stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : null,
        },
      });

      await logAuditEvent({
        organizationId,
        action: "SUBSCRIPTION_UPDATED",
        resourceType: "ORGANIZATION",
        resourceId: organizationId,
        details: `Upgraded to ${config.name} (${config.monthlyLimit} pages/mo).`,
      });
    }
  } else if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object;
    const organizationId = subscription.metadata?.organizationId;
    if (organizationId) {
      const isDeleted = event.type === "customer.subscription.deleted";
      const isActive = !isDeleted && subscription.status === "active";
      const targetPlan = isActive ? (subscription.metadata?.plan ?? "pilot") : "free";
      const config = getPlanConfig(targetPlan);

      await db.organization.update({
        where: { id: organizationId },
        data: {
          plan: targetPlan,
          subscriptionStatus: isDeleted ? "canceled" : subscription.status,
          monthlyPagesLimit: config.monthlyLimit,
          stripeSubscriptionId: isActive ? subscription.id : null,
        },
      });

      await logAuditEvent({
        organizationId,
        action: "SUBSCRIPTION_UPDATED",
        resourceType: "ORGANIZATION",
        resourceId: organizationId,
        details: `Subscription status updated: ${subscription.status} (Plan: ${config.name}).`,
      });
    }
  } else if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object;
    const customerId = typeof invoice.customer === "string" ? invoice.customer : null;
    if (customerId) {
      const org = await db.organization.findUnique({ where: { stripeCustomerId: customerId } });
      if (org) {
        await db.organization.update({
          where: { id: org.id },
          data: { subscriptionStatus: "past_due" },
        });
      }
    }
  }

  // 3. Mark event as processed in durable database
  try {
    const org = await db.organization.findFirst({ select: { id: true } });
    if (org) {
      await db.auditLog.create({
        data: {
          organizationId: org.id,
          action: `STRIPE_EVENT_PROCESSED:${event.id}`,
          resourceType: "STRIPE_WEBHOOK",
          resourceId: event.id,
          diffJson: JSON.stringify({ type: event.type, created: event.created }),
          ipAddress: "stripe-webhook",
        },
      });
    }
  } catch (markErr) {
    console.warn("[Stripe Webhook] Failed to mark event processed in DB:", markErr);
  }

  return Response.json({ received: true });
}
