export interface VerticalTaxonomy {
  name: string;
  equipment: string[];
  failureModes: string[];
  standards: string[];
  sampleTitle: string;
  acv: string;
  capsuleText: string;
  riskLevel: string;
}

export const verticalTaxonomies: Record<string, VerticalTaxonomy> = {
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
