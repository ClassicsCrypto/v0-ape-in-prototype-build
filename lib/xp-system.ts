// XP System Implementation based on ApeIn Final document
export interface XPAction {
  id: string
  type: 'creation' | 'curation' | 'building' | 'funding' | 'general'
  action: string
  xpAmount: number
  description: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface Trophy {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  earnedAt: string
  projectId?: string
}

export interface UserStats {
  xp: number
  trophies: Trophy[]
  totalActions: number
  creationActions: number
  curationActions: number
  buildingActions: number
  fundingActions: number
  rank: string
}

// XP Rewards based on the ApeIn Final document
export const XP_REWARDS = {
  // Creation Actions
  SUBMIT_IDEA: 10,
  POST_SUBMISSION_TO_X: 5,
  IDEA_REACHES_HYPE_1: 250,
  IDEA_REACHES_HYPE_2: 350,
  IDEA_REACHES_HYPE_3: 450,
  IDEA_SELECTED_FOR_FUNDING: 500,

  // Curation Actions
  HYPE_WIPE_DEEP_DIVE: 1,
  BOOST_PROJECT: 0, // XP is locked
  SUCCESSFUL_BOOST_MULTIPLIER: 1.5, // Base multiplier, can go up to 5x
  ENTER_ORACLE_POOL: 0, // XP is locked
  WIN_ORACLE_POOL: 0, // Share of total pool
  SUPER_VOUCH: 50,
  SUCCESSFUL_CURATION: 500,
  PARTICIPATE_OG_REVIEW: 250,

  // Building Actions
  UPGRADE_TO_BUILDER: 50,
  POST_CANDIDACY_TO_X: 5,
  SUBMIT_MILESTONE_DELIVERABLE: 25,
  POST_SUBMISSION_TO_X: 10,
  SUCCESSFULLY_DELIVER_MILESTONE: 1000,
  WIN_DEADLINE_CHALLENGE: 500,

  // Funding Actions
  MINT_GENESIS_NFT: 250,
  POST_MINT_TO_X: 10,
  CAST_MILESTONE_VOTE_GENESIS: 20,
  SUCCESSFULLY_PASS_MILESTONE_PRE_LAUNCH: 500,
  EJECT_BUTTON_PRE_LAUNCH: -500,
  PARTICIPATE_DEADLINE_CHALLENGE: 0, // XP is locked
  WIN_DEADLINE_CHALLENGE: 0, // Staked XP returned + bonus
  MINT_REGULAR_NFT: 50,
  CAST_MILESTONE_VOTE_REGULAR: 5,
  SUCCESSFULLY_PASS_MILESTONE_POST_LAUNCH: 100,
  EJECT_BUTTON_POST_LAUNCH: -250,

  // General Actions
  CREATE_PROFILE: 10,
  POST_CANDIDACY_TO_X: 5,
} as const

// Trophy definitions
export const TROPHY_DEFINITIONS = {
  FOUNDING_MEMBER: {
    id: 'founding_member',
    name: 'Founding Member',
    description: 'Day 1 ApeIn supporter',
    icon: '🏆',
    rarity: 'legendary' as const,
  },
  GREENLIT: {
    id: 'greenlit',
    name: 'Greenlit Trophy',
    description: 'Successfully funded project',
    icon: '🎬',
    rarity: 'epic' as const,
  },
  VOYAGER: {
    id: 'voyager',
    name: 'Voyager Trophy',
    description: 'Early curator who discovered winning projects',
    icon: '🚀',
    rarity: 'epic' as const,
  },
  PROPHET: {
    id: 'prophet',
    name: 'Prophet Trophy',
    description: 'Accurate predictor in Oracle pools',
    icon: '🔮',
    rarity: 'rare' as const,
  },
  RELIABLE: {
    id: 'reliable',
    name: 'Reliable Trophy',
    description: 'Delivered milestone on time',
    icon: '⏰',
    rarity: 'rare' as const,
  },
  APEIN_TROPHY: {
    id: 'apein_trophy',
    name: 'ApeIn Trophy',
    description: 'Genesis NFT holder',
    icon: '🦍',
    rarity: 'epic' as const,
  },
} as const

export class XPSystem {
  private static instance: XPSystem
  private userData: any = null

  private constructor() {
    this.loadUserData()
  }

  static getInstance(): XPSystem {
    if (!XPSystem.instance) {
      XPSystem.instance = new XPSystem()
    }
    return XPSystem.instance
  }

  private loadUserData() {
    const userData = localStorage.getItem('apeInUser')
    if (userData) {
      this.userData = JSON.parse(userData)
    }
  }

  private saveUserData() {
    if (this.userData) {
      localStorage.setItem('apeInUser', JSON.stringify(this.userData))
    }
  }

  // Award XP for an action
  awardXP(action: keyof typeof XP_REWARDS, metadata?: Record<string, any>): number {
    this.loadUserData()
    if (!this.userData) return 0

    const xpAmount = XP_REWARDS[action]
    const newXP = (this.userData.xp || 0) + xpAmount

    // Update user data
    this.userData.xp = newXP
    this.userData.lastAction = {
      type: action,
      xpAmount,
      timestamp: new Date().toISOString(),
      metadata,
    }

    // Add to action history
    if (!this.userData.actionHistory) {
      this.userData.actionHistory = []
    }
    this.userData.actionHistory.push({
      id: Date.now().toString(),
      type: this.getActionType(action),
      action,
      xpAmount,
      description: this.getActionDescription(action),
      timestamp: new Date().toISOString(),
      metadata,
    })

    this.saveUserData()
    return xpAmount
  }

  // Award trophy
  awardTrophy(trophyId: keyof typeof TROPHY_DEFINITIONS, projectId?: string): Trophy {
    this.loadUserData()
    if (!this.userData) throw new Error('User not found')

    const trophyDef = TROPHY_DEFINITIONS[trophyId]
    const trophy: Trophy = {
      id: trophyDef.id,
      name: trophyDef.name,
      description: trophyDef.description,
      icon: trophyDef.icon,
      rarity: trophyDef.rarity,
      earnedAt: new Date().toISOString(),
      projectId,
    }

    if (!this.userData.trophies) {
      this.userData.trophies = []
    }

    // Check if trophy already exists
    const existingTrophy = this.userData.trophies.find((t: Trophy) => t.id === trophy.id)
    if (!existingTrophy) {
      this.userData.trophies.push(trophy)
      this.saveUserData()
    }

    return trophy
  }

  // Get user stats
  getUserStats(): UserStats {
    this.loadUserData()
    if (!this.userData) {
      return {
        xp: 0,
        trophies: [],
        totalActions: 0,
        creationActions: 0,
        curationActions: 0,
        buildingActions: 0,
        fundingActions: 0,
        rank: 'Newcomer',
      }
    }

    const actionHistory = this.userData.actionHistory || []
    const creationActions = actionHistory.filter((a: XPAction) => a.type === 'creation').length
    const curationActions = actionHistory.filter((a: XPAction) => a.type === 'curation').length
    const buildingActions = actionHistory.filter((a: XPAction) => a.type === 'building').length
    const fundingActions = actionHistory.filter((a: XPAction) => a.type === 'funding').length

    return {
      xp: this.userData.xp || 0,
      trophies: this.userData.trophies || [],
      totalActions: actionHistory.length,
      creationActions,
      curationActions,
      buildingActions,
      fundingActions,
      rank: this.calculateRank(this.userData.xp || 0),
    }
  }

  // Calculate user rank based on XP
  private calculateRank(xp: number): string {
    if (xp >= 10000) return 'Legend'
    if (xp >= 5000) return 'Master'
    if (xp >= 2500) return 'Expert'
    if (xp >= 1000) return 'Veteran'
    if (xp >= 500) return 'Advanced'
    if (xp >= 100) return 'Intermediate'
    return 'Newcomer'
  }

  // Get action type from action key
  private getActionType(action: string): XPAction['type'] {
    if (action.includes('SUBMIT') || action.includes('IDEA')) return 'creation'
    if (action.includes('HYPE') || action.includes('WIPE') || action.includes('BOOST') || action.includes('CURATION')) return 'curation'
    if (action.includes('BUILDER') || action.includes('MILESTONE') || action.includes('DELIVER')) return 'building'
    if (action.includes('MINT') || action.includes('FUNDING') || action.includes('VOTE')) return 'funding'
    return 'general'
  }

  // Get action description
  private getActionDescription(action: string): string {
    const descriptions: Record<string, string> = {
      SUBMIT_IDEA: 'Submitted a new idea',
      POST_SUBMISSION_TO_X: 'Shared submission on X',
      IDEA_REACHES_HYPE_1: 'Idea reached first hype milestone',
      IDEA_REACHES_HYPE_2: 'Idea reached second hype milestone',
      IDEA_REACHES_HYPE_3: 'Idea reached third hype milestone',
      IDEA_SELECTED_FOR_FUNDING: 'Idea selected for funding',
      HYPE_WIPE_DEEP_DIVE: 'Interacted with a spark',
      BOOST_PROJECT: 'Boosted a project with XP',
      SUPER_VOUCH: 'Used Super Vouch',
      SUCCESSFUL_CURATION: 'Successfully curated a project',
      PARTICIPATE_OG_REVIEW: 'Participated in OG review',
      UPGRADE_TO_BUILDER: 'Upgraded to builder profile',
      SUBMIT_MILESTONE_DELIVERABLE: 'Submitted milestone deliverable',
      SUCCESSFULLY_DELIVER_MILESTONE: 'Successfully delivered milestone',
      WIN_DEADLINE_CHALLENGE: 'Won deadline challenge',
      MINT_GENESIS_NFT: 'Minted Genesis NFT',
      CAST_MILESTONE_VOTE_GENESIS: 'Voted on milestone (Genesis holder)',
      SUCCESSFULLY_PASS_MILESTONE_PRE_LAUNCH: 'Milestone passed (pre-launch)',
      MINT_REGULAR_NFT: 'Minted regular NFT',
      CAST_MILESTONE_VOTE_REGULAR: 'Voted on milestone (regular holder)',
      SUCCESSFULLY_PASS_MILESTONE_POST_LAUNCH: 'Milestone passed (post-launch)',
      CREATE_PROFILE: 'Created profile',
    }
    return descriptions[action] || 'Performed action'
  }

  // Boost a project (stake XP)
  boostProject(projectId: string, xpAmount: number): boolean {
    this.loadUserData()
    if (!this.userData || this.userData.xp < xpAmount) return false

    this.userData.xp -= xpAmount
    if (!this.userData.boostedProjects) {
      this.userData.boostedProjects = {}
    }
    this.userData.boostedProjects[projectId] = (this.userData.boostedProjects[projectId] || 0) + xpAmount

    this.saveUserData()
    return true
  }

  // Get boosted projects
  getBoostedProjects(): Record<string, number> {
    this.loadUserData()
    return this.userData?.boostedProjects || {}
  }

  // Calculate boost multiplier based on timing
  calculateBoostMultiplier(projectHypeCount: number, boostAmount: number): number {
    // Earlier boosts get higher multipliers
    if (projectHypeCount < 10) return 5.0
    if (projectHypeCount < 50) return 3.0
    if (projectHypeCount < 100) return 2.0
    return 1.5
  }
}

// Export singleton instance
export const xpSystem = XPSystem.getInstance()
