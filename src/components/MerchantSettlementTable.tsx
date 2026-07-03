"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Settlement {
  invoiceId: string;
  productName: string;
  buyerAddress: string;
  amount: string;
  sourceChain: string;
  settlementChain: string;
  nftTokenId: string | null;
  aiGenerated: boolean;
  status: string;
}

interface Props {
  settlements: Settlement[];
}

export function MerchantSettlementTable({ settlements }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Settlements</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Settled on</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>AI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {settlements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No settlements yet
                </TableCell>
              </TableRow>
            ) : (
              settlements.map((s) => (
                <TableRow key={s.invoiceId}>
                  <TableCell className="font-medium">{s.productName}</TableCell>
                  <TableCell className="text-xs">
                    {s.buyerAddress.slice(0, 6)}...{s.buyerAddress.slice(-4)}
                  </TableCell>
                  <TableCell>{s.amount} USDC</TableCell>
                  <TableCell>{s.sourceChain}</TableCell>
                  <TableCell>{s.settlementChain}</TableCell>
                  <TableCell>
                    {s.nftTokenId ? (
                      <Badge variant="outline">Pass #{s.nftTokenId}</Badge>
                    ) : (
                      <span className="text-muted-foreground">Pending</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {s.aiGenerated ? (
                      <Badge variant="secondary">Generated</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
