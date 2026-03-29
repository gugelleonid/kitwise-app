'use client'

import { EquipmentCatalog, UserEquipment } from '@/lib/types'
import { categoryIcons, subcategoryIcons } from '@/lib/mockData'
import { Share2, Download, Camera } from 'lucide-react'

interface EquipmentBoardProps {
  equipment: (EquipmentCatalog & { status?: 'owned' | 'planned' | 'dream' })[]
  nicheName: string
  setupScore: number
  userName?: string
}

const statusColors = {
  owned: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/60', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  planned: { bg: 'bg-amber-500/15', border: 'border-amber-500/50', text: 'text-amber-300', dot: 'bg-amber-400' },
  dream: { bg: 'bg-slate-500/15', border: 'border-slate-600/50', text: 'text-slate-400', dot: 'bg-slate-500' },
}

export default function EquipmentBoard({ equipment, nicheName, setupScore, userName }: EquipmentBoardProps) {
  // Group equipment by category
  const grouped = equipment.reduce((acc, item) => {
    const cat = item.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {} as Record<string, typeof equipment>)

  // Category display order
  const categoryOrder = ['Camera', 'Lens', 'Flash', 'Lighting', 'Audio', 'Support', 'Storage', 'Drone', 'Computer', 'Bag', 'Accessory']
  const sortedCategories = categoryOrder.filter(c => grouped[c])

  const ownedCount = equipment.filter(e => e.status === 'owned').length
  const plannedCount = equipment.filter(e => e.status === 'planned').length

  const handleShare = async () => {
    const url = window.location.href
    const text = `Мой сетап для ${nicheName} — ${setupScore}% готовности! ${ownedCount} единиц техники 📷\n\nСобрано на KitWise`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Мой KitWise сетап', text, url })
      } catch {}
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      alert('Ссылка скопирована!')
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Board Container — "table" */}
      <div
        id="kitwise-board"
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Subtle wood/texture grain */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  KitWise
                </h2>
                <p className="text-xs text-slate-400">Мой сетап</p>
              </div>
            </div>

            {/* Score badge */}
            <div className="flex items-center gap-2">
              <div className="relative w-14 h-14">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                  <circle
                    cx="28" cy="28" r="24" fill="none"
                    stroke="url(#scoreGrad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${(setupScore / 100) * 150.8} 150.8`}
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{setupScore}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Niche & User */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              {nicheName}
            </span>
            {userName && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/15 text-purple-300 border border-purple-500/30">
                @{userName}
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-400 border border-white/10">
              {ownedCount} есть · {plannedCount} план
            </span>
          </div>

          {/* Equipment Grid — "items on the table" */}
          <div className="space-y-5">
            {sortedCategories.map((category) => (
              <div key={category}>
                {/* Category label */}
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-base">{categoryIcons[category] || '📦'}</span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {category === 'Camera' ? 'Камеры' :
                     category === 'Lens' ? 'Объективы' :
                     category === 'Flash' ? 'Вспышки' :
                     category === 'Lighting' ? 'Свет' :
                     category === 'Audio' ? 'Аудио' :
                     category === 'Support' ? 'Штативы и стабилизаторы' :
                     category === 'Storage' ? 'Хранение' :
                     category === 'Drone' ? 'Дроны' :
                     category === 'Computer' ? 'Техника Apple' :
                     category === 'Bag' ? 'Рюкзаки и сумки' :
                     category === 'Accessory' ? 'Аксессуары' : category}
                  </span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>

                {/* Items */}
                <div className="flex flex-wrap gap-2">
                  {grouped[category].map((item) => {
                    const status = item.status || 'dream'
                    const colors = statusColors[status]
                    const icon = subcategoryIcons[item.subcategory] || categoryIcons[item.category] || '📦'

                    return (
                      <div
                        key={item.id}
                        className={`
                          group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border
                          transition-all duration-200 cursor-default
                          ${colors.bg} ${colors.border}
                          hover:scale-[1.02] hover:shadow-lg
                        `}
                        title={`${item.name} — ${item.brand}\n${status === 'owned' ? '✅ Есть' : status === 'planned' ? '📋 План' : '💭 Мечта'}`}
                      >
                        {/* Status dot */}
                        <div className={`w-1.5 h-1.5 rounded-full ${colors.dot} flex-shrink-0`} />

                        {/* Icon */}
                        <span className="text-sm flex-shrink-0">{icon}</span>

                        {/* Name */}
                        <span className={`text-xs font-medium ${colors.text} whitespace-nowrap max-w-[160px] truncate`}>
                          {item.name.replace(item.brand + ' ', '').replace('Canon ', '').replace('Sony ', '').replace('Nikon ', '').replace('Fujifilm ', '').replace('Panasonic ', '')}
                        </span>

                        {/* Brand tiny */}
                        <span className="text-[10px] text-slate-500 hidden sm:inline flex-shrink-0">
                          {item.brand}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-slate-400">Есть</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-[10px] text-slate-400">План</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-500" />
                <span className="text-[10px] text-slate-400">Мечта</span>
              </div>
            </div>

            <span className="text-[10px] text-slate-500">kitwise-app.vercel.app</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-3 mt-6">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Share2 className="w-4 h-4" />
          Поделиться
        </button>
      </div>
    </div>
  )
}
