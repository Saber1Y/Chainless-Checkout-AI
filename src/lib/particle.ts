import { UniversalAccount } from "@particle-network/universal-account-sdk";
import { ethers } from "ethers";
import { config } from "@/config";

let uaInstance: UniversalAccount | null = null;

const PAYMENT_SETTLEMENT_ABI = [
  "function merchant() external view returns (address)",
  "function receivePayment(address buyer, string calldata productId, uint256 amount) external returns (bytes32)",
  "function usdc() external view returns (address)",
];

export function getUniversalAccount(ownerAddress: string): UniversalAccount {
  if (!uaInstance || (uaInstance as any)["ownerAddress"] !== ownerAddress) {
    uaInstance = new UniversalAccount({
      projectId: config.particle.projectId,
      projectClientKey: config.particle.clientKey,
      projectAppUuid: config.particle.appId,
      smartAccountOptions: {
        useEIP7702: true,
        name: "UNIVERSAL",
        version: "1.0.0",
        ownerAddress,
      },
      tradeConfig: {
        slippageBps: 100,
      },
    });
  }
  return uaInstance;
}

export async function getUnifiedBalance(ownerAddress: string) {
  const ua = getUniversalAccount(ownerAddress);
  return ua.getPrimaryAssets();
}

export async function getMerchantAddress(): Promise<string> {
  const provider = new ethers.JsonRpcProvider(config.chains.arbitrumSepolia.rpc);
  const contract = new ethers.Contract(
    config.contracts.paymentSettlement,
    PAYMENT_SETTLEMENT_ABI,
    provider
  );
  return contract.merchant();
}

export async function createCrossChainPayment(
  ownerAddress: string,
  signer: ethers.JsonRpcSigner,
  params: {
    amount: string;
    receiver: string;
    chainId: number;
    tokenAddress: string;
  }
) {
  const ua = getUniversalAccount(ownerAddress);

  const transaction = await ua.createTransferTransaction({
    token: {
      chainId: params.chainId,
      address: params.tokenAddress,
    },
    amount: params.amount,
    receiver: params.receiver,
  });

  const signFn = async (hash: Uint8Array) => {
    return signer.signMessage(hash);
  };

  const signature = await signFn(
    new Uint8Array(Buffer.from(transaction.rootHash.slice(2), "hex"))
  );

  const result = await ua.sendTransaction(transaction, signature);
  return result;
}
