import { Draft } from "@/types/dashboard";

export const demoReviewDrafts: Draft[] = [
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
