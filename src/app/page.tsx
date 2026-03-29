'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900">
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(var(--rotation));
          }
          50% {
            transform: translateY(-15px) rotate(var(--rotation));
          }
        }

        @keyframes gentle-float {
          0%, 100% {
            transform: translateY(0px) rotate(var(--rotation));
          }
          50% {
            transform: translateY(-12px) rotate(var(--rotation));
          }
        }

        @keyframes slow-float {
          0%, 100% {
            transform: translateY(0px) rotate(var(--rotation));
          }
          50% {
            transform: translateY(-8px) rotate(var(--rotation));
          }
        }

        .equipment-card {
          animation: float 4s ease-in-out infinite;
          filter: drop-shadow(0 0 12px rgba(168, 85, 247, 0.3));
        }

        .equipment-card.gentle {
          animation: gentle-float 4.5s ease-in-out infinite;
        }

        .equipment-card.slow {
          animation: slow-float 5s ease-in-out infinite;
        }

        .delay-1 { animation-delay: 0s; }
        .delay-2 { animation-delay: 0.3s; }
        .delay-3 { animation-delay: 0.6s; }
        .delay-4 { animation-delay: 0.9s; }
        .delay-5 { animation-delay: 1.2s; }
        .delay-6 { animation-delay: 1.5s; }
        .delay-7 { animation-delay: 1.8s; }
        .delay-8 { animation-delay: 2.1s; }
        .delay-9 { animation-delay: 0.4s; }
        .delay-10 { animation-delay: 1.1s; }

        .rotate-5 { --rotation: 5deg; }
        .rotate-neg-8 { --rotation: -8deg; }
        .rotate-12 { --rotation: 12deg; }
        .rotate-neg-6 { --rotation: -6deg; }
        .rotate-8 { --rotation: 8deg; }
        .rotate-neg-10 { --rotation: -10deg; }
        .rotate-6 { --rotation: 6deg; }
        .rotate-neg-12 { --rotation: -12deg; }
        .rotate-10 { --rotation: 10deg; }
        .rotate-neg-5 { --rotation: -5deg; }

        .gradient-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            rgba(15, 23, 42, 0) 0%,
            rgba(15, 23, 42, 0.3) 70%,
            rgba(15, 23, 42, 0.5) 100%
          );
          pointer-events: none;
        }
      `}</style>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

      {/* Equipment cards scattered in flat-lay style */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Camera Body - Large, prominent */}
        <div
          className="equipment-card delay-1 rotate-5 absolute"
          style={{ top: '12%', left: '8%', opacity: 0.9 }}
        >
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <svg className="w-16 h-16 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
            </svg>
            <p className="text-slate-300 text-xs mt-2 font-medium text-center">Sony A7IV</p>
          </div>
        </div>

        {/* Lens */}
        <div
          className="equipment-card gentle delay-2 rotate-neg-8 absolute"
          style={{ top: '25%', right: '10%', opacity: 0.85 }}
        >
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
            <svg className="w-14 h-14 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>
            <p className="text-slate-300 text-xs mt-1 font-medium text-center">Объектив</p>
          </div>
        </div>

        {/* Tripod - Large */}
        <div
          className="equipment-card delay-3 rotate-12 absolute"
          style={{ bottom: '20%', left: '5%', opacity: 0.88 }}
        >
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h12v2H6V4zm0 4h12v2H6V8zm0 4h12v2H6v-2zm-2 4h16v2H4v-2z"/>
            </svg>
            <p className="text-slate-300 text-xs mt-2 font-medium text-center">Штатив</p>
          </div>
        </div>

        {/* Flash */}
        <div
          className="equipment-card slow delay-4 rotate-neg-6 absolute"
          style={{ top: '35%', left: '25%', opacity: 0.82 }}
        >
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
            <svg className="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 2v11h3v9l7-12h-4V2z"/>
            </svg>
            <p className="text-slate-300 text-xs mt-1 font-medium text-center">Вспышка</p>
          </div>
        </div>

        {/* SD Card */}
        <div
          className="equipment-card delay-5 rotate-8 absolute"
          style={{ top: '50%', right: '18%', opacity: 0.8 }}
        >
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-2 border border-slate-700/50">
            <svg className="w-10 h-10 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
              <rect x="4" y="2" width="16" height="20" rx="1" fill="currentColor" opacity="0.3"/>
              <rect x="6" y="4" width="12" height="14" fill="currentColor"/>
            </svg>
            <p className="text-slate-300 text-xs mt-1 font-medium text-center">SD Card</p>
          </div>
        </div>

        {/* Laptop - Medium */}
        <div
          className="equipment-card gentle delay-6 rotate-neg-10 absolute"
          style={{ bottom: '28%', right: '8%', opacity: 0.87 }}
        >
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
            <svg className="w-14 h-14 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 18c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2H0v2h24v-2h-4z"/>
            </svg>
            <p className="text-slate-300 text-xs mt-1 font-medium text-center">MacBook</p>
          </div>
        </div>

        {/* LED Panel - Large */}
        <div
          className="equipment-card delay-7 rotate-6 absolute"
          style={{ top: '8%', right: '15%', opacity: 0.86 }}
        >
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <svg className="w-16 h-16 text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="4" width="20" height="16" rx="1" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="8" cy="12" r="1.5" fill="currentColor" opacity="0.6"/>
              <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.8"/>
              <circle cx="16" cy="12" r="1.5" fill="currentColor"/>
            </svg>
            <p className="text-slate-300 text-xs mt-2 font-medium text-center">LED панель</p>
          </div>
        </div>

        {/* Battery */}
        <div
          className="equipment-card slow delay-8 rotate-neg-12 absolute"
          style={{ bottom: '15%', right: '25%', opacity: 0.81 }}
        >
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-2 border border-slate-700/50">
            <svg className="w-12 h-12 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 7v10H8V7h8m0-2H8c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm2 11h1v-5h-1v5z"/>
            </svg>
            <p className="text-slate-300 text-xs mt-1 font-medium text-center">Батарея</p>
          </div>
        </div>

        {/* Camera Bag - Medium */}
        <div
          className="equipment-card delay-9 rotate-10 absolute"
          style={{ top: '60%', left: '12%', opacity: 0.83 }}
        >
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
            <svg className="w-14 h-14 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-1.1-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49a1.003 1.003 0 00-.99-1.47H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            <p className="text-slate-300 text-xs mt-1 font-medium text-center">Сумка</p>
          </div>
        </div>

        {/* Monitor */}
        <div
          className="equipment-card gentle delay-10 rotate-neg-5 absolute"
          style={{ top: '72%', right: '12%', opacity: 0.84 }}
        >
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
            <svg className="w-14 h-14 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h14l4 4V5c0-1.1-.9-2-2-2zm-2 12H4V5h14v10z"/>
            </svg>
            <p className="text-slate-300 text-xs mt-1 font-medium text-center">Монитор</p>
          </div>
        </div>
      </div>

      {/* Gradient overlay for text readability */}
      <div className="gradient-overlay" />

      {/* Content container */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-4">
        {/* Text content */}
        <div className="text-center max-w-2xl">
          <h1 className="mb-6 text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white drop-shadow-lg">
            KitWise
          </h1>
          <p className="mb-12 text-lg md:text-2xl text-slate-100 font-light drop-shadow">
            Собери идеальный сетап
          </p>

          {/* CTA Button */}
          <Link
            href="/board"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:from-purple-600 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/50 active:scale-95 drop-shadow-lg"
          >
            Собрать свой сетап →
          </Link>
        </div>
      </div>
    </div>
  )
}
