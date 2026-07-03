import { pgTable, uuid, text, timestamp, jsonb, numeric } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  merchantAddress: text("merchant_address").notNull(),
  name: text("name").notNull(),
  price: numeric("price").notNull(),
  currency: text("currency").default("USDC").notNull(),
  description: text("description"),
  settlementChain: text("settlement_chain").default("Arbitrum Sepolia").notNull(),
  deliverable: text("deliverable").default("NFT_ACCESS_PASS"),
  gatedContentTitle: text("gated_content_title"),
  nftMetadata: jsonb("nft_metadata"),
  slug: text("slug").unique().notNull(),
  active: text("active").default("true"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const invoices = pgTable("invoices", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id),
  buyerAddress: text("buyer_address").notNull(),
  amount: numeric("amount").notNull(),
  currency: text("currency").default("USDC"),
  sourceChain: text("source_chain"),
  destinationChain: text("destination_chain").default("Arbitrum Sepolia"),
  settlementTx: text("settlement_tx"),
  nftTokenId: text("nft_token_id"),
  nftContractAddress: text("nft_contract_address"),
  status: text("status").default("pending"),
  aiPrompt: text("ai_prompt"),
  aiKitJson: jsonb("ai_kit_json"),
  receiptJson: jsonb("receipt_json"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
