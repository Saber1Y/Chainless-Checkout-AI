export interface GeneratedProduct {
  name: string;
  price: string;
  currency: "USDC";
  settlementChain: "Arbitrum Sepolia";
  description: string;
  deliverable: "NFT_ACCESS_PASS";
  gatedContentTitle: string;
  nftMetadata: {
    name: string;
    description: string;
    image?: string;
    attributes: { trait_type: string; value: string }[];
  };
}

export interface PaymentExplanation {
  summary: string;
  steps: string[];
  advancedDetails: string;
  canProceed: boolean;
  reason?: string;
}

export interface BuilderKit {
  projectPositioning: string;
  bestDemoFlow: string[];
  recommendedPitch: string;
  technicalChecklist: string[];
  uiChecklist: string[];
  suggestedName: string;
}

export interface PaymentContext {
  productName: string;
  price: string;
  currency: string;
  sourceChain: string;
  destinationChain: string;
  paymentRail: string;
  walletProvider: string;
  deliverable: string;
}

export interface ProgressStep {
  label: string;
  status: "pending" | "in_progress" | "completed" | "failed";
}

export interface InvoiceReceipt {
  invoiceId: string;
  productName: string;
  amount: string;
  currency: string;
  buyerAddress: string;
  sourceChain: string;
  settlementChain: string;
  settlementTx: string;
  nftTokenId: string;
  nftContractAddress: string;
  status: string;
  createdAt: string;
}
