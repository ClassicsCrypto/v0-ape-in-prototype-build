"use client";

import { useState } from "react";
import { useContract, useContractWrite, useContractRead, useAddress, useChainId } from "@thirdweb-dev/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONTRACT_ADDRESSES, CONTRACT_CHAINS, MANAGED_ACCOUNT_FACTORY_ABI, isContractDeployedOnChain } from "@/lib/contracts";

export function ManagedAccountFactory() {
  const address = useAddress();
  const chainId = useChainId();
  const [adminAddress, setAdminAddress] = useState("");
  const [initData, setInitData] = useState("");
  const [predictedAddress, setPredictedAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get contract instance
  const { contract } = useContract(CONTRACT_ADDRESSES.MANAGED_ACCOUNT_FACTORY, MANAGED_ACCOUNT_FACTORY_ABI);
  
  // Use known implementation address instead of contract call to avoid errors
  const accountImplementation = chainId === CONTRACT_CHAINS.MANAGED_ACCOUNT_FACTORY 
    ? "0x73db4cBBe8A7C0C40A951E5346aBfD64b46c61b2" 
    : null;
  
  // Contract write operations - only when on correct chain
  const { mutateAsync: createAccount } = useContractWrite(
    chainId === CONTRACT_CHAINS.MANAGED_ACCOUNT_FACTORY ? contract : null, 
    "createAccount"
  );
  const { mutateAsync: getAccountAddress } = useContractWrite(
    chainId === CONTRACT_CHAINS.MANAGED_ACCOUNT_FACTORY ? contract : null, 
    "getAddress"
  );

  // Check if contract is deployed on current chain
  const isDeployed = chainId ? isContractDeployedOnChain(chainId) : false;

  const handleCreateAccount = async () => {
    if (!address || !adminAddress) {
      alert("Please provide an admin address");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Creating managed account...", {
        admin: adminAddress,
        data: initData || "0x"
      });

      const result = await createAccount({
        args: [adminAddress, initData || "0x"]
      });

      console.log("Account created successfully:", result);
      alert(`Managed account created successfully! Transaction: ${result.receipt.transactionHash}`);
      
      // Reset form
      setAdminAddress("");
      setInitData("");
      setPredictedAddress("");
    } catch (error) {
      console.error("Failed to create account:", error);
      alert(`Failed to create managed account: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredictAddress = async () => {
    if (!adminAddress) {
      alert("Please provide an admin address");
      return;
    }

    try {
      console.log("Predicting account address...", {
        admin: adminAddress,
        data: initData || "0x"
      });

      const result = await getAccountAddress({
        args: [adminAddress, initData || "0x"]
      });

      console.log("Predicted address:", result);
      setPredictedAddress(result as string);
    } catch (error) {
      console.error("Failed to predict address:", error);
      alert(`Failed to predict address: ${error}`);
    }
  };

  if (!address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Managed Account Factory</CardTitle>
          <CardDescription>Connect your wallet to interact with the Managed Account Factory contract</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!isDeployed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Managed Account Factory</CardTitle>
          <CardDescription>Contract not deployed on this chain</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The Managed Account Factory contract is not deployed on the current chain (Chain ID: {chainId}).
            Please switch to Curtis Network (Chain ID: 33111) to interact with the contract.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contract Info */}
      <Card>
        <CardHeader>
          <CardTitle>Managed Account Factory</CardTitle>
          <CardDescription>Deploy and manage smart wallet accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Contract Address</Label>
              <p className="text-sm text-muted-foreground font-mono">
                {CONTRACT_ADDRESSES.MANAGED_ACCOUNT_FACTORY}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Chain ID</Label>
              <Badge variant="outline">{chainId}</Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">Implementation Address</Label>
              <p className="text-sm text-muted-foreground font-mono">
                {accountImplementation ? String(accountImplementation) : "Loading..."}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Your Address</Label>
              <p className="text-sm text-muted-foreground font-mono">
                {address}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Account */}
      <Card>
        <CardHeader>
          <CardTitle>Create Managed Account</CardTitle>
          <CardDescription>Deploy a new smart wallet account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="admin">Admin Address</Label>
            <Input
              id="admin"
              type="text"
              placeholder="0x..."
              value={adminAddress}
              onChange={(e) => setAdminAddress(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              The address that will have admin privileges over the created account
            </p>
          </div>

          <div>
            <Label htmlFor="initData">Initialization Data (Optional)</Label>
            <Textarea
              id="initData"
              placeholder="0x..."
              value={initData}
              onChange={(e) => setInitData(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Optional initialization data for the account (leave empty for default)
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handlePredictAddress}
              variant="outline"
              disabled={!adminAddress}
            >
              Predict Address
            </Button>
            <Button
              onClick={handleCreateAccount}
              disabled={!adminAddress || isLoading}
            >
              {isLoading ? "Creating..." : "Create Account"}
            </Button>
          </div>

          {predictedAddress && (
            <div className="p-3 bg-muted rounded-lg">
              <Label className="text-sm font-medium">Predicted Account Address</Label>
              <p className="text-sm font-mono text-muted-foreground break-all">
                {predictedAddress}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contract Functions */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Functions</CardTitle>
          <CardDescription>Available functions on the Managed Account Factory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">createAccount</p>
                <p className="text-sm text-muted-foreground">Deploy a new managed account</p>
              </div>
              <Badge variant="secondary">Write</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">getAddress</p>
                <p className="text-sm text-muted-foreground">Predict the address of a managed account</p>
              </div>
              <Badge variant="outline">Read</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">accountImplementation</p>
                <p className="text-sm text-muted-foreground">Get the implementation contract address</p>
              </div>
              <Badge variant="outline">Read</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
