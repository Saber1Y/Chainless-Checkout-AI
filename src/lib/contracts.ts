import { config } from "@/config";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(config.chains.arbitrumSepolia.rpc);

const PAYMENT_SETTLEMENT_ABI = [
  "function receivePayment(address buyer, string calldata productId, uint256 amount) external returns (bytes32)",
  "function getPayment(bytes32 invoiceId) external view returns (tuple(address buyer, string productId, uint256 amount, uint256 timestamp, bool settled))",
  "function getMerchantPayments(address merchantAddress) external view returns (bytes32[])",
  "function merchant() external view returns (address)",
  "function paymentCount() external view returns (uint256)",
  "event PaymentSettled(bytes32 indexed invoiceId, address indexed buyer, address indexed merchant, string productId, uint256 amount, uint256 timestamp)",
];

const ACCESS_PASS_NFT_ABI = [
  "function mintPass(address to, uint256 passType, string memory metadataURI) external returns (uint256)",
  "function mintPassWithProduct(address to, uint256 passType, string memory productId, string memory metadataURI) external returns (uint256)",
  "function hasAccess(address user, uint256 passType) external view returns (bool)",
  "function getUserPasses(address user) external view returns (uint256[])",
  "function totalSupply() external view returns (uint256)",
  "event PassMinted(uint256 indexed tokenId, address indexed recipient, uint256 passType, string productId, string metadataURI)",
];

export function getSettlementContract(signer?: ethers.Signer) {
  const _signer = signer || provider;
  return new ethers.Contract(
    config.contracts.paymentSettlement,
    PAYMENT_SETTLEMENT_ABI,
    _signer
  );
}

export function getNFTContract(signer?: ethers.Signer) {
  const _signer = signer || provider;
  return new ethers.Contract(
    config.contracts.accessPassNFT,
    ACCESS_PASS_NFT_ABI,
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
