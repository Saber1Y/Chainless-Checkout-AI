import { config } from "@/config";
import { ethers } from "ethers";
import PaymentSettlement from "@/../artifacts/contracts/PaymentSettlement.sol/PaymentSettlement.json";
import AccessPassNFT from "@/../artifacts/contracts/AccessPassNFT.sol/AccessPassNFT.json";

const provider = new ethers.JsonRpcProvider(config.chains.arbitrumSepolia.rpc);

export function getSettlementContract(signer?: ethers.Signer) {
  const _signer = signer || provider;
  return new ethers.Contract(
    config.contracts.paymentSettlement,
    PaymentSettlement.abi,
    _signer
  );
}

export function getNFTContract(signer?: ethers.Signer) {
  const _signer = signer || provider;
  return new ethers.Contract(
    config.contracts.accessPassNFT,
    AccessPassNFT.abi,
    _signer
  );
}

export async function getPaymentDetails(invoiceId: string) {
  const contract = getSettlementContract();
  return contract.getPayment(invoiceId);
}

export async function getMerchantPayments(merchantAddress: string) {
  const contract = getSettlementContract();
  return contract.getMerchantPayments(merchantAddress);
}

export async function hasAccessPass(userAddress: string, passType: number) {
  const contract = getNFTContract();
  return contract.hasAccess(userAddress, passType);
}
