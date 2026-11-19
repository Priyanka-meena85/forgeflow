export interface DiagnosticWidget {
  id: string;
  name: string;
  vertical: string;
  description: string;
  standardsCited: string[];
  htmlEmbed: string;
}

/**
 * Returns pre-built interactive engineering diagnostic calculator widgets
 */
export function getAvailableWidgets(): DiagnosticWidget[] {
  return [
    {
      id: "widget_superheat_calculator",
      name: "Suction Superheat & Liquid Floodback Calculator",
      vertical: "Commercial HVAC & Industrial Refrigeration",
      description: "Computes saturated suction temperature, superheat differential, and alerts technicians to compressor liquid slugging risk in real-time.",
      standardsCited: ["ASHRAE 90.1", "AHRI 340/360", "EPA Section 608"],
      htmlEmbed: `
<div class="ff-calc-card bg-slate-900 text-white rounded-xl p-5 border border-slate-700 shadow-lg max-w-lg font-sans">
  <div class="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
    <div class="flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
      <h4 class="font-bold text-sm text-slate-100">Superheat Diagnostic Calculator</h4>
    </div>
    <span class="text-[10px] font-mono bg-sky-950 text-sky-400 border border-sky-800 px-2 py-0.5 rounded">ASHRAE 90.1</span>
  </div>
  <div class="grid grid-cols-2 gap-3 text-xs mb-4">
    <div>
      <label class="block text-slate-400 mb-1">Refrigerant</label>
      <select id="ff_refrig" class="w-full bg-slate-800 border border-slate-600 rounded px-2.5 py-1.5 text-white">
        <option value="R410A">R-410A (Commercial RTU)</option>
        <option value="R134a">R-134a (Chiller)</option>
        <option value="R404A">R-404A (Refrigeration)</option>
      </select>
    </div>
    <div>
      <label class="block text-slate-400 mb-1">Suction Press (psig)</label>
      <input type="number" id="ff_press" value="120" class="w-full bg-slate-800 border border-slate-600 rounded px-2.5 py-1.5 text-white font-mono" />
    </div>
    <div class="col-span-2">
      <label class="block text-slate-400 mb-1">Suction Line Temp (°F)</label>
      <input type="number" id="ff_temp" value="52" class="w-full bg-slate-800 border border-slate-600 rounded px-2.5 py-1.5 text-white font-mono" />
    </div>
  </div>
  <div class="bg-slate-950/80 rounded-lg p-3 border border-slate-800 mb-3 flex items-center justify-between">
    <div>
      <span class="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Calculated Superheat</span>
      <span id="ff_sh_result" class="text-xl font-bold font-mono text-emerald-400">11.4 °F</span>
    </div>
    <div class="text-right">
      <span class="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Compressor State</span>
      <span id="ff_sh_status" class="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">Optimal (10-14°F)</span>
    </div>
  </div>
  <p class="text-[11px] text-slate-400 leading-normal border-t border-slate-800/80 pt-2.5">
    Liquid floodback risk trigger: <strong>&lt; 6.0°F</strong> continuous. Overheating trigger: <strong>&gt; 20.0°F</strong>. Verified under OEM reliability parameters.
  </p>
</div>
      `.trim(),
    },
    {
      id: "widget_hydraulic_velocity",
      name: "Hydraulic Line Velocity & Cavitation Estimator",
      vertical: "Fluid Power & Mobile Equipment",
      description: "Calculates fluid velocity in feet per second (fps) against pump suction cavitation limits to ensure ISO 4406 fluid longevity.",
      standardsCited: ["ISO 4406", "NFPA/T2.24.1 R1", "SAE J517"],
      htmlEmbed: `
<div class="ff-calc-card bg-slate-900 text-white rounded-xl p-5 border border-slate-700 shadow-lg max-w-lg font-sans">
  <div class="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
    <div class="flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
      <h4 class="font-bold text-sm text-slate-100">Hydraulic Velocity & Cavitation Gate</h4>
    </div>
    <span class="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">ISO 4406</span>
  </div>
  <div class="grid grid-cols-2 gap-3 text-xs mb-4">
    <div>
      <label class="block text-slate-400 mb-1">Flow Rate (GPM)</label>
      <input type="number" id="ff_flow" value="25" class="w-full bg-slate-800 border border-slate-600 rounded px-2.5 py-1.5 text-white font-mono" />
    </div>
    <div>
      <label class="block text-slate-400 mb-1">Hose ID (inches)</label>
      <input type="number" step="0.125" id="ff_hose_id" value="0.75" class="w-full bg-slate-800 border border-slate-600 rounded px-2.5 py-1.5 text-white font-mono" />
    </div>
  </div>
  <div class="bg-slate-950/80 rounded-lg p-3 border border-slate-800 mb-3 flex items-center justify-between">
    <div>
      <span class="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Fluid Velocity</span>
      <span id="ff_vel_result" class="text-xl font-bold font-mono text-cyan-400">18.2 ft/sec</span>
    </div>
    <div class="text-right">
      <span class="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Line Application</span>
      <span id="ff_vel_status" class="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">Pressure Line Safe (&lt;20 fps)</span>
    </div>
  </div>
  <p class="text-[11px] text-slate-400 leading-normal border-t border-slate-800/80 pt-2.5">
    Max recommended suction velocity: <strong>4.0 ft/sec</strong>. Max pressure line: <strong>20.0 ft/sec</strong>.
  </p>
</div>
      `.trim(),
    },
    {
      id: "widget_stamping_tonnage",
      name: "Servo Stamping Die Clearance & Tonnage Calculator",
      vertical: "Automotive Stamping & Metal Forming",
      description: "Calculates die punch-to-die clearance percentage and minimum press tonnage required for high-strength steel (DP600/DP800).",
      standardsCited: ["IATF 16949", "AISE Tech Report 9", "DIN 9870"],
      htmlEmbed: `
<div class="ff-calc-card bg-slate-900 text-white rounded-xl p-5 border border-slate-700 shadow-lg max-w-lg font-sans">
  <div class="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
    <div class="flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
      <h4 class="font-bold text-sm text-slate-100">Die Clearance & Tonnage Calculator</h4>
    </div>
    <span class="text-[10px] font-mono bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded">IATF 16949</span>
  </div>
  <div class="grid grid-cols-3 gap-2.5 text-xs mb-4">
    <div>
      <label class="block text-slate-400 mb-1">Thickness (mm)</label>
      <input type="number" step="0.1" id="ff_thick" value="2.0" class="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-white font-mono" />
    </div>
    <div>
      <label class="block text-slate-400 mb-1">Perimeter (mm)</label>
      <input type="number" id="ff_perim" value="180" class="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-white font-mono" />
    </div>
    <div>
      <label class="block text-slate-400 mb-1">Tensile (MPa)</label>
      <input type="number" id="ff_tensile" value="600" class="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-white font-mono" />
    </div>
  </div>
  <div class="bg-slate-950/80 rounded-lg p-3 border border-slate-800 mb-3 grid grid-cols-2 gap-2">
    <div>
      <span class="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Die Clearance (8-10%)</span>
      <span class="text-base font-bold font-mono text-amber-400">0.18 mm / side</span>
    </div>
    <div class="text-right">
      <span class="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Min Press Tonnage</span>
      <span class="text-base font-bold font-mono text-emerald-400">27.5 Metric Tons</span>
    </div>
  </div>
  <p class="text-[11px] text-slate-400 leading-normal border-t border-slate-800/80 pt-2.5">
    Includes standard 20% shear factor + 25% press reserve to prevent reverse tonnage shock.
  </p>
</div>
      `.trim(),
    },
  ];
}

/**
 * Returns a matching widget for an industrial vertical or draft title
 */
export function getRecommendedWidgetForVertical(vertical?: string | null): DiagnosticWidget {
  const widgets = getAvailableWidgets();
  if (!vertical) return widgets[0];

  const vLower = vertical.toLowerCase();
  if (vLower.includes("hvac") || vLower.includes("refrigeration") || vLower.includes("cooling")) {
    return widgets[0];
  }
  if (vLower.includes("hydraulic") || vLower.includes("fluid") || vLower.includes("pump")) {
    return widgets[1];
  }
  if (vLower.includes("automotive") || vLower.includes("stamping") || vLower.includes("cnc") || vLower.includes("metal")) {
    return widgets[2];
  }

  return widgets[0];
}
