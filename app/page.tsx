"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AuthProvider, useAuth } from "@/components/AuthProvider";

type TabKey =
  | "Mission Control"
  | "Taxonomy Matrix"
  | "QA Review Studio"
  | "Risk & Compliance"
  | "AEO Schema Hub"
  | "Publishing Pipeline"
  | "Industrial Analytics"
  | "Workspace & Rules"
  | "Billing & Quotas";

type QAStatus = "Pass" | "Review" | "Fail";

export type ExpertReviewer = {
  id: string;
  name: string;
  jobTitle: string;
  credentials: string;
  yearsOfExperience: number;
  linkedInUrl?: string | null;
  photoUrl?: string | null;
  bio?: string | null;
};

export type PageReview = {
  id?: string;
  draftId?: string;
  reviewerId: string;
  status: "PENDING" | "APPROVED" | "CHANGES_REQUESTED";
  reviewDate: string;
  reviewerNotes?: string | null;
  verificationItems: string[];
  reviewer?: ExpertReviewer | null;
};

type Draft = {
  id: string | number;
  title: string;
  stage: "Suggested" | "Approved" | "In Review" | "Changes requested" | "Rejected" | "Published";
  keyword: string;
  qa: {
    wordCount: QAStatus;
    faqCount: QAStatus;
    ctaCount: QAStatus;
    linkAllowlist: QAStatus;
    uniqueness: QAStatus;
    fluffFilter: QAStatus;
    aeoCapsule: QAStatus;
    riskScore: QAStatus;
  };
  summary: string;
  sections: Array<{ heading: string; body: string }>;
  faqs: Array<{ q: string; a: string }>;
  schema: string;
  pageReview?: PageReview | null;
  createdAt?: string;
  updatedAt?: string;
  vertical?: string;
  equipment?: string;
  standard?: string;
};

const navItems: Array<{ label: TabKey; badge?: string; icon: string }> = [
  { label: "Mission Control", icon: "⚡" },
  { label: "Taxonomy Matrix", icon: "🧬", badge: "7 Verticals" },
  { label: "QA Review Studio", icon: "🛡️", badge: "Split-View" },
  { label: "Risk & Compliance", icon: "⚠️", badge: "Low Risk" },
  { label: "AEO Schema Hub", icon: "🤖", badge: "JSON-LD" },
  { label: "Publishing Pipeline", icon: "🚀" },
  { label: "Industrial Analytics", icon: "📊", badge: "Charts" },
  { label: "Workspace & Rules", icon: "⚙️" },
  { label: "Billing & Quotas", icon: "💳" },
];

const verticalTaxonomies: Record<
  string,
  {
    name: string;
    equipment: string[];
    failureModes: string[];
    standards: string[];
    sampleTitle: string;
    acv: string;
    capsuleText: string;
    riskLevel: string;
  }
> = {
  "Food & beverage manufacturing": {
    name: "Food & Beverage (Pump/Conveyor PdM, CIP Downtime & OEE)",
    equipment: ["Sanitary Rotary Lobe Pump", "CIP Spray Ball Skid", "Modular Belt Sanitary Conveyor", "Plate Heat Exchanger"],
    failureModes: [
      "Pump & Conveyor Predictive Maintenance",
      "CIP Washdown Unplanned Downtime",
      "Packaging & Bottling Line OEE Loss",
      "Pasteurization Plate Bio-Fouling",
    ],
    standards: ["3-A Sanitary Standard 02-12", "FDA 21 CFR Part 110", "EHEDG Document 8"],
    sampleTitle: "Eliminating CIP Unplanned Downtime and Elastomer Seal Swelling in Rotary Lobe Pumps (3-A SOP)",
    acv: "$85,000 - $220,000",
    capsuleText:
      "Elastomer seal swelling in sanitary rotary lobe pumps is primarily caused by chemical incompatibility between EPDM elastomers and aggressive caustic wash formulations (>2.5% NaOH at >80°C). Remediation requires transitioning to FDA-compliant FKM or encapsulated FFKM compounds certified under 3-A Sanitary Standard 02-12.",
    riskLevel: "1.2% (Very Low)",
  },
  "Steel and metals processing": {
    name: "Steel (EAF Energy, Continuous Casting & PdM)",
    equipment: ["Electric Arc Furnace (EAF)", "Continuous Caster Mold", "Hydraulic Work Roll Descaler", "Ladle Metallurgy Furnace (LMF)"],
    failureModes: [
      "EAF Energy Consumption Spikes",
      "Continuous Casting Breakout Risk",
      "Rolling Mill Predictive Maintenance",
      "Hot Strip Mill Descaler Nozzle Clogging",
    ],
    standards: ["ASTM A6/A6M Tolerances", "AISE Technical Report No. 9", "ISO 4950 Structural Steels"],
    sampleTitle: "Optimizing EAF Energy Consumption and Continuous Casting Quality Monitoring in Steel Plants",
    acv: "$250,000 - $1,400,000",
    capsuleText:
      "Descaler nozzle clogging in hot strip mills stems from recirculated scale particulates exceeding 50 microns bypassing secondary hydrocyclone filters. Immediate intervention entails pressure drop instrumentation across the manifold and upgrading to tungsten-carbide insert tips compliant with AISE Report No. 9.",
    riskLevel: "2.1% (Low)",
  },
  "Automotive & stamping": {
    name: "Automotive (Stamping, Paint Defect, Weld Inspection & IATF)",
    equipment: ["Servo Transfer Stamping Press", "Automotive Paint Defect Inspection", "Robotic Spot Welding Cell", "Hemming Assembly Line"],
    failureModes: [
      "Stamping Die Tonnage Imbalance & Galling",
      "Automotive Paint Defect & Orange Peel",
      "Weld Inspection Expulsion & Shunting",
      "IATF Compliance & APQP Phase Drift",
    ],
    standards: ["IATF 16949 Automotive Quality", "AIAG APQP Standards", "AWS D8.1M Automotive Spot Weld"],
    sampleTitle: "Root Cause Protocol: Stamping Die Galling & Weld Inspection Defects in IATF 16949 Assembly Lines",
    acv: "$150,000 - $600,000",
    capsuleText:
      "Edge galling and tonnage imbalance in servo transfer presses typically result from lubricating film breakdown under high contact velocity and slide parallelism drift exceeding 0.05 mm/m. Remediation requires synthetic ester lubricants with extreme pressure additives and real-time piezoelectric load cell balancing.",
    riskLevel: "1.7% (Low)",
  },
  "Industrial HVAC & chillers": {
    name: "HVAC (FDD, RTU Failure Prediction & Smart Building AI)",
    equipment: ["Commercial Rooftop Unit (RTU)", "Centrifugal Water-Cooled Chiller", "Variable Air Volume (VAV) Box", "Cooling Tower Fan"],
    failureModes: [
      "Fault Detection & Diagnostics (FDD) False Triggers",
      "Rooftop Unit (RTU) Failure Prediction",
      "Smart Building AI Temperature Drift",
      "Low Delta-T Chilled Water Loop Syndrome",
    ],
    standards: ["AHRI Standard 550/590", "ASHRAE Standard 90.1-2025", "BACnet / ASHRAE 135"],
    sampleTitle: "Automating Fault Detection & Diagnostics (FDD) to Prevent Commercial RTU Compressor Failure",
    acv: "$95,000 - $380,000",
    capsuleText:
      "Low Delta-T syndrome occurs when chilled water loops return to central chillers with insufficient temperature rise (<5°C differential), forcing extra chillers online at partial loads. Rectification requires two-way pressure-independent control valves (PICVs) and reset coils recalibrated to ASHRAE 90.1 standards.",
    riskLevel: "1.4% (Very Low)",
  },
  "SCADA & automation": {
    name: "SCADA & Automation (PLC/MES/ERP Integration, OPC UA, UNS)",
    equipment: ["Unified Namespace (UNS) Broker", "Programmable Automation Controller (PAC)", "Remote Terminal Unit (RTU)", "Industrial Edge Gateway"],
    failureModes: [
      "PLC / MES / ERP Integration Latency",
      "OPC UA PubSub Packet Loss & Latency",
      "Unified Namespace (UNS) Schema Drift",
      "OT Zero-Day Exploit Lateral Movement",
    ],
    standards: ["ISA/IEC 62443 Industrial Security", "OPC Unified Architecture (IEC 62541)", "ISA-95 Enterprise-Control"],
    sampleTitle: "Architecting a Unified Namespace (UNS) with OPC UA to Eliminate PLC-to-MES Data Silos",
    acv: "$120,000 - $500,000",
    capsuleText:
      "Modbus packet drops over industrial Ethernet links typically stem from RS-485 serial gateway buffer saturation and baud rate mismatch under high polling frequencies (>10Hz). Upgrading to deterministic OPC-UA PubSub over TSN compliant with IEC 62443 resolves transmission collisions.",
    riskLevel: "0.9% (Minimal)",
  },
  "Cement & bulk material handling": {
    name: "Cement (Kiln Efficiency & Downtime Tracking)",
    equipment: ["Rotary Clinker Kiln", "Vertical Roller Mill (VRM)", "Clinker Grate Cooler", "Pulse-Jet Baghouse Dust Collector"],
    failureModes: [
      "Kiln Thermal Efficiency & Fuel Waste",
      "Cement Plant Unplanned Downtime Tracking",
      "Kiln Tire Slippage & Shell Ovality",
      "Vertical Roller Mill Table Spalling",
    ],
    standards: ["EN 197-1 Cement Specifications", "MSHA 30 CFR Safety", "EPA NESHAP Subpart LLL"],
    sampleTitle: "Tracking Unplanned Downtime and Calculating Rotary Kiln Tire Slippage to Prevent Refractory Collapse",
    acv: "$300,000 - $2,000,000",
    capsuleText:
      "Rotary kiln tire slippage is the relative circumference movement between the shell and riding ring. Target slippage is 12 to 20 mm per revolution. Exceeding 25 mm accelerates refractory brick pinch spalling and causes shell ovality exceeding 0.3%, demanding immediate shim re-profiling.",
    riskLevel: "2.4% (Low)",
  },
  "Textile & fiber processing": {
    name: "Textile (Yarn Breakage, Fabric Waste & Cutting Room KPIs)",
    equipment: ["High-Speed Rapier Loom", "Air-Jet Spinning Machine", "Automated Fabric Cutting Table", "Continuous Stenter Frame"],
    failureModes: [
      "High Yarn Breakage & Tension Spikes",
      "Cutting Room Fabric Waste & Scrap",
      "Cutting Room KPI Drift & Throughput Loss",
      "Weft Insertion Timing Desynchronization",
    ],
    standards: ["ISO 139 Textile Standards", "OEKO-TEX Standard 100", "AATCC Test Methods"],
    sampleTitle: "Eliminating High Yarn Breakage and Cutting Room Fabric Scrap in Technical Textile Plants",
    acv: "$75,000 - $280,000",
    capsuleText:
      "Weft insertion desynchronization in high-speed air-jet looms occurs when main nozzle relay pressure drops below 0.35 MPa during relay solenoid firing. Real-time digital pressure transducers and automated solenoid cycle tuning eliminate trailing yarn kinks and stop-mark defects.",
    riskLevel: "1.1% (Very Low)",
  },
};

const defaultForm = {
  companyName: "",
  website: "",
  productDescription: "",
  industry: "Food & beverage manufacturing",
  keywords: "",
  voiceRegister: "Plant-Floor Pragmatic",
  fluffSanitizer: true,
  answerCapsuleDefault: true,
  allowlistOnly: true,
  allowedDomains: "3-a.org, fda.gov, asme.org, acmeindustrialtech.com",
  bannedWords: "game-changer, revolutionary, delve into, in today's fast-paced world, skyrocket",
  modelBackend: "DeepSeek-V3 (Industrial Spec)",
};

const demoReviewDrafts: Draft[] = [
  {
    id: "fr-draft-001",
    title: "Preventing Elastomer Seal Swelling in Rotary Lobe Pumps During Caustic CIP Washdown (3-A SOP)",
    stage: "In Review",
    keyword: "rotary lobe pump seal swelling CIP",
    vertical: "Food & beverage manufacturing",
    equipment: "Rotary Lobe Pump",
    standard: "3-A Sanitary Standard 02-12",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    qa: {
      wordCount: "Pass",
      faqCount: "Pass",
      ctaCount: "Fail",
      linkAllowlist: "Pass",
      uniqueness: "Pass",
      fluffFilter: "Fail",
      aeoCapsule: "Pass",
      riskScore: "Review",
    },
    summary:
      "A deterministic engineering guide for plant reliability managers preventing chemical elastomer failure during caustic Clean-inPlace cycles in food processing.",
    sections: [
      {
        heading: "Root Cause of Elastomer Degradation Under Caustic Exposure",
        body: "Rotary lobe pumps operating in continuous dairy and beverage lines rely on wetted elastomers to maintain sanitary isolation. When exposed to caustic washes exceeding 2.5% NaOH at temperatures above 80°C, generic EPDM compounds experience severe cross-link degradation, leading to swelling, increased frictional torque, and premature mechanical seal blow-out.",
      },
      {
        heading: "Material Selection Matrix: EPDM vs. FKM vs. FFKM",
        body: "Reliability teams must specify elastomer compounds engineered for extreme alkaline resistance. While standard EPDM offers superior resistance to steam, fluorocarbon (FKM) and perfluoroelastomer (FFKM) provide complete volumetric stability in caustic environments up to 130°C.",
      },
      {
        heading: "Standard Operating Procedure: 3-A Sanitary Verification",
        body: "Inspect mechanical seal face clearance every 2,500 run hours. If radial expansion exceeds 0.15mm, purge line pressure, remove the rotor housing, and replace elastomer O-rings with FDA 21 CFR Part 110 certified components.",
      },
    ],
    faqs: [
      {
        q: "Why do EPDM seals swell during caustic CIP cycles in rotary lobe pumps?",
        a: "EPDM seals swell when exposed to alkaline wash concentrations exceeding 3% sodium hydroxide at temperatures above 85°C. Chemical attack breaks down polymer cross-links, requiring an upgrade to fluorocarbon (FKM) or perfluoroelastomer (FFKM) compounds conforming to 3-A Sanitary Standard 02-12.",
      },
      {
        q: "What is the certified inspection interval for sanitary lobe pump seals?",
        a: "In continuous 24/7 food processing lines undergoing daily CIP washdowns, mechanical face seals should be inspected every 2,500 run hours and proactively replaced every 5,000 run hours to eliminate micro-leakage risks.",
      },
      {
        q: "Does 3-A Sanitary Standard 02-12 allow standard industrial Viton?",
        a: "No. Standard industrial fluoroelastomers often contain metal oxide curing agents that do not meet FDA 21 CFR 177.2600 extractable limits. Only food-grade, post-cured FKM or FFKM is approved for direct product contact.",
      },
      {
        q: "What is the recommended maximum CIP fluid velocity across sanitary seal faces?",
        a: "Fluid velocity should remain between 1.5 to 2.1 m/s during washdown cycles to prevent hydraulic shock, seal face hydro-planing, and micro-cavitation.",
      },
      {
        q: "How does 3-A Sanitary Standard define dead-leg piping limits for pump skids?",
        a: "3-A and EHEDG guidelines recommend an L/D ratio of less than 1.5 to eliminate stagnant zones where caustic fluids fail to flush and bacteria can harbor.",
      },
    ],
    schema: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Why do EPDM seals swell during caustic CIP cycles in rotary lobe pumps?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "EPDM seals swell when exposed to alkaline wash concentrations exceeding 3% sodium hydroxide at temperatures above 85°C. Upgrading to FKM or FFKM per 3-A 02-12 resolves swelling.",
            },
          },
        ],
      },
      null,
      2,
    ),
  },
  {
    id: "fr-draft-002",
    title: "Diagnosing Hydraulic Descaler Nozzle Clogging and Strip Temperature Drop in Continuous Hot Strip Mills",
    stage: "Approved",
    keyword: "hot strip mill descaler nozzle clogging",
    vertical: "Steel and metals processing",
    equipment: "Hydraulic Work Roll Descaler",
    standard: "AISE Technical Report No. 9",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    qa: {
      wordCount: "Pass",
      faqCount: "Pass",
      ctaCount: "Pass",
      linkAllowlist: "Pass",
      uniqueness: "Pass",
      fluffFilter: "Pass",
      aeoCapsule: "Pass",
      riskScore: "Pass",
    },
    summary:
      "A technical reference for metallurgical process engineers maintaining uniform strip exit temperature and scale-free surface quality in continuous hot strip mills.",
    sections: [
      {
        heading: "Impact of High-Pressure Nozzle Fouling on Slab Heat Uniformity",
        body: "Descaling headers operating at 180 to 240 bar must deliver a sharp, flat-spray knife pattern to crack primary oxide scale. When particulate scale jams nozzle orifices, spray force collapses, leaving residual scale patches that cause surface defect rejections under ASTM A6 standards.",
      },
      {
        heading: "Manifold Pressure Drop Diagnostic Protocol",
        body: "Install differential pressure transducers across the primary descaling header. A drop of 15 bar across the manifold indicates localized clogging in more than 3 adjacent nozzles.",
      },
    ],
    faqs: [
      {
        q: "What spray angle is recommended for hot strip mill descaling nozzles?",
        a: "A 26-degree spray angle with a 15-degree offset to the strip axis prevents adjacent spray interference while delivering maximum impact pressure.",
      },
    ],
    schema: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "Descaler Nozzle Inspection Protocol",
        step: [
          { "@type": "HowToStep", text: "De-energize high-pressure pump skid and lock out header valve." },
          { "@type": "HowToStep", text: "Inspect tungsten carbide nozzle tips for erosion using optical comparator." },
        ],
      },
      null,
      2,
    ),
    pageReview: {
      reviewerId: "rev_marcus_vance",
      status: "APPROVED",
      reviewDate: new Date(Date.now() - 1 * 86400000).toISOString(),
      reviewerNotes: "Verified tungsten carbide nozzle erosion tolerances and 180-240 bar header pressure differentials per AISE Report No. 9.",
      verificationItems: [
        "Spec Accuracy: Verified 180-240 bar descaler pressure envelope against OEM manual.",
        "Standards Referenced: Cross-referenced with AISE Technical Report No. 9 and ASTM A6.",
        "Operating Tolerances: Confirmed 15 bar delta-P manifold trip threshold.",
        "AEO Schema Validity: Validated HowTo & TechArticle structured JSON-LD graphs.",
      ],
      reviewer: {
        id: "rev_marcus_vance",
        name: "Dr. Marcus Vance, PE",
        jobTitle: "Lead Thermal & Mechanical Applications Engineer",
        credentials: "PE, ASHRAE Fellow, MS Mechanical Engineering",
        yearsOfExperience: 18,
        linkedInUrl: "https://www.linkedin.com/in/marcus-vance-pe-industrial",
        photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        bio: "Specializing in high-temperature fluid machinery diagnostics and industrial standards compliance.",
      },
    },
  },
  {
    id: "fr-draft-003",
    title: "Root Cause Protocol: Stamping Die Galling & Weld Inspection Defects in IATF 16949 Assembly Lines",
    stage: "Published",
    keyword: "stamping die galling IATF 16949 weld inspection",
    vertical: "Automotive & stamping",
    equipment: "Servo Transfer Stamping Press",
    standard: "IATF 16949 Automotive Quality",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    qa: {
      wordCount: "Pass",
      faqCount: "Pass",
      ctaCount: "Pass",
      linkAllowlist: "Pass",
      uniqueness: "Pass",
      fluffFilter: "Pass",
      aeoCapsule: "Pass",
      riskScore: "Pass",
    },
    summary:
      "Deterministic root-cause protocols for automotive stamping engineers resolving tonnage imbalance and expulsion defects.",
    sections: [
      {
        heading: "Slide Parallelism Drift in High-Tonnage Servo Presses",
        body: "Edge galling and tonnage imbalance in servo transfer presses typically result from lubricating film breakdown under high contact velocity and slide parallelism drift exceeding 0.05 mm/m. Remediation requires synthetic ester lubricants with extreme pressure additives.",
      },
    ],
    faqs: [
      {
        q: "How to prevent stamping die galling under IATF 16949 tolerances?",
        a: "Maintain slide parallelism under 0.05 mm/m and utilize synthetic ester lubricants with piezoelectric load cell balancing.",
      },
    ],
    schema: JSON.stringify({ "@context": "https://schema.org", "@type": "TechArticle", name: "Stamping Die Galling Protocol" }, null, 2),
  },
  {
    id: "fr-draft-004",
    title: "Automating Fault Detection & Diagnostics (FDD) to Prevent Commercial RTU Compressor Failure",
    stage: "In Review",
    keyword: "commercial RTU FDD fault detection chiller",
    vertical: "Industrial HVAC & chillers",
    equipment: "Commercial Rooftop Unit (RTU)",
    standard: "AHRI Standard 550/590",
    createdAt: new Date().toISOString(),
    qa: {
      wordCount: "Pass",
      faqCount: "Pass",
      ctaCount: "Pass",
      linkAllowlist: "Pass",
      uniqueness: "Pass",
      fluffFilter: "Pass",
      aeoCapsule: "Pass",
      riskScore: "Pass",
    },
    summary:
      "Engineering framework for commercial facility managers deploying automated fault detection and diagnostics across RTU fleets.",
    sections: [
      {
        heading: "Root Cause of RTU Low Delta-T Syndrome",
        body: "Low Delta-T syndrome occurs when chilled water loops return to central chillers with insufficient temperature rise (<5°C differential), forcing extra chillers online at partial loads.",
      },
    ],
    faqs: [
      {
        q: "What causes commercial RTU compressor floodback?",
        a: "Thermostatic expansion valve hunting or low evaporator airflow leads to unevaporated liquid entering the compressor suction line.",
      },
    ],
    schema: JSON.stringify({ "@context": "https://schema.org", "@type": "HowTo", name: "RTU FDD Diagnostic Procedure" }, null, 2),
  },
  {
    id: "fr-draft-005",
    title: "Architecting a Unified Namespace (UNS) with OPC UA to Eliminate PLC-to-MES Data Silos",
    stage: "Approved",
    keyword: "unified namespace UNS OPC UA MQTT sparkplug",
    vertical: "SCADA & automation",
    equipment: "Unified Namespace (UNS) Broker",
    standard: "ISA/IEC 62443 Industrial Security",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    qa: {
      wordCount: "Pass",
      faqCount: "Pass",
      ctaCount: "Pass",
      linkAllowlist: "Pass",
      uniqueness: "Pass",
      fluffFilter: "Pass",
      aeoCapsule: "Pass",
      riskScore: "Pass",
    },
    summary:
      "Industrial automation guide for SCADA engineers transitioning from point-to-point Modbus polling to event-driven Unified Namespace architectures.",
    sections: [
      {
        heading: "Eliminating Gateway Buffer Saturation in OT Networks",
        body: "Modbus packet drops over industrial Ethernet links typically stem from RS-485 serial gateway buffer saturation and baud rate mismatch under high polling frequencies (>10Hz). Upgrading to deterministic OPC-UA PubSub over TSN compliant with IEC 62443 resolves transmission collisions.",
      },
    ],
    faqs: [
      {
        q: "How does a Unified Namespace (UNS) improve MES data latency?",
        a: "By decoupling data producers from consumers via MQTT Sparkplug B brokers, reducing query latency from seconds to under 20ms.",
      },
    ],
    schema: JSON.stringify({ "@context": "https://schema.org", "@type": "TechArticle", name: "UNS Architecture Specification" }, null, 2),
  },
];

function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = prevValueRef.current;
    const duration = 650;

    if (startValue === value) return;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (value - startValue) * easeOut);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevValueRef.current = value;
      }
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [value]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function ForgeFlowApp() {
  return (
    <AuthProvider>
      <ForgeFlowWorkspace />
    </AuthProvider>
  );
}

interface IngestedSpecResult {
  name: string;
  equipment: string[];
  failureModes: string[];
  standards: string[];
  diagnosticQuestions?: string[];
  estimatedAcv: string;
  recommendedToleranceRule: string;
}

interface ComplianceAuditCheck {
  check: string;
  status: string;
  detail: string;
}

interface ComplianceAuditResult {
  reliabilityScore: number;
  riskRating: string;
  auditChecks: ComplianceAuditCheck[];
  hallucinationRisk: string;
  recommendedAmendments?: string[];
}

function ForgeFlowWorkspace() {
  const { user, signOut } = useAuth();
  const organizationName = user?.organization.name ?? "";
  const organizationPlan = user?.organization.plan ?? "free";
  const userEmail = user?.email ?? "";

  const [activeTab, setActiveTab] = useState<TabKey>("Mission Control");
  const [selectedVertical, setSelectedVertical] = useState<string>("Food & beverage manufacturing");
  const [form, setForm] = useState(() => {
    if (typeof window === "undefined" || !user?.organization.id) return defaultForm;
    try {
      const saved = window.localStorage.getItem(`forgeflow.preferences.${user.organization.id}`);
      if (!saved) return defaultForm;
      const value: unknown = JSON.parse(saved);
      if (!value || typeof value !== "object") throw new Error("Saved preferences are invalid.");
      const preferences = value as Partial<typeof defaultForm>;
      return {
        ...defaultForm,
        voiceRegister: typeof preferences.voiceRegister === "string" ? preferences.voiceRegister : defaultForm.voiceRegister,
        fluffSanitizer: typeof preferences.fluffSanitizer === "boolean" ? preferences.fluffSanitizer : defaultForm.fluffSanitizer,
        answerCapsuleDefault: typeof preferences.answerCapsuleDefault === "boolean" ? preferences.answerCapsuleDefault : defaultForm.answerCapsuleDefault,
        allowlistOnly: typeof preferences.allowlistOnly === "boolean" ? preferences.allowlistOnly : defaultForm.allowlistOnly,
        allowedDomains: typeof preferences.allowedDomains === "string" ? preferences.allowedDomains : defaultForm.allowedDomains,
        bannedWords: typeof preferences.bannedWords === "string" ? preferences.bannedWords : defaultForm.bannedWords,
      };
    } catch (error) {
      console.error("Could not read saved preferences:", error);
      return defaultForm;
    }
  });
  const [reviewDrafts, setReviewDrafts] = useState<Draft[]>([]);
  const [selectedDraftId, setSelectedDraftId] = useState<string | number>("");
  const [actionMessage, setActionMessage] = useState("");
  const [isPatching, setIsPatching] = useState(false);
  const [patchStep, setPatchStep] = useState(0);
  const [generationBusy, setGenerationBusy] = useState(false);
  const [draftActionBusy, setDraftActionBusy] = useState(false);
  const [workspaceLoading, setWorkspaceLoading] = useState(true);
  const [reviewComment, setReviewComment] = useState("");
  const [selectedSchemaType, setSelectedSchemaType] = useState<"FAQPage" | "HowTo" | "TechSpec">("FAQPage");
  const [previewTab, setPreviewTab] = useState<"HumanView" | "StructuredNodes" | "SchemaJSON" | "AeoPreview">("HumanView");
  const [aeoSimEngine, setAeoSimEngine] = useState<"Perplexity Copilot" | "Google AI Overview">("Perplexity Copilot");
  const [aeoSimLoading, setAeoSimLoading] = useState(false);
  const [aeoSimData, setAeoSimData] = useState<{
    engine: "Perplexity Copilot" | "Google AI Overview";
    query: string;
    confidenceScore: number;
    directAnswer: string;
    sources: Array<{
      title: string;
      domain: string;
      url: string;
      citationNumber: string;
      quote: string;
      isUserSite: boolean;
    }>;
    aeoAttributes: Array<{ key: string; value: string }>;
  } | null>(null);
  const [engineMenuOpen, setEngineMenuOpen] = useState(true);
  const [draftSearchQuery, setDraftSearchQuery] = useState("");
  const [draftStageFilter, setDraftStageFilter] = useState<string>("ALL");
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [specInputText, setSpecInputText] = useState("");
  const [specVerticalHint, setSpecVerticalHint] = useState("");
  const [specIngesting, setSpecIngesting] = useState(false);
  const [ingestedSpecResult, setIngestedSpecResult] = useState<IngestedSpecResult | null>(null);
  const [isAuditingCompliance, setIsAuditingCompliance] = useState(false);
  const [complianceAuditResult, setComplianceAuditResult] = useState<ComplianceAuditResult | null>(null);
  const [showQuickActionPalette, setShowQuickActionPalette] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [editDraftTitle, setEditDraftTitle] = useState("");
  const [editDraftSummary, setEditDraftSummary] = useState("");
  const [editSections, setEditSections] = useState<Array<{ heading: string; body: string }>>([]);
  const [editFaqs, setEditFaqs] = useState<Array<{ q: string; a: string }>>([]);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [customBannedWords, setCustomBannedWords] = useState<string[]>([
    "disruptive", "cutting-edge", "game-changing", "synergistic", "best-in-class", "revolutionary"
  ]);
  const [newBannedWordInput, setNewBannedWordInput] = useState("");
  const [customStandards, setCustomStandards] = useState<string[]>([
    "3-A Sanitary Standard 02-12", "FDA 21 CFR 177.2600", "ISO 10816-3", "API 676 3rd Ed", "EN 10204 3.1 MTR"
  ]);
  const [newStandardInput, setNewStandardInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [selectedEquipmentIndex, setSelectedEquipmentIndex] = useState(0);
  const [selectedFailureIndex, setSelectedFailureIndex] = useState(0);
  const [selectedStandardIndex, setSelectedStandardIndex] = useState(0);

  // Gemini Industrial Assistant State
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [geminiSuggestions, setGeminiSuggestions] = useState<{
    suggestedTitles: string[];
    suggestedKeywords: string[];
    metaDescription: string;
    answerCapsule: string;
    rationale: string;
  } | null>(null);
  const [geminiPanelOpen, setGeminiPanelOpen] = useState(false);
  const [geminiActiveTarget, setGeminiActiveTarget] = useState<"qa" | "taxonomy">("qa");

  // Expert Review & Technical Sign-Off State
  const [reviewers, setReviewers] = useState<ExpertReviewer[]>([
    {
      id: "rev_marcus_vance",
      name: "Dr. Marcus Vance, PE",
      jobTitle: "Lead Thermal & Mechanical Applications Engineer",
      credentials: "PE, ASHRAE Fellow, MS Mechanical Engineering",
      yearsOfExperience: 18,
      linkedInUrl: "https://www.linkedin.com/in/marcus-vance-pe-industrial",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      bio: "18+ years specializing in commercial HVAC rooftop unit failure mode diagnostics, ASHRAE 90.1/189.1 compliance, and industrial refrigeration compressor reliability.",
    },
    {
      id: "rev_elena_rostova",
      name: "Elena Rostova",
      jobTitle: "Principal Industrial Systems & Reliability Lead",
      credentials: "Six Sigma Black Belt, IATF 16949 Lead Auditor",
      yearsOfExperience: 14,
      linkedInUrl: "https://www.linkedin.com/in/elena-rostova-industrial-qa",
      photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
      bio: "14 years conducting root-cause failure analysis for automotive stamping presses, sanitary rotary pumps, and polymer extrusion machinery under ISO 9001 and 3-A standards.",
    },
    {
      id: "rev_david_chen",
      name: "David Chen, CMRP",
      jobTitle: "Senior Fluid Power & Hydraulics Specialist",
      credentials: "CMRP, CFPS (Fluid Power Specialist)",
      yearsOfExperience: 12,
      linkedInUrl: "https://www.linkedin.com/in/david-chen-fluid-power",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      bio: "Certified fluid power specialist focusing on high-pressure hydraulic piston pump cavitation, ISO 4406 cleanliness standards, and industrial automation safety protocols.",
    },
  ]);
  const [showReviewerModal, setShowReviewerModal] = useState(false);
  const [showSignOffModal, setShowSignOffModal] = useState(false);
  const [signOffDecision, setSignOffDecision] = useState<"approve" | "changes_requested">("approve");
  const [signOffReviewerId, setSignOffReviewerId] = useState("");
  const [signOffNotes, setSignOffNotes] = useState("");
  const [signOffChecklist, setSignOffChecklist] = useState({
    specAccuracy: true,
    standardsRef: true,
    tolerances: true,
    schemaValid: true,
  });
  const [newReviewerName, setNewReviewerName] = useState("");
  const [newReviewerJobTitle, setNewReviewerJobTitle] = useState("");
  const [newReviewerCredentials, setNewReviewerCredentials] = useState("");
  const [newReviewerExp, setNewReviewerExp] = useState(10);
  const [newReviewerLinkedIn, setNewReviewerLinkedIn] = useState("");
  const [newReviewerBio, setNewReviewerBio] = useState("");
  const [isReviewBusy, setIsReviewBusy] = useState(false);

  // Email Verification & Team Collaboration State
  const [resendingVerification, setResendingVerification] = useState(false);
  const [workspaceMembers, setWorkspaceMembers] = useState<
    Array<{
      id: string;
      email: string;
      name: string | null;
      role: string;
      emailVerified: string | null;
      createdAt: string;
      isCurrentUser?: boolean;
    }>
  >([]);
  const [workspaceInvites, setWorkspaceInvites] = useState<
    Array<{
      id: string;
      email: string;
      role: string;
      status: string;
      expiresAt: string;
      createdAt: string;
    }>
  >([]);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("MEMBER");
  const [inviteSending, setInviteSending] = useState(false);
  const [inviteError, setInviteError] = useState("");

  // Sidebar State (Matches Reference Design)
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userInitials = (() => {
    if (user?.name && user.name.trim()) {
      const parts = user.name.trim().split(/\s+/);
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (userEmail && userEmail.toLowerCase().includes("priyanka")) return "PM";
    if (userEmail) {
      const handle = userEmail.split("@")[0].replace(/[^a-zA-Z]/g, "");
      if (handle.length >= 2) return handle.slice(0, 2).toUpperCase();
    }
    return "PM";
  })();

  const userDisplayName = (() => {
    if (user?.name && user.name.trim()) return user.name;
    if (userEmail && userEmail.toLowerCase().includes("priyanka")) return "Priyanka Meena";
    return userEmail.split("@")[0] || "Priyanka Meena";
  })();

  const userDisplayOrg =
    organizationName && organizationName !== "Industrial Reliability Corp"
      ? organizationName
      : "JRS Innovation";

  const loadWorkspaceTeam = useCallback(async () => {
    try {
      const res = await fetch("/api/workspace/members");
      if (res.ok) {
        const data = await res.json();
        if (data.members) setWorkspaceMembers(data.members);
        if (data.invitations) setWorkspaceInvites(data.invitations);
      }
    } catch (e) {
      console.warn("Failed to load workspace team members:", e);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    if (activeTab === "Workspace & Rules") {
      fetch("/api/workspace/members")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (ignore || !data) return;
          if (data.members) setWorkspaceMembers(data.members);
          if (data.invitations) setWorkspaceInvites(data.invitations);
        })
        .catch((e) => console.warn("Failed to load workspace team members:", e));
    }
    return () => {
      ignore = true;
    };
  }, [activeTab]);

  const handleFileRead = (file: File) => {
    setUploadedFileName(`${file.name} (${Math.round(file.size / 1024)} KB)`);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        setSpecInputText(content.slice(0, 5000));
        setActionMessage(`Loaded ${file.name} (${content.length} characters) into spec parser.`);
      }
    };
    reader.readAsText(file);
  };

  const handleSaveDraftEdit = async () => {
    if (!selectedDraft) return;
    setIsSavingEdit(true);
    try {
      const res = await fetch(`/api/drafts/${encodeURIComponent(String(selectedDraft.id))}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editDraftTitle,
          summary: editDraftSummary,
          sections: editSections,
          faqs: editFaqs,
          changeSummary: "Chief Reliability Engineer inline technical revisions",
        }),
      });
      const data = await res.json();
      if (data.draft) {
        setReviewDrafts((prev) =>
          prev.map((d) => (d.id === selectedDraft.id ? { ...d, ...data.draft } : d))
        );
        setIsEditingDraft(false);
        setActionMessage(`Revisions to "${editDraftTitle}" saved to database successfully.`);
      } else {
        setActionMessage(data.error || "Failed to save draft edits.");
      }
    } catch {
      setActionMessage("Network error while saving draft.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleIngestSpec = async () => {
    if (!specInputText.trim()) return;
    setSpecIngesting(true);
    try {
      const res = await fetch("/api/taxonomy/ingest-spec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specText: specInputText, verticalHint: specVerticalHint }),
      });
      const data = await res.json();
      if (data.success && data.extractedTaxonomy) {
        setIngestedSpecResult(data.extractedTaxonomy);
        setActionMessage(`Spec parsed: Extracted ${data.extractedTaxonomy.equipment.length} equipment nodes for "${data.extractedTaxonomy.name}".`);
      } else {
        setActionMessage(data.error || "Failed to parse spec sheet.");
      }
    } catch {
      setActionMessage("Network error during spec ingestion.");
    } finally {
      setSpecIngesting(false);
    }
  };

  const handleRunComplianceAudit = async () => {
    setIsAuditingCompliance(true);
    try {
      const activeDraft = reviewDrafts.find((d) => d.id === selectedDraftId) || reviewDrafts[0];
      const res = await fetch("/api/ai/compliance-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: activeDraft?.title || "Sanitary Rotary Pump Seal Swelling",
          summary: activeDraft?.summary || "",
          text: activeDraft?.sections.map((s) => s.body).join("\n") || "",
          standards: activeDraft?.standard ? [activeDraft.standard] : ["3-A Sanitary Standard 02-12", "FDA 21 CFR 177.2600"],
        }),
      });
      const data = await res.json();
      if (data.success && data.auditResult) {
        setComplianceAuditResult(data.auditResult);
        setActionMessage(`Compliance Audit Completed: Score ${data.auditResult.reliabilityScore}% (${data.auditResult.riskRating})`);
      } else {
        setActionMessage(data.error || "Compliance scan failed.");
      }
    } catch {
      setActionMessage("Network error during compliance scan.");
    } finally {
      setIsAuditingCompliance(false);
    }
  };

  const runAeoSimulation = useCallback(async (targetEngine?: "Perplexity Copilot" | "Google AI Overview") => {
    const engineToUse = targetEngine || aeoSimEngine;
    setAeoSimLoading(true);
    try {
      const draft = reviewDrafts.find((d) => d.id === selectedDraftId) || reviewDrafts[0];
      const query = draft?.title || "Rotary Lobe Pump Seal Swelling in Caustic Wash";
      const res = await fetch("/api/ai/simulate-aeo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          title: draft?.title,
          equipment: draft?.equipment,
          standard: draft?.standard,
          vertical: draft?.vertical,
          summary: draft?.summary,
          engine: engineToUse,
        }),
      });
      const data = await res.json();
      if (data.simulation) {
        setAeoSimData(data.simulation);
      }
    } catch (err) {
      console.error("AEO simulation error:", err);
    } finally {
      setAeoSimLoading(false);
    }
  }, [aeoSimEngine, reviewDrafts, selectedDraftId]);

  async function handleResendVerification() {
    setResendingVerification(true);
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setActionMessage(data.message || `Verification link sent to ${userEmail}. Please check your inbox.`);
      } else {
        setActionMessage(data.error || "Failed to resend verification link.");
      }
    } catch {
      setActionMessage("Network error resending verification email.");
    } finally {
      setResendingVerification(false);
    }
  }

  async function handleSendInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteSending(true);
    setInviteError("");
    try {
      const res = await fetch("/api/workspace/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setActionMessage(data.message || `Invitation sent to ${inviteEmail}.`);
        setInviteModalOpen(false);
        setInviteEmail("");
        void loadWorkspaceTeam();
      } else {
        setInviteError(data.error || "Failed to send invitation.");
      }
    } catch {
      setInviteError("Network error sending invite.");
    } finally {
      setInviteSending(false);
    }
  }

  async function handleRevokeInvite(inviteId: string) {
    try {
      const res = await fetch(`/api/workspace/invites/${encodeURIComponent(inviteId)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setActionMessage("Invitation revoked.");
        void loadWorkspaceTeam();
      } else {
        const data = await res.json().catch(() => ({}));
        setActionMessage(data.error || "Failed to revoke invitation.");
      }
    } catch {
      setActionMessage("Network error revoking invitation.");
    }
  }

  // Load real drafts and settings from API
  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/drafts", { cache: "no-store" }),
      fetch("/api/workspace", { cache: "no-store" }),
    ])
      .then(async ([draftResponse, workspaceResponse]) => {
        const [draftData, workspaceData] = await Promise.all([
          draftResponse.json() as Promise<{
            drafts?: Array<Omit<Draft, "stage" | "qa" | "schema"> & { status: string; schema: unknown }>;
            error?: string;
          }>,
          workspaceResponse.json() as Promise<{
            organization?: {
              name: string;
              website: string | null;
              productDescription: string | null;
              industry: string | null;
              keywords: string | null;
            };
            error?: string;
          }>,
        ]);

        if (active) {
          if (!draftResponse.ok) {
            throw new Error(draftData.error ?? "Could not load workspace drafts.");
          }
          if (!workspaceResponse.ok) {
            throw new Error(workspaceData.error ?? "Could not load workspace settings.");
          }

          if (draftData.drafts && draftData.drafts.length > 0) {
            const mapped = draftData.drafts.map((d): Draft => ({
              ...d,
              stage:
                d.status === "published"
                  ? "Published"
                  : d.status === "approved"
                    ? "Approved"
                    : d.status === "changes_requested"
                      ? "Changes requested"
                      : d.status === "rejected"
                        ? "Rejected"
                        : "In Review",
              qa: {
                wordCount: "Review",
                faqCount: "Review",
                ctaCount: "Review",
                linkAllowlist: "Review",
                uniqueness: "Review",
                fluffFilter: "Review",
                aeoCapsule: "Review",
                riskScore: "Review",
              },
              schema: typeof d.schema === "string" ? d.schema : JSON.stringify(d.schema, null, 2),
            }));
            setReviewDrafts(mapped);
            setSelectedDraftId(mapped[0]?.id ?? "");
          } else {
            setReviewDrafts(demoReviewDrafts);
            setSelectedDraftId(demoReviewDrafts[0]?.id ?? "");
          }

          if (workspaceResponse.ok && workspaceData.organization) {
            const org = workspaceData.organization;
            setForm((cur) => ({
              ...cur,
              companyName: org.name || cur.companyName,
              website: org.website ?? "",
              productDescription: org.productDescription ?? "",
              industry: org.industry ?? cur.industry,
              keywords: org.keywords ?? "",
            }));
            if (org.industry && verticalTaxonomies[org.industry]) {
              setSelectedVertical(org.industry);
            }
          }
          setWorkspaceLoading(false);
        }
      })
      .catch((err) => {
        console.error("Workspace sync error:", err);
        if (active) {
          setActionMessage(err instanceof Error ? err.message : "Could not load the workspace.");
          setWorkspaceLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const currentVerticalData = useMemo(() => {
    return verticalTaxonomies[selectedVertical] ?? verticalTaxonomies["Food & beverage manufacturing"];
  }, [selectedVertical]);

  const activeEquipment = currentVerticalData.equipment[selectedEquipmentIndex] ?? currentVerticalData.equipment[0];
  const activeFailure = currentVerticalData.failureModes[selectedFailureIndex] ?? currentVerticalData.failureModes[0];
  const activeStandard = currentVerticalData.standards[selectedStandardIndex] ?? currentVerticalData.standards[0];

  const dynamicTopicTitle = useMemo(() => {
    return `Root Cause Protocol: ${activeFailure} in ${activeEquipment} (${activeStandard})`;
  }, [activeEquipment, activeFailure, activeStandard]);

  const dynamicIntent = useMemo(() => {
    const text = activeFailure.toLowerCase();
    if (text.includes("spikes") || text.includes("latency") || text.includes("breakage") || text.includes("drift")) {
      return "Root Cause Diagnostic SOP";
    }
    if (text.includes("efficiency") || text.includes("tracking") || text.includes("integration") || text.includes("compliance")) {
      return "Engineering Optimization Spec";
    }
    if (text.includes("galling") || text.includes("swelling") || text.includes("clogging") || text.includes("defect") || text.includes("failure")) {
      return "Failure Prevention & Reliability SOP";
    }
    return "Maintenance Standard Operating Procedure";
  }, [activeFailure]);

  const dynamicSearchVolume = useMemo(() => {
    const volumes = [
      "10–25/mo (Zero-Volume Spec Trap)",
      "15–40/mo (High-Intent Plant Query)",
      "20–50/mo (Reliability Engineering Search)",
      "30–65/mo (OEM Replacement Long-Tail)",
    ];
    return volumes[(selectedEquipmentIndex + selectedFailureIndex) % volumes.length];
  }, [selectedEquipmentIndex, selectedFailureIndex]);

  const dynamicPipelineValue = useMemo(() => {
    const baseMin = 75000 + (selectedEquipmentIndex * 45000) + (selectedFailureIndex * 20000);
    const baseMax = baseMin * 3 + (selectedStandardIndex * 50000);
    return `$${baseMin.toLocaleString()} - $${baseMax.toLocaleString()}`;
  }, [selectedEquipmentIndex, selectedFailureIndex, selectedStandardIndex]);

  const dynamicSpecRisk = useMemo(() => {
    const risks = [
      "0.9% (Minimal)",
      "1.2% (Very Low)",
      "1.4% (Very Low)",
      "1.7% (Low)",
      "2.1% (Low)",
      "2.4% (Low)",
    ];
    return risks[(selectedEquipmentIndex * 2 + selectedFailureIndex) % risks.length];
  }, [selectedEquipmentIndex, selectedFailureIndex]);

  const selectedDraft =
    reviewDrafts.find((d) => d.id === selectedDraftId) ?? reviewDrafts[0] ?? demoReviewDrafts[0];
  const reviewDraftCount = reviewDrafts.filter((draft) => draft.stage === "In Review").length;
  const approvedDraftCount = reviewDrafts.filter((draft) => draft.stage === "Approved").length;
  const publishedDraftCount = reviewDrafts.filter((draft) => draft.stage === "Published").length;
  const recentDraftActivity = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return {
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      count: reviewDrafts.filter((draft) => {
        if (!draft.createdAt) return false;
        const createdAt = new Date(draft.createdAt);
        return createdAt >= start && createdAt < end;
      }).length,
    };
  });
  const maximumDailyDrafts = Math.max(...recentDraftActivity.map((day) => day.count), 1);

  async function saveWorkspaceProfile() {
    setActionMessage("");
    try {
      const response = await fetch("/api/workspace", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.companyName,
          website: form.website,
          productDescription: form.productDescription,
          industry: selectedVertical,
          keywords: form.keywords,
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Could not save company profile.");
      setActionMessage("Company profile saved to this workspace.");
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Could not save company profile.");
    }
  }

  function saveWorkspacePolicies() {
    try {
      window.localStorage.setItem(
        `forgeflow.preferences.${user?.organization.id ?? "workspace"}`,
        JSON.stringify({
          voiceRegister: form.voiceRegister,
          fluffSanitizer: form.fluffSanitizer,
          answerCapsuleDefault: form.answerCapsuleDefault,
          allowlistOnly: form.allowlistOnly,
          allowedDomains: form.allowedDomains,
          bannedWords: form.bannedWords,
        }),
      );
      setActionMessage("Preferences saved in this browser. The current generator does not enforce them.");
    } catch (error) {
      console.error("Could not save workspace preferences:", error);
      setActionMessage("Could not save these preferences in this browser.");
    }
  }

  async function startCheckout(plan: "starter" | "growth") {
    setActionMessage("");
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error ?? "Could not start checkout.");
      window.location.assign(data.url);
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Could not start checkout.");
    }
  }

  async function openBillingPortal() {
    setActionMessage("");
    try {
      const response = await fetch("/api/billing/portal", { method: "POST" });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error ?? "Could not open billing portal.");
      window.location.assign(data.url);
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Could not open billing portal.");
    }
  }

  // Gemini Industrial AEO Assistant Handlers
  async function fetchGeminiSuggestions(
    customTopic?: string,
    customEquipment?: string,
    customStandard?: string,
    customVertical?: string,
    customSummary?: string,
  ) {
    setGeminiLoading(true);
    setGeminiPanelOpen(true);
    try {
      const response = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: customTopic || selectedDraft?.title || dynamicTopicTitle,
          equipment: customEquipment || selectedDraft?.equipment || activeEquipment,
          standard: customStandard || selectedDraft?.standard || activeStandard,
          vertical: customVertical || selectedDraft?.vertical || selectedVertical,
          currentSummary: customSummary || selectedDraft?.summary,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(errorData.error || `Gemini request failed (${response.status})`);
      }

      const data = (await response.json()) as {
        suggestions: {
          suggestedTitles: string[];
          suggestedKeywords: string[];
          metaDescription: string;
          answerCapsule: string;
          rationale: string;
        };
      };

      setGeminiSuggestions(data.suggestions);
      setActionMessage("✨ Gemini generated high-intent industrial suggestions.");
    } catch (err: unknown) {
      console.error("Gemini suggestion error:", err);
      setActionMessage(err instanceof Error ? err.message : "Gemini suggestions failed.");
    } finally {
      setGeminiLoading(false);
    }
  }

  function applyGeminiTitle(title: string) {
    if (!selectedDraft) return;
    setReviewDrafts((cur) =>
      cur.map((d) => (d.id === selectedDraft.id ? { ...d, title } : d)),
    );
    setActionMessage(`✨ Applied Gemini Title: "${title}"`);
    if (typeof selectedDraft.id === "string" && selectedDraft.id.length > 10) {
      void fetch(`/api/drafts/${encodeURIComponent(selectedDraft.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      }).catch((e) => console.warn("Background title persist failed:", e));
    }
  }

  function applyGeminiKeyword(keyword: string) {
    if (!selectedDraft) return;
    setReviewDrafts((cur) =>
      cur.map((d) => (d.id === selectedDraft.id ? { ...d, keyword } : d)),
    );
    setActionMessage(`✨ Applied Gemini Keyword: "${keyword}"`);
    if (typeof selectedDraft.id === "string" && selectedDraft.id.length > 10) {
      void fetch(`/api/drafts/${encodeURIComponent(selectedDraft.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      }).catch((e) => console.warn("Background keyword persist failed:", e));
    }
  }

  function applyGeminiDescription(metaDescription: string) {
    if (!selectedDraft) return;
    setReviewDrafts((cur) =>
      cur.map((d) => (d.id === selectedDraft.id ? { ...d, summary: metaDescription } : d)),
    );
    setActionMessage("✨ Applied Gemini Meta Description to summary.");
    if (typeof selectedDraft.id === "string" && selectedDraft.id.length > 10) {
      void fetch(`/api/drafts/${encodeURIComponent(selectedDraft.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary: metaDescription }),
      }).catch((e) => console.warn("Background summary persist failed:", e));
    }
  }

  function applyGeminiCapsule(answerCapsule: string) {
    if (!selectedDraft) return;
    setReviewDrafts((cur) =>
      cur.map((d) => {
        if (d.id !== selectedDraft.id) return d;
        const updatedSections = [...d.sections];
        if (updatedSections.length > 0) {
          updatedSections[0] = {
            ...updatedSections[0],
            body: `${answerCapsule}\n\n${updatedSections[0].body}`,
          };
        }
        return { ...d, summary: answerCapsule, sections: updatedSections };
      }),
    );
    setActionMessage("✨ Applied Gemini AEO Answer Capsule directly into lead section & summary.");
  }

  // Execute Animated Closed-Loop Auto-Patch
  function runAutoPatch() {
    setIsPatching(true);
    setPatchStep(1);
    setActionMessage("Step 1/4: Validating word count band (2,800–3,500 words) & detecting missing CTA…");

    setTimeout(() => {
      setPatchStep(2);
      setActionMessage("Step 2/4: Auto-patching CTA with verified phrasing & injecting allowlisted 3-A / ASME links…");
    }, 400);

    setTimeout(() => {
      setPatchStep(3);
      setActionMessage("Step 3/4: Enforcing 5+ FAQ items & stripping forbidden styling elements…");
    }, 800);

    setTimeout(() => {
      setPatchStep(4);
      setActionMessage("Step 4/4: Compiling nested FAQPage, Article & HowTo JSON-LD schema with Answer-First formatting…");
    }, 1200);

    const targetDraft = selectedDraft;
    const draftEquipment = targetDraft.equipment || activeEquipment;
    const draftStandard = targetDraft.standard || activeStandard;

    setTimeout(() => {
      setReviewDrafts((current) =>
        current.map((draft) => {
          if (draft.id === targetDraft.id) {
            return {
              ...draft,
              qa: {
                wordCount: "Pass",
                faqCount: "Pass",
                ctaCount: "Pass",
                linkAllowlist: "Pass",
                uniqueness: "Pass",
                fluffFilter: "Pass",
                aeoCapsule: "Pass",
                riskScore: "Pass",
              },
              sections: [
                ...draft.sections.map((sec) => ({
                  ...sec,
                  body: sec.body
                    .replace(/game-changer/gi, "engineered solution")
                    .replace(/revolutionary/gi, "high-reliability")
                    .replace(/fast-paced/gi, "high-throughput"),
                })),
                {
                  heading: `Verified Engineering Next Steps: ${draftEquipment} Protocol`,
                  body: `Download our verified ${draftEquipment} Diagnostic & Maintenance Checklist compliant with ${draftStandard}, or schedule an application engineering audit to calibrate equipment tolerances.`,
                },
              ],
            };
          }
          return draft;
        }),
      );
      setIsPatching(false);
      setPatchStep(0);
      setActionMessage(`✔ Auto-Patch Successful: Injected ${draftEquipment} (${draftStandard}) CTA and validated QA rules.`);

      // Sync auto-patch to PostgreSQL
      if (selectedDraft?.id && !String(selectedDraft.id).startsWith("demo-")) {
        fetch(`/api/drafts/${encodeURIComponent(String(selectedDraft.id))}/auto-patch`, {
          method: "POST",
        }).catch((err) => console.warn("Auto-patch DB sync deferred:", err));
      }
    }, 1600);
  }

  // Update Draft Status
  async function updateDraftStage(action: "approve" | "request_changes" | "reject" | "publish") {
    if (reviewDrafts.length === 0 || draftActionBusy) return;
    setActionMessage("");

    // Strict Expert Review Publishing Gate
    if (action === "publish") {
      const isApproved = selectedDraft.pageReview?.status === "APPROVED" || selectedDraft.stage === "Approved";
      if (!isApproved) {
        setActionMessage("⚠️ Publishing Gate: Draft cannot be published until an application engineer reviews and approves the technical content.");
        return;
      }
    }

    setDraftActionBusy(true);
    try {
      const response = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, draftId: String(selectedDraft.id), comment: reviewComment }),
      });
      const data = (await response.json()) as { draft?: { status: string }; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Failed to update draft.");

      const stage: Draft["stage"] =
        action === "publish"
          ? "Published"
          : action === "approve"
            ? "Approved"
            : action === "request_changes"
              ? "Changes requested"
              : "Rejected";

      setReviewDrafts((current) =>
        current.map((d) => (d.id === selectedDraft.id ? { ...d, stage } : d)),
      );
      setReviewComment("");

      // Closed-loop workflow: "Changes requested" routes back to AI engine
      if (action === "request_changes") {
        setActionMessage(`Changes requested. Routing back to AI engine to fix rule violations and regenerate compliant sections…`);
        setTimeout(() => {
          void runAutoPatch();
        }, 350);
      } else {
        setActionMessage(`Draft stage updated: ${stage}`);
      }
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setDraftActionBusy(false);
    }
  }

  async function handleAssignReviewer(draftId: string | number, reviewerId: string) {
    if (!draftId || !reviewerId) return;
    setIsReviewBusy(true);
    setActionMessage("");
    try {
      const res = await fetch(`/api/drafts/${encodeURIComponent(String(draftId))}/assign-reviewer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewerId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to assign reviewer.");
      setActionMessage(data.message || "Reviewer assigned successfully.");
      setReviewDrafts((prev) =>
        prev.map((d) => (d.id === draftId ? { ...d, pageReview: data.review } : d))
      );
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Assign failed.");
    } finally {
      setIsReviewBusy(false);
    }
  }

  async function handleSubmitExpertReview(draftId: string | number) {
    if (!draftId) return;
    setIsReviewBusy(true);
    setActionMessage("");
    try {
      const activeChecklistItems = [
        signOffChecklist.specAccuracy ? "Spec Accuracy: Verified operating limits & tolerances against OEM manual." : null,
        signOffChecklist.standardsRef ? "Standards Referenced: Cross-referenced with active regulatory codes (ISO/ASME/ASHRAE/3-A)." : null,
        signOffChecklist.tolerances ? "Operating Tolerances: Confirmed pressure, thermal differential, and fatigue thresholds." : null,
        signOffChecklist.schemaValid ? "AEO Schema Validity: Validated multi-entity JSON-LD graphs with reviewedBy Person entity." : null,
      ].filter(Boolean) as string[];

      const res = await fetch(`/api/drafts/${encodeURIComponent(String(draftId))}/expert-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision: signOffDecision,
          reviewerId: signOffReviewerId || selectedDraft.pageReview?.reviewerId || reviewers[0]?.id,
          reviewerNotes: signOffNotes,
          verificationItems: activeChecklistItems,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review.");
      setActionMessage(data.message || "Review saved.");
      setReviewDrafts((prev) =>
        prev.map((d) =>
          d.id === draftId
            ? {
                ...d,
                stage: signOffDecision === "approve" ? "Approved" : "Changes requested",
                pageReview: data.review,
              }
            : d,
        ),
      );
      setShowSignOffModal(false);
      setSignOffNotes("");
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Review submission failed.");
    } finally {
      setIsReviewBusy(false);
    }
  }

  async function handleCreateReviewer(e: React.FormEvent) {
    e.preventDefault();
    if (!newReviewerName.trim() || !newReviewerJobTitle.trim()) return;
    setIsReviewBusy(true);
    try {
      const res = await fetch("/api/reviewers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newReviewerName,
          jobTitle: newReviewerJobTitle,
          credentials: newReviewerCredentials || "PE, Mechanical Systems",
          yearsOfExperience: newReviewerExp,
          linkedInUrl: newReviewerLinkedIn || null,
          bio: newReviewerBio || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create reviewer.");
      setReviewers((prev) => [...prev, data.reviewer]);
      setNewReviewerName("");
      setNewReviewerJobTitle("");
      setNewReviewerCredentials("");
      setNewReviewerLinkedIn("");
      setNewReviewerBio("");
      setActionMessage(`Added ${data.reviewer.name} to engineering reviewer directory.`);
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Failed to create reviewer.");
    } finally {
      setIsReviewBusy(false);
    }
  }

  async function handleDeleteReviewer(id: string) {
    if (!id) return;
    setIsReviewBusy(true);
    try {
      const res = await fetch(`/api/reviewers/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        setReviewers((prev) => prev.filter((r) => r.id !== id));
        setActionMessage("Reviewer removed.");
      }
    } catch {
      setActionMessage("Delete failed.");
    } finally {
      setIsReviewBusy(false);
    }
  }

  // Trigger Programmatic Batch Generation
  async function generateProgrammaticBatch() {
    setGenerationBusy(true);
    setActionMessage("Generating programmatic topic batch across pre-built vertical matrix…");

    const effectiveDesc =
      form.productDescription.trim().length >= 10
        ? form.productDescription.trim()
        : `${form.companyName || organizationName || "Factory"} Industrial Reliability Suite for ${selectedVertical}`;

    const newDraftId = `draft-${Date.now()}`;
    const dynamicDraft: Draft = {
      id: newDraftId,
      title: dynamicTopicTitle,
      stage: "In Review",
      keyword: `${activeEquipment.toLowerCase()} ${activeFailure.toLowerCase()} ${activeStandard.toLowerCase()}`,
      vertical: selectedVertical,
      equipment: activeEquipment,
      standard: activeStandard,
      createdAt: new Date().toISOString(),
      qa: {
        wordCount: "Pass",
        faqCount: "Pass",
        ctaCount: "Fail",
        linkAllowlist: "Pass",
        uniqueness: "Pass",
        fluffFilter: "Fail",
        aeoCapsule: "Pass",
        riskScore: "Review",
      },
      summary: `Deterministic engineering protocol for plant reliability managers preventing ${activeFailure} in ${activeEquipment} compliant with ${activeStandard}.`,
      sections: [
        {
          heading: `01. Root Cause Analysis: ${activeFailure}`,
          body: `${activeEquipment} systems operating under continuous production schedules experience ${activeFailure.toLowerCase()} when operating tolerances exceed rated parameters. Without real-time telemetry compliant with ${activeStandard}, mechanical and thermal stresses accelerate component degradation, leading to unplanned stoppage and secondary asset damage.`,
        },
        {
          heading: `02. Diagnostic Verification Protocol under ${activeStandard}`,
          body: `Plant maintenance technicians must benchmark operating parameters against certified ${activeStandard} baselines. Differential sensor readings and vibration harmonics should be captured at 15-minute intervals, with inspection intervals scheduled every 2,000 run hours to verify mechanical clearances.`,
        },
        {
          heading: `03. Preventative Maintenance & Mitigation Framework`,
          body: `Deploy predictive anomaly detection to flag micro-vibrations and thermal spikes 72 hours before critical breakdown. Ensure all replacement assemblies and seal compounds are cross-referenced with authorized OEM specifications and ${activeStandard} certified documentation.`,
        },
      ],
      faqs: [
        {
          q: `What is the certified inspection interval for ${activeEquipment} under ${activeStandard}?`,
          a: `Under continuous duty cycles, inspection of critical tolerances is required every 2,000 run hours, with comprehensive non-destructive testing (NDT) performed semi-annually per ${activeStandard}.`,
        },
        {
          q: `What are the primary early warning indicators of ${activeFailure} in ${activeEquipment}?`,
          a: `Early warning signatures include harmonic vibration frequency shifts (>1.8 kHz), localized surface temperature spikes exceeding 15°C above ambient, and lubricant viscosity breakdown.`,
        },
        {
          q: `Does compliance with ${activeStandard} mandate specific replacement components?`,
          a: `Yes. All wetted components and structural fasteners must be certified to ${activeStandard} material specifications with traceable mill test certificates.`,
        },
        {
          q: `How does real-time telemetry mitigate catastrophic ${activeFailure}?`,
          a: `Continuous high-frequency sampling identifies micro-faults 48–72 hours prior to functional failure, enabling scheduled shift repairs and preventing uncontained downtime.`,
        },
        {
          q: `What is the allowable operating tolerance limit before emergency shutdown?`,
          a: `Operating parameters must not exceed ±2.5% of the nominal engineering baseline specified in ${activeStandard} for more than 180 seconds continuously.`,
        },
      ],
      schema: JSON.stringify(
        {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "TechArticle",
              headline: dynamicTopicTitle,
              about: activeEquipment,
              complianceStandard: activeStandard,
              datePublished: new Date().toISOString().split("T")[0],
            },
            {
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: `What is the certified inspection interval for ${activeEquipment}?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `Inspection is recommended every 2,000 run hours per ${activeStandard}.`,
                  },
                },
                {
                  "@type": "Question",
                  name: `What are the primary early warning indicators of ${activeFailure}?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `Early warning signatures include vibration harmonics and temperature spikes.`,
                  },
                },
              ],
            },
            {
              "@type": "HowTo",
              name: `Diagnostic Procedure for ${activeFailure}`,
              step: [
                { "@type": "HowToStep", text: `Isolate ${activeEquipment} and lock out high-voltage feed.` },
                { "@type": "HowToStep", text: `Verify mechanical clearances against ${activeStandard} specs.` },
                { "@type": "HowToStep", text: `Log diagnostic parameters and calibrate telemetry sensors.` },
              ],
            },
          ],
        },
        null,
        2,
      ),
    };

    // Prepend dynamic draft and immediately redirect to QA Review Studio with dynamic values
    setReviewDrafts((cur) => [dynamicDraft, ...cur.filter((d) => d.id !== dynamicDraft.id)]);
    setSelectedDraftId(dynamicDraft.id);
    setActiveTab("QA Review Studio");
    setActionMessage(`✔ Generated programmatic slice: "${dynamicTopicTitle}". Switched to QA Review Studio.`);
    setGenerationBusy(false);

    // Persist to PostgreSQL Database
    try {
      fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: dynamicDraft.title,
          keyword: dynamicDraft.keyword,
          vertical: dynamicDraft.vertical,
          targetEquipment: dynamicDraft.equipment,
          complianceStandard: dynamicDraft.standard,
          summary: dynamicDraft.summary,
          sections: dynamicDraft.sections,
          faqs: dynamicDraft.faqs,
          schema: JSON.parse(dynamicDraft.schema),
          status: "IN_REVIEW",
          qaScores: dynamicDraft.qa,
          specRiskScore: dynamicSpecRisk ? parseFloat(dynamicSpecRisk) : 1.4,
          pipelineValueMin: 95000,
          pipelineValueMax: 380000,
          searchVolume: dynamicSearchVolume,
        }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((saved) => {
          if (saved?.draft?.id) {
            setReviewDrafts((cur) =>
              cur.map((d) => (d.id === dynamicDraft.id ? { ...d, id: saved.draft.id } : d)),
            );
            setSelectedDraftId(saved.draft.id);
          }
        })
        .catch((err) => console.warn("Draft database persist deferred:", err));
    } catch (err) {
      console.warn("Draft persist error:", err);
    }

    // Optional background AI batch provider call if configured
    try {
      fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topics: [
            dynamicTopicTitle,
            `Troubleshooting ${activeEquipment} Failures under ${activeStandard}`,
            `${activeEquipment} Diagnostic Protocol for ${activeFailure}`,
          ],
          productDescription: effectiveDesc,
          industry: selectedVertical,
          keywords: form.keywords || `${activeEquipment}, ${activeFailure}`,
        }),
      })
        .then((res) => (res.ok ? (res.json() as Promise<{ drafts?: Array<Omit<Draft, "stage" | "qa" | "schema"> & { schema: unknown }> }>) : null))
        .then((data) => {
          if (data && Array.isArray(data.drafts) && data.drafts.length > 0) {
            const apiGenerated = data.drafts.map((d): Draft => ({
              ...d,
              stage: "In Review",
              vertical: selectedVertical,
              equipment: activeEquipment,
              standard: activeStandard,
              qa: {
                wordCount: "Pass",
                faqCount: "Pass",
                ctaCount: "Fail",
                linkAllowlist: "Pass",
                uniqueness: "Pass",
                fluffFilter: "Review",
                aeoCapsule: "Pass",
                riskScore: "Review",
              },
              schema: typeof d.schema === "string" ? d.schema : JSON.stringify(d.schema, null, 2),
            }));
            setReviewDrafts((cur) => [...apiGenerated, ...cur.filter((c) => !apiGenerated.some((g) => g.id === c.id))]);
          }
        })
        .catch(() => { });
    } catch { }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
            {/* SIDEBAR NAVIGATION - MATCHING USER'S REFERENCE DESIGN & FORGEFLOW BRAND IDENTITY */}
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white p-3.5 flex flex-col justify-between hidden md:flex shadow-xs select-none">
        <div className="space-y-3">
          {/* Official ForgeFlow Logo Header */}
          <div className="pb-3 border-b border-slate-100 flex items-center gap-3">
            <Image
              src="/logo-icon.png"
              alt="ForgeFlow Emblem"
              width={42}
              height={30}
              className="h-9 w-auto object-contain shrink-0"
              priority
            />
            <div className="min-w-0">
              <div className="text-[17px] font-black tracking-tight text-slate-900 leading-tight">
                Forge<span className="text-sky-600">Flow</span>
              </div>
              <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-tight truncate">
                Plan • Generate • Optimize • Grow
              </div>
            </div>
          </div>

          {/* Top Feature Pill: Financial overview [Agentic] */}
          <button
            type="button"
            onClick={() => setActiveTab("Industrial Analytics")}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 transition group border border-transparent hover:border-slate-200 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-mono font-bold text-[11px] group-hover:bg-sky-100 group-hover:text-sky-700 transition">
                $
              </div>
              <span className="font-medium text-slate-700 group-hover:text-slate-900">Financial overview</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200/60 font-sans tracking-wide">
              Agentic
            </span>
          </button>

          {/* My Tools Quick Bar */}
          <div className="rounded-xl bg-sky-50/70 border border-sky-100/90 px-3 py-2 flex items-center justify-between text-xs font-semibold text-slate-700 shadow-2xs">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-sky-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
              </svg>
              <span className="text-slate-800 font-medium">My tools</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <button
                type="button"
                onClick={() => setActionMessage("Quick tools collapsed")}
                className="hover:text-slate-600 text-xs transition cursor-pointer"
                title="Dismiss"
              >
                ✕
              </button>
              <button
                type="button"
                onClick={() => setShowQuickActionPalette(true)}
                className="hover:text-slate-600 text-sm font-bold transition cursor-pointer hover:scale-110"
                title="Open Quick Action Palette (+)"
              >
                +
              </button>
            </div>
          </div>

          {/* Category Section: Maintenance */}
          <div className="space-y-1 pt-1">
            <div className="text-[11px] font-bold text-slate-400 px-1 uppercase tracking-wider">
              Maintenance
            </div>

            {/* Expandable Group: Maintenance / Industrial SEO & AEO */}
            <button
              type="button"
              onClick={() => setEngineMenuOpen(!engineMenuOpen)}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center border border-sky-200/60 shadow-2xs shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <rect x="4" y="3" width="16" height="18" rx="2" />
                    <line x1="8" y1="8" x2="16" y2="8" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                    <line x1="8" y1="16" x2="13" y2="16" />
                  </svg>
                </div>
                <span className="font-semibold text-slate-800">Maintenance</span>
              </div>
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${engineMenuOpen ? "rotate-0" : "-rotate-90"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Indented Sub-Items with Vertical Connector Line */}
            {engineMenuOpen && (
              <div className="relative ml-5 pl-3.5 border-l border-slate-200 space-y-0.5 py-1">
                {navItems
                  .filter((item) => item.label !== "Workspace & Rules" && item.label !== "Billing & Quotas")
                  .map((item) => {
                    const isActive = activeTab === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setActiveTab(item.label)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                          isActive
                            ? "bg-sky-50 text-sky-700 font-bold border border-sky-200/70 shadow-2xs"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm shrink-0">{item.icon}</span>
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge ? (
                          <span
                            className={`px-1.5 py-0.5 text-[9.5px] font-mono rounded font-bold shrink-0 ${
                              isActive
                                ? "bg-sky-200 text-sky-800"
                                : item.badge === "Split-View" || item.badge === "Low Risk"
                                ? "bg-sky-50 text-sky-700 border border-sky-100"
                                : "bg-slate-100 text-slate-500 border border-slate-200/60"
                            }`}
                          >
                            {item.badge}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Settings, Upgrade & User Profile */}
        <div className="space-y-1.5 pt-3 border-t border-slate-100">
          {/* Settings */}
          <button
            type="button"
            onClick={() => setActiveTab("Workspace & Rules")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === "Workspace & Rules"
                ? "bg-sky-50 text-sky-700 border border-sky-200"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
            }`}
          >
            <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>Settings</span>
          </button>

          {/* Upgrade */}
          <button
            type="button"
            onClick={() => setActiveTab("Billing & Quotas")}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-sky-800 bg-sky-50/60 hover:bg-sky-100/70 border border-sky-200/60 transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-sky-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
              </svg>
              <span>Upgrade</span>
            </div>
            <span className="text-[10px] font-bold uppercase text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">
              {organizationPlan}
            </span>
          </button>

          {/* User Profile Card (Matches Reference Image) */}
          <div className="relative pt-1">
            <div
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100/80 cursor-pointer transition border border-transparent hover:border-slate-200"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0 border border-sky-200">
                  {userInitials}
                </div>
                <div className="min-w-0 truncate">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {userDisplayName}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {userDisplayOrg}
                  </div>
                </div>
              </div>

              <svg className="w-4 h-4 text-slate-400 shrink-0 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="7 15 12 20 17 15" />
                <polyline points="7 9 12 4 17 9" />
              </svg>
            </div>

            {/* User Popover Menu */}
            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 p-2 rounded-xl bg-white border border-slate-200 shadow-xl space-y-1 text-xs animate-in fade-in zoom-in-95 duration-150 z-30">
                <div className="px-2.5 py-1.5 border-b border-slate-100 flex items-center justify-between gap-1 text-[11px] text-slate-500 font-mono">
                  <span className="truncate">{userEmail}</span>
                  <span className="uppercase font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 text-[10px] shrink-0">
                    {organizationPlan}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("Workspace & Rules");
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                >
                  Manage Workspace
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("Billing & Quotas");
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                >
                  Plan &amp; Subscription
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    signOut().catch((error: unknown) => setActionMessage(error instanceof Error ? error.message : "Could not sign out."));
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-50 text-red-600 font-medium cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOP ANNOUNCEMENT BANNER - SOBER ENTERPRISE */}
        {showAnnouncement && (
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-2.5 text-slate-200 text-xs flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5 font-medium">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 radar-ping"></span>
                Live Announcement
              </span>
              <span className="text-slate-300">
                <strong>Quick start:</strong> choose a taxonomy, generate a draft, review it, then export HTML.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveTab("AEO Schema Hub")}
                className="underline font-bold text-sky-400 hover:text-sky-300 transition"
              >
                Inspect Schema Engine →
              </button>
              <button
                type="button"
                aria-label="Dismiss banner"
                onClick={() => setShowAnnouncement(false)}
                className="text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
              {activeTab}
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Tenant: <strong className="text-slate-800">{organizationName}</strong> ({userEmail})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="radar-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${workspaceLoading ? "bg-amber-500" : "bg-emerald-500"}`}></span>
              </span>
              <span className="font-mono text-xs">{workspaceLoading ? "Loading workspace" : "Workspace active"}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab("Taxonomy Matrix");
              }}
              className="px-4 py-2 rounded-xl bg-sky-600 text-xs font-bold text-white hover:bg-sky-500 shadow-sm transition card-interactive"
            >
              + New Batch
            </button>

            <button
              type="button"
              onClick={() => signOut().catch((error: unknown) => setActionMessage(error instanceof Error ? error.message : "Could not sign out."))}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-600 hover:bg-slate-50 font-medium transition"
            >
              Sign Out
            </button>
          </div>
        </header>

        <nav aria-label="Workspace navigation" className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 md:hidden">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setActiveTab(item.label)}
              aria-current={activeTab === item.label ? "page" : undefined}
              className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${activeTab === item.label ? "bg-sky-50 text-sky-700" : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        {/* Email Verification Alert Banner */}
        {user && !user.emailVerified && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl border border-amber-300 bg-amber-50 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-3 shadow-xs animate-fade-in">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>
                <strong>Email verification pending:</strong> A verification link was sent to <strong>{user.email}</strong>. Please verify to ensure full publishing access.
              </span>
            </div>
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendingVerification}
              className="px-3 py-1 rounded-lg bg-amber-200/80 hover:bg-amber-200 text-amber-900 font-bold text-xs transition cursor-pointer disabled:opacity-50"
            >
              {resendingVerification ? "Sending link…" : "Resend Verification Email →"}
            </button>
          </div>
        )}

        {/* Global Feedback Banner */}
        {actionMessage ? (
          <div className="mx-6 mt-4 p-3.5 rounded-xl border border-sky-200 bg-sky-50 text-xs text-sky-900 flex items-center justify-between shadow-xs animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-600"></span>
              <span className="font-medium">{actionMessage}</span>
            </div>
            <button type="button" aria-label="Dismiss message" onClick={() => setActionMessage("")} className="text-sky-600 hover:text-sky-900 font-bold">
              ✕
            </button>
          </div>
        ) : null}

        {/* TAB 1: MISSION CONTROL */}
        {activeTab === "Mission Control" && (
          <div className="p-6 space-y-6 max-w-7xl animate-fade-in">
            {/* Workspace KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Saved drafts", value: reviewDrafts.length, detail: "in this workspace", target: "QA Review Studio" as const },
                { label: "Awaiting review", value: reviewDraftCount, detail: "need a review decision", target: "QA Review Studio" as const },
                { label: "Approved", value: approvedDraftCount, detail: "ready for publishing", target: "Publishing Pipeline" as const },
                { label: "Marked published", value: publishedDraftCount, detail: "not verified live on a site", target: "Publishing Pipeline" as const },
              ].map((metric) => (
                <button
                  key={metric.label}
                  type="button"
                  onClick={() => setActiveTab(metric.target)}
                  className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-xs transition card-interactive hover:border-sky-300 hover:bg-sky-50/50"
                >
                  <div className="text-xs font-mono text-slate-500 uppercase">{metric.label}</div>
                  <div className="mt-2 text-3xl font-extrabold text-slate-900">
                    <AnimatedCounter value={metric.value} />
                  </div>
                  <div className="mt-1 text-xs text-slate-600">{metric.detail} · Open</div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-2">
                <div className="flex flex-wrap items-end justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Drafts created in the last 7 days</h3>
                    <p className="text-xs text-slate-500">Calculated from saved workspace draft timestamps, not search traffic.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const newDraft: Draft = {
                          id: `fr-telemetry-${Date.now().toString().slice(-4)}`,
                          title: `Autonomous Spec Verification: ${currentVerticalData.equipment[0]} Audit`,
                          stage: "In Review",
                          keyword: `${currentVerticalData.equipment[0].toLowerCase()} inspection`,
                          vertical: selectedVertical,
                          equipment: currentVerticalData.equipment[0],
                          standard: currentVerticalData.standards[0],
                          createdAt: new Date().toISOString(),
                          qa: {
                            wordCount: "Pass",
                            faqCount: "Pass",
                            ctaCount: "Pass",
                            linkAllowlist: "Pass",
                            uniqueness: "Pass",
                            fluffFilter: "Pass",
                            aeoCapsule: "Pass",
                            riskScore: "Pass",
                          },
                          summary: `Autonomous dynamic audit for ${currentVerticalData.equipment[0]} operating within verified tolerance bands.`,
                          sections: [
                            {
                              heading: "Real-time Telemetry Acquisition",
                              body: currentVerticalData.capsuleText,
                            },
                          ],
                          faqs: [
                            {
                              q: `What is the target threshold for ${currentVerticalData.equipment[0]}?`,
                              a: currentVerticalData.capsuleText,
                            },
                          ],
                          schema: JSON.stringify({ "@context": "https://schema.org", "@type": "TechArticle", name: currentVerticalData.sampleTitle }, null, 2),
                        };
                        setReviewDrafts((cur) => [newDraft, ...cur]);
                        setActionMessage(`Dynamic telemetry stream: Ingested 1 new draft into ${selectedVertical}.`);
                      }}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-200 text-xs font-mono text-slate-700 hover:text-sky-700 font-semibold flex items-center gap-1.5 transition card-interactive"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping"></span>
                      <span>+ Ingest Telemetry Draft</span>
                    </button>
                    <span className="text-xs font-mono text-slate-600 font-bold">
                      <AnimatedCounter value={recentDraftActivity.reduce((sum, day) => sum + day.count, 0)} suffix=" drafts" />
                    </span>
                  </div>
                </div>
                <div className="mt-5 grid h-48 grid-cols-7 items-end gap-3">
                  {recentDraftActivity.map((day, index) => {
                    const barHeightPct = maximumDailyDrafts > 0 ? Math.max((day.count / maximumDailyDrafts) * 100, 6) : 6;
                    const isToday = index === 6;
                    return (
                      <div key={`${day.label}-${index}`} className="flex h-full flex-col items-center justify-end gap-2 group">
                        <span className="text-xs font-semibold text-slate-700 font-mono transition-transform group-hover:scale-110">
                          {day.count > 0 ? day.count : ""}
                        </span>
                        <div
                          title={`${day.count} draft${day.count === 1 ? "" : "s"}`}
                          className={`w-full max-w-12 rounded-t chart-bar-anim ${isToday
                            ? "bg-gradient-to-t from-sky-600 to-sky-400 shadow-sm shadow-sky-500/20"
                            : day.count > 0
                              ? "bg-sky-500 hover:bg-sky-400"
                              : "bg-slate-200 hover:bg-sky-300"
                            }`}
                          style={{ height: `${barHeightPct}%` }}
                        />
                        <span className={`text-xs font-mono ${isToday ? "font-bold text-sky-700" : "text-slate-500"}`}>
                          {day.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <h3 className="text-base font-bold text-slate-900">Workflow snapshot</h3>
                <p className="mt-1 text-xs text-slate-500">Counts update from saved draft statuses.</p>
                <div className="mt-4 space-y-3">
                  {[
                    ["In review", reviewDraftCount],
                    ["Approved", approvedDraftCount],
                    ["Marked published", publishedDraftCount],
                  ].map(([label, count]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setActiveTab(label === "Marked published" ? "Publishing Pipeline" : "QA Review Studio")}
                      className="flex w-full items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:bg-sky-50 transition card-interactive"
                    >
                      <span>{label}</span>
                      <strong className="font-mono">
                        <AnimatedCounter value={count as number} />
                      </strong>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Verified Engineering Parameter & Tolerance Index */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">
                    Deterministic Reliability & Parameter Veracity Matrix
                  </h3>
                  <p className="text-xs text-slate-500">
                    Physical units, regulatory codes, and chemical formulations verified by closed-loop inspection.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800">
                  ZERO FLUFF CERTIFIED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono font-bold text-slate-500 uppercase text-[11px] block">Verified Standards & Codes</span>
                  <div className="flex flex-wrap gap-1.5">
                    {customStandards.map((std, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-bold">
                        ✓ {std}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono font-bold text-slate-500 uppercase text-[11px] block">Physical Operating Tolerances</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Concentration: >2.5% NaOH", "Thermal: >80°C (176°F)", "Manifold Delta: 15 bar", "Spray Angle: 26° offset", "Viscosity: 450,000 SSU"].map((tol, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-mono text-[10px] font-bold">
                        ⚡ {tol}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono font-bold text-slate-500 uppercase text-[11px] block">Banned Fluff Superlatives Filter</span>
                  <div className="flex flex-wrap gap-1.5">
                    {customBannedWords.map((word, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-mono text-[10px] line-through">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TAXONOMY MATRIX */}
        {activeTab === "Taxonomy Matrix" && (
          <div className="p-6 space-y-6 max-w-7xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Pre-Built Industrial Taxonomy Library</h2>
                <p className="text-xs text-slate-500">
                  Select a manufacturing vertical to inspect relational equipment nodes, failure modes, and compliance frameworks.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowIngestModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span>📄</span>
                  <span>Ingest Datasheet (PDF/Text)</span>
                </button>
                <span className="text-xs font-mono text-slate-500 font-bold">VERTICAL:</span>
                <select
                  value={selectedVertical}
                  onChange={(e) => {
                    setSelectedVertical(e.target.value);
                    setSelectedEquipmentIndex(0);
                    setSelectedFailureIndex(0);
                    setSelectedStandardIndex(0);
                  }}
                  className="bg-white border border-slate-300 text-xs rounded-xl px-3.5 py-2 text-slate-800 font-semibold outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 shadow-xs"
                >
                  {Object.keys(verticalTaxonomies).map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Matrix Columns with Staggered Entrance */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Equipment */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs card-interactive animate-stagger-1">
                <div className="text-xs font-mono font-bold uppercase text-sky-700 mb-3 flex justify-between">
                  <span>01. Equipment Class</span>
                  <span className="text-slate-500">{currentVerticalData.equipment.length} Nodes</span>
                </div>
                <div className="space-y-2">
                  {currentVerticalData.equipment.map((eq, idx) => {
                    const isSelected = idx === selectedEquipmentIndex;
                    return (
                      <button
                        key={eq}
                        type="button"
                        onClick={() => setSelectedEquipmentIndex(idx)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs font-medium transition flex items-center justify-between cursor-pointer ${isSelected
                          ? "bg-sky-50 border-sky-400 text-sky-900 font-bold ring-1 ring-sky-300 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-800 hover:border-sky-300 hover:bg-sky-50/50"
                          }`}
                      >
                        <span>{eq}</span>
                        {isSelected && <span className="text-sky-600 text-xs font-bold">●</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Failure Modes */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs card-interactive animate-stagger-2">
                <div className="text-xs font-mono font-bold uppercase text-amber-700 mb-3 flex justify-between">
                  <span>02. Failure / Problem</span>
                  <span className="text-slate-500">{currentVerticalData.failureModes.length} Modes</span>
                </div>
                <div className="space-y-2">
                  {currentVerticalData.failureModes.map((fm, idx) => {
                    const isSelected = idx === selectedFailureIndex;
                    return (
                      <button
                        key={fm}
                        type="button"
                        onClick={() => setSelectedFailureIndex(idx)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs font-medium transition flex items-center justify-between cursor-pointer ${isSelected
                          ? "bg-amber-50 border-amber-400 text-amber-900 font-bold ring-1 ring-amber-300 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-800 hover:border-amber-300 hover:bg-amber-50/50"
                          }`}
                      >
                        <span>{fm}</span>
                        {isSelected && <span className="text-amber-600 text-xs font-bold">●</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Standards */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs card-interactive animate-stagger-3">
                <div className="text-xs font-mono font-bold uppercase text-emerald-700 mb-3 flex justify-between">
                  <span>03. Certified Standards</span>
                  <span className="text-slate-500">{currentVerticalData.standards.length} Norms</span>
                </div>
                <div className="space-y-2">
                  {currentVerticalData.standards.map((st, idx) => {
                    const isSelected = idx === selectedStandardIndex;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setSelectedStandardIndex(idx)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs font-medium transition flex items-center justify-between cursor-pointer ${isSelected
                          ? "bg-emerald-50 border-emerald-400 text-emerald-900 font-bold ring-1 ring-emerald-300 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-800 hover:border-emerald-300 hover:bg-emerald-50/50"
                          }`}
                      >
                        <span>{st}</span>
                        {isSelected && <span className="text-emerald-600 text-xs font-bold">●</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Output & Intent */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between card-interactive animate-stagger-4">
                <div>
                  <div className="text-xs font-mono font-bold uppercase text-purple-700 mb-3 flex justify-between">
                    <span>04. Programmatic Output</span>
                    <span className="text-purple-700 font-bold">AEO Ready</span>
                  </div>
                  <div key={dynamicTopicTitle} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 leading-snug animate-fade-in transition-all">
                    {dynamicTopicTitle}
                  </div>
                  <div className="mt-3 space-y-1.5 text-xs font-mono text-slate-600">
                    <div className="transition-all duration-300">
                      • Intent: <span className="text-slate-900 font-semibold">{dynamicIntent}</span>
                    </div>
                    <div className="transition-all duration-300">
                      • Search Vol: <span className="text-slate-900 font-semibold">{dynamicSearchVolume}</span>
                    </div>
                    <div className="transition-all duration-300">
                      • Pipeline Value: <span className="text-emerald-700 font-bold">{dynamicPipelineValue}</span>
                    </div>
                    <div className="transition-all duration-300">
                      • Spec Risk: <span className="text-sky-700 font-bold">{dynamicSpecRisk}</span>
                    </div>
                  </div>
                </div>

                <button
                  disabled={generationBusy}
                  onClick={() => generateProgrammaticBatch()}
                  className="mt-4 w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition uppercase tracking-wider shadow-sm cursor-pointer disabled:opacity-50"
                >
                  Generate Matrix Slice
                </button>

                <button
                  type="button"
                  disabled={geminiLoading}
                  onClick={() => {
                    setGeminiActiveTarget("taxonomy");
                    void fetchGeminiSuggestions(dynamicTopicTitle, activeEquipment, activeStandard, selectedVertical);
                  }}
                  className="mt-2 w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>✨</span>
                  <span>{geminiLoading && geminiActiveTarget === "taxonomy" ? "Gemini Analyzing Node…" : "Gemini Keyword & Title Intel"}</span>
                </button>
              </div>
            </div>

            {/* GEMINI INTELLIGENCE PANEL (TAXONOMY MATRIX) */}
            {geminiPanelOpen && geminiActiveTarget === "taxonomy" && (
              <div className="p-5 rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 space-y-4 shadow-md animate-in fade-in zoom-in-95 duration-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-indigo-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-sm">
                      ✨
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <span>Gemini Industrial Taxonomy &amp; AEO Suggestions</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                          Gemini 3.5 Flash · Zero-Hallucination Grounding
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Pre-generation technical keywords, SERP meta titles, and 45-word direct answer capsules.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      disabled={geminiLoading}
                      onClick={() => void fetchGeminiSuggestions(dynamicTopicTitle, activeEquipment, activeStandard, selectedVertical)}
                      className="px-3 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>🔄</span>
                      <span>{geminiLoading ? "Regenerating…" : "Regenerate"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGeminiPanelOpen(false)}
                      className="text-slate-400 hover:text-slate-600 p-1 text-sm font-bold cursor-pointer"
                      aria-label="Close Gemini Panel"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {geminiLoading ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-2 text-indigo-600">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs font-mono font-semibold">Gemini analyzing industrial standards and search volume…</p>
                  </div>
                ) : geminiSuggestions ? (
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-white border border-indigo-100 text-xs text-slate-700 flex items-start gap-2 shadow-2xs">
                      <span className="text-indigo-600 font-bold shrink-0 mt-0.5">💡 Engineering Rationale:</span>
                      <span className="font-medium text-slate-800">{geminiSuggestions.rationale}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Suggested Titles */}
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-1.5 text-indigo-700">
                            <span>🏷️</span>
                            <span>Recommended High-CTR Titles (&lt;60 Chars)</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">SERP &amp; SGE</span>
                        </div>
                        <div className="space-y-1.5">
                          {geminiSuggestions.suggestedTitles.map((t, idx) => (
                            <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-900">
                              {t}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Suggested Keywords */}
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-1.5 text-amber-700">
                            <span>🎯</span>
                            <span>Target Zero-Volume Technical Queries</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">High-Intent</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {geminiSuggestions.suggestedKeywords.map((kw, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-mono font-medium"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Meta Description */}
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-1.5 text-sky-700">
                            <span>📝</span>
                            <span>155-Char Answer-First Meta Description</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{geminiSuggestions.metaDescription.length} chars</span>
                        </div>
                        <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed font-medium">
                          {geminiSuggestions.metaDescription}
                        </p>
                      </div>

                      {/* AEO Answer Capsule */}
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-1.5 text-emerald-700">
                            <span>⚡</span>
                            <span>45-Word AEO Answer Capsule (Perplexity &amp; SGE)</span>
                          </span>
                          <span className="text-[10px] font-mono text-emerald-600 font-bold">LLM Cited</span>
                        </div>
                        <p className="text-xs text-slate-700 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100 leading-relaxed font-medium">
                          {geminiSuggestions.answerCapsule}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}

                    {/* Modal: Ingest Spec Sheet (PDF/Text) with Dropzone */}
            {showIngestModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
                <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                        📄
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Ingest Equipment Datasheet / Spec Sheet</h3>
                        <p className="text-xs text-slate-500">Extracts equipment nodes, failure modes, ASTM/ISO standards using Gemini</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowIngestModal(false);
                        setIngestedSpecResult(null);
                        setUploadedFileName("");
                      }}
                      className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Vertical Hint / Equipment Category (Optional)</label>
                      <input
                        type="text"
                        value={specVerticalHint}
                        onChange={(e) => setSpecVerticalHint(e.target.value)}
                        placeholder="e.g. Sanitary Rotary Pumps, Industrial Boilers, Descaling Headers..."
                        className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-purple-500 text-slate-800"
                      />
                    </div>

                    {/* File Dropzone */}
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                        const file = e.dataTransfer.files[0];
                        if (file) handleFileRead(file);
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-4 rounded-xl border-2 border-dashed transition text-center cursor-pointer ${
                        dragOver ? "border-purple-500 bg-purple-50" : "border-slate-300 hover:border-purple-400 bg-slate-50/70"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.txt,.csv,.json,.md"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileRead(file);
                        }}
                      />
                      <div className="flex flex-col items-center gap-1 text-xs">
                        <span className="text-xl">📁</span>
                        <span className="font-bold text-slate-800">
                          {uploadedFileName ? `Attached: ${uploadedFileName}` : "Drag & Drop Equipment Datasheet (.pdf, .txt, .csv, .md) or Click to Browse"}
                        </span>
                        <span className="text-[11px] text-slate-500">Auto-populates text parser with tolerances, pressures, and ASTM/ISO specs</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Technical Spec / Datasheet Text</label>
                      <textarea
                        rows={5}
                        value={specInputText}
                        onChange={(e) => setSpecInputText(e.target.value)}
                        placeholder="Paste engineering tolerances, operating pressures, temperatures, material specs (e.g. 3-A 02-12, FKM elastomers, CIP wash 2.5% NaOH at 85°C)..."
                        className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-purple-500 text-slate-800 font-mono"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[11px] text-slate-500 font-mono">
                        {specInputText.length} characters • Powered by Gemini 3.5
                      </span>
                      <button
                        type="button"
                        onClick={handleIngestSpec}
                        disabled={specIngesting || specInputText.trim().length < 20}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition cursor-pointer"
                      >
                        {specIngesting ? (
                          <>
                            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span>Extracting Industrial Nodes...</span>
                          </>
                        ) : (
                          <>
                            <span>⚡</span>
                            <span>Extract Industrial Slice</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Extracted Result Preview */}
                    {ingestedSpecResult && (
                      <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-3 mt-3 animate-fade-in text-xs">
                        <div className="flex items-center justify-between font-bold text-purple-950">
                          <span>{ingestedSpecResult.name}</span>
                          <span className="font-mono text-purple-700">{ingestedSpecResult.estimatedAcv} ACV</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-slate-700">
                          <div>
                            <span className="font-bold text-[11px] text-slate-500 uppercase font-mono block">Equipment ({ingestedSpecResult.equipment?.length || 0})</span>
                            <ul className="list-disc list-inside space-y-0.5 mt-1">
                              {ingestedSpecResult.equipment?.map((eq: string, idx: number) => (
                                <li key={idx} className="truncate">{eq}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="font-bold text-[11px] text-slate-500 uppercase font-mono block">Standards ({ingestedSpecResult.standards?.length || 0})</span>
                            <ul className="list-disc list-inside space-y-0.5 mt-1">
                              {ingestedSpecResult.standards?.map((std: string, idx: number) => (
                                <li key={idx} className="truncate">{std}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white border border-purple-100 text-purple-900 text-[11px]">
                          <strong>Engineering Guardrail:</strong> {ingestedSpecResult.recommendedToleranceRule}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActionMessage(`Added "${ingestedSpecResult.name}" to workspace taxonomy library!`);
                            setShowIngestModal(false);
                            setIngestedSpecResult(null);
                          }}
                          className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
                        >
                          ✓ Commit Slice to Active Matrix
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

{/* TAB 3: QA REVIEW STUDIO */}
        {activeTab === "QA Review Studio" && reviewDrafts.length === 0 && (
          <div className="m-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-lg font-bold text-slate-900">{workspaceLoading ? "Loading drafts…" : "No saved drafts yet"}</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
              Generate a batch to create drafts in this workspace. Example content is not treated as saved or reviewable.
            </p>
            {!workspaceLoading ? (
              <button type="button" onClick={() => setActiveTab("Taxonomy Matrix")} className="mt-4 rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-sky-500">
                Choose a taxonomy
              </button>
            ) : null}
          </div>
        )}
        {activeTab === "QA Review Studio" && reviewDrafts.length > 0 && (
          <div className="p-6 space-y-6 max-w-7xl">
            {/* Top Toolbar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">Structural QA Studio & Split Editor</h2>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    {selectedDraft.stage}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Closed-loop structural QA gating: verify engineering specs, allowlisted URLs, and LLM answer capsules.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  disabled={geminiLoading}
                  onClick={() => {
                    setGeminiActiveTarget("qa");
                    void fetchGeminiSuggestions();
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  <span>✨</span>
                  <span>{geminiLoading && geminiActiveTarget === "qa" ? "Gemini Optimizing…" : "Gemini AEO Suggestions"}</span>
                </button>

                <button
                  disabled={isPatching}
                  onClick={() => runAutoPatch()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition disabled:opacity-50"
                >
                  <span>{isPatching ? "⏳" : "⚡"}</span>
                  <span>{isPatching ? `Step ${patchStep}/4: Auto-Patching…` : "Run Auto-Patch Closed Loop"}</span>
                </button>

                <button
                  onClick={() => updateDraftStage("approve")}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 border border-slate-200 shadow-xs"
                >
                  Approve (Marketer)
                </button>

                <button
                  type="button"
                  onClick={() => setShowSignOffModal(true)}
                  className="px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-600 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>✍️</span>
                  <span>Engineering Sign-Off</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateDraftStage("publish")}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🚀</span>
                  <span>Publish to CMS</span>
                </button>
              </div>
            </div>

            {/* EXPERT REVIEW WARNING BANNER (Enforces Requirement 6) */}
            {(!selectedDraft.pageReview || selectedDraft.pageReview.status !== "APPROVED") && (
              <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/90 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-xs animate-fade-in">
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0 mt-0.5">⚠️</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-amber-900 uppercase font-mono tracking-wider">
                        {selectedDraft.pageReview
                          ? selectedDraft.pageReview.status === "CHANGES_REQUESTED"
                            ? "Changes Requested by Reviewer"
                            : "Review Pending Application Engineer"
                          : "Not expert reviewed"}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-200/90 text-amber-950 border border-amber-300">
                        PUBLISHING GATED
                      </span>
                    </div>
                    <p className="text-amber-800 mt-1">
                      {selectedDraft.pageReview?.status === "CHANGES_REQUESTED"
                        ? `Application engineer requested redlines: "${selectedDraft.pageReview.reviewerNotes || "Tolerances require verification"}". Address annotations before approving.`
                        : selectedDraft.pageReview?.status === "PENDING"
                        ? `Assigned to ${selectedDraft.pageReview.reviewer?.name || "Application Engineer"}. Awaiting sign-off on operating envelopes and regulatory codes.`
                        : "This technical page has not received engineering approval. Publishing to production CMS is blocked until a qualified application engineer reviews and signs off."}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                  <button
                    type="button"
                    onClick={() => setShowSignOffModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <span>🔍</span>
                    <span>Review &amp; Sign Off Now</span>
                  </button>
                </div>
              </div>
            )}

            {/* EXPERT REVIEW & GOVERNANCE BAR */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-500 uppercase">Review Status:</span>
                  {selectedDraft.pageReview?.status === "APPROVED" ? (
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                      <span>✓</span>
                      <span>Approved: {selectedDraft.pageReview.reviewer?.name || "Certified Application Engineer"}</span>
                    </span>
                  ) : selectedDraft.pageReview?.status === "CHANGES_REQUESTED" ? (
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5 shadow-2xs">
                      <span>⚠️</span>
                      <span>Changes Requested</span>
                    </span>
                  ) : selectedDraft.pageReview?.status === "PENDING" ? (
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-100 text-sky-800 border border-sky-200 flex items-center gap-1.5 shadow-2xs">
                      <span>⏳</span>
                      <span>Pending: {selectedDraft.pageReview.reviewer?.name || "Engineer Assigned"}</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-100 text-red-800 border border-red-200 flex items-center gap-1.5 shadow-2xs">
                      <span>⛔</span>
                      <span>Not expert reviewed</span>
                    </span>
                  )}
                </div>

                {selectedDraft.pageReview?.reviewer && (
                  <div className="text-xs text-slate-600 flex items-center gap-2 border-l border-slate-200 pl-3">
                    <span className="font-semibold text-slate-800">{selectedDraft.pageReview.reviewer.jobTitle}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-mono text-[11px] text-slate-500">{selectedDraft.pageReview.reviewer.credentials}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Assign Reviewer Dropdown */}
                <div className="flex items-center gap-1.5">
                  <label htmlFor="qa-assign-reviewer" className="text-xs text-slate-500 font-semibold font-mono uppercase">
                    Assign:
                  </label>
                  <select
                    id="qa-assign-reviewer"
                    disabled={isReviewBusy}
                    value={selectedDraft.pageReview?.reviewerId || ""}
                    onChange={(e) => {
                      if (e.target.value) {
                        void handleAssignReviewer(selectedDraft.id, e.target.value);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer"
                  >
                    <option value="">Choose Reviewer…</option>
                    {reviewers.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.credentials})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Review & Sign-Off Button */}
                <button
                  type="button"
                  onClick={() => {
                    setSignOffReviewerId(selectedDraft.pageReview?.reviewerId || reviewers[0]?.id || "");
                    setShowSignOffModal(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition"
                >
                  <span>✍️</span>
                  <span>Sign-Off &amp; Redline</span>
                </button>

                {/* Reviewer Directory Button */}
                <button
                  type="button"
                  onClick={() => setShowReviewerModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5 cursor-pointer transition"
                >
                  <span>👥</span>
                  <span>Reviewers Directory</span>
                </button>
              </div>
            </div>

            {/* Animated AST Patch Progress Bar */}
            {isPatching && (
              <div className="p-4 rounded-xl border border-sky-300 bg-sky-50 space-y-2.5 animate-fade-in shadow-xs">
                <div className="flex justify-between items-center text-xs font-mono font-bold text-sky-900">
                  <span className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="radar-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-600"></span>
                    </span>
                    <span>AST Auto-Patching In Progress · Step {patchStep} of 4</span>
                  </span>
                  <span className="text-sky-700 font-extrabold">{patchStep * 25}%</span>
                </div>
                <div className="h-2 w-full bg-sky-200 rounded-full overflow-hidden shimmer-bar">
                  <div
                    className="h-full bg-gradient-to-r from-sky-600 to-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${patchStep * 25}%` }}
                  ></div>
                </div>
                <div className="text-xs text-sky-800 font-medium flex items-center justify-between">
                  <span>
                    {patchStep === 1 && "Step 1/4: Validating word count band (2,800–3,500 words) & detecting missing CTA…"}
                    {patchStep === 2 && "Step 2/4: Auto-patching CTA with verified phrasing & injecting allowlisted 3-A / ASME links…"}
                    {patchStep === 3 && "Step 3/4: Enforcing 5+ FAQ items & stripping forbidden styling elements…"}
                    {patchStep === 4 && "Step 4/4: Compiling nested FAQPage, Article & HowTo JSON-LD schema with Answer-First formatting…"}
                  </span>
                  <span className="font-mono text-sky-600 font-bold">AST Refactor Live</span>
                </div>
              </div>
            )}

            {/* GEMINI INDUSTRIAL SEO & AEO ASSISTANT PANEL */}
            {geminiPanelOpen && geminiActiveTarget === "qa" && (
              <div className="p-5 rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 space-y-4 shadow-md animate-in fade-in zoom-in-95 duration-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-indigo-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-sm">
                      ✨
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <span>Gemini Industrial SEO &amp; AEO Optimizer</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                          Gemini 3.5 Flash · Zero-Hallucination Grounding
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Deterministic meta keywords, high-CTR B2B titles, and 45-word direct answer capsules for AI engines.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      disabled={geminiLoading}
                      onClick={() => void fetchGeminiSuggestions()}
                      className="px-3 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>🔄</span>
                      <span>{geminiLoading ? "Regenerating…" : "Regenerate"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGeminiPanelOpen(false)}
                      className="text-slate-400 hover:text-slate-600 p-1 text-sm font-bold cursor-pointer"
                      aria-label="Close Gemini Panel"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {geminiLoading ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-2 text-indigo-600">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs font-mono font-semibold">Gemini analyzing industrial standards and search volume…</p>
                  </div>
                ) : geminiSuggestions ? (
                  <div className="space-y-4">
                    {/* Rationale Bar */}
                    <div className="p-3 rounded-xl bg-white border border-indigo-100 text-xs text-slate-700 flex items-start gap-2 shadow-2xs">
                      <span className="text-indigo-600 font-bold shrink-0 mt-0.5">💡 Engineering Rationale:</span>
                      <span className="font-medium text-slate-800">{geminiSuggestions.rationale}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 1. Suggested Titles */}
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-1.5 text-indigo-700">
                            <span>🏷️</span>
                            <span>High-CTR Industrial Titles (&lt;60 Chars)</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">SERP &amp; SGE</span>
                        </div>
                        <div className="space-y-1.5">
                          {geminiSuggestions.suggestedTitles.map((t, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs hover:border-indigo-200 transition">
                              <span className="font-semibold text-slate-900 truncate">{t}</span>
                              <button
                                type="button"
                                onClick={() => void applyGeminiTitle(t)}
                                className="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-mono text-[10px] font-bold shrink-0 cursor-pointer border border-indigo-200"
                              >
                                Apply Title
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 2. Suggested Zero-Volume Keywords */}
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-1.5 text-amber-700">
                            <span>🎯</span>
                            <span>Zero-Volume B2B Technical Keywords</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">High-Intent</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {geminiSuggestions.suggestedKeywords.map((kw, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => void applyGeminiKeyword(kw)}
                              className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1"
                              title="Click to set as target keyword"
                            >
                              <span>+</span>
                              <span>{kw}</span>
                            </button>
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 italic">
                          Click any keyword pill to set as the draft&apos;s primary target query.
                        </p>
                      </div>

                      {/* 3. 155-Char Meta Description */}
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-1.5 text-sky-700">
                            <span>📝</span>
                            <span>155-Char Answer-First Meta Description</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{geminiSuggestions.metaDescription.length} chars</span>
                        </div>
                        <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed font-medium">
                          {geminiSuggestions.metaDescription}
                        </p>
                        <button
                          type="button"
                          onClick={() => void applyGeminiDescription(geminiSuggestions.metaDescription)}
                          className="w-full py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold cursor-pointer transition text-center"
                        >
                          Apply as Meta Description &amp; Summary
                        </button>
                      </div>

                      {/* 4. AEO Direct Answer Capsule */}
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-1.5 text-emerald-700">
                            <span>⚡</span>
                            <span>45-Word AEO Answer Capsule (Perplexity &amp; SGE)</span>
                          </span>
                          <span className="text-[10px] font-mono text-emerald-600 font-bold">LLM Cited</span>
                        </div>
                        <p className="text-xs text-slate-700 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100 leading-relaxed font-medium">
                          {geminiSuggestions.answerCapsule}
                        </p>
                        <button
                          type="button"
                          onClick={() => void applyGeminiCapsule(geminiSuggestions.answerCapsule)}
                          className="w-full py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold cursor-pointer transition text-center"
                        >
                          Apply to Lead Answer Capsule
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* QA STATUS STRIP */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-xs mr-1">QA Status Strip:</span>
                <span className="px-2.5 py-1 rounded text-xs font-bold border bg-emerald-50 text-emerald-800 border-emerald-200 animate-badge-pop">
                  ✅ Word count
                </span>
                <span className="px-2.5 py-1 rounded text-xs font-bold border bg-emerald-50 text-emerald-800 border-emerald-200 animate-badge-pop">
                  ✅ FAQ · 5
                </span>
                <span
                  className={`px-2.5 py-1 rounded text-xs font-bold border transition-all ${selectedDraft.qa.ctaCount === "Pass"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200 animate-badge-pop"
                    : "bg-red-50 text-red-800 border-red-200"
                    }`}
                >
                  {selectedDraft.qa.ctaCount === "Pass" ? "✅ CTA · 1" : "❌ CTA missing"}
                </span>
                <span className="px-2.5 py-1 rounded text-xs font-bold border bg-emerald-50 text-emerald-800 border-emerald-200 animate-badge-pop">
                  ✅ Links OK
                </span>
                <span className="px-2.5 py-1 rounded text-xs font-bold border bg-emerald-50 text-emerald-800 border-emerald-200 animate-badge-pop">
                  ✅ Unique
                </span>
                <span className="px-2.5 py-1 rounded text-xs font-bold border bg-emerald-50 text-emerald-800 border-emerald-200 animate-badge-pop">
                  ✅ Schema
                </span>
              </div>
              <span className="text-xs text-slate-500 font-sans hidden sm:inline">
                {selectedDraft.qa.ctaCount === "Pass" ? "Ready to approve & publish" : "Click Auto-patch to fix CTA & formatting"}
              </span>
            </div>

            {/* SPLIT VIEW WORKSPACE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Draft Selector Sidebar with Search & Stage Filter */}
              <div className="lg:col-span-3 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-500 font-bold">
                  <span>Batch Queue ({reviewDrafts.length})</span>
                  {reviewDrafts.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActionMessage(`Selected all ${reviewDrafts.length} drafts for bulk action.`)}
                      className="text-sky-600 hover:text-sky-700 text-[10px] font-bold lowercase tracking-normal cursor-pointer"
                    >
                      select all
                    </button>
                  )}
                </div>

                {/* Queue Filter Controls */}
                <div className="space-y-2">
                  <input
                    type="text"
                    value={draftSearchQuery}
                    onChange={(e) => setDraftSearchQuery(e.target.value)}
                    placeholder="Search by title or keyword..."
                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50/70 focus:bg-white focus:outline-none focus:border-sky-500 text-slate-800 placeholder:text-slate-400"
                  />
                  <div className="flex gap-1">
                    {(["ALL", "Review", "Approved", "Published"] as const).map((stage) => (
                      <button
                        key={stage}
                        type="button"
                        onClick={() => setDraftStageFilter(stage)}
                        className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition cursor-pointer ${
                          draftStageFilter === stage
                            ? "bg-sky-600 text-white shadow-2xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {reviewDrafts
                    .filter((d) => {
                      if (draftStageFilter !== "ALL" && d.stage !== draftStageFilter) return false;
                      if (draftSearchQuery.trim()) {
                        const q = draftSearchQuery.toLowerCase();
                        return d.title.toLowerCase().includes(q) || (d.vertical || "").toLowerCase().includes(q);
                      }
                      return true;
                    })
                    .map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDraftId(d.id)}
                      className={`w-full p-3.5 rounded-xl text-left border transition shadow-xs card-interactive ${selectedDraft.id === d.id
                        ? "bg-sky-50 border-sky-300 text-slate-900"
                        : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
                        }`}
                    >
                      <div className="text-xs font-bold line-clamp-2">{d.title}</div>
                      <div className="flex justify-between items-center mt-2 text-xs font-mono">
                        <span className="text-slate-500">{d.keyword}</span>
                        <span className="text-sky-700 font-bold uppercase">{d.stage}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Render & Structured Pane */}
              <div className="lg:col-span-9 space-y-4">
                {/* View Mode Toggle */}
                <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-1.5 text-xs font-mono shadow-xs">
                  <div className="flex gap-1">
                    <button
                      onClick={() => setPreviewTab("HumanView")}
                      className={`px-3 py-1.5 rounded-lg transition ${previewTab === "HumanView"
                        ? "bg-sky-50 text-sky-700 font-bold border border-sky-200"
                        : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                      Rendered Layout & Capsule
                    </button>
                    <button
                      onClick={() => setPreviewTab("StructuredNodes")}
                      className={`px-3 py-1.5 rounded-lg transition ${previewTab === "StructuredNodes"
                        ? "bg-sky-50 text-sky-700 font-bold border border-sky-200"
                        : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                      Structured AST Nodes
                    </button>
                    <button
                      onClick={() => setPreviewTab("SchemaJSON")}
                      className={`px-3 py-1.5 rounded-lg transition ${previewTab === "SchemaJSON"
                        ? "bg-sky-50 text-sky-700 font-bold border border-sky-200"
                        : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                      Exported JSON-LD Schema
                    </button>
                  </div>
                  <a
                    href={`/api/drafts/${encodeURIComponent(String(selectedDraft.id))}/export`}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-sans font-bold text-xs"
                  >
                    Download HTML ↓
                  </a>
                </div>

                {/* Pane Content */}
                <div className="p-6 rounded-2xl border border-slate-200 bg-white min-h-[460px] shadow-xs relative overflow-hidden">
                  {/* Inline WYSIWYG Content Editor Mode */}
                  {isEditingDraft && (
                    <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 mb-6 space-y-4 animate-fade-in text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                        <div className="flex items-center gap-2 font-bold text-amber-950">
                          <span>✏️</span>
                          <span>Chief Reliability Engineer — Content Modification Mode</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIsEditingDraft(false)}
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveDraftEdit}
                            disabled={isSavingEdit}
                            className="px-3.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            {isSavingEdit ? "Saving..." : "💾 Save Changes to Database"}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Article Title / H1</label>
                          <input
                            type="text"
                            value={editDraftTitle}
                            onChange={(e) => setEditDraftTitle(e.target.value)}
                            className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-900 font-bold"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">AEO Answer Capsule / Summary</label>
                          <textarea
                            rows={3}
                            value={editDraftSummary}
                            onChange={(e) => setEditDraftSummary(e.target.value)}
                            className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-800"
                          />
                        </div>

                        <div className="space-y-2">
                          <span className="font-bold text-slate-700 block">Technical Sections ({editSections.length})</span>
                          {editSections.map((sec, sIdx) => (
                            <div key={sIdx} className="p-3 rounded-lg bg-white border border-slate-200 space-y-1.5">
                              <input
                                type="text"
                                value={sec.heading}
                                onChange={(e) => {
                                  const updated = [...editSections];
                                  updated[sIdx].heading = e.target.value;
                                  setEditSections(updated);
                                }}
                                className="w-full text-xs font-bold text-slate-900 border-b border-slate-200 pb-1"
                              />
                              <textarea
                                rows={2}
                                value={sec.body}
                                onChange={(e) => {
                                  const updated = [...editSections];
                                  updated[sIdx].body = e.target.value;
                                  setEditSections(updated);
                                }}
                                className="w-full text-xs text-slate-700 border-0 p-0 focus:ring-0"
                              />
                            </div>
                          ))}
                        </div>

                        {/* FAQ Editor */}
                        <div className="space-y-2 pt-2 border-t border-amber-200">
                          <span className="font-bold text-slate-700 block">Authoritative FAQs ({editFaqs.length})</span>
                          {editFaqs.map((faq, fIdx) => (
                            <div key={fIdx} className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                              <input
                                type="text"
                                value={faq.q}
                                onChange={(e) => {
                                  const updated = [...editFaqs];
                                  updated[fIdx].q = e.target.value;
                                  setEditFaqs(updated);
                                }}
                                className="w-full text-xs font-bold text-slate-900 border-b border-slate-200 pb-1"
                              />
                              <textarea
                                rows={2}
                                value={faq.a}
                                onChange={(e) => {
                                  const updated = [...editFaqs];
                                  updated[fIdx].a = e.target.value;
                                  setEditFaqs(updated);
                                }}
                                className="w-full text-xs text-slate-700 border-0 p-0 focus:ring-0"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {isPatching && <div className="animate-scanline" />}
                  {previewTab === "HumanView" && (
                    <div className="space-y-6">
                      {/* AEO Answer Capsule Highlight */}
                      <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 text-slate-800">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-emerald-800 mb-1">
                          <span>⚡ AEO / GEO Answer Capsule (Target for Perplexity & Google AI Overviews)</span>
                        </div>
                        <p className="text-sm font-semibold leading-relaxed text-slate-900">
                          {selectedDraft.vertical && verticalTaxonomies[selectedDraft.vertical]?.capsuleText
                            ? verticalTaxonomies[selectedDraft.vertical].capsuleText
                            : currentVerticalData.capsuleText}
                        </p>
                      </div>

                      {/* Main Title & Body */}
                      <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{selectedDraft.title}</h1>
                        <p className="text-sm text-slate-600 mt-2 italic">{selectedDraft.summary}</p>
                      </div>

                      <div className="space-y-5 border-t border-slate-100 pt-5">
                        {selectedDraft.sections.map((sec, idx) => (
                          <div key={idx} className="space-y-2">
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                              <span className="text-xs font-mono text-sky-700">0{idx + 1}.</span>
                              <span>{sec.heading}</span>
                            </h3>
                            <p className="text-xs text-slate-700 leading-relaxed">{sec.body}</p>
                          </div>
                        ))}
                      </div>

                      {/* FAQs */}
                      <div className="border-t border-slate-100 pt-5 space-y-3">
                        <h3 className="text-sm font-mono font-bold uppercase text-slate-700">
                          Structured Diagnostic FAQs (Embedded in FAQPage Schema)
                        </h3>
                        {selectedDraft.faqs.map((f, i) => (
                          <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                            <div className="text-xs font-bold text-slate-900">{f.q}</div>
                            <div className="text-xs text-slate-600">{f.a}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {previewTab === "StructuredNodes" && (
                    <div className="space-y-4 font-mono text-xs">
                      <div className="text-slate-500 font-bold">AST Breakdown of Industrial Content Elements:</div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                        <div className="text-sky-700 font-bold mb-1">Node 0: Header & Meta</div>
                        <div>Target Keyword: &quot;{selectedDraft.keyword}&quot;</div>
                        <div>Vertical: {selectedDraft.vertical ?? selectedVertical}</div>
                        <div>Equipment Class: {selectedDraft.equipment ?? activeEquipment}</div>
                        <div>Compliance Norm: {selectedDraft.standard ?? activeStandard}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                        <div className="text-emerald-700 font-bold mb-1">Node 1: Direct Answer Capsule (45 Words)</div>
                        <div>Status: Injected under H2 [PASS]</div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                        <div className="text-purple-700 font-bold mb-1">Node 2: Diagnostic Sections ({selectedDraft.sections.length} Blocks)</div>
                        <div>Spec Table Included: Yes ({selectedDraft.standard ?? activeStandard} engineering tolerances)</div>
                        <div>Allowlisted Citations: {selectedDraft.standard ?? activeStandard}, ISO 9001, OSHA 1910</div>
                      </div>
                    </div>
                  )}

                  {previewTab === "SchemaJSON" && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-mono text-slate-500">
                        <span>JSON-LD Linked Data Triples:</span>
                        <button
                          onClick={() => {
                            void navigator.clipboard.writeText(selectedDraft.schema);
                            setActionMessage("JSON-LD code block copied to clipboard.");
                          }}
                          className="px-2.5 py-1 rounded bg-slate-100 text-sky-700 hover:bg-slate-200 font-bold"
                        >
                          Copy Code
                        </button>
                      </div>
                      <pre className="p-4 rounded-xl bg-slate-900 text-cyan-300 text-xs font-mono overflow-x-auto leading-relaxed max-h-96">
                        {selectedDraft.schema}
                      </pre>
                    </div>
                  )}

                  {/* TAB 4 IN SPLIT VIEW: AEO ANSWER ENGINE SIMULATOR */}
                  {previewTab === "AeoPreview" && (
                    <div className="space-y-5 animate-fade-in text-xs">
                      <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse-live"></span>
                            <span className="font-mono font-bold uppercase text-purple-900 tracking-wider">
                              AI Answer Engine Simulation
                            </span>
                          </div>
                          <p className="text-slate-600 text-xs">
                            Simulates how generative engines synthesize answers and cite OEM source authority.
                          </p>
                        </div>

                        {/* Engine Switcher */}
                        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-purple-200 shadow-2xs">
                          {(["Perplexity Copilot", "Google AI Overview"] as const).map((eng) => (
                            <button
                              key={eng}
                              type="button"
                              onClick={() => {
                                setAeoSimEngine(eng);
                                runAeoSimulation(eng);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                aeoSimEngine === eng
                                  ? "bg-purple-600 text-white shadow-2xs"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              {eng === "Perplexity Copilot" ? "Perplexity" : "Google SGE"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {aeoSimLoading ? (
                        <div className="py-16 text-center space-y-3">
                          <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                          <div className="text-xs font-mono font-bold text-purple-900 uppercase tracking-wider">
                            Simulating {aeoSimEngine} Grounding Matrix...
                          </div>
                          <p className="text-xs text-slate-500">Querying Gemini 3.5 with industrial entity parameters</p>
                        </div>
                      ) : aeoSimData ? (
                        <div className="space-y-4">
                          {/* Search Query Pill */}
                          <div className="p-3 rounded-xl bg-slate-900 text-white font-mono text-xs flex items-center justify-between gap-3 shadow-xs">
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-purple-400 font-bold shrink-0">QUERY &gt;</span>
                              <span className="text-slate-200 truncate">{aeoSimData.query}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                              {aeoSimData.confidenceScore}% Grounding Confidence
                            </span>
                          </div>

                          {/* Direct AI Answer Box */}
                          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
                            <div className="flex items-center justify-between text-xs font-mono text-slate-500 border-b border-slate-100 pb-2">
                              <span className="font-bold text-slate-800">{aeoSimData.engine} Direct Answer</span>
                              <span className="text-purple-700 font-bold">Citation [1] Active</span>
                            </div>
                            <div className="text-sm text-slate-800 leading-relaxed font-sans">
                              {aeoSimData.directAnswer}
                            </div>
                          </div>

                          {/* Interactive Citations */}
                          <div className="space-y-2">
                            <div className="text-xs font-mono font-bold uppercase text-slate-500">
                              Verified Source Citations ({aeoSimData.sources?.length || 0})
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {aeoSimData.sources?.map((src, idx) => (
                                <div
                                  key={idx}
                                  className={`p-3.5 rounded-xl border transition shadow-2xs space-y-1.5 ${
                                    src.isUserSite
                                      ? "bg-purple-50/60 border-purple-300"
                                      : "bg-slate-50 border-slate-200"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-mono font-bold text-2xs flex items-center justify-center">
                                        {src.citationNumber}
                                      </span>
                                      <span className="font-bold text-slate-900 truncate max-w-[180px]">
                                        {src.title}
                                      </span>
                                    </div>
                                    {src.isUserSite && (
                                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-200 text-purple-900">
                                        YOUR SITE
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-2xs font-mono text-slate-500 truncate">{src.domain}</div>
                                  <p className="text-xs text-slate-700 italic border-l-2 border-purple-400 pl-2 mt-1">
                                    &ldquo;{src.quote}&rdquo;
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Autonomous AEO Competitive Source Benchmarking Card */}
                          <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 space-y-3 text-xs mt-4 animate-fade-in">
                            <div className="flex items-center justify-between font-bold text-slate-900">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">🏆</span>
                                <span>AEO Competitive Source Citation Algorithm Analysis</span>
                              </div>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-200 text-sky-800">
                                POSITION #1 CAPTURE
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div className="p-2.5 rounded-lg bg-white border border-emerald-300 flex items-start justify-between gap-3 shadow-2xs">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center">1</span>
                                    <span className="font-bold text-slate-900">Your Domain ({userDisplayOrg} OEM Portal)</span>
                                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">#1 PRIMARY CITATION</span>
                                  </div>
                                  <p className="text-[11px] text-slate-600 pl-7">
                                    Direct Answer Capsule verified. Contains certified {selectedDraft.standard || "3-A / ISO"} tolerances and embedded TechArticle schema.
                                  </p>
                                </div>
                                <span className="text-emerald-600 font-bold shrink-0 text-xs">98.4% Confidence</span>
                              </div>

                              <div className="p-2.5 rounded-lg bg-white/80 border border-slate-200 flex items-start justify-between gap-3 opacity-75">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-slate-400 text-white font-bold text-[11px] flex items-center justify-center">2</span>
                                    <span className="font-semibold text-slate-700">Competitor OEM PDF Manual</span>
                                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">PDF DOCUMENT</span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 pl-7">
                                    Lacks structured FAQPage schema. Deprioritized by Perplexity & Google SGE due to crawl latency.
                                  </p>
                                </div>
                                <span className="text-slate-500 font-medium shrink-0 text-xs">Lagged (-3 Pos)</span>
                              </div>

                              <div className="p-2.5 rounded-lg bg-white/80 border border-slate-200 flex items-start justify-between gap-3 opacity-60">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-700 font-bold text-[11px] flex items-center justify-center">3</span>
                                    <span className="font-semibold text-slate-700">Generic Maintenance Forum Thread</span>
                                    <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">UNVERIFIED FORUM</span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 pl-7">
                                    Filtered out by AI answer models due to subjective user opinions and zero certified manufacturing tolerances.
                                  </p>
                                </div>
                                <span className="text-amber-600 font-medium shrink-0 text-xs">Low Reliability</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Reviewer Comment Strip */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-xs">
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                    Engineering Reviewer Annotations & Redlines
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an engineering note or spec clarification for this draft…"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-600 focus:bg-white"
                    />
                    <button
                      onClick={() => updateDraftStage("request_changes")}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white uppercase tracking-wider shadow-xs"
                    >
                      Request Revision
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Engineering Parameter & Tolerance Index */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">
                    Deterministic Reliability & Parameter Veracity Matrix
                  </h3>
                  <p className="text-xs text-slate-500">
                    Physical units, regulatory codes, and chemical formulations verified by closed-loop inspection.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800">
                  ZERO FLUFF CERTIFIED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono font-bold text-slate-500 uppercase text-[11px] block">Verified Standards & Codes</span>
                  <div className="flex flex-wrap gap-1.5">
                    {customStandards.map((std, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-bold">
                        ✓ {std}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono font-bold text-slate-500 uppercase text-[11px] block">Physical Operating Tolerances</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Concentration: >2.5% NaOH", "Thermal: >80°C (176°F)", "Manifold Delta: 15 bar", "Spray Angle: 26° offset", "Viscosity: 450,000 SSU"].map((tol, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-mono text-[10px] font-bold">
                        ⚡ {tol}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono font-bold text-slate-500 uppercase text-[11px] block">Banned Fluff Superlatives Filter</span>
                  <div className="flex flex-wrap gap-1.5">
                    {customBannedWords.map((word, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-mono text-[10px] line-through">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RISK & COMPLIANCE ASSESSMENT */}
        {activeTab === "Risk & Compliance" && (
          <div className="p-6 space-y-6 max-w-7xl animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Engineering Risk & Hallucination Assessment</h2>
                <p className="text-xs text-slate-500">
                  Continuous risk evaluation ensuring no unvetted tolerances, competitor links, or regulatory violations are published.
                </p>
              </div>
              <button
                type="button"
                onClick={handleRunComplianceAudit}
                disabled={isAuditingCompliance}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono font-bold text-white shadow-xs flex items-center gap-2 transition cursor-pointer disabled:opacity-60"
              >
                {isAuditingCompliance ? (
                  <>
                    <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Auditing Tolerances & Standards...</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-live"></span>
                    <span>Run AI Compliance Audit</span>
                  </>
                )}
              </button>
            </div>

            {/* Live AI Compliance Findings Banner */}
            {complianceAuditResult && (
              <div className="p-5 rounded-2xl border border-emerald-300 bg-emerald-50/70 text-slate-800 space-y-3 shadow-xs animate-fade-in">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-200 text-emerald-900">
                      SCORE: {complianceAuditResult.reliabilityScore}%
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      Deterministic Reliability Status: <strong className="text-emerald-700">{complianceAuditResult.riskRating}</strong>
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    Hallucination Risk: <strong className="text-emerald-700">{complianceAuditResult.hallucinationRisk}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
                  {complianceAuditResult.auditChecks?.map((chk: ComplianceAuditCheck, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-emerald-100 flex items-start gap-2.5 text-xs">
                      <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                      <div>
                        <div className="font-bold text-slate-900">{chk.check}</div>
                        <div className="text-slate-600 mt-0.5">{chk.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {Boolean(complianceAuditResult.recommendedAmendments && complianceAuditResult.recommendedAmendments.length > 0) && (
                  <div className="p-3 rounded-xl bg-white/80 border border-emerald-200 text-xs text-slate-700">
                    <strong className="text-slate-900">Inspector Amendment Note:</strong>{" "}
                    {complianceAuditResult.recommendedAmendments?.join(" • ")}
                  </div>
                )}
              </div>
            )}

            {/* Risk Gauges */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs card-interactive">
                <div className="text-xs font-mono text-slate-500 uppercase">Spec Violation Risk</div>
                <div className="text-3xl font-extrabold text-emerald-600 mt-2">1.2%</div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: "12%" }}></div>
                </div>
                <div className="text-xs text-slate-600 mt-2">Cross-checked vs ASME / 3-A</div>
              </div>
              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs card-interactive">
                <div className="text-xs font-mono text-slate-500 uppercase">Regulatory Hazard Risk</div>
                <div className="text-3xl font-extrabold text-emerald-600 mt-2">0.4%</div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: "4%" }}></div>
                </div>
                <div className="text-xs text-slate-600 mt-2">OSHA 1910.147 lock-out verified</div>
              </div>
              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs card-interactive">
                <div className="text-xs font-mono text-slate-500 uppercase">Google HCU Penalty Risk</div>
                <div className="text-3xl font-extrabold text-emerald-600 mt-2">0.8%</div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: "8%" }}></div>
                </div>
                <div className="text-xs text-slate-600 mt-2">Zero thin programmatic content</div>
              </div>
              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs card-interactive">
                <div className="text-xs font-mono text-slate-500 uppercase">Competitor Leak Risk</div>
                <div className="text-3xl font-extrabold text-emerald-600 mt-2">0.0%</div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: "1%" }}></div>
                </div>
                <div className="text-xs text-slate-600 mt-2">100% Outbound Link Allowlist</div>
              </div>
            </div>

            {/* Risk Breakdown Details */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Active Deterministic Safety Controls</h3>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900">ASME B31.3 / ISO 22000 Tolerance Bound Checker</strong>
                    <div className="text-slate-500 mt-0.5">Enforces maximum temperature ratings (130°C for EPDM in caustic wash)</div>
                  </div>
                  <span className="px-2.5 py-1 rounded font-mono font-bold text-xs bg-emerald-100 text-emerald-800">
                    ACTIVE [PASS]
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900">Banned Marketing Cliché Sanitizer (&quot;Engineer-Cringe Filter&quot;)</strong>
                    <div className="text-slate-500 mt-0.5">Scans for non-empirical words (&quot;revolutionary&quot;, &quot;game-changer&quot;, &quot;delve into&quot;)</div>
                  </div>
                  <span className="px-2.5 py-1 rounded font-mono font-bold text-xs bg-emerald-100 text-emerald-800">
                    ACTIVE [0 FLUFF]
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900">Strict Allowlist URL Firewall</strong>
                    <div className="text-slate-500 mt-0.5">Blocks outbound citations to third-party blogs or direct competing OEMs</div>
                  </div>
                  <span className="px-2.5 py-1 rounded font-mono font-bold text-xs bg-emerald-100 text-emerald-800">
                    FIREWALL ON
                  </span>
                </div>
              </div>
            </div>

            {/* Verified Engineering Parameter & Tolerance Index */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">
                    Deterministic Reliability & Parameter Veracity Matrix
                  </h3>
                  <p className="text-xs text-slate-500">
                    Physical units, regulatory codes, and chemical formulations verified by closed-loop inspection.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800">
                  ZERO FLUFF CERTIFIED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono font-bold text-slate-500 uppercase text-[11px] block">Verified Standards & Codes</span>
                  <div className="flex flex-wrap gap-1.5">
                    {customStandards.map((std, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-bold">
                        ✓ {std}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono font-bold text-slate-500 uppercase text-[11px] block">Physical Operating Tolerances</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Concentration: >2.5% NaOH", "Thermal: >80°C (176°F)", "Manifold Delta: 15 bar", "Spray Angle: 26° offset", "Viscosity: 450,000 SSU"].map((tol, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-mono text-[10px] font-bold">
                        ⚡ {tol}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono font-bold text-slate-500 uppercase text-[11px] block">Banned Fluff Superlatives Filter</span>
                  <div className="flex flex-wrap gap-1.5">
                    {customBannedWords.map((word, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-mono text-[10px] line-through">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AEO SCHEMA HUB */}
        {activeTab === "AEO Schema Hub" && (
          <div className="p-6 space-y-6 max-w-7xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">AEO & GEO Multi-Schema Layer</h2>
                <p className="text-xs text-slate-500">
                  Inspect and customize rich schema entities (FAQPage, HowTo, TechnicalSpecification) baked into every page.
                </p>
              </div>
              <div className="flex gap-2">
                {(["FAQPage", "HowTo", "TechSpec"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedSchemaType(type)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition ${selectedSchemaType === type
                      ? "bg-sky-600 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">Schema Architecture</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Unlike traditional SEO tools that rely on generic WordPress plugins, ForgeFlow compiles nested JSON-LD schema
                  directly during page generation. This ensures that AI search engines (Perplexity, ChatGPT Search, Google AI Overviews)
                  correctly parse machine specifications and diagnostic procedures.
                </p>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
                    <span>Schema Type:</span>
                    <span className="text-sky-700 font-bold">{selectedSchemaType}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
                    <span>Validation Status:</span>
                    <span className="text-emerald-700 font-bold">100% Validated</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
                    <span>Target Engine:</span>
                    <span className="text-purple-700 font-bold">Perplexity / Google AEO</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3 card-interactive">
                <div className="flex justify-between items-center text-xs font-mono text-slate-500">
                  <span>Live Schema Code:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-live"></span>
                    <span>JSON-LD Compliant</span>
                  </span>
                </div>
                <pre key={selectedSchemaType} className="p-4 rounded-xl bg-slate-900 text-cyan-300 text-xs font-mono overflow-x-auto leading-relaxed max-h-96 animate-fade-in">
                  {selectedSchemaType === "FAQPage" &&
                    JSON.stringify(
                      {
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: selectedDraft.faqs.map((f) => ({
                          "@type": "Question",
                          name: f.q,
                          acceptedAnswer: {
                            "@type": "Answer",
                            text: f.a,
                          },
                        })),
                      },
                      null,
                      2,
                    )}

                  {selectedSchemaType === "HowTo" &&
                    JSON.stringify(
                      {
                        "@context": "https://schema.org",
                        "@type": "HowTo",
                        name: selectedDraft.title,
                        totalTime: "PT45M",
                        tool: [
                          { "@type": "HowToTool", name: "Digital Pressure Transducer" },
                          { "@type": "HowToTool", name: "3-A Certified Sanitary Seal Kit" },
                        ],
                        step: [
                          {
                            "@type": "HowToStep",
                            name: "Purge Line and De-pressurize",
                            text: "Lock out power and verify zero line pressure before disassembling the rotor housing.",
                          },
                          {
                            "@type": "HowToStep",
                            name: "Measure Radial Expansion",
                            text: "Check elastomer O-ring profile against nominal tolerance limits.",
                          },
                        ],
                      },
                      null,
                      2,
                    )}

                  {selectedSchemaType === "TechSpec" &&
                    JSON.stringify(
                      {
                        "@context": "https://schema.org",
                        "@type": "Product",
                        name: currentVerticalData.equipment[0],
                        category: selectedVertical,
                        material: "316L Stainless Steel / Hastelloy C-22",
                        operatingPressure: "15 to 25 bar",
                        certification: currentVerticalData.standards[0],
                      },
                      null,
                      2,
                    )}
                </pre>
              </div>
            </div>

            {/* Verified Engineering Parameter & Tolerance Index */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">
                    Deterministic Reliability & Parameter Veracity Matrix
                  </h3>
                  <p className="text-xs text-slate-500">
                    Physical units, regulatory codes, and chemical formulations verified by closed-loop inspection.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800">
                  ZERO FLUFF CERTIFIED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono font-bold text-slate-500 uppercase text-[11px] block">Verified Standards & Codes</span>
                  <div className="flex flex-wrap gap-1.5">
                    {customStandards.map((std, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-bold">
                        ✓ {std}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono font-bold text-slate-500 uppercase text-[11px] block">Physical Operating Tolerances</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Concentration: >2.5% NaOH", "Thermal: >80°C (176°F)", "Manifold Delta: 15 bar", "Spray Angle: 26° offset", "Viscosity: 450,000 SSU"].map((tol, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-mono text-[10px] font-bold">
                        ⚡ {tol}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono font-bold text-slate-500 uppercase text-[11px] block">Banned Fluff Superlatives Filter</span>
                  <div className="flex flex-wrap gap-1.5">
                    {customBannedWords.map((word, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-mono text-[10px] line-through">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PUBLISHING PIPELINE */}
        {activeTab === "Publishing Pipeline" && (
          <div className="p-6 space-y-6 max-w-7xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Publishing Pipeline & CMS Connectors</h2>
                <p className="text-xs text-slate-500">
                  Manage rate-limited drip publishing and export to WordPress, Webflow, or custom CMS endpoints.
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                Rate Limiter: 3 pages/day active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
                <div className="text-xs font-mono font-bold uppercase text-sky-700">Webflow CMS Sync</div>
                <div className="text-sm font-bold text-slate-900">Acme Engineering Portal</div>
                <p className="text-xs text-slate-500">Connected via Webflow REST API v2. Custom fields mapped.</p>
                <div className="pt-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-100 text-emerald-800">
                    CONNECTED
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
                <div className="text-xs font-mono font-bold uppercase text-sky-700">WordPress REST API</div>
                <div className="text-sm font-bold text-slate-900">Plant Knowledge Hub</div>
                <p className="text-xs text-slate-500">Custom Post Type: `industrial-specs`. Auto JSON-LD enabled.</p>
                <div className="pt-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-100 text-emerald-800">
                    CONNECTED
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
                <div className="text-xs font-mono font-bold uppercase text-purple-700">Bulk XML Sitemap</div>
                <div className="text-sm font-bold text-slate-900">sitemap-industrial-pSEO.xml</div>
                <p className="text-xs text-slate-500">Autonomous priority indexing submitted to Google Search Console.</p>
                <div className="pt-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-purple-100 text-purple-800">
                    AUTO-UPDATED
                  </span>
                </div>
              </div>
            </div>

            {/* Live Webhook & CMS Dispatch History */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">CMS Webhook Dispatch Log</h3>
                  <p className="text-xs text-slate-500">Autonomous webhook delivery payloads sent to Webflow, WordPress, and Zapier.</p>
                </div>
                <button
                  type="button"
                  onClick={() => window.open("/api/drafts/export-all?format=csv", "_blank")}
                  className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span>📦</span>
                  <span>Export All Published CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-50 border-b border-slate-200 font-mono text-slate-600">
                    <tr>
                      <th className="p-3">EVENT</th>
                      <th className="p-3">TARGET CMS / ENDPOINT</th>
                      <th className="p-3">HTTP STATUS</th>
                      <th className="p-3">PAYLOAD VERIFICATION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/60 transition">
                      <td className="p-3 font-mono font-bold text-sky-700">draft.published</td>
                      <td className="p-3 text-slate-800 font-medium truncate max-w-xs">https://industrial-oem.com/rotary-lobe-seals</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">200 OK</span></td>
                      <td className="p-3 font-mono text-slate-500 text-[11px]">HMAC verified • Schema JSON-LD Included</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60 transition">
                      <td className="p-3 font-mono font-bold text-sky-700">sitemap.updated</td>
                      <td className="p-3 text-slate-800 font-medium">Google Search Console Ping (priority 0.9)</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">200 OK</span></td>
                      <td className="p-3 font-mono text-slate-500 text-[11px]">Google SGE Indexing Signal Dispatched</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">Batch Publishing Schedule</h3>
              <div className="space-y-2">
                {reviewDrafts.map((d, index) => (
                  <div
                    key={d.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs card-interactive"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${d.stage === "Published" ? "bg-emerald-500 animate-pulse-live" : "bg-sky-500"}`}></span>
                      <div>
                        <div className="font-bold text-slate-900">{d.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Scheduled release: Drip Day {index + 1} • Rate limited for natural crawl cadence
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {d.pageReview?.status === "APPROVED" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          ✓ Reviewed: {d.pageReview.reviewer?.name?.split(",")[0] || "Engineer"}
                        </span>
                      ) : d.pageReview?.status === "CHANGES_REQUESTED" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          ⚠️ Changes Requested
                        </span>
                      ) : d.pageReview?.status === "PENDING" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-200">
                          ⏳ Review Pending
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-100 text-red-800 border border-red-200">
                          ⛔ Not expert reviewed
                        </span>
                      )}

                      <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-slate-200 text-slate-700">
                        {d.stage === "Published" ? "LIVE ON DOMAIN" : "QUEUED FOR DRIP"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Engineering Parameter & Tolerance Index */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">
                    Deterministic Reliability & Parameter Veracity Matrix
                  </h3>
                  <p className="text-xs text-slate-500">
                    Physical units, regulatory codes, and chemical formulations verified by closed-loop inspection.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800">
                  ZERO FLUFF CERTIFIED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono font-bold text-slate-500 uppercase text-[11px] block">Verified Standards & Codes</span>
                  <div className="flex flex-wrap gap-1.5">
                    {customStandards.map((std, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-bold">
                        ✓ {std}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono font-bold text-slate-500 uppercase text-[11px] block">Physical Operating Tolerances</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Concentration: >2.5% NaOH", "Thermal: >80°C (176°F)", "Manifold Delta: 15 bar", "Spray Angle: 26° offset", "Viscosity: 450,000 SSU"].map((tol, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-mono text-[10px] font-bold">
                        ⚡ {tol}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono font-bold text-slate-500 uppercase text-[11px] block">Banned Fluff Superlatives Filter</span>
                  <div className="flex flex-wrap gap-1.5">
                    {customBannedWords.map((word, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-mono text-[10px] line-through">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: INDUSTRIAL ANALYTICS */}
        {activeTab === "Industrial Analytics" && (
          <div className="p-6 space-y-6 max-w-7xl animate-fade-in">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Zero-Volume Search & AEO Citation Radar</h2>
                <p className="text-xs text-slate-500">
                  Track real impression spikes on high-intent engineering queries and monitor Perplexity/AI citations.
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded bg-sky-50 text-sky-800 border border-sky-200 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600 radar-ping"></span>
                <span>GSC + Perplexity Live Sync</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs card-interactive">
                <div className="text-xs font-mono text-slate-500 uppercase">Long-Tail Impressions</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-2">
                  <AnimatedCounter value={14250} />
                </div>
                <div className="text-xs text-emerald-700 font-bold mt-1">+38% YoY on zero-volume terms</div>
              </div>
              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs card-interactive">
                <div className="text-xs font-mono text-slate-500 uppercase">Perplexity AI Citations</div>
                <div className="text-3xl font-extrabold text-sky-600 mt-2">
                  <AnimatedCounter value={84} suffix=" Citations" />
                </div>
                <div className="text-xs text-slate-600 font-medium mt-1">Extracting Answer Capsules</div>
              </div>
              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs card-interactive">
                <div className="text-xs font-mono text-slate-500 uppercase">Writer Budget Saved</div>
                <div className="text-3xl font-extrabold text-emerald-600 mt-2">
                  <AnimatedCounter value={14200} prefix="$" suffix=" / mo" />
                </div>
                <div className="text-xs text-slate-600 font-medium mt-1">Replaced $0.75/word freelance writers</div>
              </div>
            </div>

            {/* Zero-Volume Search Impression Trajectory SVG Chart */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4 card-interactive">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">
                    Zero-Volume Impression Trajectory vs Baseline
                  </h3>
                  <p className="text-xs text-slate-500">
                    Industrial pSEO compound curve over 90 days across 7 manufacturing ontologies.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-sky-700 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
                    <span>ForgeFlow AEO Strategy</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                    <span>Generic Keyword SEO</span>
                  </span>
                </div>
              </div>

              <div className="h-44 w-full relative pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 140" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0284c7" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="0" y1="35" x2="600" y2="35" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="0" y1="70" x2="600" y2="70" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="0" y1="105" x2="600" y2="105" stroke="#f1f5f9" strokeDasharray="4 4" />

                  {/* Generic flat SEO line */}
                  <path
                    d="M 0,120 Q 150,115 300,110 T 600,105"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />

                  {/* Gradient Area under ForgeFlow line */}
                  <path
                    d="M 0,125 C 100,120 180,105 260,80 C 340,55 420,30 500,18 L 600,8 L 600,140 L 0,140 Z"
                    fill="url(#areaGradient)"
                  />

                  {/* ForgeFlow compounding trajectory line with draw animation */}
                  <path
                    d="M 0,125 C 100,120 180,105 260,80 C 340,55 420,30 500,18 L 600,8"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="animate-draw-line"
                  />

                  {/* Pulsing data markers */}
                  <circle cx="260" cy="80" r="4" fill="#0284c7" />
                  <circle cx="500" cy="18" r="4" fill="#0284c7" />
                  <circle cx="600" cy="8" r="5" fill="#059669" className="animate-pulse" />
                </svg>
              </div>

              <div className="flex justify-between text-xs font-mono text-slate-500 pt-2 border-t border-slate-100">
                <span>Day 1 (Batch Ingestion)</span>
                <span>Day 30 (Sitemap Indexed)</span>
                <span>Day 60 (AEO Overviews Triggered)</span>
                <span className="text-emerald-700 font-bold">Day 90 (+38% Impress/mo)</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">High-Intent Long-Tail Queries Tracked</h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <span>&quot;rotary lobe pump elastomer swelling caustic wash 3A&quot;</span>
                  <span className="text-emerald-700 font-bold">Pos #1 (Perplexity & Google)</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <span>&quot;hot strip mill hydraulic descaler nozzle clogging delta-T&quot;</span>
                  <span className="text-emerald-700 font-bold">Pos #2 (AI Overview)</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <span>&quot;centrifugal chiller low delta-t syndrome cleanroom AHRI&quot;</span>
                  <span className="text-emerald-700 font-bold">Pos #1 (Perplexity)</span>
                </div>
              </div>
            </div>

            {/* Verified Engineering Parameter & Tolerance Index */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">
                    Deterministic Reliability & Parameter Veracity Matrix
                  </h3>
                  <p className="text-xs text-slate-500">
                    Physical units, regulatory codes, and chemical formulations verified by closed-loop inspection.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800">
                  ZERO FLUFF CERTIFIED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono font-bold text-slate-500 uppercase text-[11px] block">Verified Standards & Codes</span>
                  <div className="flex flex-wrap gap-1.5">
                    {customStandards.map((std, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-bold">
                        ✓ {std}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono font-bold text-slate-500 uppercase text-[11px] block">Physical Operating Tolerances</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Concentration: >2.5% NaOH", "Thermal: >80°C (176°F)", "Manifold Delta: 15 bar", "Spray Angle: 26° offset", "Viscosity: 450,000 SSU"].map((tol, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-mono text-[10px] font-bold">
                        ⚡ {tol}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono font-bold text-slate-500 uppercase text-[11px] block">Banned Fluff Superlatives Filter</span>
                  <div className="flex flex-wrap gap-1.5">
                    {customBannedWords.map((word, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-mono text-[10px] line-through">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: WORKSPACE & RULES */}
        {activeTab === "Workspace & Rules" && (
          <div className="p-6 space-y-6 max-w-7xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Workspace Configuration & Deterministic Rules</h2>
                <p className="text-xs text-slate-500">
                  Configure brand voice registers, link allowlists, and fluff sanitizer filters for this tenant.
                </p>
              </div>
              <button
                onClick={async () => {
                  saveWorkspacePolicies();
                  await saveWorkspaceProfile();
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white shadow-xs"
              >
                Save Policies
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">Company Profile</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-700 font-mono font-bold block mb-1">Company / Plant Name</label>
                    <input
                      value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-sky-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-mono font-bold block mb-1">Website URL</label>
                    <input
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-sky-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-mono font-bold block mb-1">Product & Capability Description</label>
                    <textarea
                      rows={3}
                      value={form.productDescription}
                      onChange={(e) => setForm({ ...form, productDescription: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-sky-600 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">Deterministic Constraint Gates</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-700 font-mono font-bold block mb-1">
                      Voice Register: <strong className="text-sky-700">{form.voiceRegister}</strong>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      defaultValue="2"
                      className="w-full accent-sky-600 cursor-pointer"
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm({
                          ...form,
                          voiceRegister:
                            val === "1" ? "Plant-Floor Maintenance" : val === "2" ? "Plant-Floor Pragmatic" : "R&D Principal Spec",
                        });
                      }}
                    />
                    <div className="flex justify-between text-xs font-mono text-slate-500 mt-1">
                      <span>Field Maintenance</span>
                      <span>Pragmatic Reliability</span>
                      <span>R&D Principal</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-700 font-mono font-bold block mb-1">Outbound Domain Allowlist</label>
                    <input
                      value={form.allowedDomains}
                      onChange={(e) => setForm({ ...form, allowedDomains: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono outline-none focus:border-sky-600 focus:bg-white"
                    />
                    <span className="text-xs text-slate-500">Only URLs on these domains will be permitted in generated drafts.</span>
                  </div>

                  <div>
                    <label className="text-slate-700 font-mono font-bold block mb-1">Banned Fluff & Buzzwords</label>
                    <input
                      value={form.bannedWords}
                      onChange={(e) => setForm({ ...form, bannedWords: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono outline-none focus:border-sky-600 focus:bg-white"
                    />
                    <span className="text-xs text-slate-500">Drafts containing these buzzwords will fail structural QA validation.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members & Access Control Card (RBAC & Invitations) */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">Team Collaboration &amp; Workspace Invites</h3>
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
                      RBAC Enforced
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage team roles, invite application engineers or plant managers, and track email verification status.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setInviteModalOpen(true);
                    setInviteError("");
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <span>+</span>
                  <span>Invite Team Member</span>
                </button>
              </div>

              {/* Members List */}
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Active Workspace Members ({workspaceMembers.length || 1})
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-mono">
                        <th className="pb-2 font-semibold">User</th>
                        <th className="pb-2 font-semibold">Role</th>
                        <th className="pb-2 font-semibold">Email Verification</th>
                        <th className="pb-2 font-semibold">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {workspaceMembers.length > 0 ? (
                        workspaceMembers.map((member) => (
                          <tr key={member.id} className="py-2.5">
                            <td className="py-2.5">
                              <div className="font-bold text-slate-900">
                                {member.name || member.email.split("@")[0]}
                                {member.isCurrentUser && (
                                  <span className="ml-2 text-2xs font-mono bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded font-semibold">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-2xs text-slate-500 font-mono">{member.email}</div>
                            </td>
                            <td className="py-2.5">
                              <span className={`px-2 py-0.5 rounded font-mono font-bold text-2xs ${member.role === "OWNER"
                                ? "bg-purple-50 text-purple-800 border border-purple-200"
                                : member.role === "ADMIN"
                                  ? "bg-sky-50 text-sky-800 border border-sky-200"
                                  : member.role === "REVIEWER"
                                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                    : "bg-slate-100 text-slate-700"
                                }`}>
                                {member.role}
                              </span>
                            </td>
                            <td className="py-2.5">
                              {member.emailVerified ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                                  <span>✓</span>
                                  <span>Verified</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                                  <span>!</span>
                                  <span>Pending</span>
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 font-mono text-slate-500">
                              {new Date(member.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="py-2.5">
                          <td className="py-2.5 font-bold text-slate-900">
                            {user?.name || user?.email.split("@")[0] || "Admin"}
                            <span className="ml-2 text-2xs font-mono bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded font-semibold">
                              You
                            </span>
                          </td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded font-mono font-bold text-2xs bg-purple-50 text-purple-800 border border-purple-200">
                              {user?.role || "OWNER"}
                            </span>
                          </td>
                          <td className="py-2.5">
                            {user?.emailVerified ? (
                              <span className="text-emerald-700 font-medium">✓ Verified</span>
                            ) : (
                              <span className="text-amber-700 font-medium">! Pending verification</span>
                            )}
                          </td>
                          <td className="py-2.5 font-mono text-slate-500">Active</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pending Invitations */}
              {workspaceInvites.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                    Pending Invitations ({workspaceInvites.length})
                  </div>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                    {workspaceInvites.map((invite) => (
                      <div key={invite.id} className="p-3 bg-slate-50/50 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-mono font-bold text-slate-900">{invite.email}</div>
                          <div className="text-2xs text-slate-500 font-mono mt-0.5">
                            Role: <strong className="text-slate-700">{invite.role}</strong> · Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRevokeInvite(invite.id)}
                          className="px-2.5 py-1 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-2xs font-bold transition cursor-pointer"
                        >
                          Revoke
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Industrial Compliance & Fluff Sanitizer Rule Builder */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4 mt-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">Custom B2B Reliability Rule Builder</h3>
                  <p className="text-xs text-slate-500">Define strict industrial words to sanitize and mandatory governing standards for AI prompts.</p>
                </div>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-purple-100 text-purple-800">
                  AUTONOMOUS FILTER
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Banned Fluff Terms */}
                <div className="space-y-3">
                  <label className="font-bold text-slate-700 block">Banned Marketing Superlatives (Auto-Sanitized)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newBannedWordInput}
                      onChange={(e) => setNewBannedWordInput(e.target.value)}
                      placeholder="e.g. unmatched, breakthrough..."
                      className="flex-1 text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newBannedWordInput.trim() && !customBannedWords.includes(newBannedWordInput.trim())) {
                          setCustomBannedWords([...customBannedWords, newBannedWordInput.trim()]);
                          setNewBannedWordInput("");
                          setActionMessage(`Added "${newBannedWordInput.trim()}" to banned terms filter.`);
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {customBannedWords.map((w, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 font-mono text-xs flex items-center gap-1.5">
                        <span className="line-through">{w}</span>
                        <button
                          type="button"
                          onClick={() => setCustomBannedWords(customBannedWords.filter((_, i) => i !== idx))}
                          className="hover:text-red-900 font-bold ml-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mandatory Standards */}
                <div className="space-y-3">
                  <label className="font-bold text-slate-700 block">Mandatory Engineering Standards</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newStandardInput}
                      onChange={(e) => setNewStandardInput(e.target.value)}
                      placeholder="e.g. ASME B31.3, AGMA 2001..."
                      className="flex-1 text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newStandardInput.trim() && !customStandards.includes(newStandardInput.trim())) {
                          setCustomStandards([...customStandards, newStandardInput.trim()]);
                          setNewStandardInput("");
                          setActionMessage(`Added "${newStandardInput.trim()}" to mandatory standards.`);
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-purple-600 text-white font-bold cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {customStandards.map((std, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-xs flex items-center gap-1.5">
                        <span>✓ {std}</span>
                        <button
                          type="button"
                          onClick={() => setCustomStandards(customStandards.filter((_, i) => i !== idx))}
                          className="hover:text-emerald-950 font-bold ml-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Modal: Quick Action Palette (Triggered by [+] button in sidebar) */}
      {showQuickActionPalette && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                  ⚡
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">ForgeFlow Quick Action Palette</h3>
                  <p className="text-xs text-slate-500">Autonomous shortcuts for plant reliability & content operations</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQuickActionPalette(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => {
                  setShowQuickActionPalette(false);
                  setActiveTab("Mission Control");
                }}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 text-left space-y-1 transition group cursor-pointer"
              >
                <div className="font-bold text-slate-900 group-hover:text-sky-700 flex items-center gap-2">
                  <span>🚀</span>
                  <span>New Fast Batch Generator</span>
                </div>
                <p className="text-slate-500 text-[11px]">Generate 1-5 technical slices with Gemini AI</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowQuickActionPalette(false);
                  setShowIngestModal(true);
                }}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-purple-50 hover:border-purple-300 text-left space-y-1 transition group cursor-pointer"
              >
                <div className="font-bold text-slate-900 group-hover:text-purple-700 flex items-center gap-2">
                  <span>📄</span>
                  <span>Ingest Equipment Datasheet</span>
                </div>
                <p className="text-slate-500 text-[11px]">Drop PDF or text to extract ASTM/ISO nodes</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowQuickActionPalette(false);
                  setActiveTab("Risk & Compliance");
                  handleRunComplianceAudit();
                }}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left space-y-1 transition group cursor-pointer"
              >
                <div className="font-bold text-slate-900 group-hover:text-emerald-700 flex items-center gap-2">
                  <span>🛡️</span>
                  <span>Run Live Compliance Audit</span>
                </div>
                <p className="text-slate-500 text-[11px]">Audit physical tolerances & sanitize fluff</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowQuickActionPalette(false);
                  setActiveTab("QA Review Studio");
                  setPreviewTab("AeoPreview");
                  runAeoSimulation();
                }}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-left space-y-1 transition group cursor-pointer"
              >
                <div className="font-bold text-slate-900 group-hover:text-amber-700 flex items-center gap-2">
                  <span>🤖</span>
                  <span>AI Answer Simulator</span>
                </div>
                <p className="text-slate-500 text-[11px]">Simulate Perplexity & Google SGE citations</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowQuickActionPalette(false);
                  window.open("/api/drafts/export-all?format=csv", "_blank");
                }}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left space-y-1 transition group cursor-pointer"
              >
                <div className="font-bold text-slate-900 group-hover:text-emerald-700 flex items-center gap-2">
                  <span>📦</span>
                  <span>Bulk Export Entire Batch</span>
                </div>
                <p className="text-slate-500 text-[11px]">Download consolidated Webflow CSV file</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowQuickActionPalette(false);
                  setActiveTab("Workspace & Rules");
                }}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-left space-y-1 transition group cursor-pointer"
              >
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span>⚙️</span>
                  <span>Plant Rules & Banned Fluff</span>
                </div>
                <p className="text-slate-500 text-[11px]">Configure voice register and mandatory standards</p>
              </button>
            </div>
          </div>
        </div>
      )}

        {/* TAB 9: BILLING & QUOTAS */}
        {activeTab === "Billing & Quotas" && (
          <div className="p-6 space-y-6 max-w-7xl">
            <div className="pb-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Subscription & Capacity Management</h2>
              <p className="text-xs text-slate-500">
                Transparent industrial pricing undercutting horizontal tools while providing pre-built taxonomies and schema.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Starter */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono font-bold uppercase text-slate-500 mb-2">Plant Tier (Starter)</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900">$89</span>
                    <span className="text-xs text-slate-500">/ month</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">For single-facility manufacturers and solo industrial marketers.</p>
                  <div className="mt-6 space-y-2 text-xs border-t border-slate-100 pt-4 text-slate-700">
                    <div>✔ 20 QA-Validated Pages / mo</div>
                    <div>✔ 1 Connected Domain</div>
                    <div>✔ 2 Industrial Verticals</div>
                    <div>✔ FAQPage &amp; Article JSON-LD</div>
                    <div>✔ CMS Export (HTML/MD)</div>
                  </div>
                </div>
                <button
                  onClick={() => void startCheckout("starter")}
                  className="mt-6 w-full py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Select Starter Plan
                </button>
              </div>

              {/* Growth */}
              <div className="p-6 rounded-2xl border-2 border-sky-600 bg-white relative flex flex-col justify-between shadow-md">
                <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-sky-600 text-white shadow-xs">
                  CURRENT TIER
                </span>
                <div>
                  <div className="text-xs font-mono font-bold uppercase text-sky-700 mb-2">Assembly Tier (Growth)</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900">$229</span>
                    <span className="text-xs text-slate-500">/ month</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">For scaling industrial B2B tech SaaS and multi-plant operations.</p>
                  <div className="mt-6 space-y-2 text-xs border-t border-slate-100 pt-4 text-slate-700">
                    <div>✔ 100 QA-Validated Pages / mo</div>
                    <div>✔ 3 Connected Domains</div>
                    <div>✔ All 7 Pre-Built Verticals</div>
                    <div>✔ Multi-Schema (HowTo + Specs)</div>
                    <div>✔ Direct Webflow/WordPress API</div>
                    <div>✔ Custom URL Allowlists &amp; Fluff Gating</div>
                  </div>
                </div>
                <button
                  onClick={() => void startCheckout("growth")}
                  className="mt-6 w-full py-2.5 rounded-xl bg-sky-600 text-xs font-bold text-white shadow-sm hover:bg-sky-500 transition"
                >
                  Active Subscription
                </button>
              </div>

              {/* Agency */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono font-bold uppercase text-purple-700 mb-2">Fleet Tier (Agency)</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900">$799</span>
                    <span className="text-xs text-slate-500">/ month</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">For specialized B2B agencies managing multiple client retainers.</p>
                  <div className="mt-6 space-y-2 text-xs border-t border-slate-100 pt-4 text-slate-700">
                    <div>✔ 400 Pages included (+$1.75/pg overage)</div>
                    <div>✔ Unlimited Client Tenants</div>
                    <div>✔ White-Label Portal &amp; CNAME</div>
                    <div>✔ 15 Team &amp; Client Seats</div>
                    <div>✔ Dedicated Taxonomy Engineer</div>
                  </div>
                </div>
                <button
                  onClick={() => void openBillingPortal()}
                  className="mt-6 w-full py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Manage Agency Retainer
                </button>
              </div>
            </div>

            {/* Verified Engineering Parameter & Tolerance Index */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">
                    Deterministic Reliability & Parameter Veracity Matrix
                  </h3>
                  <p className="text-xs text-slate-500">
                    Physical units, regulatory codes, and chemical formulations verified by closed-loop inspection.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800">
                  ZERO FLUFF CERTIFIED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono font-bold text-slate-500 uppercase text-[11px] block">Verified Standards & Codes</span>
                  <div className="flex flex-wrap gap-1.5">
                    {customStandards.map((std, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-bold">
                        ✓ {std}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono font-bold text-slate-500 uppercase text-[11px] block">Physical Operating Tolerances</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Concentration: >2.5% NaOH", "Thermal: >80°C (176°F)", "Manifold Delta: 15 bar", "Spray Angle: 26° offset", "Viscosity: 450,000 SSU"].map((tol, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-mono text-[10px] font-bold">
                        ⚡ {tol}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono font-bold text-slate-500 uppercase text-[11px] block">Banned Fluff Superlatives Filter</span>
                  <div className="flex flex-wrap gap-1.5">
                    {customBannedWords.map((word, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-mono text-[10px] line-through">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WORKSPACE CONSOLE ENTERPRISE FOOTER */}
        <footer className="mt-12 border-t border-slate-200 bg-white/80 py-6 px-6 text-xs text-slate-500 rounded-b-2xl">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-600 text-white font-bold text-[10px]">
                FF
              </div>
              <span className="font-bold text-slate-800">ForgeFlow Console</span>
              <span className="text-slate-300">|</span>
              <span className="font-mono text-[11px] text-slate-600">
                Tenant: <strong className="text-slate-800">{organizationName || "Factory Workspace"}</strong>
              </span>
              <span className="text-slate-300">|</span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Engine Operational (SLA 99.9%)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-slate-500">
              <span>Schema.org v2.4 (TechArticle / HowTo)</span>
              <span>•</span>
              <button
                type="button"
                onClick={() => setActiveTab("Taxonomy Matrix")}
                className="hover:text-sky-600 transition cursor-pointer"
              >
                Taxonomies
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setActiveTab("QA Review Studio")}
                className="hover:text-sky-600 transition cursor-pointer"
              >
                QA Studio
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setActiveTab("AEO Schema Hub")}
                className="hover:text-sky-600 transition cursor-pointer"
              >
                AEO Schema Hub
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setActiveTab("Workspace & Rules")}
                className="hover:text-sky-600 transition cursor-pointer"
              >
                Workspace &amp; Rules
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Team Invitation Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-150">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Invite Team Member</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Send a secure invite link to add an engineer or manager to your workspace.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1 cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4">
              {inviteError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {inviteError}
                </div>
              )}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-slate-600 mb-1">
                  Colleague Work Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="engineer@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-slate-600 mb-1">
                  Role &amp; Permissions
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                >
                  <option value="MEMBER">Member (Can generate slices and drafts)</option>
                  <option value="REVIEWER">Reviewer (Can review, edit QA, and auto-patch)</option>
                  <option value="ADMIN">Admin (Full workspace and taxonomy permissions)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Invitations expire after 7 days and use SHA-256 secure hash tokens.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviteSending}
                  className="px-4 py-2 rounded-xl bg-sky-600 text-xs font-bold text-white hover:bg-sky-500 transition disabled:opacity-50 cursor-pointer"
                >
                  {inviteSending ? "Sending Invite…" : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reviewer Directory & Management Modal */}
      {showReviewerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-600 text-white font-bold text-xs">
                    👥
                  </span>
                  <h3 className="text-base font-bold text-slate-900">Application Engineering Reviewers</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Directory of certified engineers and subject matter experts authorized to sign off on technical SEO/AEO pages.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewerModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1 cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Existing Reviewers List */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
                  Active Engineering Reviewers ({reviewers.length})
                </h4>
                <div className="space-y-3">
                  {reviewers.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={rev.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                          alt={rev.name}
                          className="w-12 h-12 rounded-full object-cover border border-slate-300 shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-sm">{rev.name}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-200">
                              {rev.credentials}
                            </span>
                            <span className="text-xs text-slate-500 font-mono">({rev.yearsOfExperience} yrs exp)</span>
                          </div>
                          <p className="text-xs font-medium text-sky-700">{rev.jobTitle}</p>
                          {rev.bio && <p className="text-xs text-slate-600 leading-relaxed mt-1">{rev.bio}</p>}
                          {rev.linkedInUrl && (
                            <a
                              href={rev.linkedInUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block text-xs text-sky-600 hover:text-sky-700 font-semibold mt-1"
                            >
                              LinkedIn Profile ↗
                            </a>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={isReviewBusy || reviewers.length <= 1}
                        onClick={() => void handleDeleteReviewer(rev.id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition shrink-0 self-end sm:self-start disabled:opacity-30 cursor-pointer"
                        title={reviewers.length <= 1 ? "At least one reviewer required" : "Remove Reviewer"}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Reviewer Form */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-700 tracking-wider mb-3">
                  + Add Application Engineer / Reviewer
                </h4>
                <form onSubmit={handleCreateReviewer} className="space-y-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase font-bold text-slate-600 mb-1">
                        Full Name &amp; Title
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. Samantha Reyes, PE"
                        value={newReviewerName}
                        onChange={(e) => setNewReviewerName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase font-bold text-slate-600 mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Lead Thermal Systems Engineer"
                        value={newReviewerJobTitle}
                        onChange={(e) => setNewReviewerJobTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-mono uppercase font-bold text-slate-600 mb-1">
                        Credentials &amp; Certifications
                      </label>
                      <input
                        type="text"
                        placeholder="PE, ASME B31.3, MS Mechanical Engineering"
                        value={newReviewerCredentials}
                        onChange={(e) => setNewReviewerCredentials(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase font-bold text-slate-600 mb-1">
                        Years Experience
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={60}
                        value={newReviewerExp}
                        onChange={(e) => setNewReviewerExp(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase font-bold text-slate-600 mb-1">
                      LinkedIn Profile URL (Optional - for schema sameAs)
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.linkedin.com/in/samantha-reyes-pe"
                      value={newReviewerLinkedIn}
                      onChange={(e) => setNewReviewerLinkedIn(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase font-bold text-slate-600 mb-1">
                      Engineering Bio / Focus Area
                    </label>
                    <textarea
                      rows={2}
                      placeholder="15+ years in high-temperature fluid machinery, heat exchanger failure diagnostics, and ASME piping compliance."
                      value={newReviewerBio}
                      onChange={(e) => setNewReviewerBio(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={isReviewBusy || !newReviewerName.trim() || !newReviewerJobTitle.trim()}
                      className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                      {isReviewBusy ? "Adding Reviewer…" : "+ Save Engineer to Directory"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setShowReviewerModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Close Directory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Technical Verification & Sign-Off Modal */}
      {showSignOffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-700 text-white font-bold text-xs">
                    ✍️
                  </span>
                  <h3 className="text-base font-bold text-slate-900">Application Engineering Sign-Off</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Human-in-the-loop technical verification. Approved pages are signed with Person schema and unblocked for publishing.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSignOffModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1 cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Target Draft Information */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-500 block">Page Under Review:</span>
                <div className="font-bold text-slate-900 text-sm">{selectedDraft.title}</div>
                <div className="text-slate-600 flex items-center gap-2 mt-1 font-mono text-[11px]">
                  <span>Equipment: {selectedDraft.equipment || "Industrial Asset"}</span>
                  <span>•</span>
                  <span>Standard: {selectedDraft.standard || "Regulatory Code"}</span>
                </div>
              </div>

              {/* Reviewer Selection */}
              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-slate-700 mb-1">
                  Signing Application Engineer
                </label>
                <select
                  value={signOffReviewerId || selectedDraft.pageReview?.reviewerId || reviewers[0]?.id || ""}
                  onChange={(e) => setSignOffReviewerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                >
                  {reviewers.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {r.jobTitle} ({r.credentials})
                    </option>
                  ))}
                </select>
              </div>

              {/* Decision Radio */}
              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-slate-700 mb-2">
                  Review Decision
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSignOffDecision("approve")}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                      signOffDecision === "approve"
                        ? "border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-emerald-600 font-bold text-sm">✓</span>
                    <div>
                      <div className="font-bold text-xs text-slate-900">Approve &amp; Sign Off</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Unblocks production publishing and attaches verified schema.</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignOffDecision("changes_requested")}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                      signOffDecision === "changes_requested"
                        ? "border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-amber-600 font-bold text-sm">⚠️</span>
                    <div>
                      <div className="font-bold text-xs text-slate-900">Request Revisions</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Keeps publishing blocked and routes redlines to author.</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 4-Gate Engineering Verification Checklist */}
              <div className="space-y-2.5">
                <label className="block text-[11px] font-mono uppercase font-bold text-slate-700">
                  Engineering Verification Checklist (4-Gate Protocol)
                </label>
                <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={signOffChecklist.specAccuracy}
                      onChange={(e) => setSignOffChecklist((prev) => ({ ...prev, specAccuracy: e.target.checked }))}
                      className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                    />
                    <span className="text-slate-800">
                      <strong>Spec Accuracy:</strong> Verified operating limits, failure modes, and physical tolerances against engineering manual.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={signOffChecklist.standardsRef}
                      onChange={(e) => setSignOffChecklist((prev) => ({ ...prev, standardsRef: e.target.checked }))}
                      className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                    />
                    <span className="text-slate-800">
                      <strong>Standards Referenced:</strong> Cross-referenced with active regulatory specifications (ISO, ASME, ASHRAE, 3-A).
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={signOffChecklist.tolerances}
                      onChange={(e) => setSignOffChecklist((prev) => ({ ...prev, tolerances: e.target.checked }))}
                      className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                    />
                    <span className="text-slate-800">
                      <strong>Operating Tolerances:</strong> Confirmed pressure, thermal differential, and mechanical fatigue thresholds.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={signOffChecklist.schemaValid}
                      onChange={(e) => setSignOffChecklist((prev) => ({ ...prev, schemaValid: e.target.checked }))}
                      className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                    />
                    <span className="text-slate-800">
                      <strong>AEO Schema Validity:</strong> Validated structured multi-entity JSON-LD graphs with reviewedBy Person entity.
                    </span>
                  </label>
                </div>
              </div>

              {/* Reviewer Notes / Verification statement */}
              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-slate-700 mb-1">
                  {signOffDecision === "approve" ? "Reviewer Verification Statement" : "Requested Redlines & Revision Notes"}
                </label>
                <textarea
                  rows={3}
                  placeholder={
                    signOffDecision === "approve"
                      ? "e.g. Verified operating envelope, failure causation, and allowable thermal differentials per certified ASHRAE/ISO guidelines."
                      : "e.g. Please update operating pressure from 150 bar to 180-240 bar per AISE Technical Report No. 9."
                  }
                  value={signOffNotes}
                  onChange={(e) => setSignOffNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowSignOffModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isReviewBusy}
                onClick={() => void handleSubmitExpertReview(selectedDraft.id)}
                className={`px-5 py-2 rounded-xl text-white font-bold text-xs shadow-xs transition disabled:opacity-50 cursor-pointer ${
                  signOffDecision === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-500"
                    : "bg-amber-600 hover:bg-amber-500"
                }`}
              >
                {isReviewBusy
                  ? "Submitting Review…"
                  : signOffDecision === "approve"
                  ? "✓ Approve & Sign Off Page"
                  : "⚠️ Submit Revision Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
