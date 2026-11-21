// lib/whiteLabelEngine.ts
// White-label config per workspace — agencies resell under their own brand with filesystem persistence

import fs from "fs";
import path from "path";

export interface WhiteLabelConfig {
  orgId: string;
  enabled: boolean;
  brandName: string;        // e.g. "ContentForge by TechAgency"
  logoUrl: string;          // hosted logo URL
  primaryColor: string;     // hex e.g. "#0F4C81"
  accentColor: string;      // hex
  customDomain: string;     // e.g. "seo.techagency.com"
  supportEmail: string;
  hideForgeflowBranding: boolean;
  customLoginHeadline: string;
  customFooterText: string;
  reportFooterLogo: string; // for PDF exports
  createdAt: string;
  updatedAt: string;
}

const STORAGE_FILE = path.join(process.cwd(), "data", "white-label.json");

const DEFAULT_CONFIG: WhiteLabelConfig = {
  orgId: "org_demo",
  enabled: false,
  brandName: "ForgeFlow Industrial SEO",
  logoUrl: "",
  primaryColor: "#4F46E5",
  accentColor: "#0EA5E9",
  customDomain: "",
  supportEmail: "support@forgeflow.io",
  hideForgeflowBranding: false,
  customLoginHeadline: "Industrial SEO & AEO Platform",
  customFooterText: "Powered by ForgeFlow",
  reportFooterLogo: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function loadStorage(): Map<string, WhiteLabelConfig> {
  const map = new Map<string, WhiteLabelConfig>();
  map.set("org_demo", DEFAULT_CONFIG);
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
      const list = JSON.parse(raw) as WhiteLabelConfig[];
      for (const item of list) {
        map.set(item.orgId, item);
      }
    }
  } catch (err) {
    console.warn("[WhiteLabel Engine] Storage read error; using memory fallback:", err);
  }
  return map;
}

function saveStorage(map: Map<string, WhiteLabelConfig>) {
  try {
    const list = Array.from(map.values());
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.warn("[WhiteLabel Engine] Storage write error:", err);
  }
}

const configs = loadStorage();

export function getWhiteLabelConfig(orgId: string): WhiteLabelConfig | null {
  return configs.get(orgId) ?? null;
}

export function saveWhiteLabelConfig(config: WhiteLabelConfig): WhiteLabelConfig {
  config.updatedAt = new Date().toISOString();
  configs.set(config.orgId, config);
  saveStorage(configs);
  return config;
}

/** Generate CSS variables for white-label theming */
export function generateThemeCss(config: WhiteLabelConfig): string {
  return `:root {
  --wl-primary: ${config.primaryColor};
  --wl-accent: ${config.accentColor};
  --wl-brand: "${config.brandName}";
}`;
}
