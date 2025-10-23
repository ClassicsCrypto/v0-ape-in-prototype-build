# Network Configuration Guide

## 🔍 Contract Not Found Issue

Your Managed Account Factory contract (`0xe47977a729e152ae112c48c818f78391527b61c5`) was not found on the Curtis Network or other common networks during testing.

## 🚨 Possible Reasons

1. **Contract Address Incorrect**: The contract address might be wrong
2. **Network Mismatch**: The contract might be on a different network
3. **Private/Test Network**: The contract might be on a private or test network
4. **Not Deployed Yet**: The contract might not be deployed yet
5. **Different Network Name**: Curtis Network might have different technical details

## 🔧 How to Fix This

### Option 1: Verify Contract Address

1. **Check your ThirdWeb Dashboard:**
   - Go to [ThirdWeb Dashboard](https://thirdweb.com/dashboard)
   - Find your Managed Account Factory contract
   - Verify the exact contract address

2. **Check the Block Explorer:**
   - If you know the network, check the block explorer
   - Verify the contract exists and is deployed

### Option 2: Update Network Configuration

If you have the correct network details, update these files:

1. **Update `.env.local`:**
   ```bash
   NEXT_PUBLIC_MANAGED_ACCOUNT_FACTORY_ADDRESS=your_correct_contract_address
   NEXT_PUBLIC_MANAGED_ACCOUNT_FACTORY_CHAIN_ID=your_correct_chain_id
   ```

2. **Update `lib/contracts.ts`:**
   ```typescript
   export const CONTRACT_CHAINS = {
     MANAGED_ACCOUNT_FACTORY: parseInt(process.env.NEXT_PUBLIC_MANAGED_ACCOUNT_FACTORY_CHAIN_ID || "YOUR_CHAIN_ID"),
   } as const;
   ```

3. **Update `components/thirdweb-provider.tsx`:**
   ```typescript
   const CurtisNetwork = {
     chain: "ETH",
     chainId: YOUR_CHAIN_ID,
     name: "Curtis Network",
     // ... other config
   };
   ```

### Option 3: Use ThirdWeb's Contract Registry

If you deployed through ThirdWeb, you can use their contract registry:

1. **Get Contract from ThirdWeb:**
   ```typescript
   import { ThirdwebSDK } from "@thirdweb-dev/sdk";
   
   const sdk = new ThirdwebSDK("curtis"); // or your network name
   const contract = await sdk.getContract("0xe47977a729e152ae112c48c818f78391527b61c5");
   ```

2. **Use ThirdWeb's Pre-built Contract:**
   ```typescript
   import { ManagedAccountFactory } from "@thirdweb-dev/contracts";
   
   const contract = new ManagedAccountFactory("0xe47977a729e152ae112c48c818f78391527b61c5");
   ```

## 🧪 Testing Your Configuration

1. **Run the contract finder script:**
   ```bash
   node scripts/find-contract.js
   ```

2. **Run the network test:**
   ```bash
   node scripts/test-network.js
   ```

3. **Test in the app:**
   ```bash
   npm run dev
   # Navigate to http://localhost:3000/contract-test
   ```

## 📋 Required Information

To properly configure your contract, I need:

1. **Correct Contract Address** (if different)
2. **Correct Chain ID** for Curtis Network
3. **Correct RPC URL** for Curtis Network
4. **Block Explorer URL** (if available)
5. **Network Name** (exact name used in ThirdWeb)

## 🚀 Quick Fix

If you know the correct network details, you can quickly update the configuration:

1. **Edit `.env.local`:**
   ```bash
   NEXT_PUBLIC_MANAGED_ACCOUNT_FACTORY_ADDRESS=0xe47977a729e152ae112c48c818f78391527b61c5
   NEXT_PUBLIC_MANAGED_ACCOUNT_FACTORY_CHAIN_ID=YOUR_CHAIN_ID
   ```

2. **Restart the development server:**
   ```bash
   npm run dev
   ```

3. **Test the integration:**
   - Connect your wallet
   - Switch to the correct network
   - Try the contract functions

## 📞 Getting Help

If you need help finding the correct network configuration:

1. **Check your ThirdWeb Dashboard** for deployment details
2. **Contact your network administrator** for Curtis Network details
3. **Check the network documentation** for Curtis Network
4. **Use the block explorer** if you know the network

## 🔄 Alternative: Use ThirdWeb's Managed Service

If you're having trouble with the direct contract integration, you can use ThirdWeb's managed service:

1. **Import your contract in ThirdWeb Dashboard**
2. **Use ThirdWeb's SDK with your contract address**
3. **Let ThirdWeb handle the network configuration**

This approach is often easier and more reliable for contract integration.


