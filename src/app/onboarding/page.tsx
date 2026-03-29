'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NicheCard from '@/components/NicheCard'
import EquipmentCard from '@/components/EquipmentCard'
import ProgressRing from '@/components/ProgressRing'
import { Niche, EquipmentCatalog, UserEquipment } from '@/lib/types'
import { mockNiches, mockEquipmentCatalog, categoryIcons } from '@/lib/mockData'
import { supabase } from '@/lib/supabase'
import { ChevronRight, ChevronLeft, Search, LayoutGrid } from 'lucide-react'
import Link from 'next/link'

type OnboardingStep = 'niche' | 'equipment' | 'results'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<OnboardingStep>('niche')
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null)
  const [selectedEquipment, setSelectedEquipment] = useState<UserEquipment[]>([])
  const [allNiches, setAllNiches] = useState<Niche[]>(mockNiches)
  const [allEquipment, setAllEquipment] = useState<EquipmentCatalog[]>(
    mockEquipmentCatalog
  )
  const [loading, setLoading] = useState(false)
  const [setupScore, setSetupScore] = useState(0)

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [brandFilter, setBrandFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Load niches from Supabase or use mock data
  useEffect(() => {
    const loadNiches = async () => {
      try {
        const { data, error } = await supabase
          .from('niches')
          .select('*')
          .order('sort_order', { ascending: true })

        if (error) throw error
        if (data && data.length > 0) {
          setAllNiches(data)
        }
      } catch (err) {
        console.log('Using mock data for niches')
      }
    }

    loadNiches()
  }, [])

  // Load equipment catalog from Supabase or use mock data
  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const { data, error } = await supabase
          .from('equipment_catalog')
          .select('*')
          .limit(200)

        if (error) throw error
        if (data && data.length > 0) {
          setAllEquipment(data)
        }
      } catch (err) {
        console.log('Using mock data for equipment')
      }
    }

    loadEquipment()
  }, [])

  // Get unique categories and brands
  const categories = [...new Set(allEquipment.map(e => e.category))].sort()
  const brands = [...new Set(
    allEquipment
      .filter(e => categoryFilter === 'all' || e.category === categoryFilter)
      .map(e => e.brand)
  )].sort()

  // Filtered equipment
  const filteredEquipment = allEquipment.filter(e => {
    if (categoryFilter !== 'all' && e.category !== categoryFilter) return false
    if (brandFilter !== 'all' && e.brand !== brandFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        e.name.toLowerCase().includes(q) ||
        e.brand.toLowerCase().includes(q) ||
        e.subcategory.toLowerCase().includes(q)
      )
    }
    return true
  })

  const handleNicheSelect = (niche: Niche) => {
    setSelectedNiche(niche)
  }

  const handleEquipmentStatusChange = (
    equipmentId: string,
    status: 'owned' | 'planned' | 'dream'
  ) => {
    setSelectedEquipment((prev) => {
      const existing = prev.find((e) => e.equipment_id === equipmentId)
      if (existing) {
        return prev.map((e) =>
          e.equipment_id === equipmentId ? { ...e, status } : e
        )
      }
      const equipment = allEquipment.find(e => e.id === equipmentId)
      return [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          user_id: 'demo-user',
          equipment_id: equipmentId,
          custom_name: null,
          category: equipment?.category || '',
          status,
          acquired_at: null,
          notes: null,
        },
      ]
    })
  }

  const handleRemoveEquipment = (equipmentId: string) => {
    setSelectedEquipment((prev) =>
      prev.filter((e) => e.equipment_id !== equipmentId)
    )
  }

  const calculateSetupScore = () => {
    const ownedCount = selectedEquipment.filter(
      (e) => e.status === 'owned'
    ).length
    const plannedCount = selectedEquipment.filter(
      (e) => e.status === 'planned'
    ).length
    const totalCount = selectedEquipment.length

    if (totalCount === 0) return 0

    const score = Math.round(
      ((ownedCount * 100 + plannedCount * 50) / (totalCount * 100)) * 100
    )
    return Math.min(100, Math.max(0, score))
  }

  const handleContinue = async () => {
    if (step === 'niche' && selectedNiche) {
      setStep('equipment')
    } else if (step === 'equipment') {
      setLoading(true)
      const score = calculateSetupScore()
      setSetupScore(score)

      // Save to localStorage for demo mode
      const onboardingData = {
        niche: selectedNiche,
        equipment: selectedEquipment,
        score,
        timestamp: Date.now(),
      }
      localStorage.setItem('kitwise-onboarding', JSON.stringify(onboardingData))

      // Try to save to Supabase
      try {
        await supabase.from('profiles').insert({
          id: 'demo-user',
          email: 'demo@kitwise.app',
          full_name: 'Демо Пользователь',
          niche_id: selectedNiche?.id,
          level: 'beginner',
          setup_score: score,
          is_business: false,
          onboarding_completed: true,
        })
      } catch (err) {
        console.log('Demo mode - saving locally only')
      }

      setLoading(false)
      setStep('results')
    } else if (step === 'results') {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-100">
              {step === 'niche' && 'Выберите вашу нишу'}
              {step === 'equipment' && 'Добавьте свое оборудование'}
              {step === 'results' && 'Ваш результат'}
            </h1>
            <span className="text-sm text-slate-400">
              {step === 'niche' && '1 из 3'}
              {step === 'equipment' && '2 из 3'}
              {step === 'results' && '3 из 3'}
            </span>
          </div>

          <div className="h-1 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-gradient-accent transition-all duration-300"
              style={{
                width:
                  step === 'niche'
                    ? '33%'
                    : step === 'equipment'
                      ? '66%'
                      : '100%',
              }}
            />
          </div>
        </div>

        {/* Step 1: Niche Selection */}
        {step === 'niche' && (
          <div className="space-y-8">
            <p className="text-lg text-slate-400">
              Выберите вашу основную специализацию. Это поможет нам дать вам
              точные рекомендации.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allNiches.map((niche) => (
                <NicheCard
                  key={niche.id}
                  niche={niche}
                  selected={selectedNiche?.id === niche.id}
                  onClick={handleNicheSelect}
                />
              ))}
            </div>

            <div className="flex justify-between pt-8">
              <button className="btn-secondary">Назад</button>
              <button
                onClick={handleContinue}
                disabled={!selectedNiche}
                className={`flex items-center gap-2 ${
                  !selectedNiche
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                } btn-primary`}
              >
                Далее
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Equipment Selection */}
        {step === 'equipment' && (
          <div className="space-y-6">
            <div>
              <p className="text-lg text-slate-400 mb-4">
                Найдите и отметьте оборудование, которое у вас есть или планируете купить.
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Поиск по названию, бренду..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-slate-800/50 border border-slate-700 pl-10 pr-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setCategoryFilter('all'); setBrandFilter('all') }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  categoryFilter === 'all'
                    ? 'bg-gradient-accent text-white'
                    : 'border border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                Все ({allEquipment.length})
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setCategoryFilter(cat); setBrandFilter('all') }}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-1 ${
                    categoryFilter === cat
                      ? 'bg-purple-500 text-white'
                      : 'border border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span>{categoryIcons[cat] || '📦'}</span>
                  {cat === 'Camera' ? 'Камеры' :
                   cat === 'Lens' ? 'Объективы' :
                   cat === 'Flash' ? 'Вспышки' :
                   cat === 'Lighting' ? 'Свет' :
                   cat === 'Audio' ? 'Аудио' :
                   cat === 'Support' ? 'Штативы' :
                   cat === 'Storage' ? 'Хранение' :
                   cat === 'Drone' ? 'Дроны' :
                   cat === 'Computer' ? 'Apple' :
                   cat === 'Bag' ? 'Сумки' :
                   cat === 'Accessory' ? 'Аксессуары' : cat}
                </button>
              ))}
            </div>

            {/* Brand Filters (show only when category selected) */}
            {categoryFilter !== 'all' && brands.length > 1 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setBrandFilter('all')}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    brandFilter === 'all'
                      ? 'bg-cyan-500 text-white'
                      : 'border border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  Все бренды
                </button>
                {brands.map(brand => (
                  <button
                    key={brand}
                    onClick={() => setBrandFilter(brand)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      brandFilter === brand
                        ? 'bg-cyan-500 text-white'
                        : 'border border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            )}

            {/* Results count */}
            <div className="card p-3 bg-blue-500/10 border-blue-500/30 flex items-center justify-between">
              <p className="text-sm text-blue-300">
                Показано: {filteredEquipment.length} из {allEquipment.length}
              </p>
              <p className="text-sm text-emerald-400 font-semibold">
                Выбрано: {selectedEquipment.length}
              </p>
            </div>

            {/* Equipment Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredEquipment.map((equipment) => {
                const userEquip = selectedEquipment.find(
                  (e) => e.equipment_id === equipment.id
                )
                return (
                  <EquipmentCard
                    key={equipment.id}
                    equipment={equipment}
                    userEquipment={userEquip}
                    onStatusChange={handleEquipmentStatusChange}
                    onRemove={handleRemoveEquipment}
                    showRemove={!!userEquip}
                  />
                )
              })}
            </div>

            {filteredEquipment.length === 0 && (
              <div className="card p-8 text-center">
                <p className="text-slate-400">Ничего не найдено. Попробуйте другой фильтр или поиск.</p>
              </div>
            )}

            <div className="flex justify-between pt-8">
              <button
                onClick={() => setStep('niche')}
                className="flex items-center gap-2 btn-secondary"
              >
                <ChevronLeft className="h-5 w-5" />
                Назад
              </button>
              <button
                onClick={handleContinue}
                disabled={selectedEquipment.length === 0}
                className={`flex items-center gap-2 ${
                  selectedEquipment.length === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                } btn-primary`}
              >
                {loading ? 'Обработка...' : 'Видеть результаты'}
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 'results' && (
          <div className="space-y-8">
            <div className="card space-y-8 p-8 text-center">
              <h2 className="text-2xl font-bold text-slate-100">
                Ваша оценка готовности
              </h2>

              <div className="flex justify-center py-8">
                <div className="relative">
                  <ProgressRing percentage={setupScore} size={240} />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-slate-400">
                  Вы готовы работать в нише{' '}
                  <span className="font-semibold text-slate-100">
                    {selectedNiche?.name}
                  </span>{' '}
                  на {setupScore}%
                </p>
                <p className="text-sm text-slate-500">
                  {setupScore < 30 &&
                    'Рекомендуем сначала собрать базовое оборудование'}
                  {setupScore >= 30 &&
                    setupScore < 70 &&
                    'Хороший прогресс! Следующие покупки помогут вам выйти на новый уровень'}
                  {setupScore >= 70 &&
                    'Отличный сетап! Рекомендации помогут вам оптимизировать'}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-slate-800/50 p-4">
                  <p className="text-xs text-slate-400 mb-1">Оборудования</p>
                  <p className="text-2xl font-bold text-slate-100">
                    {selectedEquipment.length}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-800/50 p-4">
                  <p className="text-xs text-slate-400 mb-1">Есть</p>
                  <p className="text-2xl font-bold text-green-400">
                    {
                      selectedEquipment.filter((e) => e.status === 'owned')
                        .length
                    }
                  </p>
                </div>
                <div className="rounded-lg bg-slate-800/50 p-4">
                  <p className="text-xs text-slate-400 mb-1">План</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {
                      selectedEquipment.filter((e) => e.status === 'planned')
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
              <button onClick={handleContinue} className="btn-primary">
                Перейти на дашборд
              </button>
              <Link
                href="/board"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                <LayoutGrid className="w-4 h-4" />
                Смотреть борд
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
