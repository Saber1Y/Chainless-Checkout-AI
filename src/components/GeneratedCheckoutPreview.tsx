"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { GeneratedProduct } from "@/types";

interface Props {
  product: GeneratedProduct;
  onEdit: () => void;
  onPublish: () => void;
  isPublishing?: boolean;
}

export function GeneratedCheckoutPreview({
  product,
  onEdit,
  onPublish,
  isPublishing,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Generated Checkout</span>
          <Badge variant="secondary">AI Generated</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Product name</span>
            <span className="text-sm font-medium">{product.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="text-sm font-medium">
              {product.price} {product.currency}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Settlement</span>
            <span className="text-sm font-medium">{product.settlementChain}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Buyer receives</span>
            <span className="text-sm font-medium">Arbitrum Access Pass NFT</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Unlocked content</span>
            <span className="text-sm font-medium">
              {product.gatedContentTitle}
            </span>
          </div>
        </div>

        <Separator />

        <div>
          <span className="text-sm text-muted-foreground">Description</span>
          <p className="text-sm mt-1">{product.description}</p>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onEdit} className="flex-1">
            Edit
          </Button>
          <Button onClick={onPublish} disabled={isPublishing} className="flex-1">
            {isPublishing ? "Creating..." : "Create Checkout Link"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
