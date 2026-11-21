"use server";

export type SupportedLocale = "hi" | "gu" | "mr" | "pa" | "en-IN";

export interface LocaleConfig {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  region: string;
  targetMarket: string;
  bisIsCodeFocus: string[];
  schema_locale: string;
}

export const SUPPORTED_LOCALES: LocaleConfig[] = [
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    region: "Pan-India / Uttar Pradesh / Rajasthan / Delhi NCR",
    targetMarket: "Large OEM, tier-1 industrial buyers, PSU procurement",
    bisIsCodeFocus: ["IS 1239", "IS 7343", "IS 2825", "IS 1367"],
    schema_locale: "hi-IN",
  },
  {
    code: "gu",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    region: "Gujarat — Ahmedabad, Surat, Rajkot, Vadodara",
    targetMarket: "MSME chemical, pharma, textile machinery, diamond tool",
    bisIsCodeFocus: ["IS 3658", "IS 2062", "IS 1148", "IS 7318"],
    schema_locale: "gu-IN",
  },
  {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    region: "Maharashtra — Pune, Nashik, Aurangabad, Kolhapur",
    targetMarket: "Auto ancillary, forging, casting, agro-processing MSME",
    bisIsCodeFocus: ["IS 2062", "IS 1570", "IS 7343", "IS 2825"],
    schema_locale: "mr-IN",
  },
  {
    code: "pa",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    region: "Punjab — Ludhiana, Jalandhar, Amritsar",
    targetMarket: "Bicycle parts, hand tools, fasteners, agricultural machinery",
    bisIsCodeFocus: ["IS 1367", "IS 2102", "IS 1570"],
    schema_locale: "pa-IN",
  },
  {
    code: "en-IN",
    name: "Indian English",
    nativeName: "Indian English",
    region: "South India — Bangalore, Chennai, Hyderabad",
    targetMarket: "IT-driven manufacturing, aerospace, semiconductor packaging",
    bisIsCodeFocus: ["IS 7905", "IS 2825", "IS 2016"],
    schema_locale: "en-IN",
  },
];

export interface RegionalPageSpec {
  locale: SupportedLocale;
  sourceTitle: string;
  sourceKeyword: string;
  sourceContent: string;
  equipment: string;
  industry: string;
  bisCode?: string;
}

export interface RegionalPageOutput {
  locale: SupportedLocale;
  translatedTitle: string;
  slug: string;
  metaDescription: string;
  h1: string;
  intro: string;
  keyBenefits: string[];
  bisHighlight: string;
  faqEntries: Array<{ q: string; a: string }>;
  schemaMarkup: string;
  hreflangTag: string;
  wordCountEstimate: number;
}

/** Deterministic pseudo-translation for demo / scaffolding.
 *  Replace with real translation API (DeepL, Google Translate, or Sarvam AI) in prod.
 */
const PHRASE_MAP: Record<SupportedLocale, Record<string, string>> = {
  hi: {
    "CNC machining": "CNC मशीनिंग",
    pump: "पम्प",
    bearing: "बेयरिंग",
    valve: "वाल्व",
    compressor: "कम्प्रेसर",
    "rotary lobe": "रोटरी लोब",
    industrial: "औद्योगिक",
    "ISO certified": "ISO प्रमाणित",
    manufacturer: "निर्माता",
    supplier: "आपूर्तिकर्ता",
    "BIS certified": "BIS प्रमाणित",
    "made in India": "भारत में निर्मित",
  },
  gu: {
    "CNC machining": "CNC મશીનિંગ",
    pump: "પંપ",
    bearing: "બેરિંગ",
    valve: "વાલ્વ",
    compressor: "કોમ્પ્રેસર",
    industrial: "ઔદ્યોગિક",
    manufacturer: "ઉત્પાદક",
    supplier: "પુરવઠો",
    "BIS certified": "BIS પ્રમાણિત",
    "made in India": "ભારતમાં બનેલ",
  },
  mr: {
    "CNC machining": "CNC यंत्रण",
    pump: "पंप",
    bearing: "बेअरिंग",
    valve: "व्हॉल्व्ह",
    compressor: "कंप्रेसर",
    industrial: "औद्योगिक",
    manufacturer: "उत्पादक",
    supplier: "पुरवठादार",
    "BIS certified": "BIS प्रमाणित",
    "made in India": "भारतात बनवलेले",
  },
  pa: {
    "CNC machining": "CNC ਮਸ਼ੀਨਿੰਗ",
    pump: "ਪੰਪ",
    bearing: "ਬੇਅਰਿੰਗ",
    valve: "ਵਾਲਵ",
    industrial: "ਉਦਯੋਗਿਕ",
    manufacturer: "ਨਿਰਮਾਤਾ",
    supplier: "ਸਪਲਾਇਰ",
    "BIS certified": "BIS ਪ੍ਰਮਾਣਿਤ",
    "made in India": "ਭਾਰਤ ਵਿੱਚ ਬਣਾਇਆ",
  },
  "en-IN": {
    "ISO certified": "BIS / ISO certified",
    manufacturer: "Indian manufacturer",
    "made in India": "Made in India (PLI scheme)",
  },
};

function pseudoTranslate(text: string, locale: SupportedLocale): string {
  if (locale === "en-IN") return text; // keep English, just swap key phrases
  let result = text;
  const map = PHRASE_MAP[locale] ?? {};
  for (const [en, local] of Object.entries(map)) {
    result = result.replace(new RegExp(en, "gi"), local);
  }
  return result;
}

export function generateRegionalPage(spec: RegionalPageSpec): RegionalPageOutput {
  const localeConf = SUPPORTED_LOCALES.find((l) => l.code === spec.locale)!;
  const pt = (t: string) => pseudoTranslate(t, spec.locale);

  const translatedTitle = pt(spec.sourceTitle);
  const slugBase = spec.sourceTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const slug = `/${spec.locale}/${slugBase}`;

  const intro = pt(
    `${spec.equipment} ${spec.industry} solutions from BIS / ISO certified Indian manufacturers. ` +
      `Compliant with ${spec.bisCode ?? localeConf.bisIsCodeFocus[0]}. ` +
      `Get technical specs, pricing, and RFQ support in ${localeConf.nativeName}.`
  );

  const keyBenefits = [
    pt(`${spec.equipment} — ${spec.bisCode ?? localeConf.bisIsCodeFocus[0]} compliant`),
    pt(`Made in India — PLI scheme eligible`),
    pt(`ISO certified manufacturer, 24/7 technical support`),
    pt(`Bulk / OEM pricing available — Request RFQ`),
    pt(`Pan-India delivery + export to SE Asia`),
  ];

  const bisHighlight = pt(
    `All ${spec.equipment} units are verified against ${spec.bisCode ?? localeConf.bisIsCodeFocus[0]} ` +
      `by our in-house quality team. BIS certification mark available on request.`
  );

  const faqEntries = [
    {
      q: pt(`What is the price of ${spec.equipment} in India?`),
      a: pt(
        `Price varies by capacity and specifications. Contact us for a detailed RFQ. We offer special rates for OEM and bulk orders.`
      ),
    },
    {
      q: pt(`Is ${spec.equipment} BIS certified?`),
      a: pt(
        `Yes, our ${spec.equipment} complies with ${spec.bisCode ?? localeConf.bisIsCodeFocus[0]}. ` +
          `BIS licence number available on request.`
      ),
    },
    {
      q: pt(`Do you supply ${spec.equipment} to ${localeConf.region}?`),
      a: pt(
        `Yes, we supply pan-India including ${localeConf.region}. Delivery within 7–21 working days depending on specifications.`
      ),
    },
  ];

  const schemaMarkup = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: translatedTitle,
      description: intro,
      inLanguage: localeConf.schema_locale,
      brand: { "@type": "Brand", name: "AccuDrive Industrial" },
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        areaServed: { "@type": "Country", name: "India" },
      },
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "BIS Standard",
          value: spec.bisCode ?? localeConf.bisIsCodeFocus[0],
        },
      ],
    },
    null,
    2
  );

  const hreflangTag = `<link rel="alternate" hreflang="${localeConf.schema_locale}" href="https://accudrive.io${slug}" />`;

  return {
    locale: spec.locale,
    translatedTitle,
    slug,
    metaDescription: `${pt(spec.sourceKeyword)} | ${localeConf.nativeName} | BIS / ISO certified | AccuDrive Industrial`,
    h1: translatedTitle,
    intro,
    keyBenefits,
    bisHighlight,
    faqEntries,
    schemaMarkup,
    hreflangTag,
    wordCountEstimate: 800 + faqEntries.length * 80,
  };
}

export function generateHreflangBlock(slug: string): string {
  return SUPPORTED_LOCALES.map(
    (l) =>
      `<link rel="alternate" hreflang="${l.schema_locale}" href="https://accudrive.io/${l.code}${slug}" />`
  ).join("\n");
}
