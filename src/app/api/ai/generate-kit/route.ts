import { NextRequest, NextResponse } from "next/server";
import { generateBuilderKit } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { goal } = await req.json();

    if (!goal || typeof goal !== "string") {
      return NextResponse.json(
        { error: "Building goal is required" },
        { status: 400 }
      );
    }

    const kit = await generateBuilderKit(goal);

    return NextResponse.json(kit);
  } catch (e: any) {
    console.error("AI builder kit generation error:", e);
    return NextResponse.json(
      { error: e.message || "Generation failed" },
      { status: 500 }
    );
  }
}
