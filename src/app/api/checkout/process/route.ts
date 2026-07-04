import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { products, invoices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ethers } from "ethers";

const PAYMENT_SETTLEMENT_ABI = [
  "function receivePayment(address buyer, string calldata productId, uint256 amount) external returns (bytes32)",
  "function merchant() external view returns (address)",
];

const ACCESS_PASS_NFT_ABI = [
  "function mintPassWithProduct(address to, uint256 passType, string memory productId, string memory metadataURI) external returns (uint256)",
  "function totalSupply() external view returns (uint256)",
];

async function callWithDeployer<T>(
  contractAddress: string,
  abi: string[],
  method: string,
  args: unknown[]
): Promise<T> {
  const pk = process.env.DEPLOYER_PRIVATE_KEY;
  if (!pk) throw new Error("DEPLOYER_PRIVATE_KEY not set");

  const provider = new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc");
  const wallet = new ethers.Wallet(pk, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  return contract[method](...args);
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

    const settlementAddress = process.env.NEXT_PUBLIC_PAYMENT_SETTLEMENT_ADDRESS || "";
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

    let settlementTx: string | null = null;
    let nftTokenId: string | null = null;
    let processStatus = "pending";

    try {
      const totalSupply = await callWithDeployer<bigint>(
        nftAddress,
        ACCESS_PASS_NFT_ABI,
        "totalSupply",
        []
      );
      const nextTokenId = Number(totalSupply) + 1;
      const metadataURI = `https://chainless-checkout.vercel.app/api/metadata/${product.slug}`;

      const tx = await callWithDeployer<ethers.TransactionResponse>(
        nftAddress,
        ACCESS_PASS_NFT_ABI,
        "mintPassWithProduct",
        [buyerAddress, nextTokenId, invoice.id, metadataURI]
      );
      const receipt = await tx.wait();
      nftTokenId = String(nextTokenId);
      settlementTx = receipt?.hash || null;
      processStatus = "settled";
    } catch (e) {
      console.warn("On-chain processing failed (demo mode):", e);
      processStatus = "pending";
    }

    const [updated] = await db
      .update(invoices)
      .set({
        status: processStatus,
        settlementTx,
        nftTokenId,
        nftContractAddress: nftAddress,
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
