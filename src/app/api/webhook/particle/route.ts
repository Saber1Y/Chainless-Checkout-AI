import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { invoices } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invoiceId, settlementTx, status, nftTokenId } = body;

    if (!invoiceId) {
      return NextResponse.json(
        { error: "Invoice ID is required" },
        { status: 400 }
      );
    }

    const updates: Record<string, any> = {};
    if (settlementTx) updates.settlementTx = settlementTx;
    if (status) updates.status = status;
    if (nftTokenId) updates.nftTokenId = nftTokenId;

    const [updated] = await db
      .update(invoices)
      .set(updates)
      .where(eq(invoices.id, invoiceId))
      .returning();

    return NextResponse.json(updated);
  } catch (e: any) {
    console.error("Webhook error:", e);
    return NextResponse.json(
      { error: e.message || "Webhook failed" },
      { status: 500 }
    );
  }
}
