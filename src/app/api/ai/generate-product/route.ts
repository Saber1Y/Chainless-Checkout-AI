import { NextRequest, NextResponse } from "next/server";
import { generateProduct } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const product = await generateProduct(prompt);

    return NextResponse.json(product);
  } catch (e: any) {
    console.error("AI product generation error:", e);
    return NextResponse.json(
      { error: e.message || "Generation failed" },
      { status: 500 }
    );
  }
}
