import { Achievement, UserEquipment, UserProgress } from './types'

// =====================================================
// ACHIEVEMENTS
// =====================================================

export const achievements: Achievement[] = [
  // --- Common ---
  {
    id: 'first_gear',
    title: 'Первый шаг',
    description: 'Добавьте первое оборудование',
    icon: '🎯',
    condition: (eq) => eq.length >= 1,
    xp: 10,
    rarity: 'common',
  },
  {
    id: 'collector_5',
    title: 'Начинающий коллекционер',
    description: 'Добавьте 5 единиц оборудования',
    icon: '📦',
    condition: (eq) => eq.length >= 5,
    xp: 25,
    rarity: 'common',
  },
  {
    id: 'own_camera',
    title: 'Камера есть!',
    description: 'Имейте хотя бы одну камеру',
    icon: '📸',
    condition: (eq) => eq.some((e) => e.category === 'Camera' && e.status === 'owned'),
    xp: 15,
    rarity: 'common',
  },
  {
    id: 'own_lens',
    title: 'Стекло в руках',
    description: 'Имейте хотя бы один объектив',
    icon: '🔭',
    condition: (eq) => eq.some((e) => e.category === 'Lens' && e.status === 'owned'),
    xp: 15,
    rarity: 'common',
  },
  {
    id: 'planner',
    title: 'Планирую покупки',
    description: 'Добавьте 3 единицы со статусом "План"',
    icon: '📋',
    condition: (eq) => eq.filter((e) => e.status === 'planned').length >= 3,
    xp: 20,
    rarity: 'common',
  },

  // --- Rare ---
  {
    id: 'collector_10',
    title: 'Серьёзный коллекционер',
    description: 'Добавьте 10 единиц оборудования',
    icon: '🏆',
    condition: (eq) => eq.length >= 10,
    xp: 50,
    rarity: 'rare',
  },
  {
    id: 'full_kit',
    title: 'Базовый комплект',
    description: 'Имейте камеру, объектив и вспышку',
    icon: '🎒',
    condition: (eq) => {
      const owned = eq.filter((e) => e.status === 'owned')
      return (
        owned.some((e) => e.category === 'Camera') &&
        owned.some((e) => e.category === 'Lens') &&
        owned.some((e) => e.category === 'Flash')
      )
    },
    xp: 60,
    rarity: 'rare',
  },
  {
    id: 'videographer',
    title: 'Видеограф',
    description: 'Имейте камеру, аудио и стабилизатор',
    icon: '🎬',
    condition: (eq) => {
      const owned = eq.filter((e) => e.status === 'owned')
      return (
        owned.some((e) => e.category === 'Camera') &&
        owned.some((e) => e.category === 'Audio') &&
        owned.some((e) => e.category === 'Support')
      )
    },
    xp: 60,
    rarity: 'rare',
  },
  {
    id: 'apple_fan',
    title: 'Яблочный фанат',
    description: 'Имейте 2+ единицы техники Apple',
    icon: '🍎',
    condition: (eq) => eq.filter((e) => e.category === 'Computer' && e.status === 'owned').length >= 2,
    xp: 40,
    rarity: 'rare',
  },
  {
    id: 'light_master',
    title: 'Повелитель света',
    description: 'Имейте вспышку и 2 единицы света',
    icon: '💡',
    condition: (eq) => {
      const owned = eq.filter((e) => e.status === 'owned')
      return (
        owned.some((e) => e.category === 'Flash') &&
        owned.filter((e) => e.category === 'Lighting').length >= 2
      )
    },
    xp: 50,
    rarity: 'rare',
  },
  {
    id: 'multi_niche',
    title: 'Мультиспециалист',
    description: 'Выберите 3+ направления',
    icon: '🌟',
    condition: (_eq, niches) => niches.length >= 3,
    xp: 40,
    rarity: 'rare',
  },

  // --- Epic ---
  {
    id: 'collector_20',
    title: 'Гир-маньяк',
    description: 'Добавьте 20 единиц оборудования',
    icon: '🤯',
    condition: (eq) => eq.length >= 20,
    xp: 100,
    rarity: 'epic',
  },
  {
    id: 'all_categories',
    title: 'Полный набор',
    description: 'Имейте оборудование в 6+ категориях',
    icon: '🏅',
    condition: (eq) => {
      const cats = new Set(eq.filter((e) => e.status === 'owned').map((e) => e.category))
      return cats.size >= 6
    },
    xp: 120,
    rarity: 'epic',
  },
  {
    id: 'drone_pilot',
    title: 'Пилот дрона',
    description: 'Имейте дрон',
    icon: '🚁',
    condition: (eq) => eq.some((e) => e.category === 'Drone' && e.status === 'owned'),
    xp: 80,
    rarity: 'epic',
  },
  {
    id: 'double_body',
    title: 'Два тела',
    description: 'Имейте 2+ камеры',
    icon: '📷📷',
    condition: (eq) => eq.filter((e) => e.category === 'Camera' && e.status === 'owned').length >= 2,
    xp: 80,
    rarity: 'epic',
  },
  {
    id: 'lens_collection',
    title: 'Стекломан',
    description: 'Имейте 5+ объективов',
    icon: '🔍',
    condition: (eq) => eq.filter((e) => e.category === 'Lens' && e.status === 'owned').length >= 5,
    xp: 100,
    rarity: 'epic',
  },

  // --- Legendary ---
  {
    id: 'collector_30',
    title: 'Легенда оборудования',
    description: 'Добавьте 30+ единиц оборудования',
    icon: '👑',
    condition: (eq) => eq.length >= 30,
    xp: 200,
    rarity: 'legendary',
  },
  {
    id: 'premium_kit',
    title: 'Премиум кит',
    description: 'Имейте камеру Leica или Hasselblad',
    icon: '💎',
    condition: (eq) =>
      eq.some(
        (e) =>
          e.status === 'owned' &&
          e.category === 'Camera'
          // This checks by equipment, we check brand in the catalog
      ),
    xp: 150,
    rarity: 'legendary',
  },
  {
    id: 'studio_ready',
    title: 'Студия готова',
    description: 'Имейте камеру, 3 объектива, свет, аудио и компьютер',
    icon: '🎭',
    condition: (eq) => {
      const owned = eq.filter((e) => e.status === 'owned')
      return (
        owned.some((e) => e.category === 'Camera') &&
        owned.filter((e) => e.category === 'Lens').length >= 3 &&
        owned.some((e) => e.category === 'Lighting') &&
        owned.some((e) => e.category === 'Audio') &&
        owned.some((e) => e.category === 'Computer')
      )
    },
    xp: 250,
    rarity: 'legendary',
  },
]

// =====================================================
// LEVEL SYSTEM
// =====================================================

const levelTitles: Record<number, string> = {
  1: 'Новичок',
  2: 'Любитель',
  3: 'Энтузиаст',
  4: 'Продвинутый',
  5: 'Профессионал',
  6: 'Эксперт',
  7: 'Мастер',
  8: 'Гуру',
  9: 'Легенда',
  10: 'Бог оборудования',
}

function xpForLevel(level: number): number {
  return Math.round(50 * Math.pow(1.5, level - 1))
}

export function calculateProgress(
  equipment: UserEquipment[],
  niches: string[],
  existingAchievements: string[] = []
): UserProgress {
  // Check all achievements
  const unlocked: string[] = [...existingAchievements]
  let totalXp = 0

  for (const ach of achievements) {
    if (ach.condition(equipment, niches)) {
      if (!unlocked.includes(ach.id)) {
        unlocked.push(ach.id)
      }
    }
  }

  // Calculate total XP
  for (const achId of unlocked) {
    const ach = achievements.find((a) => a.id === achId)
    if (ach) totalXp += ach.xp
  }

  // Base XP from equipment
  const ownedCount = equipment.filter((e) => e.status === 'owned').length
  const plannedCount = equipment.filter((e) => e.status === 'planned').length
  totalXp += ownedCount * 5 + plannedCount * 2

  // Calculate level
  let level = 1
  let xpSpent = 0
  while (level < 10) {
    const needed = xpForLevel(level)
    if (totalXp - xpSpent >= needed) {
      xpSpent += needed
      level++
    } else {
      break
    }
  }

  const xpInCurrentLevel = totalXp - xpSpent
  const xpToNext = level < 10 ? xpForLevel(level) : 0

  return {
    level,
    xp: xpInCurrentLevel,
    xpToNext,
    title: levelTitles[level] || 'Бог оборудования',
    achievements: unlocked,
    streak: 0,
  }
}

export const rarityColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  common: { bg: 'bg-slate-500/15', border: 'border-slate-500/40', text: 'text-slate-300', glow: '' },
  rare: { bg: 'bg-blue-500/15', border: 'border-blue-500/40', text: 'text-blue-300', glow: '' },
  epic: { bg: 'bg-purple-500/15', border: 'border-purple-500/40', text: 'text-purple-300', glow: 'shadow-purple-500/20 shadow-lg' },
  legendary: { bg: 'bg-amber-500/15', border: 'border-amber-500/40', text: 'text-amber-300', glow: 'shadow-amber-500/30 shadow-lg' },
}
