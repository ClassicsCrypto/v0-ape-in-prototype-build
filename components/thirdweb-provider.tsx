"use client";

import { ThirdwebProvider, metamaskWallet, coinbaseWallet, walletConnect, inAppWallet } from "@thirdweb-dev/react";
import { Ethereum, Polygon, Arbitrum, Optimism, Apex } from "@thirdweb-dev/chains";

// Curtis Network configuration
const CurtisNetwork = {
  chain: "ETH",
  chainId: 33111, // Curtis Network chain ID
  name: "Curtis Network",
  shortName: "curtis",
  slug: "curtis-network",
  testnet: false,
  status: "active",
  networkId: 33111,
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpc: [
    "https://apechain.drpc.org",
    "https://rpc.curtis-network.com",
  ],
  explorers: [
    {
      name: "Curtis Network Explorer",
      url: "https://apescan.io",
    },
  ],
  infoURL: "https://apechain.com",
  icon: {
    url: "ipfs://QmQcFeL7awVQ5TZQohKRE9Wfjf7RUWAgF8k8qkGqj8pVpW",
    width: 512,
    height: 512,
    format: "png",
  },
  parent: {
    type: "L2",
    chain: "eip155-1",
  },
  faucets: [],
};

// Configure the supported chains - including Curtis Network
const supportedChains = [Ethereum, Polygon, Arbitrum, Optimism, Apex, CurtisNetwork];

// Configure the supported wallets
const supportedWallets = [
  metamaskWallet(),
  coinbaseWallet(),
  walletConnect(),
  inAppWallet({
    auth: {
      options: ["google", "x", "email"], // Google, X (Twitter), and email authentication
    },
    executionMode: {
      mode: "EIP4337", // Smart account mode
      sponsorGas: true, // Sponsor gas for all transactions
    },
  }),
];

interface ThirdWebProviderProps {
  children: React.ReactNode;
}

export function ThirdWebProvider({ children }: ThirdWebProviderProps) {
  return (
    <ThirdwebProvider
      activeChain={CurtisNetwork} // Default to Curtis Network
      supportedChains={supportedChains}
      supportedWallets={supportedWallets}
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
    >
      {children}
    </ThirdwebProvider>
  );
}
