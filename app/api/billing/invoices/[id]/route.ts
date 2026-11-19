import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { generatePrintableInvoiceHtml } from "@/lib/enterpriseInvoicing";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inv = await db.invoiceRequest.findUnique({
      where: { id },
    });

    if (!inv) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format");

    const dueDate = new Date(inv.createdAt);
    dueDate.setDate(dueDate.getDate() + (inv.paymentTerms === "NET_60" ? 60 : 30));

    const invoiceData = {
      invoiceNumber: `INV-${inv.id.slice(-6).toUpperCase()}`,
      issueDate: inv.createdAt.toISOString().slice(0, 10),
      dueDate: dueDate.toISOString().slice(0, 10),
      companyName: inv.companyName,
      billingContactName: inv.billingContactName,
      billingEmail: inv.billingEmail,
      purchaseOrderNumber: inv.purchaseOrderNumber || "PO-PENDING",
      taxIdOrGst: inv.taxIdOrGst || "N/A",
      plan: inv.plan.toUpperCase(),
      amountUsd: inv.amountUsd,
      paymentTerms: inv.paymentTerms,
      status: inv.status as "INVOICED" | "PAID" | "OVERDUE",
      wireRemittanceInstructions: {
        beneficiaryName: "ForgeFlow Systems Inc. (Enterprise Billing)",
        bankName: "Silicon Valley Bank / First Republic",
        routingNumberAch: "121000358",
        swiftCode: "SVBKUS6S",
        accountNumber: "3892019482",
        reference: `${inv.purchaseOrderNumber || inv.id.slice(-6)}`,
      },
    };

    if (format === "html") {
      const html = generatePrintableInvoiceHtml(invoiceData);
      return new NextResponse(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return NextResponse.json({ success: true, invoice: invoiceData });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
