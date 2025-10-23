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
  Users, 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Award, 
  Zap, 
  ArrowLeft,
  CheckCircle,
  X,
  Heart
} from "lucide-react"
import { xpSystem } from "@/lib/xp-system"
import Link from "next/link"

interface Talent {
  id: string
  name: string
  role: string
  skills: string[]
  xp: number
  trophies: number
  avatar?: string
  bio: string
  verified: boolean
  location?: string
}

interface Project {
  id: string
  title: string
  description: string
  creator: string
  skillsNeeded: string[]
  status: 'recruiting' | 'active' | 'completed'
  team: Talent[]
  maxTeamSize: number
}

// Sample talent pool
const SAMPLE_TALENT: Talent[] = [
  {
    id: "1",
    name: "Alex Chen",
    role: "Full-Stack Developer",
    skills: ["React", "Node.js", "Solidity", "Web3"],
    xp: 2500,
    trophies: 8,
    bio: "Passionate about building the future of Web3. 5+ years experience in full-stack development.",
    verified: true,
    location: "San Francisco, CA"
  },
  {
    id: "2", 
    name: "Sarah Kim",
    role: "UI/UX Designer",
    skills: ["Figma", "Adobe Creative Suite", "Prototyping", "User Research"],
    xp: 1800,
    trophies: 5,
    bio: "Creating beautiful and intuitive user experiences. Specialized in Web3 and DeFi interfaces.",
    verified: true,
    location: "New York, NY"
  },
  {
    id: "3",
    name: "Marcus Johnson",
    role: "Blockchain Developer",
    skills: ["Solidity", "Rust", "Smart Contracts", "DeFi"],
    xp: 3200,
    trophies: 12,
    bio: "Blockchain architect with expertise in DeFi protocols and smart contract security.",
    verified: true,
    location: "Austin, TX"
  },
  {
    id: "4",
    name: "Elena Rodriguez",
    role: "Product Manager",
    skills: ["Agile", "Product Strategy", "User Research", "Analytics"],
    xp: 2100,
    trophies: 6,
    bio: "Strategic product leader with experience scaling Web3 startups from 0 to 1M users.",
    verified: true,
    location: "Miami, FL"
  }
]

// Sample projects
const SAMPLE_PROJECTS: Project[] = [
  {
    id: "1",
    title: "CryptoKitties 2.0",
    description: "Next-gen NFT pets with AI personalities that evolve based on blockchain interactions",
    creator: "Visionary Creator",
    skillsNeeded: ["React", "Node.js", "Solidity", "AI/ML"],
    status: 'recruiting',
    team: [],
    maxTeamSize: 4
  },
  {
    id: "2",
    title: "MetaFit",
    description: "Fitness app where workouts mint NFTs and unlock exclusive gym memberships",
    creator: "Fitness Enthusiast",
    skillsNeeded: ["Mobile Development", "UI/UX", "Smart Contracts"],
    status: 'recruiting',
    team: [],
    maxTeamSize: 3
  }
]

export default function SquadUpPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'talent' | 'projects'>('talent')
  const [talent, setTalent] = useState<Talent[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [userXP, setUserXP] = useState(0)
  const [matches, setMatches] = useState<Record<string, boolean>>({})
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    skillsNeeded: '',
    maxTeamSize: 4
  })

  useEffect(() => {
    // Load user XP
    const userStats = xpSystem.getUserStats()
    setUserXP(userStats.xp)

    // Load talent and projects
    setTalent(SAMPLE_TALENT)
    setProjects(SAMPLE_PROJECTS)
  }, [])

  const filteredTalent = talent.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesRole = !filterRole || t.role.toLowerCase().includes(filterRole.toLowerCase())
    return matchesSearch && matchesRole
  })

  const handleSwipeRight = (talentId: string) => {
    setMatches({...matches, [talentId]: true})
    // Award XP for swiping right on talent
    xpSystem.awardXP('POST_CANDIDACY_TO_X')
    setUserXP(userXP + 5)
  }

  const handleSwipeLeft = (talentId: string) => {
    setMatches({...matches, [talentId]: false})
  }

  const handleCreateProject = () => {
    if (!newProject.title || !newProject.description) return

    const project: Project = {
      id: Date.now().toString(),
      title: newProject.title,
      description: newProject.description,
      creator: 'You',
      skillsNeeded: newProject.skillsNeeded.split(',').map(s => s.trim()),
      status: 'recruiting',
      team: [],
      maxTeamSize: newProject.maxTeamSize
    }

    setProjects([...projects, project])
    setShowCreateProject(false)
    setNewProject({ title: '', description: '', skillsNeeded: '', maxTeamSize: 4 })
    
    // Award XP for creating project
    xpSystem.awardXP('SUBMIT_IDEA')
    setUserXP(userXP + 10)
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
              Squad Up
            </span>
          </h1>
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-bold text-sm">{userXP} XP</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-4">
            <Button
              variant={activeTab === 'talent' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('talent')}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Talent Pool
            </Button>
            <Button
              variant={activeTab === 'projects' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('projects')}
              className="flex items-center gap-2"
            >
              <Star className="h-4 w-4" />
              Open Projects
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'talent' ? (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search talent by name, role, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="w-48">
                <Input
                  placeholder="Filter by role..."
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>

            {/* Talent Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTalent.map((person) => (
                <Card key={person.id} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <span className="text-lg font-bold text-white">
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold">{person.name}</h3>
                          <p className="text-sm text-muted-foreground">{person.role}</p>
                        </div>
                      </div>
                      {person.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {person.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{person.bio}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Zap className="h-4 w-4 text-primary" />
                          <span>{person.xp} XP</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-secondary" />
                          <span>{person.trophies} Trophies</span>
                        </div>
                      </div>
                    </div>

                    {person.location && (
                      <p className="text-xs text-muted-foreground">{person.location}</p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSwipeLeft(person.id)}
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Pass
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSwipeRight(person.id)}
                        className="flex-1"
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        Recruit
                      </Button>
                    </div>

                    {matches[person.id] && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-green-800">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">Match!</span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          You've shown interest in recruiting this talent.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Create Project Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Open Projects</h2>
              <Button onClick={() => setShowCreateProject(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription>by {project.creator}</CardDescription>
                      </div>
                      <Badge variant={project.status === 'recruiting' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                    
                    <div>
                      <h4 className="font-medium mb-2">Skills Needed</h4>
                      <div className="flex flex-wrap gap-1">
                        {project.skillsNeeded.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span>Team: {project.team.length}/{project.maxTeamSize}</span>
                      <span className="text-muted-foreground">
                        {project.maxTeamSize - project.team.length} spots left
                      </span>
                    </div>

                    <Button className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Join Project
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Create Project Modal */}
        {showCreateProject && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Create New Project</CardTitle>
                <CardDescription>
                  Start recruiting talent for your vision
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    placeholder="Enter project title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    placeholder="Describe your project vision"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="skills">Skills Needed (comma-separated)</Label>
                  <Input
                    id="skills"
                    value={newProject.skillsNeeded}
                    onChange={(e) => setNewProject({...newProject, skillsNeeded: e.target.value})}
                    placeholder="React, Node.js, Design, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="teamSize">Max Team Size</Label>
                  <Input
                    id="teamSize"
                    type="number"
                    min="2"
                    max="10"
                    value={newProject.maxTeamSize}
                    onChange={(e) => setNewProject({...newProject, maxTeamSize: parseInt(e.target.value)})}
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowCreateProject(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject} className="flex-1">
                    Create Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
