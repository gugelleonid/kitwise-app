'use client'

import { Recommendation } from '@/lib/types'
import { Plus } from 'lucide-react'

interface RecommendationCardProps {
  recommendation: Recommendation
  onAdd?: (recommendation: Recommendation) => void
}

const priorityConfig = {
  high: { emoji: '🔴', label: 'Must-Have', color: 'badge-high' },
  medium: { emoji: '🟠', label: 'Pro Level', color: 'badge-medium' },
  low: { emoji: '🟡', label: 'Оптимизация', color: 'badge-low' },
}

export default function RecommendationCard({
  recommendation,
  onAdd,
}: RecommendationCardProps) {
  const config = priorityConfig[recommendation.priority]
  const scorePercent = Math.round(recommendation.score)

  return (
    <div className="card space-y-4 p-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-100">{recommendation.name}</h3>
          <p className="text-xs text-slate-400">{recommendation.category}</p>
        </div>
        {onAdd && (
          <button
            onClick={() => onAdd(recommendation)}
            className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Priority Badge */}
      <div className={`badge ${config.color}`}>
        <span>{config.emoji}</span>
        <span>{config.label}</span>
      </div>

      {/* Reason */}
      <p className="text-sm text-slate-300">{recommendation.reason}</p>

      {/* Score Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Релевантность</span>
          <span className="font-semibold text-slate-300">{scorePercent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-gradient-accent transition-all"
            style={{ width: `${scorePercent}%` }}
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="rounded-lg bg-slate-800/50 p-3">
        <p className="text-xs text-slate-400">Ценовой диапазон</p>
        <p className="font-semibold text-slate-100">{recommendation.price_range}</p>
      </div>
    </div>
  )
}
