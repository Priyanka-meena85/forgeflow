import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse } from "@/lib/http";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return errorResponse("Sign in to access workspace settings.", 401);
  const organization = await db.organization.findUnique({
    where: { id: user.organizationId },
    select: {
      id: true,
      name: true,
      website: true,
      productDescription: true,
      industry: true,
      keywords: true,
      plan: true,
    },
  });
  if (!organization) return errorResponse("Workspace not found.", 404);
  return NextResponse.json({ organization });
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) return errorResponse("Sign in to update workspace settings.", 401);
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return errorResponse("Invalid request body.", 400);
  const input = body as Record<string, unknown>;

  const fields = ["name", "website", "productDescription", "industry", "keywords"] as const;
  for (const field of fields) {
    const value = input[field];
    if (value !== undefined && typeof value !== "string") {
      return errorResponse(`${field} must be a string.`, 400);
    }
  }
  if (typeof input.name === "string" && (input.name.trim().length < 2 || input.name.length > 100)) {
    return errorResponse("Company name must be between 2 and 100 characters.", 400);
  }
  if (typeof input.website === "string" && input.website.length > 500) {
    return errorResponse("Website URL must be 500 characters or fewer.", 400);
  }
  if (typeof input.productDescription === "string" && input.productDescription.length > 2000) {
    return errorResponse("Product description must be 2,000 characters or fewer.", 400);
  }
  if (typeof input.industry === "string" && input.industry.length > 120) {
    return errorResponse("Industry must be 120 characters or fewer.", 400);
  }
  if (typeof input.keywords === "string" && input.keywords.length > 1000) {
    return errorResponse("Keywords must be 1,000 characters or fewer.", 400);
  }

  const organization = await db.organization.update({
    where: { id: user.organizationId },
    data: {
      ...(typeof input.name === "string" ? { name: input.name.trim() } : {}),
      ...(typeof input.website === "string" ? { website: input.website.trim() || null } : {}),
      ...(typeof input.productDescription === "string"
        ? { productDescription: input.productDescription.trim() || null }
        : {}),
      ...(typeof input.industry === "string" ? { industry: input.industry.trim() || null } : {}),
      ...(typeof input.keywords === "string" ? { keywords: input.keywords.trim() || null } : {}),
    },
    select: {
      id: true,
      name: true,
      website: true,
      productDescription: true,
      industry: true,
      keywords: true,
      plan: true,
    },
  });
  return NextResponse.json({ organization });
}
