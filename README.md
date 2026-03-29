# KitWise — Умный сетап для креаторов

Платформа умных рекомендаций оборудования для фотографов, видеографов и контент-креаторов.

## Особенности

✨ **Нишевой анализ** — Персонализированный анализ необходимого оборудования для вашей специализации

🎯 **Dream Setup** — Визуализируйте идеальный сетап с рейтингом готовности

🤖 **AI Рекомендации** — Интеллектуальные предложения на основе вашего текущего оборудования

📊 **Dashboard** — Полный обзор вашего сетапа с radar-чартом покрытия категорий

🎨 **Modern UI** — Темная тема, адаптивный дизайн, анимации

## Технологический стек

- **Next.js 14** — React фреймворк с App Router
- **TypeScript** — Типизированный JavaScript
- **Tailwind CSS** — Утилитарный CSS фреймворк
- **Supabase** — Backend и база данных
- **Recharts** — Charts и графики
- **Lucide React** — Иконки

## Начало работы

### Требования

- Node.js 18+
- npm или yarn

### Установка

```bash
npm install
```

### Переменные окружения

Создайте файл `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Запуск в разработке

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Production Build

```bash
npm run build
npm run start
```

## Структура проекта

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles
│   ├── onboarding/
│   │   └── page.tsx            # Onboarding flow
│   ├── dashboard/
│   │   └── page.tsx            # Main dashboard
│   ├── recommendations/
│   │   └── page.tsx            # Recommendations page
│   └── profile/
│       └── page.tsx            # User profile
├── components/
│   ├── Navbar.tsx              # Navigation
│   ├── NicheCard.tsx           # Niche selector card
│   ├── EquipmentCard.tsx       # Equipment item
│   ├── ProgressRing.tsx        # Circular progress
│   ├── LevelBar.tsx            # Level indicator
│   └── RecommendationCard.tsx  # Recommendation item
└── lib/
    ├── supabase.ts             # Supabase client
    ├── types.ts                # TypeScript types
    └── mockData.ts             # Mock data for demo
```

## Функциональность

### 1. Onboarding (Онбординг)
- Выбор специализации (нише)
- Добавление текущего оборудования
- Расчет score готовности

### 2. Dashboard (Дашборд)
- Визуализация setup score
- Radar-чарт покрытия по категориям
- Список текущего оборудования с статусами
- Топ рекомендации

### 3. Recommendations (Рекомендации)
- Фильтрация по приоритету
- Детальные карточки с обоснованием
- Интеграция с оборудованием

### 4. Profile (Профиль)
- Красивая карточка профиля
- Экспорт как изображение
- Ссылка для поделиться

## Demo Mode

Приложение работает в **demo-режиме без аутентификации**:
- Использует localStorage для сохранения данных
- Mock data для оборудования и рекомендаций
- Полностью функционально прямо из коробки

## Деплой на Vercel

### 1. Инициализация Git репо

```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Создание репо на GitHub

```bash
git remote add origin https://github.com/your-username/kitwise.git
git push -u origin main
```

### 3. Деплой на Vercel

```bash
npm i -g vercel
vercel
```

Или подключите через Vercel Dashboard через GitHub.

### 4. Окружение на Vercel

В Project Settings добавьте переменные окружения:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## API интеграция

Приложение интегрируется с Supabase. Необходимые таблицы:

- `niches` — Специализации
- `equipment_catalog` — Каталог оборудования
- `niche_requirements` — Требования по нишам
- `profiles` — Профили пользователей
- `user_equipment` — Оборудование пользователей
- `recommendations` — Рекомендации
- `profile_cards` — Карточки профилей

## Русский язык

Весь интерфейс полностью на русском языке.

## Лицензия

MIT

## Поддержка

Для вопросов и поддержки обращайтесь к документации или создавайте issues в репозитории.
