const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying ClaimLedger with account:", deployer.address);

  const ClaimLedger = await ethers.getContractFactory("ClaimLedger");
  const contract = await ClaimLedger.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ ClaimLedger deployed to:", address);

  // Save address to file for backend to read
  const deployInfo = {
    address,
    deployer: deployer.address,
    network: "localhost (Hardhat)",
    chainId: 31337,
    deployedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(__dirname, "../backend/.contract_address.json"),
    JSON.stringify(deployInfo, null, 2)
  );
  console.log("📝 Contract address saved to backend/.contract_address.json");
  console.log("   Set CLAIM_LEDGER_ADDRESS=" + address + " in your backend .env");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
