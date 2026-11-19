import Stripe from "stripe";
import { db } from "@/lib/db";

export interface PlanConfig {
  id: string;
  name: string;
  monthlyLimit: number;
  monthlyPriceUsd: number;
  description: string;
}

export const PLAN_CONFIGS: Record<string, PlanConfig> = {
  free: {
    id: "free",
    name: "Free Trial",
    monthlyLimit: 2,
    monthlyPriceUsd: 0,
    description: "Trial sandbox for industrial taxonomy exploration",
  },
  pilot: {
    id: "pilot",
    name: "Pilot Plan",
    monthlyLimit: 5,
    monthlyPriceUsd: 199,
    description: "5 engineer-verified landing pages per month",
  },
  starter: {
    id: "starter",
    name: "Pilot Plan",
    monthlyLimit: 5,
    monthlyPriceUsd: 199,
    description: "5 engineer-verified landing pages per month",
  },
  growth: {
    id: "growth",
    name: "Growth Engine",
    monthlyLimit: 25,
    monthlyPriceUsd: 399,
    description: "25 engineer-verified landing pages per month with CMS webhooks",
  },
  fleet: {
    id: "fleet",
    name: "Fleet Dominance",
    monthlyLimit: 100,
    monthlyPriceUsd: 799,
    description: "100 engineer-verified pages per month across 7 sectors",
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise Custom",
    monthlyLimit: 500,
    monthlyPriceUsd: 1999,
    description: "Unlimited industrial taxonomies, dedicated PE review, SLA",
  },
};

export function getPlanConfig(planName?: string | null): PlanConfig {
  const key = (planName || "free").toLowerCase().trim();
  return PLAN_CONFIGS[key] || PLAN_CONFIGS.free;
}

export interface QuotaCheckResult {
  allowed: boolean;
  plan: string;
  used: number;
  limit: number;
  remaining: number;
  error?: string;
}

export async function checkQuota(
  organizationId: string,
  requestedCount: number = 1,
): Promise<QuotaCheckResult> {
  const org = await db.organization.findUnique({
    where: { id: organizationId },
  });

  if (!org) {
    return {
      allowed: false,
      plan: "free",
      used: 0,
      limit: 0,
      remaining: 0,
      error: "Organization not found.",
    };
  }

  const planConfig = getPlanConfig(org.plan);
  const limit = org.monthlyPagesLimit || planConfig.monthlyLimit;
  const used = org.monthlyPagesUsed || 0;
  const remaining = Math.max(0, limit - used);

  if (used + requestedCount > limit) {
    return {
      allowed: false,
      plan: planConfig.name,
      used,
      limit,
      remaining,
      error: `Monthly quota exceeded: You have used ${used}/${limit} pages on the ${planConfig.name}. Please upgrade to generate ${requestedCount} more page(s).`,
    };
  }

  return {
    allowed: true,
    plan: planConfig.name,
    used,
    limit,
    remaining,
  };
}

export async function recordPageUsage(organizationId: string, count: number): Promise<void> {
  try {
    const org = await db.organization.findUnique({ where: { id: organizationId } });
    if (!org) return;

    await db.organization.update({
      where: { id: organizationId },
      data: {
        monthlyPagesUsed: (org.monthlyPagesUsed || 0) + count,
      },
    });
  } catch (error) {
    console.error("[BillingEngine] Failed to increment usage quota:", error);
  }
}

export async function getBillingSummary(organizationId: string) {
  const org = await db.organization.findUnique({
    where: { id: organizationId },
  });
  if (!org) return null;

  const config = getPlanConfig(org.plan);
  const limit = org.monthlyPagesLimit || config.monthlyLimit;
  const used = org.monthlyPagesUsed || 0;

  return {
    plan: org.plan || "free",
    planName: config.name,
    monthlyLimit: limit,
    monthlyUsed: used,
    remaining: Math.max(0, limit - used),
    percentUsed: Math.min(100, Math.round((used / limit) * 100)),
    subscriptionStatus: org.subscriptionStatus || "trialing",
    hasStripeCustomer: Boolean(org.stripeCustomerId),
    hasActiveSubscription: Boolean(org.stripeSubscriptionId),
  };
}
