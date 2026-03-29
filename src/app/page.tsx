'use client'

import { ArrowRight, Zap, Target, Brain } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:py-32 lg:px-8">
        {/* Background gradient */}
        <div className="absolute -top-40 right-0 -z-10 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-40 left-0 -z-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-block rounded-full border border-slate-700 bg-slate-900/50 px-4 py-2">
            <span className="text-sm text-slate-300">
              ✨ Умный подбор оборудования для вашей ниши
            </span>
          </div>

          <h1 className="mb-6 bg-gradient-accent bg-clip-text text-5xl font-bold text-transparent sm:text-7xl">
            KitWise
          </h1>

          <p className="mb-8 text-xl text-slate-400 sm:text-2xl">
            Покажем, чего не хватает вашему сетапу для вашей ниши
          </p>

          <Link
            href="/onboarding"
            className="btn-primary mb-12 inline-flex items-center gap-2"
          >
            Начать бесплатно
            <ArrowRight className="h-5 w-5" />
          </Link>

          <p className="text-sm text-slate-500">
            Без регистрации. Демо-режим работает прямо в браузере.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-16 text-center text-4xl font-bold text-slate-100">
            Как это работает
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="card space-y-4 p-8">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-accent/20">
                <Target className="h-7 w-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100">
                Нишевой анализ
              </h3>
              <p className="text-slate-400">
                Выберите вашу специализацию и получите персонализированный
                анализ необходимого оборудования
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card space-y-4 p-8">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-accent/20">
                <Zap className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100">
                Dream Setup
              </h3>
              <p className="text-slate-400">
                Визуализируйте идеальный сетап с рейтингом готовности и
                рекомендациями по приоритетам
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card space-y-4 p-8">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-accent/20">
                <Brain className="h-7 w-7 text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100">
                AI рекомендации
              </h3>
              <p className="text-slate-400">
                Получайте интеллектуальные предложения на основе вашего
                текущего оборудования и целей
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="px-4 py-20 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-16 text-center text-4xl font-bold text-slate-100">
            4 простых шага
          </h2>

          <div className="space-y-6">
            {[
              {
                number: 1,
                title: 'Выберите нишу',
                description: 'Определитесь со своей специализацией',
              },
              {
                number: 2,
                title: 'Добавьте оборудование',
                description: 'Выберите из каталога то, что уже есть',
              },
              {
                number: 3,
                title: 'Получите оценку',
                description: 'Система рассчитает ваш рейтинг готовности',
              },
              {
                number: 4,
                title: 'Следуйте рекомендациям',
                description:
                  'Планируйте покупки и развивайте свой сетап по приоритетам',
              },
            ].map((step) => (
              <div key={step.number} className="card flex gap-6 p-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-accent">
                  <span className="font-bold text-white">{step.number}</span>
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-slate-100">
                    {step.title}
                  </h3>
                  <p className="text-slate-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-6 text-4xl font-bold text-slate-100">
            Готовы улучшить свой сетап?
          </h2>
          <p className="mb-8 text-lg text-slate-400">
            Начните бесплатно прямо сейчас и получите персонализированные
            рекомендации
          </p>
          <Link href="/onboarding" className="btn-primary inline-flex items-center gap-2">
            Начать анализ
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
