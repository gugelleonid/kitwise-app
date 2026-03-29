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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4" />
          <p className="text-gray-600">Загрузка рекомендаций...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Рекомендации</h1>
          <p className="text-lg text-gray-600">
            AI-подобранное оборудование для развития вашего сетапа
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card p-6 border border-rose-200 bg-rose-50">
            <p className="text-sm text-rose-700 mb-2">Обязательно</p>
            <p className="text-3xl font-bold text-rose-600">{priorityStats.high}</p>
            <p className="text-xs text-rose-600/70 mt-1">Must-Have приобретения</p>
          </div>

          <div className="card p-6 border border-amber-200 bg-amber-50">
            <p className="text-sm text-amber-700 mb-2">Профессиональный уровень</p>
            <p className="text-3xl font-bold text-amber-600">
              {priorityStats.medium}
            </p>
            <p className="text-xs text-amber-600/70 mt-1">Pro Level покупки</p>
          </div>

          <div className="card p-6 border border-yellow-200 bg-yellow-50">
            <p className="text-sm text-yellow-700 mb-2">Оптимизация</p>
            <p className="text-3xl font-bold text-yellow-600">
              {priorityStats.low}
            </p>
            <p className="text-xs text-yellow-600/70 mt-1">Улучшающие покупки</p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              filter === 'all'
                ? 'bg-gradient-accent text-white'
                : 'border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'
            }`}
          >
            Все ({recommendations.length})
          </button>

          <button
            onClick={() => setFilter('high')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              filter === 'high'
                ? 'bg-rose-500 text-white'
                : 'border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'
            }`}
          >
            🔴 Обязательно ({priorityStats.high})
          </button>

          <button
            onClick={() => setFilter('medium')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              filter === 'medium'
                ? 'bg-amber-500 text-white'
                : 'border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'
            }`}
          >
            🟠 Pro Level ({priorityStats.medium})
          </button>

          <button
            onClick={() => setFilter('low')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              filter === 'low'
                ? 'bg-yellow-500 text-white'
                : 'border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'
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
          <div className="card p-12 text-center bg-white">
            <Filter className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Нет рекомендаций
            </h3>
            <p className="text-gray-600">
              Выбранный фильтр не дал результатов. Попробуйте выбрать другой.
            </p>
          </div>
        )}

        {/* Info Section */}
        <div className="card space-y-4 border border-indigo-200 bg-indigo-50 p-6">
          <h3 className="font-semibold text-indigo-900">Как это работает?</h3>
          <ul className="space-y-2 text-sm text-indigo-700">
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
