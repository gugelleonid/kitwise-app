/**
 * Quest System
 * Main, daily, and bonus quests for photographer progression
 */

export interface Quest {
  id: string
  title: string           // Russian
  description: string     // Russian
  icon: string            // emoji
  type: 'main' | 'daily' | 'bonus'
  xpReward: number
  condition: (state: QuestCheckState) => boolean
  progress: (state: QuestCheckState) => { current: number; target: number }
}

export interface QuestCheckState {
  equipmentCount: number
  categoriesUsed: string[]
  totalScore: number
  comboMax: number
  nicheId: string
  equipmentByStatus: { owned: number; planned: number; dream: number }
  equipmentByCategory: Record<string, number>
  hasCamera: boolean
  hasLens: boolean
  hasLighting: boolean
  hasAudio: boolean
  completedQuests: string[]
}

// Main Quests - Core progression objectives
const MAIN_QUESTS: Quest[] = [
  {
    id: 'first_step',
    title: 'Первый шаг',
    description: 'Добавьте свой первый предмет оборудования в каталог',
    icon: '🚀',
    type: 'main',
    xpReward: 25,
    condition: (state) => state.equipmentCount >= 1,
    progress: (state) => ({
      current: Math.min(state.equipmentCount, 1),
      target: 1
    })
  },
  {
    id: 'setup_foundation',
    title: 'Основа сетапа',
    description: 'Соберите полный комплект: фотоаппарат + объектив',
    icon: '📸',
    type: 'main',
    xpReward: 50,
    condition: (state) => state.hasCamera && state.hasLens,
    progress: (state) => ({
      current: (state.hasCamera ? 1 : 0) + (state.hasLens ? 1 : 0),
      target: 2
    })
  },
  {
    id: 'dreamer',
    title: 'Мечтатель',
    description: 'Добавьте 3 предмета в статусе "мечта"',
    icon: '✨',
    type: 'main',
    xpReward: 40,
    condition: (state) => state.equipmentByStatus.dream >= 3,
    progress: (state) => ({
      current: Math.min(state.equipmentByStatus.dream, 3),
      target: 3
    })
  },
  {
    id: 'complete_niche',
    title: 'Полный сетап',
    description: 'Заполните все необходимые категории для вашей ниши',
    icon: '🎯',
    type: 'main',
    xpReward: 75,
    condition: (state) => state.totalScore >= 80,
    progress: (state) => ({
      current: Math.floor(state.totalScore),
      target: 80
    })
  },
  {
    id: 'collector',
    title: 'Коллекционер',
    description: 'Добавьте 10 и более предметов оборудования',
    icon: '📚',
    type: 'main',
    xpReward: 100,
    condition: (state) => state.equipmentCount >= 10,
    progress: (state) => ({
      current: Math.min(state.equipmentCount, 10),
      target: 10
    })
  },
  {
    id: 'niche_master',
    title: 'Мастер ниши',
    description: 'Достигните 100% завершения для вашей ниши',
    icon: '👑',
    type: 'main',
    xpReward: 150,
    condition: (state) => state.totalScore >= 100,
    progress: (state) => ({
      current: Math.floor(state.totalScore),
      target: 100
    })
  }
]

// Daily Quests - Repeatable daily challenges
const DAILY_QUESTS: Quest[] = [
  {
    id: 'daily_add_three',
    title: 'Добавь три предмета',
    description: 'Добавьте 3 новых предмета оборудования в каталог',
    icon: '📦',
    type: 'daily',
    xpReward: 30,
    condition: (state) => state.equipmentCount % 3 === 0,
    progress: (state) => ({
      current: state.equipmentCount % 10,
      target: 3
    })
  },
  {
    id: 'daily_combo',
    title: 'Достигни комбо x3',
    description: 'Получите комбо-множитель в 3 и выше в одной сессии',
    icon: '⚡',
    type: 'daily',
    xpReward: 25,
    condition: (state) => state.comboMax >= 3,
    progress: (state) => ({
      current: Math.min(state.comboMax, 3),
      target: 3
    })
  },
  {
    id: 'daily_score',
    title: 'Набери 100 очков',
    description: 'Накопите 100 очков в текущей сессии',
    icon: '💯',
    type: 'daily',
    xpReward: 35,
    condition: (state) => state.totalScore >= 100,
    progress: (state) => ({
      current: Math.min(state.totalScore, 100),
      target: 100
    })
  },
  {
    id: 'daily_categories',
    title: 'Используй 3 категории',
    description: 'Добавьте предметы из 3 разных категорий',
    icon: '🎨',
    type: 'daily',
    xpReward: 20,
    condition: (state) => state.categoriesUsed.length >= 3,
    progress: (state) => ({
      current: Math.min(state.categoriesUsed.length, 3),
      target: 3
    })
  },
  {
    id: 'daily_explore',
    title: 'Исследователь',
    description: 'Посетите 5 разных категорий оборудования',
    icon: '🗺️',
    type: 'daily',
    xpReward: 25,
    condition: (state) => state.categoriesUsed.length >= 5,
    progress: (state) => ({
      current: Math.min(state.categoriesUsed.length, 5),
      target: 5
    })
  }
]

// Bonus Quests - Specialized challenges
const BONUS_QUESTS: Quest[] = [
  {
    id: 'audiophile',
    title: 'Аудиофил',
    description: 'Добавьте 2 и более предметов для аудиозаписи',
    icon: '🎙️',
    type: 'bonus',
    xpReward: 45,
    condition: (state) => state.hasAudio && (state.equipmentByCategory['audio'] || 0) >= 2,
    progress: (state) => ({
      current: Math.min(state.equipmentByCategory['audio'] || 0, 2),
      target: 2
    })
  },
  {
    id: 'master_of_light',
    title: 'Властелин света',
    description: 'Добавьте 3 и более предметов освещения',
    icon: '💡',
    type: 'bonus',
    xpReward: 55,
    condition: (state) => state.hasLighting && (state.equipmentByCategory['lighting'] || 0) >= 3,
    progress: (state) => ({
      current: Math.min(state.equipmentByCategory['lighting'] || 0, 3),
      target: 3
    })
  },
  {
    id: 'drone_pilot',
    title: 'Дрон-пилот',
    description: 'Добавьте дрон в свой сетап',
    icon: '🚁',
    type: 'bonus',
    xpReward: 60,
    condition: (state) => (state.equipmentByCategory['drones'] || 0) >= 1,
    progress: (state) => ({
      current: Math.min(state.equipmentByCategory['drones'] || 0, 1),
      target: 1
    })
  },
  {
    id: 'brand_loyalty',
    title: 'Бренд-лояльность',
    description: 'Добавьте 3 и более предметов одного бренда',
    icon: '🏆',
    type: 'bonus',
    xpReward: 50,
    condition: (state) => {
      // Check if any category has 3+ items (simplified brand check)
      return Object.values(state.equipmentByCategory).some(count => count >= 3)
    },
    progress: (state) => {
      const maxByCategory = Math.max(
        ...Object.values(state.equipmentByCategory),
        0
      )
      return {
        current: Math.min(maxByCategory, 3),
        target: 3
      }
    }
  },
  {
    id: 'video_enthusiast',
    title: 'Видеограф',
    description: 'Соберите полный комплект для видеоснимки',
    icon: '🎬',
    type: 'bonus',
    xpReward: 70,
    condition: (state) =>
      state.hasCamera &&
      state.hasLens &&
      state.hasAudio &&
      state.hasLighting,
    progress: (state) => {
      const count =
        (state.hasCamera ? 1 : 0) +
        (state.hasLens ? 1 : 0) +
        (state.hasAudio ? 1 : 0) +
        (state.hasLighting ? 1 : 0)
      return {
        current: count,
        target: 4
      }
    }
  }
]

export const QUESTS = [...MAIN_QUESTS, ...DAILY_QUESTS, ...BONUS_QUESTS]

/**
 * Check if a quest is completed
 * @param quest Quest to check
 * @param state Current game state
 * @returns Whether the quest condition is met
 */
export function checkQuestCompletion(
  quest: Quest,
  state: QuestCheckState
): boolean {
  return quest.condition(state)
}

/**
 * Get progress towards quest completion
 * @param quest Quest to check
 * @param state Current game state
 * @returns Progress object with current and target values
 */
export function getQuestProgress(
  quest: Quest,
  state: QuestCheckState
): { current: number; target: number } {
  return quest.progress(state)
}

/**
 * Get quest progress percentage
 * @param quest Quest to check
 * @param state Current game state
 * @returns Percentage (0-100)
 */
export function getQuestProgressPercent(
  quest: Quest,
  state: QuestCheckState
): number {
  const { current, target } = getQuestProgress(quest, state)
  if (target === 0) return 0
  return Math.round((current / target) * 100)
}

/**
 * Get quests by type
 * @param type Quest type filter
 * @returns Array of quests matching the type
 */
export function getQuestsByType(
  type: 'main' | 'daily' | 'bonus'
): Quest[] {
  return QUESTS.filter(quest => quest.type === type)
}
