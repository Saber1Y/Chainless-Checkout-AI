import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { products, invoices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ethers } from "ethers";

const ACCESS_PASS_NFT_ABI = [
  "function mintPassWithProduct(address to, uint256 passType, string memory productId, string memory metadataURI) external returns (uint256)",
  "function totalSupply() external view returns (uint256)",
];

async function getArbitrumProvider() {
  return new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc");
}

async function getDeployerWallet() {
  const pk = process.env.DEPLOYER_PRIVATE_KEY;
  if (!pk) return null;
  const provider = await getArbitrumProvider();
  return new ethers.Wallet(pk, provider);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productSlug, buyerAddress, sourceChain } = body;

    if (!productSlug || !buyerAddress) {
      return NextResponse.json(
        { error: "productSlug and buyerAddress required" },
        { status: 400 }
      );
    }

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.slug, productSlug));

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const nftAddress = process.env.NEXT_PUBLIC_ACCESS_PASS_NFT_ADDRESS || "";

    const [invoice] = await db
      .insert(invoices)
      .values({
        productId: product.id,
        buyerAddress,
        amount: product.price,
        currency: "USDC",
        sourceChain: sourceChain || "Base Sepolia",
        destinationChain: "Arbitrum Sepolia",
        status: "pending",
      })
      .returning();

    let nftTokenId: string | null = null;
    let processStatus = "pending";

    try {
      const wallet = await getDeployerWallet();
      if (wallet) {
        const nft = new ethers.Contract(nftAddress, ACCESS_PASS_NFT_ABI, wallet);
        const totalSupply = await nft.totalSupply();
        const nextId = Number(totalSupply) + 1;
        const metadataURI = `https://chainless-checkout.vercel.app/api/metadata/${product.slug}`;
        const tx = await nft.mintPassWithProduct(
          buyerAddress,
          nextId,
          invoice.id,
          metadataURI
        );
        const receipt = await tx.wait();
        nftTokenId = String(nextId);
        processStatus = "settled";
      }
    } catch (e) {
      console.warn("NFT minting failed (demo mode — invoice still created):", e);
    }

    const [updated] = await db
      .update(invoices)
      .set({
        status: processStatus,
        nftTokenId,
        nftContractAddress: nftAddress || null,
      })
      .where(eq(invoices.id, invoice.id))
      .returning();

    return NextResponse.json({
      invoice: updated,
      product: {
        name: product.name,
        description: product.description,
        nftMetadata: product.nftMetadata,
      },
    });
  } catch (e: any) {
    console.error("Process error:", e);
    return NextResponse.json(
      { error: e.message || "Processing failed" },
      { status: 500 }
    );
  }
}
