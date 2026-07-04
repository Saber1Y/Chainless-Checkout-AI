import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { invoices, products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  try {
    const { tokenId } = await params;

    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.nftTokenId, tokenId));

    if (!invoice) {
      return NextResponse.json({ error: "Access pass not found" }, { status: 404 });
    }

    let product: { name: string; description: string | null; nftMetadata: unknown; gatedContentTitle: string | null } | null = null;

    if (invoice.productId) {
      const [p] = await db
        .select({
          name: products.name,
          description: products.description,
          nftMetadata: products.nftMetadata,
          gatedContentTitle: products.gatedContentTitle,
        })
        .from(products)
        .where(eq(products.id, invoice.productId));
      product = p || null;
    }

    return NextResponse.json({
      invoice,
      product,
      tokenId,
    });
  } catch (e: any) {
    console.error("Access fetch error:", e);
    return NextResponse.json(
      { error: e.message || "Fetch failed" },
      { status: 500 }
    );
  }
}
