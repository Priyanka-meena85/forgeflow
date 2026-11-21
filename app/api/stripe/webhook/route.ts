import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { getPlanConfig } from "@/lib/billing";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");

    // If webhook secret isn't provided or in dev mode, acknowledge gracefully
    if (!webhookSecret || webhookSecret === "whsec_placeholder") {
      console.info("[Stripe Webhook Dev Notice]: Webhook received in test mode.");
      return NextResponse.json({ received: true });
    }

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as {
          id: string;
          customer?: string | null;
          subscription?: string | null;
          customer_email?: string | null;
          metadata?: Record<string, string> | null;
        };

        const customerId = session.customer ? String(session.customer) : null;
        const subscriptionId = session.subscription ? String(session.subscription) : null;
        const customerEmail = session.customer_email || session.metadata?.email;
        const planName = (session.metadata?.planName || "growth").toLowerCase();
        const planConfig = getPlanConfig(planName);

        console.info(`[Stripe Webhook] Processing activation for: ${customerEmail || customerId} -> ${planConfig.name}`);

        if (customerEmail) {
          const user = await db.user.findUnique({
            where: { email: customerEmail.toLowerCase().trim() },
            include: { organization: true },
          });

          if (user && user.organizationId) {
            await db.organization.update({
              where: { id: user.organizationId },
              data: {
                plan: planConfig.id,
                subscriptionStatus: "active",
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
                monthlyPagesLimit: planConfig.monthlyLimit,
                monthlyPagesUsed: 0,
                billingCycleStart: new Date(),
              },
            });
            console.info(`[Stripe Webhook] Organization ${user.organizationId} upgraded to ${planConfig.name}`);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as { id: string; customer?: string | null };
        const subId = subscription.id;

        const org = await db.organization.findFirst({
          where: { stripeSubscriptionId: subId },
        });

        if (org) {
          await db.organization.update({
            where: { id: org.id },
            data: {
              plan: "free",
              subscriptionStatus: "canceled",
              monthlyPagesLimit: 2,
            },
          });
          console.info(`[Stripe Webhook] Organization ${org.id} subscription canceled.`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as { subscription?: string | null };
        if (invoice.subscription) {
          const org = await db.organization.findFirst({
            where: { stripeSubscriptionId: String(invoice.subscription) },
          });
          if (org) {
            await db.organization.update({
              where: { id: org.id },
              data: { subscriptionStatus: "past_due" },
            });
            console.warn(`[Stripe Webhook] Organization ${org.id} marked as past_due.`);
          }
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as { subscription?: string | null };
        if (invoice.subscription) {
          const org = await db.organization.findFirst({
            where: { stripeSubscriptionId: String(invoice.subscription) },
          });
          if (org) {
            await db.organization.update({
              where: { id: org.id },
              data: {
                subscriptionStatus: "active",
                monthlyPagesUsed: 0,
                billingCycleStart: new Date(),
              },
            });
            console.info(`[Stripe Webhook] Organization ${org.id} billing cycle reset.`);
          }
        }
        break;
      }

      default:
        console.info(`[Stripe Webhook] Event received: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook Error]:", error);
    return NextResponse.json(
      { error: "Webhook handler execution failed" },
      { status: 400 }
    );
  }
}
