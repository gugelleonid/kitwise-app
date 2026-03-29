'use client'

import { useState, useEffect } from 'react'
import { Download, Share2, Copy } from 'lucide-react'
import ProgressRing from '@/components/ProgressRing'
import { mockUserProfile, mockUserEquipment, mockNiches } from '@/lib/mockData'

export default function ProfilePage() {
  const [profile, setProfile] = useState(mockUserProfile)
  const [shareLink, setShareLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [userEquipmentCount, setUserEquipmentCount] = useState(0)

  useEffect(() => {
    // Load profile from localStorage or use mock
    const saved = localStorage.getItem('kitwise-onboarding')
    if (saved) {
      const data = JSON.parse(saved)
      setProfile((p) => ({
        ...p,
        niche_id: data.niche?.id,
        setup_score: data.score,
      }))
      setUserEquipmentCount(data.equipment.length)
    } else {
      setUserEquipmentCount(mockUserEquipment.length)
    }

    // Generate share link
    const token = `share-${Date.now()}`
    setShareLink(`${window.location.origin}/profile/shared/${token}`)
  }, [])

  const niche = mockNiches.find((n) => n.id === profile.niche_id)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    // Create a simple image of the profile card
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 400
    const ctx = canvas.getContext('2d')

    if (ctx) {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 600, 400)
      gradient.addColorStop(0, '#1a1f2e')
      gradient.addColorStop(1, '#2a1a3e')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 600, 400)

      // Content
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 32px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(profile.full_name, 300, 60)

      ctx.font = '18px Arial'
      ctx.fillStyle = '#a8a8a8'
      ctx.fillText(niche?.name || 'Фотография', 300, 100)

      ctx.font = 'bold 48px Arial'
      ctx.fillStyle = '#a855f7'
      ctx.fillText(profile.setup_score + '%', 300, 200)

      ctx.font = '16px Arial'
      ctx.fillStyle = '#a8a8a8'
      ctx.fillText('Setup Score', 300, 240)

      ctx.font = '14px Arial'
      ctx.fillStyle = '#6a6a6a'
      ctx.fillText(`Оборудование: ${userEquipmentCount} единиц`, 300, 340)
      ctx.fillText('kitwise.app', 300, 380)

      // Download
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = `kitwise-profile-${Date.now()}.png`
      link.click()
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-100">Ваш профиль</h1>
          <p className="text-lg text-slate-400">Карточка вашего оборудования</p>
        </div>

        {/* Profile Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/40 via-slate-900/60 to-blue-900/40 p-12 border border-slate-700">
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 space-y-8">
            {/* Top section with progress ring */}
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
              <div className="flex-shrink-0">
                <ProgressRing percentage={profile.setup_score} size={180} />
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Имя</p>
                  <h2 className="text-3xl font-bold text-slate-100">
                    {profile.full_name}
                  </h2>
                </div>

                <div>
                  <p className="text-sm text-slate-400 mb-1">Специализация</p>
                  <p className="text-xl font-semibold text-slate-100">
                    {niche?.name || 'Не определена'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-400 mb-1">Email</p>
                  <p className="text-sm text-slate-300">{profile.email}</p>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid gap-4 sm:grid-cols-3 border-t border-slate-700 pt-8">
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">Готовность</p>
                <p className="text-2xl font-bold gradient-text">
                  {profile.setup_score}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">Оборудование</p>
                <p className="text-2xl font-bold text-slate-100">
                  {userEquipmentCount}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">Статус</p>
                <p className="text-2xl font-bold text-purple-400">
                  {profile.is_business ? 'Pro' : 'Creator'}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-700 pt-6 text-center">
              <p className="text-sm text-slate-500">
                Создано в KitWise — платформе умного подбора оборудования
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Copy Link */}
          <div className="card p-6">
            <h3 className="mb-4 font-semibold text-slate-100">
              Поделиться профилем
            </h3>
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <button
                onClick={handleCopyLink}
                className="rounded-lg bg-blue-500/20 px-4 py-2 text-blue-400 hover:bg-blue-500/30 transition-colors flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                {copied ? 'Скопировано' : 'Копировать'}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Поделитесь этой ссылкой, чтобы показать другим ваш сетап
            </p>
          </div>

          {/* Download Card */}
          <div className="card p-6">
            <h3 className="mb-4 font-semibold text-slate-100">
              Экспортировать карточку
            </h3>
            <button
              onClick={handleDownload}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-accent px-6 py-3 font-semibold text-white hover:shadow-lg transition-all"
            >
              <Download className="h-4 w-4" />
              Скачать PNG
            </button>
            <p className="mt-3 text-xs text-slate-500">
              Сохраните карточку профиля как изображение
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-100">Дополнительная информация</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card p-6">
              <p className="text-sm text-slate-400 mb-2">Статус аккаунта</p>
              <p className="text-lg font-semibold text-slate-100">
                {profile.onboarding_completed ? '✓ Активный' : 'Неполный'}
              </p>
            </div>

            <div className="card p-6">
              <p className="text-sm text-slate-400 mb-2">Уровень профессионализма</p>
              <p className="text-lg font-semibold text-slate-100">
                {profile.level === 'beginner'
                  ? '🟢 Начинающий'
                  : profile.level === 'advanced'
                    ? '🟠 Продвинутый'
                    : '🔴 Профессиональный'}
              </p>
            </div>

            <div className="card p-6 sm:col-span-2">
              <p className="text-sm text-slate-400 mb-2">О профиле</p>
              <p className="text-slate-300">
                {profile.is_business
                  ? 'Вы зарегистрированы как коммерческое предприятие'
                  : 'Вы используете платформу как независимый творец'}
              </p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="card border-slate-700 bg-slate-800/50 p-6">
          <h3 className="mb-3 font-semibold text-slate-100">Советы</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>
              ✓ Регулярно обновляйте список оборудования, чтобы получить
              актуальные рекомендации
            </li>
            <li>
              ✓ Делитесь своим профилем с коллегами для сравнения сетапов
            </li>
            <li>
              ✓ Отслеживайте свой прогресс в достижении целевого сетапа
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
