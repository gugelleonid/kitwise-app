'use client'

interface LevelBarProps {
  level: 'beginner' | 'advanced' | 'pro'
}

const levelConfig = {
  beginner: { label: 'Начинающий', color: 'from-blue-500 to-blue-600' },
  advanced: { label: 'Продвинутый', color: 'from-purple-500 to-purple-600' },
  pro: { label: 'Профессиональный', color: 'from-pink-500 to-pink-600' },
}

export default function LevelBar({ level }: LevelBarProps) {
  const config = levelConfig[level]

  const getProgress = () => {
    switch (level) {
      case 'beginner':
        return 33
      case 'advanced':
        return 66
      case 'pro':
        return 100
      default:
        return 0
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">Уровень</span>
        <span className={`font-semibold bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
          {config.label}
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full bg-gradient-to-r ${config.color} transition-all duration-500`}
          style={{ width: `${getProgress()}%` }}
        />
      </div>
    </div>
  )
}
