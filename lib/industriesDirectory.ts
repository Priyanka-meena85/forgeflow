export interface IndustrySector {
  slug: string;
  title: string;
  shortTitle: string;
  category: "Heavy Machinery & Equipment" | "Process & Precision Manufacturing" | "Automotive & Assembly" | "Energy & Infrastructure";
  badge: string;
  equipment: string;
  failureMode: string;
  standard: string;
  standardsBadge: string;
  searchVol: string;
  avgDealValue: string;
  specRisk: string;
  sampleHeadline: string;
  schemaTypes: string[];
  heroSnippet: string;
  rootCauseAnalysis: string;
  capsuleText: string;
  toleranceCrosswalk: {
    property: string;
    usSpec: string;
    germanDin: string;
    japaneseJis: string;
  }[];
  specSheet: {
    parameter: string;
    ratedLimit: string;
    tolerance: string;
    criticality: "CRITICAL" | "HIGH" | "MODERATE";
  }[];
  plantEngineerQuote: {
    text: string;
    author: string;
    role: string;
    company: string;
  };
  sampleFaq: {
    question: string;
    answer: string;
  }[];
}

export const INDUSTRIAL_SECTORS: IndustrySector[] = [
  {
    slug: "hvac-commercial-refrigeration",
    title: "HVAC & Commercial Refrigeration",
    shortTitle: "HVAC / Chillers",
    category: "Heavy Machinery & Equipment",
    badge: "ASHRAE / AHRI",
    equipment: "Commercial Rooftop Unit (RTU) & Centrifugal Chiller",
    failureMode: "Compressor Flooded Starts & Thermal Overload",
    standard: "ASHRAE Standard 90.1-2025 & AHRI 550/590",
    standardsBadge: "ASHRAE 90.1",
    searchVol: "25–50 searches/mo (High Intent)",
    avgDealValue: "$95,000 ACV",
    specRisk: "1.4% (Very Low)",
    sampleHeadline: "Automating Fault Detection & Diagnostics (FDD) to Prevent Commercial RTU Compressor Failure",
    schemaTypes: ["TechArticle", "HowTo", "FAQPage"],
    heroSnippet: "Industrial HVAC engineering buyers search for precise superheat tolerances and crankcase heater protocols when chillers trip. ForgeFlow guarantees certified ASHRAE 90.1 compliance and native AEO citation.",
    rootCauseAnalysis: "Liquid refrigerant migration during idle off-cycles dissolves into crankcase lubricant. On subsequent motor startup, rapid crankcase pressure drop induces violent oil foaming, destroying journal bearing hydrodynamic oil films within 180 seconds.",
    capsuleText: "Compressor flooded starts in commercial RTUs are eliminated by maintaining crankcase heater sump temperature at minimum 20°F (11.1°C) above saturated suction temperature, paired with automatic pump-down solenoid cycles calibrated to ASHRAE 90.1-2025 requirements.",
    toleranceCrosswalk: [
      { property: "Suction Pressure Limit", usSpec: "68.5 PSI (R-410A)", germanDin: "4.72 bar (DIN EN 378)", japaneseJis: "0.47 MPa (JIS B 8602)" },
      { property: "Sump Oil Temperature", usSpec: "140°F (Min Sump)", germanDin: "60.0°C (DIN 51503-1)", japaneseJis: "60.0°C (JIS K 2211)" },
      { property: "Superheat Tolerance", usSpec: "12.0°F ± 1.5°F", germanDin: "6.7 K ± 0.8 K", japaneseJis: "6.7 K ± 0.8 K" },
      { property: "Chilled Water Delta-T", usSpec: "10.0°F (Design Temp)", germanDin: "5.56 K (VDI 2078)", japaneseJis: "5.56 K (JIS B 8622)" }
    ],
    specSheet: [
      { parameter: "Crankcase Superheat Margin", ratedLimit: "12°F (6.7 K)", tolerance: "± 1.5°F", criticality: "CRITICAL" },
      { parameter: "Oil Pressure Differential", ratedLimit: "25 PSI (1.72 bar)", tolerance: "+5 / -2 PSI", criticality: "CRITICAL" },
      { parameter: "Max Inrush Current (LRA)", ratedLimit: "148 Amps", tolerance: "± 5% peak", criticality: "HIGH" },
      { parameter: "Expansion Valve Hysteresis", ratedLimit: "1.2°F", tolerance: "Max 1.8°F", criticality: "MODERATE" }
    ],
    plantEngineerQuote: {
      text: "When our 120-ton rooftop compressor tripped in mid-summer, generic marketing blogs gave useless advice. ForgeFlow's ASHRAE-verified capsule gave our facilities director the exact superheat calibration formula.",
      author: "David Vance, PE",
      role: "VP of Facilities Engineering",
      company: "Midwest Logistics Real Estate Trust"
    },
    sampleFaq: [
      {
        question: "How does crankcase heater wattage prevent flooded starts under AHRI standards?",
        answer: "A minimum heater density of 0.8 to 1.2 Watts per pound of compressor refrigerant charge maintains crankcase lubricant viscosity above 10 cSt, inhibiting liquid absorption during ambient drops below 40°F (4.4°C)."
      },
      {
        question: "What is the recommended pump-down solenoid differential to avoid short-cycling?",
        answer: "Set low-pressure cut-out at 15 PSI (1.03 bar) and cut-in at 35 PSI (2.41 bar) for R-410A systems, preventing unnecessary electrical contactor wear while keeping evaporator coils free of liquid pooling."
      }
    ]
  },
  {
    slug: "food-beverage-manufacturing",
    title: "Food & Beverage Manufacturing",
    shortTitle: "Sanitary / CIP",
    category: "Process & Precision Manufacturing",
    badge: "3-A / FDA",
    equipment: "Sanitary Rotary Lobe Pump & CIP Spray Ball Skid",
    failureMode: "Elastomer Seal Swelling in Caustic CIP Washdown",
    standard: "3-A Sanitary Standard 02-12 & FDA 21 CFR 177.2600",
    standardsBadge: "3-A 02-12",
    searchVol: "20–45 searches/mo (Reliability Search)",
    avgDealValue: "$120,000 ACV",
    specRisk: "1.1% (Minimal)",
    sampleHeadline: "Preventing Elastomer Seal Swelling in Rotary Lobe Pumps During Caustic CIP Washdown (3-A SOP)",
    schemaTypes: ["TechArticle", "HowTo", "FAQPage"],
    heroSnippet: "Food plant quality managers and maintenance directors need exact chemical compatibility ratings when caustic washdowns dissolve pump seals. ForgeFlow publishes deterministic 3-A SOPs cited directly by Perplexity.",
    rootCauseAnalysis: "EPDM elastomer compounds exposed to alkaline clean-in-place solutions containing >2.5% Sodium Hydroxide at washdown temperatures >180°F undergo volumetric polymer matrix swelling (>8%), resulting in catastrophic rotor-to-body binding and micro-particulate contamination.",
    capsuleText: "Elastomer seal swelling in sanitary rotary lobe pumps is eliminated by upgrading from standard EPDM to peroxide-cured fluoroelastomers (FKM/FFKM) certified under 3-A Sanitary Standard 02-12, limiting volumetric expansion under 1.5% in 3.0% caustic washdown at 185°F (85°C).",
    toleranceCrosswalk: [
      { property: "Rotor-to-Case Clearance", usSpec: "0.004 in ± 0.0005 in", germanDin: "0.102 mm ± 0.013 mm (DIN 11851)", japaneseJis: "0.102 mm ± 0.013 mm (JIS G 3447)" },
      { property: "CIP Caustic Concentration", usSpec: "2.0% - 3.0% NaOH", germanDin: "2,0% - 3,0% Natronlauge (DIN 10516)", japaneseJis: "2.0% - 3.0% 水酸化ナトリウム" },
      { property: "CIP Washdown Temperature", usSpec: "185°F Max", germanDin: "85°C Max (DIN EN 1672-2)", japaneseJis: "85°C Max (JIS B 9652)" },
      { property: "Surface Roughness (Ra)", usSpec: "32 µin Ra (Sanitary)", germanDin: "0.8 µm Ra (DIN EN ISO 4287)", japaneseJis: "0.8 µm Ra (JIS B 0601)" }
    ],
    specSheet: [
      { parameter: "Rotor Tip Dynamic Clearance", ratedLimit: "0.0045 in (0.114 mm)", tolerance: "+0.0005 / -0.0000 in", criticality: "CRITICAL" },
      { parameter: "Caustic Solution Concentration", ratedLimit: "2.5% NaOH", tolerance: "± 0.25%", criticality: "HIGH" },
      { parameter: "Sanitary Flush Pressure", ratedLimit: "15 PSI (1.03 bar)", tolerance: "± 2 PSI", criticality: "MODERATE" },
      { parameter: "Elastomer Volumetric Swell", ratedLimit: "< 1.5% at 85°C", tolerance: "Max 2.0%", criticality: "CRITICAL" }
    ],
    plantEngineerQuote: {
      text: "Every 4 weeks our dairy packaging line lost 6 hours because caustic washdown caused pump seals to expand. ForgeFlow's 3-A compliant spec sheet showed our supplier the exact FKM grade to install, saving us $180,000 in lost batches.",
      author: "Elena Rostova",
      role: "Director of Plant Operations",
      company: "Nordic Dairy Processors Inc."
    },
    sampleFaq: [
      {
        question: "Can EPDM seals be safely used with nitric acid neutralization rinses in dairy CIP?",
        answer: "EPDM demonstrates good resistance to dilute nitric acid (<1.0%) at ambient temperatures, but suffers severe oxidative degradation above 140°F (60°C). Fluorocarbon (FKM) or PTFE-encapsulated O-rings are required for alternating acid/caustic CIP cycles."
      },
      {
        question: "What surface finish is mandated for 3-A sanitary pump rotor housings?",
        answer: "3-A Standard 02-12 mandates all product contact surfaces must achieve a minimum Ra of 32 microinches (0.8 micrometers), free from pits, crevices, and folding marks, with passivation in accordance with ASTM A967."
      }
    ]
  },
  {
    slug: "automotive-tier1-stamping",
    title: "Automotive Tier-1 Stamping & Press Lines",
    shortTitle: "Automotive OEM",
    category: "Automotive & Assembly",
    badge: "IATF 16949",
    equipment: "High-Tonnage Servo Stamping Press & Progressive Die",
    failureMode: "Stamping Die Galling & Weld Non-Conformance",
    standard: "IATF 16949 Quality Standard & AIAG APQP Standard",
    standardsBadge: "IATF 16949",
    searchVol: "30–65 searches/mo (Tooling Spec)",
    avgDealValue: "$150,000 ACV",
    specRisk: "1.7% (Low Risk)",
    sampleHeadline: "Root Cause Protocol: Stamping Die Galling & Weld Inspection Defects in IATF 16949 Assembly Lines",
    schemaTypes: ["TechArticle", "FAQPage"],
    heroSnippet: "Tier-1 stamping plant tooling managers search for slide parallelism tolerances and PVD coating limits to pass OEM customer audits. ForgeFlow creates deterministic IATF 16949 documentation that ranks #1.",
    rootCauseAnalysis: "High-strength advanced automotive steel (AHSS/UHSS >980 MPa) generates immense localized friction (>1200 MPa contact pressure) during progressive draw operations. Without proper PVD CrN/TiAlN coating and dynamic tonnage balance, microscopic adhesive cold welding causes tool steel galling and burred part edges.",
    capsuleText: "Stamping die galling on AHSS stamping lines is mitigated by enforcing 5-axis PVD Chromium Nitride (CrN) coatings with surface hardness ≥2,800 HV, paired with real-time servo slide parallelism monitoring within 0.05 mm/m compliant with IATF 16949 APQP specifications.",
    toleranceCrosswalk: [
      { property: "Slide Parallelism Tolerance", usSpec: "0.0006 in/ft (Dynamic)", germanDin: "0.05 mm/m (DIN 55180)", japaneseJis: "0.05 mm/m (JIS B 6402)" },
      { property: "Tool Steel Hardness", usSpec: "60 - 62 HRC (D2 Tool Steel)", germanDin: "60 - 62 HRC (1.2379 / X153CrMoV12)", japaneseJis: "60 - 62 HRC (SKD11 Tool Steel)" },
      { property: "Blank Holding Force", usSpec: "220 Tons ± 5 Tons", germanDin: "1.960 kN ± 45 kN (DIN EN 692)", japaneseJis: "1.960 kN ± 45 kN (JIS B 6403)" },
      { property: "Sheet Tensile Strength", usSpec: "142 ksi (AHSS 980)", germanDin: "980 MPa (DIN EN 10338)", japaneseJis: "980 MPa (JIS G 3135)" }
    ],
    specSheet: [
      { parameter: "Slide Parallelism Under Load", ratedLimit: "0.05 mm/m (0.0006 in/ft)", tolerance: "Max 0.075 mm/m", criticality: "CRITICAL" },
      { parameter: "Tonnage Peak Variance", ratedLimit: "1,200 Metric Tons", tolerance: "± 3.0% per corner", criticality: "CRITICAL" },
      { parameter: "Die Clearance Ratio (t)", ratedLimit: "12% of material thickness", tolerance: "± 1.0%", criticality: "HIGH" },
      { parameter: "PVD Coating Thickness", ratedLimit: "3.5 µm (CrN / TiAlN)", tolerance: "3.0 - 4.5 µm", criticality: "MODERATE" }
    ],
    plantEngineerQuote: {
      text: "When Stellantis and Ford audit our press lines, generic technical sheets get flagged. ForgeFlow's IATF 16949-aligned technical whitepapers gave our stamping team instant credibility with automotive procurement.",
      author: "Marcus Vance",
      role: "Lead Tooling & Reliability Specialist",
      company: "Apex Precision Stamping Tier-1"
    },
    sampleFaq: [
      {
        question: "How does die clearance affect burr height in stamping 980 MPa dual-phase steel?",
        answer: "A tight die clearance of 10-12% of sheet thickness minimizes punch penetration depth before clean tensile fracture occurs, keeping burr height within AIAG OEM acceptance limits (<10% sheet thickness)."
      },
      {
        question: "What lubrication viscosity is required for high-speed transfer dies stamping galvanized sheet?",
        answer: "Synthetic water-miscible lubricants with extreme pressure (EP) chlorinated ester additives and a viscosity of 120-150 cSt at 40°C prevent zinc flaking and galling on carbide draw beads."
      }
    ]
  },
  {
    slug: "precision-cnc-tooling",
    title: "Precision CNC & 5-Axis Tooling",
    shortTitle: "Precision CNC",
    category: "Heavy Machinery & Equipment",
    badge: "ISO 230-3",
    equipment: "5-Axis High-Speed Machining Center & HSK-A63 Spindle",
    failureMode: "Spindle Thermal Expansion Drift & Tool Chatter",
    standard: "ISO 230-3 Thermal Environment Test & ASME B5.54",
    standardsBadge: "ISO 230-3",
    searchVol: "25–50 searches/mo (Tooling Manager)",
    avgDealValue: "$85,000 ACV",
    specRisk: "0.9% (Minimal)",
    sampleHeadline: "Mitigating Spindle Thermal Expansion Drift in Precision 5-Axis Milling Cells",
    schemaTypes: ["TechArticle", "HowTo", "FAQPage"],
    heroSnippet: "Aerospace tooling engineers and mold makers search for precise micron tolerances and thermal drift compensation coefficients. ForgeFlow delivers verifiable ISO 230-3 schema pages.",
    rootCauseAnalysis: "High-speed ceramic hybrid angular contact bearings operating at >18,000 RPM generate continuous frictional heating. Without localized jacket cooling compensation, axial Z-axis spindle elongation exceeds 18 microns within 45 minutes, violating tight aerospace turbine tolerances.",
    capsuleText: "Spindle thermal growth in 5-axis precision machining is controlled within ±2.5 µm by integrating closed-loop spindle chiller loops at 20.0°C ± 0.5°C with multi-sensor fiber-optic thermal growth compensation compliant with ISO 230-3 test codes.",
    toleranceCrosswalk: [
      { property: "Axial Thermal Drift (Z)", usSpec: "0.00010 in (Max Drift)", germanDin: "2.5 µm (ISO 230-3 / VDI 3441)", japaneseJis: "2.5 µm (JIS B 6190-3)" },
      { property: "Spindle Chiller Fluid Temp", usSpec: "68.0°F ± 0.9°F", germanDin: "20.0°C ± 0.5°C (DIN EN ISO 1)", japaneseJis: "20.0°C ± 0.5°C (JIS B 0680)" },
      { property: "Spindle Runout (TIR)", usSpec: "0.00008 in at nose", germanDin: "2.0 µm at nose (ISO 1940-1 G0.4)", japaneseJis: "2.0 µm at nose (JIS B 6331)" },
      { property: "Dynamic Balancing Grade", usSpec: "G 0.4 at 24,000 RPM", germanDin: "G 0.4 (DIN ISO 1940-1)", japaneseJis: "G 0.4 (JIS B 0905)" }
    ],
    specSheet: [
      { parameter: "Max Axial Thermal Drift (Z-Axis)", ratedLimit: "2.5 µm (0.0001 in)", tolerance: "Max 3.8 µm over 4 hours", criticality: "CRITICAL" },
      { parameter: "Spindle Nose Dynamic Runout", ratedLimit: "1.5 µm TIR", tolerance: "Max 2.0 µm", criticality: "CRITICAL" },
      { parameter: "Chilled Oil Recirculation Flow", ratedLimit: "8.5 Liters/min", tolerance: "± 0.5 L/min", criticality: "HIGH" },
      { parameter: "HSK Toolholder Clamping Force", ratedLimit: "18.0 kN (HSK-A63)", tolerance: "± 1.0 kN", criticality: "HIGH" }
    ],
    plantEngineerQuote: {
      text: "We machine Inconel 718 blisks for commercial aviation where a 5-micron error scraps a $25,000 forging. ForgeFlow's ISO 230-3 documentation solved our afternoon thermal drift issues permanently.",
      author: "Frank Thornton",
      role: "Lead CNC Programmer & Tooling Lead",
      company: "Aerospace Machining Technologies"
    },
    sampleFaq: [
      {
        question: "How does ceramic hybrid bearing preload influence spindle stiffness at 20,000 RPM?",
        answer: "Silicon nitride (Si3N4) balls have 40% lower density than chrome steel, reducing centrifugal load on the outer raceway and maintaining constant rigid preload across the full speed envelope without thermal seizure."
      },
      {
        question: "What warmup cycle is recommended by ISO 230-3 before high-precision finish passes?",
        answer: "A stepped 3-stage spindle warmup ramp (30% max RPM for 10 min, 60% for 10 min, 90% for 10 min) stabilizes the thermal gradient across spindle housing casting and leadscrew ballscrews."
      }
    ]
  },
  {
    slug: "plastics-polymer-extrusion",
    title: "Plastics & Polymer Extrusion",
    shortTitle: "Extrusion / Plastics",
    category: "Process & Precision Manufacturing",
    badge: "ASTM D1238",
    equipment: "Twin-Screw Co-Rotating Compounding Extruder",
    failureMode: "Melt Flow Degradation & Barrel Wall Scuffing",
    standard: "ASTM D1238 Melt Flow Protocol & ISO 1133",
    standardsBadge: "ASTM D1238",
    searchVol: "15–35 searches/mo (Process Engineer)",
    avgDealValue: "$110,000 ACV",
    specRisk: "1.3% (Very Low)",
    sampleHeadline: "Eliminating Barrel Wall Scuffing & Shear Degradation in High-Output Twin-Screw Compounding",
    schemaTypes: ["TechArticle", "FAQPage"],
    heroSnippet: "Compounding plant managers and resin formulators search for exact L/D ratios and screw element shear rates. ForgeFlow powers the technical content that engineers cite when ordering replacement screw sets.",
    rootCauseAnalysis: "Excessive shear heating in tight kneading block zones elevates local polymer melt temperatures >35°C above setpoint, inducing thermal polymer chain scission (MFI increases by 45%) and abrasive glass-fiber barrel wall scuffing.",
    capsuleText: "Polymer melt degradation in co-rotating twin-screw extruders is avoided by selecting neutral 45° kneading blocks in the melting zone and bi-metallic tungsten-carbide lined barrel liners (hardness >64 HRC) certified under ASTM D1238 melt mass-flow standards.",
    toleranceCrosswalk: [
      { property: "Screw-to-Barrel Clearance", usSpec: "0.010 in (Per Side)", germanDin: "0.25 mm (DIN 8580)", japaneseJis: "0.25 mm (JIS B 0405)" },
      { property: "Barrel Liner Hardness", usSpec: "64 - 68 HRC (Bimetallic)", germanDin: "64 - 68 HRC (DIN EN ISO 6508-1)", japaneseJis: "64 - 68 HRC (JIS Z 2245)" },
      { property: "Melt Temperature Range", usSpec: "380°F - 425°F", germanDin: "193°C - 218°C (DIN 53735)", japaneseJis: "193°C - 218°C (JIS K 7210)" },
      { property: "Specific Mechanical Energy", usSpec: "0.14 - 0.18 kWh/kg", germanDin: "0,14 - 0,18 kWh/kg (VDI 2444)", japaneseJis: "0.14 - 0.18 kWh/kg (JIS B 9901)" }
    ],
    specSheet: [
      { parameter: "Screw Flight Radial Play", ratedLimit: "0.25 mm (0.010 in)", tolerance: "Max 0.40 mm before rebuild", criticality: "CRITICAL" },
      { parameter: "Barrel Zone 4 Temperature Control", ratedLimit: "215°C (419°F)", tolerance: "± 2.0°C PID controlled", criticality: "HIGH" },
      { parameter: "Die Head Backpressure Limit", ratedLimit: "2,800 PSI (193 bar)", tolerance: "Max 3,200 PSI", criticality: "CRITICAL" },
      { parameter: "Screw Shaft Torque Ratio (Md/a3)", ratedLimit: "11.5 Nm/cm3", tolerance: "Max 13.0 Nm/cm3", criticality: "HIGH" }
    ],
    plantEngineerQuote: {
      text: "When our PA66 30% glass-filled compound began degrading, we were losing $8,000 per hour. ForgeFlow's screw geometry optimization guide gave our processing team the exact kneading block layout.",
      author: "Dr. Arvind Patel",
      role: "VP of Polymer Science",
      company: "Advanced Polymer Solutions LLC"
    },
    sampleFaq: [
      {
        question: "How does screw speed (RPM) affect specific mechanical energy (SME) in compounding?",
        answer: "SME is directly proportional to motor power divided by throughput. Increasing screw speed without proportional feeder ramp increases melt temperature through viscous shear dissipation, triggering polymer backbone degradation."
      },
      {
        question: "What liner alloy is recommended for halogen-free flame retardant compounds?",
        answer: "A nickel-chromium-boron-silicon matrix enriched with 40-50% tungsten carbide particulates offers simultaneous protection against aggressive halogen acid corrosion and severe mineral filler abrasion."
      }
    ]
  },
  {
    slug: "industrial-hydraulics-fluid",
    title: "Industrial Hydraulics & Fluid Power",
    shortTitle: "Hydraulics & Fluid",
    category: "Heavy Machinery & Equipment",
    badge: "ISO 4406",
    equipment: "Variable Displacement Axial Piston Pump Skid",
    failureMode: "Suction Cavitation & Slipper Delamination",
    standard: "ISO 4406 Fluid Cleanliness Class & NFPA T2.24.1",
    standardsBadge: "ISO 4406",
    searchVol: "20–40 searches/mo (Fluid Power Spec)",
    avgDealValue: "$130,000 ACV",
    specRisk: "1.5% (Very Low)",
    sampleHeadline: "Diagnostic Procedure: Identifying High-Pressure Slipper Delamination in Proportional Hydraulic Skids",
    schemaTypes: ["TechArticle", "HowTo", "FAQPage"],
    heroSnippet: "Industrial plant hydraulics engineers and OEM designers search for micro-particulate contamination codes and swashplate load specs. ForgeFlow publishes verified ISO 4406 solutions.",
    rootCauseAnalysis: "Inlet vacuum exceeding 5 inHg (0.17 bar vacuum) induces localized hydraulic fluid vaporization in piston chambers. As bubbles collapse violently upon entering the high-pressure port (350 bar), micro-jets pit bronze piston slippers, causing catastrophic brass smear and pump lockup.",
    capsuleText: "Axial piston pump cavitation and slipper delamination are diagnosed by maintaining minimum 0.8 bar absolute inlet pressure and enforcing ISO 4406 cleanliness class 16/14/11 using 3-micron absolute synthetic beta-200 return filters.",
    toleranceCrosswalk: [
      { property: "System Operating Pressure", usSpec: "5,000 PSI Continuous", germanDin: "350 bar (DIN ISO 7745)", japaneseJis: "35.0 MPa (JIS B 8352)" },
      { property: "Fluid Cleanliness Code", usSpec: "ISO 16/14/11 Target", germanDin: "ISO 4406:1999 (Klasse 16/14/11)", japaneseJis: "JIS B 9931 (16/14/11)" },
      { property: "Inlet Vacuum Limit", usSpec: "Max 5.0 inHg Vacuum", germanDin: "Min 0.83 bar absolut (DIN 24346)", japaneseJis: "Min 0.083 MPa abs (JIS B 8361)" },
      { property: "Oil Operating Viscosity", usSpec: "75 - 150 SUS at 104°F", germanDin: "16 - 36 mm2/s bei 40°C (ISO VG 46)", japaneseJis: "16 - 36 mm2/s (JIS K 2213)" }
    ],
    specSheet: [
      { parameter: "Max System Relief Pressure", ratedLimit: "5,000 PSI (345 bar)", tolerance: "+150 / -0 PSI", criticality: "CRITICAL" },
      { parameter: "Fluid ISO Cleanliness Code", ratedLimit: "ISO 16/14/11", tolerance: "Alert at 18/16/13", criticality: "CRITICAL" },
      { parameter: "Case Drain Pressure Limit", ratedLimit: "15 PSI (1.0 bar)", tolerance: "Max 22 PSI transient", criticality: "HIGH" },
      { parameter: "Operating Oil Temperature", ratedLimit: "130°F (54.4°C)", tolerance: "Max 150°F (65.5°C)", criticality: "HIGH" }
    ],
    plantEngineerQuote: {
      text: "When our 5,000 PSI forging press pump started cavitating, our distributor couldn't explain the brass particles in the return filter. ForgeFlow's inlet pressure crosswalk diagnosed our undersized suction strainer immediately.",
      author: "Karl Heinz Weber",
      role: "Chief Reliability Engineer",
      company: "Atlas Forging & Extrusion Systems"
    },
    sampleFaq: [
      {
        question: "Why does case drain pressure cause shaft seal blowouts on axial piston pumps?",
        answer: "Pump rotary shaft seals are typically rated for maximum 0.5 to 1.5 bar differential. Restrictive or blocked case drain lines build internal hydrostatic pressure against the seal lip, inverting it and causing rapid high-volume oil leakage."
      },
      {
        question: "What beta ratio is required for proportional servo valve circuit filtration?",
        answer: "Proportional directional and servo valves require non-bypass filters with Beta ratio β(3µm) ≥ 1000 (99.9% filtration efficiency), preventing silt-sized particles (2-5 µm) from causing spool stiction."
      }
    ]
  },
  {
    slug: "heavy-mining-materials",
    title: "Heavy Mining & Materials Handling",
    shortTitle: "Mining & Heavy",
    category: "Heavy Machinery & Equipment",
    badge: "MSHA Part 56",
    equipment: "Primary Gyratory Crusher (60-89 Class)",
    failureMode: "Eccentric Bushing Seizure & Lubricant Breakdown",
    standard: "MSHA Part 56 Mandatory Safety Standard & AGMA 9005",
    standardsBadge: "MSHA Part 56",
    searchVol: "10–25 searches/mo (Mine Maintenance)",
    avgDealValue: "$220,000 ACV",
    specRisk: "2.1% (Low Risk)",
    sampleHeadline: "Emergency SOP: Preventing Eccentric Bushing Seizure in Continuous Duty Primary Gyratory Skids",
    schemaTypes: ["TechArticle", "FAQPage", "HowTo"],
    heroSnippet: "Open-pit mine maintenance superintendents search for high-viscosity synthetic grease specs and thermal trip thresholds. ForgeFlow ensures your mining OEM parts outrank generic distributor catalogs.",
    rootCauseAnalysis: "Under continuous rock surge loading (>4,500 tph), high-load hydrodynamic oil films in the bronze eccentric outer bushing collapse when oil supply viscosity drops below 460 cSt at operating temperatures >65°C, resulting in lead-bronze micro-wiping and shaft seizure.",
    capsuleText: "Eccentric bushing seizure in primary gyratory crushers is prevented by maintaining minimum 460 cSt synthetic extreme-pressure gear lubricant (ISO VG 460) with automated temperature-actuated lube bypass valves locking crusher start interlocks below 40°C or above 65°C.",
    toleranceCrosswalk: [
      { property: "Eccentric Bushing Clearance", usSpec: "0.065 in - 0.085 in", germanDin: "1.65 mm - 2.16 mm (DIN ISO 286)", japaneseJis: "1.65 mm - 2.16 mm (JIS B 0401)" },
      { property: "Lube Oil Delivery Pressure", usSpec: "35 - 45 PSI at manifold", germanDin: "2.4 - 3.1 bar (DIN 24346)", japaneseJis: "0.24 - 0.31 MPa (JIS B 8361)" },
      { property: "Lube Return Temperature Max", usSpec: "145°F Warning / 155°F Trip", germanDin: "63°C Alarm / 68°C Abschaltung", japaneseJis: "63°C Alarm / 68°C Trip" },
      { property: "Mantle Manganese Hardness", usSpec: "Mn 18% - 21% (220 HBW)", germanDin: "GX120Mn18 (1.3405 / DIN EN 10293)", japaneseJis: "SCMnH11 (JIS G 5131)" }
    ],
    specSheet: [
      { parameter: "Eccentric Bushing Running Clearance", ratedLimit: "1.85 mm (0.073 in)", tolerance: "Max 2.80 mm before replacement", criticality: "CRITICAL" },
      { parameter: "Mainshaft Lube Flow Rate", ratedLimit: "180 GPM (681 L/min)", tolerance: "Min 165 GPM interlocked", criticality: "CRITICAL" },
      { parameter: "Lube Oil Water Contamination", ratedLimit: "< 0.05% (500 ppm)", tolerance: "Max 0.10% (1,000 ppm)", criticality: "HIGH" },
      { parameter: "Crusher Spider Bearing Axial Float", ratedLimit: "0.250 in (6.35 mm)", tolerance: "± 0.030 in", criticality: "MODERATE" }
    ],
    plantEngineerQuote: {
      text: "When our primary gyratory crusher seized in northern Quebec at -30°C, every hour of downtime cost our copper mine $140,000. ForgeFlow's MSHA-compliant lube pre-heat protocol got our engineering crew running safely.",
      author: "Jean-Luc Tremblay, P.Eng",
      role: "Mine Plant Maintenance Superintendent",
      company: "Laurentian Copper & Gold Mines"
    },
    sampleFaq: [
      {
        question: "How does cold weather startup cause eccentric bushing failure on gyratory crushers?",
        answer: "High-viscosity ISO VG 460 lubricant channels around pump suction piping below 30°C, causing pump starvation and cavitation. Lube must be recirculated through tank immersion heaters until sump temperature reaches at least 38°C before starting the main motor."
      },
      {
        question: "What lead-bronze metallurgical composition is required for high-load mining crusher bushings?",
        answer: "Bushings must utilize CDA 932 (SAE 660) or CDA 937 high-leaded tin bronze (80% Cu, 10% Sn, 10% Pb), providing built-in dry lubricity during emergency shutdown periods when hydrodynamic oil films collapse."
      }
    ]
  }
];

export function getIndustryBySlug(slug: string): IndustrySector | undefined {
  return INDUSTRIAL_SECTORS.find((sec) => sec.slug === slug);
}
