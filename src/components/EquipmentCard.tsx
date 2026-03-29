'use client'

import { UserEquipment, EquipmentCatalog } from '@/lib/types'
import { Trash2 } from 'lucide-react'

interface EquipmentCardProps {
  equipment: EquipmentCatalog
  userEquipment?: UserEquipment
  onStatusChange?: (
    equipmentId: string,
    status: 'owned' | 'planned' | 'dream'
  ) => void
  onRemove?: (id: string) => void
  showRemove?: boolean
}

const statusConfig = {
  owned: { emoji: '🟢', label: 'Есть', color: 'text-green-400' },
  planned: { emoji: '🟡', label: 'План', color: 'text-yellow-400' },
  dream: { emoji: '⚫', label: 'Мечта', color: 'text-gray-400' },
}

export default function EquipmentCard({
  equipment,
  userEquipment,
  onStatusChange,
  onRemove,
  showRemove,
}: EquipmentCardProps) {
  const status = (userEquipment?.status as keyof typeof statusConfig) || 'dream'
  const config = statusConfig[status]

  const handleStatusCycle = () => {
    if (!onStatusChange) return
    const statuses: Array<'owned' | 'planned' | 'dream'> = [
      'owned',
      'planned',
      'dream',
    ]
    const currentIndex = statuses.indexOf(status)
    const nextStatus = statuses[(currentIndex + 1) % statuses.length]
    onStatusChange(equipment.id, nextStatus)
  }

  return (
    <div className="card group relative overflow-hidden transition-all hover:border-slate-700 hover:bg-slate-800/40">
      <div className="absolute inset-0 bg-gradient-card opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative p-4">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-100">{equipment.name}</h3>
            <p className="text-xs text-slate-400">{equipment.brand}</p>
          </div>
          {showRemove && onRemove && (
            <button
              onClick={() => onRemove(equipment.id)}
              className="text-slate-500 hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category */}
        <div className="mb-3">
          <span className="inline-block rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">
            {equipment.category} → {equipment.subcategory}
          </span>
        </div>

        {/* Price Range */}
        {(equipment.price_min || equipment.price_max) && (
          <p className="mb-3 text-sm text-slate-400">
            ${equipment.price_min?.toLocaleString()} - $
            {equipment.price_max?.toLocaleString()}
          </p>
        )}

        {/* Description */}
        <p className="mb-4 text-xs text-slate-500 line-clamp-2">
          {equipment.description}
        </p>

        {/* Status Button */}
        {onStatusChange ? (
          <button
            onClick={handleStatusCycle}
            className={`flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium transition-all hover:bg-slate-800 ${config.color}`}
          >
            <span className="text-lg">{config.emoji}</span>
            {config.label}
          </button>
        ) : (
          <div
            className={`flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium ${config.color}`}
          >
            <span className="text-lg">{config.emoji}</span>
            {config.label}
          </div>
        )}
      </div>
    </div>
  )
}
