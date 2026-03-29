'use client'

interface XPBarProps {
  level: number
  xp: number
  xpToNext: number
  title: string
  totalAchievements: number
  unlockedAchievements: number
}

export default function XPBar({
  level,
  xp,
  xpToNext,
  title,
  totalAchievements,
  unlockedAchievements,
}: XPBarProps) {
  const progress = xpToNext > 0 ? Math.min((xp / xpToNext) * 100, 100) : 100

  return (
    <div className="card border border-slate-700 bg-slate-900/50 p-4 space-y-4">
      {/* Level Circle and Title */}
      <div className="flex items-center gap-4">
        {/* Level Circle with gradient border */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 p-0.5">
            <div className="rounded-full bg-slate-900 w-full h-full" />
          </div>
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              {level}
            </span>
          </div>
        </div>

        {/* Title Text */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-100">{title}</h3>
          <p className="text-xs text-slate-400">Уровень {level}</p>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-300">Опыт</span>
          <span className="text-xs text-slate-400">
            {xp} / {xpToNext}
          </span>
        </div>

        <div className="relative h-4 overflow-hidden rounded-full bg-slate-800 border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 animate-pulse" />
        </div>
      </div>

      {/* Achievement Counter */}
      <div className="flex items-center justify-center gap-2 bg-slate-800/50 rounded-md py-2 px-3">
        <span className="text-lg">🏆</span>
        <span className="text-sm font-medium text-slate-200">
          {unlockedAchievements}/{totalAchievements} достижений
        </span>
      </div>
    </div>
  )
}
