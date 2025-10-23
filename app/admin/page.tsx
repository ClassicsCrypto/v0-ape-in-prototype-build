"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ManagedAccountFactory } from "@/components/managed-account-factory"
import { WalletConnection } from "@/components/wallet-connection"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Admin addresses - in production, this should be stored securely
  const ADMIN_ADDRESSES = [
    "0x1234567890123456789012345678901234567890", // Replace with actual admin addresses
    "0x0987654321098765432109876543210987654321"
  ]

  useEffect(() => {
    // Check if user is authorized admin
    const userData = localStorage.getItem("apeInUser")
    if (!userData) {
      router.push("/")
      return
    }

    // For now, we'll allow access if user exists
    // In production, you'd check against actual admin addresses
    setIsAuthorized(true)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-destructive" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You don't have permission to access this admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <h1 className="text-2xl font-black tracking-tighter">
                <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  ApeIn
                </span>
              </h1>
            </Link>
            <Badge variant="destructive" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Admin Panel
            </Badge>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to App
            </Button>
          </Link>
        </div>
      </div>

      {/* Admin Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Admin Panel</h2>
            <p className="text-muted-foreground">
              Manage smart wallet contracts and system configuration
            </p>
          </div>

          {/* Wallet Connection for Admin */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Wallet Connection</CardTitle>
              <CardDescription>
                Connect your admin wallet to manage smart contracts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WalletConnection />
            </CardContent>
          </Card>

          {/* Managed Account Factory */}
          <ManagedAccountFactory />
        </div>
      </div>
    </div>
  )
}


