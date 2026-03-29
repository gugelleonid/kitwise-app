/**
 * KitWise Game Engine - Board Page Gamification System
 *
 * Core mechanics:
 * - Points system with tiered equipment values
 * - Combo counter for rapid additions (up to 10x multiplier)
 * - Streak system with milestone rewards
 * - Category completion bonuses
 * - Setup completion progress tracking
 * - All state is immutable (pure functions)
 */

import {
  UserEquipment,
  EquipmentCatalog,
  NicheRequirement,
  Niche,
} from './types'
import { mockNicheRequirements, mockEquipmentCatalog, mockNiches } from './mockData'

// =====================================================
// TYPES & INTERFACES
// =====================================================

export interface FloatingText {
  id: string
  text: string
  x: number
  y: number
  color: string
  timestamp: number
}

export interface Celebration {
  id: string
  type: 'combo' | 'streak' | 'category' | 'levelup' | 'achievement'
  title: string
  description: string
  timestamp: number
  icon?: string
}

export interface GameState {
  score: number
  combo: number
  maxCombo: number
  streak: number
  lastActionTime: number
  multiplier: number
  completedCategories: string[]
  nicheBonus: Record<string, number>
  floatingTexts: FloatingText[]
  celebrations: Celebration[]
  setupCompletion: number
  sessionStartTime: number
  totalPointsEarned: number
}

export interface GameEvent {
  type:
    | 'points_awarded'
    | 'combo_milestone'
    | 'streak_milestone'
    | 'category_completed'
    | 'combo_reset'
    | 'streak_reset'
  value: number
  milestone?: number
  celebrationId?: string
}

export interface NicheEquipmentMap {
  nicheId: string
  niche: Niche
  requirements: {
    must_have: NicheRequirementWithEquipment[]
    pro_level: NicheRequirementWithEquipment[]
    optimization: NicheRequirementWithEquipment[]
  }
}

export interface NicheRequirementWithEquipment extends NicheRequirement {
  equipment?: EquipmentCatalog
}

// =====================================================
// NICHE EQUIPMENT MAP - CORE GAME DATA
// =====================================================

/**
 * Maps each niche to recommended equipment tiers
 * Used for determining point bonuses and setup completion
 */
export const buildNicheEquipmentMap = (): Map<string, NicheEquipmentMap> => {
  const map = new Map<string, NicheEquipmentMap>()

  const niches = mockNiches
  const requirements = mockNicheRequirements
  const equipment = mockEquipmentCatalog

  for (const niche of niches) {
    const nicheReqs = requirements.filter((r) => r.niche_id === niche.id)

    const grouped: NicheEquipmentMap = {
      nicheId: niche.id,
      niche,
      requirements: {
        must_have: [],
        pro_level: [],
        optimization: [],
      },
    }

    for (const req of nicheReqs) {
      const equipmentData = equipment.find((e) => e.id === req.equipment_id)
      const reqWithEquipment: NicheRequirementWithEquipment = {
        ...req,
        equipment: equipmentData,
      }

      if (req.tier === 'must_have') {
        grouped.requirements.must_have.push(reqWithEquipment)
      } else if (req.tier === 'pro_level') {
        grouped.requirements.pro_level.push(reqWithEquipment)
      } else {
        grouped.requirements.optimization.push(reqWithEquipment)
      }
    }

    map.set(niche.id, grouped)
  }

  return map
}

export const nicheEquipmentMapInstance = buildNicheEquipmentMap()

// =====================================================
// GAME ENGINE - CORE FUNCTIONS
// =====================================================

/**
 * Get base points for equipment based on tier
 * must_have: 25 pts
 * pro_level: 15 pts
 * optimization: 10 pts
 * generic/unknown: 5 pts
 */
export const getBasePoints = (tier: string): number => {
  switch (tier) {
    case 'must_have':
      return 25
    case 'pro_level':
      return 15
    case 'optimization':
      return 10
    default:
      return 5
  }
}

/**
 * Get niche equipment bonus for specific equipment in a niche
 * Returns the tier of the equipment if matched in niche requirements
 */
export const getNicheEquipmentBonus = (
  nicheId: string,
  equipmentId: string,
  catalogEquipment: EquipmentCatalog[]
): number => {
  const nicheMap = nicheEquipmentMapInstance.get(nicheId)
  if (!nicheMap) return 5

  // Find the equipment's category from catalog
  const equipment = catalogEquipment.find(e => e.id === equipmentId)
  if (!equipment) return 5

  // Check all tiers — match by equipment_id first, then by category
  const allRequirements = [
    ...nicheMap.requirements.must_have,
    ...nicheMap.requirements.pro_level,
    ...nicheMap.requirements.optimization,
  ]

  // First try exact equipment_id match
  const exactMatch = allRequirements.find((req) => req.equipment_id === equipmentId)
  if (exactMatch) return getBasePoints(exactMatch.tier)

  // Then try category match (for requirements with equipment_id: null)
  const categoryMatch = allRequirements.find(
    (req) => !req.equipment_id && req.category === equipment.category
  )
  if (categoryMatch) return getBasePoints(categoryMatch.tier)

  return 5 // Base points for any equipment not in niche requirements
}

/**
 * Calculate points earned for adding equipment
 * Includes tier bonus, niche bonus, and combo multiplier
 */
const calculatePointsForEquipment = (
  equipmentId: string,
  nicheId: string,
  multiplier: number,
  catalogEquipment: EquipmentCatalog[]
): number => {
  const basePoints = getNicheEquipmentBonus(nicheId, equipmentId, catalogEquipment)
  return Math.floor(basePoints * multiplier)
}

/**
 * Check if combo should continue or reset
 * Combo breaks if > 5 seconds since last action
 */
const checkComboValidity = (
  lastActionTime: number,
  currentTime: number
): boolean => {
  const timeSinceLastAction = currentTime - lastActionTime
  return timeSinceLastAction < 5000 // 5 second window
}

/**
 * Calculate combo multiplier capped at 10x
 */
const calculateComboMultiplier = (comboCount: number): number => {
  return Math.min(1 + comboCount * 0.1, 10) // 1x to 10x
}

/**
 * Check if completing a category in niche requirements
 */
const checkCategoryCompletion = (
  userEquipment: UserEquipment[],
  nicheId: string,
  catalogEquipment: EquipmentCatalog[]
): string[] => {
  const nicheMap = nicheEquipmentMapInstance.get(nicheId)
  if (!nicheMap) return []

  const completedCategories: string[] = []
  const userEquipmentIds = new Set(userEquipment.map((e) => e.equipment_id))
  const userCategories = new Set(userEquipment.map((e) => e.category))

  // Check each category
  const allRequirements = [
    ...nicheMap.requirements.must_have,
    ...nicheMap.requirements.pro_level,
    ...nicheMap.requirements.optimization,
  ]

  // Group by category
  const categoryCounts = new Map<string, { total: number; owned: number }>()

  for (const req of allRequirements) {
    const category = req.category
    if (!categoryCounts.has(category)) {
      categoryCounts.set(category, { total: 0, owned: 0 })
    }
    const counts = categoryCounts.get(category)!
    counts.total += 1
    // Match by exact equipment_id or by category
    if (
      (req.equipment_id && userEquipmentIds.has(req.equipment_id)) ||
      (!req.equipment_id && userCategories.has(req.category))
    ) {
      counts.owned += 1
    }
  }

  // Check completion (all items in category owned)
  for (const [category, counts] of categoryCounts) {
    if (counts.total > 0 && counts.owned === counts.total) {
      completedCategories.push(category)
    }
  }

  return completedCategories
}

/**
 * Calculate setup completion percentage (0-100)
 * Based on ratio of equipment owned vs recommended for niche
 */
export const calculateSetupCompletion = (
  userEquipment: UserEquipment[],
  nicheId: string,
  catalogEquipment: EquipmentCatalog[]
): number => {
  const nicheMap = nicheEquipmentMapInstance.get(nicheId)
  if (!nicheMap) return 0

  const userEquipmentIds = new Set(userEquipment.map((e) => e.equipment_id))
  const userCategories = new Set(userEquipment.map((e) => e.category))

  // Helper: check if a requirement is satisfied (by exact ID or by category)
  const isReqSatisfied = (r: NicheRequirement): boolean => {
    if (r.equipment_id) return userEquipmentIds.has(r.equipment_id)
    return userCategories.has(r.category)
  }

  // Weight: must_have = 50%, pro_level = 30%, optimization = 20%
  const mustHaveReqs = nicheMap.requirements.must_have
  const proLevelReqs = nicheMap.requirements.pro_level
  const optimizationReqs = nicheMap.requirements.optimization

  let score = 0
  let maxScore = 0

  // Must have (highest weight)
  const mustHaveCompleted = mustHaveReqs.filter(isReqSatisfied).length
  const mustHavePercent = mustHaveReqs.length > 0
    ? (mustHaveCompleted / mustHaveReqs.length) * 100
    : 0
  score += (mustHavePercent / 100) * 50
  maxScore += 50

  // Pro level (medium weight)
  const proLevelCompleted = proLevelReqs.filter(isReqSatisfied).length
  const proLevelPercent = proLevelReqs.length > 0
    ? (proLevelCompleted / proLevelReqs.length) * 100
    : 0
  score += (proLevelPercent / 100) * 30
  maxScore += 30

  // Optimization (lowest weight)
  const optimizationCompleted = optimizationReqs.filter(isReqSatisfied).length
  const optimizationPercent = optimizationReqs.length > 0
    ? (optimizationCompleted / optimizationReqs.length) * 100
    : 0
  score += (optimizationPercent / 100) * 20
  maxScore += 20

  return Math.round((score / maxScore) * 100)
}

/**
 * Generate unique ID for floating text
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get emoji for streak milestone
 */
const getStreakEmoji = (streak: number): string => {
  if (streak >= 20) return '👑'
  if (streak >= 10) return '💎'
  if (streak >= 5) return '🔥🔥'
  if (streak >= 3) return '🔥'
  return ''
}

/**
 * Main action processor - called when user adds/upgrades equipment
 * Returns new state and events for UI
 */
export const processAction = (
  state: GameState,
  action: 'add' | 'upgrade',
  equipmentId: string,
  nicheId: string,
  userEquipment: UserEquipment[],
  catalogEquipment: EquipmentCatalog[],
  clickX: number = 0,
  clickY: number = 0
): {
  newState: GameState
  pointsEarned: number
  events: GameEvent[]
} => {
  const now = Date.now()
  let events: GameEvent[] = []
  let newState = { ...state }
  let pointsEarned = 0

  // Check combo validity
  const comboValid = checkComboValidity(state.lastActionTime, now)

  if (!comboValid) {
    // Streak breaks after 5s of no action
    if (state.streak > 0) {
      events.push({
        type: 'streak_reset',
        value: state.streak,
      })
    }
    newState.streak = 0
    newState.combo = 0
    newState.multiplier = 1
  }

  // Update combo
  newState.combo = comboValid ? state.combo + 1 : 1
  newState.multiplier = calculateComboMultiplier(newState.combo)
  newState.maxCombo = Math.max(state.maxCombo, newState.combo)
  newState.lastActionTime = now

  // Calculate points
  pointsEarned = calculatePointsForEquipment(
    equipmentId,
    nicheId,
    newState.multiplier,
    catalogEquipment
  )

  newState.score += pointsEarned
  newState.totalPointsEarned += pointsEarned
  newState.streak += 1

  events.push({
    type: 'points_awarded',
    value: pointsEarned,
  })

  // Add floating text
  const floatingId = generateId()
  newState.floatingTexts.push({
    id: floatingId,
    text: `+${pointsEarned}`,
    x: clickX,
    y: clickY,
    color: newState.multiplier > 1 ? '#FFD700' : '#4AFF00',
    timestamp: now,
  })

  // Remove old floating texts (older than 2 seconds)
  newState.floatingTexts = newState.floatingTexts.filter(
    (ft) => now - ft.timestamp < 2000
  )

  // Check combo milestones
  const comboMilestones = [2, 3, 5, 7, 10]
  if (comboMilestones.includes(newState.combo)) {
    const celebId = generateId()
    newState.celebrations.push({
      id: celebId,
      type: 'combo',
      title: `${newState.combo}x Комбо!`,
      description: `${newState.multiplier.toFixed(1)}x множитель очков`,
      timestamp: now,
      icon: '⚡',
    })
    events.push({
      type: 'combo_milestone',
      value: newState.combo,
      celebrationId: celebId,
    })
  }

  // Check streak milestones (3, 5, 10, 20)
  const streakMilestones = [3, 5, 10, 20]
  if (streakMilestones.includes(newState.streak)) {
    const celebId = generateId()
    const emoji = getStreakEmoji(newState.streak)
    newState.celebrations.push({
      id: celebId,
      type: 'streak',
      title: `Серия ${newState.streak}! ${emoji}`,
      description: 'Продолжай в том же духе!',
      timestamp: now,
      icon: emoji,
    })
    events.push({
      type: 'streak_milestone',
      value: newState.streak,
      celebrationId: celebId,
    })
  }

  // Check category completion
  const newUserEquipment = [
    ...userEquipment,
    {
      id: generateId(),
      user_id: 'temp',
      equipment_id: equipmentId,
      custom_name: null,
      category: '',
      status: 'owned' as const,
      quantity: 1,
      acquired_at: new Date().toISOString(),
      notes: null,
    },
  ]

  const completedCategories = checkCategoryCompletion(
    newUserEquipment,
    nicheId,
    catalogEquipment
  )

  const newlyCompletedCategories = completedCategories.filter(
    (c) => !newState.completedCategories.includes(c)
  )

  for (const category of newlyCompletedCategories) {
    const celebId = generateId()
    const categoryBonus = 50
    newState.score += categoryBonus
    newState.totalPointsEarned += categoryBonus

    newState.celebrations.push({
      id: celebId,
      type: 'category',
      title: `${category} собрано!`,
      description: `+${categoryBonus} бонусных очков`,
      timestamp: now,
      icon: '🎉',
    })

    events.push({
      type: 'category_completed',
      value: categoryBonus,
      celebrationId: celebId,
    })
  }

  newState.completedCategories = [
    ...new Set([...newState.completedCategories, ...completedCategories]),
  ]

  // Update setup completion
  newState.setupCompletion = calculateSetupCompletion(
    newUserEquipment,
    nicheId,
    catalogEquipment
  )

  // Cleanup old celebrations (older than 5 seconds)
  newState.celebrations = newState.celebrations.filter(
    (c) => now - c.timestamp < 5000
  )

  return {
    newState,
    pointsEarned,
    events,
  }
}

/**
 * Initialize fresh game state
 */
export const initializeGameState = (): GameState => {
  return {
    score: 0,
    combo: 0,
    maxCombo: 0,
    streak: 0,
    lastActionTime: 0,
    multiplier: 1,
    completedCategories: [],
    nicheBonus: {},
    floatingTexts: [],
    celebrations: [],
    setupCompletion: 0,
    sessionStartTime: Date.now(),
    totalPointsEarned: 0,
  }
}

/**
 * Reset game state (for new niche selection, etc)
 */
export const resetGameState = (currentState: GameState): GameState => {
  return {
    ...initializeGameState(),
    // Preserve stats across sessions if needed
    // maxCombo: currentState.maxCombo,
    // totalPointsEarned: currentState.totalPointsEarned,
  }
}

/**
 * Get all niche requirements for UI display
 */
export const getNicheRequirements = (nicheId: string) => {
  return nicheEquipmentMapInstance.get(nicheId)
}

/**
 * Get all niches
 */
export const getAllNiches = (): Niche[] => {
  return mockNiches
}

/**
 * Get equipment details from catalog
 */
export const getEquipmentDetails = (
  equipmentId: string
): EquipmentCatalog | undefined => {
  return mockEquipmentCatalog.find((e) => e.id === equipmentId)
}

/**
 * Check if equipment tier for specific niche
 */
export const getEquipmentTierInNiche = (
  equipmentId: string,
  nicheId: string
): 'must_have' | 'pro_level' | 'optimization' | 'not_recommended' => {
  const nicheMap = nicheEquipmentMapInstance.get(nicheId)
  if (!nicheMap) return 'not_recommended'

  if (nicheMap.requirements.must_have.some((r) => r.equipment_id === equipmentId)) {
    return 'must_have'
  }
  if (nicheMap.requirements.pro_level.some((r) => r.equipment_id === equipmentId)) {
    return 'pro_level'
  }
  if (nicheMap.requirements.optimization.some((r) => r.equipment_id === equipmentId)) {
    return 'optimization'
  }

  return 'not_recommended'
}

/**
 * Get equipment filtered by niche tier
 */
export const getEquipmentByTier = (
  nicheId: string,
  tier: 'must_have' | 'pro_level' | 'optimization'
): EquipmentCatalog[] => {
  const nicheMap = nicheEquipmentMapInstance.get(nicheId)
  if (!nicheMap) return []

  const requirements =
    tier === 'must_have'
      ? nicheMap.requirements.must_have
      : tier === 'pro_level'
        ? nicheMap.requirements.pro_level
        : nicheMap.requirements.optimization

  return requirements
    .filter((r) => r.equipment_id)
    .map((r) => getEquipmentDetails(r.equipment_id!))
    .filter((e): e is EquipmentCatalog => e !== undefined)
}

/**
 * Calculate session stats
 */
export const getSessionStats = (
  state: GameState
): {
  totalPoints: number
  itemsAdded: number
  averagePointsPerItem: number
  maxCombo: number
  longestStreak: number
  sessionDuration: number
} => {
  const sessionDuration = Date.now() - state.sessionStartTime
  const itemsAdded = state.totalPointsEarned === 0 ? 0 : Math.round(state.totalPointsEarned / 15) // rough estimate

  return {
    totalPoints: state.score,
    itemsAdded: state.streak + (state.combo - state.streak), // approximation
    averagePointsPerItem: itemsAdded > 0 ? Math.round(state.score / itemsAdded) : 0,
    maxCombo: state.maxCombo,
    longestStreak: state.streak,
    sessionDuration,
  }
}

// =====================================================
// CSS ANIMATION HELPERS
// =====================================================

/**
 * Generate CSS keyframes for floating text animation
 * Returns inline style object for floating damage numbers
 */
export const getFloatingTextStyle = (floatingText: FloatingText): React.CSSProperties => {
  const elapsed = Date.now() - floatingText.timestamp
  const progress = elapsed / 2000 // 2 second duration
  const opacity = Math.max(0, 1 - progress)
  const translateY = -60 * progress

  return {
    position: 'fixed',
    left: `${floatingText.x}px`,
    top: `${floatingText.y + translateY}px`,
    opacity,
    color: floatingText.color,
    fontSize: '24px',
    fontWeight: 'bold',
    pointerEvents: 'none',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    transform: `translateX(-50%) translateY(-${translateY}px)`,
    transition: 'opacity 0.2s ease-out',
  } as React.CSSProperties
}

/**
 * Particle burst effect CSS
 * Spawns small dots that explode outward
 */
export const getParticleBurstKeyframes = (): string => {
  return `
    @keyframes particle-burst {
      0% {
        opacity: 1;
        transform: translate(0, 0) scale(1);
      }
      100% {
        opacity: 0;
        transform: translate(var(--tx), var(--ty)) scale(0);
      }
    }

    @keyframes combo-pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.15);
      }
      100% {
        transform: scale(1);
      }
    }

    @keyframes screen-shake {
      0%, 100% {
        transform: translateX(0);
      }
      25% {
        transform: translateX(-2px);
      }
      75% {
        transform: translateX(2px);
      }
    }

    @keyframes confetti-fall {
      0% {
        opacity: 1;
        transform: translateY(0) rotate(0deg);
      }
      100% {
        opacity: 0;
        transform: translateY(300px) rotate(720deg);
      }
    }

    @keyframes progress-fill {
      0% {
        width: 0;
      }
      100% {
        width: var(--completion-percent);
      }
    }

    @keyframes glow-pulse {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(74, 255, 0, 0.7);
      }
      50% {
        box-shadow: 0 0 0 10px rgba(74, 255, 0, 0);
      }
    }
  `
}

/**
 * Generate particle for burst effect
 */
export const generateParticles = (x: number, y: number, count: number = 8) => {
  const particles = []
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const distance = 40
    const tx = Math.cos(angle) * distance
    const ty = Math.sin(angle) * distance
    particles.push({
      id: generateId(),
      tx,
      ty,
      delay: i * 20,
    })
  }
  return particles
}

/**
 * Format large numbers for display (1234 → "1.2K")
 */
export const formatScore = (score: number): string => {
  if (score >= 1000000) {
    return (score / 1000000).toFixed(1) + 'M'
  }
  if (score >= 1000) {
    return (score / 1000).toFixed(1) + 'K'
  }
  return score.toString()
}

/**
 * Get color for score display based on combo level
 */
export const getScoreColor = (multiplier: number): string => {
  if (multiplier >= 8) return '#FF1744' // Red for massive combos
  if (multiplier >= 5) return '#FFD700' // Gold
  if (multiplier >= 2) return '#FF6F00' // Orange
  return '#4AFF00' // Green default
}

/**
 * Get emoji for tier
 */
export const getTierEmoji = (tier: string): string => {
  switch (tier) {
    case 'must_have':
      return '⭐'
    case 'pro_level':
      return '💎'
    case 'optimization':
      return '✨'
    default:
      return '📦'
  }
}

export default {
  initializeGameState,
  resetGameState,
  processAction,
  getNicheEquipmentBonus,
  calculateSetupCompletion,
  checkCategoryCompletion: (
    equipment: UserEquipment[],
    nicheId: string,
    catalogEquipment: EquipmentCatalog[]
  ) => checkCategoryCompletion(equipment, nicheId, catalogEquipment),
  getNicheRequirements,
  getAllNiches,
  getEquipmentDetails,
  getEquipmentTierInNiche,
  getEquipmentByTier,
  getSessionStats,
  getFloatingTextStyle,
  getParticleBurstKeyframes,
  generateParticles,
  formatScore,
  getScoreColor,
  getTierEmoji,
  nicheEquipmentMapInstance,
}
