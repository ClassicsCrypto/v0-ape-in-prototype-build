"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Coins, 
  Shield, 
  Users, 
  Zap, 
  ArrowLeft,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  Lock,
  Unlock
} from "lucide-react"
import { xpSystem } from "@/lib/xp-system"
import Link from "next/link"

interface Project {
  id: string
  title: string
  description: string
  team: string[]
  milestones: Milestone[]
  totalFunding: number
  targetFunding: number
  genesisNFTPrice: number
  totalNFTs: number
  soldNFTs: number
  status: 'funding' | 'active' | 'completed'
  smartVaultAddress?: string
  createdAt: string
}

interface Milestone {
  id: string
  title: string
  description: string
  fundingAmount: number
  deadline: string
  status: 'pending' | 'in_progress' | 'completed' | 'rejected'
  deliverables: string[]
}

// Sample projects ready for funding
const SAMPLE_PROJECTS: Project[] = [
  {
    id: "1",
    title: "CryptoKitties 2.0",
    description: "Next-gen NFT pets with AI personalities that evolve based on blockchain interactions",
    team: ["Alex Chen (Lead Dev)", "Sarah Kim (Designer)", "Marcus Johnson (Blockchain)"],
    milestones: [
      {
        id: "1",
        title: "MVP Development",
        description: "Core smart contracts and basic UI",
        fundingAmount: 5000,
        deadline: "2024-03-15",
        status: 'pending',
        deliverables: ["Smart contracts deployed", "Basic UI completed", "Initial testing"]
      },
      {
        id: "2", 
        title: "AI Integration",
        description: "Implement AI personality system",
        fundingAmount: 8000,
        deadline: "2024-04-30",
        status: 'pending',
        deliverables: ["AI model trained", "Personality system integrated", "User testing completed"]
      },
      {
        id: "3",
        title: "Launch & Marketing",
        description: "Public launch and marketing campaign",
        fundingAmount: 7000,
        deadline: "2024-06-15",
        status: 'pending',
        deliverables: ["Public launch", "Marketing campaign", "Community building"]
      }
    ],
    totalFunding: 0,
    targetFunding: 20000,
    genesisNFTPrice: 100,
    totalNFTs: 200,
    soldNFTs: 0,
    status: 'funding',
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    title: "MetaFit",
    description: "Fitness app where workouts mint NFTs and unlock exclusive gym memberships",
    team: ["Elena Rodriguez (PM)", "Alex Chen (Dev)", "Sarah Kim (Designer)"],
    milestones: [
      {
        id: "1",
        title: "App Development",
        description: "Core mobile app with workout tracking",
        fundingAmount: 6000,
        deadline: "2024-03-01",
        status: 'pending',
        deliverables: ["Mobile app MVP", "Workout tracking", "Basic NFT minting"]
      },
      {
        id: "2",
        title: "Gym Partnerships",
        description: "Establish partnerships with gyms",
        fundingAmount: 4000,
        deadline: "2024-04-15",
        status: 'pending',
        deliverables: ["10 gym partnerships", "Membership integration", "Reward system"]
      }
    ],
    totalFunding: 0,
    targetFunding: 10000,
    genesisNFTPrice: 50,
    totalNFTs: 100,
    soldNFTs: 0,
    status: 'funding',
    createdAt: "2024-01-20"
  }
]

export default function FundingPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [userXP, setUserXP] = useState(0)
  const [userNFTs, setUserNFTs] = useState<Record<string, number>>({})
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [mintAmount, setMintAmount] = useState(1)
  const [showMintModal, setShowMintModal] = useState(false)

  useEffect(() => {
    // Load user XP and NFTs
    const userStats = xpSystem.getUserStats()
    setUserXP(userStats.xp)

    // Load user's NFTs from localStorage
    const storedNFTs = JSON.parse(localStorage.getItem("apeInUserNFTs") || "{}")
    setUserNFTs(storedNFTs)

    // Load projects
    setProjects(SAMPLE_PROJECTS)
  }, [])

  const handleMintNFT = (projectId: string, amount: number) => {
    const project = projects.find(p => p.id === projectId)
    if (!project) return

    const totalCost = project.genesisNFTPrice * amount
    
    // Simulate NFT minting
    const newUserNFTs = { ...userNFTs }
    newUserNFTs[projectId] = (newUserNFTs[projectId] || 0) + amount
    setUserNFTs(newUserNFTs)
    localStorage.setItem("apeInUserNFTs", JSON.stringify(newUserNFTs))

    // Update project
    const updatedProjects = projects.map(p => 
      p.id === projectId 
        ? { ...p, soldNFTs: p.soldNFTs + amount, totalFunding: p.totalFunding + totalCost }
        : p
    )
    setProjects(updatedProjects)

    // Award XP for minting Genesis NFT
    const xpGained = xpSystem.awardXP('MINT_GENESIS_NFT')
    setUserXP(userXP + xpGained)

    // Check if project is fully funded
    const updatedProject = updatedProjects.find(p => p.id === projectId)
    if (updatedProject && updatedProject.totalFunding >= updatedProject.targetFunding) {
      // Award XP for successful funding
      xpSystem.awardXP('SUCCESSFULLY_PASS_MILESTONE_PRE_LAUNCH')
      setUserXP(userXP + xpGained + 500)
    }

    setShowMintModal(false)
    setSelectedProject(null)
  }

  const getFundingProgress = (project: Project) => {
    return (project.totalFunding / project.targetFunding) * 100
  }

  const getTimeRemaining = (project: Project) => {
    const daysSinceCreated = Math.floor((Date.now() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    const daysRemaining = Math.max(0, 30 - daysSinceCreated) // 30 day funding period
    return daysRemaining
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/profile">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-black tracking-tighter">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Funding Hub
            </span>
          </h1>
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-bold text-sm">{userXP} XP</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header Info */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Coins className="h-6 w-6 text-primary" />
              Genesis NFT Funding
            </h2>
            <p className="text-muted-foreground mb-4">
              Fund promising projects by minting Genesis NFTs. Your NFTs give you governance rights 
              and a share of the project's success.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Rug-Proof</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Funds are locked in Smart Vaults with milestone-based releases
                </p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Governance</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Vote on milestones and hold teams accountable
                </p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Rewards</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Earn XP and get exclusive project benefits
                </p>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <CardDescription>by {project.team[0]}</CardDescription>
                    </div>
                    <Badge variant={project.status === 'funding' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{project.description}</p>

                  {/* Team */}
                  <div>
                    <h4 className="font-medium mb-2">Team</h4>
                    <div className="space-y-1">
                      {project.team.map((member, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          {member}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Funding Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Funding Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {project.totalFunding.toLocaleString()} / {project.targetFunding.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getFundingProgress(project)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <span className="text-muted-foreground">
                        {Math.round(getFundingProgress(project))}% funded
                      </span>
                      <span className="text-muted-foreground">
                        {getTimeRemaining(project)} days left
                      </span>
                    </div>
                  </div>

                  {/* NFT Info */}
                  <div className="bg-primary/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Genesis NFT</span>
                      <span className="text-lg font-bold">${project.genesisNFTPrice}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{project.soldNFTs} / {project.totalNFTs} sold</span>
                      {userNFTs[project.id] && (
                        <span className="text-primary font-medium">
                          You own {userNFTs[project.id]} NFT{userNFTs[project.id] > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Milestones Preview */}
                  <div>
                    <h4 className="font-medium mb-2">Milestones</h4>
                    <div className="space-y-2">
                      {project.milestones.slice(0, 2).map((milestone) => (
                        <div key={milestone.id} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 rounded-full bg-gray-300" />
                          <span className="text-muted-foreground">{milestone.title}</span>
                          <span className="text-xs text-muted-foreground">
                            ${milestone.fundingAmount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                      {project.milestones.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{project.milestones.length - 2} more milestones
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    onClick={() => {
                      setSelectedProject(project)
                      setShowMintModal(true)
                    }}
                    className="w-full"
                    disabled={project.status !== 'funding'}
                  >
                    <Coins className="h-4 w-4 mr-2" />
                    Mint Genesis NFT
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Mint Modal */}
      {showMintModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Mint Genesis NFT</CardTitle>
              <CardDescription>
                {selectedProject.title} - ${selectedProject.genesisNFTPrice} per NFT
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="amount">Number of NFTs</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  max={selectedProject.totalNFTs - selectedProject.soldNFTs}
                  value={mintAmount}
                  onChange={(e) => setMintAmount(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="bg-primary/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Total Cost</span>
                  <span className="text-lg font-bold">
                    ${(selectedProject.genesisNFTPrice * mintAmount).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {mintAmount} NFT{mintAmount > 1 ? 's' : ''} × ${selectedProject.genesisNFTPrice}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">What you get:</h4>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Governance rights over project milestones</li>
                  <li>• Share of project success and royalties</li>
                  <li>• Exclusive access to project updates</li>
                  <li>• {xpSystem.getUserStats().xp + 250} XP reward</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowMintModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleMintNFT(selectedProject.id, mintAmount)}
                  className="flex-1"
                >
                  <Coins className="h-4 w-4 mr-2" />
                  Mint NFT{mintAmount > 1 ? 's' : ''}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
