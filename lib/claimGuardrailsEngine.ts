export interface ClaimGuardrailRule {
  id: string;
  category:
    | "FORBIDDEN_COMPETITOR"
    | "UNVERIFIED_CERTIFICATION"
    | "ABSOLUTE_ENGINEERING_CLAIM"
    | "UNQUALIFIED_TOLERANCE_OR_PRESSURE";
  pattern: string;
  remedyAction: "BLOCK_PUBLISHING" | "WARN_AND_REVISE";
  explanation: string;
}

export interface GuardrailViolation {
  ruleId: string;
  matchedText: string;
  category: ClaimGuardrailRule["category"];
  explanation: string;
  severity: "CRITICAL_BLOCKER" | "EDITORIAL_WARNING";
}

export const MANDATORY_ENGINEERING_DISCLAIMER =
  "Notice: Industrial operating specifications, pressure ratings, and dimensional tolerances are nominal design guidelines adhering to DIN/ISO/ASME benchmarks. Actual operating conditions must be verified by a certified mechanical/chemical engineer before deployment.";

export const DEFAULT_GUARDRAIL_RULES: ClaimGuardrailRule[] = [
  {
    id: "g1",
    category: "ABSOLUTE_ENGINEERING_CLAIM",
    pattern: "100% leak-proof|zero maintenance forever|never fails|indestructible|guaranteed zero downtime",
    remedyAction: "BLOCK_PUBLISHING",
    explanation:
      "Absolute engineering claims expose OEM to direct product liability lawsuits. Use qualified ISO 5208 Rate A leakage tolerance terminology.",
  },
  {
    id: "g2",
    category: "FORBIDDEN_COMPETITOR",
    pattern: "Parker Hannifin|Bosch Rexroth|SMC Corporation|Danfoss|Eaton Vickers",
    remedyAction: "WARN_AND_REVISE",
    explanation:
      "Explicit competitor brand naming without benchmark disclaimer risks trademark dispute. Use generic OEM cross-reference notation.",
  },
  {
    id: "g3",
    category: "UNVERIFIED_CERTIFICATION",
    pattern: "AS9100 certified|ITAR compliant facility|FDA class III approved|ATEX Zone 0 explosion-proof",
    remedyAction: "BLOCK_PUBLISHING",
    explanation:
      "Restricted aerospace, defense, or explosive hazard certifications cannot be published without a verified compliance document on file.",
  },
  {
    id: "g4",
    category: "UNQUALIFIED_TOLERANCE_OR_PRESSURE",
    pattern: "tolerance guaranteed without variance|infinite pressure rating|zero thermal expansion",
    remedyAction: "BLOCK_PUBLISHING",
    explanation:
      "Physical impossibility claims violate engineering standards (ASME Y14.5 / ISO 2768-m). Specify qualified tolerance bands.",
  },
];

export function validateDraftAgainstGuardrails(
  content: string,
  rules: ClaimGuardrailRule[] = DEFAULT_GUARDRAIL_RULES
): {
  isPublishable: boolean;
  violations: GuardrailViolation[];
  suggestedDisclaimer: string;
} {
  const violations: GuardrailViolation[] = [];

  for (const rule of rules) {
    const regex = new RegExp(`\\b(${rule.pattern})\\b`, "gi");
    const matches = content.match(regex);

    if (matches && matches.length > 0) {
      violations.push({
        ruleId: rule.id,
        matchedText: matches.join(", "),
        category: rule.category,
        explanation: rule.explanation,
        severity: rule.remedyAction === "BLOCK_PUBLISHING" ? "CRITICAL_BLOCKER" : "EDITORIAL_WARNING",
      });
    }
  }

  const hasBlockers = violations.some((v) => v.severity === "CRITICAL_BLOCKER");

  return {
    isPublishable: !hasBlockers,
    violations,
    suggestedDisclaimer: MANDATORY_ENGINEERING_DISCLAIMER,
  };
}
