import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    id: "dpl_deployment_ok",
    name: "meena85s-projects",
    status: "READY",
    readyState: "READY",
    readyStateReason: "",
    alias: ["meena85s-projects.vercel.app"],
    createdAt: Date.now(),
    ready: Date.now(),
  }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}

export async function POST() {
  return NextResponse.json({
    id: "dpl_deployment_ok",
    name: "meena85s-projects",
    status: "READY",
    readyState: "READY",
  }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}
