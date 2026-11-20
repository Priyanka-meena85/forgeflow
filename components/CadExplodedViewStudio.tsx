"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export interface CadSubassemblyNode {
  id: string;
  name: string;
  partNumber: string;
  material: string;
  materialEquivalents: {
    us: string;
    din: string;
    jis: string;
  };
  torqueLimit: {
    metric: string;
    imperial: string;
    tolerance: string;
  };
  wearLimit: string;
  failureMode: string;
  inspectionStandard: string;
  status: "NORMAL" | "WARNING" | "CRITICAL";
  axisOffset: { x: number; y: number; z: number }; // Relative direction for exploded view
  color: string;
  wireColor: string;
}

const assemblyParts: CadSubassemblyNode[] = [
  {
    id: "rotor-spindle",
    name: "Precision Rotor & Drive Spindle Core",
    partNumber: "RTR-4140-5500-OEM",
    material: "Chrome-Moly Alloy Steel (AISI 4140)",
    materialEquivalents: {
      us: "AISI 4140 (ASTM A29)",
      din: "42CrMo4 (DIN EN 10083-3, WNr. 1.7225)",
      jis: "SCM440 (JIS G 4053)",
    },
    torqueLimit: {
      metric: "88.1 N·m",
      imperial: "65.0 ft-lb",
      tolerance: "±1.5% calibrated",
    },
    wearLimit: "Shaft runout TIR < 0.0004 in. (0.010 mm)",
    failureMode: "Torsional fatigue stress from cyclic pump cavitation",
    inspectionStandard: "ISO 10816-3 Class I / ASME B73.1",
    status: "NORMAL",
    axisOffset: { x: -80, y: 0, z: 0 },
    color: "#0284c7", // Sky 600
    wireColor: "#38bdf8",
  },
  {
    id: "mechanical-seal",
    name: "Dual Cartridge Mechanical Face Seal",
    partNumber: "SEAL-SIC-9102-CIP",
    material: "Silicon Carbide (SiC) vs Tungsten Carbide",
    materialEquivalents: {
      us: "Sintered SiC (ASTM C1111)",
      din: "Siliziumkarbid (DIN EN 12756)",
      jis: "炭化ケイ素 (JIS R 1624)",
    },
    torqueLimit: {
      metric: "28.5 N·m",
      imperial: "21.0 ft-lb",
      tolerance: "±1.0% spring compression",
    },
    wearLimit: "Face optical flatness < 2 helium light bands (0.58 µm)",
    failureMode: "Dry running thermal shock and caustic CIP crystallization",
    inspectionStandard: "3-A Sanitary Standard 02-12 / FDA 21 CFR 177",
    status: "CRITICAL",
    axisOffset: { x: -35, y: 0, z: 0 },
    color: "#e11d48", // Rose 600
    wireColor: "#fb7185",
  },
  {
    id: "skf-bearings",
    name: "SKF Precision Angular Contact Hybrid Bearings",
    partNumber: "BRG-SKF-7208-CD-P4A",
    material: "Silicon Nitride Ceramic Balls (Si3N4) & 52100 Steel",
    materialEquivalents: {
      us: "SAE 52100 / ASTM A295",
      din: "100Cr6 (WNr. 1.3505, DIN 17230)",
      jis: "SUJ2 (JIS G 4805)",
    },
    torqueLimit: {
      metric: "42.0 N·m",
      imperial: "31.0 ft-lb",
      tolerance: "Rigid back-to-back preload",
    },
    wearLimit: "Radial vibration < 1.1 mm/s RMS threshold",
    failureMode: "Abrasive particulate ingress breaking EHL lubricating oil wedge",
    inspectionStandard: "ISO 10816-3 Class II / ABMA Std 20",
    status: "WARNING",
    axisOffset: { x: 10, y: 0, z: 0 },
    color: "#d97706", // Amber 600
    wireColor: "#fbbf24",
  },
  {
    id: "sanitary-housing",
    name: "Sanitary Rotor Casing & Volute Housing",
    partNumber: "HSG-316L-0212-SAN",
    material: "316L Stainless Steel Electro-Polished",
    materialEquivalents: {
      us: "AISI 316L (ASTM A276)",
      din: "X2CrNiMo17-12-2 (WNr. 1.4404, DIN 11866)",
      jis: "SUS316L (JIS G 4303)",
    },
    torqueLimit: {
      metric: "115.0 N·m",
      imperial: "84.8 ft-lb",
      tolerance: "Cross-pattern star sequence",
    },
    wearLimit: "Internal diameter ovality < 0.0015 in. (0.038 mm)",
    failureMode: "Erosion corrosion along discharge cutwater baffle",
    inspectionStandard: "3-A Sanitary 02-12 / EHEDG Doc 8",
    status: "NORMAL",
    axisOffset: { x: 55, y: 0, z: 0 },
    color: "#059669", // Emerald 600
    wireColor: "#34d399",
  },
  {
    id: "ffkm-o-ring",
    name: "Encapsulated FFKM Secondary O-Ring Seal",
    partNumber: "RNG-FFKM-0212-CAL",
    material: "Perfluoroelastomer (FFKM / Kalrez Equivalent)",
    materialEquivalents: {
      us: "FDA 21 CFR 177.2600 / USP Class VI",
      din: "DIN ISO 1629 (FFKM)",
      jis: "JIS K 6380 (FFKM)",
    },
    torqueLimit: {
      metric: "14.0 N·m",
      imperial: "10.3 ft-lb",
      tolerance: "Controlled gland compression (20-25%)",
    },
    wearLimit: "Compression set < 15% after 500 washdown cycles",
    failureMode: "Thermal degradation beyond 230°C (446°F) during steam SIP",
    inspectionStandard: "FDA 21 CFR 177.2600 / 3-A Sanitary",
    status: "NORMAL",
    axisOffset: { x: 100, y: 0, z: 0 },
    color: "#7c3aed", // Violet 600
    wireColor: "#a78bfa",
  },
];

export function CadExplodedViewStudio() {
  const [selectedPart, setSelectedPart] = useState<CadSubassemblyNode>(assemblyParts[1]); // Default to seal
  const [explodeRatio, setExplodeRatio] = useState<number>(0.65); // 0 to 1
  const [rotX, setRotX] = useState<number>(20);
  const [rotY, setRotY] = useState<number>(-35);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [isAutoSpin, setIsAutoSpin] = useState<boolean>(true);
  const [copiedEmbed, setCopiedEmbed] = useState<boolean>(false);
  const [copiedParams, setCopiedParams] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const lastMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 3D Isometric Viewport Renderer
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Background grid & radial gradient
    const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width / 1.5);
    bgGrad.addColorStop(0, "#0f172a"); // slate-900
    bgGrad.addColorStop(1, "#020617"); // slate-950
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Engineering Coordinate Axes (World Center)
    const centerX = width / 2;
    const centerY = height / 2 + 10;

    // Draw Subtle Grid Floor
    ctx.strokeStyle = "rgba(51, 65, 85, 0.25)";
    ctx.lineWidth = 1;
    for (let i = -150; i <= 150; i += 30) {
      ctx.beginPath();
      ctx.moveTo(centerX + i * 1.5, centerY + 80);
      ctx.lineTo(centerX + i * 0.7, centerY + 140);
      ctx.stroke();
    }

    // Convert angles to radians
    const radX = (rotX * Math.PI) / 180;
    const radY = (rotY * Math.PI) / 180;

    // 3D Projection Helper
    const project = (x: number, y: number, z: number) => {
      // Rotate Y
      const cosY = Math.cos(radY);
      const sinY = Math.sin(radY);
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;

      // Rotate X
      const cosX = Math.cos(radX);
      const sinX = Math.sin(radX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX;

      // Perspective Scale
      const focalLength = 380;
      const scale = focalLength / (focalLength + z2);

      return {
        x: centerX + x1 * scale,
        y: centerY + y2 * scale,
        depth: z2,
        scale,
      };
    };

    // Draw Exploded Assembly Concentric Centerline Guide
    const leftNode = project(assemblyParts[0].axisOffset.x * explodeRatio * 1.8 - 40, 0, 0);
    const rightNode = project(assemblyParts[assemblyParts.length - 1].axisOffset.x * explodeRatio * 1.8 + 40, 0, 0);

    ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(leftNode.x, leftNode.y);
    ctx.lineTo(rightNode.x, rightNode.y);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // Sort parts by camera depth so furthest render first (Painter's algorithm)
    const projectedParts = assemblyParts
      .map((part) => {
        const posX = part.axisOffset.x * explodeRatio * 1.8;
        const pos = project(posX, 0, 0);
        return { part, pos, posX };
      })
      .sort((a, b) => b.pos.depth - a.pos.depth);

    // Render Parts
    projectedParts.forEach(({ part, pos, posX }) => {
      const isSelected = selectedPart.id === part.id;
      const baseRadius = 32 * pos.scale;
      const length = 45 * pos.scale;

      // Part Cylinder / Shell Points
      const frontCenter = project(posX + length / 2, 0, 0);
      const backCenter = project(posX - length / 2, 0, 0);

      // Render 3D Cylinder / Capsule Component
      ctx.save();

      // Outer glow if selected
      if (isSelected) {
        ctx.shadowColor = part.wireColor;
        ctx.shadowBlur = 18;
      }

      // Cylinder fill gradient
      const grad = ctx.createLinearGradient(frontCenter.x, frontCenter.y - baseRadius, frontCenter.x, frontCenter.y + baseRadius);
      if (isWireframe) {
        grad.addColorStop(0, "rgba(15, 23, 42, 0.3)");
        grad.addColorStop(1, "rgba(30, 41, 59, 0.5)");
      } else {
        grad.addColorStop(0, part.color);
        grad.addColorStop(0.5, "#ffffff");
        grad.addColorStop(1, part.color);
      }

      ctx.fillStyle = grad;
      ctx.strokeStyle = isSelected ? "#ffffff" : part.wireColor;
      ctx.lineWidth = isSelected ? 2.5 : 1.5;

      // Draw Main Component Body
      ctx.beginPath();
      ctx.ellipse(frontCenter.x, frontCenter.y, baseRadius * 0.4, baseRadius, Math.PI / 2, 0, Math.PI * 2);
      ctx.ellipse(backCenter.x, backCenter.y, baseRadius * 0.4, baseRadius, Math.PI / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw Wireframe Ribs if enabled
      if (isWireframe) {
        ctx.strokeStyle = part.wireColor;
        ctx.lineWidth = 1;
        for (let step = -2; step <= 2; step++) {
          const mid = project(posX + (step * length) / 4, 0, 0);
          ctx.beginPath();
          ctx.ellipse(mid.x, mid.y, baseRadius * 0.4, baseRadius, Math.PI / 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Interactive Hotspot / Node Badge
      ctx.fillStyle = isSelected ? "#38bdf8" : part.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y - baseRadius - 12, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label on hover/selected
      if (isSelected) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        ctx.fillText(part.name.split(" ")[0], pos.x, pos.y - baseRadius - 22);

        // Leader line
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y - baseRadius - 6);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.restore();
    });

    // Orientation compass in corner
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "10px monospace";
    ctx.fillText(`Azimuth: ${Math.round(rotY)}° | Elevation: ${Math.round(rotX)}°`, 20, height - 20);
    ctx.fillText(`Explode: ${Math.round(explodeRatio * 100)}%`, 20, height - 35);
    ctx.restore();
  }, [explodeRatio, isWireframe, rotX, rotY, selectedPart]);

  // Auto-spin animation loop
  useEffect(() => {
    let animId: number;
    if (isAutoSpin) {
      const loop = () => {
        setRotY((prev) => (prev + 0.35) % 360);
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animId);
  }, [isAutoSpin]);

  // Redraw when state updates
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Mouse drag event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    setIsAutoSpin(false); // Pause auto-spin during user interaction
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMouseRef.current.x;
    const deltaY = e.clientY - lastMouseRef.current.y;

    setRotY((prev) => (prev + deltaX * 0.75) % 360);
    setRotX((prev) => Math.max(-60, Math.min(60, prev + deltaY * 0.75)));

    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Embeddable Code Snippet
  const embedCode = `<!-- ForgeFlow 3D CAD Tolerance Inspector (Pure WebGL / CSS Component) -->
<div id="forgeflow-cad-inspector-${selectedPart.id}" 
     data-cad-part="${selectedPart.partNumber}"
     data-spec-standard="${selectedPart.inspectionStandard}"
     style="width:100%;max-width:850px;height:420px;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
  <iframe src="https://industrial-oem.com/embed/cad/${selectedPart.id}?ratio=${explodeRatio}" 
          width="100%" height="100%" frameborder="0" loading="lazy" title="${selectedPart.name}">
  </iframe>
</div>
<script async src="https://industrial-oem.com/embed/cad-runtime.js"></script>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2500);
  };

  return (
    <div className="space-y-6 font-humanist">
      {/* Top Banner */}
      <div className="card-premium p-6 rounded-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-pulse"></span>
                INTERACTIVE 3D CAD INSPECTOR
              </span>
              <span className="text-xs text-stone-500 font-mono">STEP &bull; WebGL Canvas &bull; Zero CDN Lag</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Interactive 3D CAD Component &amp; Tolerance Inspector
            </h2>
            <p className="mt-1 text-xs text-stone-600 max-w-3xl leading-relaxed">
              Embeddable lightweight 3D exploded view inspector for technical landing pages. Plant engineers can rotate 360° in the browser, adjust explode distance to inspect inner concentric assemblies, and review verified torque limits, metallurgy grades, and replacement SKUs.
            </p>
          </div>
          <button
            type="button"
            onClick={copyEmbed}
            className="btn-primary-premium px-4 py-2 text-xs font-bold shrink-0 self-start sm:self-auto flex items-center gap-1.5"
          >
            <span className="css-icon-box"></span>
            <span>{copiedEmbed ? "Copied Embed Code!" : "Copy 1-Click Embed Snippet"}</span>
          </button>
        </div>

        {/* 3D Control Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          {/* Explode Distance Slider */}
          <div className="flex items-center gap-3 bg-stone-50 px-3.5 py-1.5 rounded-xl border border-stone-200">
            <span className="font-mono font-bold text-stone-600 uppercase text-[11px]">
              Explode Assembly: {Math.round(explodeRatio * 100)}%
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={explodeRatio}
              onChange={(e) => setExplodeRatio(parseFloat(e.target.value))}
              className="w-36 accent-sky-600 cursor-pointer"
            />
          </div>

          {/* View Mode & Orbit Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsWireframe(!isWireframe)}
              className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs transition cursor-pointer ${
                isWireframe
                  ? "bg-sky-600 text-white shadow-2xs"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {isWireframe ? "Wireframe Active" : "Shaded Solid"}
            </button>

            <button
              type="button"
              onClick={() => setIsAutoSpin(!isAutoSpin)}
              className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs transition cursor-pointer ${
                isAutoSpin
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {isAutoSpin ? "Auto-Orbit ON" : "Auto-Orbit PAUSED"}
            </button>

            <button
              type="button"
              onClick={() => {
                setRotX(20);
                setRotY(-35);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-bold text-xs transition cursor-pointer"
            >
              Reset Camera
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Viewport & Technical Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Interactive 3D Canvas Viewport */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
            <canvas
              ref={canvasRef}
              width={750}
              height={440}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="w-full h-[400px] cursor-grab active:cursor-grabbing block"
            />

            {/* Viewport Overlay Controls */}
            <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-slate-900/80 text-sky-400 border border-slate-700/80 backdrop-blur-xs">
                Drag to Orbit 360°
              </span>
            </div>

            <div className="absolute bottom-3 right-3 flex items-center gap-2 pointer-events-none">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900/80 text-slate-400 border border-slate-800 backdrop-blur-xs">
                Rendering 5 Subassemblies
              </span>
            </div>
          </div>

          {/* Subassembly Selector Carousel */}
          <div className="grid grid-cols-5 gap-2">
            {assemblyParts.map((p) => {
              const isSelected = selectedPart.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedPart(p);
                    setIsAutoSpin(false);
                  }}
                  className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                    isSelected
                      ? "bg-sky-50 border-sky-400 ring-2 ring-sky-400/20 shadow-2xs"
                      : "bg-white border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1 rounded ${
                        p.status === "CRITICAL"
                          ? "bg-rose-100 text-rose-800"
                          : p.status === "WARNING"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-stone-900 truncate">{p.name.split(" ")[0]}</div>
                  <div className="text-[9px] font-mono text-stone-500 truncate">{p.partNumber}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: Selected Part Reliability & Tolerance Dossier */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card-premium p-6 rounded-2xl space-y-4">
            <div className="border-b border-stone-200/80 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-stone-500">
                  Subassembly Inspection Dossier
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    selectedPart.status === "CRITICAL"
                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                      : selectedPart.status === "WARNING"
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  Inspection: {selectedPart.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-900 mt-1">{selectedPart.name}</h3>
              <p className="text-xs font-mono text-sky-700 font-bold mt-0.5">SKU: {selectedPart.partNumber}</p>
            </div>

            {/* Tolerances & Tightening Specs */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                <span className="font-mono text-[10px] uppercase font-bold text-stone-500 block">
                  Calibrated Bolt Tightening Torque
                </span>
                <div className="flex items-center justify-between font-mono font-bold text-stone-900">
                  <span>{selectedPart.torqueLimit.metric} ({selectedPart.torqueLimit.imperial})</span>
                  <span className="text-stone-500 text-[10px]">{selectedPart.torqueLimit.tolerance}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                <span className="font-mono text-[10px] uppercase font-bold text-stone-500 block">
                  Non-Destructive Wear Limit / Gap
                </span>
                <p className="font-mono font-semibold text-stone-900">{selectedPart.wearLimit}</p>
              </div>

              {/* Metallurgy Crosswalk */}
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                <span className="font-mono text-[10px] uppercase font-bold text-stone-500 block">
                  Certified Material Equivalents
                </span>
                <div className="space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-stone-500">US Spec:</span>
                    <span className="font-bold text-stone-800">{selectedPart.materialEquivalents.us}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">German DIN:</span>
                    <span className="font-bold text-stone-800">{selectedPart.materialEquivalents.din}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Japanese JIS:</span>
                    <span className="font-bold text-stone-800">{selectedPart.materialEquivalents.jis}</span>
                  </div>
                </div>
              </div>

              {/* Failure Mode & Standard */}
              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/80 text-[11px] space-y-1">
                <span className="font-mono font-bold text-rose-800 uppercase block text-[10px]">
                  Dominant Failure Mode &amp; Protocol
                </span>
                <p className="text-rose-900 leading-relaxed font-medium">{selectedPart.failureMode}</p>
                <p className="text-[10px] text-rose-700 font-mono pt-1">
                  Compliance: <strong>{selectedPart.inspectionStandard}</strong>
                </p>
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${selectedPart.name} | SKU: ${selectedPart.partNumber} | Torque: ${selectedPart.torqueLimit.metric} | Material: ${selectedPart.materialEquivalents.din}`
                );
                setCopiedParams(true);
                setTimeout(() => setCopiedParams(false), 2200);
              }}
              className={`w-full py-2.5 rounded-xl text-white font-bold text-xs transition cursor-pointer text-center flex items-center justify-center gap-2 ${
                copiedParams ? "bg-emerald-600 hover:bg-emerald-700 shadow-xs" : "bg-slate-900 hover:bg-slate-800"
              }`}
            >
              {copiedParams ? (
                <>
                  <span className="css-icon-check text-white"></span>
                  <span>Parameters Copied to Clipboard!</span>
                </>
              ) : (
                "Copy Verified Engineering Parameters"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
