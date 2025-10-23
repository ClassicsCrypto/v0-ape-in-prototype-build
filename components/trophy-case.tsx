"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Award, Star, Crown, Zap } from "lucide-react"
import { xpSystem, Trophy as TrophyType } from "@/lib/xp-system"

interface TrophyCaseProps {
  userId?: string
  showAll?: boolean
}

export function TrophyCase({ userId, showAll = false }: TrophyCaseProps) {
  const [trophies, setTrophies] = useState<TrophyType[]>([])
  const [userStats, setUserStats] = useState(xpSystem.getUserStats())

  useEffect(() => {
    const stats = xpSystem.getUserStats()
    setUserStats(stats)
    setTrophies(stats.trophies)
  }, [])

  const getRarityColor = (rarity: TrophyType['rarity']) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
      case 'common': return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
      default: return 'bg-gray-200 text-gray-800'
    }
  }

  const getRarityIcon = (rarity: TrophyType['rarity']) => {
    switch (rarity) {
      case 'legendary': return <Crown className="h-4 w-4" />
      case 'epic': return <Star className="h-4 w-4" />
      case 'rare': return <Award className="h-4 w-4" />
      case 'common': return <Trophy className="h-4 w-4" />
      default: return <Trophy className="h-4 w-4" />
    }
  }

  const getRarityLabel = (rarity: TrophyType['rarity']) => {
    switch (rarity) {
      case 'legendary': return 'Legendary'
      case 'epic': return 'Epic'
      case 'rare': return 'Rare'
      case 'common': return 'Common'
      default: return 'Unknown'
    }
  }

  if (trophies.length === 0) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="p-8 text-center">
          <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Trophies Yet</h3>
          <p className="text-muted-foreground mb-4">
            Start participating in the ApeIn ecosystem to earn your first trophy!
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Submit your first Spark</p>
            <p>• Boost projects with XP</p>
            <p>• Join a project team</p>
            <p>• Fund a Genesis collection</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Trophy Stats */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Trophy Collection
          </CardTitle>
          <CardDescription>
            Your achievements in the ApeIn ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-black text-primary">{trophies.length}</div>
              <div className="text-xs text-muted-foreground">Total Trophies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-secondary">
                {trophies.filter(t => t.rarity === 'legendary').length}
              </div>
              <div className="text-xs text-muted-foreground">Legendary</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-accent">
                {trophies.filter(t => t.rarity === 'epic').length}
              </div>
              <div className="text-xs text-muted-foreground">Epic</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-primary">
                {userStats.rank}
              </div>
              <div className="text-xs text-muted-foreground">Rank</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trophy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trophies.map((trophy) => (
          <Card key={trophy.id} className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{trophy.icon}</div>
                <Badge className={getRarityColor(trophy.rarity)}>
                  {getRarityIcon(trophy.rarity)}
                  <span className="ml-1">{getRarityLabel(trophy.rarity)}</span>
                </Badge>
              </div>
              
              <h3 className="font-bold text-lg mb-2">{trophy.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{trophy.description}</p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Earned</span>
                <span>{new Date(trophy.earnedAt).toLocaleDateString()}</span>
              </div>
              
              {trophy.projectId && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    Project: {trophy.projectId.slice(0, 8)}...
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievement Progress */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Achievement Progress
          </CardTitle>
          <CardDescription>
            Track your progress towards earning more trophies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Creation Actions</span>
              <span className="text-sm text-muted-foreground">{userStats.creationActions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Curation Actions</span>
              <span className="text-sm text-muted-foreground">{userStats.curationActions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Building Actions</span>
              <span className="text-sm text-muted-foreground">{userStats.buildingActions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Funding Actions</span>
              <span className="text-sm text-muted-foreground">{userStats.fundingActions}</span>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Total XP</span>
              <span className="text-sm font-bold text-primary">{userStats.xp}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((userStats.xp / 10000) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {userStats.xp < 10000 
                ? `${10000 - userStats.xp} XP until next rank` 
                : 'Maximum rank achieved!'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
