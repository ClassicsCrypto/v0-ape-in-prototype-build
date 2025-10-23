#!/usr/bin/env node

/**
 * Contract Verification Script
 * 
 * This script helps verify that your Managed Account Factory contract
 * is properly deployed and accessible.
 */

const { ThirdwebSDK } = require("@thirdweb-dev/sdk");

async function verifyContract() {
  console.log("🔍 Verifying Managed Account Factory Contract...\n");

  // Contract configuration
  const contractAddress = "0xe47977a729e152ae112c48c818f78391527b61c5";
  const chainId = 33111; // Curtis Network
  const rpcUrl = "https://rpc.apechain.co";

  try {
    console.log(`📋 Contract Details:`);
    console.log(`   Address: ${contractAddress}`);
    console.log(`   Chain ID: ${chainId} (Curtis Network)`);
    console.log(`   RPC URL: ${rpcUrl}\n`);

    // Initialize SDK
    console.log("🚀 Initializing ThirdWeb SDK...");
    const sdk = new ThirdwebSDK(chainId, {
      rpc: [rpcUrl],
    });

    // Get contract
    console.log("📄 Loading contract...");
    const contract = await sdk.getContract(contractAddress);

    console.log("✅ Contract loaded successfully!\n");

    // Get contract info
    console.log("📊 Contract Information:");
    try {
      const accountImplementation = await contract.call("accountImplementation");
      console.log(`   Implementation Address: ${accountImplementation}`);
    } catch (error) {
      console.log(`   ⚠️  Could not read implementation address: ${error.message}`);
    }

    // Test contract functions
    console.log("\n🧪 Testing Contract Functions:");

    // Test getAddress function
    try {
      const testAdmin = "0x0000000000000000000000000000000000000001";
      const testData = "0x";
      const predictedAddress = await contract.call("getAddress", [testAdmin, testData]);
      console.log(`   ✅ getAddress() works - Predicted: ${predictedAddress}`);
    } catch (error) {
      console.log(`   ❌ getAddress() failed: ${error.message}`);
    }

    // Test supportsInterface
    try {
      const erc165Interface = "0x01ffc9a7"; // ERC165 interface
      const supportsERC165 = await contract.call("supportsInterface", [erc165Interface]);
      console.log(`   ✅ supportsInterface() works - Supports ERC165: ${supportsERC165}`);
    } catch (error) {
      console.log(`   ❌ supportsInterface() failed: ${error.message}`);
    }

    console.log("\n🎉 Contract verification complete!");
    console.log("\n📝 Next Steps:");
    console.log("   1. Set your NEXT_PUBLIC_THIRDWEB_CLIENT_ID in .env.local");
    console.log("   2. Run 'npm run dev' to start the development server");
    console.log("   3. Navigate to http://localhost:3000/contract-test");
    console.log("   4. Connect your wallet and switch to Curtis Network");
    console.log("   5. Test the contract integration in the UI");

  } catch (error) {
    console.error("❌ Contract verification failed:");
    console.error(`   Error: ${error.message}`);
    
    if (error.message.includes("network")) {
      console.log("\n💡 Troubleshooting Tips:");
      console.log("   - Check if Curtis Network RPC is accessible");
      console.log("   - Verify the contract address is correct");
      console.log("   - Ensure the contract is deployed on Curtis Network");
    }
  }
}

// Run verification
verifyContract().catch(console.error);
