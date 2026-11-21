export interface ClaimGuardrailRule {
  id: string;
  category: "FORBIDDEN_COMPETITOR" | "UNVERIFIED_CERTIFICATION" | "ABSOLUTE_ENGINEERING_CLAIM";
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

export const DEFAULT_GUARDRAIL_RULES: ClaimGuardrailRule[] = [
  {
    id: "g1",
    category: "ABSOLUTE_ENGINEERING_CLAIM",
    pattern: "100% leak-proof|zero maintenance forever|never fails|indestructible",
    remedyAction: "BLOCK_PUBLISHING",
    explanation: "Absolute engineering claims expose OEM to product liability lawsuits. Use qualified ISO 5208 Rate A leakage tolerance terminology.",
  },
  {
    id: "g2",
    category: "FORBIDDEN_COMPETITOR",
    pattern: "Parker Hannifin|Bosch Rexroth|SMC Corporation|Danfoss",
    remedyAction: "WARN_AND_REVISE",
    explanation: "Explicit competitor brand naming without benchmark disclaimer risks trademark dispute. Use generic OEM equivalence notation.",
  },
  {
    id: "g3",
    category: "UNVERIFIED_CERTIFICATION",
    pattern: "AS9100 certified|ITAR compliant facility|FDA class III approved",
    remedyAction: "BLOCK_PUBLISHING",
    explanation: "Restricted aerospace/defense/medical certifications cannot be published without verifiable certificate on file.",
  },
];

export function validateDraftAgainstGuardrails(
  content: string,
  rules: ClaimGuardrailRule[] = DEFAULT_GUARDRAIL_RULES
): {
  isPublishable: boolean;
  violations: GuardrailViolation[];
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
  };
}
