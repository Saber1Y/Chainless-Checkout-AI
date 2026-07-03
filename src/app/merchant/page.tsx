"use client";

import { useAuth } from "@/components/MagicAuthProvider";
import { MagicLoginButton } from "@/components/MagicLoginButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MerchantDashboard() {
  const { isAuthenticated } = useAuth();

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
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p>No products yet. Create your first checkout.</p>
            <Link href="/merchant/create">
              <Button className="mt-4">Create a Checkout</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
