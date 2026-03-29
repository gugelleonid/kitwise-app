'use client'

import { Niche } from '@/lib/types'

interface NicheCardProps {
  niche: Niche
  selected?: boolean
  onClick: (niche: Niche) => void
}

export default function NicheCard({ niche, selected, onClick }: NicheCardProps) {
  return (
    <button
      onClick={() => onClick(niche)}
      className={`card group relative h-32 w-full overflow-hidden transition-all sm:h-40 ${
        selected
          ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/50'
          : 'hover:border-slate-700 hover:bg-slate-800/40'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-card opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative flex h-full flex-col items-center justify-center p-4 text-center">
        <div className="mb-2 text-4xl sm:text-5xl">{niche.icon}</div>
        <h3 className="text-sm font-semibold text-slate-100 sm:text-base">
          {niche.name}
        </h3>
        <p className="mt-1 text-xs text-slate-400 sm:text-sm line-clamp-2">
          {niche.description}
        </p>
      </div>
    </button>
  )
}
