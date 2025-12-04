# Deployment Guide

This document provides step-by-step instructions for deploying and using the Confidential Medical Records contract.

## Prerequisites

- Node.js 18+ installed
- MetaMask wallet configured
- Testnet ETH (for Sepolia deployment)
- Private key securely stored

## Step 1: Installation

```bash
# Install dependencies
npm install

# Verify installation
npm run compile
```

## Step 2: Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your details
# PRIVATE_KEY=your_private_key_without_0x_prefix
# SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
```

## Step 3: Run Tests

```bash
# Run full test suite
npm run test

# Expected output: All tests passing
```

## Step 4: Deploy Contract

### Option A: Deploy to Sepolia Testnet

```bash
npm run deploy:sepolia
```

### Option B: Deploy to Local Network

```bash
# Terminal 1: Start local node
npm run node

# Terminal 2: Deploy
npm run deploy
```

## Step 5: Save Deployment Information

After deployment, save the following information:

- **Contract Address**: `0x...`
- **Network**: Sepolia (Chain ID: 11155111)
- **Owner Address**: Your deployer address
- **Transaction Hash**: Deployment transaction

## Step 6: Update Frontend

1. Open `script.js`
2. Find `CONTRACT_ADDRESS` constant
3. Replace with your deployed contract address:

```javascript
const CONTRACT_ADDRESS = "0xYourDeployedContractAddress";
```

## Step 7: Verify Contract (Optional)

### On Etherscan

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

## Step 8: Initial Configuration

After deployment, perform initial setup:

```bash
# Use the interact script
npx hardhat run scripts/interact.ts --network sepolia
```

Or manually through console:

```javascript
// Authorize a doctor
await contract.authorizeDoctor("0xDoctorAddress");

// Verify authorization
await contract.isDoctorAuthorized("0xDoctorAddress");
```

## Step 9: Test Frontend

1. Open `index.html` in browser
2. Click "Connect Wallet"
3. Ensure MetaMask is on the correct network
4. Test each function:
   - Patient registration
   - Record creation (requires authorized doctor)
   - Access requests
   - View records

## Common Issues and Solutions

### Issue: "Contract not deployed on this network"

**Solution**: Verify contract address and network match

```bash
# Check contract on network
npx hardhat verify --network sepolia <ADDRESS>
```

### Issue: "Only authorized doctors can call this function"

**Solution**: Authorize doctor first

```javascript
await contract.connect(owner).authorizeDoctor(doctorAddress);
```

### Issue: "Patient not registered"

**Solution**: Register patient before creating records

```javascript
await contract.connect(patient).registerPatient(123);
```

### Issue: "Transaction reverted"

**Solution**: Check:
- Sufficient gas
- Correct network
- Valid parameters
- Proper permissions

## Production Deployment Checklist

Before mainnet deployment:

- [ ] All tests passing
- [ ] Security audit completed
- [ ] Gas optimization done
- [ ] Emergency procedures documented
- [ ] Access control verified
- [ ] Event logging confirmed
- [ ] Frontend thoroughly tested
- [ ] Private keys secured
- [ ] Backup plan established
- [ ] Monitoring setup

## Monitoring

After deployment, monitor:

- Transaction volume
- Gas usage
- Error rates
- Access patterns
- Security events

## Support

For issues:
1. Check this deployment guide
2. Review test suite for examples
3. Consult README.md
4. Check Hardhat documentation
5. Review Zama FHEVM docs

## Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)
- [MetaMask Guide](https://metamask.io/faqs/)
- [Sepolia Faucet](https://sepoliafaucet.com/)

---

**Last Updated**: 2024-12-03
