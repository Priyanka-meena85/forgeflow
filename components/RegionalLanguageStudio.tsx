"use client";

import { useState, useCallback } from "react";
import {
  SUPPORTED_LOCALES,
  generateRegionalPage,
  generateHreflangBlock,
  type SupportedLocale,
  type RegionalPageOutput,
} from "@/lib/regionalLocalizationEngine";

const SAMPLE_TOPICS = [
  {
    title: "CNC Precision Machining for Automotive Industry",
    keyword: "CNC machining automotive India",
    equipment: "CNC machining centre",
    industry: "Automotive / Auto-ancillary",
    bisCode: "IS 7343",
  },
  {
    title: "Rotary Lobe Pump for Pharmaceutical Manufacturing",
    keyword: "rotary lobe pump pharma India",
    equipment: "Rotary lobe pump",
    industry: "Pharmaceutical manufacturing",
    bisCode: "IS 2825",
  },
  {
    title: "Industrial Bearing Solutions for Textile Machinery",
    keyword: "industrial bearing textile machinery",
    equipment: "Deep groove ball bearing",
    industry: "Textile machinery",
    bisCode: "IS 1239",
  },
];

export function RegionalLanguageStudio() {
  const [selectedLocales, setSelectedLocales] = useState<SupportedLocale[]>(["hi", "gu"]);
  const [topicIdx, setTopicIdx] = useState(0);
  const [customTitle, setCustomTitle] = useState("");
  const [customKeyword, setCustomKeyword] = useState("");
  const [customEquipment, setCustomEquipment] = useState("");
  const [customBis, setCustomBis] = useState("");
  const [generated, setGenerated] = useState<RegionalPageOutput[]>([]);
  const [activeOutputLocale, setActiveOutputLocale] = useState<SupportedLocale | null>(null);
  const [generating, setGenerating] = useState(false);
  const [hreflangBlock, setHreflangBlock] = useState("");
  const [copiedSlug, setCopiedSlug] = useState("");

  const toggleLocale = (code: SupportedLocale) => {
    setSelectedLocales((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]
    );
  };

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setGenerated([]);
    setHreflangBlock("");

    const topic = customTitle
      ? {
          title: customTitle,
          keyword: customKeyword || customTitle,
          equipment: customEquipment || "Industrial equipment",
          industry: "General industrial",
          bisCode: customBis || undefined,
        }
      : SAMPLE_TOPICS[topicIdx];

    // Simulate async (replace with real translation API call)
    await new Promise((r) => setTimeout(r, 800));

    const outputs: RegionalPageOutput[] = selectedLocales.map((locale) =>
      generateRegionalPage({
        locale,
        sourceTitle: topic.title,
        sourceKeyword: topic.keyword,
        sourceContent: `Detailed technical content about ${topic.equipment} for ${topic.industry}.`,
        equipment: topic.equipment,
        industry: topic.industry,
        bisCode: "bisCode" in topic ? topic.bisCode : undefined,
      })
    );

    setGenerated(outputs);
    setActiveOutputLocale(outputs[0]?.locale ?? null);
    setHreflangBlock(generateHreflangBlock("/" + topic.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")));
    setGenerating(false);
  }, [selectedLocales, topicIdx, customTitle, customKeyword, customEquipment, customBis]);

  const activeOutput = generated.find((o) => o.locale === activeOutputLocale);

  return (
    <div className="space-y-6 font-humanist">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">Regional Language Studio</h2>
        <p className="text-sm text-slate-500 mt-1">
          Generate Hindi, Gujarati, Marathi, and Punjabi pages targeting Indian MSME industrial
          buyers — with BIS / IS code compliance, hreflang tags, and FAQ schema.
        </p>

        {/* Market context */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          {SUPPORTED_LOCALES.map((l) => (
            <div
              key={l.code}
              className={`rounded-xl border p-3 cursor-pointer transition-all ${
                selectedLocales.includes(l.code)
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-slate-200 bg-slate-50 opacity-70"
              }`}
              onClick={() => toggleLocale(l.code)}
            >
              <div className="text-base font-bold text-slate-800">{l.nativeName}</div>
              <div className="text-xs text-slate-500 mt-0.5">{l.name}</div>
              <div className="text-xs text-indigo-600 mt-1 font-medium">{l.targetMarket}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Topic config */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Source Topic</h3>

        <div className="space-y-3 mb-4">
          {SAMPLE_TOPICS.map((t, i) => (
            <label
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                topicIdx === i && !customTitle
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="topic"
                checked={topicIdx === i && !customTitle}
                onChange={() => {
                  setTopicIdx(i);
                  setCustomTitle("");
                }}
                className="accent-indigo-600"
              />
              <div>
                <div className="text-sm font-medium text-slate-800">{t.title}</div>
                <div className="text-xs text-slate-500">
                  {t.equipment} | {t.bisCode}
                </div>
              </div>
            </label>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="text-xs font-semibold text-slate-600 mb-3">Or enter custom topic:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
              placeholder="Page title (English)"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
            />
            <input
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
              placeholder="Target keyword"
              value={customKeyword}
              onChange={(e) => setCustomKeyword(e.target.value)}
            />
            <input
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
              placeholder="Equipment name"
              value={customEquipment}
              onChange={(e) => setCustomEquipment(e.target.value)}
            />
            <input
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
              placeholder="BIS / IS code (optional)"
              value={customBis}
              onChange={(e) => setCustomBis(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating || selectedLocales.length === 0}
          className="mt-4 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {generating ? "Generating..." : `Generate ${selectedLocales.length} Regional Page(s)`}
        </button>
      </div>

      {/* Output */}
      {generated.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Generated Pages</h3>

          {/* Locale tabs */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {generated.map((o) => {
              const lc = SUPPORTED_LOCALES.find((l) => l.code === o.locale)!;
              return (
                <button
                  key={o.locale}
                  onClick={() => setActiveOutputLocale(o.locale)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors border ${
                    activeOutputLocale === o.locale
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  {lc.nativeName} ({lc.name})
                </button>
              );
            })}
          </div>

          {activeOutput && (
            <div className="space-y-5">
              {/* Meta */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                <div>
                  <span className="text-xs font-semibold text-slate-500">Slug</span>
                  <div className="font-mono text-xs text-indigo-700 mt-0.5">{activeOutput.slug}</div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500">Meta Description</span>
                  <div className="text-xs text-slate-700 mt-0.5">{activeOutput.metaDescription}</div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500">Word Count Est.</span>
                  <div className="text-xs text-slate-700 mt-0.5">{activeOutput.wordCountEstimate} words</div>
                </div>
              </div>

              {/* Page content preview */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">H1: {activeOutput.h1}</h4>
                <p className="text-sm text-slate-700 mb-3">{activeOutput.intro}</p>
                <div className="mb-3">
                  <p className="text-xs font-semibold text-slate-600 mb-1.5">Key Benefits:</p>
                  <ul className="space-y-1">
                    {activeOutput.keyBenefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className="text-green-500 font-bold mt-0.5">+</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 mb-3">
                  <span className="font-bold">BIS Compliance Note: </span>
                  {activeOutput.bisHighlight}
                </div>
              </div>

              {/* FAQs */}
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">FAQ Schema (preview):</p>
                <div className="space-y-2">
                  {activeOutput.faqEntries.map((faq, i) => (
                    <div key={i} className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                      <p className="text-xs font-semibold text-slate-800">Q: {faq.q}</p>
                      <p className="text-xs text-slate-600 mt-1">A: {faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* hreflang */}
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">hreflang Tag:</p>
                <div className="rounded-lg bg-slate-900 p-3 text-xs font-mono text-green-400 overflow-x-auto">
                  {activeOutput.hreflangTag}
                </div>
              </div>

              {/* Schema */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-600">JSON-LD Schema:</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(activeOutput.schemaMarkup);
                      setCopiedSlug(activeOutput.locale);
                      setTimeout(() => setCopiedSlug(""), 2000);
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    {copiedSlug === activeOutput.locale ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="rounded-lg bg-slate-900 p-3 text-xs font-mono text-green-400 overflow-x-auto max-h-48">
                  {activeOutput.schemaMarkup}
                </pre>
              </div>

              {/* Full hreflang block */}
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">
                  Full hreflang Block (all locales):
                </p>
                <pre className="rounded-lg bg-slate-900 p-3 text-xs font-mono text-cyan-400 overflow-x-auto whitespace-pre-wrap">
                  {hreflangBlock}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
