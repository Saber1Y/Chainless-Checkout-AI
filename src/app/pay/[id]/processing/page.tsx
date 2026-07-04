"use client";

import { useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PaymentProgressTimeline } from "@/components/PaymentProgressTimeline";
import { useAuth } from "@/components/MagicAuthProvider";
import { useStore } from "@/lib/store";
import { getMagicSigner, signEIP7702Authorization } from "@/lib/magic";
import { getUniversalAccount, getUnifiedBalance, getMerchantAddress, createCrossChainPayment } from "@/lib/particle";
import { config } from "@/config";
import type { Product } from "@/types";

export default function ProcessingPage() {
  const params = useParams();
  const router = useRouter();
  const { address, isAuthenticated } = useAuth();
  const { updateStepStatus } = useStore();
  const slug = params.id as string;
  const startedRef = useRef(false);

  const mark = useCallback((index: number, status: string) => {
    updateStepStatus(index, status);
  }, [updateStepStatus]);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  useEffect(() => {
    if (!address || !isAuthenticated || startedRef.current) return;
    startedRef.current = true;

    const run = async () => {
      mark(0, "in_progress");

      let product: Product | null = null;
      try {
        const res = await fetch(`/api/checkout/resolve?slug=${slug}`);
        if (!res.ok) throw new Error("Product not found");
        product = await res.json();
        mark(0, "completed");
      } catch {
        mark(0, "failed");
        return;
      }

      await sleep(300);
      mark(1, "in_progress");

      let magicSigner: Awaited<ReturnType<typeof getMagicSigner>> | null = null;
      try {
        magicSigner = await getMagicSigner();
        mark(1, "completed");
      } catch {
        mark(1, "failed");
      }

      await sleep(300);
      mark(2, "in_progress");

      let balanceFound = false;
      try {
        const assets = await getUnifiedBalance(address);
        balanceFound = !!assets.totalAmountInUSD && parseFloat(assets.totalAmountInUSD) > 0;
        mark(2, "completed");
      } catch {
        mark(2, "completed");
      }

      await sleep(300);
      mark(3, "in_progress");

      let paymentResult: { txHash?: string; error?: string } = {};
      try {
        const merchantAddr = await getMerchantAddress();
        const ua = getUniversalAccount(address);
        const tx = await ua.createTransferTransaction({
          token: {
            chainId: config.chains.baseSepolia.id,
            address: config.tokens.usdc.baseSepolia,
          },
          amount: product!.price,
          receiver: merchantAddr,
        });
        const signFn = async (hash: Uint8Array) => {
          return magicSigner!.signMessage(hash);
        };
        const signature = await signFn(
          new Uint8Array(Buffer.from(tx.rootHash.slice(2), "hex"))
        );
        const result = await ua.sendTransaction(tx, signature);
        paymentResult.txHash = typeof result === "string" ? result : result.hash;
        mark(3, "completed");
      } catch (e: any) {
        paymentResult.error = e.message;
        mark(3, "failed");
      }

      await sleep(300);
      mark(4, "in_progress");

      try {
        const res = await fetch("/api/checkout/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productSlug: slug,
            buyerAddress: address,
            sourceChain: "Base Sepolia",
            settlementTx: paymentResult.txHash,
          }),
        });
        if (!res.ok) throw new Error("Processing failed");
        const { invoice } = await res.json();
        mark(4, "completed");

        await sleep(300);
        mark(5, "in_progress");
        mark(5, "completed");

        setTimeout(() => {
          router.push(`/receipt/${invoice.id}`);
        }, 800);
      } catch {
        mark(4, "failed");
      }
    };

    run();
  }, [address, isAuthenticated, slug, mark, router]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between p-4 sm:p-6 border-b">
        <Link href="/" className="font-semibold text-lg hover:opacity-80">
          Chainless Checkout AI
        </Link>
      </header>

      <main className="flex-1 p-4 sm:p-6 flex items-center justify-center">
        <div className="w-full max-w-lg text-center space-y-8">
          <h1 className="text-2xl font-bold">Processing payment</h1>
          <PaymentProgressTimeline onComplete={() => {}} />
        </div>
      </main>
    </div>
  );
}
