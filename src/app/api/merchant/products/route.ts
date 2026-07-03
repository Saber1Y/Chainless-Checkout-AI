import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { products, invoices } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "address required" }, { status: 400 });
  }

  try {
    const productList = await db
      .select()
      .from(products)
      .where(eq(products.merchantAddress, address))
      .orderBy(desc(products.createdAt));

    const productIds = productList.map((p) => p.id);
    const invoiceList = productIds.length
      ? await db
          .select()
          .from(invoices)
          .where(eq(invoices.productId, productIds[0]))
      : [];

    return NextResponse.json({ products: productList, invoices: invoiceList });
  } catch (e: any) {
    console.error("Merchant fetch error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
