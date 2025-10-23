"use client";

import { ConnectWallet, useAddress, useChainId, useDisconnect, useSwitchChain, useWallet } from "@thirdweb-dev/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export function WalletConnection() {
  const address = useAddress();
  const chainId = useChainId();
  const disconnect = useDisconnect();
  const { switchChain } = useSwitchChain();
  const wallet = useWallet();
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      console.log("Disconnecting wallet...");
      console.log("Disconnect function:", typeof disconnect);
      await disconnect();
      console.log("Disconnect successful");
    } catch (error) {
      console.error("Failed to disconnect:", error);
      alert(`Failed to disconnect wallet: ${error}`);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleSwitchChain = async (newChainId: number) => {
    try {
      console.log("Switching to chain:", newChainId);
      await switchChain(newChainId);
      console.log("Chain switch successful");
    } catch (error) {
      console.error("Failed to switch chain:", error);
      // If switching fails, it might be because the network isn't added to the wallet
      alert(`Failed to switch to network. Please make sure the network is added to your wallet. Error: ${error}`);
    }
  };

  // Chain name mapping
  const getChainName = (chainId?: number) => {
    switch (chainId) {
      case 1: return "Ethereum";
      case 137: return "Polygon";
      case 42161: return "Arbitrum";
      case 10: return "Optimism";
      case 2662: return "Apex";
      case 33111: return "Curtis Network";
      default: return "Unknown Chain";
    }
  };

  if (!address) {
    return (
      <div className="flex flex-col items-center gap-4">
        <ConnectWallet 
          theme="dark"
          modalTitle="Connect to ApeIn"
          modalTitleIcon=""
          welcomeScreen={{
            title: "Welcome to ApeIn",
            subtitle: "Connect your wallet to discover and fund the next wave of Web3 culture",
          }}
          modalSize="compact"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-sm">
          {getChainName(chainId)}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {address.slice(0, 6)}...{address.slice(-4)}
        </Badge>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log("ETH button clicked");
            handleSwitchChain(1);
          }}
          disabled={chainId === 1}
        >
          ETH
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log("Polygon button clicked");
            handleSwitchChain(137);
          }}
          disabled={chainId === 137}
        >
          POLYGON
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log("Arbitrum button clicked");
            handleSwitchChain(42161);
          }}
          disabled={chainId === 42161}
        >
          ARBITRUM
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log("Curtis Network button clicked");
            handleSwitchChain(33111);
          }}
          disabled={chainId === 33111}
          className="bg-orange-100 border-orange-300 text-orange-700 hover:bg-orange-200"
        >
          CURTIS
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log("Apex button clicked");
            handleSwitchChain(2662);
          }}
          disabled={chainId === 2662}
          className="bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200"
        >
          APEX
        </Button>
      </div>

      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
          console.log("Disconnect button clicked");
          handleDisconnect();
        }}
        disabled={isDisconnecting}
      >
        {isDisconnecting ? "Disconnecting..." : "Disconnect"}
      </Button>
    </div>
  );
}

// Hook for easy access to wallet state
export function useWalletConnection() {
  const address = useAddress();
  const chainId = useChainId();
  const disconnect = useDisconnect();
  const { switchChain } = useSwitchChain();

  // Chain name mapping
  const getChainName = (chainId?: number) => {
    switch (chainId) {
      case 1: return "Ethereum";
      case 137: return "Polygon";
      case 42161: return "Arbitrum";
      case 10: return "Optimism";
      case 2662: return "Apex";
      case 33111: return "Curtis Network";
      default: return "Unknown Chain";
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  return {
    address,
    chainId,
    chainName: getChainName(chainId),
    isConnected: !!address,
    disconnect: handleDisconnect,
    switchChain,
  };
}

