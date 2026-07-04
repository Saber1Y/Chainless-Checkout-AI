export const config = {
  particle: {
    projectId: process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID || "",
    clientKey: process.env.NEXT_PUBLIC_PARTICLE_CLIENT_KEY || "",
    appId: process.env.NEXT_PUBLIC_PARTICLE_APP_ID || "",
  },
  magic: {
    apiKey: process.env.NEXT_PUBLIC_MAGIC_API_KEY || "",
    oidcProviderId: process.env.MAGIC_OIDC_PROVIDER_ID || "",
    secretKey: process.env.MAGIC_SECRET_KEY || "",
  },
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || "",
    model: process.env.OPENROUTER_MODEL || "openrouter/free",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "Chainless Checkout AI",
  },
  contracts: {
    paymentSettlement: (process.env.NEXT_PUBLIC_PAYMENT_SETTLEMENT_ADDRESS || "") as `0x${string}`,
    accessPassNFT: (process.env.NEXT_PUBLIC_ACCESS_PASS_NFT_ADDRESS || "") as `0x${string}`,
  },
  tokens: {
    usdc: {
      baseSepolia: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      arbitrumSepolia: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
    },
  },
  chains: {
    arbitrumSepolia: {
      id: 421614,
      name: "Arbitrum Sepolia",
      rpc: "https://sepolia-rollup.arbitrum.io/rpc",
    },
    baseSepolia: {
      id: 84532,
      name: "Base Sepolia",
      rpc: "https://sepolia.base.org",
    },
  },
  limits: {
    minPrice: 0.1,
    maxPrice: 20,
    allowedCurrency: "USDC",
    allowedSettlementChains: ["Arbitrum Sepolia"],
    allowedDeliverables: ["NFT_ACCESS_PASS"],
  },
};
