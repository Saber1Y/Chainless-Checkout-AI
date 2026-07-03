import { config } from "@/config";
import type {
  GeneratedProduct,
  PaymentExplanation,
  PaymentContext,
  BuilderKit,
} from "@/types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

async function callOpenRouter(systemPrompt: string, userMessage: string) {
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.openrouter.apiKey}`,
      "HTTP-Referer": config.openrouter.siteUrl,
      "X-OpenRouter-Title": config.openrouter.siteName,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.openrouter.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Empty response from OpenRouter");
  }

  return JSON.parse(content);
}

const PRODUCT_GENERATOR_SYSTEM = `You are a checkout generator for Chainless Checkout AI.
Given a merchant's description of what they want to sell, generate a structured product configuration.

Rules:
- Price must be between 0.1 and 20 USDC
- Settlement chain must be "Arbitrum Sepolia"
- Deliverable must be "NFT_ACCESS_PASS"
- Currency must be "USDC"
- Description max 200 characters

Return valid JSON with these exact fields:
{
  "name": "string",
  "price": "string (number as string)",
  "currency": "USDC",
  "settlementChain": "Arbitrum Sepolia",
  "description": "string (max 200 chars)",
  "deliverable": "NFT_ACCESS_PASS",
  "gatedContentTitle": "string",
  "nftMetadata": {
    "name": "string",
    "description": "string",
    "image": "string (optional, empty string if none)",
    "attributes": [{ "trait_type": "string", "value": "string" }]
  }
}`;

const PAYMENT_EXPLAINER_SYSTEM = `You are a payment assistant for Chainless Checkout AI.
Given the payment context, explain the cross-chain payment in plain English.
The explanation should be friendly, clear, and avoid technical jargon.

Return valid JSON:
{
  "summary": "string (1-2 sentences explaining the payment clearly)",
  "steps": ["string", "string", "string"],
  "advancedDetails": "string (1 sentence technical note)"
}`;

const BUILDER_KIT_SYSTEM = `You are a builder kit generator for Chainless Checkout AI.
Given the user's description of what they're building, generate a personalized builder kit.
The kit should help them build and demo their hackathon project effectively.

Return valid JSON:
{
  "projectPositioning": "string (one sentence positioning)",
  "bestDemoFlow": ["string", "string", "string", "string", "string"],
  "recommendedPitch": "string (2-3 sentences)",
  "technicalChecklist": ["string", "string", "string", "string", "string"],
  "uiChecklist": ["string", "string", "string", "string"],
  "suggestedName": "string"
}`;

export async function generateProduct(
  prompt: string
): Promise<GeneratedProduct> {
  const result = await callOpenRouter(PRODUCT_GENERATOR_SYSTEM, prompt);
  validateGeneratedProduct(result);
  return result;
}

export async function explainPayment(
  context: PaymentContext
): Promise<PaymentExplanation> {
  const contextStr = JSON.stringify(context, null, 2);
  const result = await callOpenRouter(
    PAYMENT_EXPLAINER_SYSTEM,
    `Explain this payment to the user:\n${contextStr}`
  );
  return result;
}

export async function generateBuilderKit(
  userGoal: string
): Promise<BuilderKit> {
  const result = await callOpenRouter(
    BUILDER_KIT_SYSTEM,
    `Generate a builder kit for someone building: ${userGoal}`
  );
  return result;
}

function validateGeneratedProduct(product: any): asserts product is GeneratedProduct {
  const errors: string[] = [];

  if (!product.name || typeof product.name !== "string") {
    errors.push("Missing or invalid name");
  }

  const price = parseFloat(product.price);
  if (isNaN(price) || price < 0.1 || price > 20) {
    errors.push("Price must be between 0.1 and 20 USDC");
  }

  if (product.currency !== "USDC") {
    errors.push("Currency must be USDC");
  }

  if (product.settlementChain !== "Arbitrum Sepolia") {
    errors.push("Settlement chain must be Arbitrum Sepolia");
  }

  if (product.deliverable !== "NFT_ACCESS_PASS") {
    errors.push("Deliverable must be NFT_ACCESS_PASS");
  }

  if (!product.description || product.description.length > 200) {
    errors.push("Description must be 1-200 characters");
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join("; ")}`);
  }
}
