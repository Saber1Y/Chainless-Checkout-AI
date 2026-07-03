"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { AccessPassCard } from "@/components/AccessPassCard";
import { AIBuilderKitGenerator } from "@/components/AIBuilderKitGenerator";
import { Separator } from "@/components/ui/separator";

export default function AccessPage() {
  const params = useParams();
  const tokenId = params.tokenId as string;

  const nftMetadata = {
    name: "UXMaxx AI Builder Pass",
    description: "Access pass for Chainless Checkout AI",
    attributes: [
      { trait_type: "Type", value: "Builder Pass" },
      { trait_type: "Settlement", value: "Arbitrum Sepolia" },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between p-4 sm:p-6 border-b">
        <Link href="/" className="font-semibold text-lg hover:opacity-80">
          Chainless Checkout AI
        </Link>
      </header>

      <main className="flex-1 p-4 sm:p-6 max-w-2xl mx-auto w-full space-y-8 pt-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">
            Welcome back.
          </h1>
          <p className="text-muted-foreground">
            Your UXMaxx AI Builder Pass is active.
          </p>
        </div>

        <div className="max-w-sm mx-auto">
          <AccessPassCard tokenId={tokenId} metadata={nftMetadata} />
        </div>

        <Separator />

        <div>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Based on your interests, your builder kit includes a project
            positioning, UI checklist, pitch script, integration checklist, and
            pitch summary.
          </p>
          <AIBuilderKitGenerator />
        </div>
      </main>
    </div>
  );
}
