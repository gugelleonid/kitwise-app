'use client'

import { useState, useEffect } from 'react'
import { Niche, UserEquipment, EquipmentCatalog, UserProgress } from '@/lib/types'
import { mockNiches, mockEquipmentCatalog, categoryIcons } from '@/lib/mockData'
import { calculateProgress, achievements, rarityColors } from '@/lib/gamification'
import EquipmentCard from '@/components/EquipmentCard'
import ProgressRing from '@/components/ProgressRing'
import { Search, Plus, X, Share2, Filter } from 'lucide-react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'

interface CustomEquipmentForm {
  name: string
  brand: string
  category: string
  subcategory: string
  price: number
  status: 'owned' | 'planned' | 'dream'
  quantity: number
}

const statusConfig = {
  owned: { emoji: '🟢', label: 'Есть', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
  planned: { emoji: '🟡', label: 'План', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  dream: { emoji: '⚫', label: 'Мечта', color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/30' },
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'equipment' | 'stats' | 'achievements'>('equipment')
  const [selectedNiches, setSelectedNiches] = useState<Niche[]>([])
  const [userEquipment, setUserEquipment] = useState<UserEquipment[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [radarData, setRadarData] = useState<any[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [setupScore, setSetupScore] = useState(0)

  const [customForm, setCustomForm] = useState<CustomEquipmentForm>({
    name: '',
    brand: '',
    category: '',
    subcategory: '',
    price: 0,
    status: 'owned',
    quantity: 1,
  })

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      const saved = localStorage.getItem('kitwise-onboarding')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          // Backward compatibility: old format had `niche` (single), new has `niches` (array)
          if (data.niches) {
            setSelectedNiches(data.niches)
          } else if (data.niche) {
            setSelectedNiches([data.niche])
          }
          // Ensure quantity field exists on all equipment
          const equipment = (data.equipment || []).map((e: any) => ({
            ...e,
            quantity: e.quantity || 1,
          }))
          setUserEquipment(equipment)
          setSetupScore(data.score || 0)
        } catch (err) {
          console.error('Error loading data:', err)
        }
      }
    }

    loadData()
  }, [])

  // Calculate progress whenever equipment or niches change
  useEffect(() => {
    const nicheSlugs = selectedNiches.map((n) => n.slug)
    const progress = calculateProgress(userEquipment, nicheSlugs)
    setUserProgress(progress)

    // Calculate setup score
    const ownedCount = userEquipment.filter((e) => e.status === 'owned').length
    const plannedCount = userEquipment.filter((e) => e.status === 'planned').length
    const totalCount = userEquipment.length

    if (totalCount > 0) {
      const score = Math.round(((ownedCount * 100 + plannedCount * 50) / (totalCount * 100)) * 100)
      setSetupScore(Math.min(100, Math.max(0, score)))
    } else {
      setSetupScore(0)
    }
  }, [userEquipment, selectedNiches])

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
        category: category.slice(0, 3),
        'Есть': (userOwned + userPlanned) * 10,
        'Нужно': 50,
      }
    })
    setRadarData(data)
  }, [userEquipment])

  // Save data to localStorage
  useEffect(() => {
    const data = {
      niches: selectedNiches,
      equipment: userEquipment,
      score: setupScore,
      timestamp: Date.now(),
    }
    localStorage.setItem('kitwise-onboarding', JSON.stringify(data))
  }, [selectedNiches, userEquipment, setupScore])

  // Toggle niche selection
  const toggleNiche = (niche: Niche) => {
    setSelectedNiches((prev) =>
      prev.some((n) => n.id === niche.id)
        ? prev.filter((n) => n.id !== niche.id)
        : [...prev, niche]
    )
  }

  // Handle equipment status change
  const handleStatusChange = (equipmentId: string, status: 'owned' | 'planned' | 'dream') => {
    setUserEquipment((prev) => {
      const existing = prev.find((e) => e.equipment_id === equipmentId)
      if (existing) {
        return prev.map((e) => (e.equipment_id === equipmentId ? { ...e, status } : e))
      }
      return [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          user_id: 'demo-user',
          equipment_id: equipmentId,
          custom_name: null,
          category: mockEquipmentCatalog.find((eq) => eq.id === equipmentId)?.category || '',
          status,
          quantity: 1,
          acquired_at: null,
          notes: null,
        },
      ]
    })
  }

  // Handle quantity change
  const handleQuantityChange = (equipmentId: string, quantity: number) => {
    setUserEquipment((prev) =>
      prev.map((e) => (e.equipment_id === equipmentId ? { ...e, quantity } : e))
    )
  }

  // Remove equipment
  const handleRemoveEquipment = (id: string) => {
    setUserEquipment((prev) => prev.filter((e) => e.id !== id))
  }

  // Add custom equipment
  const handleAddCustomEquipment = () => {
    if (!customForm.name.trim()) {
      alert('Пожалуйста, введите название оборудования')
      return
    }

    const newEquipment: UserEquipment = {
      id: `custom-${Date.now()}`,
      user_id: 'demo-user',
      equipment_id: `custom-${Date.now()}`,
      custom_name: customForm.name,
      category: customForm.category || 'Custom',
      status: customForm.status,
      quantity: customForm.quantity,
      acquired_at: null,
      notes: null,
    }

    setUserEquipment((prev) => [...prev, newEquipment])

    // Reset form
    setCustomForm({
      name: '',
      brand: '',
      category: '',
      subcategory: '',
      price: 0,
      status: 'owned',
      quantity: 1,
    })
    setShowCustomModal(false)
  }

  // Get unique categories and brands
  const allCategories = Array.from(new Set(mockEquipmentCatalog.map((e) => e.category)))
  const allBrands = Array.from(new Set(mockEquipmentCatalog.map((e) => e.brand)))

  // Filter equipment
  const filteredEquipment = mockEquipmentCatalog.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.brand.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || e.category === selectedCategory
    const matchesBrand = !selectedBrand || e.brand === selectedBrand

    return matchesSearch && matchesCategory && matchesBrand
  })

  // Get user's equipment for display
  const userEquipmentMap = new Map(userEquipment.map((ue) => [ue.equipment_id, ue]))

  // Count equipment by status
  const ownedCount = userEquipment.filter((e) => e.status === 'owned').length
  const plannedCount = userEquipment.filter((e) => e.status === 'planned').length
  const dreamCount = userEquipment.filter((e) => e.status === 'dream').length

  // Calculate total estimated value
  const totalValue = userEquipment.reduce((sum, ue) => {
    const equipment = mockEquipmentCatalog.find((e) => e.id === ue.equipment_id)
    const price = equipment?.price_max || 0
    return sum + price * ue.quantity
  }, 0)

  // Get unlocked achievements
  const unlockedAchievements = userProgress?.achievements || []

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold gradient-text">Мой центр управления</h1>
              <p className="mt-2 text-slate-400">
                Выбрано направлений: <span className="font-semibold text-slate-100">{selectedNiches.length}</span>
              </p>
            </div>
            <a
              href="/board"
              className="flex items-center gap-2 rounded-lg bg-gradient-accent px-6 py-3 font-semibold text-slate-950 transition-all hover:shadow-lg hover:shadow-purple-500/30"
            >
              <Share2 className="h-4 w-4" />
              Поделиться
            </a>
          </div>

          {/* Niche Selection */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-400">Выберите направления:</p>
            <div className="flex flex-wrap gap-2">
              {mockNiches.map((niche) => (
                <button
                  key={niche.id}
                  onClick={() => toggleNiche(niche)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    selectedNiches.some((n) => n.id === niche.id)
                      ? 'bg-gradient-accent text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <span className="text-base">{niche.icon}</span>
                  {niche.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-700">
          <div className="flex gap-6">
            {(['equipment', 'stats', 'achievements'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-purple-500 text-purple-400'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {tab === 'equipment' && 'Оборудование'}
                {tab === 'stats' && 'Статистика'}
                {tab === 'achievements' && 'Достижения'}
              </button>
            ))}
          </div>
        </div>

        {/* EQUIPMENT TAB */}
        {activeTab === 'equipment' && (
          <div className="space-y-6">
            {/* Search & Filters */}
            <div className="space-y-4">
              <div className="flex flex-col gap-4 lg:flex-row">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                  <input
                    type="text"
                    placeholder="Поиск оборудования..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg bg-slate-800 py-2 pl-10 pr-4 text-slate-100 placeholder-slate-600 outline-none transition-colors focus:bg-slate-800/80 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Filters */}
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-slate-100 outline-none transition-colors focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Все категории</option>
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedBrand || ''}
                  onChange={(e) => setSelectedBrand(e.target.value || null)}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-slate-100 outline-none transition-colors focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Все бренды</option>
                  {allBrands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>

                {/* Add Custom Button */}
                <button
                  onClick={() => setShowCustomModal(true)}
                  className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 font-medium text-slate-100 transition-all hover:bg-slate-700"
                >
                  <Plus className="h-4 w-4" />
                  Добавить своё
                </button>
              </div>
            </div>

            {/* Custom Equipment Modal */}
            {showCustomModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="card w-full max-w-lg space-y-6 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-100">Добавить собственное оборудование</h2>
                    <button onClick={() => setShowCustomModal(false)} className="text-slate-400 hover:text-slate-200">
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Название</label>
                      <input
                        type="text"
                        value={customForm.name}
                        onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                        className="w-full rounded-lg bg-slate-800 px-4 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Ваше оборудование"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Бренд</label>
                      <input
                        type="text"
                        value={customForm.brand}
                        onChange={(e) => setCustomForm({ ...customForm, brand: e.target.value })}
                        className="w-full rounded-lg bg-slate-800 px-4 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Бренд"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Категория</label>
                        <select
                          value={customForm.category}
                          onChange={(e) => setCustomForm({ ...customForm, category: e.target.value })}
                          className="w-full rounded-lg bg-slate-800 px-4 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Выберите</option>
                          {allCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Подкатегория</label>
                        <input
                          type="text"
                          value={customForm.subcategory}
                          onChange={(e) => setCustomForm({ ...customForm, subcategory: e.target.value })}
                          className="w-full rounded-lg bg-slate-800 px-4 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Подкатегория"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Цена ($)</label>
                        <input
                          type="number"
                          value={customForm.price}
                          onChange={(e) => setCustomForm({ ...customForm, price: parseInt(e.target.value) || 0 })}
                          className="w-full rounded-lg bg-slate-800 px-4 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Количество</label>
                        <input
                          type="number"
                          value={customForm.quantity}
                          onChange={(e) => setCustomForm({ ...customForm, quantity: parseInt(e.target.value) || 1 })}
                          className="w-full rounded-lg bg-slate-800 px-4 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Статус</label>
                      <select
                        value={customForm.status}
                        onChange={(e) =>
                          setCustomForm({
                            ...customForm,
                            status: e.target.value as 'owned' | 'planned' | 'dream',
                          })
                        }
                        className="w-full rounded-lg bg-slate-800 px-4 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="owned">Есть</option>
                        <option value="planned">План</option>
                        <option value="dream">Мечта</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-slate-700">
                    <button
                      onClick={() => setShowCustomModal(false)}
                      className="flex-1 rounded-lg bg-slate-800 px-4 py-2 font-medium text-slate-100 transition-colors hover:bg-slate-700"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={handleAddCustomEquipment}
                      className="flex-1 rounded-lg bg-gradient-accent px-4 py-2 font-medium text-slate-950 transition-all hover:shadow-lg"
                    >
                      Добавить
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Equipment Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-100">
                  {filteredEquipment.length > 0 ? `Каталог (${filteredEquipment.length})` : 'Оборудование в каталоге'}
                </h2>
              </div>

              {filteredEquipment.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredEquipment.map((equipment) => {
                    const userEq = userEquipmentMap.get(equipment.id)
                    return (
                      <EquipmentCard
                        key={equipment.id}
                        equipment={equipment}
                        userEquipment={userEq}
                        onStatusChange={handleStatusChange}
                        onQuantityChange={handleQuantityChange}
                        compact={true}
                      />
                    )
                  })}
                </div>
              ) : (
                <div className="card p-8 text-center">
                  <p className="text-slate-400">Оборудование не найдено</p>
                </div>
              )}
            </div>

            {/* My Equipment */}
            {userEquipment.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-100">Моё оборудование ({userEquipment.length})</h2>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {userEquipment.map((ue) => {
                    const equipment = mockEquipmentCatalog.find((e) => e.id === ue.equipment_id)
                    if (equipment) {
                      return (
                        <EquipmentCard
                          key={ue.id}
                          equipment={equipment}
                          userEquipment={ue}
                          onStatusChange={handleStatusChange}
                          onQuantityChange={handleQuantityChange}
                          onRemove={handleRemoveEquipment}
                          showRemove={true}
                          compact={true}
                        />
                      )
                    }
                    // For custom equipment
                    return (
                      <div key={ue.id} className="card p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-100">{ue.custom_name}</h3>
                            <p className="text-xs text-slate-500">{ue.category}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveEquipment(ue.id)}
                            className="text-slate-600 hover:text-red-400 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className={`inline-block rounded-lg border px-3 py-2 text-sm font-medium ${statusConfig[ue.status].bg}`}>
                          {statusConfig[ue.status].emoji} {statusConfig[ue.status].label}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleQuantityChange(ue.equipment_id, Math.max(1, ue.quantity - 1))}
                            className="w-5 h-5 flex items-center justify-center rounded bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 text-xs"
                          >
                            −
                          </button>
                          <span className="text-xs font-bold text-slate-200 w-4 text-center">{ue.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(ue.equipment_id, ue.quantity + 1)}
                            className="w-5 h-5 flex items-center justify-center rounded bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Setup Score */}
              <div className="card flex flex-col items-center justify-center p-8">
                <h2 className="mb-6 text-xl font-semibold text-slate-100">Готовность сетапа</h2>
                <ProgressRing percentage={setupScore} size={200} />
                <p className="mt-6 text-center text-sm text-slate-400">
                  {setupScore < 30 && 'Начинающий уровень'}
                  {setupScore >= 30 && setupScore < 70 && 'Средний уровень подготовки'}
                  {setupScore >= 70 && 'Высокий уровень подготовки'}
                </p>
              </div>

              {/* Level & Progress */}
              <div className="card p-6">
                <h2 className="mb-6 text-xl font-semibold text-slate-100">Уровень и опыт</h2>

                {userProgress && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold gradient-text">{userProgress.level}</div>
                      <div className="text-sm text-slate-400 mt-1">{userProgress.title}</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Опыт в уровне</span>
                        <span>
                          {userProgress.xp} / {userProgress.xpToNext}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-accent transition-all duration-300"
                          style={{
                            width: `${(userProgress.xp / Math.max(1, userProgress.xpToNext)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Equipment Counts */}
              <div className="card p-6">
                <h2 className="mb-6 text-xl font-semibold text-slate-100">Статистика</h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Всего оборудования</span>
                    <span className="font-semibold text-slate-100">{userEquipment.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">
                      <span className="text-lg">🟢</span> Есть
                    </span>
                    <span className="font-semibold text-green-400">{ownedCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">
                      <span className="text-lg">🟡</span> План
                    </span>
                    <span className="font-semibold text-yellow-400">{plannedCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">
                      <span className="text-lg">⚫</span> Мечта
                    </span>
                    <span className="font-semibold text-gray-400">{dreamCount}</span>
                  </div>

                  <div className="border-t border-slate-700 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Примерная стоимость</span>
                      <span className="font-semibold text-slate-100">${totalValue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Radar Chart */}
            {radarData.length > 0 && (
              <div className="card p-6">
                <h2 className="mb-6 text-xl font-semibold text-slate-100">Готовность по категориям</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="category" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                    <PolarRadiusAxis stroke="#94a3b8" />
                    <Radar name="Есть" dataKey="Есть" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Radar name="Нужно" dataKey="Нужно" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* ACHIEVEMENTS TAB */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-100">Достижения</h2>
              <p className="text-slate-400">
                Разблокировано: {unlockedAchievements.length} / {achievements.length}
              </p>
            </div>

            {/* Achievement Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement) => {
                const isUnlocked = unlockedAchievements.includes(achievement.id)
                const colors = rarityColors[achievement.rarity]

                return (
                  <div
                    key={achievement.id}
                    className={`card p-4 border transition-all ${isUnlocked ? `${colors.border} ${colors.glow}` : 'border-slate-700'}`}
                  >
                    <div className={`inline-block text-4xl mb-3 ${isUnlocked ? '' : 'opacity-50'}`}>
                      {achievement.icon}
                    </div>

                    <h3 className={`font-semibold mb-2 ${isUnlocked ? 'text-slate-100' : 'text-slate-500'}`}>
                      {achievement.title}
                    </h3>

                    <p className={`text-sm mb-3 ${isUnlocked ? 'text-slate-400' : 'text-slate-600'}`}>
                      {achievement.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${colors.bg} ${colors.text}`}>
                        {achievement.rarity === 'common' && 'Обычное'}
                        {achievement.rarity === 'rare' && 'Редкое'}
                        {achievement.rarity === 'epic' && 'Эпическое'}
                        {achievement.rarity === 'legendary' && 'Легендарное'}
                      </span>

                      <span className={`text-xs font-semibold ${isUnlocked ? 'text-amber-400' : 'text-slate-600'}`}>
                        +{achievement.xp} XP
                      </span>
                    </div>

                    {!isUnlocked && <div className="mt-2 text-xs text-slate-600">Не разблокировано</div>}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
