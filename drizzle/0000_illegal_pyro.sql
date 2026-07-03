CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"buyer_address" text NOT NULL,
	"amount" numeric NOT NULL,
	"currency" text DEFAULT 'USDC',
	"source_chain" text,
	"destination_chain" text DEFAULT 'Arbitrum Sepolia',
	"settlement_tx" text,
	"nft_token_id" text,
	"nft_contract_address" text,
	"status" text DEFAULT 'pending',
	"ai_prompt" text,
	"ai_kit_json" jsonb,
	"receipt_json" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"merchant_address" text NOT NULL,
	"name" text NOT NULL,
	"price" numeric NOT NULL,
	"currency" text DEFAULT 'USDC' NOT NULL,
	"description" text,
	"settlement_chain" text DEFAULT 'Arbitrum Sepolia' NOT NULL,
	"deliverable" text DEFAULT 'NFT_ACCESS_PASS',
	"gated_content_title" text,
	"nft_metadata" jsonb,
	"slug" text NOT NULL,
	"active" text DEFAULT 'true',
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;