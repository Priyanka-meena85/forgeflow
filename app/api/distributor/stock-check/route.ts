import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { queryDistributorStock, enrichProductSchemaWithDistributorOffers } from "@/lib/distributorStockEngine";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const partNumber = searchParams.get("partNumber");

    if (!partNumber) {
      return NextResponse.json({ error: "partNumber query parameter is required." }, { status: 400 });
    }

    const offers = queryDistributorStock(partNumber);
    return NextResponse.json({ success: true, partNumber, offers });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { baseSchema, partNumber } = body;

    if (!baseSchema || typeof baseSchema !== "object" || !partNumber) {
      return NextResponse.json({ error: "baseSchema object and partNumber are required." }, { status: 400 });
    }

    const offers = queryDistributorStock(String(partNumber));
    const enrichedSchema = enrichProductSchemaWithDistributorOffers(baseSchema, offers);

    return NextResponse.json({ success: true, enrichedSchema, offersCount: offers.length });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
