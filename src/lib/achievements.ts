/**
 * Achievement System
 * Unlockable achievements with rarity tiers
 */

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface Achievement {
  id: string
  title: string           // Russian
  description: string     // Russian
  icon: string            // emoji
  rarity: AchievementRarity
  xpReward: number
  secret: boolean         // hidden until unlocked
  condition: (state: AchievementCheckState) => boolean
}

export interface AchievementCheckState {
  totalItems: number
  totalScore: number
  maxCombo: number
  maxStreak: number
  categoriesUsed: string[]
  brandsUsed: string[]
  totalSpent: number      // estimated budget in dollars
  setupCompletion: number // 0-100
  questsCompleted: number
  sessionsCount: number
  unlockedAchievements: string[]
}

// Common Achievements - Entry level
const COMMON_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_click',
    title: 'Первый клик',
    description: 'Добавьте свой первый предмет оборудования',
    icon: '✨',
    rarity: 'common',
    xpReward: 10,
    secret: false,
    condition: (state) => state.totalItems >= 1
  },
  {
    id: 'beginner',
    title: 'Начинающий',
    description: 'Достигните уровня Любитель',
    icon: '📷',
    rarity: 'common',
    xpReward: 15,
    secret: false,
    condition: (state) => state.totalScore >= 50
  },
  {
    id: 'triple',
    title: 'Тройка',
    description: 'Добавьте 3 предмета оборудования',
    icon: '🔢',
    rarity: 'common',
    xpReward: 20,
    secret: false,
    condition: (state) => state.totalItems >= 3
  },
  {
    id: 'quintuple',
    title: 'Пятёрка',
    description: 'Добавьте 5 предметов оборудования',
    icon: '5️⃣',
    rarity: 'common',
    xpReward: 25,
    secret: false,
    condition: (state) => state.totalItems >= 5
  },
  {
    id: 'explorer',
    title: 'Исследователь',
    description: 'Используйте предметы из 3 разных категорий',
    icon: '🗺️',
    rarity: 'common',
    xpReward: 20,
    secret: false,
    condition: (state) => state.categoriesUsed.length >= 3
  },
  {
    id: 'economist',
    title: 'Экономист',
    description: 'Добавьте 5 предметов дешевле $500 каждый',
    icon: '💰',
    rarity: 'common',
    xpReward: 18,
    secret: false,
    condition: (state) => state.totalSpent >= 0 && state.totalItems >= 5
  }
]

// Rare Achievements - Intermediate level
const RARE_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'combo_master',
    title: 'Комбо-мастер',
    description: 'Достигните комбо-множителя x5',
    icon: '⚡',
    rarity: 'rare',
    xpReward: 50,
    secret: false,
    condition: (state) => state.maxCombo >= 5
  },
  {
    id: 'decade',
    title: 'Десятка',
    description: 'Добавьте 10 предметов оборудования',
    icon: '🔟',
    rarity: 'rare',
    xpReward: 60,
    secret: false,
    condition: (state) => state.totalItems >= 10
  },
  {
    id: 'complete_set',
    title: 'Полный набор',
    description: 'Используйте предметы из всех доступных категорий',
    icon: '🎯',
    rarity: 'rare',
    xpReward: 70,
    secret: false,
    condition: (state) => state.categoriesUsed.length >= 6
  },
  {
    id: 'streaker',
    title: 'Стрикер',
    description: 'Поддерживайте серию посещений на протяжении 10 дней',
    icon: '🔥',
    rarity: 'rare',
    xpReward: 55,
    secret: false,
    condition: (state) => state.maxStreak >= 10
  },
  {
    id: 'budget_pro',
    title: 'Бюджет про',
    description: 'Достигните общей стоимости сетапа $5000+',
    icon: '💵',
    rarity: 'rare',
    xpReward: 65,
    secret: false,
    condition: (state) => state.totalSpent >= 5000
  },
  {
    id: 'multi_niche',
    title: 'Мультиниша',
    description: 'Переключитесь между разными нишами',
    icon: '🎭',
    rarity: 'rare',
    xpReward: 50,
    secret: true,
    condition: (state) => state.categoriesUsed.length >= 4
  }
]

// Epic Achievements - Advanced level
const EPIC_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'dream_setup',
    title: 'Сетап мечты',
    description: 'Достигните 80% завершения своего сетапа',
    icon: '💎',
    rarity: 'epic',
    xpReward: 100,
    secret: false,
    condition: (state) => state.setupCompletion >= 80
  },
  {
    id: 'combo_legend',
    title: 'Легенда комбо',
    description: 'Достигните комбо-множителя x10',
    icon: '👑',
    rarity: 'epic',
    xpReward: 120,
    secret: false,
    condition: (state) => state.maxCombo >= 10
  },
  {
    id: 'twenty',
    title: 'Двадцатка',
    description: 'Добавьте 20 предметов оборудования',
    icon: '2️⃣0️⃣',
    rarity: 'epic',
    xpReward: 130,
    secret: false,
    condition: (state) => state.totalItems >= 20
  },
  {
    id: 'lens_collector',
    title: 'Коллекционер объективов',
    description: 'Добавьте 5 и более объективов',
    icon: '🔭',
    rarity: 'epic',
    xpReward: 110,
    secret: false,
    condition: (state) => state.brandsUsed.length >= 5
  }
]

// Legendary Achievements - Highest tier
const LEGENDARY_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'kitwise_master',
    title: 'Мастер KitWise',
    description: 'Достигните 100% завершения своего сетапа',
    icon: '🏆',
    rarity: 'legendary',
    xpReward: 200,
    secret: false,
    condition: (state) => state.setupCompletion >= 100
  },
  {
    id: 'maestro',
    title: 'Маэстро',
    description: 'Достигните уровня Мастер',
    icon: '🎼',
    rarity: 'legendary',
    xpReward: 180,
    secret: false,
    condition: (state) => state.totalScore >= 1500
  },
  {
    id: 'all_quests',
    title: 'Все квесты',
    description: 'Завершите все основные квесты',
    icon: '✅',
    rarity: 'legendary',
    xpReward: 150,
    secret: false,
    condition: (state) => state.questsCompleted >= 6
  }
]

export const ACHIEVEMENTS = [
  ...COMMON_ACHIEVEMENTS,
  ...RARE_ACHIEVEMENTS,
  ...EPIC_ACHIEVEMENTS,
  ...LEGENDARY_ACHIEVEMENTS
]

// Rarity color mapping for UI
export const RARITY_COLORS: Record<AchievementRarity, string> = {
  common: 'gray',
  rare: 'blue',
  epic: 'purple',
  legendary: 'amber'
}

/**
 * Check if an achievement is unlocked
 * @param achievement Achievement to check
 * @param state Current game state
 * @returns Whether the achievement condition is met
 */
export function checkAchievement(
  achievement: Achievement,
  state: AchievementCheckState
): boolean {
  return achievement.condition(state)
}

/**
 * Get achievements by rarity tier
 * @param rarity Rarity level to filter
 * @returns Array of achievements with matching rarity
 */
export function getAchievementsByRarity(
  rarity: AchievementRarity
): Achievement[] {
  return ACHIEVEMENTS.filter(achievement => achievement.rarity === rarity)
}

/**
 * Get all unlocked achievements
 * @param state Current game state
 * @returns Array of unlocked achievements
 */
export function getUnlockedAchievements(
  state: AchievementCheckState
): Achievement[] {
  return ACHIEVEMENTS.filter(achievement => checkAchievement(achievement, state))
}

/**
 * Get total XP from all unlocked achievements
 * @param state Current game state
 * @returns Total XP reward sum
 */
export function getTotalAchievementXP(
  state: AchievementCheckState
): number {
  return getUnlockedAchievements(state).reduce(
    (sum, achievement) => sum + achievement.xpReward,
    0
  )
}

/**
 * Get achievements sorted by rarity (legendary first)
 * @returns Array of achievements sorted by rarity
 */
export function getAchievementsByRarityDesc(): Achievement[] {
  const rarityOrder: Record<AchievementRarity, number> = {
    legendary: 0,
    epic: 1,
    rare: 2,
    common: 3
  }
  return [...ACHIEVEMENTS].sort(
    (a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]
  )
}

/**
 * Get hidden achievements that haven't been unlocked yet
 * @param state Current game state
 * @returns Array of secret achievements not yet unlocked
 */
export function getSecretAchievements(
  state: AchievementCheckState
): Achievement[] {
  return ACHIEVEMENTS.filter(
    achievement =>
      achievement.secret && !state.unlockedAchievements.includes(achievement.id)
  )
}
