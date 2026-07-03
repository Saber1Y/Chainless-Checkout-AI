"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ReceiptCard } from "@/components/ReceiptCard";
import { AccessPassCard } from "@/components/AccessPassCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IoCheckmark } from "react-icons/io5";

export default function ReceiptPage() {
  const params = useParams();
  const invoiceId = params.invoiceId as string;

  const receipt = {
    invoiceId,
    productName: "UXMaxx AI Builder Pass",
    amount: "2",
    currency: "USDC",
    buyerAddress: "0xA12b3C45dE6F78901aB2C3d4E5F67890123491e",
    sourceChain: "Base Sepolia",
    settlementChain: "Arbitrum Sepolia",
    settlementTx: "0xabc123def456abc123def456abc123def456abc123def456abc123def456abc1",
    nftTokenId: "12",
    nftContractAddress: "0x1234567890abcdef1234567890abcdef12345678",
    status: "settled",
    createdAt: new Date().toISOString(),
  };

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

      <main className="flex-1 p-4 sm:p-6 max-w-lg mx-auto w-full space-y-8 pt-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <IoCheckmark className="text-green-600 dark:text-green-400 text-xl" />
          </div>
          <h1 className="text-2xl font-bold">Payment complete</h1>
        </div>

        <ReceiptCard receipt={receipt} />

        <AccessPassCard tokenId={receipt.nftTokenId} metadata={nftMetadata} />

        <Separator />

        <div className="flex flex-col gap-3">
          <Link href={`/access/${receipt.nftTokenId}`}>
            <Button className="w-full">Open Builder Kit</Button>
          </Link>
          <Button variant="outline" className="w-full">
            View Receipt
          </Button>
          <Button variant="outline" className="w-full">
            View Pass
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Merchant received {receipt.amount} {receipt.currency} on{" "}
          {receipt.settlementChain}
        </p>
      </main>
    </div>
  );
}
