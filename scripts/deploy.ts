import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Arbitrum Sepolia USDC (test token address)
  const USDC_ADDRESS = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d";
  const MERCHANT_ADDRESS = deployer.address;

  // Deploy PaymentSettlement
  const PaymentSettlement = await ethers.getContractFactory("PaymentSettlement");
  const settlement = await PaymentSettlement.deploy(USDC_ADDRESS, MERCHANT_ADDRESS);
  await settlement.waitForDeployment();
  const settlementAddress = await settlement.getAddress();
  console.log("PaymentSettlement deployed to:", settlementAddress);

  // Deploy AccessPassNFT (upgradeable)
  const AccessPassNFT = await ethers.getContractFactory("AccessPassNFT");
  const nft = await ethers.deployProxy(AccessPassNFT, [
    deployer.address,
    deployer.address,
    "https://api.chainless.app/metadata/",
  ], { initializer: "initialize" });
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("AccessPassNFT deployed to:", nftAddress);

  console.log("\nDeployment complete!");
  console.log("PaymentSettlement:", settlementAddress);
  console.log("AccessPassNFT:", nftAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
