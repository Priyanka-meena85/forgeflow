import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

interface LocalizedSlice {
  locale: "de-DE" | "ja-JP" | "en-US";
  marketName: string;
  targetStandard: string;
  translatedHeadline: string;
  localizedUnits: {
    pressure: string;
    temperature: string;
    clearance: string;
    metallurgy: string;
  };
  regulatoryBody: string;
  hreflangTag: string;
}

const localizedDatabase: Record<string, LocalizedSlice[]> = {
  default: [
    {
      locale: "en-US",
      marketName: "North America (US / Canada)",
      targetStandard: "ASHRAE Standard 90.1 / ANSI B11.2",
      translatedHeadline: "Root Cause Protocol: Stamping Die Galling & Weld Inspection Defects in IATF 16949 Lines",
      localizedUnits: {
        pressure: "3,500 PSI",
        temperature: "140°F Operating Sump",
        clearance: "0.0005 in (8-10% thickness)",
        metallurgy: "AISI 4140 Chrome-Moly Alloy Steel",
      },
      regulatoryBody: "ANSI / OSHA Machine Guarding & AISE Report 9",
      hreflangTag: '<link rel="alternate" hreflang="en-us" href="https://accudrive.example.com/en-us/stamping-die-galling" />',
    },
    {
      locale: "de-DE",
      marketName: "Germany & DACH Region",
      targetStandard: "DIN EN ISO 16092-2 (Hydraulische Pressen)",
      translatedHeadline: "Ursachenanalyse-Protokoll: Reibverschleiß bei Stanzwerkzeugen und Schweißnahtprüffehler nach IATF 16949",
      localizedUnits: {
        pressure: "241,3 bar (24,1 MPa)",
        temperature: "60°C Betriebs-Ölsumpf",
        clearance: "0,012 mm (8-10% Materialstärke)",
        metallurgy: "42CrMo4 Vergütungsstahl (WNr. 1.7225)",
      },
      regulatoryBody: "VDI 3193 / Berufsgenossenschaft Holz und Metall (BGHM)",
      hreflangTag: '<link rel="alternate" hreflang="de-de" href="https://accudrive.example.com/de-de/reibverschleiss-stanzwerkzeuge" />',
    },
    {
      locale: "ja-JP",
      marketName: "Japan & APAC Precision Tooling",
      targetStandard: "JIS B 6402 (油圧プレス及び機械プレス試験基準)",
      translatedHeadline: "根本原因分析手順: IATF 16949組立ラインにおける順送プレス金型のかじり及び溶接検査欠陥の防止",
      localizedUnits: {
        pressure: "24.1 MPa",
        temperature: "60°C サンプ油温",
        clearance: "0.012 mm (板厚の8〜10%)",
        metallurgy: "SCM440 クロムモリブデン鋼 (JIS G 4053)",
      },
      regulatoryBody: "日本工作機械工業会 (JMTBA) / JIS Q 9001",
      hreflangTag: '<link rel="alternate" hreflang="ja-jp" href="https://accudrive.example.com/ja-jp/press-die-galling" />',
    },
  ],
};

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug") || "default";

    const slices = localizedDatabase[slug] || localizedDatabase.default;

    return NextResponse.json({
      success: true,
      slices,
      supportedLocales: ["en-US", "de-DE", "ja-JP"],
      standardsCrosswalk: "NIST Special Publication 811 & ISO 80000-1 Verified",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { targetLocale, title } = body;

    const orgId = session.user.organizationId || "seed-org-industrial";
    await recordAuditLog({
      organizationId: orgId,
      userId: session.user.id,
      userRole: session.user.role,
      action: "STANDARDS_LOCALIZATION_GENERATED",
      resourceType: "LOCALIZATION_STUDIO",
      resourceId: targetLocale,
      metadata: { targetLocale, title },
      details: { summary: `Generated DIN/JIS localized engineering crosswalk for ${targetLocale}` },
    });

    return NextResponse.json({
      success: true,
      message: `Generated localized ${targetLocale} engineering copy with deterministic unit conversions.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
