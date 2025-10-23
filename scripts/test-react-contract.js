#!/usr/bin/env node

/**
 * Test Contract with React App Configuration
 * 
 * This script tests the contract using the same configuration as the React app
 */

const { ThirdwebSDK } = require("@thirdweb-dev/sdk");

async function testReactContract() {
  console.log("🔍 Testing Contract with React App Configuration...\n");

  // Use the same configuration as the React app
  const contractAddress = "0xe47977a729e152ae112c48c818f78391527b61c5";
  const chainId = 33111;
  const clientId = "dbf6bdfd21e5bfc1fd9215ade18bc90f"; // From your .env.local
  const rpcUrl = "https://rpc.apechain.co";

  console.log(`📋 Configuration:`);
  console.log(`   Contract: ${contractAddress}`);
  console.log(`   Chain ID: ${chainId}`);
  console.log(`   Client ID: ${clientId}`);
  console.log(`   RPC URL: ${rpcUrl}\n`);

  try {
    // Initialize SDK with the same config as React app
    const sdk = new ThirdwebSDK(chainId, {
      rpc: [rpcUrl],
      clientId: clientId,
    });

    console.log("🚀 Initializing ThirdWeb SDK...");
    
    // Get contract
    const contract = await sdk.getContract(contractAddress);
    console.log("✅ Contract loaded successfully!\n");

    // Test the same function that the React app is trying to call
    console.log("🧪 Testing accountImplementation() function...");
    const accountImplementation = await contract.call("accountImplementation");
    console.log(`✅ accountImplementation() works!`);
    console.log(`   Implementation Address: ${accountImplementation}\n`);

    // Test getAddress function
    console.log("🧪 Testing getAddress() function...");
    const testAdmin = "0x0000000000000000000000000000000000000001";
    const testData = "0x";
    const predictedAddress = await contract.call("getAddress", [testAdmin, testData]);
    console.log(`✅ getAddress() works!`);
    console.log(`   Predicted Address: ${predictedAddress}\n`);

    console.log("🎉 All tests passed! The contract configuration is working correctly.");
    console.log("\n💡 The issue might be:");
    console.log("   - Browser cache needs to be cleared");
    console.log("   - React app needs a hard refresh (Ctrl+F5)");
    console.log("   - Wallet connection issue");
    console.log("   - Network switching issue");

  } catch (error) {
    console.error("❌ Test failed:");
    console.error(`   Error: ${error.message}`);
    
    if (error.message.includes("clientId")) {
      console.log("\n💡 Client ID issue detected. Make sure:");
      console.log("   - Client ID is correct");
      console.log("   - Client ID has proper permissions");
      console.log("   - Environment variables are loaded");
    }
  }
}

// Run test
testReactContract().catch(console.error);


