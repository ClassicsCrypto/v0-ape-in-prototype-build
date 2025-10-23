#!/usr/bin/env node

/**
 * Contract Finder Script
 * 
 * This script searches for your contract across multiple networks
 * to determine where it's actually deployed.
 */

const { ThirdwebSDK } = require("@thirdweb-dev/sdk");

async function findContract() {
  console.log("🔍 Searching for Managed Account Factory Contract...\n");

  const contractAddress = "0xe47977a729e152ae112c48c818f78391527b61c5";
  
  // Common networks to check
  const networks = [
    { name: "Ethereum Mainnet", chainId: 1, rpcUrl: "https://eth.llamarpc.com" },
    { name: "Polygon", chainId: 137, rpcUrl: "https://polygon.llamarpc.com" },
    { name: "Arbitrum One", chainId: 42161, rpcUrl: "https://arb1.arbitrum.io/rpc" },
    { name: "Optimism", chainId: 10, rpcUrl: "https://mainnet.optimism.io" },
    { name: "Base", chainId: 8453, rpcUrl: "https://mainnet.base.org" },
    { name: "Avalanche", chainId: 43114, rpcUrl: "https://api.avax.network/ext/bc/C/rpc" },
    { name: "BSC", chainId: 56, rpcUrl: "https://bsc-dataseed.binance.org" },
    { name: "Curtis Network", chainId: 33111, rpcUrl: "https://rpc.apechain.co" },
    { name: "Curtis Network Alt", chainId: 33111, rpcUrl: "https://apechain.drpc.org" },
    { name: "Apex", chainId: 2662, rpcUrl: "https://rpc.apex.proofofape.com" },
  ];

  const foundNetworks = [];

  for (const network of networks) {
    console.log(`🔍 Checking ${network.name} (Chain ID: ${network.chainId})...`);
    
    try {
      const sdk = new ThirdwebSDK(network.chainId, {
        rpc: [network.rpcUrl],
      });

      // Try to get the contract
      const contract = await sdk.getContract(contractAddress);
      
      // Try to read a simple function to verify it's the right contract
      try {
        const accountImplementation = await contract.call("accountImplementation");
        console.log(`   ✅ Contract found! Implementation: ${accountImplementation}`);
        foundNetworks.push({
          ...network,
          implementation: accountImplementation
        });
      } catch (contractError) {
        console.log(`   ⚠️  Contract found but not a Managed Account Factory: ${contractError.message}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Contract not found: ${error.message.split('\n')[0]}`);
    }
  }

  console.log("\n📊 Results Summary:");
  
  if (foundNetworks.length === 0) {
    console.log("❌ Contract not found on any of the tested networks.");
    console.log("\n💡 Possible reasons:");
    console.log("   - Contract address might be incorrect");
    console.log("   - Contract might be deployed on a private/test network");
    console.log("   - Contract might be deployed on a network not tested here");
    console.log("   - RPC endpoints might be down or incorrect");
  } else {
    console.log(`✅ Found contract on ${foundNetworks.length} network(s):\n`);
    
    foundNetworks.forEach((network, index) => {
      console.log(`${index + 1}. ${network.name}`);
      console.log(`   Chain ID: ${network.chainId}`);
      console.log(`   RPC: ${network.rpcUrl}`);
      console.log(`   Implementation: ${network.implementation}\n`);
    });

    console.log("🔧 Configuration for your app:");
    console.log("```bash");
    console.log(`NEXT_PUBLIC_MANAGED_ACCOUNT_FACTORY_ADDRESS=${contractAddress}`);
    console.log(`NEXT_PUBLIC_MANAGED_ACCOUNT_FACTORY_CHAIN_ID=${foundNetworks[0].chainId}`);
    console.log("```");
    
    console.log("\n📝 Update your thirdweb provider with:");
    console.log(`   Chain ID: ${foundNetworks[0].chainId}`);
    console.log(`   RPC URL: ${foundNetworks[0].rpcUrl}`);
  }
}

// Run contract finder
findContract().catch(console.error);
