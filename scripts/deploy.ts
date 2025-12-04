import { ethers } from "hardhat";

/**
 * Deployment Script: ConfidentialMedicalRecords
 *
 * Deploys the privacy-preserving medical records contract
 * to the configured network
 *
 * Usage:
 * ```bash
 * npx hardhat run scripts/deploy.ts --network sepolia
 * ```
 */
async function main() {
  console.log("🏥 Deploying ConfidentialMedicalRecords Contract...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📍 Deploying with account:", deployer.address);

  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(
    "💰 Account balance:",
    ethers.formatEther(balance),
    "ETH\n"
  );

  // Get the contract factory
  console.log("🔨 Compiling contracts...");
  const ConfidentialMedicalRecords = await ethers.getContractFactory(
    "ConfidentialMedicalRecords"
  );

  // Deploy the contract
  console.log("🚀 Deploying contract...");
  const contract = await ConfidentialMedicalRecords.deploy();

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("\n✅ Contract deployed successfully!");
  console.log("📬 Contract address:", contractAddress);

  // Get network information
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, "(Chain ID:", network.chainId, ")");

  // Display initial contract stats
  console.log("\n📊 Initial Contract State:");
  const stats = await contract.getSystemStats();
  console.log("   Total Patients:", stats.totalPatients.toString());
  console.log("   Total Records:", stats.totalRecords.toString());
  console.log("   Total Requests:", stats.totalRequests.toString());

  // Display owner information
  const owner = await contract.owner();
  console.log("\n👤 Contract Owner:", owner);

  // Save deployment information
  console.log("\n📝 Deployment Information:");
  console.log("┌─────────────────────────────────────────────────────────────┐");
  console.log("│ Save this information for frontend configuration:          │");
  console.log("├─────────────────────────────────────────────────────────────┤");
  console.log(`│ Contract Address: ${contractAddress}`);
  console.log(`│ Network: ${network.name} (Chain ID: ${network.chainId})`);
  console.log(`│ Owner: ${owner}`);
  console.log("└─────────────────────────────────────────────────────────────┘");

  console.log("\n🎉 Deployment complete!");
  console.log("\nNext steps:");
  console.log("1. Update the contract address in your frontend (script.js)");
  console.log("2. Authorize doctors using: contract.authorizeDoctor(doctorAddress)");
  console.log("3. Register patients using: contract.registerPatient(emergencyCode)");
  console.log("4. Create medical records using: contract.createMedicalRecord(...)");

  // If on testnet, provide verification command
  if (network.chainId === 11155111n) {
    console.log("\n🔍 To verify the contract on Etherscan:");
    console.log(`npx hardhat verify --network sepolia ${contractAddress}`);
  }
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
