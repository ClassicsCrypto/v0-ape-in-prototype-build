#!/usr/bin/env node

/**
 * Network Test Script
 * 
 * This script tests different RPC endpoints and network configurations
 * to verify which one your contract is actually deployed on.
 */

const { ThirdwebSDK } = require("@thirdweb-dev/sdk");

async function testNetwork() {
  console.log("🔍 Testing Network Configurations...\n");

  const contractAddress = "0xe47977a729e152ae112c48c818f78391527b61c5";
  
  // Different possible network configurations
  const networks = [
    {
      name: "Curtis Network (Primary RPC)",
      chainId: 33111,
      rpcUrl: "https://rpc.apechain.co"
    },
    {
      name: "Curtis Network (Secondary RPC)",
      chainId: 33111,
      rpcUrl: "https://apechain.drpc.org"
    },
    {
      name: "Curtis Network (Alternative)",
      chainId: 33111,
      rpcUrl: "https://apechain.drpc.org"
    }
  ];

  for (const network of networks) {
    console.log(`🧪 Testing ${network.name}...`);
    console.log(`   Chain ID: ${network.chainId}`);
    console.log(`   RPC: ${network.rpcUrl}`);
    
    try {
      // Test RPC connectivity
      const sdk = new ThirdwebSDK(network.chainId, {
        rpc: [network.rpcUrl],
      });

      // Try to get the contract
      const contract = await sdk.getContract(contractAddress);
      
      // Try to read a simple function
      try {
        const accountImplementation = await contract.call("accountImplementation");
        console.log(`   ✅ Contract found and accessible!`);
        console.log(`   📋 Implementation Address: ${accountImplementation}`);
        console.log(`   🎉 This network configuration works!\n`);
        
        // Save the working configuration
        console.log(`💾 Working Configuration:`);
        console.log(`   NEXT_PUBLIC_MANAGED_ACCOUNT_FACTORY_CHAIN_ID=${network.chainId}`);
        console.log(`   RPC_URL=${network.rpcUrl}\n`);
        
        return; // Exit on first successful configuration
        
      } catch (contractError) {
        console.log(`   ❌ Contract found but not accessible: ${contractError.message}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Network test failed: ${error.message}`);
    }
    
    console.log(""); // Empty line for readability
  }

  console.log("❌ No working network configuration found.");
  console.log("\n💡 Troubleshooting Tips:");
  console.log("   - Verify the contract address is correct");
  console.log("   - Check if the contract is deployed on a different chain");
  console.log("   - Ensure you have the correct RPC endpoints");
  console.log("   - Contact the contract deployer for the correct network details");
}

// Run network test
testNetwork().catch(console.error);
