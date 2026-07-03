"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckoutProductCard } from "@/components/CheckoutProductCard";
import { MagicLoginButton } from "@/components/MagicLoginButton";
import { AIPaymentExplainer } from "@/components/AIPaymentExplainer";
import { UniversalAccountStatus } from "@/components/UniversalAccountStatus";
import { useAuth } from "@/components/MagicAuthProvider";
import { useRouter } from "next/navigation";
import type { GeneratedProduct, PaymentContext } from "@/types";

export default function PayPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, address } = useAuth();
  const [product, setProduct] = useState<GeneratedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const id = params.id as string;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/checkout/resolve?slug=${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (e) {
        console.error("Failed to load product:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleContinue = () => {
    if (!isAuthenticated) {
      setShowPayment(true);
      return;
    }
    setShowPayment(true);
  };

  const handlePay = async () => {
    if (!address || !product) return;

    setIsProcessing(true);

    try {
      router.push(`/pay/${id}/processing`);
    } catch (e) {
      console.error("Payment failed:", e);
      setIsProcessing(false);
    }
  };

  const paymentContext: PaymentContext = {
    productName: product?.name || "",
    price: product?.price || "0",
    currency: "USDC",
    sourceChain: "Base Sepolia",
    destinationChain: "Arbitrum Sepolia",
    paymentRail: "Particle Universal Accounts",
    walletProvider: "Magic",
    deliverable: "Arbitrum NFT access pass",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading checkout...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link href="/">Go home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between p-4 sm:p-6 border-b">
        <Link href="/" className="font-semibold text-lg hover:opacity-80">
          Chainless Checkout AI
        </Link>
        <div className="flex items-center gap-3">
          <UniversalAccountStatus />
          <MagicLoginButton />
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 flex items-start justify-center pt-16">
        <div className="w-full max-w-lg space-y-6">
          {!showPayment ? (
            <CheckoutProductCard
              product={product}
              onContinue={handleContinue}
            />
          ) : !isAuthenticated ? (
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold">Continue to payment</h2>
              <MagicLoginButton />
            </div>
          ) : (
            <AIPaymentExplainer
              context={paymentContext}
              onPay={handlePay}
              isProcessing={isProcessing}
            />
          )}
        </div>
      </main>
    </div>
  );
}
