"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { GeneratedProduct } from "@/types";

interface Props {
  product: GeneratedProduct;
  onContinue: () => void;
  isLoading?: boolean;
}

export function CheckoutProductCard({ product, onContinue, isLoading }: Props) {
  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">{product.name}</CardTitle>
        <Badge variant="secondary" className="w-fit">
          {product.price} {product.currency}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{product.description}</p>

        <Separator />

        <div className="space-y-2">
          <p className="text-sm font-medium">Includes:</p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Arbitrum access pass
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>{" "}
              {product.gatedContentTitle}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Private resource page
            </li>
          </ul>
        </div>

        <Separator />

        <p className="text-xs text-muted-foreground text-center">
          Pay from your available balance. No bridge. No chain switching. No gas
          confusion.
        </p>

        <Button
          onClick={onContinue}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? "Loading..." : "Continue"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Powered by Particle Universal Accounts, Magic, and Arbitrum
        </p>
      </CardContent>
    </Card>
  );
}
