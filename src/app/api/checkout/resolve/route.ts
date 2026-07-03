import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug));

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (e: any) {
    console.error("Checkout resolution error:", e);
    return NextResponse.json(
      { error: e.message || "Resolution failed" },
      { status: 500 }
    );
  }
}
