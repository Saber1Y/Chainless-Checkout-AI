"use client";

import { useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PaymentProgressTimeline } from "@/components/PaymentProgressTimeline";
import { useAuth } from "@/components/MagicAuthProvider";
import { useStore } from "@/lib/store";
import { signEIP7702Authorization } from "@/lib/magic";
import { getUniversalAccount, getUnifiedBalance, createCrossChainPayment } from "@/lib/particle";
import { config } from "@/config";
import type { Product } from "@/types";

export default function ProcessingPage() {
  const params = useParams();
  const router = useRouter();
  const { address, isAuthenticated } = useAuth();
  const { updateStepStatus } = useStore();
  const slug = params.id as string;
  const productRef = useRef<Product | null>(null);
  const startedRef = useRef(false);

  const markFailed = useCallback((stepIndex: number) => {
    updateStepStatus(stepIndex, "failed");
  }, [updateStepStatus]);

  const markCompleted = useCallback((stepIndex: number) => {
    updateStepStatus(stepIndex, "completed");
  }, [updateStepStatus]);

  const markInProgress = useCallback((stepIndex: number) => {
    updateStepStatus(stepIndex, "in_progress");
  }, [updateStepStatus]);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  useEffect(() => {
    if (!address || !isAuthenticated || startedRef.current) return;
    startedRef.current = true;

    const run = async () => {
      markInProgress(0);

      let product: Product | null = null;

      try {
        const res = await fetch(`/api/checkout/resolve?slug=${slug}`);
        if (!res.ok) throw new Error("Product not found");
        product = await res.json();
        productRef.current = product;
        markCompleted(0);
      } catch {
        markFailed(0);
        return;
      }

      await sleep(300);
      markInProgress(1);

      try {
        const authSig = await signEIP7702Authorization(
          config.contracts.paymentSettlement,
          config.chains.arbitrumSepolia.id
        );
        markCompleted(1);
      } catch {
        markFailed(1);
      }

      await sleep(300);
      markInProgress(2);

      let balanceFound = false;
      try {
        const ua = getUniversalAccount(address);
        const assets = await getUnifiedBalance(address);
        balanceFound = !!assets.totalAmountInUSD && parseFloat(assets.totalAmountInUSD) > 0;
        markCompleted(2);
      } catch {
        markCompleted(2);
      }

      await sleep(300);
      markInProgress(3);

      let isPending = false;
      try {
        const merchantRes = await fetch("/api/checkout/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productSlug: slug,
            buyerAddress: address,
            sourceChain: "Base Sepolia",
          }),
        });
        if (!merchantRes.ok) throw new Error("Processing failed");
        const { invoice } = await merchantRes.json();
        productRef.current = null;
        markCompleted(3);

        await sleep(300);
        markInProgress(4);
        markCompleted(4);

        await sleep(300);
        markInProgress(5);
        markCompleted(5);

        setTimeout(() => {
          router.push(`/receipt/${invoice.id}`);
        }, 800);
      } catch {
        markFailed(3);
      }
    };

    run();
  }, [address, isAuthenticated, slug, markInProgress, markCompleted, markFailed, router]);

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
