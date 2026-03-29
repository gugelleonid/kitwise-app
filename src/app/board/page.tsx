'use client'

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Search, Plus, Trash2, Check, Lightbulb, LayoutGrid, List, Zap, Trophy, Heart, Clipboard } from 'lucide-react'
import {
  initializeGameState,
  processAction,
  calculateSetupCompletion,
  formatScore,
  getNicheRequirements,
  getEquipmentTierInNiche,
} from '@/lib/gameEngine'
import { mockNiches, mockEquipmentCatalog, categoryIcons, mockNicheRequirements } from '@/lib/mockData'
import { LEVELS, getLevelForXP, getXPProgress } from '@/lib/levels'
import { QUESTS, checkQuestCompletion, getQuestProgress } from '@/lib/quests'
import { ACHIEVEMENTS, checkAchievement } from '@/lib/achievements'
import type { UserEquipment, EquipmentCatalog, Niche } from '@/lib/types'

// =====================================================
// TOAST SYSTEM
// =====================================================

interface Toast {
  id: string
  type: 'achievement' | 'quest' | 'levelup' | 'motivational'
  title: string
  description: string
  icon: string
}

// =====================================================
// BUDGET RANGES
// =====================================================

interface BudgetRange {
  label: string
  min: number
  max: number
}

const BUDGET_RANGES: BudgetRange[] = [
  { label: 'До $1,000', min: 0, max: 1000 },
  { label: '$1,000-3,000', min: 1000, max: 3000 },
  { label: '$3,000-10,000', min: 3000, max: 10000 },
  { label: '$10,000+', min: 10000, max: Infinity },
]

const EXPERIENCE_LEVELS = ['Начинающий', 'Продвинутый', 'Профессионал']

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function BoardPage() {
  const [step, setStep] = useState<'niche' | 'budget' | 'board'>('niche')
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null)
  const [selectedBudget, setSelectedBudget] = useState<BudgetRange | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)

  const [gameState, setGameState] = useState(initializeGameState())
  const [userEquipment, setUserEquipment] = useState<UserEquipment[]>([])
  const [totalXP, setTotalXP] = useState(0)
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])
  const [completedQuests, setCompletedQuests] = useState<string[]>([])

  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'name'>('recommended')
  const [toasts, setToasts] = useState<Toast[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('kitwise-board-state')
    if (saved) {
      const state = JSON.parse(saved)
      if (state.selectedNiche) setSelectedNiche(state.selectedNiche)
      if (state.selectedBudget) setSelectedBudget(state.selectedBudget)
      if (state.selectedLevel) setSelectedLevel(state.selectedLevel)
      if (state.step) setStep(state.step)
      if (state.gameState) setGameState(state.gameState)
      if (state.userEquipment) setUserEquipment(state.userEquipment)
      if (state.totalXP) setTotalXP(state.totalXP)
      if (state.unlockedAchievements) setUnlockedAchievements(state.unlockedAchievements)
      if (state.completedQuests) setCompletedQuests(state.completedQuests)
    }
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (step === 'board' && selectedNiche) {
      localStorage.setItem('kitwise-board-state', JSON.stringify({
        step,
        selectedNiche,
        selectedBudget,
        selectedLevel,
        gameState,
        userEquipment,
        totalXP,
        unlockedAchievements,
        completedQuests,
      }))
    }
  }, [step, selectedNiche, selectedBudget, selectedLevel, gameState, userEquipment, totalXP, unlockedAchievements, completedQuests])

  const handleNicheSelect = (niche: Niche) => {
    setSelectedNiche(niche)
    setStep('budget')
  }

  const handleBudgetSelect = (budget: BudgetRange) => {
    setSelectedBudget(budget)
  }

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level)
    setStep('board')
  }

  // Get recommendations for this niche
  const nicheRecommendations = useMemo(() => {
    if (!selectedNiche) return []
    const reqs = getNicheRequirements(selectedNiche.id)
    if (!reqs) return []

    const mustHaveEquipment = reqs.requirements.must_have
      .map(req => mockEquipmentCatalog.find(e => e.id === req.equipment_id))
      .filter((e): e is EquipmentCatalog => e !== undefined)
      .slice(0, 6)

    return mustHaveEquipment
  }, [selectedNiche])

  // Smart catalog filtering
  const filteredEquipment = useMemo(() => {
    let items = mockEquipmentCatalog

    // Category filter
    if (activeCategory !== 'all') {
      items = items.filter(e => e.category.toLowerCase() === activeCategory.toLowerCase())
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      items = items.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.brand.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        (e.subcategory && e.subcategory.toLowerCase().includes(q))
      )
    }

    // Budget filter
    if (selectedBudget) {
      items = items.filter(e => {
        const minPrice = e.price_min ?? 0
        const maxPrice = e.price_max ?? Infinity
        return minPrice <= selectedBudget.max && maxPrice >= selectedBudget.min
      })
    }

    // Sort
    if (sortBy === 'price_asc') {
      items = [...items].sort((a, b) => (a.price_min ?? 0) - (b.price_min ?? 0))
    } else if (sortBy === 'price_desc') {
      items = [...items].sort((a, b) => (b.price_max ?? 0) - (a.price_max ?? 0))
    } else if (sortBy === 'name') {
      items = [...items].sort((a, b) => a.name.localeCompare(b.name, 'ru'))
    }

    return items
  }, [activeCategory, searchQuery, selectedBudget, sortBy])

  // Get all categories from catalog
  const allCategories = useMemo(() => {
    return ['all', ...Array.from(new Set(mockEquipmentCatalog.map(e => e.category.toLowerCase())))]
  }, [])

  const handleAddEquipment = useCallback((equipment: EquipmentCatalog) => {
    if (!selectedNiche) return

    const newEquipment: UserEquipment = {
      id: `eq-${Date.now()}`,
      user_id: 'current',
      equipment_id: equipment.id,
      custom_name: null,
      category: equipment.category,
      status: 'owned',
      quantity: 1,
      acquired_at: new Date().toISOString(),
      notes: null,
    }

    const { newState, pointsEarned, events } = processAction(
      gameState,
      'add',
      equipment.id,
      selectedNiche.id,
      [...userEquipment, newEquipment],
      mockEquipmentCatalog,
      0,
      0
    )

    setGameState(newState)
    setUserEquipment([...userEquipment, newEquipment])
    setTotalXP(prev => prev + (pointsEarned * 0.5)) // XP conversion

    // Check achievements
    const newAchievements = ACHIEVEMENTS.filter(ach =>
      checkAchievement(ach, {
        totalItems: userEquipment.length + 1,
        totalScore: newState.score,
        maxCombo: newState.maxCombo,
        maxStreak: newState.streak,
        categoriesUsed: Array.from(new Set([...userEquipment, newEquipment].map(e => e.category))),
        brandsUsed: Array.from(new Set([...userEquipment, newEquipment].map(e => mockEquipmentCatalog.find(c => c.id === e.equipment_id)?.brand || '').filter(b => b))),
        totalSpent: 0,
        setupCompletion: calculateSetupCompletion([...userEquipment, newEquipment], selectedNiche.id, mockEquipmentCatalog),
        questsCompleted: completedQuests.length,
        sessionsCount: 1,
        unlockedAchievements,
      })
    )

    const newUnlockedIds = newAchievements.map(a => a.id).filter(id => !unlockedAchievements.includes(id))
    if (newUnlockedIds.length > 0) {
      setUnlockedAchievements([...unlockedAchievements, ...newUnlockedIds])
      newUnlockedIds.forEach(id => {
        const ach = ACHIEVEMENTS.find(a => a.id === id)
        if (ach) {
          showToast({
            type: 'achievement',
            title: `Ачивка: ${ach.title}`,
            description: ach.description,
            icon: ach.icon,
          })
        }
      })
    }

    // Show motivational message 30% of the time
    if (Math.random() < 0.3) {
      const messages = [
        { title: 'Отлично!', description: 'Продолжай в том же духе' },
        { title: 'Супер!', description: 'Твой сетап становится мощнее' },
        { title: 'Вперед!', description: 'Ты на правильном пути' },
      ]
      const msg = messages[Math.floor(Math.random() * messages.length)]
      showToast({
        type: 'motivational',
        title: msg.title,
        description: msg.description,
        icon: '💪',
      })
    }
  }, [selectedNiche, gameState, userEquipment, mockEquipmentCatalog, unlockedAchievements, completedQuests])

  const handleRemoveEquipment = useCallback((id: string) => {
    setUserEquipment(prev => prev.filter(e => e.id !== id))
  }, [])

  const handleStatusChange = useCallback((id: string, status: 'owned' | 'planned' | 'dream') => {
    setUserEquipment(prev => prev.map(e => e.id === id ? { ...e, status } : e))
  }, [])

  const handleQuantityChange = useCallback((id: string, delta: number) => {
    setUserEquipment(prev => prev.map(e =>
      e.id === id ? { ...e, quantity: Math.max(1, e.quantity + delta) } : e
    ))
  }, [])

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}`
    setToasts(prev => [...prev, { ...toast, id }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const setupCompletion = selectedNiche ? calculateSetupCompletion(userEquipment, selectedNiche.id, mockEquipmentCatalog) : 0
  const currentLevel = getLevelForXP(Math.floor(totalXP))
  const xpProgress = getXPProgress(Math.floor(totalXP))
  const equipmentById = useMemo(() => new Map(mockEquipmentCatalog.map(e => [e.id, e])), [])

  // =====================================================
  // STEP 1: NICHE SELECTION
  // =====================================================

  if (step === 'niche') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Выбери свою нишу</h1>
            <p className="text-lg text-gray-600">Каждая ниша имеет собственный набор требований и рекомендаций</p>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {mockNiches.map(niche => (
              <button
                key={niche.id}
                onClick={() => handleNicheSelect(niche)}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-indigo-200 text-left"
              >
                <div className="mb-4 text-4xl">{niche.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{niche.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{niche.description}</p>
                <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm">
                  Выбрать <span>→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // =====================================================
  // STEP 2: BUDGET & LEVEL SELECTION
  // =====================================================

  if (step === 'budget') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <button
            onClick={() => setStep('niche')}
            className="mb-8 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
          >
            ← Назад к нишам
          </button>

          <div className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedNiche?.name}</h1>
            <p className="text-gray-600">{selectedNiche?.description}</p>
          </div>

          {/* Budget Selection */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Твой бюджет</h2>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              {BUDGET_RANGES.map(budget => (
                <button
                  key={budget.label}
                  onClick={() => handleBudgetSelect(budget)}
                  className={`rounded-xl p-4 font-medium transition-all border-2 text-center ${
                    selectedBudget?.label === budget.label
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-900 border-gray-100 hover:border-indigo-200'
                  }`}
                >
                  {budget.label}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level Selection */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Твой уровень опыта</h2>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
              {EXPERIENCE_LEVELS.map(level => (
                <button
                  key={level}
                  onClick={() => handleLevelSelect(level)}
                  className={`rounded-xl p-4 font-medium transition-all border-2 text-center ${
                    selectedLevel === level
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-900 border-gray-100 hover:border-indigo-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => selectedBudget && selectedLevel && setStep('board')}
            disabled={!selectedBudget || !selectedLevel}
            className="w-full rounded-xl bg-indigo-600 text-white py-3 font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors hover:bg-indigo-700"
          >
            Начать собирать сетап
          </button>
        </div>
      </div>
    )
  }

  // =====================================================
  // STEP 3: MAIN BOARD
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast notifications */}
      <div className="fixed bottom-6 right-6 z-50 space-y-3">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`rounded-xl p-4 shadow-lg border text-white flex gap-3 items-start max-w-sm ${
              toast.type === 'achievement'
                ? 'bg-amber-500 border-amber-600'
                : toast.type === 'quest'
                  ? 'bg-emerald-500 border-emerald-600'
                  : toast.type === 'levelup'
                    ? 'bg-violet-500 border-violet-600'
                    : 'bg-blue-500 border-blue-600'
            }`}
          >
            <span className="text-2xl">{toast.icon}</span>
            <div>
              <div className="font-semibold">{toast.title}</div>
              <div className="text-sm opacity-90">{toast.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* LEFT COLUMN: Catalog */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recommendations Section */}
            {nicheRecommendations.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-indigo-600" />
                  Рекомендовано для {selectedNiche?.name}
                </h2>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  {nicheRecommendations.map(eq => {
                    const isAdded = userEquipment.some(ue => ue.equipment_id === eq.id)
                    return (
                      <div
                        key={eq.id}
                        className={`rounded-xl p-4 border-2 transition-all ${
                          isAdded
                            ? 'bg-gray-50 border-emerald-200'
                            : 'bg-white border-indigo-200 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="text-sm text-indigo-600 font-medium mb-1">⭐ Необходимо</div>
                            <h4 className="font-semibold text-gray-900 text-sm">{eq.name}</h4>
                            <p className="text-xs text-gray-600">{eq.brand}</p>
                            {eq.price_min && (
                              <p className="text-xs text-gray-500 mt-2">
                                ${eq.price_min} - ${eq.price_max || eq.price_min}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => !isAdded && handleAddEquipment(eq)}
                            disabled={isAdded}
                            className={`rounded-lg p-2 transition-all font-medium text-sm ${
                              isAdded
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                          >
                            {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Search & Filters */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Найди оборудование..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Category Pills */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat === 'all' ? 'Все' : cat}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-400"
              >
                <option value="recommended">По рекомендации</option>
                <option value="price_asc">По цене ↑</option>
                <option value="price_desc">По цене ↓</option>
                <option value="name">По названию</option>
              </select>
            </div>

            {/* Equipment List */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Каталог оборудования ({filteredEquipment.length})</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredEquipment.map(eq => {
                  const isAdded = userEquipment.some(ue => ue.equipment_id === eq.id)
                  const tier = getEquipmentTierInNiche(eq.id, selectedNiche?.id || '')
                  return (
                    <div
                      key={eq.id}
                      draggable
                      onDragStart={e => {
                        e.dataTransfer.effectAllowed = 'copy'
                        e.dataTransfer.setData('equipment', JSON.stringify(eq))
                      }}
                      className={`flex items-center gap-4 p-3 rounded-lg border transition-all cursor-move ${
                        isAdded
                          ? 'bg-gray-50 border-gray-200 opacity-50'
                          : 'bg-white border-gray-100 hover:border-indigo-200 hover:bg-indigo-50'
                      }`}
                    >
                      <span className="text-lg">{categoryIcons[eq.category] || '📦'}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm">{eq.name}</h4>
                        <p className="text-xs text-gray-600">{eq.brand}</p>
                        {eq.price_min && (
                          <p className="text-xs text-gray-500">${eq.price_min} - ${eq.price_max || eq.price_min}</p>
                        )}
                      </div>
                      {tier !== 'not_recommended' && (
                        <span className="text-xs px-2 py-1 rounded-md bg-indigo-100 text-indigo-700">
                          ⭐ {tier === 'must_have' ? 'Необходимо' : tier === 'pro_level' ? 'Pro' : 'Оптимизация'}
                        </span>
                      )}
                      <button
                        onClick={() => !isAdded && handleAddEquipment(eq)}
                        disabled={isAdded}
                        className={`p-2 rounded-lg transition-all ${
                          isAdded
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Game Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Game HUD */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentLevel.icon}</span>
                <div className="flex-1">
                  <p className="text-xs text-gray-600">УРОВЕНЬ</p>
                  <h3 className="font-bold text-gray-900">{currentLevel.title}</h3>
                </div>
              </div>

              {/* XP Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-gray-600">XP</p>
                  <p className="text-xs font-semibold text-gray-900">
                    {xpProgress.current} / {xpProgress.needed}
                  </p>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all"
                    style={{ width: `${xpProgress.percent}%` }}
                  />
                </div>
              </div>

              {/* Score */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-600 mb-1">ОЧКИ</p>
                <p className="text-3xl font-bold text-gray-900">{formatScore(gameState.score)}</p>
              </div>

              {/* Combo */}
              {gameState.combo > 1 && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="inline-block px-3 py-2 rounded-lg bg-amber-100 text-amber-700 font-bold text-lg">
                    {gameState.multiplier.toFixed(1)}x 🔥
                  </div>
                </div>
              )}

              {/* Setup Completion */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-gray-600">СЕТАП</p>
                  <p className="text-sm font-bold text-gray-900">{setupCompletion}%</p>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all"
                    style={{ width: `${setupCompletion}%` }}
                  />
                </div>
              </div>
            </div>

            {/* My Board */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <LayoutGrid className="w-5 h-5" />
                Мой сетап ({userEquipment.length})
              </h3>

              {userEquipment.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
                  <p className="text-sm text-gray-600">Перетащи оборудование сюда или нажми +</p>
                </div>
              ) : (
                <div
                  className="space-y-3 max-h-96 overflow-y-auto p-4 rounded-lg bg-gray-50 border-2 border-dashed border-gray-200"
                  onDragOver={e => {
                    e.preventDefault()
                    e.currentTarget.classList.add('bg-blue-50', 'border-blue-300')
                  }}
                  onDragLeave={e => {
                    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300')
                  }}
                  onDrop={e => {
                    e.preventDefault()
                    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300')
                    const data = e.dataTransfer.getData('equipment')
                    if (data) {
                      const eq = JSON.parse(data)
                      handleAddEquipment(eq)
                    }
                  }}
                >
                  {userEquipment.map(ue => {
                    const eq = equipmentById.get(ue.equipment_id)
                    return (
                      <div key={ue.id} className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm">{eq?.name}</h4>
                            <p className="text-xs text-gray-600">{eq?.brand}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveEquipment(ue.id)}
                            className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Status buttons */}
                        <div className="flex gap-1.5 mb-3">
                          {(['owned', 'planned', 'dream'] as const).map(status => (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(ue.id, status)}
                              className={`flex-1 text-xs py-1.5 rounded font-medium transition-all ${
                                ue.status === status
                                  ? status === 'owned'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : status === 'planned'
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-rose-100 text-rose-700'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {status === 'owned' ? '✓ Есть' : status === 'planned' ? '📋 План' : '❤️ Хочу'}
                            </button>
                          ))}
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Кол-во:</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(ue.id, -1)}
                              className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                            >
                              −
                            </button>
                            <span className="text-sm font-semibold w-6 text-center">{ue.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(ue.id, 1)}
                              className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Quest Tracker */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clipboard className="w-5 h-5" />
                Активные квесты
              </h3>

              <div className="space-y-3">
                {QUESTS.slice(0, 4).map(quest => {
                  const isCompleted = checkQuestCompletion(quest, {
                    equipmentCount: userEquipment.length,
                    categoriesUsed: Array.from(new Set(userEquipment.map(e => e.category))),
                    totalScore: gameState.score,
                    comboMax: gameState.maxCombo,
                    nicheId: selectedNiche?.id || '',
                    equipmentByStatus: {
                      owned: userEquipment.filter(e => e.status === 'owned').length,
                      planned: userEquipment.filter(e => e.status === 'planned').length,
                      dream: userEquipment.filter(e => e.status === 'dream').length,
                    },
                    equipmentByCategory: Object.fromEntries(
                      Array.from(new Set(userEquipment.map(e => e.category))).map(cat => [
                        cat,
                        userEquipment.filter(e => e.category === cat).length,
                      ])
                    ),
                    hasCamera: userEquipment.some(e => e.category === 'Camera'),
                    hasLens: userEquipment.some(e => e.category === 'Lens'),
                    hasLighting: userEquipment.some(e => e.category === 'Lighting'),
                    hasAudio: userEquipment.some(e => e.category === 'Audio'),
                    completedQuests,
                  })
                  const progress = getQuestProgress(quest, {
                    equipmentCount: userEquipment.length,
                    categoriesUsed: Array.from(new Set(userEquipment.map(e => e.category))),
                    totalScore: gameState.score,
                    comboMax: gameState.maxCombo,
                    nicheId: selectedNiche?.id || '',
                    equipmentByStatus: {
                      owned: userEquipment.filter(e => e.status === 'owned').length,
                      planned: userEquipment.filter(e => e.status === 'planned').length,
                      dream: userEquipment.filter(e => e.status === 'dream').length,
                    },
                    equipmentByCategory: Object.fromEntries(
                      Array.from(new Set(userEquipment.map(e => e.category))).map(cat => [
                        cat,
                        userEquipment.filter(e => e.category === cat).length,
                      ])
                    ),
                    hasCamera: userEquipment.some(e => e.category === 'Camera'),
                    hasLens: userEquipment.some(e => e.category === 'Lens'),
                    hasLighting: userEquipment.some(e => e.category === 'Lighting'),
                    hasAudio: userEquipment.some(e => e.category === 'Audio'),
                    completedQuests,
                  })

                  return (
                    <div
                      key={quest.id}
                      className={`rounded-lg p-3 transition-all ${
                        isCompleted ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-lg">{quest.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-semibold ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {quest.title}
                          </h4>
                          <p className="text-xs text-gray-600">{quest.description}</p>
                        </div>
                        {isCompleted && <Check className="w-5 h-5 text-emerald-600" />}
                      </div>
                      {!isCompleted && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 transition-all"
                              style={{ width: `${Math.min((progress.current / progress.target) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="font-semibold">{progress.current}/{progress.target}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                if (confirm('Хочешь сменить нишу?')) {
                  setStep('niche')
                  setSelectedNiche(null)
                  setSelectedBudget(null)
                  setSelectedLevel(null)
                  setUserEquipment([])
                  setGameState(initializeGameState())
                }
              }}
              className="w-full rounded-lg border-2 border-gray-200 py-2 text-center font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all text-sm"
            >
              Сменить нишу
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
