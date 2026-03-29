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
// LEVEL SYSTEM
// =====================================================
const LEVELS = [
  { id: 1, title: 'Новичок', icon: '📷', minXP: 0, maxXP: 100, color: 'gray' },
  { id: 2, title: 'Любитель', icon: '📸', minXP: 100, maxXP: 300, color: 'emerald' },
  { id: 3, title: 'Энтузиаст', icon: '🎯', minXP: 300, maxXP: 700, color: 'blue' },
  { id: 4, title: 'Профессионал', icon: '⭐', minXP: 700, maxXP: 1500, color: 'violet' },
  { id: 5, title: 'Мастер', icon: '👑', minXP: 1500, maxXP: 99999, color: 'amber' },
]

const getLevelForXP = (xp: number): (typeof LEVELS)[0] => {
  return LEVELS.find(l => xp >= l.minXP && xp < l.maxXP) || LEVELS[LEVELS.length - 1]
}

const getXPProgress = (xp: number): { current: number; max: number; percent: number } => {
  const level = getLevelForXP(xp)
  const current = xp - level.minXP
  const max = level.maxXP - level.minXP
  return { current, max, percent: (current / max) * 100 }
}

// =====================================================
// QUESTS SYSTEM
// =====================================================
const QUESTS = [
  {
    id: 'q1',
    title: 'Первое оборудование',
    description: 'Добавь первый предмет в борд',
    icon: '📦',
    check: (equipment: UserEquipment[], niche: string) => equipment.length >= 1,
    xp: 10,
    completed: false,
  },
  {
    id: 'q2',
    title: 'Основы собраны',
    description: 'Добавь 5 предметов оборудования',
    icon: '🏗️',
    check: (equipment: UserEquipment[], niche: string) => equipment.length >= 5,
    xp: 25,
    completed: false,
  },
  {
    id: 'q3',
    title: 'Полный комплект',
    description: 'Добавь 10 предметов оборудования',
    icon: '✅',
    check: (equipment: UserEquipment[], niche: string) => equipment.length >= 10,
    xp: 50,
    completed: false,
  },
  {
    id: 'q4',
    title: 'Серьезный сетап',
    description: 'Достигни 100 дол обслуживания оборудования',
    icon: '💰',
    check: (equipment: UserEquipment[], niche: string) => {
      const total = equipment.reduce((sum, e) => {
        const eq = mockEquipmentCatalog.find(x => x.id === e.equipment_id)
        const avg = eq ? ((eq.price_min || 0) + (eq.price_max || 0)) / 2 : 0
        return sum + avg * e.quantity
      }, 0)
      return total >= 100
    },
    xp: 30,
    completed: false,
  },
  {
    id: 'q5',
    title: 'Стратег планирования',
    description: 'Отметь хотя бы 3 предмета как "Планирую"',
    icon: '📋',
    check: (equipment: UserEquipment[], niche: string) => equipment.filter(e => e.status === 'planned').length >= 3,
    xp: 20,
    completed: false,
  },
  {
    id: 'q6',
    title: 'Мечтатель',
    description: 'Добавь хотя бы 2 предмета в список "Хочу"',
    icon: '❤️',
    check: (equipment: UserEquipment[], niche: string) => equipment.filter(e => e.status === 'dream').length >= 2,
    xp: 15,
    completed: false,
  },
  {
    id: 'q7',
    title: 'Готовность на 50%',
    description: 'Собери 50% необходимого оборудования для ниши',
    icon: '📊',
    check: (equipment: UserEquipment[], niche: string) => {
      const completion = calculateSetupCompletion(equipment, niche, mockEquipmentCatalog)
      return completion >= 50
    },
    xp: 40,
    completed: false,
  },
  {
    id: 'q8',
    title: 'Комбинатор',
    description: 'Достигни combo x5 при добавлении оборудования',
    icon: '⚡',
    check: (equipment: UserEquipment[], niche: string) => false, // Checked via game engine
    xp: 35,
    completed: false,
  },
]

// =====================================================
// ACHIEVEMENTS SYSTEM
// =====================================================
const ACHIEVEMENTS = [
  {
    id: 'a1',
    title: 'Первый шаг',
    description: 'Добавь первый предмет',
    icon: '👶',
    rarity: 'common',
    check: (equipment: UserEquipment[], score: number, combo: number) => equipment.length >= 1,
  },
  {
    id: 'a2',
    title: 'Коллекционер',
    description: 'Собери 15 предметов',
    icon: '🎯',
    rarity: 'rare',
    check: (equipment: UserEquipment[], score: number, combo: number) => equipment.length >= 15,
  },
  {
    id: 'a3',
    title: 'Щедрый бюджет',
    description: 'Комплект стоит более 500 долларов',
    icon: '💸',
    rarity: 'rare',
    check: (equipment: UserEquipment[], score: number, combo: number) => {
      const total = equipment.reduce((sum, e) => {
        const eq = mockEquipmentCatalog.find(x => x.id === e.equipment_id)
        const avg = eq ? ((eq.price_min || 0) + (eq.price_max || 0)) / 2 : 0
        return sum + avg * e.quantity
      }, 0)
      return total >= 500
    },
  },
  {
    id: 'a4',
    title: 'Серьезный сбор',
    description: 'Достигни 250 очков',
    icon: '⭐',
    rarity: 'epic',
    check: (equipment: UserEquipment[], score: number, combo: number) => score >= 250,
  },
  {
    id: 'a5',
    title: 'Комбо мастер',
    description: 'Достигни combo x10',
    icon: '🔥',
    rarity: 'epic',
    check: (equipment: UserEquipment[], score: number, combo: number) => combo >= 10,
  },
  {
    id: 'a6',
    title: 'Сбалансирован',
    description: 'Собери оборудование всех 3 категорий',
    icon: '⚖️',
    rarity: 'rare',
    check: (equipment: UserEquipment[], score: number, combo: number) => {
      const categories = new Set(equipment.map(e => {
        const eq = mockEquipmentCatalog.find(x => x.id === e.equipment_id)
        return eq?.category
      }))
      return categories.size >= 3
    },
  },
  {
    id: 'a7',
    title: 'Легенда',
    description: 'Достигни 500 очков',
    icon: '👑',
    rarity: 'legendary',
    check: (equipment: UserEquipment[], score: number, combo: number) => score >= 500,
  },
  {
    id: 'a8',
    title: 'Быстрая рука',
    description: 'Добавь 5 предметов за 30 секунд',
    icon: '⚡',
    rarity: 'epic',
    check: (equipment: UserEquipment[], score: number, combo: number) => false, // Checked via timer
  },
  {
    id: 'a9',
    title: 'Планировщик',
    description: 'Имеешь более 5 "Планирую" предметов',
    icon: '📋',
    rarity: 'common',
    check: (equipment: UserEquipment[], score: number, combo: number) =>
      equipment.filter(e => e.status === 'planned').length >= 5,
  },
  {
    id: 'a10',
    title: 'Мечтатель года',
    description: 'Имеешь более 5 "Хочу" предметов',
    icon: '💭',
    rarity: 'rare',
    check: (equipment: UserEquipment[], score: number, combo: number) =>
      equipment.filter(e => e.status === 'dream').length >= 5,
  },
  {
    id: 'a11',
    title: 'Владелец',
    description: 'Имеешь 10 собственных предметов',
    icon: '✨',
    rarity: 'rare',
    check: (equipment: UserEquipment[], score: number, combo: number) =>
      equipment.filter(e => e.status === 'owned').length >= 10,
  },
  {
    id: 'a12',
    title: 'Кинодеятель',
    description: 'Добавь оборудование из категорий камеры и свет',
    icon: '🎬',
    rarity: 'epic',
    check: (equipment: UserEquipment[], score: number, combo: number) => {
      const categories = new Set(equipment.map(e => {
        const eq = mockEquipmentCatalog.find(x => x.id === e.equipment_id)
        return eq?.category
      }))
      return categories.has('Камеры') && categories.has('Свет')
    },
  },
]

// =====================================================
// MOTIVATIONAL MESSAGES
// =====================================================
const MOTIVATIONAL_MESSAGES = [
  { text: 'Отличный выбор! 👍', chance: 0.3 },
  { text: 'Сетап растёт! 📈', chance: 0.3 },
  { text: 'Профессиональный подход! 💪', chance: 0.25 },
  { text: 'Так держать! 🔥', chance: 0.3 },
  { text: 'Невероятно быстро! ⚡', chance: 0.2 },
  { text: 'Крутой выбор! 🎯', chance: 0.25 },
]

// =====================================================
// TYPES
// =====================================================
interface Toast {
  id: string
  type: 'achievement' | 'quest' | 'level' | 'motivational' | 'combo'
  text: string
  icon: string
  color: string
  timestamp: number
}

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

  @keyframes toast-slide-in {
    0% {
      opacity: 0;
      transform: translateX(400px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes toast-fade-out {
    0% {
      opacity: 1;
      transform: translateX(0);
    }
    100% {
      opacity: 0;
      transform: translateX(400px);
    }
  }

  @keyframes pulse-scale {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
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

  @keyframes drag-highlight {
    0%, 100% {
      box-shadow: inset 0 0 0 2px rgb(99 102 241 / 0);
    }
    50% {
      box-shadow: inset 0 0 0 2px rgb(99 102 241 / 0.5);
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

  @keyframes level-up {
    0% {
      transform: scale(0.5) translateY(20px);
      opacity: 0;
    }
    50% {
      transform: scale(1.1) translateY(0);
    }
    100% {
      transform: scale(1) translateY(-30px);
      opacity: 0;
    }
  }
`

// =====================================================
// MAIN COMPONENT
// =====================================================
export default function BoardPage() {
  // State
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null)
  const [userEquipment, setUserEquipment] = useState<UserEquipment[]>([])
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [totalXP, setTotalXP] = useState(0)
  const [completedQuests, setCompletedQuests] = useState<string[]>([])
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isOverDropZone, setIsOverDropZone] = useState(false)
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null)
  const boardContainerRef = useRef<HTMLDivElement>(null)
  const dragSourceRef = useRef<EquipmentCatalog | null>(null)

  // =====================================================
  // LOAD/SAVE
  // =====================================================
  useEffect(() => {
    const saved = localStorage.getItem('kitwise-game-state')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setSelectedNiche(data.niche ? mockNiches.find(n => n.id === data.niche.id) || null : null)
        setUserEquipment(data.equipment || [])
        setTotalXP(data.xp || 0)
        setCompletedQuests(data.completedQuests || [])
        setUnlockedAchievements(data.unlockedAchievements || [])
        setGameState(data.gameState || initializeGameState())
      } catch (e) {
        setGameState(initializeGameState())
      }
    } else {
      setGameState(initializeGameState())
    }
  }, [])

  useEffect(() => {
    if (gameState && selectedNiche) {
      localStorage.setItem(
        'kitwise-game-state',
        JSON.stringify({
          niche: selectedNiche,
          equipment: userEquipment,
          xp: totalXP,
          completedQuests,
          unlockedAchievements,
          gameState,
          timestamp: Date.now(),
        })
      )
    }
  }, [userEquipment, gameState, selectedNiche, totalXP, completedQuests, unlockedAchievements])

  // =====================================================
  // QUEST & ACHIEVEMENT CHECKING
  // =====================================================
  const checkQuestsCompletion = useCallback((equipment: UserEquipment[], niche: string, xpGain: number = 0) => {
    const newCompleted: string[] = []
    for (const quest of QUESTS) {
      if (!completedQuests.includes(quest.id) && quest.check(equipment, niche)) {
        newCompleted.push(quest.id)
        addToast({
          type: 'quest',
          text: `Квест выполнен: ${quest.title}!`,
          icon: quest.icon,
          color: 'emerald',
        })
        setTotalXP(prev => prev + quest.xp)
      }
    }
    if (newCompleted.length > 0) {
      setCompletedQuests(prev => [...prev, ...newCompleted])
    }
  }, [completedQuests])

  const checkAchievements = useCallback((equipment: UserEquipment[], score: number, maxCombo: number) => {
    const newUnlocked: string[] = []
    for (const achievement of ACHIEVEMENTS) {
      if (!unlockedAchievements.includes(achievement.id) && achievement.check(equipment, score, maxCombo)) {
        newUnlocked.push(achievement.id)
        addToast({
          type: 'achievement',
          text: `Ачивка разблокирована: ${achievement.title}!`,
          icon: achievement.icon,
          color: achievement.rarity === 'legendary' ? 'amber' : achievement.rarity === 'epic' ? 'violet' : achievement.rarity === 'rare' ? 'blue' : 'gray',
        })
      }
    }
    if (newUnlocked.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newUnlocked])
    }
  }, [unlockedAchievements])

  // =====================================================
  // TOAST MANAGEMENT
  // =====================================================
  const addToast = useCallback((toast: Omit<Toast, 'id' | 'timestamp'>) => {
    const id = `${Date.now()}-${Math.random()}`
    const newToast: Toast = {
      ...toast,
      id,
      timestamp: Date.now(),
    }
    setToasts(prev => [...prev, newToast].slice(-3))

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3500)
  }, [])

  // =====================================================
  // EQUIPMENT HANDLING
  // =====================================================
  const handleAddEquipment = useCallback((equipment: EquipmentCatalog, status: 'owned' | 'planned' | 'dream' = 'owned') => {
    if (!selectedNiche || !gameState) return

    const existingIndex = userEquipment.findIndex(e => e.equipment_id === equipment.id)
    let newEquipment: UserEquipment[]

    if (existingIndex >= 0) {
      newEquipment = [...userEquipment]
      newEquipment[existingIndex] = { ...newEquipment[existingIndex], status }
    } else {
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
    const xpGain = Math.floor(pointsEarned / 5) // Convert points to XP
    setTotalXP(prev => prev + xpGain)

    // Floating text
    if (pointsEarned > 0) {
      const floatingText: FloatingText = {
        id: `ft-${Date.now()}`,
        text: `+${pointsEarned}`,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        color: newState.combo > 1 ? '#FFD700' : '#4AFF00',
        timestamp: Date.now(),
      }
      setFloatingTexts(prev => [...prev, floatingText])
    }

    // Check for milestone toasts
    if (newState.combo > 1 && newState.combo % 2 === 0) {
      addToast({
        type: 'combo',
        text: `Комбо x${newState.combo}!`,
        icon: '⚡',
        color: 'amber',
      })
    }

    // Motivational message
    if (Math.random() < 0.3) {
      const msg = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]
      addToast({
        type: 'motivational',
        text: msg.text,
        icon: '✨',
        color: 'blue',
      })
    }

    // Celebrations from events
    for (const evt of gameEvents) {
      if (evt.type === 'combo_milestone' || evt.type === 'streak_milestone' || evt.type === 'category_completed') {
        const celebData = newState.celebrations.find(c => c.id === evt.celebrationId)
        if (celebData) {
          addToast({
            type: 'combo',
            text: celebData.title,
            icon: celebData.icon || '🎉',
            color: 'amber',
          })
        }
      }
    }

    // Check quests and achievements
    checkQuestsCompletion(newEquipment, selectedNiche.id, xpGain)
    checkAchievements(newEquipment, newState.score, newState.maxCombo)

    // Particles
    if (boardContainerRef.current) {
      const rect = boardContainerRef.current.getBoundingClientRect()
      const particles = generateParticles(rect.width / 2, rect.height / 2, 8)
      particles.forEach((p: { id: string; tx: number; ty: number; delay: number }) => {
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
          animation-delay: ${p.delay}ms;
        `
        document.body.appendChild(div)
        setTimeout(() => div.remove(), 800)
      })
    }

    setSelectedEquipmentId(null)
  }, [userEquipment, gameState, selectedNiche, checkQuestsCompletion, checkAchievements, addToast])

  const handleRemoveEquipment = useCallback((equipmentId: string) => {
    setUserEquipment(prev => prev.filter(e => e.equipment_id !== equipmentId))
  }, [])

  const handleQuantityChange = useCallback((equipmentId: string, delta: number) => {
    setUserEquipment(prev =>
      prev.map(e => {
        if (e.equipment_id === equipmentId) {
          return { ...e, quantity: Math.max(1, e.quantity + delta) }
        }
        return e
      })
    )
  }, [])

  // =====================================================
  // DRAG & DROP
  // =====================================================
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, equipment: EquipmentCatalog) => {
    dragSourceRef.current = equipment
    setIsDragging(true)
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('application/json', JSON.stringify(equipment))
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    dragSourceRef.current = null
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setIsOverDropZone(true)
  }

  const handleDragLeave = () => {
    setIsOverDropZone(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsOverDropZone(false)
    setIsDragging(false)

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      const equipment = mockEquipmentCatalog.find(eq => eq.id === data.id)
      if (equipment) {
        handleAddEquipment(equipment)
      }
    } catch (err) {
      console.error('Drop error:', err)
    }
    dragSourceRef.current = null
  }

  // =====================================================
  // FILTERS & COMPUTED
  // =====================================================
  const filteredEquipment = mockEquipmentCatalog.filter(eq => {
    const query = searchQuery.toLowerCase()
    return (
      eq.name.toLowerCase().includes(query) ||
      eq.brand.toLowerCase().includes(query) ||
      eq.category.toLowerCase().includes(query)
    )
  })

  const completion = selectedNiche
    ? calculateSetupCompletion(userEquipment, selectedNiche.id, mockEquipmentCatalog)
    : 0

  const currentLevel = getLevelForXP(totalXP)
  const xpProgress = getXPProgress(totalXP)

  const ownedItems = userEquipment.filter(e => e.status === 'owned')
  const plannedItems = userEquipment.filter(e => e.status === 'planned')
  const dreamItems = userEquipment.filter(e => e.status === 'dream')

  const totalValue = userEquipment.reduce((sum, e) => {
    const eq = mockEquipmentCatalog.find(x => x.id === e.equipment_id)
    const avg = eq ? ((eq.price_min || 0) + (eq.price_max || 0)) / 2 : 0
    return sum + avg * e.quantity
  }, 0)

  // =====================================================
  // UI: NICHE SELECTION
  // =====================================================
  if (!selectedNiche) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <style>{ANIMATION_STYLES}</style>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Выбери свою нишу</h1>
            <p className="text-xl text-gray-600">Это определит рекомендации и квесты</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockNiches.map(niche => (
              <button
                key={niche.id}
                onClick={() => setSelectedNiche(niche)}
                className="group relative overflow-hidden rounded-2xl bg-white p-8 text-left transition-all border border-gray-100 hover:border-indigo-200 hover:shadow-md active:scale-95"
                style={{ animation: 'card-entry 0.4s ease-out both' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="text-5xl mb-4">{niche.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{niche.name}</h3>
                  <p className="text-gray-600">{niche.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // =====================================================
  // UI: BOARD PAGE
  // =====================================================
  return (
    <div className="min-h-screen bg-gray-50 p-8" ref={boardContainerRef}>
      <style>{ANIMATION_STYLES}</style>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => {
                setSelectedNiche(null)
                setUserEquipment([])
                setGameState(initializeGameState())
                setTotalXP(0)
                setCompletedQuests([])
                setUnlockedAchievements([])
              }}
              className="px-4 py-2 rounded-lg text-indigo-600 hover:bg-indigo-50 font-medium transition mb-4"
            >
              ← Назад к нишам
            </button>
            <div className="flex items-center gap-3">
              <div className="text-4xl">{selectedNiche.icon}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedNiche.name}</h1>
                <p className="text-gray-600">Собирай оборудование и зарабатывай опыт</p>
              </div>
            </div>
          </div>

          {gameState && (
            <div className="flex gap-6">
              {gameState.combo > 1 && (
                <div className="text-center px-4 py-3 bg-white rounded-2xl border-2 border-amber-200 shadow-sm" style={{ animation: 'pulse-scale 0.6s ease-in-out infinite' }}>
                  <div className="text-3xl font-bold text-amber-600">{gameState.combo}x</div>
                  <div className="text-sm font-medium text-amber-600">Комбо</div>
                </div>
              )}

              <div className="text-right bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-600">Очки</p>
                <p className="text-4xl font-bold text-violet-600">{formatScore(gameState.score)}</p>
              </div>
            </div>
          )}
        </div>

        {/* PROGRESS BAR */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">Готовность сетапа</h3>
              <p className="text-sm text-gray-600">{completion}% собрано</p>
            </div>
            <div className="text-2xl">{completion >= 80 ? '🏆' : completion >= 50 ? '⭐' : '📦'}</div>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        {/* MAIN GRID: Catalog + Board + Game Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LEFT: CATALOG (~45% on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <input
                type="text"
                placeholder="Поиск оборудования..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100"
              />
            </div>

            <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
              {filteredEquipment.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  Ничего не найдено по запросу "{searchQuery}"
                </div>
              ) : (
                filteredEquipment.map(equipment => {
                  const isAdded = userEquipment.some(e => e.equipment_id === equipment.id)
                  const userEq = userEquipment.find(e => e.equipment_id === equipment.id)
                  const icon = categoryIcons[equipment.category] || '📦'

                  return (
                    <div
                      key={equipment.id}
                      draggable
                      onDragStart={e => handleDragStart(e, equipment)}
                      onDragEnd={handleDragEnd}
                      className={`bg-white rounded-xl p-4 border transition-all cursor-move ${
                        isAdded
                          ? 'border-indigo-200 bg-indigo-50'
                          : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl flex-shrink-0">{icon}</div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{equipment.name}</h4>
                          <p className="text-sm text-gray-600">{equipment.brand}</p>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">{equipment.category}</span>
                            {equipment.price_min && (
                              <span className="text-xs text-gray-600">${equipment.price_min}-${equipment.price_max || equipment.price_min}</span>
                            )}
                          </div>
                        </div>

                        {isAdded && userEq && (
                          <div className="flex-shrink-0">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              userEq.status === 'owned'
                                ? 'bg-emerald-100 text-emerald-700'
                                : userEq.status === 'planned'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-rose-100 text-rose-700'
                            }`}>
                              {userEq.status === 'owned' ? '✓ Есть' : userEq.status === 'planned' ? '📋 План' : '❤️ Хочу'}
                            </span>
                          </div>
                        )}
                      </div>

                      {!isAdded && (
                        <button
                          onClick={() => handleAddEquipment(equipment)}
                          className="mt-3 w-full px-3 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition active:scale-95"
                        >
                          + Добавить
                        </button>
                      )}

                      {isAdded && (
                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                          <div className="grid grid-cols-3 gap-2">
                            {(['owned', 'planned', 'dream'] as const).map(status => (
                              <button
                                key={status}
                                onClick={() => handleAddEquipment(equipment, status)}
                                className={`px-2 py-2 rounded-lg text-sm font-medium transition ${
                                  userEq?.status === status
                                    ? status === 'owned'
                                      ? 'bg-emerald-500 text-white'
                                      : status === 'planned'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-rose-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {status === 'owned' ? '✓' : status === 'planned' ? '📋' : '❤️'}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => handleRemoveEquipment(equipment.id)}
                            className="w-full px-3 py-2 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 font-medium transition text-sm"
                          >
                            ✕ Удалить
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* CENTER: BOARD DROP ZONE (~30% on desktop) */}
          <div className="lg:col-span-1">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`bg-white rounded-2xl border-2 transition-all ${
                isOverDropZone
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-dashed border-gray-300 hover:border-gray-400'
              }`}
              style={isOverDropZone ? { animation: 'drag-highlight 1s ease-in-out infinite' } : {}}
            >
              {userEquipment.length === 0 ? (
                <div className="h-[400px] flex flex-col items-center justify-center text-center p-6">
                  <div className="text-5xl mb-3">📦</div>
                  <p className="text-gray-600 font-medium mb-2">Перетащи оборудование сюда</p>
                  <p className="text-sm text-gray-500">или нажми кнопку "Добавить"</p>
                </div>
              ) : (
                <div className="p-4 space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto">
                  {userEquipment.map(item => {
                    const eq = mockEquipmentCatalog.find(e => e.id === item.equipment_id)
                    const icon = categoryIcons[eq?.category || ''] || '📦'
                    return (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-xl flex-shrink-0">{icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{eq?.name}</p>
                            <p className="text-xs text-gray-600">{eq?.brand}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveEquipment(item.equipment_id)}
                            className="text-gray-400 hover:text-rose-600 transition flex-shrink-0"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs font-medium px-2 py-1 rounded ${
                            item.status === 'owned'
                              ? 'bg-emerald-100 text-emerald-700'
                              : item.status === 'planned'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-rose-100 text-rose-700'
                          }`}>
                            {item.status === 'owned' ? '✓ Есть' : item.status === 'planned' ? '📋 План' : '❤️ Хочу'}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleQuantityChange(item.equipment_id, -1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-900 text-sm"
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.equipment_id, 1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-900 text-sm"
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
          </div>

          {/* RIGHT: GAME PANEL (~25% on desktop) */}
          <div className="lg:col-span-1 space-y-4">
            {/* LEVEL CARD */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">{currentLevel.icon}</div>
                <div>
                  <p className="text-sm text-gray-600">Уровень</p>
                  <p className="text-xl font-bold text-gray-900">{currentLevel.title}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">XP: {xpProgress.current}/{xpProgress.max}</span>
                  <span className="font-medium text-gray-900">{Math.round(xpProgress.percent)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-violet-400 transition-all duration-300"
                    style={{ width: `${xpProgress.percent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">Осталось до уровня: {xpProgress.max - xpProgress.current} XP</p>
              </div>
            </div>

            {/* QUESTS CARD */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>🎯</span> Активные квесты
              </h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {QUESTS.map(quest => {
                  const isCompleted = completedQuests.includes(quest.id)
                  return (
                    <div key={quest.id} className={`p-3 rounded-lg border ${
                      isCompleted
                        ? 'bg-gray-50 border-gray-200 opacity-60'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-start gap-2">
                        <span className="text-lg flex-shrink-0">{isCompleted ? '✓' : quest.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {quest.title}
                          </p>
                          <p className="text-xs text-gray-600">{quest.description}</p>
                          {!isCompleted && <p className="text-xs text-violet-600 font-medium mt-1">+{quest.xp} XP</p>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ACHIEVEMENTS CARD */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>🏆</span> Ачивки
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {ACHIEVEMENTS.map(achievement => {
                  const isUnlocked = unlockedAchievements.includes(achievement.id)
                  return (
                    <div
                      key={achievement.id}
                      className={`aspect-square flex items-center justify-center rounded-lg border-2 transition ${
                        isUnlocked
                          ? `border-${achievement.rarity === 'legendary' ? 'amber' : achievement.rarity === 'epic' ? 'violet' : achievement.rarity === 'rare' ? 'blue' : 'gray'}-200 bg-${achievement.rarity === 'legendary' ? 'amber' : achievement.rarity === 'epic' ? 'violet' : achievement.rarity === 'rare' ? 'blue' : 'gray'}-50 text-2xl`
                          : 'border-gray-200 bg-gray-50 text-2xl opacity-40'
                      }`}
                      title={isUnlocked ? achievement.title : 'Заблокирована'}
                    >
                      {isUnlocked ? achievement.icon : '🔒'}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* STATS CARD */}
            {userEquipment.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3">Статистика</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Предметов:</span>
                    <span className="font-semibold text-gray-900">{userEquipment.reduce((sum, e) => sum + e.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Типов:</span>
                    <span className="font-semibold text-gray-900">{userEquipment.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Стоимость:</span>
                    <span className="font-semibold text-emerald-600">${Math.round(totalValue)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="text-gray-600">Есть:</span>
                    <span className="font-semibold text-emerald-600">{ownedItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Планирую:</span>
                    <span className="font-semibold text-blue-600">{plannedItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Хочу:</span>
                    <span className="font-semibold text-rose-600">{dreamItems.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FLOATING TEXTS */}
      {floatingTexts.map(text => (
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
            fontSize: '28px',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          }}
        >
          {text.text}
        </div>
      ))}

      {/* TOASTS */}
      <div className="fixed bottom-8 right-8 z-50 space-y-3">
        {toasts.map(toast => {
          const bgColor = {
            achievement: 'bg-amber-50 border-amber-200',
            quest: 'bg-emerald-50 border-emerald-200',
            level: 'bg-violet-50 border-violet-200',
            motivational: 'bg-blue-50 border-blue-200',
            combo: 'bg-amber-50 border-amber-200',
          }[toast.type]

          const isExiting = Date.now() - toast.timestamp > 3000
          return (
            <div
              key={toast.id}
              className={`bg-white rounded-xl p-4 border border-gray-200 shadow-lg flex items-center gap-3 transition-all ${bgColor} ${isExiting ? 'opacity-0' : 'opacity-100'}`}
              style={{
                animation: isExiting ? 'toast-fade-out 0.3s ease-out forwards' : 'toast-slide-in 0.3s ease-out forwards',
              }}
            >
              <span className="text-2xl">{toast.icon}</span>
              <p className="font-medium text-gray-900 text-sm">{toast.text}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
