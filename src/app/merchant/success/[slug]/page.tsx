"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { IoCheckmark, IoCopy, IoEye } from "react-icons/io5";
import type { Product } from "@/types";

const AI_ASSETS = [
  "Product copy",
  "NFT metadata",
  "Gated page intro",
  "Receipt message",
  "Builder kit template",
];

export default function MerchantSuccessPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/checkout/resolve?slug=${slug}`);
        if (!res.ok) throw new Error("Product not found");
        setProduct(await res.json());
      } catch (e) {
        console.error("Failed to load product:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const checkoutUrl = `${window.location.origin}/pay/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(checkoutUrl);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-64 w-full max-w-md" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const nftName =
    product.nftMetadata && typeof product.nftMetadata === "object" && !Array.isArray(product.nftMetadata)
      ? ((product.nftMetadata as Record<string, unknown>).name as string) || product.name
      : product.name;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between p-4 sm:p-6 border-b">
        <Link href="/" className="font-semibold text-lg hover:opacity-80">
          Chainless Checkout AI
        </Link>
      </header>

      <main className="flex-1 p-4 sm:p-6 max-w-md mx-auto w-full space-y-6 pt-16">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-2">
            <IoCheckmark className="text-green-600 dark:text-green-400 text-xl" />
          </div>
          <h1 className="text-2xl font-bold">Your checkout is live</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{product.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Price</span>
              <Badge variant="secondary">
                {product.price} {product.currency}
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Settlement</span>
              <span className="font-medium">{product.settlementChain}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery</span>
              <span className="font-medium">NFT Access Pass + AI Builder Kit</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Checkout link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-muted p-2 rounded truncate">
                {checkoutUrl}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                title="Copy link"
              >
                <IoCopy className="h-4 w-4" />
              </Button>
            </div>
            <Link href={`/pay/${slug}`}>
              <Button variant="outline" className="w-full gap-2">
                <IoEye className="h-4 w-4" />
                Open Buyer Demo
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Generated by AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-1">
              {AI_ASSETS.map((asset) => (
                <div
                  key={asset}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <IoCheckmark className="text-green-500 shrink-0 h-3 w-3" />
                  {asset}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex gap-3">
          <Link href="/merchant" className="flex-1">
            <Button variant="outline" className="w-full">
              Dashboard
            </Button>
          </Link>
          <Link href="/merchant/create" className="flex-1">
            <Button className="w-full">Create Another</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
