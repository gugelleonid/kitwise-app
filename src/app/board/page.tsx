'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Niche, EquipmentCatalog, UserEquipment } from '@/lib/types'
import { mockNiches, mockEquipmentCatalog, categoryIcons } from '@/lib/mockData'
import {
  initializeGameState,
  processAction,
  calculateSetupCompletion,
  formatScore,
  GameState,
  Celebration,
  FloatingText,
  generateParticles,
} from '@/lib/gameEngine'

// =====================================================
// STYLES & KEYFRAMES
// =====================================================
const ANIMATION_STYLES = `
  @keyframes float-up {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-80px);
    }
  }

  @keyframes particle-burst {
    0% {
      opacity: 1;
      transform: translate(0, 0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(var(--tx), var(--ty)) scale(0);
    }
  }

  @keyframes combo-pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.15);
    }
  }

  @keyframes celebrate-in {
    0% {
      opacity: 0;
      transform: scale(0.5) translateY(20px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes slide-in-right {
    0% {
      opacity: 0;
      transform: translateX(30px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes card-entry {
    0% {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes glow-subtle {
    0%, 100% {
      box-shadow: 0 0 0 rgba(59, 130, 246, 0);
    }
    50% {
      box-shadow: 0 0 12px rgba(59, 130, 246, 0.3);
    }
  }
`

// =====================================================
// COMPONENTS & HELPERS
// =====================================================

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'owned':
      return { emoji: '✓', label: 'Есть', color: 'bg-emerald-500/20 text-emerald-400' }
    case 'planned':
      return { emoji: '📋', label: 'Планирую', color: 'bg-blue-500/20 text-blue-400' }
    case 'dream':
      return { emoji: '❤️', label: 'Хочу', color: 'bg-rose-500/20 text-rose-400' }
    default:
      return { emoji: '•', label: status, color: 'bg-slate-600/20 text-slate-300' }
  }
}

const formatPrice = (min: number | null, max: number | null): string => {
  if (!min && !max) return '?'
  if (min && !max) return `от $${min}`
  if (!min && max) return `до $${max}`
  return `$${min}-${max}`
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function BoardPage() {
  const [step, setStep] = useState<'niche' | 'board'>('niche')
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [userEquipment, setUserEquipment] = useState<UserEquipment[]>([])
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([])
  const [celebrations, setCelebrations] = useState<Celebration[]>([])
  const [expandedEquipmentId, setExpandedEquipmentId] = useState<string | null>(null)
  const boardContainerRef = useRef<HTMLDivElement>(null)

  // Initialize game state
  useEffect(() => {
    const saved = localStorage.getItem('kitwise-onboarding')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setSelectedNiche(mockNiches.find((n) => n.id === data.niches?.[0]?.id) || null)
        setUserEquipment(data.equipment || [])
        setGameState({
          ...initializeGameState(),
          score: data.score || 0,
        })
        if (data.equipment?.length > 0) {
          setStep('board')
        }
      } catch (e) {
        setGameState(initializeGameState())
      }
    } else {
      setGameState(initializeGameState())
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (gameState && selectedNiche) {
      localStorage.setItem(
        'kitwise-onboarding',
        JSON.stringify({
          niches: [selectedNiche],
          equipment: userEquipment,
          score: gameState.score,
          timestamp: Date.now(),
        })
      )
    }
  }, [userEquipment, gameState, selectedNiche])

  // Clean up old floating texts
  useEffect(() => {
    const timer = setInterval(() => {
      setFloatingTexts((prev) =>
        prev.filter((text) => Date.now() - text.timestamp < 1500)
      )
    }, 100)
    return () => clearInterval(timer)
  }, [])

  // Clean up old celebrations
  useEffect(() => {
    const timer = setInterval(() => {
      setCelebrations((prev) =>
        prev.filter((c) => Date.now() - c.timestamp < 3000)
      )
    }, 100)
    return () => clearInterval(timer)
  }, [])

  const handleNicheSelect = (niche: Niche) => {
    setSelectedNiche(niche)
    setStep('board')
  }

  const handleAddEquipment = useCallback(
    (equipment: EquipmentCatalog, status: 'owned' | 'planned' | 'dream') => {
      const existingIndex = userEquipment.findIndex((e) => e.equipment_id === equipment.id)

      let newEquipment: UserEquipment[]
      if (existingIndex >= 0) {
        // Update existing
        newEquipment = [...userEquipment]
        newEquipment[existingIndex] = {
          ...newEquipment[existingIndex],
          status,
        }
      } else {
        // Add new
        const newItem: UserEquipment = {
          id: `user-eq-${Date.now()}-${Math.random()}`,
          user_id: 'current-user',
          equipment_id: equipment.id,
          custom_name: null,
          category: equipment.category,
          status,
          quantity: 1,
          acquired_at: status === 'owned' ? new Date().toISOString() : null,
          notes: null,
        }
        newEquipment = [...userEquipment, newItem]
      }

      setUserEquipment(newEquipment)

      // Game mechanics
      if (gameState && selectedNiche) {
        const { newState, pointsEarned, events: gameEvents } = processAction(
          gameState,
          'add',
          equipment.id,
          selectedNiche.id,
          newEquipment,
          mockEquipmentCatalog,
          window.innerWidth / 2,
          window.innerHeight / 2
        )
        setGameState(newState)

        // Floating text
        if (pointsEarned > 0) {
          const floatingText: FloatingText = {
            id: `ft-${Date.now()}`,
            text: `+${pointsEarned}`,
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            color: newState.combo > 1 ? '#fbbf24' : '#4ade80',
            timestamp: Date.now(),
          }
          setFloatingTexts((prev) => [...prev, floatingText])
        }

        // Celebrations from events
        for (const evt of gameEvents) {
          if (evt.type === 'combo_milestone' || evt.type === 'streak_milestone' || evt.type === 'category_completed') {
            const celebData = newState.celebrations.find((c: Celebration) => c.id === evt.celebrationId)
            if (celebData) {
              setCelebrations((prev) => [...prev, celebData])
            }
          }
        }

        // Particles
        if (boardContainerRef.current) {
          const rect = boardContainerRef.current.getBoundingClientRect()
          const newParticles = generateParticles(
            rect.width / 2,
            rect.height / 2,
            8
          )
          newParticles.forEach((p: { id: string; tx: number; ty: number; delay: number }) => {
            const div = document.createElement('div')
            div.style.cssText = `
              position: fixed;
              left: ${rect.left + rect.width / 2}px;
              top: ${rect.top + rect.height / 2}px;
              width: 8px;
              height: 8px;
              background: ${['#FF1744', '#FFD700', '#00E5FF', '#76FF03'][p.delay % 4]};
              border-radius: 50%;
              pointer-events: none;
              --tx: ${p.tx}px;
              --ty: ${p.ty}px;
              animation: particle-burst 0.8s ease-out forwards;
            `
            document.body.appendChild(div)
            setTimeout(() => div.remove(), 800)
          })
        }
      }

      setExpandedEquipmentId(null)
    },
    [userEquipment, gameState]
  )

  const handleRemoveEquipment = (equipmentId: string) => {
    setUserEquipment((prev) =>
      prev.filter((e) => e.equipment_id !== equipmentId)
    )
  }

  const handleChangeQuantity = (equipmentId: string, delta: number) => {
    setUserEquipment((prev) =>
      prev.map((e) => {
        if (e.equipment_id === equipmentId) {
          const newQty = Math.max(1, e.quantity + delta)
          return { ...e, quantity: newQty }
        }
        return e
      })
    )
  }

  const filteredEquipment = mockEquipmentCatalog.filter((eq) => {
    const query = searchQuery.toLowerCase()
    return (
      eq.name.toLowerCase().includes(query) ||
      eq.brand.toLowerCase().includes(query) ||
      eq.category.toLowerCase().includes(query)
    )
  })

  const userEquipmentMap = new Set(userEquipment.map((e) => e.equipment_id))

  const ownedItems = userEquipment.filter((e) => e.status === 'owned')
  const plannedItems = userEquipment.filter((e) => e.status === 'planned')
  const dreamItems = userEquipment.filter((e) => e.status === 'dream')

  const totalValue =
    ownedItems.reduce((sum, e) => {
      const eq = mockEquipmentCatalog.find((eq) => eq.id === e.equipment_id)
      const avg = eq ? ((eq.price_min || 0) + (eq.price_max || 0)) / 2 : 0
      return sum + avg * e.quantity
    }, 0) +
    plannedItems.reduce((sum, e) => {
      const eq = mockEquipmentCatalog.find((eq) => eq.id === e.equipment_id)
      const avg = eq ? ((eq.price_min || 0) + (eq.price_max || 0)) / 2 : 0
      return sum + avg * e.quantity
    }, 0)

  const handleShare = () => {
    const text = `Я собираю комплект оборудования для ${selectedNiche?.name}! 📸 Уже добавил ${userEquipment.length} позиций. KitWise помогает выбирать правильное оборудование.`
    if (navigator.share) {
      navigator.share({
        title: 'Мой борд в KitWise',
        text,
      })
    } else {
      navigator.clipboard.writeText(text)
      alert('Текст скопирован в буфер обмена')
    }
  }

  if (step === 'niche') {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <style>{ANIMATION_STYLES}</style>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Выберите вашу специализацию
            </h1>
            <p className="text-slate-400 text-lg">
              Мы подберём правильное оборудование именно для вас
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockNiches.map((niche) => (
              <button
                key={niche.id}
                onClick={() => handleNicheSelect(niche)}
                className="group relative overflow-hidden rounded-lg bg-slate-900 p-6 text-left transition-all hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
                style={{ animation: `card-entry 0.4s ease-out both` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-transparent opacity-0 group-hover:opacity-30 transition-opacity" />
                <div className="relative z-10">
                  <div className="text-5xl mb-3">{niche.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {niche.name}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {niche.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Board builder step
  return (
    <div className="min-h-screen bg-slate-950 p-6" ref={boardContainerRef}>
      <style>{ANIMATION_STYLES}</style>

      {/* Header with Score HUD */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between bg-slate-900/80 backdrop-blur border border-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setStep('niche')
                setSelectedNiche(null)
                setUserEquipment([])
                setGameState(initializeGameState())
              }}
              className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-sm transition"
            >
              ← Назад
            </button>
            <div className="text-left">
              <div className="text-slate-400 text-sm">Специализация</div>
              <div className="text-xl font-bold text-white">
                {selectedNiche?.name || 'Загрузка...'}
              </div>
            </div>
          </div>

          {gameState && (
            <div className="flex items-center gap-6">
              {gameState.combo > 1 && (
                <div
                  className="text-center px-3 py-1 bg-amber-500/20 border border-amber-500/50 rounded"
                  style={{ animation: 'combo-pulse 0.6s ease-in-out' }}
                >
                  <div className="text-amber-300 font-bold text-lg">
                    {gameState.combo}x
                  </div>
                  <div className="text-amber-300 text-xs">Combo</div>
                </div>
              )}

              <div className="text-right">
                <div className="text-slate-400 text-sm">Очки</div>
                <div className="text-3xl font-bold text-green-400">
                  {formatScore(gameState.score)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content: Catalog + Board */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Equipment Catalog */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <input
              type="text"
              placeholder="🔍 Поиск по названию, бренду или категории..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
            {filteredEquipment.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                Ничего не найдено по запросу "{searchQuery}"
              </div>
            ) : (
              filteredEquipment.map((equipment) => {
                const isAdded = userEquipmentMap.has(equipment.id)
                const userEq = userEquipment.find(
                  (e) => e.equipment_id === equipment.id
                )
                const icon =
                  categoryIcons[equipment.category] || '📦'

                return (
                  <div
                    key={equipment.id}
                    className={`bg-slate-900 border rounded-lg p-4 transition-all ${
                      expandedEquipmentId === equipment.id
                        ? 'border-blue-500/50 ring-1 ring-blue-500/30'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="text-3xl flex-shrink-0">{icon}</div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white truncate">
                            {equipment.name}
                          </h4>
                          <p className="text-sm text-slate-400">
                            {equipment.brand}
                          </p>
                          <div className="flex gap-2 items-center mt-2 text-xs">
                            <span className="px-2 py-1 bg-slate-800 rounded text-slate-300">
                              {equipment.category}
                            </span>
                            <span className="text-slate-500">
                              {formatPrice(equipment.price_min, equipment.price_max)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {isAdded && userEq ? (
                        <div className="flex-shrink-0">
                          <div
                            className={`px-3 py-1.5 rounded text-xs font-semibold ${
                              getStatusBadge(userEq.status).color
                            }`}
                          >
                            {getStatusBadge(userEq.status).emoji}{' '}
                            {getStatusBadge(userEq.status).label}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {/* Expanded status selector */}
                    {expandedEquipmentId === equipment.id && (
                      <div
                        className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-3 gap-2 animate-in fade-in duration-200"
                      >
                        {(
                          [
                            {
                              status: 'owned' as const,
                              emoji: '✓',
                              label: 'Есть',
                            },
                            {
                              status: 'planned' as const,
                              emoji: '📋',
                              label: 'Планирую',
                            },
                            {
                              status: 'dream' as const,
                              emoji: '❤️',
                              label: 'Хочу',
                            },
                          ] as const
                        ).map((option) => (
                          <button
                            key={option.status}
                            onClick={() => {
                              handleAddEquipment(equipment, option.status)
                              setExpandedEquipmentId(null)
                            }}
                            className={`px-3 py-2.5 rounded text-sm font-medium transition-all ${
                              userEq?.status === option.status
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {option.emoji} {option.label}
                          </button>
                        ))}

                        {isAdded && (
                          <button
                            onClick={() => {
                              handleRemoveEquipment(equipment.id)
                              setExpandedEquipmentId(null)
                            }}
                            className="col-span-3 px-3 py-2 rounded text-sm font-medium bg-rose-900/30 text-rose-400 hover:bg-rose-900/50 transition-all border border-rose-800/50"
                          >
                            ✕ Удалить
                          </button>
                        )}
                      </div>
                    )}

                    {/* Click to expand/collapse */}
                    {!isAdded && (
                      <button
                        onClick={() =>
                          setExpandedEquipmentId(
                            expandedEquipmentId === equipment.id
                              ? null
                              : equipment.id
                          )
                        }
                        className="mt-3 w-full px-3 py-2 rounded text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 transition-all active:scale-95"
                      >
                        + Добавить в борд
                      </button>
                    )}

                    {isAdded && expandedEquipmentId !== equipment.id && (
                      <button
                        onClick={() => setExpandedEquipmentId(equipment.id)}
                        className="mt-3 w-full px-3 py-2 rounded text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
                      >
                        Изменить статус
                      </button>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right: My Board Summary */}
        <div className="lg:col-span-1">
          <div
            className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden sticky top-6"
            style={{ animation: `slide-in-right 0.4s ease-out` }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 border-b border-blue-500/30 p-4">
              <h2 className="text-xl font-bold text-white mb-1">Мой борд</h2>
              <p className="text-sm text-slate-400">
                {userEquipment.length} позиций
              </p>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
              {userEquipment.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <div className="text-4xl mb-2">📋</div>
                  <p>Начните добавлять оборудование</p>
                </div>
              ) : (
                <>
                  {/* Owned Items */}
                  {ownedItems.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-emerald-400 mb-3">
                        ✓ ЕСТЬ ({ownedItems.length})
                      </h3>
                      <div className="space-y-2">
                        {ownedItems.map((item) => {
                          const eq = mockEquipmentCatalog.find(
                            (e) => e.id === item.equipment_id
                          )
                          return (
                            <div
                              key={item.id}
                              className="bg-slate-800/50 border border-emerald-500/20 rounded p-3"
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-white truncate">
                                    {eq?.name || 'Unknown'}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    {eq?.brand}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleRemoveEquipment(item.equipment_id)}
                                  className="flex-shrink-0 text-slate-500 hover:text-rose-400 transition text-lg"
                                  title="Удалить"
                                >
                                  ✕
                                </button>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 bg-slate-900/50 rounded px-2 py-1">
                                  <button
                                    onClick={() =>
                                      handleChangeQuantity(item.equipment_id, -1)
                                    }
                                    className="text-slate-400 hover:text-white w-5 h-5 flex items-center justify-center"
                                  >
                                    −
                                  </button>
                                  <span className="text-white font-semibold w-4 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleChangeQuantity(item.equipment_id, 1)
                                    }
                                    className="text-slate-400 hover:text-white w-5 h-5 flex items-center justify-center"
                                  >
                                    +
                                  </button>
                                </div>
                                <span className="text-xs text-slate-500">
                                  {eq ? `$${Math.round(((eq.price_min || 0) + (eq.price_max || 0)) / 2 * item.quantity)}` : '—'}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Planned Items */}
                  {plannedItems.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-blue-400 mb-3">
                        📋 ПЛАНИРУЮ ({plannedItems.length})
                      </h3>
                      <div className="space-y-2">
                        {plannedItems.map((item) => {
                          const eq = mockEquipmentCatalog.find(
                            (e) => e.id === item.equipment_id
                          )
                          return (
                            <div
                              key={item.id}
                              className="bg-slate-800/50 border border-blue-500/20 rounded p-3"
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-white truncate">
                                    {eq?.name || 'Unknown'}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    {eq?.brand}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleRemoveEquipment(item.equipment_id)}
                                  className="flex-shrink-0 text-slate-500 hover:text-rose-400 transition text-lg"
                                  title="Удалить"
                                >
                                  ✕
                                </button>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 bg-slate-900/50 rounded px-2 py-1">
                                  <button
                                    onClick={() =>
                                      handleChangeQuantity(item.equipment_id, -1)
                                    }
                                    className="text-slate-400 hover:text-white w-5 h-5 flex items-center justify-center"
                                  >
                                    −
                                  </button>
                                  <span className="text-white font-semibold w-4 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleChangeQuantity(item.equipment_id, 1)
                                    }
                                    className="text-slate-400 hover:text-white w-5 h-5 flex items-center justify-center"
                                  >
                                    +
                                  </button>
                                </div>
                                <span className="text-xs text-slate-500">
                                  {eq ? `$${Math.round(((eq.price_min || 0) + (eq.price_max || 0)) / 2 * item.quantity)}` : '—'}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Dream Items */}
                  {dreamItems.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-rose-400 mb-3">
                        ❤️ ХОЧУ ({dreamItems.length})
                      </h3>
                      <div className="space-y-2">
                        {dreamItems.map((item) => {
                          const eq = mockEquipmentCatalog.find(
                            (e) => e.id === item.equipment_id
                          )
                          return (
                            <div
                              key={item.id}
                              className="bg-slate-800/50 border border-rose-500/20 rounded p-3"
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-white truncate">
                                    {eq?.name || 'Unknown'}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    {eq?.brand}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleRemoveEquipment(item.equipment_id)}
                                  className="flex-shrink-0 text-slate-500 hover:text-rose-400 transition text-lg"
                                  title="Удалить"
                                >
                                  ✕
                                </button>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 bg-slate-900/50 rounded px-2 py-1">
                                  <button
                                    onClick={() =>
                                      handleChangeQuantity(item.equipment_id, -1)
                                    }
                                    className="text-slate-400 hover:text-white w-5 h-5 flex items-center justify-center"
                                  >
                                    −
                                  </button>
                                  <span className="text-white font-semibold w-4 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleChangeQuantity(item.equipment_id, 1)
                                    }
                                    className="text-slate-400 hover:text-white w-5 h-5 flex items-center justify-center"
                                  >
                                    +
                                  </button>
                                </div>
                                <span className="text-xs text-slate-500">
                                  {eq ? `$${Math.round(((eq.price_min || 0) + (eq.price_max || 0)) / 2 * item.quantity)}` : '—'}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Stats & Summary */}
              {userEquipment.length > 0 && (
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Предметов:</span>
                    <span className="font-semibold text-white">
                      {userEquipment.reduce((sum, e) => sum + e.quantity, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Примерная стоимость:</span>
                    <span className="font-semibold text-green-400">
                      ${Math.round(totalValue)}
                    </span>
                  </div>

                  <button
                    onClick={handleShare}
                    className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>📤 Поделиться</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating texts */}
      {floatingTexts.map((text) => (
        <div
          key={text.id}
          style={{
            position: 'fixed',
            left: `${text.x}px`,
            top: `${text.y}px`,
            pointerEvents: 'none',
            animation: 'float-up 1.5s ease-out forwards',
            color: text.color,
            fontWeight: 'bold',
            fontSize: '24px',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
          }}
        >
          {text.text}
        </div>
      ))}

      {/* Celebration alerts */}
      {celebrations.map((celebration) => (
        <div
          key={celebration.id}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-600 to-amber-500 text-white px-6 py-3 rounded-lg shadow-lg font-semibold z-50"
          style={{ animation: 'celebrate-in 0.4s ease-out' }}
        >
          {celebration.icon} {celebration.title}
        </div>
      ))}
    </div>
  )
}
