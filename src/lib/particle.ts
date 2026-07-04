import { UniversalAccount } from "@particle-network/universal-account-sdk";
import { config } from "@/config";

let uaInstance: UniversalAccount | null = null;

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

export async function createCrossChainPayment(
  ownerAddress: string,
  signer: (hash: Uint8Array) => Promise<string>,
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

  const signature = await signer(new Uint8Array(Buffer.from(transaction.rootHash.slice(2), "hex")));

  const result = await ua.sendTransaction(transaction, signature);

  return result;
}
