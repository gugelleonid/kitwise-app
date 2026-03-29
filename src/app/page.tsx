'use client'

import Link from 'next/link'
import { Camera, Crosshair, Package, Trophy, GripVertical, Award, Lightbulb, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className="w-full bg-white">
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(var(--rotation));
            opacity: var(--opacity);
          }
          50% {
            transform: translateY(-15px) rotate(var(--rotation));
            opacity: var(--opacity);
          }
        }

        .equipment-icon {
          animation: float 4s ease-in-out infinite;
        }

        .delay-1 { animation-delay: 0s; }
        .delay-2 { animation-delay: 0.3s; }
        .delay-3 { animation-delay: 0.6s; }
        .delay-4 { animation-delay: 0.9s; }
        .delay-5 { animation-delay: 1.2s; }
        .delay-6 { animation-delay: 1.5s; }

        .rotate-5 { --rotation: 5deg; }
        .rotate-neg-8 { --rotation: -8deg; }
        .rotate-12 { --rotation: 12deg; }
        .rotate-neg-6 { --rotation: -6deg; }
        .rotate-8 { --rotation: 8deg; }
        .rotate-neg-10 { --rotation: -10deg; }
      `}</style>

      {/* Section 1: Hero */}
      <section className="relative min-h-screen w-full flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Background - Subtle grid pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, gray 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
        </div>

        {/* Floating equipment icons - scattered background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Camera icon */}
          <div
            className="equipment-icon delay-1 rotate-5 absolute"
            style={{ top: '10%', left: '5%', '--opacity': 0.08 } as React.CSSProperties}
          >
            <Camera className="w-32 h-32 text-indigo-400" strokeWidth={1} />
          </div>

          {/* Lens icon */}
          <div
            className="equipment-icon delay-2 rotate-neg-8 absolute"
            style={{ top: '20%', right: '8%', '--opacity': 0.07 } as React.CSSProperties}
          >
            <Crosshair className="w-28 h-28 text-violet-400" strokeWidth={1} />
          </div>

          {/* Package icon */}
          <div
            className="equipment-icon delay-3 rotate-12 absolute"
            style={{ bottom: '15%', left: '8%', '--opacity': 0.08 } as React.CSSProperties}
          >
            <Package className="w-32 h-32 text-emerald-400" strokeWidth={1} />
          </div>

          {/* Trophy icon */}
          <div
            className="equipment-icon delay-4 rotate-neg-6 absolute"
            style={{ top: '40%', right: '5%', '--opacity': 0.07 } as React.CSSProperties}
          >
            <Trophy className="w-28 h-28 text-amber-400" strokeWidth={1} />
          </div>

          {/* Grip icon */}
          <div
            className="equipment-icon delay-5 rotate-8 absolute"
            style={{ bottom: '20%', right: '12%', '--opacity': 0.06 } as React.CSSProperties}
          >
            <GripVertical className="w-24 h-24 text-blue-400" strokeWidth={1} />
          </div>

          {/* Award icon */}
          <div
            className="equipment-icon delay-6 rotate-neg-10 absolute"
            style={{ top: '60%', left: '12%', '--opacity': 0.07 } as React.CSSProperties}
          >
            <Award className="w-28 h-28 text-rose-400" strokeWidth={1} />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-3xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-slideUp tracking-tight">
            Собери сетап мечты
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-12 font-normal animate-slideUp" style={{ animationDelay: '0.1s' }}>
            Интерактивный конструктор оборудования для фотографов и видеографов
          </p>

          {/* CTA Button */}
          <Link
            href="/board"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg active:scale-95 animate-slideUp"
            style={{ animationDelay: '0.2s' }}
          >
            Начать сборку
          </Link>

          {/* Subtext */}
          <p className="mt-8 text-sm text-gray-400 font-medium animate-slideUp" style={{ animationDelay: '0.3s' }}>
            Бесплатно • Без регистрации • 2 минуты
          </p>
        </div>
      </section>

      {/* Section 2: How it works */}
      <section className="relative py-24 px-4 bg-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
            Как это работает
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Выбери нишу</h3>
              <p className="text-gray-600">Портрет, свадьба, видео — выбери свою специализацию</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Собери сетап</h3>
              <p className="text-gray-600">Перетаскивай оборудование на борд, выбирай статус</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center animate-slideUp" style={{ animationDelay: '0.3s' }}>
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Получай награды</h3>
              <p className="text-gray-600">Зарабатывай очки, выполняй квесты, открывай ачивки</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Features showcase */}
      <section className="relative py-24 px-4 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
            Почему KitWise?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <GripVertical className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Drag & Drop</h3>
              <p className="text-gray-600">Перетаскивай оборудование прямо на борд</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <Trophy className="w-12 h-12 text-violet-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Квесты и ачивки</h3>
              <p className="text-gray-600">30+ достижений и уникальных заданий</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow animate-slideUp" style={{ animationDelay: '0.3s' }}>
              <Lightbulb className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Умные рекомендации</h3>
              <p className="text-gray-600">Система подскажет недостающее оборудование</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <TrendingUp className="w-12 h-12 text-amber-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Прогресс и уровни</h3>
              <p className="text-gray-600">Прокачивайся от Новичка до Мастера</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Final CTA */}
      <section className="relative py-24 px-4 bg-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Готов собрать идеальный сетап?
          </h2>

          <Link
            href="/board"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-12 py-5 font-semibold text-white text-lg transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg active:scale-95"
          >
            Начать →
          </Link>
        </div>
      </section>
    </div>
  )
}
