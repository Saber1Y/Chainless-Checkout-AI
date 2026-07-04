import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { invoices, products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, id));

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    let product: { name: string; description: string | null; nftMetadata: unknown } | null = null;

    if (invoice.productId) {
      const [p] = await db
        .select({ name: products.name, description: products.description, nftMetadata: products.nftMetadata })
        .from(products)
        .where(eq(products.id, invoice.productId));
      product = p || null;
    }

    return NextResponse.json({ invoice, product });
  } catch (e: any) {
    console.error("Invoice fetch error:", e);
    return NextResponse.json(
      { error: e.message || "Fetch failed" },
      { status: 500 }
    );
  }
}
