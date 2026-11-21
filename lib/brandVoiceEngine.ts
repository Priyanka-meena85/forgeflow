"use server";

import { loadCloudCollection, saveCloudCollection } from "@/lib/cloudPersistence";

export interface BrandVoiceProfile {
  id: string;
  orgId: string;
  name: string;
  toneAdjectives: string[];        // e.g. ["authoritative", "precise", "jargon-free"]
  forbiddenWords: string[];        // e.g. ["cheap", "simple", "easy"]
  preferredTerms: Record<string, string>; // e.g. { "pump": "rotary lobe pump" }
  personaInstructions: string;     // freeform prose fed to AI
  uploadedDocNames: string[];      // names of uploaded PDFs / DOCX
  vectorChunks: string[];          // extracted text chunks
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_PROFILES: BrandVoiceProfile[] = [
  {
    id: "bvp_default",
    orgId: "org_demo",
    name: "AccuDrive Industrial — Default Voice",
    toneAdjectives: ["authoritative", "precise", "data-driven", "concise"],
    forbiddenWords: ["cheap", "simple", "easy", "just", "obviously", "simply"],
    preferredTerms: {
      pump: "rotary lobe pump",
      machine: "CNC machining centre",
      iso: "ISO 9001:2015",
    },
    personaInstructions:
      "Write as a senior mechanical engineer with 20+ years in process industries. Never use marketing superlatives. Always cite the relevant IS / ISO / ASME standard. Prefer metric SI units with imperial in parentheses.",
    uploadedDocNames: ["AccuDrive_ProductSpec_2024.pdf", "ISO9001_CertificateScan.pdf"],
    vectorChunks: [
      "AccuDrive rotary lobe pumps comply with 3-A Sanitary Standard 02-12 and are CIP-validated for caustic concentrations up to 3% NaOH at 85°C.",
      "All machined components meet DIN 7168 fine tolerance class. Surface roughness Ra ≤ 0.8 µm per EN ISO 1302.",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let profileStore: BrandVoiceProfile[] = [...DEFAULT_PROFILES];

loadCloudCollection<BrandVoiceProfile>("brand-voice", DEFAULT_PROFILES)
  .then((data) => {
    if (data && data.length > 0) {
      profileStore = data;
    }
  })
  .catch(() => {});

export async function getBrandVoiceProfiles(orgId: string): Promise<BrandVoiceProfile[]> {
  return profileStore.filter((p) => p.orgId === orgId);
}

export async function getBrandVoiceProfile(id: string): Promise<BrandVoiceProfile | null> {
  return profileStore.find((p) => p.id === id) ?? null;
}

export async function saveBrandVoiceProfile(
  profile: Omit<BrandVoiceProfile, "id" | "createdAt" | "updatedAt">
): Promise<BrandVoiceProfile> {
  const existing = profileStore.find(
    (p) => p.orgId === profile.orgId && p.name === profile.name
  );
  if (existing) {
    Object.assign(existing, { ...profile, updatedAt: new Date().toISOString() });
    saveCloudCollection("brand-voice", profileStore).catch(() => {});
    return existing;
  }
  const newProfile: BrandVoiceProfile = {
    ...profile,
    id: `bvp_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  profileStore.push(newProfile);
  saveCloudCollection("brand-voice", profileStore).catch(() => {});
  return newProfile;
}

export async function deleteBrandVoiceProfile(id: string): Promise<boolean> {
  const idx = profileStore.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  profileStore.splice(idx, 1);
  saveCloudCollection("brand-voice", profileStore).catch(() => {});
  return true;
}

/** Naive keyword search across vector chunks */
export async function queryKnowledgeBase(
  profileId: string,
  query: string
): Promise<string[]> {
  const profile = await getBrandVoiceProfile(profileId);
  if (!profile) return [];
  const lowerQ = query.toLowerCase();
  return profile.vectorChunks.filter((chunk) =>
    chunk.toLowerCase().split(" ").some((word) => lowerQ.includes(word.substring(0, 6)))
  );
}

/** Check a draft text against brand voice rules — returns violations */
export interface BrandVoiceViolation {
  type: "forbidden_word" | "wrong_term" | "tone_mismatch";
  found: string;
  suggestion: string;
  position: number;
}

export function auditDraftAgainstBrandVoice(
  draft: string,
  profile: BrandVoiceProfile
): BrandVoiceViolation[] {
  const violations: BrandVoiceViolation[] = [];
  const lowerDraft = draft.toLowerCase();

  for (const word of profile.forbiddenWords) {
    let pos = lowerDraft.indexOf(word.toLowerCase());
    while (pos !== -1) {
      violations.push({
        type: "forbidden_word",
        found: word,
        suggestion: `Remove "${word}" — not aligned with technical, authoritative brand voice.`,
        position: pos,
      });
      pos = lowerDraft.indexOf(word.toLowerCase(), pos + 1);
    }
  }

  for (const [loose, preferred] of Object.entries(profile.preferredTerms)) {
    if (lowerDraft.includes(loose.toLowerCase()) && !lowerDraft.includes(preferred.toLowerCase())) {
      violations.push({
        type: "wrong_term",
        found: loose,
        suggestion: `Prefer "${preferred}" over "${loose}" per brand terminology guide.`,
        position: lowerDraft.indexOf(loose.toLowerCase()),
      });
    }
  }

  return violations;
}
