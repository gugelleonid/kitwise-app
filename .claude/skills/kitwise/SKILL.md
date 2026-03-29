# KitWise — Проектный контекст

## О проекте
KitWise — онлайн-платформа для фотографов/видеографов, помогающая формировать идеальный сетап оборудования. Пользователь выбирает направления (ниши), добавляет свою технику, видит оценку готовности, получает рекомендации и делится визуальным бордом с друзьями.

## Стек
- **Framework**: Next.js 14 (App Router, TypeScript, Tailwind CSS)
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions, RLS)
- **Deploy**: Vercel (auto-deploy из GitHub)
- **UI**: Tailwind CSS, Lucide icons, Recharts
- **Repo**: `gugelleonid/kitwise-app`

## Структура файлов
```
src/
  app/
    page.tsx           — Промо-лендинг (главная)
    layout.tsx         — Root layout с Navbar
    dashboard/
      page.tsx         — ЦЕНТРАЛЬНЫЙ ХАБ: ниши, техника, статистика, геймификация, шэринг
    onboarding/
      page.tsx         — Пошаговый онбординг (ниша → техника → результат)
    board/
      page.tsx         — Визуальный борд для репоста
    recommendations/
      page.tsx         — Рекомендации
    profile/
      page.tsx         — Профиль
  components/
    Navbar.tsx         — Навигация
    EquipmentCard.tsx  — Карточка оборудования (статус + количество)
    EquipmentBoard.tsx — Визуальный борд для шэринга
    ProgressRing.tsx   — Кольцо прогресса
    LevelBar.tsx       — Полоса уровня
    NicheCard.tsx      — Карточка ниши
    RecommendationCard.tsx — Карточка рекомендации
  lib/
    types.ts           — TypeScript типы (UserEquipment, EquipmentCatalog, Achievement, UserProgress)
    mockData.ts        — Каталог 130+ единиц техники, ниши, рекомендации
    gamification.ts    — Система достижений, уровней, XP
    supabase.ts        — Supabase клиент
```

## Ключевые типы
- `UserEquipment`: id, user_id, equipment_id, custom_name, category, status ('owned'|'planned'|'dream'), quantity, acquired_at, notes
- `EquipmentCatalog`: id, name, brand, category, subcategory, description, price_min/max, image_url, specs
- `Achievement`: id, title, description, icon, condition, xp, rarity
- `UserProgress`: level, xp, xpToNext, title, achievements[], streak
- `Niche`: id, name, slug, icon, description

## Категории оборудования
Camera, Lens, Flash, Lighting, Audio, Support, Storage, Drone, Computer, Bag, Accessory

## Бренды
Canon, Sony, Nikon, Fujifilm, Panasonic, Leica, Hasselblad, DJI, GoPro, Godox, Profoto, Aputure, Rode, Sennheiser, Apple, Peak Design, Sigma, Tamron

## Язык интерфейса
Весь UI на русском языке. Категории оборудования в коде на английском, но отображаются на русском.

## Данные
Все данные пока в mockData.ts. localStorage ключ: 'kitwise-onboarding'. Supabase project ID: flvenizwibruskyhxowa.

## Текущие задачи
1. Реструктуризация: дашборд = центральный хаб (мульти-ниша, оборудование, статистика, геймификация, шэринг)
2. Геймификация: достижения, уровни, XP, визуальные награды
3. SVG-иконки для техники (борд должен быть красивым для репоста)
4. Добавление кастомных позиций (ручной ввод или парсинг URL)
5. Расширение каталога (все модели за последние 5 лет)

## Дизайн
- Темная тема: bg-slate-950, карточки с border-slate-800
- Градиенты: cyan→purple (акцент), синий/фиолетовый
- Стиль: минималистичный, профессиональный
