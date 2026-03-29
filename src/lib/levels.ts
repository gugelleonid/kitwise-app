/**
 * Level Progression System
 * Apple-minimalist level system for photographer progression
 */

export interface Level {
  id: number
  title: string       // Russian name
  titleEn: string     // English fallback
  minXP: number
  maxXP: number
  icon: string        // emoji
  color: string       // tailwind color class
  perks: string[]     // unlocked features at this level (Russian)
}

export const LEVELS: Level[] = [
  {
    id: 1,
    title: 'Новичок',
    titleEn: 'Beginner',
    minXP: 0,
    maxXP: 100,
    icon: '📷',
    color: 'gray',
    perks: ['Базовый каталог оборудования']
  },
  {
    id: 2,
    title: 'Любитель',
    titleEn: 'Amateur',
    minXP: 100,
    maxXP: 300,
    icon: '📸',
    color: 'green',
    perks: ['Фильтры по брендам', 'Первая ачивка']
  },
  {
    id: 3,
    title: 'Энтузиаст',
    titleEn: 'Enthusiast',
    minXP: 300,
    maxXP: 700,
    icon: '🎯',
    color: 'blue',
    perks: ['Продвинутый каталог', 'Системы квестов']
  },
  {
    id: 4,
    title: 'Профессионал',
    titleEn: 'Professional',
    minXP: 700,
    maxXP: 1500,
    icon: '⭐',
    color: 'purple',
    perks: ['Персональные рекомендации', 'Секретные ачивки']
  },
  {
    id: 5,
    title: 'Мастер',
    titleEn: 'Master',
    minXP: 1500,
    maxXP: Infinity,
    icon: '👑',
    color: 'amber',
    perks: ['Полный доступ', 'Легендарный статус']
  }
]

/**
 * Get level object for a given XP amount
 * @param xp Current experience points
 * @returns Level object corresponding to XP
 */
export function getLevelForXP(xp: number): Level {
  return LEVELS.find(level => xp >= level.minXP && xp < level.maxXP) || LEVELS[LEVELS.length - 1]
}

/**
 * Get progress towards the next level
 * @param xp Current experience points
 * @returns Object with current progress, needed XP, and percentage
 */
export function getXPProgress(xp: number): {
  current: number
  needed: number
  percent: number
} {
  const currentLevel = getLevelForXP(xp)
  const xpInLevel = xp - currentLevel.minXP
  const xpNeededForLevel = currentLevel.maxXP - currentLevel.minXP
  const percent = Math.round((xpInLevel / xpNeededForLevel) * 100)

  return {
    current: xpInLevel,
    needed: xpNeededForLevel,
    percent: isFinite(percent) ? Math.min(percent, 100) : 100
  }
}

/**
 * Calculate XP needed to reach next level
 * @param xp Current experience points
 * @returns XP points needed to advance
 */
export function xpToNextLevel(xp: number): number {
  const currentLevel = getLevelForXP(xp)
  if (!isFinite(currentLevel.maxXP)) {
    return 0
  }
  const xpInLevel = xp - currentLevel.minXP
  return currentLevel.maxXP - currentLevel.minXP - xpInLevel
}

/**
 * Get next level after current
 * @param xp Current experience points
 * @returns Next level object, or current level if already at max
 */
export function getNextLevel(xp: number): Level {
  const currentLevel = getLevelForXP(xp)
  const nextLevelId = currentLevel.id + 1
  return LEVELS.find(level => level.id === nextLevelId) || currentLevel
}
