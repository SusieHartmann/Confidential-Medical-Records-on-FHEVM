#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";

/**
 * FHEVM Example Scaffolding Tool
 *
 * Creates a new standalone FHEVM example repository based on this template
 * Demonstrates how to scaffold similar projects for other use cases
 *
 * Usage:
 * ```bash
 * npx ts-node scripts/create-example.ts <project-name> [output-dir]
 * ```
 *
 * Example:
 * ```bash
 * npx ts-node scripts/create-example.ts fhevm-voting-system ../projects
 * ```
 */

const TEMPLATE_FILES = [
  "package.json",
  "hardhat.config.ts",
  "tsconfig.json",
  ".gitignore",
  ".env.example",
  "README.md",
];

const TEMPLATE_DIRS = [
  "contracts",
  "test",
  "scripts",
];

interface ProjectConfig {
  name: string;
  outputDir: string;
  contractName: string;
  description: string;
}

/**
 * Parse command line arguments
 */
function parseArgs(): ProjectConfig | null {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    console.log(`
┌────────────────────────────────────────────────────────────────┐
│           FHEVM Example Scaffolding Tool                      │
├────────────────────────────────────────────────────────────────┤
│ Creates standalone FHEVM example repositories                  │
└────────────────────────────────────────────────────────────────┘

Usage:
  npx ts-node scripts/create-example.ts <project-name> [output-dir]

Arguments:
  project-name    Name of the new project (kebab-case)
  output-dir      Output directory (default: current directory)

Examples:
  # Create voting system example
  npx ts-node scripts/create-example.ts fhevm-voting-system

  # Create in specific directory
  npx ts-node scripts/create-example.ts fhevm-auction ../examples

Options:
  -h, --help      Show this help message
`);
    return null;
  }

  const projectName = args[0];
  const outputDir = args[1] || ".";

  // Convert kebab-case to PascalCase for contract name
  const contractName = projectName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  return {
    name: projectName,
    outputDir,
    contractName,
    description: `FHEVM-based ${contractName} example`,
  };
}

/**
 * Create project directory structure
 */
function createDirectories(projectPath: string): void {
  console.log("\n📁 Creating directory structure...");

  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath, { recursive: true });
  }

  for (const dir of TEMPLATE_DIRS) {
    const dirPath = path.join(projectPath, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`   ✓ Created ${dir}/`);
    }
  }
}

/**
 * Copy and customize template files
 */
function copyTemplateFiles(projectPath: string, config: ProjectConfig): void {
  console.log("\n📄 Copying template files...");

  const currentDir = process.cwd();

  for (const file of TEMPLATE_FILES) {
    const sourcePath = path.join(currentDir, file);
    const destPath = path.join(projectPath, file);

    if (fs.existsSync(sourcePath)) {
      let content = fs.readFileSync(sourcePath, "utf8");

      // Customize content
      content = content
        .replace(/ConfidentialMedicalRecords/g, config.contractName)
        .replace(/confidential-medical-records/g, config.name)
        .replace(/fhevm-confidential-medical-records/g, `fhevm-${config.name}`)
        .replace(/medical records/gi, config.description);

      fs.writeFileSync(destPath, content);
      console.log(`   ✓ Copied ${file}`);
    }
  }
}

/**
 * Create a sample contract file
 */
function createSampleContract(projectPath: string, config: ProjectConfig): void {
  console.log("\n📝 Creating sample contract...");

  const contractContent = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8, euint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title ${config.contractName}
 * @notice ${config.description}
 * @dev Demonstrates FHEVM patterns for privacy-preserving smart contracts
 *
 * This contract showcases:
 * - chapter: access-control
 * - chapter: encrypted-storage
 *
 * TODO: Implement your contract logic here
 */
contract ${config.contractName} is SepoliaConfig {

    /// @notice Contract owner
    address public owner;

    /// @notice Sample encrypted value
    euint32 public encryptedValue;

    /**
     * @notice Emitted when a value is set
     */
    event ValueSet(address indexed setter, uint256 timestamp);

    /**
     * @notice Initialize the contract
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Set an encrypted value
     * @param value The value to encrypt and store
     *
     * Example:
     * \`\`\`
     * contract.setValue(42);
     * \`\`\`
     */
    function setValue(uint32 value) external {
        euint32 encrypted = FHE.asEuint32(value);
        FHE.allowThis(encrypted);
        FHE.allow(encrypted, msg.sender);

        encryptedValue = encrypted;

        emit ValueSet(msg.sender, block.timestamp);
    }

    /**
     * @notice Get the owner address
     * @return Address of the contract owner
     */
    function getOwner() external view returns (address) {
        return owner;
    }
}
`;

  const contractPath = path.join(
    projectPath,
    "contracts",
    `${config.contractName}.sol`
  );
  fs.writeFileSync(contractPath, contractContent);
  console.log(`   ✓ Created contracts/${config.contractName}.sol`);
}

/**
 * Create a sample test file
 */
function createSampleTest(projectPath: string, config: ProjectConfig): void {
  console.log("\n🧪 Creating sample test...");

  const testContent = `import { expect } from "chai";
import { ethers } from "hardhat";
import type { ${config.contractName} } from "../typechain-types";

/**
 * Test Suite: ${config.contractName}
 *
 * Comprehensive tests for the ${config.description}
 *
 * chapter: access-control
 * chapter: encrypted-storage
 */
describe("${config.contractName}", () => {
  let contract: ${config.contractName};
  let owner: any;
  let user1: any;

  /**
   * Setup: Deploy contract and initialize test accounts
   */
  beforeEach(async () => {
    [owner, user1] = await ethers.getSigners();

    const ${config.contractName}Factory = await ethers.getContractFactory("${config.contractName}");
    contract = await ${config.contractName}Factory.deploy();
    await contract.waitForDeployment();
  });

  describe("Initialization", () => {
    /**
     * Test: Contract deploys with correct owner
     */
    it("Should set the correct owner", async () => {
      expect(await contract.getOwner()).to.equal(owner.address);
    });
  });

  describe("Value Management", () => {
    /**
     * Test: User can set encrypted value
     */
    it("Should allow setting encrypted value", async () => {
      const tx = await contract.connect(user1).setValue(42);
      await tx.wait();

      expect(tx).to.exist;
    });
  });

  // TODO: Add more tests here
});
`;

  const testPath = path.join(
    projectPath,
    "test",
    `${config.contractName}.test.ts`
  );
  fs.writeFileSync(testPath, testContent);
  console.log(`   ✓ Created test/${config.contractName}.test.ts`);
}

/**
 * Create deployment script
 */
function createDeploymentScript(projectPath: string, config: ProjectConfig): void {
  console.log("\n🚀 Creating deployment script...");

  const deployContent = `import { ethers } from "hardhat";

/**
 * Deployment Script: ${config.contractName}
 *
 * Usage:
 * \`\`\`bash
 * npx hardhat run scripts/deploy.ts --network sepolia
 * \`\`\`
 */
async function main() {
  console.log("🚀 Deploying ${config.contractName} Contract...\\n");

  const [deployer] = await ethers.getSigners();
  console.log("📍 Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\\n");

  console.log("🔨 Compiling contracts...");
  const ${config.contractName}Factory = await ethers.getContractFactory("${config.contractName}");

  console.log("🚀 Deploying contract...");
  const contract = await ${config.contractName}Factory.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("\\n✅ Contract deployed successfully!");
  console.log("📬 Contract address:", contractAddress);

  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, "(Chain ID:", network.chainId, ")");

  console.log("\\n🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
`;

  const deployPath = path.join(projectPath, "scripts", "deploy.ts");
  fs.writeFileSync(deployPath, deployContent);
  console.log(`   ✓ Created scripts/deploy.ts`);
}

/**
 * Display next steps
 */
function displayNextSteps(config: ProjectConfig): void {
  console.log(`
┌────────────────────────────────────────────────────────────────┐
│                     Success! 🎉                                │
├────────────────────────────────────────────────────────────────┤
│ Project "${config.name}" created successfully!
└────────────────────────────────────────────────────────────────┘

📁 Project location: ${path.resolve(config.outputDir, config.name)}

Next steps:

1. Navigate to project directory:
   cd ${config.name}

2. Install dependencies:
   npm install

3. Configure environment:
   cp .env.example .env
   # Edit .env with your private key

4. Compile contracts:
   npm run compile

5. Run tests:
   npm run test

6. Deploy to testnet:
   npm run deploy:sepolia

📚 Documentation:
   - README.md has full project documentation
   - contracts/${config.contractName}.sol is your main contract
   - test/${config.contractName}.test.ts has test examples

Happy building! 🚀
`);
}

/**
 * Main execution
 */
async function main() {
  console.log(`
┌────────────────────────────────────────────────────────────────┐
│           FHEVM Example Scaffolding Tool                      │
│                   v1.0.0                                       │
└────────────────────────────────────────────────────────────────┘
`);

  const config = parseArgs();
  if (!config) {
    process.exit(0);
  }

  const projectPath = path.join(config.outputDir, config.name);

  // Check if project already exists
  if (fs.existsSync(projectPath)) {
    console.error(`❌ Error: Project "${config.name}" already exists at ${projectPath}`);
    process.exit(1);
  }

  console.log(`\n📦 Creating project: ${config.name}`);
  console.log(`📍 Location: ${path.resolve(projectPath)}`);
  console.log(`📝 Contract: ${config.contractName}`);

  try {
    createDirectories(projectPath);
    copyTemplateFiles(projectPath, config);
    createSampleContract(projectPath, config);
    createSampleTest(projectPath, config);
    createDeploymentScript(projectPath, config);

    displayNextSteps(config);
  } catch (error) {
    console.error("\n❌ Error creating project:");
    console.error(error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { main, parseArgs, createDirectories };
