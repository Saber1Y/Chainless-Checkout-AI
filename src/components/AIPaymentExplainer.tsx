"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/MagicAuthProvider";
import type { PaymentExplanation, PaymentContext } from "@/types";

interface Props {
  context: PaymentContext;
  onPay: () => void;
  isProcessing?: boolean;
}

export function AIPaymentExplainer({ context, onPay, isProcessing }: Props) {
  const { isAuthenticated } = useAuth();
  const [explanation, setExplanation] = useState<PaymentExplanation | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchExplanation = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/ai/explain-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(context),
        });
        if (res.ok) {
          const data = await res.json();
          setExplanation(data);
        }
      } catch (e) {
        console.error("Failed to get payment explanation:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchExplanation();
  }, [isAuthenticated, context]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span>Payment Assistant</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : explanation ? (
          <>
            <p className="text-sm">{explanation.summary}</p>

            <div className="space-y-2">
              {explanation.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-muted-foreground mt-0.5">•</span>
                  <span className="text-muted-foreground">{step}</span>
                </div>
              ))}
            </div>

            <details className="text-xs text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">
                Advanced details
              </summary>
              <div className="mt-2 space-y-1 pl-4 border-l">
                <p>Source balance: {context.sourceChain} USDC</p>
                <p>Destination: {context.destinationChain}</p>
                <p>Execution: {context.paymentRail}</p>
                <p>Wallet: {context.walletProvider}</p>
                <p>Delivery: {context.deliverable}</p>
              </div>
            </details>
          </>
        ) : null}

        <Button
          onClick={onPay}
          disabled={isProcessing || !explanation}
          className="w-full"
          size="lg"
        >
          {isProcessing
            ? "Processing..."
            : `Pay ${context.price} ${context.currency}`}
        </Button>
      </CardContent>
    </Card>
  );
}
