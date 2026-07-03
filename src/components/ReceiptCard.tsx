"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { InvoiceReceipt } from "@/types";

interface Props {
  receipt: InvoiceReceipt;
}

export function ReceiptCard({ receipt }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Payment Receipt</span>
          <Badge variant="outline">#{receipt.nftTokenId}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Product</span>
            <span className="text-sm font-medium">{receipt.productName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Amount</span>
            <span className="text-sm font-medium">
              {receipt.amount} {receipt.currency}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Paid from</span>
            <span className="text-sm font-medium">{receipt.sourceChain}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Settled on</span>
            <span className="text-sm font-medium">
              {receipt.settlementChain}
            </span>
          </div>
        </div>

        <Separator />

        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            Buyer: {receipt.buyerAddress.slice(0, 6)}...
            {receipt.buyerAddress.slice(-4)}
          </p>
          <p>TX: {receipt.settlementTx.slice(0, 10)}...</p>
          <p>
            NFT Pass: #{receipt.nftTokenId} (
            {receipt.nftContractAddress.slice(0, 6)}...)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
