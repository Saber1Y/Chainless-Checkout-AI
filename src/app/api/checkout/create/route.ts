import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { merchantAddress, name, price, description, slug, nftMetadata, gatedContentTitle } = body;

    if (!merchantAddress || !name || !price || !slug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [product] = await db
      .insert(products)
      .values({
        merchantAddress,
        name,
        price,
        description,
        slug,
        nftMetadata,
        gatedContentTitle,
      })
      .returning();

    return NextResponse.json(product);
  } catch (e: any) {
    console.error("Checkout creation error:", e);
    return NextResponse.json(
      { error: e.message || "Creation failed" },
      { status: 500 }
    );
  }
}
