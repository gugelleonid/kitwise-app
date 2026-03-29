'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Animated particle background */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes drift {
          0%, 100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(10px);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(120px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: rotate(360deg) translateX(120px) rotate(-360deg);
            opacity: 1;
          }
        }

        @keyframes bob {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .equipment-orbit {
          animation: orbit 20s linear infinite;
        }

        .equipment-bob {
          animation: bob 3s ease-in-out infinite;
        }

        .equipment-bob-delay-1 {
          animation-delay: 0s;
        }

        .equipment-bob-delay-2 {
          animation-delay: 0.3s;
        }

        .equipment-bob-delay-3 {
          animation-delay: 0.6s;
        }

        .equipment-bob-delay-4 {
          animation-delay: 0.9s;
        }

        .equipment-bob-delay-5 {
          animation-delay: 1.2s;
        }

        .equipment-bob-delay-6 {
          animation-delay: 1.5s;
        }

        .equipment-bob-delay-7 {
          animation-delay: 1.8s;
        }

        .equipment-bob-delay-8 {
          animation-delay: 2.1s;
        }

        .equipment-bob-delay-9 {
          animation-delay: 2.4s;
        }

        .equipment-bob-delay-10 {
          animation-delay: 2.7s;
        }

        .glow-item {
          filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.4));
        }

        .particle {
          position: absolute;
          background: radial-gradient(circle, rgba(148, 163, 184, 0.5), transparent);
          border-radius: 50%;
          pointer-events: none;
        }
      `}</style>

      {/* Animated particles background */}
      <div className="absolute inset-0">
        <div className="particle" style={{ width: '4px', height: '4px', top: '10%', left: '8%', animation: 'drift 8s ease-in-out infinite' }} />
        <div className="particle" style={{ width: '3px', height: '3px', top: '20%', right: '12%', animation: 'drift 10s ease-in-out infinite reverse' }} />
        <div className="particle" style={{ width: '5px', height: '5px', bottom: '15%', left: '15%', animation: 'drift 12s ease-in-out infinite' }} />
        <div className="particle" style={{ width: '3px', height: '3px', top: '30%', right: '8%', animation: 'drift 9s ease-in-out infinite reverse' }} />
        <div className="particle" style={{ width: '4px', height: '4px', bottom: '20%', right: '20%', animation: 'drift 11s ease-in-out infinite' }} />
      </div>

      {/* Content container */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        {/* Animated Dream Board */}
        <div className="mb-16 flex justify-center">
          <div className="relative h-56 w-56 md:h-72 md:w-72">
            {/* Center point */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-purple-400/50" />
            </div>

            {/* Equipment items in orbit with bob animation */}
            <div className="absolute inset-0">
              {/* Item 1 - Camera */}
              <div className="equipment-orbit equipment-bob equipment-bob-delay-1 absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2">
                <div className="glow-item flex h-full w-full items-center justify-center rounded-lg bg-slate-800/50 backdrop-blur-sm">
                  <span className="text-2xl">📷</span>
                </div>
              </div>

              {/* Item 2 - Microphone */}
              <div className="equipment-orbit equipment-bob equipment-bob-delay-2 absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '2.5s' }}>
                <div className="glow-item flex h-full w-full items-center justify-center rounded-lg bg-slate-800/50 backdrop-blur-sm">
                  <span className="text-2xl">🎤</span>
                </div>
              </div>

              {/* Item 3 - Lens */}
              <div className="equipment-orbit equipment-bob equipment-bob-delay-3 absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '5s' }}>
                <div className="glow-item flex h-full w-full items-center justify-center rounded-lg bg-slate-800/50 backdrop-blur-sm">
                  <span className="text-2xl">🔭</span>
                </div>
              </div>

              {/* Item 4 - Lightbulb */}
              <div className="equipment-orbit equipment-bob equipment-bob-delay-4 absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '7.5s' }}>
                <div className="glow-item flex h-full w-full items-center justify-center rounded-lg bg-slate-800/50 backdrop-blur-sm">
                  <span className="text-2xl">💡</span>
                </div>
              </div>

              {/* Item 5 - Tripod */}
              <div className="equipment-orbit equipment-bob equipment-bob-delay-5 absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '10s' }}>
                <div className="glow-item flex h-full w-full items-center justify-center rounded-lg bg-slate-800/50 backdrop-blur-sm">
                  <span className="text-2xl">🎥</span>
                </div>
              </div>

              {/* Item 6 - Headphones */}
              <div className="equipment-orbit equipment-bob equipment-bob-delay-6 absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '12.5s' }}>
                <div className="glow-item flex h-full w-full items-center justify-center rounded-lg bg-slate-800/50 backdrop-blur-sm">
                  <span className="text-2xl">🎧</span>
                </div>
              </div>

              {/* Item 7 - Monitor */}
              <div className="equipment-orbit equipment-bob equipment-bob-delay-7 absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '15s' }}>
                <div className="glow-item flex h-full w-full items-center justify-center rounded-lg bg-slate-800/50 backdrop-blur-sm">
                  <span className="text-2xl">🖥️</span>
                </div>
              </div>

              {/* Item 8 - Keyboard */}
              <div className="equipment-orbit equipment-bob equipment-bob-delay-8 absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '17.5s' }}>
                <div className="glow-item flex h-full w-full items-center justify-center rounded-lg bg-slate-800/50 backdrop-blur-sm">
                  <span className="text-2xl">⌨️</span>
                </div>
              </div>

              {/* Item 9 - Router */}
              <div className="equipment-orbit equipment-bob equipment-bob-delay-9 absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '3.75s' }}>
                <div className="glow-item flex h-full w-full items-center justify-center rounded-lg bg-slate-800/50 backdrop-blur-sm">
                  <span className="text-2xl">📡</span>
                </div>
              </div>

              {/* Item 10 - Battery */}
              <div className="equipment-orbit equipment-bob equipment-bob-delay-10 absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '13.75s' }}>
                <div className="glow-item flex h-full w-full items-center justify-center rounded-lg bg-slate-800/50 backdrop-blur-sm">
                  <span className="text-2xl">🔋</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-white md:text-7xl">
            KitWise
          </h1>
          <p className="mb-12 text-lg text-slate-300 md:text-xl">
            Создай идеальный борд оборудования
          </p>

          {/* CTA Button */}
          <Link
            href="/board"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:from-purple-600 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/50 active:scale-95"
          >
            Собрать свой борд
          </Link>
        </div>
      </div>
    </div>
  )
}
