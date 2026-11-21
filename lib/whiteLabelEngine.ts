// lib/whiteLabelEngine.ts
// White-label config per workspace — agencies resell under their own brand with cloud persistence

import { loadCloudCollection, saveCloudCollection } from "@/lib/cloudPersistence";

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

const configs = new Map<string, WhiteLabelConfig>();
configs.set("org_demo", DEFAULT_CONFIG);

// Hydrate cloud persistence asynchronously
loadCloudCollection<WhiteLabelConfig>("white-label", [DEFAULT_CONFIG])
  .then((list) => {
    for (const item of list) {
      configs.set(item.orgId, item);
    }
  })
  .catch(() => {});

export function getWhiteLabelConfig(orgId: string): WhiteLabelConfig | null {
  return configs.get(orgId) ?? null;
}

export function saveWhiteLabelConfig(config: WhiteLabelConfig): WhiteLabelConfig {
  config.updatedAt = new Date().toISOString();
  configs.set(config.orgId, config);
  saveCloudCollection("white-label", Array.from(configs.values())).catch(() => {});
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
