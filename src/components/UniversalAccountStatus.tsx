"use client";

import { useAuth } from "@/components/MagicAuthProvider";
import { getUnifiedBalance } from "@/lib/particle";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function UniversalAccountStatus() {
  const { address, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !address) return;

    const fetchBalance = async () => {
      setLoading(true);
      try {
        const assets = await getUnifiedBalance(address);
        setBalance(assets.totalAmountInUSD || "0");
      } catch {
        setBalance(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [address, isAuthenticated]);

  if (!isAuthenticated) return null;

  const hasBalance = balance !== null && parseFloat(balance) > 0;

  return (
    <div className="flex items-center gap-2 text-sm">
      <Badge variant={hasBalance ? "secondary" : "outline"} className="gap-1">
        <span
          className={`h-2 w-2 rounded-full ${hasBalance ? "bg-green-500" : "bg-yellow-500"}`}
        />
        {hasBalance ? "Universal Account active" : "UA not activated"}
      </Badge>
      {loading ? (
        <Skeleton className="h-4 w-20" />
      ) : hasBalance ? (
        <span className="text-muted-foreground">
          ~${parseFloat(balance).toFixed(2)} USD
        </span>
      ) : null}
    </div>
  );
}
