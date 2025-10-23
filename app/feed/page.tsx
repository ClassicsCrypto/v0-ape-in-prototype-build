"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Flame, X, Info, User, Zap, ArrowLeft, TrendingUp, Target } from "lucide-react"
import Link from "next/link"
import { BoostSystem } from "@/components/boost-system"
import { xpSystem } from "@/lib/xp-system"

interface Spark {
  id: string
  title: string
  description: string
  mediaUrl: string | null
  mediaType: "image" | "video" | null
  createdAt: string
  hypes: number
  wipes: number
  boostedXP?: number
  creatorId?: string
  milestone?: number
}

// Sample sparks for demo
const SAMPLE_SPARKS: Spark[] = [
  {
    id: "1",
    title: "CryptoKitties 2.0",
    description: "Next-gen NFT pets with AI personalities that evolve based on blockchain interactions",
    mediaUrl: "/cute-digital-cat-nft.jpg",
    mediaType: "image",
    createdAt: new Date().toISOString(),
    hypes: 42,
    wipes: 5,
  },
  {
    id: "2",
    title: "MetaFit",
    description: "Fitness app where your workouts mint NFTs and unlock exclusive gym memberships in the metaverse",
    mediaUrl: "/futuristic-fitness-app.jpg",
    mediaType: "image",
    createdAt: new Date().toISOString(),
    hypes: 128,
    wipes: 12,
  },
  {
    id: "3",
    title: "SoundWave DAO",
    description: "Decentralized music label where fans vote on which artists to sign and share in their success",
    mediaUrl: "/music-waves-neon.jpg",
    mediaType: "image",
    createdAt: new Date().toISOString(),
    hypes: 89,
    wipes: 8,
  },
]

export default function HypeFeedPage() {
  const router = useRouter()
  const [sparks, setSparks] = useState<Spark[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"up" | "down" | null>(null)
  const [userXP, setUserXP] = useState(0)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const [showBoostModal, setShowBoostModal] = useState(false)
  const [boostedProjects, setBoostedProjects] = useState<Record<string, number>>({})

  useEffect(() => {
    // Load user XP and stats
    const userStats = xpSystem.getUserStats()
    setUserXP(userStats.xp)
    setBoostedProjects(xpSystem.getBoostedProjects())

    // Load sparks from localStorage and combine with samples
    const storedSparks = JSON.parse(localStorage.getItem("apeInSparks") || "[]")
    setSparks([...SAMPLE_SPARKS, ...storedSparks])
  }, [])

  const currentSpark = sparks[currentIndex]

  const handleHype = () => {
    setSwipeDirection("up")
    setTimeout(() => {
      awardXP('HYPE_WIPE_DEEP_DIVE')
      // Update spark hype count
      const updatedSparks = [...sparks]
      updatedSparks[currentIndex].hypes += 1
      setSparks(updatedSparks)
      nextSpark()
    }, 300)
  }

  const handleWipe = () => {
    setSwipeDirection("down")
    setTimeout(() => {
      awardXP('HYPE_WIPE_DEEP_DIVE')
      // Update spark wipe count
      const updatedSparks = [...sparks]
      updatedSparks[currentIndex].wipes += 1
      setSparks(updatedSparks)
      nextSpark()
    }, 300)
  }

  const awardXP = (action: string = 'HYPE_WIPE_DEEP_DIVE') => {
    const xpGained = xpSystem.awardXP(action as any)
    setUserXP(userXP + xpGained)
  }

  const nextSpark = () => {
    setSwipeDirection(null)
    setShowDetails(false)
    if (currentIndex < sparks.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Loop back to start
      setCurrentIndex(0)
    }
  }

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    })
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const deltaY = touchStart.y - touchEnd.y
    const deltaX = touchStart.x - touchEnd.x

    // Vertical swipe detection
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
      if (deltaY > 0) {
        // Swipe up = Hype
        handleHype()
      } else {
        // Swipe down = Wipe
        handleWipe()
      }
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  if (sparks.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4">
          <Flame className="h-16 w-16 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-bold">No Sparks Yet</h2>
          <p className="text-muted-foreground">Be the first to submit a Spark!</p>
          <Link href="/submit">
            <Button className="mt-4">Submit Spark</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!currentSpark) return null

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur z-10">
        <Link href="/profile">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
          <Zap className="h-4 w-4 text-primary" />
          <span className="font-bold text-sm">{userXP} XP</span>
        </div>
        <Link href="/profile">
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Spark Card */}
      <div className="flex-1 relative overflow-hidden">
        <div
          className={`absolute inset-0 ${swipeDirection === "up" ? "swipe-up" : ""} ${swipeDirection === "down" ? "swipe-down" : ""}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Media Background */}
          <div className="absolute inset-0">
            {currentSpark.mediaType === "image" ? (
              <img
                src={currentSpark.mediaUrl || "/placeholder.svg"}
                alt={currentSpark.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <video src={currentSpark.mediaUrl || ""} autoPlay loop muted className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 pb-32">
            {/* Stats Badge */}
            <div className="flex gap-2 mb-4 flex-wrap">
              <Badge className="bg-primary/90 text-primary-foreground backdrop-blur">
                <Flame className="h-3 w-3 mr-1" />
                {currentSpark.hypes} Hypes
              </Badge>
              <Badge variant="secondary" className="bg-secondary/90 backdrop-blur">
                {currentSpark.wipes} Wipes
              </Badge>
              {currentSpark.boostedXP && currentSpark.boostedXP > 0 && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white backdrop-blur">
                  <Zap className="h-3 w-3 mr-1" />
                  {currentSpark.boostedXP} XP Boosted
                </Badge>
              )}
              {boostedProjects[currentSpark.id] && (
                <Badge className="bg-blue-500 text-white backdrop-blur">
                  <Target className="h-3 w-3 mr-1" />
                  You Boosted {boostedProjects[currentSpark.id]} XP
                </Badge>
              )}
            </div>

            {/* Title */}
            <h2 className="text-4xl font-black mb-2 text-balance">{currentSpark.title}</h2>

            {/* Description (shown when Deep Dive is active) */}
            {showDetails && (
              <div className="bg-card/95 backdrop-blur rounded-lg p-4 mb-4 border-2 border-primary animate-in slide-in-from-bottom">
                <p className="text-foreground leading-relaxed">{currentSpark.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 bg-background/95 backdrop-blur border-t border-border">
        <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
          {/* Wipe Button */}
          <Button
            size="lg"
            variant="outline"
            onClick={handleWipe}
            className="h-16 w-16 rounded-full border-2 hover:border-destructive hover:bg-destructive/10 bg-transparent"
          >
            <X className="h-8 w-8" />
          </Button>

          {/* Deep Dive Button */}
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              setShowDetails(!showDetails)
              if (!showDetails) awardXP('HYPE_WIPE_DEEP_DIVE')
            }}
            className="h-20 w-20 rounded-full border-2 hover:border-accent hover:bg-accent/10"
          >
            <Info className="h-10 w-10" />
          </Button>

          {/* Hype Button */}
          <Button
            size="lg"
            onClick={handleHype}
            className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 pulse-glow"
          >
            <Flame className="h-8 w-8" />
          </Button>
        </div>

        {/* Boost Button */}
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            onClick={() => setShowBoostModal(true)}
            className="border-2 border-primary/50 hover:border-primary hover:bg-primary/10"
          >
            <Zap className="h-4 w-4 mr-2" />
            Boost with XP
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-center mt-4 space-y-1">
          <p className="text-xs text-muted-foreground">Swipe up or tap Flame to Hype</p>
          <p className="text-xs text-muted-foreground">Swipe down or tap X to Wipe</p>
          <p className="text-xs text-muted-foreground">Tap Boost to stake XP and show conviction</p>
        </div>
      </div>

      {/* Boost Modal */}
      {showBoostModal && currentSpark && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <BoostSystem
              projectId={currentSpark.id}
              projectTitle={currentSpark.title}
              currentHypeCount={currentSpark.hypes}
              onBoostSuccess={(boostAmount, multiplier) => {
                // Update spark with boosted XP
                const updatedSparks = [...sparks]
                updatedSparks[currentIndex].boostedXP = (updatedSparks[currentIndex].boostedXP || 0) + boostAmount
                setSparks(updatedSparks)
                
                // Update local state
                setBoostedProjects({...boostedProjects, [currentSpark.id]: (boostedProjects[currentSpark.id] || 0) + boostAmount})
                setUserXP(userXP - boostAmount)
              }}
              onClose={() => setShowBoostModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
