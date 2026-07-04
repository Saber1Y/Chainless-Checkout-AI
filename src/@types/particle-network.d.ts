declare module "@particle-network/universal-account-sdk" {
  export class UniversalAccount {
    constructor(config: {
      projectId: string;
      projectClientKey: string;
      projectAppUuid: string;
      smartAccountOptions: {
        useEIP7702: boolean;
        name: string;
        version: string;
        ownerAddress: string;
      };
      tradeConfig: {
        slippageBps: number;
      };
    });

    getPrimaryAssets(): Promise<{
      totalAmountInUSD: string;
    }>;

    createTransferTransaction(params: {
      token: {
        chainId: number;
        address: string;
      };
      amount: string;
      receiver: string;
    }): Promise<{
      rootHash: string;
    }>;

    sendTransaction(
      transaction: { rootHash: string },
      signature: string
    ): Promise<any>;
  }
}
