import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { createEnterpriseInvoiceRequest } from "@/lib/enterpriseInvoicing";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.user.organizationId || "seed-org-industrial";
    const invoices = await db.invoiceRequest.findMany({
      where: { organizationId: orgId },
    });

    return NextResponse.json({
      success: true,
      count: invoices.length,
      invoices: invoices.map((inv) => ({
        id: inv.id,
        companyName: inv.companyName,
        billingContactName: inv.billingContactName,
        billingEmail: inv.billingEmail,
        purchaseOrderNumber: inv.purchaseOrderNumber,
        taxIdOrGst: inv.taxIdOrGst,
        plan: inv.plan,
        amountUsd: inv.amountUsd,
        paymentTerms: inv.paymentTerms,
        status: inv.status,
        invoicePdfUrl: `/api/billing/invoices/${inv.id}`,
        createdAt: inv.createdAt,
      })),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.user.organizationId || "seed-org-industrial";
    const body = await req.json();

    const { companyName, billingContactName, billingEmail, purchaseOrderNumber, taxIdOrGst, plan, amountUsd, paymentTerms } = body;

    if (!companyName || !billingEmail) {
      return NextResponse.json({ error: "Company name and billing email are required." }, { status: 400 });
    }

    const invoice = await createEnterpriseInvoiceRequest({
      organizationId: orgId,
      companyName,
      billingContactName: billingContactName || "Procurement Manager",
      billingEmail,
      purchaseOrderNumber,
      taxIdOrGst,
      plan: plan || "fleet",
      amountUsd: amountUsd ? Number(amountUsd) : undefined,
      paymentTerms: paymentTerms || "NET_30",
      userId: session.user.id,
      userRole: session.user.role,
    });

    return NextResponse.json({
      success: true,
      message: `Enterprise Net-30 invoice #${invoice.invoiceNumber} created. Remittance instructions dispatched.`,
      invoice,
    }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
