"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PaymentProgressTimeline } from "@/components/PaymentProgressTimeline";
import { useAuth } from "@/components/MagicAuthProvider";
import { useStore } from "@/lib/store";

export default function ProcessingPage() {
  const params = useParams();
  const router = useRouter();
  const { address } = useAuth();
  const { updateStepStatus } = useStore();
  const id = params.id as string;

  useEffect(() => {
    if (!address) return;

    const steps = [
      { index: 0, delay: 500 },
      { index: 1, delay: 1500 },
      { index: 2, delay: 2500 },
      { index: 3, delay: 4000 },
      { index: 4, delay: 5500 },
      { index: 5, delay: 7000 },
    ];

    steps.forEach(({ index, delay }) => {
      setTimeout(() => {
        updateStepStatus(index, "completed");
        if (index < steps.length - 1) {
          setTimeout(() => {
            updateStepStatus(index + 1, "in_progress");
          }, 100);
        }
      }, delay);
    });

    updateStepStatus(0, "in_progress");
  }, [address]);

  const handleComplete = () => {
    const invoiceId = `inv_${Date.now()}`;
    router.push(`/receipt/${invoiceId}`);
  };

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
          <PaymentProgressTimeline onComplete={handleComplete} />
        </div>
      </main>
    </div>
  );
}
