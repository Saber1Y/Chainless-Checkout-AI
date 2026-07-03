"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MagicLoginButton } from "@/components/MagicLoginButton";
import { AIProductPromptBox } from "@/components/AIProductPromptBox";
import { GeneratedCheckoutPreview } from "@/components/GeneratedCheckoutPreview";
import { UniversalAccountStatus } from "@/components/UniversalAccountStatus";
import { useAuth } from "@/components/MagicAuthProvider";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import type { GeneratedProduct } from "@/types";

export default function MerchantCreatePage() {
  const { isAuthenticated, address } = useAuth();
  const router = useRouter();
  const { currentProduct, setCurrentProduct, isGenerating } = useStore();
  const [isPublishing, setIsPublishing] = useState(false);

  const handleGenerated = (product: GeneratedProduct) => {
    setCurrentProduct(product);
    toast.success("Checkout generated successfully!");
  };

  const handlePublish = async () => {
    if (!currentProduct || !address) return;

    setIsPublishing(true);
    try {
      const slug = currentProduct.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantAddress: address,
          name: currentProduct.name,
          price: currentProduct.price,
          description: currentProduct.description,
          slug,
          nftMetadata: currentProduct.nftMetadata,
          gatedContentTitle: currentProduct.gatedContentTitle,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create checkout");
      }

      toast.success("Checkout link created!");
      router.push(`/merchant`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between p-4 sm:p-6 border-b">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-semibold text-lg hover:opacity-80">
            Chainless Checkout AI
          </Link>
          <span className="text-sm text-muted-foreground">
            / Create Checkout
          </span>
        </div>
        <div className="flex items-center gap-3">
          <UniversalAccountStatus />
          <MagicLoginButton />
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 max-w-2xl mx-auto w-full">
        {!isAuthenticated ? (
          <div className="text-center py-16 space-y-4">
            <h1 className="text-2xl font-bold">Create your checkout</h1>
            <p className="text-muted-foreground">Sign in to continue.</p>
            <MagicLoginButton />
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold">AI Checkout Builder</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Describe what you want to sell. AI will generate your checkout
                page, NFT metadata, and gated content.
              </p>
            </div>

            <AIProductPromptBox onGenerated={handleGenerated} />

            {currentProduct && (
              <GeneratedCheckoutPreview
                product={currentProduct}
                onEdit={() => setCurrentProduct(null)}
                onPublish={handlePublish}
                isPublishing={isPublishing}
              />
            )}

            {isGenerating && (
              <div className="text-center py-8 text-sm text-muted-foreground">
                AI is generating your checkout...
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
