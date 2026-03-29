'use client'

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Search, Plus, Trash2, Check, ChevronDown, ChevronUp, Download, Share2, GripVertical, Zap, Trophy, Star } from 'lucide-react'
import { mockNiches, mockEquipmentCatalog, categoryIcons } from '@/lib/mockData'
import { initializeGameState, processAction, calculateSetupCompletion, formatScore } from '@/lib/gameEngine'
import { getLevelForXP, getXPProgress } from '@/lib/levels'
import type { UserEquipment, EquipmentCatalog, Niche } from '@/lib/types'

// =====================================================
// CATEGORY LABELS (Russian)
// =====================================================

const CATEGORY_LABELS: Record<string, string> = {
  Camera: 'Камеры',
  Lens: 'Объективы',
  Flash: 'Вспышки',
  Lighting: 'Свет',
  Support: 'Штативы',
  Audio: 'Аудио',
  Storage: 'Хранение',
  Drone: 'Дроны',
  Computer: 'Компьютеры',
  Bag: 'Сумки',
  Accessory: 'Аксессуары',
}

const STATUS_CONFIG = {
  owned: { label: 'Есть', emoji: '✅', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  planned: { label: 'План', emoji: '📋', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  dream: { label: 'Мечта', emoji: '💭', color: 'bg-violet-100 text-violet-700 border-violet-200' },
} as const

const MOTIVATIONAL_QUOTES = [
  'Сниму свадьбу за $XXX =)',
  'Готов к любому проекту!',
  'Моя студия всегда со мной',
  'Снимаю на все, что движется',
  'Один сетап на миллион',
]

// =====================================================
// TOAST
// =====================================================

interface Toast {
  id: string
  title: string
  description: string
  icon: string
  type: 'success' | 'achievement' | 'info'
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function BoardPage() {
  // --- Flow state ---
  const [step, setStep] = useState<'niche' | 'board'>('niche')
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null)

  // --- Board state ---
  const [gameState, setGameState] = useState(initializeGameState())
  const [userEquipment, setUserEquipment] = useState<UserEquipment[]>([])
  const [totalXP, setTotalXP] = useState(0)

  // --- Catalog state ---
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [activeBrand, setActiveBrand] = useState<string>('all')
  const [catalogOpen, setCatalogOpen] = useState(true)

  // --- UI state ---
  const [toasts, setToasts] = useState<Toast[]>([])
  const [dragOverBoard, setDragOverBoard] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const exportRef = useRef<HTMLDivElement>(null)

  // --- Load from localStorage ---
  useEffect(() => {
    const saved = localStorage.getItem('kitwise-game-state')
    if (saved) {
      try {
        const s = JSON.parse(saved)
        if (s.selectedNiche) { setSelectedNiche(s.selectedNiche); setStep('board') }
        if (s.gameState) setGameState(s.gameState)
        if (s.userEquipment) setUserEquipment(s.userEquipment)
        if (s.totalXP) setTotalXP(s.totalXP)
      } catch { /* ignore corrupted state */ }
    }
  }, [])

  // --- Save to localStorage ---
  useEffect(() => {
    if (step === 'board' && selectedNiche) {
      localStorage.setItem('kitwise-game-state', JSON.stringify({
        selectedNiche, gameState, userEquipment, totalXP,
      }))
    }
  }, [step, selectedNiche, gameState, userEquipment, totalXP])

  // --- Derived data ---
  const equipmentMap = useMemo(() => new Map(mockEquipmentCatalog.map(e => [e.id, e])), [])

  const allCategories = useMemo(() => {
    const cats = Array.from(new Set(mockEquipmentCatalog.map(e => e.category)))
    return ['all', ...cats]
  }, [])

  const allBrands = useMemo(() => {
    let items = mockEquipmentCatalog
    if (activeCategory !== 'all') items = items.filter(e => e.category === activeCategory)
    const brands = Array.from(new Set(items.map(e => e.brand))).sort()
    return ['all', ...brands]
  }, [activeCategory])

  const filteredEquipment = useMemo(() => {
    let items = mockEquipmentCatalog
    if (activeCategory !== 'all') items = items.filter(e => e.category === activeCategory)
    if (activeBrand !== 'all') items = items.filter(e => e.brand === activeBrand)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      items = items.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.brand.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      )
    }
    return items
  }, [activeCategory, activeBrand, searchQuery])

  // --- Board equipment grouped ---
  const boardGrouped = useMemo(() => {
    const groups: Record<string, { eq: UserEquipment; catalog: EquipmentCatalog }[]> = {}
    userEquipment.forEach(ue => {
      const cat = ue.category
      if (!groups[cat]) groups[cat] = []
      const catalog = equipmentMap.get(ue.equipment_id)
      if (catalog) groups[cat].push({ eq: ue, catalog })
    })
    return groups
  }, [userEquipment, equipmentMap])

  const setupCompletion = selectedNiche
    ? calculateSetupCompletion(userEquipment, selectedNiche.id, mockEquipmentCatalog)
    : 0

  const currentLevel = getLevelForXP(Math.floor(totalXP))
  const xpProgress = getXPProgress(Math.floor(totalXP))

  const totalPrice = useMemo(() => {
    return userEquipment.reduce((sum, ue) => {
      const cat = equipmentMap.get(ue.equipment_id)
      return sum + (cat?.price_min || 0) * ue.quantity
    }, 0)
  }, [userEquipment, equipmentMap])

  // --- Actions ---
  const showToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = `t-${Date.now()}-${Math.random()}`
    setToasts(prev => [...prev, { ...t, id }])
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 3000)
  }, [])

  const addEquipment = useCallback((equipment: EquipmentCatalog) => {
    if (!selectedNiche) return
    if (userEquipment.some(ue => ue.equipment_id === equipment.id)) return

    const newEq: UserEquipment = {
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

    const { newState, pointsEarned } = processAction(
      gameState, 'add', equipment.id, selectedNiche.id,
      [...userEquipment, newEq], mockEquipmentCatalog, 0, 0
    )

    setGameState(newState)
    setUserEquipment(prev => [...prev, newEq])
    setTotalXP(prev => prev + pointsEarned * 0.5)

    showToast({
      type: 'success',
      title: `+ ${equipment.name}`,
      description: `${equipment.brand} · +${Math.floor(pointsEarned * 0.5)} XP`,
      icon: categoryIcons[equipment.category] || '📦',
    })
  }, [selectedNiche, gameState, userEquipment, showToast])

  const removeEquipment = useCallback((id: string) => {
    setUserEquipment(prev => prev.filter(e => e.id !== id))
  }, [])

  const cycleStatus = useCallback((id: string) => {
    const order: ('owned' | 'planned' | 'dream')[] = ['owned', 'planned', 'dream']
    setUserEquipment(prev => prev.map(e => {
      if (e.id !== id) return e
      const idx = order.indexOf(e.status)
      return { ...e, status: order[(idx + 1) % 3] }
    }))
  }, [])

  const resetBoard = useCallback(() => {
    localStorage.removeItem('kitwise-game-state')
    setStep('niche')
    setSelectedNiche(null)
    setGameState(initializeGameState())
    setUserEquipment([])
    setTotalXP(0)
  }, [])

  // --- Drag & Drop ---
  const handleDragStart = useCallback((e: React.DragEvent, eq: EquipmentCatalog) => {
    e.dataTransfer.setData('application/json', JSON.stringify(eq))
    e.dataTransfer.effectAllowed = 'copy'
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setDragOverBoard(true)
  }, [])

  const handleDragLeave = useCallback(() => setDragOverBoard(false), [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOverBoard(false)
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      if (data && data.id) addEquipment(data as EquipmentCatalog)
    } catch { /* ignore bad data */ }
  }, [addEquipment])

  // --- Export card as image ---
  const handleExport = useCallback(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 900
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Gradient background
    const grad = ctx.createLinearGradient(0, 0, 1200, 900)
    grad.addColorStop(0, '#4f46e5')
    grad.addColorStop(0.5, '#7c3aed')
    grad.addColorStop(1, '#a855f7')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 1200, 900)

    // Header
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font = '600 18px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('KITWISE', 600, 60)

    ctx.fillStyle = '#fff'
    ctx.font = 'bold 42px system-ui, -apple-system, sans-serif'
    ctx.fillText(`${selectedNiche?.icon || ''} ${selectedNiche?.name || ''}`, 600, 110)

    // Stats bar
    ctx.font = 'bold 28px system-ui'
    ctx.fillText(`💰 $${totalPrice.toLocaleString()}`, 300, 175)
    ctx.fillText(`📦 ${userEquipment.length} единиц`, 600, 175)
    ctx.fillText(`⚡ ${Math.round(setupCompletion)}% сетап`, 900, 175)

    // Equipment list
    ctx.textAlign = 'left'
    let y = 230
    const categories = Object.entries(boardGrouped)
    categories.forEach(([category, items]) => {
      ctx.fillStyle = 'rgba(255,255,255,0.6)'
      ctx.font = 'bold 16px system-ui'
      ctx.fillText(`${categoryIcons[category] || '📦'} ${(CATEGORY_LABELS[category] || category).toUpperCase()}`, 60, y)
      y += 30
      items.forEach(({ eq, catalog }) => {
        ctx.fillStyle = '#fff'
        ctx.font = '500 18px system-ui'
        const statusEmoji = STATUS_CONFIG[eq.status].emoji
        ctx.fillText(`${statusEmoji} ${catalog.name}`, 80, y)
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        ctx.font = '16px system-ui'
        ctx.textAlign = 'right'
        ctx.fillText(catalog.brand, 1140, y)
        ctx.textAlign = 'left'
        y += 28
      })
      y += 10
    })

    // Fun quote at bottom
    const quote = MOTIVATIONAL_QUOTES[0].replace('$XXX', `$${totalPrice.toLocaleString()}`)
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.font = 'italic 20px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText(`"${quote}"`, 600, 840)

    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.font = '14px system-ui'
    ctx.fillText('kitwise-app.vercel.app', 600, 875)

    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `kitwise-setup-${Date.now()}.png`
    link.click()
  }, [selectedNiche, totalPrice, userEquipment.length, boardGrouped, setupCompletion])

  // =====================================================
  // STEP 1: NICHE SELECTION
  // =====================================================

  if (step === 'niche') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-3">
              Собери свой сетап
            </h1>
            <p className="text-xl text-gray-500">Выбери нишу — мы покажем, что тебе нужно</p>
          </div>

          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {mockNiches.map(niche => (
              <button
                key={niche.id}
                onClick={() => { setSelectedNiche(niche); setStep('board') }}
                className="group rounded-2xl bg-white/80 backdrop-blur p-5 shadow-sm border border-gray-100 transition-all hover:shadow-lg hover:border-indigo-300 hover:scale-[1.03] text-center"
              >
                <div className="text-4xl mb-3">{niche.icon}</div>
                <h3 className="font-semibold text-gray-900 text-sm">{niche.name}</h3>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // =====================================================
  // STEP 2: MAIN BOARD
  // =====================================================

  const funQuote = MOTIVATIONAL_QUOTES[0].replace('$XXX', `$${totalPrice.toLocaleString()}`)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOAST NOTIFICATIONS */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className="flex items-center gap-3 bg-white rounded-xl shadow-xl border border-gray-100 px-4 py-3 max-w-xs animate-slide-in">
            <span className="text-2xl">{t.icon}</span>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{t.title}</p>
              <p className="text-xs text-gray-500">{t.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TOP BAR — Game Stats */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-6 flex-wrap">
          <button onClick={resetBoard} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
            ← Сменить нишу
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">{selectedNiche?.icon}</span>
            <span className="font-semibold text-gray-900">{selectedNiche?.name}</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-gray-900">{formatScore(gameState.score)}</span>
            <span className="text-xs text-gray-400">очков</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-bold text-gray-900">{Math.floor(totalXP)}</span>
            <span className="text-xs text-gray-400">XP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-bold text-gray-900">{currentLevel.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500" style={{ width: `${xpProgress.percent}%` }} />
            </div>
            <span className="text-xs text-gray-400">{xpProgress.current}/{xpProgress.needed}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-indigo-600">{Math.round(setupCompletion)}%</span>
            <span className="text-xs text-gray-400">сетап</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">

          {/* ==========================================
              LEFT: EQUIPMENT CATALOG
              ========================================== */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
              {/* Catalog header */}
              <button
                onClick={() => setCatalogOpen(!catalogOpen)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-lg font-bold text-gray-900">
                  Каталог <span className="text-gray-400 font-normal text-sm">({filteredEquipment.length})</span>
                </h2>
                {catalogOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>

              {catalogOpen && (
                <div className="px-5 pb-5 space-y-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Поиск по названию или бренду..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
                    />
                  </div>

                  {/* Category tabs */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
                    {allCategories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => { setActiveCategory(cat); setActiveBrand('all') }}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                          activeCategory === cat
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {cat === 'all' ? '🏷️ Все' : `${categoryIcons[cat] || '📦'} ${CATEGORY_LABELS[cat] || cat}`}
                      </button>
                    ))}
                  </div>

                  {/* Brand pills */}
                  {activeCategory !== 'all' && allBrands.length > 2 && (
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      {allBrands.map(brand => (
                        <button
                          key={brand}
                          onClick={() => setActiveBrand(brand)}
                          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                            activeBrand === brand
                              ? 'bg-violet-600 text-white border-violet-600'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300'
                          }`}
                        >
                          {brand === 'all' ? 'Все бренды' : brand}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Equipment list */}
                  <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
                    {filteredEquipment.map(eq => {
                      const isAdded = userEquipment.some(ue => ue.equipment_id === eq.id)
                      return (
                        <div
                          key={eq.id}
                          draggable={!isAdded}
                          onDragStart={e => handleDragStart(e, eq)}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all group ${
                            isAdded
                              ? 'bg-gray-50 border-gray-100 opacity-50'
                              : 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-sm cursor-grab active:cursor-grabbing'
                          }`}
                        >
                          {!isAdded && (
                            <GripVertical className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 flex-shrink-0" />
                          )}
                          <span className="text-lg flex-shrink-0">{categoryIcons[eq.category] || '📦'}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">{eq.name}</p>
                            <p className="text-xs text-gray-500">{eq.brand} {eq.price_min ? `· $${eq.price_min.toLocaleString()}` : ''}</p>
                          </div>
                          <button
                            onClick={() => addEquipment(eq)}
                            disabled={isAdded}
                            className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${
                              isAdded
                                ? 'text-emerald-500'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                            }`}
                          >
                            {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          </button>
                        </div>
                      )
                    })}
                    {filteredEquipment.length === 0 && (
                      <p className="text-center text-gray-400 py-8 text-sm">Ничего не найдено</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ==========================================
              RIGHT: MY BOARD + EXPORT
              ========================================== */}
          <div className="lg:col-span-7 space-y-6">

            {/* MY BOARD — drop zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`rounded-2xl bg-white shadow-sm border-2 transition-all min-h-[200px] ${
                dragOverBoard
                  ? 'border-indigo-400 bg-indigo-50/50 shadow-lg'
                  : 'border-gray-100'
              }`}
            >
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  Мой сетап <span className="text-gray-400 font-normal text-sm">({userEquipment.length})</span>
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-indigo-600">
                    ${totalPrice.toLocaleString()}
                  </span>
                  {userEquipment.length > 0 && (
                    <button
                      onClick={() => setShowExport(!showExport)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-medium hover:opacity-90 transition-opacity shadow-sm"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      Карточка
                    </button>
                  )}
                </div>
              </div>

              {userEquipment.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <p className="text-gray-400 text-sm mb-1">Перетащи оборудование сюда</p>
                  <p className="text-gray-300 text-xs">или нажми + в каталоге</p>
                </div>
              ) : (
                <div className="p-5 space-y-4">
                  {Object.entries(boardGrouped).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span>{categoryIcons[category] || '📦'}</span>
                        {CATEGORY_LABELS[category] || category}
                        <span className="text-gray-300">({items.length})</span>
                      </h3>
                      <div className="space-y-1.5">
                        {items.map(({ eq, catalog }) => (
                          <div
                            key={eq.id}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100 group hover:border-gray-200 transition-all"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate">{catalog.name}</p>
                              <p className="text-xs text-gray-500">{catalog.brand} {catalog.price_min ? `· $${catalog.price_min.toLocaleString()}` : ''}</p>
                            </div>
                            <button
                              onClick={() => cycleStatus(eq.id)}
                              className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${STATUS_CONFIG[eq.status].color}`}
                            >
                              {STATUS_CONFIG[eq.status].emoji} {STATUS_CONFIG[eq.status].label}
                            </button>
                            <button
                              onClick={() => removeEquipment(eq.id)}
                              className="p-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ==========================================
                EXPORT CARD FOR SOCIAL MEDIA
                ========================================== */}
            {showExport && userEquipment.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Карточка для репоста</h2>
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Скачать PNG
                  </button>
                </div>

                {/* THE CARD */}
                <div
                  ref={exportRef}
                  className="rounded-3xl overflow-hidden shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)',
                    padding: '2.5rem',
                  }}
                >
                  {/* Header */}
                  <div className="text-center mb-8">
                    <p className="text-white/60 text-sm font-medium tracking-widest uppercase mb-2">KitWise</p>
                    <h3 className="text-3xl font-extrabold text-white mb-1">
                      {selectedNiche?.icon} {selectedNiche?.name}
                    </h3>
                    <div className="flex items-center justify-center gap-4 mt-3">
                      <span className="px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-bold">
                        💰 ${totalPrice.toLocaleString()}
                      </span>
                      <span className="px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-bold">
                        📦 {userEquipment.length} единиц
                      </span>
                      <span className="px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-bold">
                        ⚡ {Math.round(setupCompletion)}% сетап
                      </span>
                    </div>
                  </div>

                  {/* Equipment by category */}
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    {Object.entries(boardGrouped).map(([category, items]) => (
                      <div key={category} className="rounded-2xl bg-white/10 backdrop-blur p-4">
                        <h4 className="text-white/80 text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                          <span>{categoryIcons[category]}</span>
                          {CATEGORY_LABELS[category] || category}
                        </h4>
                        <div className="space-y-1.5">
                          {items.map(({ eq, catalog }) => (
                            <div key={eq.id} className="flex items-center gap-2">
                              <span className="text-xs">{STATUS_CONFIG[eq.status].emoji}</span>
                              <span className="text-white text-sm font-medium truncate">{catalog.name}</span>
                              <span className="text-white/50 text-xs ml-auto flex-shrink-0">{catalog.brand}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer with fun quote */}
                  <div className="mt-8 text-center">
                    <p className="text-white/70 text-sm italic mb-4">"{funQuote}"</p>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-white/40 text-xs">✦</span>
                      <span className="text-white/60 text-xs tracking-widest uppercase">kitwise-app.vercel.app</span>
                      <span className="text-white/40 text-xs">✦</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
