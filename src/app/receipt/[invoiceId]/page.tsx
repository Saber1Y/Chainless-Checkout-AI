"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ReceiptCard } from "@/components/ReceiptCard";
import { AccessPassCard } from "@/components/AccessPassCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { IoCheckmark } from "react-icons/io5";
import type { Product } from "@/types";

export default function ReceiptPage() {
  const params = useParams();
  const invoiceId = params.invoiceId as string;
  const [data, setData] = useState<{ invoice: Record<string, unknown>; product: Product | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await fetch(`/api/invoice/${invoiceId}`);
        if (!res.ok) throw new Error("Invoice not found");
        setData(await res.json());
      } catch (e) {
        console.error("Failed to load invoice:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [invoiceId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-32 w-full max-w-sm" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Receipt not found</h1>
          <Link href="/">Go home</Link>
        </div>
      </div>
    );
  }

  const { invoice, product } = data;

  const i = invoice as Record<string, string | null | undefined>;
  const receipt = {
    invoiceId: i.id || "",
    productName: product?.name || "Unknown Product",
    amount: i.amount || "0",
    currency: i.currency || "USDC",
    buyerAddress: i.buyerAddress || "",
    sourceChain: i.sourceChain || "Base Sepolia",
    settlementChain: i.destinationChain || "Arbitrum Sepolia",
    settlementTx: i.settlementTx || "",
    nftTokenId: i.nftTokenId || "0",
    nftContractAddress: i.nftContractAddress || "",
    status: i.status || "pending",
    createdAt: i.createdAt as string || new Date().toISOString(),
  };

  const nftMetadata = {
    name: product?.nftMetadata && typeof product.nftMetadata === "object" && !Array.isArray(product.nftMetadata)
      ? ((product.nftMetadata as Record<string, unknown>).name as string) || (product?.name || "Access Pass")
      : product?.name || "Access Pass",
    description: product?.nftMetadata && typeof product.nftMetadata === "object"
      ? ((product.nftMetadata as Record<string, unknown>).description as string) || (product?.description || "")
      : product?.description || "",
    attributes: product?.nftMetadata && typeof product.nftMetadata === "object"
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

      <main className="flex-1 p-4 sm:p-6 max-w-lg mx-auto w-full space-y-8 pt-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <IoCheckmark className="text-green-600 dark:text-green-400 text-xl" />
          </div>
          <h1 className="text-2xl font-bold">Payment complete</h1>
        </div>

        <ReceiptCard receipt={receipt} />

        {receipt.nftTokenId && receipt.nftTokenId !== "0" && (
          <AccessPassCard tokenId={receipt.nftTokenId} metadata={nftMetadata} />
        )}

        <Separator />

        <div className="flex flex-col gap-3">
          {receipt.nftTokenId && receipt.nftTokenId !== "0" && (
            <Link href={`/access/${receipt.nftTokenId}`}>
              <Button className="w-full">Open Builder Kit</Button>
            </Link>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          {receipt.status === "settled"
            ? `Merchant received ${receipt.amount} ${receipt.currency} on ${receipt.settlementChain}`
            : `Payment recorded. Settlement pending on ${receipt.settlementChain}.`}
        </p>
      </main>
    </div>
  );
}
