'use client'

import { useState, useEffect } from 'react'
import { Recommendation } from '@/lib/types'
import RecommendationCard from '@/components/RecommendationCard'
import { mockRecommendations } from '@/lib/mockData'
import { Filter } from 'lucide-react'

type PriorityFilter = 'all' | 'high' | 'medium' | 'low'

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    mockRecommendations
  )
  const [filter, setFilter] = useState<PriorityFilter>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load recommendations from Supabase or use mock data
    const loadRecommendations = async () => {
      try {
        setRecommendations(mockRecommendations)
      } catch (err) {
        console.log('Using mock recommendations')
      }
      setLoading(false)
    }

    loadRecommendations()
  }, [])

  const filteredRecommendations =
    filter === 'all'
      ? recommendations
      : recommendations.filter((rec) => rec.priority === filter)

  const priorityStats = {
    high: recommendations.filter((r) => r.priority === 'high').length,
    medium: recommendations.filter((r) => r.priority === 'medium').length,
    low: recommendations.filter((r) => r.priority === 'low').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4" />
          <p className="text-slate-400">Загрузка рекомендаций...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-slate-100">Рекомендации</h1>
          <p className="text-lg text-slate-400">
            AI-подобранное оборудование для развития вашего сетапа
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card p-6 border-red-500/30 bg-red-500/5">
            <p className="text-sm text-red-400 mb-2">Обязательно</p>
            <p className="text-3xl font-bold text-red-300">{priorityStats.high}</p>
            <p className="text-xs text-red-400/60 mt-1">Must-Have приобретения</p>
          </div>

          <div className="card p-6 border-orange-500/30 bg-orange-500/5">
            <p className="text-sm text-orange-400 mb-2">Профессиональный уровень</p>
            <p className="text-3xl font-bold text-orange-300">
              {priorityStats.medium}
            </p>
            <p className="text-xs text-orange-400/60 mt-1">Pro Level покупки</p>
          </div>

          <div className="card p-6 border-yellow-500/30 bg-yellow-500/5">
            <p className="text-sm text-yellow-400 mb-2">Оптимизация</p>
            <p className="text-3xl font-bold text-yellow-300">
              {priorityStats.low}
            </p>
            <p className="text-xs text-yellow-400/60 mt-1">Улучшающие покупки</p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              filter === 'all'
                ? 'bg-gradient-accent text-white'
                : 'border border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
            }`}
          >
            Все ({recommendations.length})
          </button>

          <button
            onClick={() => setFilter('high')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              filter === 'high'
                ? 'bg-red-500 text-white'
                : 'border border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
            }`}
          >
            🔴 Обязательно ({priorityStats.high})
          </button>

          <button
            onClick={() => setFilter('medium')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              filter === 'medium'
                ? 'bg-orange-500 text-white'
                : 'border border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
            }`}
          >
            🟠 Pro Level ({priorityStats.medium})
          </button>

          <button
            onClick={() => setFilter('low')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              filter === 'low'
                ? 'bg-yellow-500 text-white'
                : 'border border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
            }`}
          >
            🟡 Оптимизация ({priorityStats.low})
          </button>
        </div>

        {/* Recommendations Grid */}
        {filteredRecommendations.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRecommendations.map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <Filter className="mx-auto mb-4 h-12 w-12 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-100 mb-2">
              Нет рекомендаций
            </h3>
            <p className="text-slate-400">
              Выбранный фильтр не дал результатов. Попробуйте выбрать другой.
            </p>
          </div>
        )}

        {/* Info Section */}
        <div className="card space-y-4 border-blue-500/30 bg-blue-500/5 p-6">
          <h3 className="font-semibold text-blue-300">Как это работает?</h3>
          <ul className="space-y-2 text-sm text-blue-200/80">
            <li>
              ✓ <strong>Обязательно (🔴)</strong> — критичное оборудование,
              которое нужно для профессиональной работы в вашей нише
            </li>
            <li>
              ✓ <strong>Pro Level (🟠)</strong> — оборудование, которое
              повысит качество ваших работ и позволит браться за сложные проекты
            </li>
            <li>
              ✓ <strong>Оптимизация (🟡)</strong> — вспомогательное оборудование,
              которое улучшит workflow и результаты
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
