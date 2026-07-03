import { network } from "hardhat";

const { ethers, networkName } = await network.create();

console.log(`Deploying to ${networkName}...`);

const [deployer] = await ethers.getSigners();
console.log("Deploying with account:", deployer.address);
console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

const USDC_ADDRESS = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d";
const MERCHANT_ADDRESS = deployer.address;

// Deploy PaymentSettlement
const PaymentSettlement = await ethers.getContractFactory("PaymentSettlement");
const settlement = await PaymentSettlement.deploy(USDC_ADDRESS, MERCHANT_ADDRESS);
await settlement.waitForDeployment();
const settlementAddress = await settlement.getAddress();
console.log("PaymentSettlement deployed to:", settlementAddress);

// Deploy AccessPassNFT
const AccessPassNFT = await ethers.getContractFactory("AccessPassNFT");
const nft = await AccessPassNFT.deploy(
  deployer.address,
  deployer.address,
  "https://api.chainless.app/metadata/"
);
await nft.waitForDeployment();
const nftAddress = await nft.getAddress();
console.log("AccessPassNFT deployed to:", nftAddress);

console.log("\nDeployment complete!");
console.log("PaymentSettlement:", settlementAddress);
console.log("AccessPassNFT:", nftAddress);
