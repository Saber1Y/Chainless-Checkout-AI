"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/MagicAuthProvider";
import { MagicLoginButton } from "@/components/MagicLoginButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import type { Product } from "@/types";

export default function MerchantDashboard() {
  const { address, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }
    fetch(`/api/merchant/products?address=${address}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [address]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between p-4 sm:p-6 border-b">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-semibold text-lg hover:opacity-80">
            Chainless Checkout AI
          </Link>
          <span className="text-sm text-muted-foreground">/ Dashboard</span>
        </div>
        <MagicLoginButton />
      </header>

      <main className="flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            {isAuthenticated && (
              <p className="text-sm text-muted-foreground">
                Settlement: Arbitrum Sepolia
              </p>
            )}
          </div>
          {isAuthenticated && (
            <Link href="/merchant/create">
              <Button>New Product</Button>
            </Link>
          )}
        </div>

        {!isAuthenticated ? (
          <div className="text-center py-16 space-y-4">
            <h2 className="text-xl font-semibold">Sign in to continue</h2>
            <p className="text-muted-foreground">
              Sign in to manage your products and view settlements.
            </p>
            <MagicLoginButton />
          </div>
        ) : loading ? (
          <div className="text-center py-16 text-muted-foreground">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>No products yet. Create your first checkout.</p>
            <Link href="/merchant/create">
              <Button className="mt-4">Create a Checkout</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{product.name}</span>
                    <Badge variant="secondary">${product.price} USDC</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Slug</span>
                    <code className="text-xs">{product.slug}</code>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Checkout link</span>
                    <Link
                      href={`/pay/${product.slug}`}
                      className="text-primary hover:underline"
                    >
                      /pay/{product.slug}
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
