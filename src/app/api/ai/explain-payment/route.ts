import { NextRequest, NextResponse } from "next/server";
import { explainPayment } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const context = await req.json();

    if (!context.productName || !context.price) {
      return NextResponse.json(
        { error: "Payment context is required" },
        { status: 400 }
      );
    }

    const explanation = await explainPayment(context);

    return NextResponse.json(explanation);
  } catch (e: any) {
    console.error("AI payment explanation error:", e);
    return NextResponse.json(
      { error: e.message || "Explanation failed" },
      { status: 500 }
    );
  }
}
