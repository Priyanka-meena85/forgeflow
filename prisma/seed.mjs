import { PrismaClient, UserRole, DraftStatus } from "@prisma/client";
import { randomBytes, scrypt as nodeScrypt } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(nodeScrypt);
const prisma = new PrismaClient();

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const key = await scrypt(password, salt, 64);
  return `${salt}:${key.toString("hex")}`;
}

async function main() {
  console.log("Seeding ForgeFlow PostgreSQL database…");

  // 1. Create or Find Initial Organization
  const org = await prisma.organization.upsert({
    where: { id: "seed-org-industrial" },
    update: {},
    create: {
      id: "seed-org-industrial",
      name: "AccuDrive Reliability Systems",
      slug: "accudrive",
      industry: "Automotive & Industrial Automation",
      website: "https://accudrive.example.com",
      productDescription: "Industrial fault detection, vibration monitoring, and predictive reliability engineering suite for automotive tier-1 manufacturing lines.",
      keywords: "servo stamping press galling, weld inspection defects, IATF 16949 compliance, predictive maintenance",
      plan: "growth",
    },
  });

  // 2. Create Initial Owner User
  const passwordHash = await hashPassword("ForgeFlow2026!");
  const user = await prisma.user.upsert({
    where: { email: "admin@accudrive.io" },
    update: {
      role: UserRole.OWNER,
      emailVerified: new Date(),
    },
    create: {
      id: "seed-usr-admin",
      email: "admin@accudrive.io",
      name: "Alex Vance (Plant Reliability Lead)",
      passwordHash,
      role: UserRole.OWNER,
      organizationId: org.id,
      emailVerified: new Date(),
    },
  });

  // 3. Create Sample Production Draft
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: "Root Cause Protocol: Stamping Die Galling & Weld Inspection Defects in IATF 16949 Assembly Lines",
        complianceStandard: "IATF 16949 Standard",
        targetEquipment: "Servo Stamping Press",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What causes stamping die galling in servo stamping presses?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Micro-welding between sheet material and tool steel under high contact pressures without adequate PVD lubrication.",
            },
          },
        ],
      },
    ],
  };

  const sections = [
    {
      heading: "01. Engineering Root Cause Analysis: Die Galling Mechanics",
      body: "High-tonnage servo stamping lines operating at >45 strokes per minute generate localized frictional heating exceeding 380°C. Micro-adhesions transfer zinc coatings to uncoated D2 or Vanadis 4 Extra tool steels, creating severe adhesive galling and scoring subsequent stampings.",
    },
    {
      heading: "02. IATF 16949 Non-Conformance Verification & Die Coating Protocol",
      body: "Plant quality engineers must implement CrN or TiAlN PVD thin-film surface treatments with hardness ratings exceeding 3,000 HV. Benchmark draw-die surface roughness to Ra < 0.15 µm before reintroducing tooling into continuous duty production.",
    },
    {
      heading: "03. Download Certified Servo Stamping Die Maintenance Checklist (IATF 16949)",
      body: "Standardize shift inspections, lubrication audit intervals, and optical die clearance calibration using our downloadable plant engineering SOP.",
    },
  ];

  const faqs = [
    {
      q: "What is the recommended die surface treatment under IATF 16949?",
      a: "PVD CrN or TiAlN multi-layer coatings rated above 3,000 HV with substrate pre-hardening to 60-62 HRC.",
    },
    {
      q: "How frequently should lubricant viscosity be measured on servo lines?",
      a: "Continuous in-line refractive index telemetry with manual laboratory titrations conducted every 10,000 stamped parts.",
    },
  ];

  const qaScores = {
    wordCount: "Pass",
    faqCount: "Pass",
    ctaCount: "Pass",
    linkAllowlist: "Pass",
    uniqueness: "Pass",
    fluffFilter: "Pass",
    aeoCapsule: "Pass",
    riskScore: "Low",
  };

  await prisma.draft.upsert({
    where: { id: "seed-draft-automotive" },
    update: {},
    create: {
      id: "seed-draft-automotive",
      organizationId: org.id,
      authorId: user.id,
      title: "Root Cause Protocol: Stamping Die Galling & Weld Inspection Defects in IATF 16949 Assembly Lines",
      keyword: "servo stamping press die galling IATF 16949",
      vertical: "Automotive & Tier-1 Stamping",
      targetEquipment: "Servo Stamping Press",
      complianceStandard: "IATF 16949 Standard",
      summary: "Deterministic engineering protocol for automotive plant reliability managers preventing die galling and weld inspection non-conformances in IATF 16949 certified production lines.",
      sectionsJson: JSON.stringify(sections),
      faqsJson: JSON.stringify(faqs),
      schemaJson: JSON.stringify(schema),
      qaScoresJson: JSON.stringify(qaScores),
      status: DraftStatus.APPROVED,
      pipelineValueMin: 150000,
      pipelineValueMax: 600000,
      searchVolume: "20-40/mo",
      specRiskScore: 1.7,
      reviewComment: "Verified compliant with IATF 16949 SOP and AEO readiness gates.",
    },
  });

  console.log("Seeding complete! User created: admin@accudrive.io (Password: ForgeFlow2026!)");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
