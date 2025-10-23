"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Zap, TrendingUp, Target, Award, X } from "lucide-react"
import { xpSystem, XP_REWARDS } from "@/lib/xp-system"

interface BoostSystemProps {
  projectId: string
  projectTitle: string
  currentHypeCount: number
  onBoostSuccess?: (boostAmount: number, multiplier: number) => void
  onClose?: () => void
}

export function BoostSystem({ 
  projectId, 
  projectTitle, 
  currentHypeCount, 
  onBoostSuccess,
  onClose 
}: BoostSystemProps) {
  const [boostAmount, setBoostAmount] = useState(0)
  const [userXP, setUserXP] = useState(0)
  const [boostedAmount, setBoostedAmount] = useState(0)
  const [isBoosting, setIsBoosting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const userStats = xpSystem.getUserStats()
    setUserXP(userStats.xp)
    
    const boostedProjects = xpSystem.getBoostedProjects()
    setBoostedAmount(boostedProjects[projectId] || 0)
  }, [projectId])

  const handleBoost = async () => {
    if (boostAmount <= 0 || boostAmount > userXP) return

    setIsBoosting(true)
    
    // Simulate boost transaction
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const success = xpSystem.boostProject(projectId, boostAmount)
    
    if (success) {
      const multiplier = xpSystem.calculateBoostMultiplier(currentHypeCount, boostAmount)
      setBoostedAmount(boostedAmount + boostAmount)
      setUserXP(userXP - boostAmount)
      setShowSuccess(true)
      
      if (onBoostSuccess) {
        onBoostSuccess(boostAmount, multiplier)
      }
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
        if (onClose) onClose()
      }, 3000)
    }
    
    setIsBoosting(false)
  }

  const getMultiplierPreview = () => {
    if (boostAmount <= 0) return 1.0
    return xpSystem.calculateBoostMultiplier(currentHypeCount, boostAmount)
  }

  const getPotentialReturn = () => {
    const multiplier = getMultiplierPreview()
    return Math.floor(boostAmount * multiplier)
  }

  if (showSuccess) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Award className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-green-800 mb-2">Boost Successful!</h3>
          <p className="text-green-700 mb-4">
            You've boosted <strong>{projectTitle}</strong> with {boostAmount} XP
          </p>
          <div className="bg-green-100 rounded-lg p-3">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-green-600" />
              <span className="font-bold text-green-800">Potential Return</span>
            </div>
            <div className="text-2xl font-black text-green-800">
              {getPotentialReturn()} XP
            </div>
            <p className="text-xs text-green-600">
              {getMultiplierPreview()}x multiplier if project succeeds
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Boost Project
            </CardTitle>
            <CardDescription>
              Stake your XP to show conviction in this project
            </CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Info */}
        <div className="bg-primary/5 rounded-lg p-4">
          <h3 className="font-bold text-lg mb-2">{projectTitle}</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>{currentHypeCount} Hypes</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>Early Stage</span>
            </div>
          </div>
        </div>

        {/* Current Boost Status */}
        {boostedAmount > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Already Boosted</span>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {boostedAmount} XP
              </Badge>
            </div>
          </div>
        )}

        {/* Boost Amount Input */}
        <div className="space-y-4">
          <Label htmlFor="boostAmount" className="text-lg font-bold">
            Amount to Boost (XP)
          </Label>
          <div className="space-y-2">
            <Input
              id="boostAmount"
              type="number"
              min="1"
              max={userXP}
              value={boostAmount || ""}
              onChange={(e) => setBoostAmount(parseInt(e.target.value) || 0)}
              placeholder="Enter XP amount"
              className="h-12 text-lg"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Available: {userXP} XP</span>
              <span>Min: 1 XP</span>
            </div>
          </div>
        </div>

        {/* Boost Preview */}
        {boostAmount > 0 && (
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Boost Amount</span>
                <span className="font-bold">{boostAmount} XP</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Multiplier</span>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  {getMultiplierPreview()}x
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Potential Return</span>
                <span className="font-bold text-primary">{getPotentialReturn()} XP</span>
              </div>
              <div className="pt-2 border-t border-primary/20">
                <p className="text-xs text-muted-foreground">
                  {currentHypeCount < 10 
                    ? "Early boost - maximum multiplier!" 
                    : currentHypeCount < 50 
                    ? "Good timing - high multiplier" 
                    : "Standard multiplier"
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Boost Button */}
        <Button
          onClick={handleBoost}
          disabled={boostAmount <= 0 || boostAmount > userXP || isBoosting}
          size="lg"
          className="w-full h-12 text-lg font-bold pulse-glow"
        >
          {isBoosting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Boosting...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-5 w-5" />
              Boost Project
            </>
          )}
        </Button>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
            <Target className="h-4 w-4" />
            How Boosting Works
          </h4>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• Your XP is locked until the project reaches its next milestone</p>
            <p>• Earlier boosts get higher multipliers (up to 5x)</p>
            <p>• If the project succeeds, you get your XP back plus the multiplier</p>
            <p>• If it fails, you lose the staked XP</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
