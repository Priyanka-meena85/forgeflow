import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { testCmsConnection } from "@/lib/cmsPublishing";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { provider, endpointUrl, apiKey } = body;

    if (!provider || !endpointUrl) {
      return NextResponse.json({ error: "Provider and endpointUrl are required" }, { status: 400 });
    }

    const result = await testCmsConnection({
      provider,
      endpointUrl,
      apiKey,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
