import { NextRequest, NextResponse } from "next/server";
import { getAvailableWidgets, getRecommendedWidgetForVertical } from "@/lib/interactiveWidgets";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const vertical = searchParams.get("vertical");

  const allWidgets = getAvailableWidgets();
  const recommended = vertical ? getRecommendedWidgetForVertical(vertical) : allWidgets[0];

  return NextResponse.json({
    success: true,
    count: allWidgets.length,
    recommendedWidgetId: recommended.id,
    widgets: allWidgets,
  });
}
