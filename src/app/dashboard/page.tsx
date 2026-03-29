'use client'

import { useState, useEffect } from 'react'
import { Niche, UserEquipment, EquipmentCatalog } from '@/lib/types'
import { mockNiches, mockEquipmentCatalog, mockRecommendations, mockUserProfile } from '@/lib/mockData'
import EquipmentCard from '@/components/EquipmentCard'
import ProgressRing from '@/components/ProgressRing'
import LevelBar from '@/components/LevelBar'
import RecommendationCard from '@/components/RecommendationCard'
import { supabase } from '@/lib/supabase'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import { TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null)
  const [userEquipment, setUserEquipment] = useState<UserEquipment[]>([])
  const [allEquipment, setAllEquipment] = useState<EquipmentCatalog[]>(
    mockEquipmentCatalog
  )
  const [setupScore, setSetupScore] = useState(45)
  const [radarData, setRadarData] = useState<any[]>([])

  // Load data from localStorage or Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try localStorage first
        const saved = localStorage.getItem('kitwise-onboarding')
        if (saved) {
          const data = JSON.parse(saved)
          setSelectedNiche(data.niche)
          setUserEquipment(data.equipment)
          setSetupScore(data.score)
        } else {
          // Use mock data
          const mockNiche = mockNiches[0]
          setSelectedNiche(mockNiche)
          setSetupScore(mockUserProfile.setup_score)
        }

        // Load equipment catalog
        const { data: equipmentData } = await supabase
          .from('equipment_catalog')
          .select('*')
          .limit(50)

        if (equipmentData && equipmentData.length > 0) {
          setAllEquipment(equipmentData)
        }
      } catch (err) {
        console.log('Loading demo data...')
      }

      setLoading(false)
    }

    loadData()
  }, [])

  // Generate radar chart data
  useEffect(() => {
    const categories = ['Camera', 'Lens', 'Flash', 'Lighting', 'Audio', 'Support', 'Storage', 'Drone', 'Computer']
    const data = categories.map((category) => {
      const userOwned = userEquipment.filter(
        (e) => e.category === category && e.status === 'owned'
      ).length
      const userPlanned = userEquipment.filter(
        (e) => e.category === category && e.status === 'planned'
      ).length

      return {
        category: category,
        'У вас': (userOwned + userPlanned) * 10,
        Необходимо: 50,
      }
    })
    setRadarData(data)
  }, [userEquipment])

  const handleEquipmentStatusChange = (
    equipmentId: string,
    status: 'owned' | 'planned' | 'dream'
  ) => {
    setUserEquipment((prev) => {
      const existing = prev.find((e) => e.equipment_id === equipmentId)
      if (existing) {
        return prev.map((e) =>
          e.equipment_id === equipmentId ? { ...e, status } : e
        )
      }
      return [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          user_id: 'demo-user',
          equipment_id: equipmentId,
          custom_name: null,
          category: '',
          status,
          acquired_at: null,
          notes: null,
        },
      ]
    })

    // Recalculate score
    const ownedCount = userEquipment.filter(
      (e) => e.status === 'owned' || (e.equipment_id === equipmentId && status === 'owned')
    ).length
    const plannedCount = userEquipment.filter(
      (e) => e.status === 'planned' || (e.equipment_id === equipmentId && status === 'planned')
    ).length
    const totalCount = userEquipment.length

    if (totalCount > 0) {
      const score = Math.round(
        ((ownedCount * 100 + plannedCount * 50) / (totalCount * 100)) * 100
      )
      setSetupScore(Math.min(100, Math.max(0, score)))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4" />
          <p className="text-slate-400">Загрузка дашборда...</p>
        </div>
      </div>
    )
  }

  const topRecommendations = mockRecommendations.slice(0, 3)

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-100">Дашборд</h1>
          <p className="text-lg text-slate-400">
            Специализация:{' '}
            <span className="font-semibold text-slate-100">
              {selectedNiche?.name || 'Не выбрана'}
            </span>
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Score Ring */}
          <div className="card flex flex-col items-center justify-center p-8">
            <h2 className="mb-6 text-xl font-semibold text-slate-100">
              Готовность сетапа
            </h2>
            <ProgressRing percentage={setupScore} size={200} />
            <p className="mt-6 text-center text-sm text-slate-400">
              {setupScore < 30 && 'Начинающий уровень'}
              {setupScore >= 30 &&
                setupScore < 70 &&
                'Средний уровень подготовки'}
              {setupScore >= 70 && 'Высокий уровень подготовки'}
            </p>
          </div>

          {/* Level Bar */}
          <div className="card p-8">
            <h2 className="mb-6 text-xl font-semibold text-slate-100">
              Уровень профессионала
            </h2>
            <LevelBar
              level={
                setupScore < 30
                  ? 'beginner'
                  : setupScore < 70
                    ? 'advanced'
                    : 'pro'
              }
            />

            <div className="mt-8 space-y-4 border-t border-slate-700 pt-6">
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Оборудование</span>
                <span className="font-semibold text-slate-100">
                  {userEquipment.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Есть</span>
                <span className="font-semibold text-green-400">
                  {userEquipment.filter((e) => e.status === 'owned').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">План</span>
                <span className="font-semibold text-yellow-400">
                  {userEquipment.filter((e) => e.status === 'planned').length}
                </span>
              </div>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-100">
              Готовность по категориям
            </h2>
            {radarData.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis
                    dataKey="category"
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                  />
                  <PolarRadiusAxis stroke="#94a3b8" />
                  <Radar
                    name="У вас"
                    dataKey="У вас"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Необходимо"
                    dataKey="Необходимо"
                    stroke="#a855f7"
                    fill="#a855f7"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-100">
              Ваше оборудование
            </h2>
            <span className="text-sm text-slate-400">
              {userEquipment.length} единиц
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {userEquipment.length > 0 ? (
              userEquipment.map((ue) => {
                const equipment = allEquipment.find((e) => e.id === ue.equipment_id)
                return equipment ? (
                  <EquipmentCard
                    key={ue.id}
                    equipment={equipment}
                    userEquipment={ue}
                    onStatusChange={handleEquipmentStatusChange}
                    onRemove={() =>
                      setUserEquipment((prev) =>
                        prev.filter((e) => e.id !== ue.id)
                      )
                    }
                    showRemove={true}
                  />
                ) : null
              })
            ) : (
              <div className="col-span-full card p-8 text-center">
                <p className="text-slate-400">
                  Вы еще не добавили оборудование. Перейдите в онбординг, чтобы
                  начать.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-slate-100">
              Топ рекомендации
            </h2>
          </div>

          <p className="text-slate-400">
            Лучшие покупки для следующего уровня вашего сетапа
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topRecommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                onAdd={(recommendation) => {
                  // Add to equipment
                  const equipment = allEquipment.find(
                    (e) => e.id === recommendation.equipment_id
                  )
                  if (equipment) {
                    setUserEquipment((prev) => [
                      ...prev,
                      {
                        id: `temp-${Date.now()}`,
                        user_id: 'demo-user',
                        equipment_id: equipment.id,
                        custom_name: null,
                        category: equipment.category,
                        status: 'planned' as const,
                        acquired_at: null,
                        notes: null,
                      },
                    ])
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
