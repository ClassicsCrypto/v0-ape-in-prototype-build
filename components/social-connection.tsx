"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Twitter, Mail, Zap, CheckCircle } from "lucide-react"

interface SocialConnectionProps {
  onXpEarned?: (xp: number) => void
  currentXp?: number
}

export function SocialConnection({ onXpEarned, currentXp = 0 }: SocialConnectionProps) {
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([])

  const handleConnect = (platform: string) => {
    // Simulate connection
    if (!connectedAccounts.includes(platform)) {
      setConnectedAccounts([...connectedAccounts, platform])
      if (onXpEarned) {
        onXpEarned(25) // XP for connecting additional account
      }
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Connect Additional Accounts
          </CardTitle>
          <CardDescription>
            Link more social accounts to earn extra XP and enhance your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Connection */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Google</span>
              {connectedAccounts.includes("google") && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              )}
            </div>
            <Button
              size="sm"
              variant={connectedAccounts.includes("google") ? "outline" : "default"}
              onClick={() => handleConnect("google")}
              disabled={connectedAccounts.includes("google")}
            >
              {connectedAccounts.includes("google") ? "Connected" : "Connect"}
            </Button>
          </div>

          {/* X Connection */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Twitter className="h-5 w-5 text-black" />
              <span className="font-medium">X (Twitter)</span>
              {connectedAccounts.includes("twitter") && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              )}
            </div>
            <Button
              size="sm"
              variant={connectedAccounts.includes("twitter") ? "outline" : "default"}
              onClick={() => handleConnect("twitter")}
              disabled={connectedAccounts.includes("twitter")}
            >
              {connectedAccounts.includes("twitter") ? "Connected" : "Connect"}
            </Button>
          </div>

          {/* XP Reward Info */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Connect additional account</span>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                +25 XP
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

