'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Niche, EquipmentCatalog, UserEquipment } from '@/lib/types'
import { mockNiches, mockEquipmentCatalog } from '@/lib/mockData'
import {
  initializeGameState,
  processAction,
  calculateSetupCompletion,
  getTierEmoji,
  formatScore,
  getEquipmentTierInNiche,
  getEquipmentByTier,
  GameState,
  Celebration,
  FloatingText,
  getParticleBurstKeyframes,
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
      transform: scale(1.2);
    }
  }

  @keyframes glow-add {
    0% {
      box-shadow: 0 0 20px rgba(74, 222, 128, 0.8);
    }
    100% {
      box-shadow: 0 0 0 transparent;
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

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @keyframes score-pop {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.3);
    }
  }

  @keyframes confetti {
    0% {
      opacity: 1;
      transform: translateY(0) rotate(0deg);
    }
    100% {
      opacity: 0;
      transform: translateY(200px) rotate(720deg);
    }
  }

  @keyframes niche-card-enter {
    0% {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes niche-fade-out {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(0.8);
    }
  }
`

interface Particle {
  id: string
  tx: number
  ty: number
  delay: number
  timestamp: number
  cx: number
  cy: number
}

interface CelebrationPopup extends Celebration {
  showAt: number
}

// =====================================================
// EQUIPMENT CARD COMPONENT
// =====================================================
function EquipmentCard({
  equipment,
  tier,
  isAdded,
  onClick,
  isRecentlyAdded,
}: {
  equipment: EquipmentCatalog
  tier: string
  isAdded: boolean
  onClick: (e: React.MouseEvent) => void
  isRecentlyAdded: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={isAdded}
      className={`group relative p-3 rounded-lg border transition-all duration-300 ${
        isAdded
          ? 'border-green-500/50 bg-green-500/10 cursor-default'
          : 'border-slate-700 bg-slate-800/50 hover:border-cyan-500/50 hover:bg-slate-800/80 cursor-pointer'
      } ${isRecentlyAdded ? 'animate-pulse' : ''}`}
      style={
        isRecentlyAdded
          ? {
              animation: 'glow-add 1s ease-out forwards',
            }
          : undefined
      }
    >
      {/* Checkmark overlay for added items */}
      {isAdded && (
        <div className="absolute top-1 right-1">
          <span className="text-green-400 text-lg">✓</span>
        </div>
      )}

      <div className="space-y-2">
        {/* Icon + Category */}
        <div className="flex items-start justify-between">
          <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-sm">
            📦
          </div>
          <span className="text-xs font-bold text-purple-400">{getTierEmoji(tier)}</span>
        </div>

        {/* Name & Brand */}
        <div className="text-left">
          <p className="text-xs font-bold text-slate-100 truncate">{equipment.name}</p>
          <p className="text-xs text-slate-400 truncate">{equipment.brand}</p>
        </div>

        {/* Tier + Points */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 capitalize">{equipment.category}</span>
        </div>
      </div>
    </button>
  )
}

// =====================================================
// NICHE SELECTION STEP
// =====================================================
function NicheSelectionStep({
  onSelectNiche,
}: {
  onSelectNiche: (niche: Niche) => void
}) {
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleSelectNiche = (niche: Niche) => {
    setSelectedNiche(niche)
    setIsTransitioning(true)
    setTimeout(() => {
      onSelectNiche(niche)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 px-4 py-12">
      <style>{ANIMATION_STYLES}</style>

      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
            Выберите направление
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Создайте идеальный сетап для вашей ниши и достигните максимального уровня с помощью игровых механик
          </p>
        </div>

        {/* Niche Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {mockNiches.map((niche, idx) => (
            <div
              key={niche.id}
              style={{
                animation:
                  selectedNiche && selectedNiche.id !== niche.id
                    ? `niche-fade-out 0.5s ease-out forwards`
                    : selectedNiche && selectedNiche.id === niche.id
                      ? `none`
                      : `niche-card-enter 0.4s ease-out ${idx * 30}ms forwards`,
                opacity: 0,
              }}
            >
              <button
                onClick={() => handleSelectNiche(niche)}
                disabled={isTransitioning && selectedNiche?.id !== niche.id}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedNiche?.id === niche.id
                    ? 'border-cyan-400 bg-cyan-400/20 scale-105'
                    : 'border-slate-700 bg-slate-800/50 hover:border-cyan-500 hover:bg-slate-800'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="text-4xl mb-2">{niche.icon}</div>
                <h3 className="font-bold text-sm text-slate-100 leading-tight">
                  {niche.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {niche.description}
                </p>
              </button>
            </div>
          ))}
        </div>

        {/* CTA */}
        {selectedNiche && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-cyan-400 animate-pulse">
              <span className="text-lg">⚡</span>
              <span className="text-sm font-semibold">
                Загружаем борд для {selectedNiche.name}...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// =====================================================
// SCORE HUD (Sticky Top Bar)
// =====================================================
function ScoreHUD({
  gameState,
  setupCompletion,
}: {
  gameState: GameState
  setupCompletion: number
}) {
  return (
    <div
      className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/50 px-4 py-4"
      style={{
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Score Counter */}
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-slate-400">Очки:</span>
          <span
            className="text-3xl font-black text-green-400"
            style={{
              animation: gameState.combo > 1 ? 'score-pop 0.3s ease-out' : 'none',
            }}
          >
            {formatScore(gameState.score)}
          </span>
        </div>

        {/* Combo Multiplier Badge */}
        {gameState.combo > 1 && (
          <div
            className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-bold"
            style={{
              animation: 'combo-pulse 0.4s ease-out',
            }}
          >
            {gameState.multiplier.toFixed(1)}x Комбо
          </div>
        )}

        {/* Streak Indicator */}
        {gameState.streak > 2 && (
          <div className="flex items-center gap-1">
            <span className="text-xl">🔥</span>
            <span className="text-sm font-bold text-orange-400">{gameState.streak}</span>
          </div>
        )}

        {/* Completion Bar */}
        <div className="flex-1 max-w-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400">Сетап</span>
            <span className="text-xs font-bold text-cyan-400">{setupCompletion}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 transition-all duration-300"
              style={{
                width: `${setupCompletion}%`,
                backgroundSize: '200% 100%',
                animation: setupCompletion > 0 ? 'shimmer 3s infinite' : 'none',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// =====================================================
// FLOATING TEXT & PARTICLES
// =====================================================
function FloatingTexts({ floatingTexts }: { floatingTexts: FloatingText[] }) {
  return (
    <>
      {floatingTexts.map((ft) => {
        const elapsed = Date.now() - ft.timestamp
        const progress = Math.min(elapsed / 2000, 1)
        const opacity = Math.max(0, 1 - progress)
        const translateY = -60 * progress

        return (
          <div
            key={ft.id}
            style={{
              position: 'fixed',
              left: `${ft.x}px`,
              top: `${ft.y + translateY}px`,
              opacity,
              color: ft.color,
              fontSize: '24px',
              fontWeight: 'bold',
              pointerEvents: 'none',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              transform: `translateX(-50%)`,
              zIndex: 50,
            }}
          >
            {ft.text}
          </div>
        )
      })}
    </>
  )
}

function Particles({ particles }: { particles: Particle[] }) {
  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'fixed',
            left: `${p.cx}px`,
            top: `${p.cy}px`,
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: ['#FF1744', '#FFD700', '#00E5FF', '#76FF03'][
              p.delay % 4
            ],
            pointerEvents: 'none',
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            animation: `particle-burst 0.8s ease-out forwards`,
            animationDelay: `${p.delay}ms`,
            zIndex: 40,
          } as React.CSSProperties}
        />
      ))}
    </>
  )
}

// =====================================================
// CELEBRATION OVERLAY
// =====================================================
function CelebrationOverlay({
  celebration,
}: {
  celebration: CelebrationPopup | null
}) {
  if (!celebration) return null

  const elapsed = Date.now() - celebration.showAt
  const opacity = elapsed < 4500 ? 1 : Math.max(0, 1 - (elapsed - 4500) / 500)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 60,
        opacity,
        transition: 'opacity 0.3s ease-out',
      }}
    >
      <div
        style={{
          padding: '40px 60px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(0,229,255,0.1) 0%, rgba(168,85,247,0.1) 100%)',
          border: '2px solid rgba(0,229,255,0.5)',
          backdrop: 'blur(12px)',
          textAlign: 'center',
          animation: 'celebrate-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        }}
      >
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>
          {celebration.icon || '🎉'}
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '8px' }}>
          {celebration.title}
        </h2>
        <p style={{ fontSize: '14px', color: '#94a3b8' }}>
          {celebration.description}
        </p>
      </div>
    </div>
  )
}

// =====================================================
// EQUIPMENT BOARD BUILDER (Step 2)
// =====================================================
function EquipmentBoardBuilder({
  selectedNiche,
  userEquipment,
  gameState,
  setupCompletion,
  floatingTexts,
  particles,
  celebration,
  onBack,
  onAddEquipment,
}: {
  selectedNiche: Niche
  userEquipment: UserEquipment[]
  gameState: GameState
  setupCompletion: number
  floatingTexts: FloatingText[]
  particles: Particle[]
  celebration: CelebrationPopup | null
  onBack: () => void
  onAddEquipment: (equipment: EquipmentCatalog, event: React.MouseEvent) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSection, setActiveSection] = useState<'recommended' | 'all'>('recommended')

  // Get equipment by tier for this niche
  const mustHaveEquip = getEquipmentByTier(selectedNiche.id, 'must_have')
  const proLevelEquip = getEquipmentByTier(selectedNiche.id, 'pro_level')
  const optimizationEquip = getEquipmentByTier(selectedNiche.id, 'optimization')

  // Filter by search
  const filterEquipment = (items: EquipmentCatalog[]) => {
    if (!searchQuery.trim()) return items
    const q = searchQuery.toLowerCase()
    return items.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.brand.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    )
  }

  const filteredMustHave = filterEquipment(mustHaveEquip)
  const filteredProLevel = filterEquipment(proLevelEquip)
  const filteredOptimization = filterEquipment(optimizationEquip)

  // All catalog equipment
  const allEquipment = activeSection === 'all' ? mockEquipmentCatalog : []
  const filteredAll = filterEquipment(allEquipment)

  return (
    <div className="min-h-screen bg-slate-950 pb-32">
      <style>{ANIMATION_STYLES}</style>

      <ScoreHUD gameState={gameState} setupCompletion={setupCompletion} />

      {/* Top Section */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition-colors"
          >
            ← Назад
          </button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-100">
              {selectedNiche.icon} {selectedNiche.name}
            </h1>
            <p className="text-sm text-slate-400 mt-1">{selectedNiche.description}</p>
          </div>

          <div className="w-16" />
        </div>

        {/* Search & Filter */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Поиск оборудования..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />

          {/* Section Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveSection('recommended')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === 'recommended'
                  ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-300'
                  : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-300'
              }`}
            >
              ⭐ Рекомендуемые
            </button>
            <button
              onClick={() => setActiveSection('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === 'all'
                  ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-300'
                  : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-300'
              }`}
            >
              📦 Весь каталог
            </button>
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="max-w-6xl mx-auto px-4 space-y-10">
        {activeSection === 'recommended' ? (
          <>
            {/* Must Have Section */}
            {filteredMustHave.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-100 mb-4">
                  ⭐ Необходимо ({filteredMustHave.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredMustHave.map((equipment) => (
                    <EquipmentCard
                      key={equipment.id}
                      equipment={equipment}
                      tier="must_have"
                      isAdded={userEquipment.some((ue) => ue.equipment_id === equipment.id)}
                      onClick={(e) => onAddEquipment(equipment, e)}
                      isRecentlyAdded={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Pro Level Section */}
            {filteredProLevel.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-100 mb-4">
                  💎 Продвинутый ({filteredProLevel.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredProLevel.map((equipment) => (
                    <EquipmentCard
                      key={equipment.id}
                      equipment={equipment}
                      tier="pro_level"
                      isAdded={userEquipment.some((ue) => ue.equipment_id === equipment.id)}
                      onClick={(e) => onAddEquipment(equipment, e)}
                      isRecentlyAdded={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Optimization Section */}
            {filteredOptimization.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-100 mb-4">
                  ✨ Оптимизация ({filteredOptimization.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredOptimization.map((equipment) => (
                    <EquipmentCard
                      key={equipment.id}
                      equipment={equipment}
                      tier="optimization"
                      isAdded={userEquipment.some((ue) => ue.equipment_id === equipment.id)}
                      onClick={(e) => onAddEquipment(equipment, e)}
                      isRecentlyAdded={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div>
            <h2 className="text-lg font-bold text-slate-100 mb-4">
              📦 Весь каталог ({filteredAll.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredAll.map((equipment) => {
                const tier = getEquipmentTierInNiche(equipment.id, selectedNiche.id)
                return (
                  <EquipmentCard
                    key={equipment.id}
                    equipment={equipment}
                    tier={tier}
                    isAdded={userEquipment.some((ue) => ue.equipment_id === equipment.id)}
                    onClick={(e) => onAddEquipment(equipment, e)}
                    isRecentlyAdded={false}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Floating Effects */}
      <FloatingTexts floatingTexts={floatingTexts} />
      <Particles particles={particles} />
      <CelebrationOverlay celebration={celebration} />

      {/* Sticky Bottom Board Panel */}
      <div
        className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-slate-900/95 border-t border-slate-800/50 px-4 py-4"
        style={{
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-100">Мой борд</p>
            <p className="text-xs text-slate-400">
              {userEquipment.length} единиц собрано
            </p>
          </div>

          {/* Mini Equipment Icons */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-xs">
            {userEquipment.slice(0, 8).map((ue) => (
              <div
                key={ue.id}
                className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-xs"
                title={mockEquipmentCatalog.find((e) => e.id === ue.equipment_id)?.name}
              >
                📦
              </div>
            ))}
            {userEquipment.length > 8 && (
              <div className="w-8 h-8 rounded bg-cyan-500/20 border border-cyan-500 flex items-center justify-center text-xs font-bold text-cyan-300 flex-shrink-0">
                +{userEquipment.length - 8}
              </div>
            )}
          </div>

          {/* Share Button */}
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
            Поделиться
          </button>
        </div>
      </div>
    </div>
  )
}

// =====================================================
// MAIN PAGE COMPONENT
// =====================================================
export default function BoardPage() {
  const [step, setStep] = useState<'niche' | 'board'>('niche')
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null)
  const [userEquipment, setUserEquipment] = useState<UserEquipment[]>([])
  const [gameState, setGameState] = useState<GameState>(initializeGameState())
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([])
  const [particles, setParticles] = useState<Particle[]>([])
  const [celebration, setCelebration] = useState<CelebrationPopup | null>(null)
  const [recentlyAdded, setRecentlyAdded] = useState<Set<string>>(new Set())
  const setupCompletion = selectedNiche
    ? calculateSetupCompletion(userEquipment, selectedNiche.id, mockEquipmentCatalog)
    : 0

  const animationFrameRef = useRef<number>()

  // Auto-update floating texts and cleanup old particles
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setFloatingTexts((prev) => prev.filter((ft) => now - ft.timestamp < 2000))
      setParticles((prev) => prev.filter((p) => now - p.timestamp < 800))
      setCelebration((prev) => {
        if (prev && now - prev.showAt > 5000) {
          return null
        }
        return prev
      })
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const handleSelectNiche = (niche: Niche) => {
    setSelectedNiche(niche)
    setStep('board')
    setGameState(initializeGameState())
    setUserEquipment([])
    setFloatingTexts([])
    setParticles([])
    setCelebration(null)
  }

  const handleAddEquipment = useCallback(
    (equipment: EquipmentCatalog, event: React.MouseEvent) => {
      if (!selectedNiche) return

      // Check if already added
      const alreadyAdded = userEquipment.some((e) => e.equipment_id === equipment.id)
      if (alreadyAdded) return

      // Get click position for floating text and particles
      const rect = (event.target as HTMLElement).getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2

      // Create new user equipment item
      const newUserEquip: UserEquipment = {
        id: `ue-${Date.now()}-${Math.random()}`,
        user_id: 'demo',
        equipment_id: equipment.id,
        custom_name: null,
        category: equipment.category,
        status: 'owned',
        quantity: 1,
        acquired_at: new Date().toISOString(),
        notes: null,
      }

      const updatedUserEquipment = [...userEquipment, newUserEquip]
      setUserEquipment(updatedUserEquipment)

      // Process game action
      const { newState, pointsEarned, events } = processAction(
        gameState,
        'add',
        equipment.id,
        selectedNiche.id,
        updatedUserEquipment,
        mockEquipmentCatalog,
        x,
        y
      )

      setGameState(newState)

      // Add floating text
      const floatId = `float-${Date.now()}`
      setFloatingTexts((prev) => [
        ...prev,
        {
          id: floatId,
          text: `+${pointsEarned}`,
          x,
          y,
          color: newState.multiplier > 1 ? '#FFD700' : '#4AFF00',
          timestamp: Date.now(),
        },
      ])

      // Generate particles at click position
      const newParticles = generateParticles(x, y, 8)
      const particlesWithTimestamp = newParticles.map((p) => ({
        ...p,
        timestamp: Date.now(),
        cx: x,
        cy: y,
      }))
      setParticles((prev) => [...prev, ...particlesWithTimestamp])

      // Mark as recently added (for glow effect)
      setRecentlyAdded((prev) => new Set([...prev, equipment.id]))
      setTimeout(() => {
        setRecentlyAdded((prev) => {
          const next = new Set(prev)
          next.delete(equipment.id)
          return next
        })
      }, 1000)

      // Show celebration if milestone hit
      for (const evt of events) {
        if (
          evt.type === 'combo_milestone' ||
          evt.type === 'streak_milestone' ||
          evt.type === 'category_completed'
        ) {
          const celebData = newState.celebrations.find((c) => c.id === evt.celebrationId)
          if (celebData) {
            setCelebration({
              ...celebData,
              showAt: Date.now(),
            })
          }
        }
      }

      // Save to localStorage
      try {
        localStorage.setItem(
          'kitwise-onboarding',
          JSON.stringify({
            niches: [selectedNiche],
            equipment: updatedUserEquipment,
            score: newState.score,
            timestamp: Date.now(),
          })
        )
      } catch (e) {
        // Ignore storage errors
      }
    },
    [selectedNiche, gameState, userEquipment]
  )

  const handleBackToNicheSelection = () => {
    setStep('niche')
    setSelectedNiche(null)
    setUserEquipment([])
    setGameState(initializeGameState())
    setFloatingTexts([])
    setParticles([])
    setCelebration(null)
    setRecentlyAdded(new Set())
  }

  if (step === 'niche') {
    return <NicheSelectionStep onSelectNiche={handleSelectNiche} />
  }

  if (!selectedNiche) return null

  return (
    <EquipmentBoardBuilder
      selectedNiche={selectedNiche}
      userEquipment={userEquipment}
      gameState={gameState}
      setupCompletion={setupCompletion}
      floatingTexts={floatingTexts}
      particles={particles}
      celebration={celebration}
      onBack={handleBackToNicheSelection}
      onAddEquipment={handleAddEquipment}
    />
  )
}
