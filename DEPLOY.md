# KitWise — Быстрый деплой

## Вариант 1: Vercel (рекомендуется) — 2 минуты

```bash
# 1. Откройте терминал в папке kitwise-app
cd kitwise-app

# 2. Установите зависимости
npm install

# 3. Проверьте локально
npm run dev
# Откройте http://localhost:3000

# 4. Задеплойте на Vercel
npx vercel
# Следуйте инструкциям, добавьте env variables:
# NEXT_PUBLIC_SUPABASE_URL = https://flvenizwibruskyhxowa.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY = (ключ из .env.local)
```

## Вариант 2: Через GitHub + Vercel Dashboard

1. Создайте репозиторий на GitHub
2. Push этот проект в него
3. Зайдите на https://vercel.com/new
4. Импортируйте репозиторий
5. Добавьте Environment Variables из .env.local
6. Deploy!

## Supabase уже настроен

- Проект: kitwise
- URL: https://flvenizwibruskyhxowa.supabase.co
- 9 таблиц развёрнуты с данными
- Edge Function `recommend` работает
- RLS политики включены

## Edge Function API

```bash
curl -X POST https://flvenizwibruskyhxowa.supabase.co/functions/v1/recommend \
  -H "Content-Type: application/json" \
  -d '{"niche_slug": "wedding", "owned_categories": ["camera", "lens"]}'
```
