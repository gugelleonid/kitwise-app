'use client'

import { useState, useEffect } from 'react'
import { Niche, EquipmentCatalog, UserEquipment } from '@/lib/types'
import { mockNiches, mockEquipmentCatalog } from '@/lib/mockData'
import EquipmentBoard from '@/components/EquipmentBoard'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function BoardPage() {
  const [nicheName, setNicheName] = useState('Портретная фотография')
  const [setupScore, setSetupScore] = useState(45)
  const [boardEquipment, setBoardEquipment] = useState<
    (EquipmentCatalog & { status?: 'owned' | 'planned' | 'dream'; quantity?: number })[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kitwise-onboarding')
      if (saved) {
        const data = JSON.parse(saved)
        // Backward compat: niches (array) or niche (single)
        if (data.niches && data.niches.length > 0) {
          setNicheName(data.niches.map((n: any) => n.name).join(', '))
        } else if (data.niche) {
          setNicheName(data.niche.name)
        }
        if (data.score) setSetupScore(data.score)

        // Map user equipment to full catalog items with status + quantity
        if (data.equipment && data.equipment.length > 0) {
          const mapped = data.equipment
            .map((ue: UserEquipment) => {
              const catalogItem = mockEquipmentCatalog.find(
                (e) => e.id === ue.equipment_id
              )
              if (catalogItem) {
                return { ...catalogItem, status: ue.status, quantity: ue.quantity || 1 }
              }
              // Custom items
              if (ue.custom_name) {
                return {
                  id: ue.equipment_id,
                  name: ue.custom_name,
                  brand: '',
                  category: ue.category,
                  subcategory: '',
                  description: '',
                  price_min: null,
                  price_max: null,
                  image_url: null,
                  specs: null,
                  status: ue.status,
                  quantity: ue.quantity || 1,
                }
              }
              return null
            })
            .filter(Boolean)
          setBoardEquipment(mapped)
        } else {
          // Demo data
          loadDemoBoard()
        }
      } else {
        loadDemoBoard()
      }
    } catch {
      loadDemoBoard()
    }
    setLoading(false)
  }, [])

  const loadDemoBoard = () => {
    // Show a nice demo board
    const demoItems: { id: string; status: 'owned' | 'planned' | 'dream' }[] = [
      // Canon EOS R5
      { id: '3', status: 'owned' },
      // Canon RF 50mm f/1.2L
      { id: '56', status: 'owned' },
      // Canon RF 85mm f/1.2L
      { id: '57', status: 'owned' },
      // Canon RF 24-70mm f/2.8L
      { id: '53', status: 'owned' },
      // Canon RF 70-200mm f/2.8L
      { id: '54', status: 'planned' },
      // Godox V1
      { id: '67', status: 'owned' },
      // Godox AD200 Pro
      { id: '68', status: 'owned' },
      // Godox AD400 Pro
      { id: '70', status: 'planned' },
      // Aputure 300d III
      { id: '83', status: 'planned' },
      // Aputure Light Dome III
      { id: '93', status: 'owned' },
      // Peak Design Travel Tripod
      { id: '96', status: 'owned' },
      // DJI RS 4 Pro
      { id: '101', status: 'planned' },
      // Rode Wireless PRO
      { id: '106', status: 'owned' },
      // SanDisk CFexpress B 256GB
      { id: '114', status: 'owned' },
      // Samsung T7 Shield
      { id: '117', status: 'owned' },
      // DJI Mavic 3 Pro
      { id: '119', status: 'dream' },
      // MacBook Pro 16" M4 Max
      { id: '123', status: 'owned' },
      // iPad Pro 13"
      { id: '132', status: 'owned' },
      // Peak Design Everyday Backpack
      { id: '136', status: 'owned' },
      // Datacolor SpyderX Pro
      { id: '143', status: 'planned' },
    ]

    const mapped = demoItems
      .map(({ id, status }) => {
        const item = mockEquipmentCatalog.find((e) => e.id === id)
        if (item) return { ...item, status }
        return null
      })
      .filter(Boolean) as (EquipmentCatalog & { status?: 'owned' | 'planned' | 'dream' })[]

    setBoardEquipment(mapped)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4" />
          <p className="text-slate-400">Генерация борда...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Back link */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад на дашборд
          </Link>

          <div className="flex items-center gap-2 text-purple-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Борд для репоста</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100">
            Мой сетап
          </h1>
          <p className="text-slate-400">
            Визуальная карточка вашего оборудования — делитесь с друзьями и коллегами
          </p>
        </div>

        {/* The Board */}
        <EquipmentBoard
          equipment={boardEquipment}
          nicheName={nicheName}
          setupScore={setupScore}
        />

        {/* How it works */}
        <div className="card p-6 border-purple-500/20 bg-purple-500/5 text-center">
          <p className="text-sm text-purple-300">
            Пройдите <Link href="/onboarding" className="underline font-semibold hover:text-purple-200">онбординг</Link>,
            чтобы создать свой уникальный борд с вашим настоящим оборудованием
          </p>
        </div>
      </div>
    </div>
  )
}
