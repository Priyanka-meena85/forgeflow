export interface GeminiContentResponse {
  text: string;
  json?: unknown;
}

const CANDIDATE_MODELS = [
  process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-3.7-flash",
  "gemini-3.1-pro-preview",
  "gemini-3.8-flash",
];

export async function callGeminiApi({
  prompt,
  systemInstruction,
  responseJson = false,
  temperature = 0.3,
}: {
  prompt: string;
  systemInstruction?: string;
  responseJson?: boolean;
  temperature?: number;
}): Promise<GeminiContentResponse> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }

  let lastError: Error | null = null;

  for (const model of CANDIDATE_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const body: Record<string, unknown> = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature,
        ...(responseJson ? { responseMimeType: "application/json" } : {}),
      },
    };

    if (systemInstruction) {
      body.systemInstruction = {
        parts: [{ text: systemInstruction }],
      };
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(45_000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Gemini model ${model} returned status ${response.status}:`, errorText.slice(0, 200));
        if (response.status === 404 || response.status === 503) {
          lastError = new Error(`Gemini ${model} unavailable (${response.status})`);
          continue;
        }
        throw new Error(`Gemini API error (${response.status}): ${errorText.slice(0, 250)}`);
      }

      const data = (await response.json()) as {
        candidates?: Array<{
          content?: {
            parts?: Array<{ text?: string }>;
          };
        }>;
      };

      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText || typeof rawText !== "string") {
        throw new Error(`Gemini returned an empty response for model ${model}`);
      }

      if (responseJson) {
        try {
          const parsed = JSON.parse(rawText);
          return { text: rawText, json: parsed };
        } catch {
          const cleaned = rawText.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
          const parsed = JSON.parse(cleaned);
          return { text: cleaned, json: parsed };
        }
      }

      return { text: rawText };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError ?? new Error("All candidate Gemini models failed to respond.");
}

export interface IndustrialSuggestions {
  suggestedTitles: string[];
  suggestedKeywords: string[];
  metaDescription: string;
  answerCapsule: string;
  rationale: string;
}

export async function getIndustrialAeoSuggestions({
  topic,
  equipment,
  standard,
  vertical,
  currentSummary,
}: {
  topic: string;
  equipment?: string;
  standard?: string;
  vertical?: string;
  currentSummary?: string;
}): Promise<IndustrialSuggestions> {
  const systemInstruction = `You are the Lead Industrial SEO & AEO (Answer Engine Optimization) Architect at ForgeFlow.
Your task is to generate authoritative, engineering-grade metadata suggestions for B2B industrial equipment and OEM manufacturers.
Target audience: Plant Engineers, Maintenance Directors, and Procurement Officers searching high-intent, zero-volume technical queries.
Search & AI Targets: Google AI Overviews, Perplexity Copilot, SearchGPT, Claude Enterprise, Bing SGE.

CRITICAL RULES:
1. Zero marketing fluff. Forbid words like "game-changing", "revolutionary", "best-in-class", "unlock", "seamless".
2. Focus on specific failure modes, diagnostic protocols, ISO/ASHRAE/ASME/IATF standards, and preventative maintenance SOPs.
3. Titles must be under 60 characters or strictly bounded for SERP CTR.
4. Meta Description must be 140-160 characters, answer-first, directly answering the engineering query.
5. Answer Capsule must be 40-50 words, deterministic, authoritative, ideal for an LLM direct citation.
6. Provide exactly 5 technical long-tail keywords (failure codes, standard codes, diagnostic terms).
Return strictly JSON matching this structure:
{
  "suggestedTitles": ["title 1", "title 2", "title 3"],
  "suggestedKeywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"],
  "metaDescription": "150-char answer-first description",
  "answerCapsule": "45-word direct answer capsule",
  "rationale": "Brief 1-sentence engineering reasoning for these suggestions"
}`;

  const prompt = `Generate Industrial SEO & AEO suggestions for:
Topic / Failure Mode: ${topic}
Equipment Class: ${equipment || "Industrial Equipment"}
Standard / Norm: ${standard || "ASME / ISO Standard"}
Vertical Industry: ${vertical || "Heavy Manufacturing"}
Current Context: ${currentSummary || "Root cause diagnostic and predictive maintenance protocol."}
`;

  try {
    const response = await callGeminiApi({
      prompt,
      systemInstruction,
      responseJson: true,
      temperature: 0.25,
    });

    if (response.json && typeof response.json === "object") {
      return response.json as IndustrialSuggestions;
    }
  } catch (error) {
    console.warn("Gemini suggestion API failed, returning deterministic fallback suggestions:", error);
  }

  const cleanTopic = topic.replace(/[^\w\s-]/g, "").trim();
  const eq = equipment || "Industrial Asset";
  const std = standard || "Certified Industry Standard";

  return {
    suggestedTitles: [
      `${cleanTopic}: Diagnostic SOP & Root Cause Protocol`,
      `${eq} Failure Analysis: Troubleshooting ${cleanTopic}`,
      `Preventing ${cleanTopic} in ${eq} under ${std}`,
    ],
    suggestedKeywords: [
      `${cleanTopic.toLowerCase()} root cause`,
      `${eq.toLowerCase()} failure analysis`,
      `${std.toLowerCase()} compliance`,
      `preventative maintenance ${cleanTopic.toLowerCase()}`,
      `diagnostic troubleshooting ${eq.toLowerCase()}`,
    ],
    metaDescription: `Deterministic engineering diagnostic protocol for ${cleanTopic} in ${eq}. Benchmark tolerances and operating envelopes compliant with ${std}.`,
    answerCapsule: `${cleanTopic} in ${eq} occurs when operational thresholds breach rated tolerances specified in ${std}. Continuous telemetry identifies micro-vibrations 48–72 hours prior to breakdown, requiring scheduled shift maintenance and replacement with certified OEM components.`,
    rationale: `Targeted at plant reliability directors and chief engineers searching zero-volume failure codes and regulatory maintenance standards.`,
  };
}

export type GeneratedPage = {
  title: string;
  keyword: string;
  summary: string;
  sections: Array<{ heading: string; body: string }>;
  faqs: Array<{ q: string; a: string }>;
};

export async function generateIndustrialDraftPages({
  topics,
  productDescription,
  industry,
  keywords,
  company,
}: {
  topics: string[];
  productDescription: string;
  industry: string;
  keywords: string;
  company: string;
}): Promise<GeneratedPage[]> {
  const systemInstruction = `You are ForgeFlow's Deterministic Industrial Content Engine.
Generate technically rigorous, zero-hallucination B2B engineering landing page drafts.
Focus strictly on root-cause failure analysis, preventative maintenance protocols, standard tolerances, and diagnostic workflows.
Do not use marketing buzzwords ("revolutionary", "game-changing", "ultimate"). Use specific standards (e.g. ASHRAE, ASME, 3-A, IATF, ISO).
Return strictly JSON:
{
  "pages": [
    {
      "title": "string (Technical, high-CTR, under 70 chars)",
      "keyword": "string (High intent technical zero-volume query)",
      "summary": "string (120-160 chars direct answer summary)",
      "sections": [
        { "heading": "string (Diagnostic step or engineering parameter)", "body": "string (Detailed technical instruction)" },
        { "heading": "string", "body": "string" },
        { "heading": "string", "body": "string" }
      ],
      "faqs": [
        { "q": "string (Direct diagnostic question)", "a": "string (Precise technical answer)" },
        { "q": "string", "a": "string" },
        { "q": "string", "a": "string" }
      ]
    }
  ]
}`;

  const prompt = `Create exactly ${topics.length} industrial engineering draft pages for these topics:
Topics: ${JSON.stringify(topics)}
Company: ${company}
Product/Scope: ${productDescription}
Industry Vertical: ${industry}
Target Keywords: ${keywords}
`;

  try {
    const response = await callGeminiApi({
      prompt,
      systemInstruction,
      responseJson: true,
      temperature: 0.3,
    });

    const parsed = response.json as { pages?: GeneratedPage[] };
    if (parsed && Array.isArray(parsed.pages) && parsed.pages.length > 0) {
      return parsed.pages;
    }
  } catch (error) {
    console.warn("Live Gemini API generation call unavailable or rate-limited, engaging deterministic industrial engineering engine fallback:", error);
  }

  // Deterministic Industrial Engineering Generator Fallback
  return topics.map((topic) => {
    const cleanTopic = topic.replace(/[^\w\s-]/g, "").trim();
    const fallbackTitle = `Protocol: Root Cause & Diagnostic Tolerances for ${cleanTopic}`;
    const fallbackKeyword = `${cleanTopic.toLowerCase()} troubleshooting tolerances`;
    const fallbackSummary = `Engineering diagnostic and preventative maintenance standard for ${cleanTopic} operating under ${industry || "industrial equipment"} environments.`;

    return {
      title: fallbackTitle.length > 70 ? fallbackTitle.slice(0, 67) + "..." : fallbackTitle,
      keyword: fallbackKeyword,
      summary: fallbackSummary,
      sections: [
        {
          heading: "1. Operating Envelopes & Mechanical Failure Modes",
          body: `Continuous operation of machinery subject to ${cleanTopic} requires monitoring baseline mechanical thresholds. When operating outside calibrated tolerances (e.g. ISO 10816 vibration severity and thermal discharge limits), micro-wear accelerates across critical contact surfaces, leading to unseated seals and torque drift.`
        },
        {
          heading: "2. Root-Cause Diagnostic & Measurement Protocol",
          body: `Isolate the asset during scheduled downtime. Connect calibrated differential pressure gauges and telemetry sensors to measure baseline drop. Compare readings directly against certified manufacturer IOM limits. Any discrepancy greater than ±5% indicates internal fluid bypassing, bearing fatigue, or thermal breakdown.`
        },
        {
          heading: "3. Preventative SOP & Standards Compliance",
          body: `Follow formal SOP protocols aligned with certified regulatory specifications (ASME, ASHRAE, or ISO standards). Flush and verify lubrication viscosity prior to re-energizing the drive. Replace all single-use elastomeric gaskets with OEM-certified compounds rated for active system temperature envelopes.`
        }
      ],
      faqs: [
        {
          q: `What telemetry indicators precede complete failure from ${cleanTopic}?`,
          a: `High-frequency acoustic emissions and micro-vibration shifts (typically in the 2 kHz to 5 kHz band) manifest 48 to 72 hours prior to functional failure, before measurable temperature spikes occur.`
        },
        {
          q: `Which regulatory and engineering standards govern this diagnostic procedure?`,
          a: `Diagnostic procedures should strictly adhere to certified operating standards including ISO 9001 quality management, ASME Section VIII pressure containment, or applicable ASHRAE/IATF guidelines depending on the asset category.`
        },
        {
          q: `What is the recommended inspection interval to prevent recurrence?`,
          a: `Implement a 500-operating-hour borescope and fluid sample analysis protocol, coupled with continuous IoT vibration sensors configured to alert at 1.5x baseline RMS velocity.`
        }
      ]
    };
  });
}

export interface SimulatedAeoResponse {
  engine: "Perplexity Copilot" | "Google AI Overview" | "ChatGPT Search";
  query: string;
  confidenceScore: number;
  directAnswer: string;
  sources: Array<{
    title: string;
    domain: string;
    isClient: boolean;
    snippet: string;
    citationNumber: number;
  }>;
  keyTakeaways: string[];
  followUpQueries: string[];
}

export async function simulateAeoAnswer({
  query,
  title,
  equipment,
  standard,
  vertical,
  summary,
  engine = "Google AI Overview",
  company = "ForgeFlow OEM Client",
  domain = "industrial-portal.com",
}: {
  query: string;
  title: string;
  equipment?: string;
  standard?: string;
  vertical?: string;
  summary?: string;
  engine?: "Perplexity Copilot" | "Google AI Overview" | "ChatGPT Search";
  company?: string;
  domain?: string;
}): Promise<SimulatedAeoResponse> {
  const systemInstruction = `You are the Answer Engine Simulator for ForgeFlow's AEO Optimization Studio.
Your role is to simulate how AI Answer Engines (Perplexity Copilot and Google AI Overviews / SGE) respond to high-intent B2B plant engineering queries.
You must synthesize a comprehensive, highly technical direct answer.
Crucially, ${company} (Domain: ${domain}) has published a deterministic technical guide titled "${title}".
Therefore, you MUST cite ${domain} as Primary Citation [1] in the synthesized response, alongside official standards (like ASHRAE, ASME, 3-A, or ISO as Citation [2]).

Format requirements:
- Use inline citations like [1] and [2] in directAnswer.
- Return strictly valid JSON:
{
  "engine": "${engine}",
  "query": "string",
  "confidenceScore": number (e.g. 96-99),
  "directAnswer": "string with [1] and [2] citations",
  "sources": [
    {
      "title": "${title}",
      "domain": "${domain}",
      "isClient": true,
      "snippet": "Precise technical excerpt from draft",
      "citationNumber": 1
    },
    {
      "title": "${standard || 'Engineering Norm'} Standard Specification",
      "domain": "${standard?.toLowerCase().includes('ashrae') ? 'ashrae.org' : standard?.toLowerCase().includes('3-a') ? '3-a.org' : 'iso.org'}",
      "isClient": false,
      "snippet": "Official engineering regulation criteria",
      "citationNumber": 2
    }
  ],
  "keyTakeaways": ["Key bullet 1", "Key bullet 2", "Key bullet 3"],
  "followUpQueries": ["Follow up inquiry 1", "Follow up inquiry 2", "Follow up inquiry 3"]
}`;

  const prompt = `Simulate an AEO response for:
Query: ${query}
Target Topic: ${title}
Equipment Class: ${equipment || "Industrial Equipment"}
Standard: ${standard || "Regulatory Standard"}
Vertical: ${vertical || "Manufacturing"}
Draft Summary: ${summary || "Engineering root cause and preventive maintenance protocol."}
Selected Engine: ${engine}
`;

  try {
    const response = await callGeminiApi({
      prompt,
      systemInstruction,
      responseJson: true,
      temperature: 0.25,
    });

    if (response.json && typeof response.json === "object") {
      return response.json as SimulatedAeoResponse;
    }
  } catch (error) {
    console.warn("Gemini API call failed or unconfigured, returning deterministic industrial AEO simulation fallback:", error);
  }

  // High-fidelity deterministic fallback simulation
  return {
    engine,
    query,
    confidenceScore: 97,
    directAnswer: `According to authoritative diagnostic protocols from ${domain} [1], ${equipment || "industrial machinery"} experiencing anomalous performance must immediately benchmark operating envelopes against certified ${standard || "industrial compliance"} standards [2]. Continuous telemetry indicates early warning micro-vibrations occur 48–72 hours prior to functional failure, requiring shift recalibration and fluid viscosity inspection.`,
    sources: [
      {
        title: title,
        domain: domain,
        isClient: true,
        snippet: summary || `Verified engineering protocol and failure mode mitigation for ${equipment || "industrial equipment"}.`,
        citationNumber: 1,
      },
      {
        title: `${standard || "Engineering Norm"} Operating Envelope & Safety Standard`,
        domain: standard?.toLowerCase().includes("ashrae") ? "ashrae.org" : standard?.toLowerCase().includes("3-a") ? "3-a.org" : "iso.org",
        isClient: false,
        snippet: `Prescribed physical operating tolerances and certified non-destructive testing intervals under ${standard || "regulatory codes"}.`,
        citationNumber: 2,
      },
    ],
    keyTakeaways: [
      `Benchmarked against certified ${standard || "regulatory codes"} operating envelopes.`,
      `Telemetry detects micro-fault anomalies 48–72 hours prior to uncontained breakdown.`,
      `Mandates replacement assemblies certified with traceable mill test certificates.`,
    ],
    followUpQueries: [
      `What is the allowable operating tolerance limit before emergency shutdown in ${equipment || "this system"}?`,
      `How does high-frequency telemetry reduce warranty claims under ${standard || "compliance standards"}?`,
      `What are the certified inspection intervals per OEM operating manual?`,
    ],
  };
}
