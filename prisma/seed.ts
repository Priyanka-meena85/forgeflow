import { PrismaClient, UserRole, DraftStatus, ReviewStatus } from "@prisma/client";
import { randomBytes, scrypt as nodeScrypt } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(nodeScrypt);
const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const key = (await scrypt(password, salt, 64)) as Buffer;
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

  const draft = await prisma.draft.upsert({
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

  // 4. Create Expert Reviewers
  const reviewer1 = await prisma.expertReviewer.upsert({
    where: { id: "rev_marcus_vance" },
    update: { organizationId: org.id },
    create: {
      id: "rev_marcus_vance",
      organizationId: org.id,
      name: "Dr. Marcus Vance, PE",
      jobTitle: "Lead Thermal & Mechanical Applications Engineer",
      credentials: "PE, ASHRAE Fellow, MS Mechanical Engineering",
      yearsOfExperience: 18,
      linkedInUrl: "https://www.linkedin.com/in/marcus-vance-pe-industrial",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      bio: "18+ years specializing in commercial HVAC rooftop unit failure mode diagnostics, ASHRAE 90.1/189.1 compliance, and industrial refrigeration compressor reliability.",
    },
  });

  await prisma.expertReviewer.upsert({
    where: { id: "rev_elena_rostova" },
    update: { organizationId: org.id },
    create: {
      id: "rev_elena_rostova",
      organizationId: org.id,
      name: "Elena Rostova",
      jobTitle: "Principal Industrial Systems & Reliability Lead",
      credentials: "Six Sigma Black Belt, IATF 16949 Lead Auditor",
      yearsOfExperience: 14,
      linkedInUrl: "https://www.linkedin.com/in/elena-rostova-industrial-qa",
      photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
      bio: "14 years conducting root-cause failure analysis for automotive stamping presses, sanitary rotary pumps, and polymer extrusion machinery under ISO 9001 and 3-A standards.",
    },
  });

  await prisma.expertReviewer.upsert({
    where: { id: "rev_david_chen" },
    update: { organizationId: org.id },
    create: {
      id: "rev_david_chen",
      organizationId: org.id,
      name: "David Chen, CMRP",
      jobTitle: "Senior Fluid Power & Hydraulics Specialist",
      credentials: "CMRP, CFPS (Fluid Power Specialist)",
      yearsOfExperience: 12,
      linkedInUrl: "https://www.linkedin.com/in/david-chen-fluid-power",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      bio: "Certified fluid power specialist focusing on high-pressure hydraulic piston pump cavitation, ISO 4406 cleanliness standards, and industrial automation safety protocols.",
    },
  });

  // 5. Create Approved Page Review for Seed Draft
  const verificationChecklist = [
    "Spec Accuracy: Verified 180-240 bar descaler pressure envelope against OEM manual.",
    "Standards Referenced: Cross-referenced with active regulatory codes (ISO/ASME/ASHRAE/3-A).",
    "Operating Tolerances: Confirmed pressure, thermal differential, and fatigue thresholds.",
    "AEO Schema Validity: Validated multi-entity JSON-LD graphs with reviewedBy Person entity.",
  ];

  await prisma.pageReview.upsert({
    where: { draftId: draft.id },
    update: {
      reviewerId: reviewer1.id,
      status: ReviewStatus.APPROVED,
      reviewerNotes: "Verified compliant with IATF 16949 SOP, AISE Technical Report No. 9, and AEO structured data standards.",
      verificationItemsJson: JSON.stringify(verificationChecklist),
    },
    create: {
      draftId: draft.id,
      reviewerId: reviewer1.id,
      status: ReviewStatus.APPROVED,
      reviewDate: new Date(),
      reviewerNotes: "Verified compliant with IATF 16949 SOP, AISE Technical Report No. 9, and AEO structured data standards.",
      verificationItemsJson: JSON.stringify(verificationChecklist),
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
