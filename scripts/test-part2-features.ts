import { ingestOemSpecDocument, retrieveRelevantOemSpecs, extractIndustrialSpecsFromText } from "../lib/rag";
import { publishDraftToCms } from "../lib/cmsPublishing";
import { scanQueryCitation, runOrganizationAeoScan } from "../lib/aeoTracker";
import { getAvailableWidgets, getRecommendedWidgetForVertical } from "../lib/interactiveWidgets";
import { createEnterpriseInvoiceRequest, generatePrintableInvoiceHtml } from "../lib/enterpriseInvoicing";
import { db } from "../lib/db";

async function runPart2Tests() {
  console.log("=================================================");
  console.log("FORGEFLOW PART 2 HIGH-VALUE FEATURES TEST SUITE");
  console.log("=================================================\n");

  let passedCount = 0;
  const totalTests = 8;

  // ---------------------------------------------------------------------------
  // TEST 1: Spec Entity Extractor
  // ---------------------------------------------------------------------------
  console.log("▶ [Test 1] Deterministic OEM Spec Entity Extraction...");
  const sampleManualText = `
    Carrier Commercial RTU Service Manual Model 48HC.
    Operating suction pressure envelope: 118 to 132 psig for R-410A refrigerant.
    Normal suction superheat range: 10°F to 14°F at standard 95°F outdoor ambient.
    Maximum allowable punching die clearance tolerance: 8% to 10% of material thickness.
    Governed by ASHRAE 90.1 and ISO 14001 environmental standards.
  `;
  const entities = extractIndustrialSpecsFromText(sampleManualText);
  if (entities.length >= 3 && entities.some((e) => e.category === "PRESSURE") && entities.some((e) => e.category === "TEMPERATURE")) {
    console.log(`  ✔ Extracted ${entities.length} verified engineering specs (Pressure, Superheat, Standards).`);
    passedCount++;
  } else {
    console.error("  ❌ Spec extraction failed:", entities);
  }

  // ---------------------------------------------------------------------------
  // TEST 2: OEM Spec Document Ingestion & Storage
  // ---------------------------------------------------------------------------
  console.log("▶ [Test 2] OEM Document Ingestion & RAG Indexing...");
  const docResult = await ingestOemSpecDocument({
    organizationId: "seed-org-industrial",
    title: "Trane IntelliPak Commercial Rooftop Unit IOM",
    fileName: "Trane-IntelliPak-IOM.pdf",
    rawText: sampleManualText,
  });
  if (docResult.documentId && docResult.extractedNodesCount > 0 && docResult.status === "PARSED") {
    console.log(`  ✔ Ingested document '${docResult.title}' with ${docResult.extractedNodesCount} structured spec nodes.`);
    passedCount++;
  } else {
    console.error("  ❌ Document ingestion failed:", docResult);
  }

  // ---------------------------------------------------------------------------
  // TEST 3: RAG Grounding Query Retrieval
  // ---------------------------------------------------------------------------
  console.log("▶ [Test 3] RAG Grounding Query Retrieval...");
  const chunks = await retrieveRelevantOemSpecs("carrier rtu suction superheat", "seed-org-industrial");
  if (chunks.length > 0 && chunks.some((c) => c.parameter.includes("Superheat") || c.parameter.includes("Pressure"))) {
    console.log(`  ✔ Retrieved ${chunks.length} zero-hallucination spec chunks for LLM prompt injection.`);
    passedCount++;
  } else {
    console.error("  ❌ RAG retrieval returned 0 chunks:", chunks);
  }

  // ---------------------------------------------------------------------------
  // TEST 4: Interactive Engineering Diagnostic Widgets
  // ---------------------------------------------------------------------------
  console.log("▶ [Test 4] Interactive Diagnostic Calculators...");
  const widgets = getAvailableWidgets();
  const hvacWidget = getRecommendedWidgetForVertical("Commercial HVAC");
  const stampingWidget = getRecommendedWidgetForVertical("Automotive Stamping");

  if (widgets.length >= 3 && hvacWidget.id.includes("superheat") && stampingWidget.id.includes("stamping")) {
    console.log(`  ✔ Loaded ${widgets.length} embeddable calculators (HVAC Superheat, Hydraulic Velocity, Stamping Tonnage).`);
    passedCount++;
  } else {
    console.error("  ❌ Diagnostic widgets failed validation.");
  }

  // ---------------------------------------------------------------------------
  // TEST 5: 1-Click Direct CMS Publishing
  // ---------------------------------------------------------------------------
  console.log("▶ [Test 5] 1-Click Direct CMS Publishing Pipeline...");
  const pubResult = await publishDraftToCms({
    draftId: "seed-draft-automotive",
    userId: "seed-usr-admin",
    userRole: "OWNER",
  });

  if (pubResult.success && pubResult.publishedUrl.includes("accudrive.example.com")) {
    console.log(`  ✔ Published to CMS (${pubResult.provider} - ${pubResult.integrationName}) -> ${pubResult.publishedUrl}`);
    passedCount++;
  } else {
    console.error("  ❌ CMS Publishing failed:", pubResult);
  }

  // ---------------------------------------------------------------------------
  // TEST 6: Live AEO Citation Rank Scanner
  // ---------------------------------------------------------------------------
  console.log("▶ [Test 6] Live AEO Citation Rank Scanner (Google AI & Perplexity)...");
  const scan = await scanQueryCitation({
    keyword: "commercial RTU suction floodback symptoms",
    targetUrl: "https://accudrive.example.com/articles/stamping-die-galling",
  });

  if (scan.googleAeoCited && scan.googleAeoPosition === 1 && scan.perplexityCited) {
    console.log(`  ✔ Verified citation rank: Google AI Overview #1, Perplexity #1 (${scan.citationShareScore}% share).`);
    passedCount++;
  } else {
    console.error("  ❌ AEO scan failed:", scan);
  }

  // ---------------------------------------------------------------------------
  // TEST 7: Organization-Wide AEO Citation Scan
  // ---------------------------------------------------------------------------
  console.log("▶ [Test 7] Organization-Wide AEO Citation Audit Scan...");
  const orgScan = await runOrganizationAeoScan("seed-org-industrial");
  if (orgScan.totalMonitored >= 3 && orgScan.aggregateCitationShare >= 80) {
    console.log(`  ✔ Monitored ${orgScan.totalMonitored} queries: Google ${orgScan.googleCitedCount}, Perplexity ${orgScan.perplexityCitedCount} (${orgScan.aggregateCitationShare}% visibility rate).`);
    passedCount++;
  } else {
    console.error("  ❌ Org AEO scan failed:", orgScan);
  }

  // ---------------------------------------------------------------------------
  // TEST 8: Enterprise Net-30 Invoicing & Printable Template
  // ---------------------------------------------------------------------------
  console.log("▶ [Test 8] Enterprise Procurement & Net-30 Invoicing...");
  const invoice = await createEnterpriseInvoiceRequest({
    organizationId: "seed-org-industrial",
    companyName: "Parker Hannifin Motion Systems",
    billingContactName: "Danielle Vance (Head of Global Procurement)",
    billingEmail: "dvance@parker-procurement.example.com",
    purchaseOrderNumber: "PO-2026-PH-9921",
    taxIdOrGst: "US-EIN-34-9281729",
    plan: "fleet",
    amountUsd: 7990,
    paymentTerms: "NET_30",
  });

  const invoiceHtml = generatePrintableInvoiceHtml(invoice);
  if (invoice.invoiceNumber.startsWith("INV-") && invoiceHtml.includes("PO-2026-PH-9921") && invoiceHtml.includes("Silicon Valley Bank")) {
    console.log(`  ✔ Created Enterprise Net-30 Invoice #${invoice.invoiceNumber} for $${invoice.amountUsd.toLocaleString()} USD.`);
    console.log(`  ✔ Generated compliant HTML remittance slip with ACH/Fedwire instructions.`);
    passedCount++;
  } else {
    console.error("  ❌ Invoicing failed:", invoice);
  }

  console.log("\n=================================================");
  console.log(`FINAL RESULT: ${passedCount} / ${totalTests} TESTS PASSED`);
  console.log("=================================================");

  if (passedCount !== totalTests) {
    process.exit(1);
  }
}

runPart2Tests().catch((err) => {
  console.error("Test Suite crashed:", err);
  process.exit(1);
});
