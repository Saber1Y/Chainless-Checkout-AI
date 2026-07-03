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
      } catch (e) {
        console.error("Failed to fetch UA balance:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [address, isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <Badge variant="secondary" className="gap-1">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        Universal Account active
      </Badge>
      {loading ? (
        <Skeleton className="h-4 w-20" />
      ) : balance ? (
        <span className="text-muted-foreground">
          ~${parseFloat(balance).toFixed(2)} USD
        </span>
      ) : null}
    </div>
  );
}
