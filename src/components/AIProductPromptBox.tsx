"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import type { GeneratedProduct } from "@/types";

interface Props {
  onGenerated: (product: GeneratedProduct) => void;
}

export function AIProductPromptBox({ onGenerated }: Props) {
  const [prompt, setPrompt] = useState("");
  const { isGenerating, setIsGenerating, setError } = useStore();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/generate-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }

      const product = await res.json();
      onGenerated(product);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          What do you want to sell?
        </label>
        <Textarea
          placeholder='Example: "Create a 2 USDC pass for UXMaxx builders. After payment, users should receive an Arbitrum NFT pass and unlock a personalized AI resource pack."'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </div>
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
        className="w-full"
      >
        {isGenerating ? "Generating..." : "Generate Checkout"}
      </Button>
    </div>
  );
}
