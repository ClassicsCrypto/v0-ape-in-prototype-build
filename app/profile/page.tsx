"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Zap, TrendingUp, Plus, Wallet, CheckCircle, Trophy, Award, Users, Coins } from "lucide-react"
import { SocialConnection } from "@/components/social-connection"
import { TrophyCase } from "@/components/trophy-case"
import { xpSystem } from "@/lib/xp-system"
import Link from "next/link"

interface UserData {
  name: string
  email: string
  xp: number
  authMethod: string
  profileImage: string | null
  walletAddress?: string
  smartWalletCreated?: boolean
  createdAt?: string
  trophies?: any[]
  rank?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)

  const handleXpEarned = (xp: number) => {
    if (userData) {
      const updatedUserData = { ...userData, xp: userData.xp + xp }
      setUserData(updatedUserData)
    }
  }

  const handleLogout = () => {
    // Clear all user data and authentication state
    localStorage.removeItem("apeInUser")
    localStorage.removeItem("thirdweb-auth")
    localStorage.removeItem("thirdweb-wallet")
    // Clear any other potential auth-related storage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("thirdweb") || key.startsWith("apeIn")) {
        localStorage.removeItem(key)
      }
    })
    router.push("/")
  }

  useEffect(() => {
    const stored = localStorage.getItem("apeInUser")
    if (stored) {
      const user = JSON.parse(stored)
      // Get updated stats from XP system
      const userStats = xpSystem.getUserStats()
      setUserData({
        ...user,
        xp: userStats.xp,
        trophies: userStats.trophies,
        rank: userStats.rank,
      })
    } else {
      router.push("/onboarding")
    }
  }, [router])

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-black tracking-tighter">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                ApeIn
              </span>
            </h1>
          </Link>
          <div className="flex gap-2">
            <Link href="/submit">
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Submit Spark
              </Button>
            </Link>
            <Link href="/feed">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Flame className="h-4 w-4 mr-1" />
                Hype Feed
              </Button>
            </Link>
            <Link href="/squad">
              <Button size="sm" variant="outline">
                <Users className="h-4 w-4 mr-1" />
                Squad Up
              </Button>
            </Link>
            <Link href="/funding">
              <Button size="sm" variant="outline">
                <Coins className="h-4 w-4 mr-1" />
                Funding
              </Button>
            </Link>
            <Link href="/admin">
              <Button size="sm" variant="outline" className="text-xs">
                Admin
              </Button>
            </Link>
            <Button size="sm" variant="ghost" onClick={handleLogout} className="text-xs">
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Status Card */}
        <Card className="p-8 border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
          <div className="flex flex-col items-center space-y-6">
            {/* Profile Image */}
            <div className="relative">
              {userData.profileImage ? (
                <img
                  src={userData.profileImage || "/placeholder.svg"}
                  alt={userData.name || "Profile"}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary pulse-glow"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center border-4 border-primary pulse-glow">
                  <span className="text-4xl font-black text-primary-foreground">
                    {userData.name ? userData.name.charAt(0).toUpperCase() : "?"}
                  </span>
                </div>
              )}
              <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground font-bold">
                {userData.authMethod === "twitter" ? "X Verified" : "Email"}
              </Badge>
            </div>

            {/* Name */}
            <div className="text-center space-y-1">
              <h2 className="text-3xl font-black">{userData.name || "User"}</h2>
              {userData.email && <p className="text-sm text-muted-foreground">{userData.email}</p>}
            </div>

            {/* XP Display */}
            <div className="w-full max-w-sm">
              <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-6 w-6 text-primary" />
                    <span className="text-lg font-bold">XP Balance</span>
                  </div>
                  <span className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {userData.xp}
                  </span>
                </div>
                {userData.rank && (
                  <div className="mt-2 text-center">
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      {userData.rank}
                    </Badge>
                  </div>
                )}
              </Card>
            </div>

            {/* Smart Wallet Status */}
            {userData.smartWalletCreated && userData.walletAddress && (
              <div className="w-full max-w-xs">
                <Card className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-bold text-blue-800">Account ID</span>
                      <span className="text-xs text-blue-600 cursor-help" title="This is your unique wallet address on our platform, more to come">What's this?</span>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-xs text-blue-700 mt-1 font-mono">
                    {userData.walletAddress ? `${userData.walletAddress.slice(0, 6)}...${userData.walletAddress.slice(-4)}` : "No account"}
                  </p>
                </Card>
              </div>
            )}
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Card className="p-4 text-center border-2 hover:border-primary/50 transition-colors">
            <div className="text-2xl font-black text-primary">{userData.xp || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">Total XP</div>
          </Card>
          <Card className="p-4 text-center border-2 hover:border-secondary/50 transition-colors">
            <div className="text-2xl font-black text-secondary">0</div>
            <div className="text-xs text-muted-foreground mt-1">Sparks Hyped</div>
          </Card>
          <Card className="p-4 text-center border-2 hover:border-accent/50 transition-colors">
            <div className="text-2xl font-black text-accent">0</div>
            <div className="text-xs text-muted-foreground mt-1">Sparks Submitted</div>
          </Card>
        </div>

        {/* Trophy Case */}
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Trophy Case
          </h3>
          <TrophyCase />
        </div>

        {/* Social Connection */}
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Social Connections
          </h3>
          <SocialConnection onXpEarned={handleXpEarned} currentXp={userData.xp || 0} />
        </div>

        {/* Activity Section */}
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Recent Activity
          </h3>
          <Card className="p-6 text-center border-2 border-dashed">
            <p className="text-muted-foreground">No activity yet. Start swiping to earn XP!</p>
            <Link href="/feed">
              <Button className="mt-4 bg-primary hover:bg-primary/90">Go to Hype Feed</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
