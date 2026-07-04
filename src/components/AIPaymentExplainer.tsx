"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/MagicAuthProvider";
import { getUnifiedBalance } from "@/lib/particle";
import type { PaymentExplanation, PaymentContext } from "@/types";

interface Props {
  context: PaymentContext;
  onPay: () => void;
  isProcessing?: boolean;
}

export function AIPaymentExplainer({ context, onPay, isProcessing }: Props) {
  const { isAuthenticated, address } = useAuth();
  const [explanation, setExplanation] = useState<PaymentExplanation | null>(null);
  const [balanceFound, setBalanceFound] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !address) return;

    const init = async () => {
      setLoading(true);

      try {
        const assets = await getUnifiedBalance(address);
        const usd = assets.totalAmountInUSD;
        const price = parseFloat(context.price);
        setBalanceFound(!!usd && parseFloat(usd) >= price);
      } catch {
        setBalanceFound(false);
      }

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

    init();
  }, [isAuthenticated, address, context]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span>Payment Assistant</span>
          {balanceFound === true && (
            <Badge variant="secondary" className="text-xs">
              Balance OK
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          <>
            {balanceFound === true && (
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                I found enough test USDC in your universal balance.
              </p>
            )}
            {balanceFound === false && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Unable to confirm a sufficient balance. You may need test USDC.
              </p>
            )}

            <div className="space-y-1 text-sm">
              <p>
                You can pay {context.price} {context.currency} for{" "}
                {context.productName}.
              </p>
              <p>
                The merchant will receive settlement on {context.destinationChain}.
              </p>
              <p>Your access pass will be minted on {context.destinationChain}.</p>
            </div>

            <details className="text-xs text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground text-sm font-medium">
                Advanced details
              </summary>
              <div className="mt-2 space-y-1.5 pl-4 border-l">
                <p>
                  Source balance: {context.sourceChain} {context.currency}
                </p>
                <p>Destination: {context.destinationChain}</p>
                <p>Execution: {context.paymentRail}</p>
                <p>Wallet: {context.walletProvider}</p>
                <p>Delivery: {context.deliverable}</p>
              </div>
            </details>
          </>
        )}

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
