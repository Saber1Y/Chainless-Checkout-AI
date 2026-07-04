"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AccessPassCard } from "@/components/AccessPassCard";
import { AIBuilderKitGenerator } from "@/components/AIBuilderKitGenerator";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types";

export default function AccessPage() {
  const params = useParams();
  const tokenId = params.tokenId as string;
  const [data, setData] = useState<{
    invoice: Record<string, unknown>;
    product: Product | null;
    tokenId: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/access/by-token/${tokenId}`);
        if (!res.ok) throw new Error("Access pass not found");
        setData(await res.json());
      } catch (e) {
        console.error("Failed to load access data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tokenId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="flex items-center justify-between p-4 sm:p-6 border-b">
          <Link href="/" className="font-semibold text-lg hover:opacity-80">
            Chainless Checkout AI
          </Link>
        </header>
        <main className="flex-1 p-4 sm:p-6 flex items-center justify-center">
          <Skeleton className="h-64 w-full max-w-sm" />
        </main>
      </div>
    );
  }

  const product = data?.product;
  const gatedTitle = product?.gatedContentTitle || product?.name || "Access Pass";
  const description = product?.description || "Your access pass is active.";

  const nftMetadata = {
    name: gatedTitle,
    description,
    attributes: product?.nftMetadata && typeof product.nftMetadata === "object" && !Array.isArray(product.nftMetadata)
      ? ((product.nftMetadata as Record<string, unknown>).attributes as { trait_type: string; value: string }[]) || []
      : [],
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
            Your {gatedTitle} is active.
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
