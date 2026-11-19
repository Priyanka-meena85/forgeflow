import { db } from "@/lib/db";
import { recordAuditLog } from "@/lib/audit";

export interface InvoiceDetails {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  companyName: string;
  billingContactName: string;
  billingEmail: string;
  purchaseOrderNumber: string;
  taxIdOrGst: string;
  plan: string;
  amountUsd: number;
  paymentTerms: string;
  status: "INVOICED" | "PAID" | "OVERDUE";
  wireRemittanceInstructions: {
    beneficiaryName: string;
    bankName: string;
    routingNumberAch: string;
    swiftCode: string;
    accountNumber: string;
    reference: string;
  };
}

export async function createEnterpriseInvoiceRequest(args: {
  organizationId: string;
  companyName: string;
  billingContactName: string;
  billingEmail: string;
  purchaseOrderNumber?: string;
  taxIdOrGst?: string;
  plan?: string;
  amountUsd?: number;
  paymentTerms?: string;
  userId?: string;
  userRole?: string;
}): Promise<InvoiceDetails> {
  const planTier = (args.plan || "fleet").toLowerCase();
  const amount = args.amountUsd ?? (planTier === "fleet" ? 7990 : 2388); // Annual rate default with 20% OEM discount
  const terms = args.paymentTerms || "NET_30";
  const poNum = args.purchaseOrderNumber || `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const invoice = await db.invoiceRequest.create({
    data: {
      organizationId: args.organizationId,
      companyName: args.companyName,
      billingContactName: args.billingContactName,
      billingEmail: args.billingEmail,
      purchaseOrderNumber: poNum,
      taxIdOrGst: args.taxIdOrGst || "EIN-PENDING",
      plan: planTier,
      amountUsd: amount,
      paymentTerms: terms,
      status: "INVOICED",
      invoicePdfUrl: `/api/billing/invoices/inv_${Date.now()}/download`,
    },
  });

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + (terms === "NET_60" ? 60 : 30));

  await recordAuditLog({
    organizationId: args.organizationId,
    userId: args.userId || null,
    userRole: args.userRole || "ADMIN",
    action: "ENTERPRISE_INVOICE_GENERATED",
    resourceType: "INVOICE",
    resourceId: invoice.id,
    metadata: {
      poNumber: poNum,
      company: args.companyName,
      amountUsd: amount,
      paymentTerms: terms,
    },
    details: {
      summary: `Generated Net-30 enterprise invoice for ${args.companyName} (${poNum}) totaling $${amount.toLocaleString()} USD.`,
    },
  });

  return {
    invoiceNumber: `INV-${invoice.id.slice(-6).toUpperCase()}`,
    issueDate: invoice.createdAt.toISOString().slice(0, 10),
    dueDate: dueDate.toISOString().slice(0, 10),
    companyName: invoice.companyName,
    billingContactName: invoice.billingContactName,
    billingEmail: invoice.billingEmail,
    purchaseOrderNumber: invoice.purchaseOrderNumber || poNum,
    taxIdOrGst: invoice.taxIdOrGst || "N/A",
    plan: invoice.plan.toUpperCase(),
    amountUsd: invoice.amountUsd,
    paymentTerms: invoice.paymentTerms,
    status: "INVOICED",
    wireRemittanceInstructions: {
      beneficiaryName: "ForgeFlow Systems Inc. (Enterprise Billing)",
      bankName: "Silicon Valley Bank / First Republic",
      routingNumberAch: "121000358",
      swiftCode: "SVBKUS6S",
      accountNumber: "3892019482",
      reference: `${invoice.purchaseOrderNumber || poNum}`,
    },
  };
}

export function generatePrintableInvoiceHtml(inv: InvoiceDetails): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Invoice ${inv.invoiceNumber} - ForgeFlow Systems Inc.</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 40px; color: #0f172a; line-height: 1.5; font-size: 14px; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: 800; color: #4338ca; letter-spacing: -0.5px; }
    .invoice-title { font-size: 20px; font-weight: 700; color: #1e293b; text-align: right; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .badge-net30 { background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { background: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left; padding: 12px; font-weight: 600; font-size: 12px; text-transform: uppercase; color: #475569; }
    td { padding: 14px 12px; border-bottom: 1px solid #e2e8f0; }
    .total-box { margin-left: auto; width: 300px; margin-bottom: 30px; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .total-row.grand { border-top: 2px solid #0f172a; font-size: 16px; font-weight: 800; color: #0f172a; }
    .remit-box { background: #f1f5f9; border-radius: 8px; padding: 20px; border: 1px solid #cbd5e1; }
    .remit-box h4 { margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; color: #334155; }
    .remit-grid { display: grid; grid-template-columns: 140px 1fr; gap: 6px; font-size: 13px; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">FORGEFLOW</div>
      <div style="color: #64748b; font-size: 12px; margin-top: 4px;">Industrial Search Intelligence &amp; AEO Engine</div>
      <div style="font-size: 12px; color: #475569; margin-top: 10px;">
        ForgeFlow Systems Inc.<br />
        500 Technology Square, Suite 400<br />
        Cambridge, MA 02139<br />
        Tax ID / EIN: 88-3920194
      </div>
    </div>
    <div style="text-align: right;">
      <div class="invoice-title">OFFICIAL INVOICE</div>
      <div style="font-size: 14px; font-weight: 600; color: #64748b; margin-top: 4px;"># ${inv.invoiceNumber}</div>
      <div style="margin-top: 10px;"><span class="badge badge-net30">Payment Terms: ${inv.paymentTerms}</span></div>
      <div style="font-size: 12px; color: #475569; margin-top: 10px;">
        Issue Date: <strong>${inv.issueDate}</strong><br />
        Due Date: <strong>${inv.dueDate}</strong>
      </div>
    </div>
  </div>

  <div class="grid">
    <div>
      <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 6px;">Billed To (Customer):</div>
      <div style="font-size: 15px; font-weight: 700; color: #0f172a;">${inv.companyName}</div>
      <div style="font-size: 13px; color: #334155; margin-top: 2px;">Attn: ${inv.billingContactName}</div>
      <div style="font-size: 13px; color: #64748b;">${inv.billingEmail}</div>
      <div style="font-size: 12px; color: #64748b; margin-top: 6px;">Customer Tax ID / GST: <strong>${inv.taxIdOrGst}</strong></div>
    </div>
    <div>
      <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 6px;">Procurement Reference:</div>
      <div style="font-size: 14px; font-weight: 600; color: #0f172a;">Purchase Order #: <span style="font-family: monospace; color: #4338ca;">${inv.purchaseOrderNumber}</span></div>
      <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Contract Schedule: Annual Enterprise Tier</div>
      <div style="font-size: 12px; color: #64748b;">Status: <strong>PAYMENT PENDING (${inv.paymentTerms})</strong></div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Period</th>
        <th style="text-align: right;">Capacity</th>
        <th style="text-align: right;">Amount (USD)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <strong>ForgeFlow ${inv.plan} Industrial SEO &amp; AEO Platform</strong><br />
          <span style="font-size: 12px; color: #64748b;">Includes Deterministic Spec Engine, PE Review Workflow, Live AEO Tracker, and Direct CMS Publishing.</span>
        </td>
        <td>12 Months (Annual)</td>
        <td style="text-align: right;">100 Pages / Mo</td>
        <td style="text-align: right; font-weight: 600;">$${inv.amountUsd.toLocaleString()}.00</td>
      </tr>
    </tbody>
  </table>

  <div class="total-box">
    <div class="total-row"><span>Subtotal:</span><span>$${inv.amountUsd.toLocaleString()}.00</span></div>
    <div class="total-row"><span>Applicable Tax (0.0% B2B):</span><span>$0.00</span></div>
    <div class="total-row grand"><span>Total Due (${inv.paymentTerms}):</span><span>$${inv.amountUsd.toLocaleString()}.00</span></div>
  </div>

  <div class="remit-box">
    <h4>Bank Remittance &amp; Wire Transfer Instructions (ACH / Fedwire)</h4>
    <div class="remit-grid">
      <div style="color: #64748b;">Beneficiary:</div><div><strong>${inv.wireRemittanceInstructions.beneficiaryName}</strong></div>
      <div style="color: #64748b;">Bank Name:</div><div>${inv.wireRemittanceInstructions.bankName}</div>
      <div style="color: #64748b;">ACH Routing #:</div><div style="font-family: monospace;">${inv.wireRemittanceInstructions.routingNumberAch}</div>
      <div style="color: #64748b;">SWIFT / BIC:</div><div style="font-family: monospace;">${inv.wireRemittanceInstructions.swiftCode}</div>
      <div style="color: #64748b;">Account Number:</div><div style="font-family: monospace;">${inv.wireRemittanceInstructions.accountNumber}</div>
      <div style="color: #64748b;">Payment Ref:</div><div style="font-family: monospace; font-weight: bold; color: #4338ca;">${inv.wireRemittanceInstructions.reference}</div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
