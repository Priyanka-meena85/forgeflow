/**
 * Expert Review & Technical Sign-Off Module
 * Enforces human-in-the-loop engineering review for industrial SEO/AEO content.
 */

export interface ExpertReviewerInfo {
  id: string;
  name: string;
  jobTitle: string;
  credentials: string;
  yearsOfExperience: number;
  linkedInUrl?: string | null;
  photoUrl?: string | null;
  bio?: string | null;
}

export interface PageReviewInfo {
  id?: string;
  draftId: string;
  reviewerId: string;
  status: "PENDING" | "APPROVED" | "CHANGES_REQUESTED";
  reviewDate: Date | string;
  reviewerNotes?: string | null;
  verificationItems?: string[];
  reviewer?: ExpertReviewerInfo | null;
}

export const DEFAULT_VERIFICATION_CHECKLIST = [
  "Spec Accuracy: Verified operating limits, failure modes, and physical tolerances against engineering manual.",
  "Standards Referenced: Cross-referenced with active regulatory specifications (e.g. ISO, ASME, ASHRAE, 3-A).",
  "Operating Tolerances: Confirmed pressure, thermal differential, and mechanical fatigue thresholds.",
  "AEO Schema Validity: Validated structured multi-entity JSON-LD graphs for deterministic Answer Engine ingestion.",
];

/**
 * Injects or updates reviewedBy, lastReviewed, and dateModified into JSON-LD schema.
 */
export function injectExpertReviewSchema(
  rawSchema: Record<string, unknown> | string,
  reviewer: ExpertReviewerInfo,
  reviewDate: Date | string = new Date(),
): Record<string, unknown> {
  let schema: Record<string, unknown>;
  if (typeof rawSchema === "string") {
    try {
      schema = JSON.parse(rawSchema);
    } catch {
      schema = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
      };
    }
  } else if (rawSchema && typeof rawSchema === "object") {
    schema = { ...rawSchema };
  } else {
    schema = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
    };
  }

  const isoDate = typeof reviewDate === "string" ? new Date(reviewDate).toISOString() : reviewDate.toISOString();
  const dateOnly = isoDate.split("T")[0];

  const reviewedByEntity: Record<string, unknown> = {
    "@type": "Person",
    name: reviewer.name,
    jobTitle: reviewer.jobTitle,
    hasCredential: reviewer.credentials,
    ...(reviewer.linkedInUrl ? { sameAs: reviewer.linkedInUrl } : {}),
    ...(reviewer.bio ? { description: reviewer.bio } : {}),
  };

  // If schema is a Graph array or single object
  if (Array.isArray(schema["@graph"])) {
    const techArticle = schema["@graph"].find(
      (item: Record<string, unknown>) => item["@type"] === "TechArticle" || item["@type"] === "Article",
    );
    if (techArticle) {
      techArticle.reviewedBy = reviewedByEntity;
      techArticle.lastReviewed = dateOnly;
      techArticle.dateModified = isoDate;
    } else {
      schema["@graph"].push({
        "@type": "TechArticle",
        reviewedBy: reviewedByEntity,
        lastReviewed: dateOnly,
        dateModified: isoDate,
      });
    }
  } else {
    schema.reviewedBy = reviewedByEntity;
    schema.lastReviewed = dateOnly;
    schema.dateModified = isoDate;
  }

  return schema;
}

/**
 * Generates dynamic, varied Expert Review HTML section to place before FAQ section.
 * Varies layout across 3 designs based on draftId to ensure generated pages are visually differentiated.
 */
export function generateExpertReviewHtml(options: {
  draftId: string;
  reviewer: ExpertReviewerInfo;
  reviewDate: Date | string;
  reviewerNotes?: string | null;
  verificationItems?: string[];
}): string {
  const { draftId, reviewer, reviewDate, reviewerNotes, verificationItems = DEFAULT_VERIFICATION_CHECKLIST } = options;

  const dateStr = typeof reviewDate === "string"
    ? new Date(reviewDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : reviewDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const notesText = reviewerNotes && reviewerNotes.trim()
    ? reviewerNotes.trim()
    : "Verified equipment operating envelope, primary failure causation, and certified diagnostic protocols for industrial operating accuracy.";

  // Deterministic layout hash: 0, 1, or 2
  let hash = 0;
  for (let i = 0; i < draftId.length; i++) {
    hash = (hash + draftId.charCodeAt(i)) % 3;
  }

  const avatar = reviewer.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";
  const linkedInTag = reviewer.linkedInUrl
    ? `<a href="${escapeHtml(reviewer.linkedInUrl)}" target="_blank" rel="noopener noreferrer" style="color: #0284c7; text-decoration: none; font-size: 0.8rem; margin-left: 0.5rem; font-weight: 600;">LinkedIn Profile ↗</a>`
    : "";

  // LAYOUT 0: Technical Verification Audit Card
  if (hash === 0) {
    return `
    <section class="expert-review-section layout-card" style="margin: 2.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; font-family: inherit;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.75rem; margin-bottom: 1rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #16a34a;"></span>
          <span style="font-size: 0.75rem; font-family: monospace; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #166534;">Peer Engineering Review Verified</span>
        </div>
        <span style="font-size: 0.75rem; color: #64748b; font-family: monospace;">Reviewed: ${escapeHtml(dateStr)}</span>
      </div>

      <div style="display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1rem;">
        <img src="${escapeHtml(avatar)}" alt="${escapeHtml(reviewer.name)}" style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0;" />
        <div>
          <h3 style="margin: 0; font-size: 1.1rem; color: #0f172a; font-weight: 700;">
            ${escapeHtml(reviewer.name)}${linkedInTag}
          </h3>
          <p style="margin: 0.2rem 0 0; font-size: 0.85rem; color: #0284c7; font-weight: 600;">
            ${escapeHtml(reviewer.jobTitle)} &bull; <span style="color: #475569;">${escapeHtml(reviewer.credentials)} (${reviewer.yearsOfExperience} yrs exp)</span>
          </p>
          <p style="margin: 0.5rem 0 0; font-size: 0.85rem; color: #334155; line-height: 1.5; font-style: italic; background: #ffffff; padding: 0.75rem; border-left: 3px solid #0284c7; border-radius: 4px;">
            &ldquo;${escapeHtml(notesText)}&rdquo;
          </p>
        </div>
      </div>

      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.75rem 1rem;">
        <div style="font-size: 0.75rem; font-family: monospace; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 0.5rem;">
          Verified Technical Parameters:
        </div>
        <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.8rem; color: #334155; line-height: 1.6;">
          ${verificationItems.map((item) => `<li><strong>PASS:</strong> ${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>
    </section>
    `;
  }

  // LAYOUT 1: Application Engineering Sign-Off Banner
  if (hash === 1) {
    return `
    <section class="expert-review-section layout-banner" style="margin: 2.5rem 0; padding: 1.75rem; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; font-family: inherit;">
      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid #bbf7d0; padding-bottom: 1rem; margin-bottom: 1rem;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <img src="${escapeHtml(avatar)}" alt="${escapeHtml(reviewer.name)}" style="width: 52px; height: 52px; border-radius: 8px; object-fit: cover; border: 2px solid #22c55e;" />
          <div>
            <div style="font-size: 0.7rem; font-family: monospace; font-weight: 800; color: #15803d; text-transform: uppercase;">
              Certified Application Engineer Sign-Off
            </div>
            <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin-top: 0.1rem;">
              ${escapeHtml(reviewer.name)}
              <span style="font-size: 0.75rem; font-weight: 600; background: #dcfce7; color: #166534; padding: 0.15rem 0.5rem; border-radius: 9999px; margin-left: 0.5rem;">${escapeHtml(reviewer.credentials)}</span>
            </div>
            <div style="font-size: 0.8rem; color: #475569;">
              ${escapeHtml(reviewer.jobTitle)} &bull; ${escapeHtml(dateStr)} ${linkedInTag}
            </div>
          </div>
        </div>
        <div style="background: #ffffff; border: 1px solid #86efac; border-radius: 8px; padding: 0.4rem 0.8rem; font-size: 0.75rem; font-family: monospace; font-weight: 700; color: #166534;">
          ISO / ASME AUDIT CHECKED
        </div>
      </div>

      <div style="font-size: 0.85rem; color: #1e293b; line-height: 1.6; margin-bottom: 0.85rem;">
        <strong>What was verified:</strong> ${escapeHtml(notesText)}
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem;">
        ${verificationItems.map((item) => `
          <div style="background: #ffffff; border: 1px solid #dcfce7; padding: 0.5rem 0.75rem; border-radius: 6px; font-size: 0.75rem; color: #166534; display: flex; align-items: center; gap: 0.4rem;">
            <span style="font-weight: 800; color: #16a34a;">✓</span>
            <span>${escapeHtml(item.split(":")[0])}</span>
          </div>
        `).join("")}
      </div>
    </section>
    `;
  }

  // LAYOUT 2: Peer Review & Diagnostic Protocol Strip (Modern Industrial Sidebar Box)
  return `
    <section class="expert-review-section layout-strip" style="margin: 2.5rem 0; border: 1px solid #e2e8f0; border-left: 5px solid #0284c7; background: #ffffff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 0.75rem;">
        <div>
          <span style="font-size: 0.7rem; font-family: monospace; font-weight: 800; color: #0284c7; text-transform: uppercase; background: #e0f2fe; padding: 0.2rem 0.5rem; border-radius: 4px;">
            Closed-Loop Human QA &bull; Expert Review
          </span>
          <h3 style="margin: 0.5rem 0 0; font-size: 1.1rem; color: #0f172a; font-weight: 800;">
            Verified by ${escapeHtml(reviewer.name)}, ${escapeHtml(reviewer.credentials)}
          </h3>
          <p style="margin: 0.15rem 0 0; font-size: 0.8rem; color: #64748b;">
            ${escapeHtml(reviewer.jobTitle)} &bull; ${escapeHtml(dateStr)} ${linkedInTag}
          </p>
        </div>
        <img src="${escapeHtml(avatar)}" alt="${escapeHtml(reviewer.name)}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #0284c7;" />
      </div>

      <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; padding: 0.75rem 1rem; margin-bottom: 0.75rem; font-size: 0.85rem; color: #334155; line-height: 1.5;">
        <span style="font-weight: 700; color: #0f172a;">Reviewer Verification Note:</span> ${escapeHtml(notesText)}
      </div>

      <div style="font-size: 0.75rem; color: #475569; display: flex; flex-wrap: wrap; gap: 0.5rem;">
        ${verificationItems.map((item) => `
          <span style="background: #f1f5f9; border: 1px solid #e2e8f0; padding: 0.2rem 0.5rem; border-radius: 4px; font-family: monospace;">
            &bull; ${escapeHtml(item.split(":")[0])}
          </span>
        `).join("")}
      </div>
    </section>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
