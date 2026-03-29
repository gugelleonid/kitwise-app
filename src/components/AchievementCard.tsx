'use client'

import { rarityColors } from '@/lib/gamification'

interface AchievementCardProps {
  achievement: {
    id: string
    title: string
    description: string
    icon: string
    xp: number
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
  }
  unlocked: boolean
}

export default function AchievementCard({ achievement, unlocked }: AchievementCardProps) {
  const rarityConfig = rarityColors[achievement.rarity]

  if (!unlocked) {
    return (
      <div className="card relative overflow-hidden border border-slate-700/30 bg-slate-900/50 transition-all">
        <div className="relative p-4">
          <div className="mb-3 flex flex-col items-center">
            <div className="text-4xl mb-2 opacity-30">🔒</div>
            <h3 className="text-center font-semibold text-slate-500 text-sm">{achievement.title}</h3>
          </div>

          <p className="text-center text-xs text-slate-600 mb-3 line-clamp-2">{achievement.description}</p>

          <div className="flex items-center justify-center gap-1">
            <span className="text-xs font-bold text-slate-600">+{achievement.xp}</span>
            <span className="text-xs text-slate-600">XP</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`card relative overflow-hidden border transition-all hover:scale-105 ${
        rarityConfig.border
      } ${rarityConfig.bg} ${rarityConfig.glow}`}
    >
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
        {achievement.rarity === 'epic' && (
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 to-transparent pointer-events-none" />
        )}
        {achievement.rarity === 'legendary' && (
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/10 to-transparent pointer-events-none" />
        )}
      </div>

      <div className="relative p-4">
        <div className="mb-3 flex flex-col items-center">
          <div className="text-4xl mb-2 drop-shadow-lg">{achievement.icon}</div>
          <h3 className={`text-center font-bold text-sm ${rarityConfig.text}`}>{achievement.title}</h3>
        </div>

        <p className={`text-center text-xs mb-3 line-clamp-2 ${rarityConfig.text} opacity-80`}>
          {achievement.description}
        </p>

        <div className="flex items-center justify-center gap-1.5 bg-slate-800/50 rounded-md py-2 px-3">
          <span className="text-xs font-bold text-amber-300">+{achievement.xp}</span>
          <span className="text-xs text-amber-300">XP</span>
        </div>
      </div>
    </div>
  )
}
