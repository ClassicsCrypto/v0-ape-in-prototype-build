"use client";

import { useState, useEffect } from "react";
import { useAddress, useDisconnect } from "@thirdweb-dev/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Twitter, Mail, CheckCircle, Zap } from "lucide-react";

interface ThirdwebSocialAuthProps {
  onXpEarned?: (xp: number) => void;
  currentXp?: number;
  onAuthSuccess?: (authMethod: string, userData: any) => void;
  forceShowButtons?: boolean; // New prop to force showing buttons
}

export function ThirdwebSocialAuth({ onXpEarned, currentXp = 0, onAuthSuccess, forceShowButtons = false }: ThirdwebSocialAuthProps) {
  const [connectedMethod, setConnectedMethod] = useState<string | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [hasAwardedXp, setHasAwardedXp] = useState(false);

  const { disconnect } = useDisconnect();
  const address = useAddress();

  // Reset state when component mounts to ensure clean start
  useEffect(() => {
    if (forceShowButtons) {
      setConnectedMethod(null);
      setXpEarned(0);
      setHasAwardedXp(false);
    }
  }, [forceShowButtons]);

  // Check for existing connected account
  useEffect(() => {
    if (address && !hasAwardedXp) {
      // Determine the auth method based on the account
      // For now, we'll assume it's a social auth if it's an in-app wallet
      setConnectedMethod("social");
      
      // Award XP for connection (only once)
      const xpReward = 50; // Base XP for any social connection
      setXpEarned(xpReward);
      setHasAwardedXp(true);
      
      if (onXpEarned) {
        onXpEarned(xpReward);
      }

      if (onAuthSuccess) {
        onAuthSuccess("social", {
          address: address,
          authMethod: "social",
          xp: xpReward,
          connectedAt: new Date().toISOString(),
        });
      }

      // Update localStorage
      const userData = {
        address: address,
        authMethod: "social",
        xp: xpReward,
        connectedAt: new Date().toISOString(),
      };

      const existingUserData = localStorage.getItem("apeInUser");
      if (existingUserData) {
        const parsed = JSON.parse(existingUserData);
        parsed.xp = (parsed.xp || 0) + xpReward;
        parsed.socialConnected = true;
        parsed.walletAddress = address;
        localStorage.setItem("apeInUser", JSON.stringify(parsed));
      } else {
        localStorage.setItem("apeInUser", JSON.stringify(userData));
      }
    }
  }, [address, onXpEarned, onAuthSuccess, hasAwardedXp]);

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setConnectedMethod(null);
      setXpEarned(0);
      setHasAwardedXp(false);
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  if (connectedMethod && address && !forceShowButtons) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            Account Connected
          </CardTitle>
          <CardDescription className="text-green-700">
            Your social account is connected and verified
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connected"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {xpEarned > 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  +{xpEarned} XP Earned
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Choose One Option</span>
        </div>
        <p className="text-xs text-blue-700">
          Select either Google or X to connect your account. You can only choose one option.
        </p>
      </div>

      {/* Thirdweb ConnectEmbed */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Connect Your Account
          </CardTitle>
          <CardDescription>
            Choose Google or X to create your smart wallet and earn XP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">XP Reward</span>
              </div>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                +50 XP
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => {
                // Trigger Google auth
                console.log("Google auth triggered");
                // For now, simulate success
                if (onAuthSuccess) {
                  onAuthSuccess("email", {
                    address: "0x1234567890abcdef",
                    authMethod: "email",
                    xp: 50,
                    connectedAt: new Date().toISOString(),
                  });
                }
              }}
              className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Mail className="h-5 w-5 mr-2" />
              Continue with Google
            </Button>
            
            <Button
              onClick={() => {
                // Trigger X auth
                console.log("X auth triggered");
                // For now, simulate success
                if (onAuthSuccess) {
                  onAuthSuccess("twitter", {
                    address: "0x1234567890abcdef",
                    authMethod: "twitter",
                    xp: 50,
                    connectedAt: new Date().toISOString(),
                  });
                }
              }}
              className="w-full h-14 text-lg font-bold bg-black hover:bg-gray-800 text-white"
            >
              <Twitter className="h-5 w-5 mr-2" />
              Continue with X
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            By connecting, you agree to share your public profile information
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
