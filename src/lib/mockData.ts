import { Niche, EquipmentCatalog, NicheRequirement } from './types'

export const mockNiches: Niche[] = [
  {
    id: '1',
    name: 'Портретная фотография',
    slug: 'portrait',
    icon: '👤',
    description: 'Профессиональная съемка портретов и headshots',
    parent_id: null,
    sort_order: 1,
  },
  {
    id: '2',
    name: 'Пейзажная фотография',
    slug: 'landscape',
    icon: '🏔️',
    description: 'Природные и архитектурные пейзажи',
    parent_id: null,
    sort_order: 2,
  },
  {
    id: '3',
    name: 'Свадебная фотография',
    slug: 'wedding',
    icon: '💍',
    description: 'Съемка свадебных событий и церемоний',
    parent_id: null,
    sort_order: 3,
  },
  {
    id: '4',
    name: 'Предметная фотография',
    slug: 'product',
    icon: '📦',
    description: 'Съемка товаров для каталогов и e-commerce',
    parent_id: null,
    sort_order: 4,
  },
  {
    id: '5',
    name: 'Спортивная фотография',
    slug: 'sports',
    icon: '⚽',
    description: 'Съемка спортивных событий и соревнований',
    parent_id: null,
    sort_order: 5,
  },
  {
    id: '6',
    name: 'Видеография',
    slug: 'video',
    icon: '🎬',
    description: 'Профессиональная видеосъемка и видеомонтаж',
    parent_id: null,
    sort_order: 6,
  },
  {
    id: '7',
    name: 'Стрит-фотография',
    slug: 'street',
    icon: '🌆',
    description: 'Уличная документальная фотография',
    parent_id: null,
    sort_order: 7,
  },
  {
    id: '8',
    name: 'Фуд-фотография',
    slug: 'food',
    icon: '🍽️',
    description: 'Съемка блюд и напитков для ресторанов и брендов',
    parent_id: null,
    sort_order: 8,
  },
  {
    id: '9',
    name: 'Недвижимость',
    slug: 'realestate',
    icon: '🏠',
    description: 'Интерьерная и экстерьерная фотография',
    parent_id: null,
    sort_order: 9,
  },
  {
    id: '10',
    name: 'Контент-криэйтор',
    slug: 'content',
    icon: '📱',
    description: 'Создание контента для YouTube, Instagram, TikTok',
    parent_id: null,
    sort_order: 10,
  },
]

// =====================================================
// ПОЛНЫЙ КАТАЛОГ ОБОРУДОВАНИЯ
// =====================================================

let _id = 0
const nextId = () => String(++_id)

// --------------- КАМЕРЫ ---------------

// ---- Canon ----
const canonCameras: EquipmentCatalog[] = [
  { id: nextId(), name: 'Canon EOS R1', brand: 'Canon', category: 'Camera', subcategory: 'Mirrorless', description: 'Флагманская профессиональная беззеркалка, 24 МП, 40 к/с, 8K видео', price_min: 6300, price_max: 6500, image_url: null, specs: { resolution: '24MP', sensor: 'Full Frame', iso: '100-102400', video: '8K30' } },
  { id: nextId(), name: 'Canon EOS R5 Mark II', brand: 'Canon', category: 'Camera', subcategory: 'Mirrorless', description: '45 МП, 8K 60p RAW, AI-автофокус нового поколения', price_min: 4300, price_max: 4500, image_url: null, specs: { resolution: '45MP', sensor: 'Full Frame', iso: '100-102400', video: '8K60' } },
  { id: nextId(), name: 'Canon EOS R5', brand: 'Canon', category: 'Camera', subcategory: 'Mirrorless', description: '45 МП, 8K видео, проверенная временем рабочая лошадка', price_min: 3500, price_max: 3900, image_url: null, specs: { resolution: '45MP', sensor: 'Full Frame', iso: '100-51200', video: '8K30' } },
  { id: nextId(), name: 'Canon EOS R6 Mark III', brand: 'Canon', category: 'Camera', subcategory: 'Mirrorless', description: '24 МП, 40 к/с, отличный универсал для фото и видео', price_min: 2500, price_max: 2800, image_url: null, specs: { resolution: '24MP', sensor: 'Full Frame', iso: '100-204800', video: '6K60' } },
  { id: nextId(), name: 'Canon EOS R6 Mark II', brand: 'Canon', category: 'Camera', subcategory: 'Mirrorless', description: '24 МП, 40 к/с, отличная для свадеб и портретов', price_min: 2200, price_max: 2500, image_url: null, specs: { resolution: '24MP', sensor: 'Full Frame', iso: '100-204800', video: '4K60' } },
  { id: nextId(), name: 'Canon EOS R8', brand: 'Canon', category: 'Camera', subcategory: 'Mirrorless', description: 'Легкая полнокадровая камера, идеальна для начинающих', price_min: 1400, price_max: 1600, image_url: null, specs: { resolution: '24MP', sensor: 'Full Frame', iso: '100-204800', video: '4K60' } },
  { id: nextId(), name: 'Canon EOS R7', brand: 'Canon', category: 'Camera', subcategory: 'Mirrorless', description: 'APS-C камера для спорта и дикой природы, 32 МП, 30 к/с', price_min: 1400, price_max: 1500, image_url: null, specs: { resolution: '32MP', sensor: 'APS-C', iso: '100-51200', video: '4K60' } },
  { id: nextId(), name: 'Canon EOS R10', brand: 'Canon', category: 'Camera', subcategory: 'Mirrorless', description: 'Компактная APS-C камера для контент-криэйторов', price_min: 900, price_max: 1000, image_url: null, specs: { resolution: '24MP', sensor: 'APS-C', iso: '100-51200', video: '4K60' } },
  { id: nextId(), name: 'Canon EOS R50', brand: 'Canon', category: 'Camera', subcategory: 'Mirrorless', description: 'Самая доступная RF камера для новичков и влогеров', price_min: 650, price_max: 750, image_url: null, specs: { resolution: '24MP', sensor: 'APS-C', iso: '100-51200', video: '4K30' } },
  { id: nextId(), name: 'Canon EOS R100', brand: 'Canon', category: 'Camera', subcategory: 'Mirrorless', description: 'Ультрабюджетная RF камера', price_min: 400, price_max: 500, image_url: null, specs: { resolution: '24MP', sensor: 'APS-C', iso: '100-12800', video: '4K' } },
]

// ---- Sony ----
const sonyCameras: EquipmentCatalog[] = [
  { id: nextId(), name: 'Sony A9 III', brand: 'Sony', category: 'Camera', subcategory: 'Mirrorless', description: 'Первая камера с глобальным затвором, 120 к/с, для спорта', price_min: 6000, price_max: 6500, image_url: null, specs: { resolution: '24MP', sensor: 'Full Frame Global Shutter', iso: '250-25600', video: '4K120' } },
  { id: nextId(), name: 'Sony A1', brand: 'Sony', category: 'Camera', subcategory: 'Mirrorless', description: 'Флагман: 50 МП, 30 к/с, 8K видео, всё-в-одном', price_min: 6500, price_max: 6500, image_url: null, specs: { resolution: '50MP', sensor: 'Full Frame', iso: '100-32000', video: '8K30' } },
  { id: nextId(), name: 'Sony A7R V', brand: 'Sony', category: 'Camera', subcategory: 'Mirrorless', description: '61 МП, AI-автофокус, для высокодетальной съемки', price_min: 3900, price_max: 4200, image_url: null, specs: { resolution: '61MP', sensor: 'Full Frame', iso: '100-32000', video: '8K' } },
  { id: nextId(), name: 'Sony A7 IV', brand: 'Sony', category: 'Camera', subcategory: 'Mirrorless', description: '33 МП, универсальная гибридная камера', price_min: 2500, price_max: 2700, image_url: null, specs: { resolution: '33MP', sensor: 'Full Frame', iso: '100-51200', video: '4K60' } },
  { id: nextId(), name: 'Sony A7C II', brand: 'Sony', category: 'Camera', subcategory: 'Mirrorless', description: 'Компактная полнокадровая камера, 33 МП', price_min: 2100, price_max: 2300, image_url: null, specs: { resolution: '33MP', sensor: 'Full Frame', iso: '100-51200', video: '4K60' } },
  { id: nextId(), name: 'Sony A7CR', brand: 'Sony', category: 'Camera', subcategory: 'Mirrorless', description: 'Компактная 61 МП камера для высокого разрешения', price_min: 2900, price_max: 3200, image_url: null, specs: { resolution: '61MP', sensor: 'Full Frame', iso: '100-32000', video: '4K60' } },
  { id: nextId(), name: 'Sony A7S III', brand: 'Sony', category: 'Camera', subcategory: 'Mirrorless', description: '12 МП, лучшая для видео при слабом свете', price_min: 3500, price_max: 3700, image_url: null, specs: { resolution: '12MP', sensor: 'Full Frame', iso: '80-102400', video: '4K120' } },
  { id: nextId(), name: 'Sony FX30', brand: 'Sony', category: 'Camera', subcategory: 'Cinema', description: 'Кинокамера APS-C формата, отличная для видеографов', price_min: 1800, price_max: 2000, image_url: null, specs: { resolution: '26MP', sensor: 'APS-C', iso: '100-32000', video: '4K120' } },
  { id: nextId(), name: 'Sony FX3', brand: 'Sony', category: 'Camera', subcategory: 'Cinema', description: 'Полнокадровая кинокамера в компактном корпусе', price_min: 3900, price_max: 4000, image_url: null, specs: { resolution: '12MP', sensor: 'Full Frame', iso: '80-102400', video: '4K120' } },
  { id: nextId(), name: 'Sony FX6', brand: 'Sony', category: 'Camera', subcategory: 'Cinema', description: 'Профессиональная кинокамера, 10.2 МП, 4K120', price_min: 5800, price_max: 6200, image_url: null, specs: { resolution: '10MP', sensor: 'Full Frame', iso: '800-12800', video: '4K120' } },
  { id: nextId(), name: 'Sony A6700', brand: 'Sony', category: 'Camera', subcategory: 'Mirrorless', description: 'Топовая APS-C камера Sony, 26 МП, AI AF', price_min: 1400, price_max: 1500, image_url: null, specs: { resolution: '26MP', sensor: 'APS-C', iso: '100-32000', video: '4K120' } },
  { id: nextId(), name: 'Sony ZV-E10 II', brand: 'Sony', category: 'Camera', subcategory: 'Vlog', description: 'Камера для влогеров с APS-C сенсором', price_min: 900, price_max: 1000, image_url: null, specs: { resolution: '26MP', sensor: 'APS-C', iso: '100-32000', video: '4K60' } },
  { id: nextId(), name: 'Sony ZV-E1', brand: 'Sony', category: 'Camera', subcategory: 'Vlog', description: 'Полнокадровая камера для влогеров, 12 МП', price_min: 2200, price_max: 2400, image_url: null, specs: { resolution: '12MP', sensor: 'Full Frame', iso: '80-102400', video: '4K120' } },
]

// ---- Nikon ----
const nikonCameras: EquipmentCatalog[] = [
  { id: nextId(), name: 'Nikon Z9', brand: 'Nikon', category: 'Camera', subcategory: 'Mirrorless', description: 'Флагман Nikon, 45 МП, 120 к/с, 8K видео', price_min: 5500, price_max: 5700, image_url: null, specs: { resolution: '45MP', sensor: 'Full Frame', iso: '64-25600', video: '8K30' } },
  { id: nextId(), name: 'Nikon Z8', brand: 'Nikon', category: 'Camera', subcategory: 'Mirrorless', description: '45 МП, Z9 в компактном корпусе', price_min: 4000, price_max: 4200, image_url: null, specs: { resolution: '45MP', sensor: 'Full Frame', iso: '64-25600', video: '8K30' } },
  { id: nextId(), name: 'Nikon Zf', brand: 'Nikon', category: 'Camera', subcategory: 'Mirrorless', description: 'Ретро-стиль, 24 МП полный кадр, IBIS', price_min: 2000, price_max: 2200, image_url: null, specs: { resolution: '24MP', sensor: 'Full Frame', iso: '100-64000', video: '4K60' } },
  { id: nextId(), name: 'Nikon Z6 III', brand: 'Nikon', category: 'Camera', subcategory: 'Mirrorless', description: '24 МП, частично stacked сенсор, для событийной съемки', price_min: 2500, price_max: 2700, image_url: null, specs: { resolution: '24MP', sensor: 'Full Frame', iso: '100-64000', video: '6K60' } },
  { id: nextId(), name: 'Nikon Z5', brand: 'Nikon', category: 'Camera', subcategory: 'Mirrorless', description: 'Бюджетная полнокадровая камера', price_min: 1200, price_max: 1400, image_url: null, specs: { resolution: '24MP', sensor: 'Full Frame', iso: '100-51200', video: '4K30' } },
  { id: nextId(), name: 'Nikon Z50 II', brand: 'Nikon', category: 'Camera', subcategory: 'Mirrorless', description: 'Обновленная APS-C камера для контента', price_min: 1000, price_max: 1100, image_url: null, specs: { resolution: '20MP', sensor: 'APS-C', iso: '100-51200', video: '4K60' } },
  { id: nextId(), name: 'Nikon Zfc', brand: 'Nikon', category: 'Camera', subcategory: 'Mirrorless', description: 'Стильная ретро-камера APS-C', price_min: 900, price_max: 1000, image_url: null, specs: { resolution: '20MP', sensor: 'APS-C', iso: '100-51200', video: '4K30' } },
]

// ---- Fujifilm ----
const fujiCameras: EquipmentCatalog[] = [
  { id: nextId(), name: 'Fujifilm GFX 100S II', brand: 'Fujifilm', category: 'Camera', subcategory: 'Medium Format', description: 'Среднеформатная камера 102 МП в компактном корпусе', price_min: 4500, price_max: 5000, image_url: null, specs: { resolution: '102MP', sensor: 'Medium Format', iso: '80-12800', video: '4K30' } },
  { id: nextId(), name: 'Fujifilm GFX 100 II', brand: 'Fujifilm', category: 'Camera', subcategory: 'Medium Format', description: 'Флагманская среднеформатная камера, 102 МП, 8 к/с', price_min: 7500, price_max: 7500, image_url: null, specs: { resolution: '102MP', sensor: 'Medium Format', iso: '80-12800', video: '8K' } },
  { id: nextId(), name: 'Fujifilm X-T5', brand: 'Fujifilm', category: 'Camera', subcategory: 'Mirrorless', description: '40 МП, культовый дизайн, отличные цвета', price_min: 1700, price_max: 1900, image_url: null, specs: { resolution: '40MP', sensor: 'APS-C', iso: '125-12800', video: '6.2K30' } },
  { id: nextId(), name: 'Fujifilm X-H2S', brand: 'Fujifilm', category: 'Camera', subcategory: 'Mirrorless', description: 'Скоростная камера: 40 к/с, 6.2K видео', price_min: 2500, price_max: 2600, image_url: null, specs: { resolution: '26MP', sensor: 'APS-C', iso: '160-12800', video: '6.2K30' } },
  { id: nextId(), name: 'Fujifilm X-H2', brand: 'Fujifilm', category: 'Camera', subcategory: 'Mirrorless', description: '40 МП, 8K видео, для высокого разрешения', price_min: 2000, price_max: 2200, image_url: null, specs: { resolution: '40MP', sensor: 'APS-C', iso: '125-12800', video: '8K' } },
  { id: nextId(), name: 'Fujifilm X-S20', brand: 'Fujifilm', category: 'Camera', subcategory: 'Mirrorless', description: 'Компактная камера для влогеров, 26 МП', price_min: 1300, price_max: 1400, image_url: null, specs: { resolution: '26MP', sensor: 'APS-C', iso: '160-12800', video: '6.2K30' } },
  { id: nextId(), name: 'Fujifilm X100VI', brand: 'Fujifilm', category: 'Camera', subcategory: 'Compact', description: 'Культовая компактная камера, 40 МП, 23mm f/2', price_min: 1600, price_max: 1800, image_url: null, specs: { resolution: '40MP', sensor: 'APS-C', iso: '125-12800', lens: '23mm f/2' } },
]

// ---- Panasonic ----
const panasonicCameras: EquipmentCatalog[] = [
  { id: nextId(), name: 'Panasonic S5 IIX', brand: 'Panasonic', category: 'Camera', subcategory: 'Mirrorless', description: 'Полнокадровая гибридная камера, фазовый AF', price_min: 2200, price_max: 2400, image_url: null, specs: { resolution: '24MP', sensor: 'Full Frame', iso: '100-51200', video: '6K30' } },
  { id: nextId(), name: 'Panasonic S5 II', brand: 'Panasonic', category: 'Camera', subcategory: 'Mirrorless', description: '24 МП, первая Panasonic с фазовым AF', price_min: 2000, price_max: 2200, image_url: null, specs: { resolution: '24MP', sensor: 'Full Frame', iso: '100-51200', video: '6K30' } },
  { id: nextId(), name: 'Panasonic GH7', brand: 'Panasonic', category: 'Camera', subcategory: 'Mirrorless', description: 'Профессиональная MFT видеокамера, 5.7K ProRes', price_min: 2200, price_max: 2300, image_url: null, specs: { resolution: '25MP', sensor: 'MFT', iso: '100-25600', video: '5.7K60 ProRes' } },
  { id: nextId(), name: 'Panasonic G9 II', brand: 'Panasonic', category: 'Camera', subcategory: 'Mirrorless', description: 'MFT камера для фотографов: 25 МП, фазовый AF', price_min: 1700, price_max: 1800, image_url: null, specs: { resolution: '25MP', sensor: 'MFT', iso: '100-25600', video: '5.7K30' } },
  { id: nextId(), name: 'Panasonic S1H', brand: 'Panasonic', category: 'Camera', subcategory: 'Cinema', description: 'Полнокадровая кинокамера, Netflix-certified', price_min: 3500, price_max: 4000, image_url: null, specs: { resolution: '24MP', sensor: 'Full Frame', iso: '100-51200', video: '6K24' } },
]

// ---- Leica & Hasselblad ----
const premiumCameras: EquipmentCatalog[] = [
  { id: nextId(), name: 'Leica SL3', brand: 'Leica', category: 'Camera', subcategory: 'Mirrorless', description: '60 МП полнокадровая камера, немецкое качество', price_min: 6900, price_max: 7200, image_url: null, specs: { resolution: '60MP', sensor: 'Full Frame', iso: '50-100000', video: '8K' } },
  { id: nextId(), name: 'Leica Q3', brand: 'Leica', category: 'Camera', subcategory: 'Compact', description: '60 МП компакт с фиксом 28mm f/1.7', price_min: 5800, price_max: 6000, image_url: null, specs: { resolution: '60MP', sensor: 'Full Frame', iso: '50-100000', lens: '28mm f/1.7' } },
  { id: nextId(), name: 'Hasselblad X2D 100C', brand: 'Hasselblad', category: 'Camera', subcategory: 'Medium Format', description: 'Среднеформатная камера 100 МП, шведское качество', price_min: 8200, price_max: 8500, image_url: null, specs: { resolution: '100MP', sensor: 'Medium Format', iso: '64-25600', video: '2.7K' } },
]

// ---- DJI ----
const djiCameras: EquipmentCatalog[] = [
  { id: nextId(), name: 'DJI Osmo Pocket 3', brand: 'DJI', category: 'Camera', subcategory: 'Action', description: '1" CMOS, 4K120, встроенный стабилизатор', price_min: 500, price_max: 550, image_url: null, specs: { resolution: '4K', sensor: '1 inch', iso: '100-6400', video: '4K120' } },
  { id: nextId(), name: 'DJI Action 5 Pro', brand: 'DJI', category: 'Camera', subcategory: 'Action', description: 'Экшн-камера 4K120 с OLED-экраном', price_min: 350, price_max: 400, image_url: null, specs: { resolution: '4K', sensor: '1/1.3 inch', video: '4K120', waterproof: '20m' } },
]

// ---- GoPro ----
const goproCameras: EquipmentCatalog[] = [
  { id: nextId(), name: 'GoPro HERO13 Black', brand: 'GoPro', category: 'Camera', subcategory: 'Action', description: 'Флагманская экшн-камера, 5.3K60, GP-Log', price_min: 400, price_max: 450, image_url: null, specs: { resolution: '5.3K', video: '5.3K60', waterproof: '10m', stabilization: 'HyperSmooth 6.0' } },
]

// --------------- ОБЪЕКТИВЫ ---------------

// ---- Canon RF ----
const canonLenses: EquipmentCatalog[] = [
  { id: nextId(), name: 'Canon RF 24-70mm f/2.8L IS USM', brand: 'Canon', category: 'Lens', subcategory: 'Zoom', description: 'Универсальный зум-объектив L-серии, стабилизация', price_min: 2300, price_max: 2500, image_url: null, specs: { focal_length: '24-70mm', aperture: 'f/2.8', mount: 'RF', weight: '900g' } },
  { id: nextId(), name: 'Canon RF 70-200mm f/2.8L IS USM', brand: 'Canon', category: 'Lens', subcategory: 'Telephoto', description: 'Профессиональный телезум L-серии', price_min: 2700, price_max: 2900, image_url: null, specs: { focal_length: '70-200mm', aperture: 'f/2.8', mount: 'RF', weight: '1070g' } },
  { id: nextId(), name: 'Canon RF 15-35mm f/2.8L IS USM', brand: 'Canon', category: 'Lens', subcategory: 'Wide', description: 'Широкоугольный зум L-серии', price_min: 2300, price_max: 2400, image_url: null, specs: { focal_length: '15-35mm', aperture: 'f/2.8', mount: 'RF', weight: '840g' } },
  { id: nextId(), name: 'Canon RF 50mm f/1.2L USM', brand: 'Canon', category: 'Lens', subcategory: 'Prime', description: 'Лучший 50mm в мире, невероятное боке', price_min: 2300, price_max: 2400, image_url: null, specs: { focal_length: '50mm', aperture: 'f/1.2', mount: 'RF', weight: '950g' } },
  { id: nextId(), name: 'Canon RF 85mm f/1.2L USM', brand: 'Canon', category: 'Lens', subcategory: 'Prime', description: 'Идеальный портретный объектив', price_min: 2800, price_max: 2900, image_url: null, specs: { focal_length: '85mm', aperture: 'f/1.2', mount: 'RF', weight: '1195g' } },
  { id: nextId(), name: 'Canon RF 35mm f/1.4L VCM', brand: 'Canon', category: 'Lens', subcategory: 'Prime', description: 'Светосильный 35mm с видео-мотором', price_min: 1500, price_max: 1600, image_url: null, specs: { focal_length: '35mm', aperture: 'f/1.4', mount: 'RF', weight: '730g' } },
  { id: nextId(), name: 'Canon RF 28-70mm f/2L USM', brand: 'Canon', category: 'Lens', subcategory: 'Zoom', description: 'Уникальный зум с диафрагмой f/2', price_min: 2900, price_max: 3100, image_url: null, specs: { focal_length: '28-70mm', aperture: 'f/2', mount: 'RF', weight: '1430g' } },
  { id: nextId(), name: 'Canon RF 100-500mm f/4.5-7.1L IS USM', brand: 'Canon', category: 'Lens', subcategory: 'Super Telephoto', description: 'Суперзум для дикой природы и спорта', price_min: 2700, price_max: 2900, image_url: null, specs: { focal_length: '100-500mm', aperture: 'f/4.5-7.1', mount: 'RF', weight: '1370g' } },
  { id: nextId(), name: 'Canon RF 50mm f/1.8 STM', brand: 'Canon', category: 'Lens', subcategory: 'Prime', description: 'Доступный «полтинник» для системы RF', price_min: 200, price_max: 250, image_url: null, specs: { focal_length: '50mm', aperture: 'f/1.8', mount: 'RF', weight: '160g' } },
  { id: nextId(), name: 'Canon RF 100mm f/2.8L Macro IS USM', brand: 'Canon', category: 'Lens', subcategory: 'Macro', description: 'Макро-объектив L-серии с SA-управлением боке', price_min: 1400, price_max: 1500, image_url: null, specs: { focal_length: '100mm', aperture: 'f/2.8', mount: 'RF', weight: '730g' } },
]

// ---- Sony FE / E ----
const sonyLenses: EquipmentCatalog[] = [
  { id: nextId(), name: 'Sony FE 24-70mm f/2.8 GM II', brand: 'Sony', category: 'Lens', subcategory: 'Zoom', description: 'Лучший универсальный зум — лёгкий, резкий, быстрый AF', price_min: 2300, price_max: 2400, image_url: null, specs: { focal_length: '24-70mm', aperture: 'f/2.8', mount: 'FE', weight: '695g' } },
  { id: nextId(), name: 'Sony FE 70-200mm f/2.8 GM OSS II', brand: 'Sony', category: 'Lens', subcategory: 'Telephoto', description: 'Профессиональный телезум, 1045g', price_min: 2800, price_max: 2900, image_url: null, specs: { focal_length: '70-200mm', aperture: 'f/2.8', mount: 'FE', weight: '1045g' } },
  { id: nextId(), name: 'Sony FE 16-35mm f/2.8 GM II', brand: 'Sony', category: 'Lens', subcategory: 'Wide', description: 'Широкоугольный зум G Master II поколения', price_min: 2300, price_max: 2400, image_url: null, specs: { focal_length: '16-35mm', aperture: 'f/2.8', mount: 'FE', weight: '547g' } },
  { id: nextId(), name: 'Sony FE 50mm f/1.4 GM', brand: 'Sony', category: 'Lens', subcategory: 'Prime', description: 'Премиальный полтинник G Master', price_min: 1300, price_max: 1400, image_url: null, specs: { focal_length: '50mm', aperture: 'f/1.4', mount: 'FE', weight: '516g' } },
  { id: nextId(), name: 'Sony FE 85mm f/1.4 GM', brand: 'Sony', category: 'Lens', subcategory: 'Prime', description: 'Портретный объектив G Master', price_min: 1800, price_max: 1900, image_url: null, specs: { focal_length: '85mm', aperture: 'f/1.4', mount: 'FE', weight: '820g' } },
  { id: nextId(), name: 'Sony FE 35mm f/1.4 GM', brand: 'Sony', category: 'Lens', subcategory: 'Prime', description: 'Светосильный 35mm G Master', price_min: 1400, price_max: 1500, image_url: null, specs: { focal_length: '35mm', aperture: 'f/1.4', mount: 'FE', weight: '524g' } },
  { id: nextId(), name: 'Sony FE 100-400mm f/4.5-5.6 GM OSS', brand: 'Sony', category: 'Lens', subcategory: 'Super Telephoto', description: 'Суперзум G Master для дикой природы', price_min: 2500, price_max: 2700, image_url: null, specs: { focal_length: '100-400mm', aperture: 'f/4.5-5.6', mount: 'FE', weight: '1395g' } },
  { id: nextId(), name: 'Sony FE 50mm f/1.8', brand: 'Sony', category: 'Lens', subcategory: 'Prime', description: 'Бюджетный полтинник для системы FE', price_min: 250, price_max: 300, image_url: null, specs: { focal_length: '50mm', aperture: 'f/1.8', mount: 'FE', weight: '186g' } },
  { id: nextId(), name: 'Sony FE 90mm f/2.8 Macro G OSS', brand: 'Sony', category: 'Lens', subcategory: 'Macro', description: 'Макро-объектив G-серии с OSS', price_min: 1000, price_max: 1100, image_url: null, specs: { focal_length: '90mm', aperture: 'f/2.8', mount: 'FE', weight: '602g' } },
  { id: nextId(), name: 'Sony FE 14mm f/1.8 GM', brand: 'Sony', category: 'Lens', subcategory: 'Ultra Wide', description: 'Сверхширокоугольный GM для астро и пейзажей', price_min: 1600, price_max: 1700, image_url: null, specs: { focal_length: '14mm', aperture: 'f/1.8', mount: 'FE', weight: '460g' } },
]

// ---- Nikon Z ----
const nikonLenses: EquipmentCatalog[] = [
  { id: nextId(), name: 'Nikon Z 24-70mm f/2.8 S', brand: 'Nikon', category: 'Lens', subcategory: 'Zoom', description: 'Профессиональный зум S-серии', price_min: 2300, price_max: 2400, image_url: null, specs: { focal_length: '24-70mm', aperture: 'f/2.8', mount: 'Z', weight: '805g' } },
  { id: nextId(), name: 'Nikon Z 70-200mm f/2.8 VR S', brand: 'Nikon', category: 'Lens', subcategory: 'Telephoto', description: 'Профессиональный телезум S-серии', price_min: 2700, price_max: 2800, image_url: null, specs: { focal_length: '70-200mm', aperture: 'f/2.8', mount: 'Z', weight: '1360g' } },
  { id: nextId(), name: 'Nikon Z 14-24mm f/2.8 S', brand: 'Nikon', category: 'Lens', subcategory: 'Ultra Wide', description: 'Сверхширокоугольный зум S-серии', price_min: 2500, price_max: 2600, image_url: null, specs: { focal_length: '14-24mm', aperture: 'f/2.8', mount: 'Z', weight: '650g' } },
  { id: nextId(), name: 'Nikon Z 50mm f/1.2 S', brand: 'Nikon', category: 'Lens', subcategory: 'Prime', description: 'Светосильный полтинник S-серии', price_min: 2100, price_max: 2200, image_url: null, specs: { focal_length: '50mm', aperture: 'f/1.2', mount: 'Z', weight: '1090g' } },
  { id: nextId(), name: 'Nikon Z 85mm f/1.2 S', brand: 'Nikon', category: 'Lens', subcategory: 'Prime', description: 'Портретный объектив высшего класса', price_min: 2800, price_max: 2900, image_url: null, specs: { focal_length: '85mm', aperture: 'f/1.2', mount: 'Z', weight: '1160g' } },
  { id: nextId(), name: 'Nikon Z 50mm f/1.8 S', brand: 'Nikon', category: 'Lens', subcategory: 'Prime', description: 'Компактный полтинник для системы Z', price_min: 600, price_max: 650, image_url: null, specs: { focal_length: '50mm', aperture: 'f/1.8', mount: 'Z', weight: '415g' } },
  { id: nextId(), name: 'Nikon Z 100-400mm f/4.5-5.6 VR S', brand: 'Nikon', category: 'Lens', subcategory: 'Super Telephoto', description: 'Суперзум для дикой природы', price_min: 2700, price_max: 2800, image_url: null, specs: { focal_length: '100-400mm', aperture: 'f/4.5-5.6', mount: 'Z', weight: '1355g' } },
]

// ---- Sigma ----
const sigmaLenses: EquipmentCatalog[] = [
  { id: nextId(), name: 'Sigma 24-70mm f/2.8 DG DN Art', brand: 'Sigma', category: 'Lens', subcategory: 'Zoom', description: 'Отличный зум Art-серии для Sony/L-mount', price_min: 1100, price_max: 1200, image_url: null, specs: { focal_length: '24-70mm', aperture: 'f/2.8', mount: 'Sony E / L', weight: '830g' } },
  { id: nextId(), name: 'Sigma 70-200mm f/2.8 DG DN OS Sport', brand: 'Sigma', category: 'Lens', subcategory: 'Telephoto', description: 'Спортивный телезум для Sony/L-mount', price_min: 1500, price_max: 1600, image_url: null, specs: { focal_length: '70-200mm', aperture: 'f/2.8', mount: 'Sony E / L', weight: '1345g' } },
  { id: nextId(), name: 'Sigma 14-24mm f/2.8 DG DN Art', brand: 'Sigma', category: 'Lens', subcategory: 'Ultra Wide', description: 'Сверхширокоугольный Art для пейзажей', price_min: 1300, price_max: 1400, image_url: null, specs: { focal_length: '14-24mm', aperture: 'f/2.8', mount: 'Sony E / L', weight: '795g' } },
  { id: nextId(), name: 'Sigma 35mm f/1.4 DG DN Art', brand: 'Sigma', category: 'Lens', subcategory: 'Prime', description: 'Культовый 35mm Art для беззеркалок', price_min: 700, price_max: 850, image_url: null, specs: { focal_length: '35mm', aperture: 'f/1.4', mount: 'Sony E / L', weight: '645g' } },
  { id: nextId(), name: 'Sigma 50mm f/1.4 DG DN Art', brand: 'Sigma', category: 'Lens', subcategory: 'Prime', description: 'Обновленный 50mm Art — лёгкий и резкий', price_min: 700, price_max: 800, image_url: null, specs: { focal_length: '50mm', aperture: 'f/1.4', mount: 'Sony E / L', weight: '520g' } },
  { id: nextId(), name: 'Sigma 85mm f/1.4 DG DN Art', brand: 'Sigma', category: 'Lens', subcategory: 'Prime', description: 'Портретный Art объектив', price_min: 1000, price_max: 1100, image_url: null, specs: { focal_length: '85mm', aperture: 'f/1.4', mount: 'Sony E / L', weight: '630g' } },
  { id: nextId(), name: 'Sigma 100-400mm f/5-6.3 DG DN OS', brand: 'Sigma', category: 'Lens', subcategory: 'Super Telephoto', description: 'Бюджетный суперзум Contemporary', price_min: 800, price_max: 900, image_url: null, specs: { focal_length: '100-400mm', aperture: 'f/5-6.3', mount: 'Sony E / L', weight: '1135g' } },
  { id: nextId(), name: 'Sigma 150-600mm f/5-6.3 DG DN OS Sport', brand: 'Sigma', category: 'Lens', subcategory: 'Super Telephoto', description: 'Суперзум для дикой природы и авиации', price_min: 1500, price_max: 1600, image_url: null, specs: { focal_length: '150-600mm', aperture: 'f/5-6.3', mount: 'Sony E / L', weight: '2100g' } },
]

// ---- Tamron ----
const tamronLenses: EquipmentCatalog[] = [
  { id: nextId(), name: 'Tamron 28-75mm f/2.8 Di III VXD G2', brand: 'Tamron', category: 'Lens', subcategory: 'Zoom', description: 'Отличный бюджетный зум f/2.8 для Sony', price_min: 800, price_max: 900, image_url: null, specs: { focal_length: '28-75mm', aperture: 'f/2.8', mount: 'Sony E', weight: '540g' } },
  { id: nextId(), name: 'Tamron 70-180mm f/2.8 Di III VXD G2', brand: 'Tamron', category: 'Lens', subcategory: 'Telephoto', description: 'Компактный телезум f/2.8 для Sony', price_min: 1200, price_max: 1300, image_url: null, specs: { focal_length: '70-180mm', aperture: 'f/2.8', mount: 'Sony E', weight: '855g' } },
  { id: nextId(), name: 'Tamron 17-28mm f/2.8 Di III RXD', brand: 'Tamron', category: 'Lens', subcategory: 'Wide', description: 'Бюджетный широкоугольник для Sony', price_min: 800, price_max: 900, image_url: null, specs: { focal_length: '17-28mm', aperture: 'f/2.8', mount: 'Sony E', weight: '420g' } },
  { id: nextId(), name: 'Tamron 35-150mm f/2-2.8 Di III VXD', brand: 'Tamron', category: 'Lens', subcategory: 'Zoom', description: 'Один зум вместо двух: от 35 до 150мм', price_min: 1900, price_max: 2000, image_url: null, specs: { focal_length: '35-150mm', aperture: 'f/2-2.8', mount: 'Sony E', weight: '1165g' } },
  { id: nextId(), name: 'Tamron 50-400mm f/4.5-6.3 Di III VC VXD', brand: 'Tamron', category: 'Lens', subcategory: 'Super Telephoto', description: 'Ультразум 50-400 для путешествий', price_min: 1300, price_max: 1400, image_url: null, specs: { focal_length: '50-400mm', aperture: 'f/4.5-6.3', mount: 'Sony E', weight: '1155g' } },
]

// --------------- ВСПЫШКИ ---------------

const flashes: EquipmentCatalog[] = [
  // Godox
  { id: nextId(), name: 'Godox V1', brand: 'Godox', category: 'Flash', subcategory: 'Speedlight', description: 'Круглоголовая вспышка TTL/HSS, все системы', price_min: 250, price_max: 300, image_url: null, specs: { power: '76Ws', recycle: '1.5s', guide_number: '60m' } },
  { id: nextId(), name: 'Godox V860 III', brand: 'Godox', category: 'Flash', subcategory: 'Speedlight', description: 'Вспышка с литиевой батареей, TTL/HSS', price_min: 180, price_max: 220, image_url: null, specs: { power: '60Ws', recycle: '1.5s', guide_number: '60m' } },
  { id: nextId(), name: 'Godox AD200 Pro', brand: 'Godox', category: 'Flash', subcategory: 'Portable Strobe', description: 'Портативная вспышка 200Ws, карманный размер', price_min: 350, price_max: 400, image_url: null, specs: { power: '200Ws', recycle: '0.01-1.8s', battery: '500 вспышек' } },
  { id: nextId(), name: 'Godox AD300 Pro', brand: 'Godox', category: 'Flash', subcategory: 'Portable Strobe', description: 'Мощная портативная вспышка 300Ws', price_min: 500, price_max: 550, image_url: null, specs: { power: '300Ws', recycle: '0.01-1.5s', battery: '320 вспышек' } },
  { id: nextId(), name: 'Godox AD400 Pro', brand: 'Godox', category: 'Flash', subcategory: 'Monolight', description: 'Студийный моноблок 400Ws на аккумуляторе', price_min: 650, price_max: 750, image_url: null, specs: { power: '400Ws', recycle: '0.01-1s', battery: '390 вспышек' } },
  { id: nextId(), name: 'Godox AD600 Pro', brand: 'Godox', category: 'Flash', subcategory: 'Monolight', description: 'Мощный моноблок 600Ws на аккумуляторе', price_min: 900, price_max: 1000, image_url: null, specs: { power: '600Ws', recycle: '0.01-0.9s', battery: '360 вспышек' } },
  { id: nextId(), name: 'Godox X2T', brand: 'Godox', category: 'Flash', subcategory: 'Trigger', description: 'Радиосинхронизатор TTL для Godox вспышек', price_min: 60, price_max: 80, image_url: null, specs: { range: '100m', channels: '5 групп, 32 канала', type: 'TTL/HSS' } },
  { id: nextId(), name: 'Godox XPro II', brand: 'Godox', category: 'Flash', subcategory: 'Trigger', description: 'Профессиональный радиосинхронизатор', price_min: 80, price_max: 100, image_url: null, specs: { range: '100m', channels: '16 групп, 32 канала', type: 'TTL/HSS/Multi' } },

  // Profoto
  { id: nextId(), name: 'Profoto A2', brand: 'Profoto', category: 'Flash', subcategory: 'Speedlight', description: 'Профессиональная вспышка с круглой головой', price_min: 1100, price_max: 1200, image_url: null, specs: { power: '76Ws', recycle: '1s', guide_number: '66m' } },
  { id: nextId(), name: 'Profoto B10X', brand: 'Profoto', category: 'Flash', subcategory: 'Monolight', description: 'Портативная студийная вспышка 250Ws', price_min: 2000, price_max: 2200, image_url: null, specs: { power: '250Ws', recycle: '0.05-2.2s', battery: '400 вспышек' } },
  { id: nextId(), name: 'Profoto B10X Plus', brand: 'Profoto', category: 'Flash', subcategory: 'Monolight', description: 'Мощная портативная вспышка 500Ws', price_min: 3000, price_max: 3200, image_url: null, specs: { power: '500Ws', recycle: '0.05-2.5s', battery: '200 вспышек' } },

  // Canon / Nikon / Sony
  { id: nextId(), name: 'Canon Speedlite EL-5', brand: 'Canon', category: 'Flash', subcategory: 'Speedlight', description: 'Топовая вспышка Canon с литиевой батареей', price_min: 400, price_max: 450, image_url: null, specs: { guide_number: '60m', recycle: '0.1-1.2s', battery: 'LP-EL' } },
  { id: nextId(), name: 'Nikon SB-5000', brand: 'Nikon', category: 'Flash', subcategory: 'Speedlight', description: 'Флагманская вспышка Nikon с радиоуправлением', price_min: 550, price_max: 600, image_url: null, specs: { guide_number: '55m', recycle: '1.8s', radio: 'Встроенный' } },
  { id: nextId(), name: 'Sony HVL-F60RM2', brand: 'Sony', category: 'Flash', subcategory: 'Speedlight', description: 'Флагманская вспышка Sony с радиоуправлением', price_min: 600, price_max: 650, image_url: null, specs: { guide_number: '60m', recycle: '1.7s', radio: 'Встроенный' } },
]

// --------------- ПОСТОЯННЫЙ СВЕТ ---------------

const lighting: EquipmentCatalog[] = [
  // Aputure
  { id: nextId(), name: 'Aputure 600d Pro', brand: 'Aputure', category: 'Lighting', subcategory: 'LED COB', description: 'Профессиональный 600W LED, Bowens mount', price_min: 1700, price_max: 1900, image_url: null, specs: { power: '600W', color_temp: '5600K', CRI: '96+', TLCI: '96+' } },
  { id: nextId(), name: 'Aputure 300d Mark III', brand: 'Aputure', category: 'Lighting', subcategory: 'LED COB', description: '300W COB LED, стандарт индустрии', price_min: 1100, price_max: 1200, image_url: null, specs: { power: '300W', color_temp: '5600K', CRI: '96+', TLCI: '97+' } },
  { id: nextId(), name: 'Aputure 150C', brand: 'Aputure', category: 'Lighting', subcategory: 'LED COB', description: 'Компактный RGBWW COB LED', price_min: 700, price_max: 800, image_url: null, specs: { power: '150W', color_temp: '2000-10000K', CRI: '95+', type: 'RGBWW' } },
  { id: nextId(), name: 'Aputure MC Pro', brand: 'Aputure', category: 'Lighting', subcategory: 'LED Panel', description: 'Карманный RGBWW панельный свет', price_min: 250, price_max: 300, image_url: null, specs: { power: '10W', color_temp: '2000-10000K', CRI: '96+', type: 'RGBWW' } },
  { id: nextId(), name: 'Aputure Nova P600c', brand: 'Aputure', category: 'Lighting', subcategory: 'LED Panel', description: 'Гибкий RGBWW LED панель 600W, для кино', price_min: 3500, price_max: 4000, image_url: null, specs: { power: '600W', color_temp: '2000-10000K', CRI: '95+', size: '2x1 ft' } },

  // Nanlite
  { id: nextId(), name: 'Nanlite Forza 300B II', brand: 'Nanlite', category: 'Lighting', subcategory: 'LED COB', description: 'Bi-color COB LED, 300W', price_min: 700, price_max: 800, image_url: null, specs: { power: '300W', color_temp: '2700-6500K', CRI: '96+', TLCI: '97+' } },
  { id: nextId(), name: 'Nanlite Forza 500B II', brand: 'Nanlite', category: 'Lighting', subcategory: 'LED COB', description: 'Мощный bi-color COB LED, 500W', price_min: 1100, price_max: 1200, image_url: null, specs: { power: '500W', color_temp: '2700-6500K', CRI: '97+', TLCI: '98+' } },
  { id: nextId(), name: 'Nanlite PavoTube II 30X', brand: 'Nanlite', category: 'Lighting', subcategory: 'LED Tube', description: 'RGBWW LED тюб 4 фута, эффекты', price_min: 350, price_max: 400, image_url: null, specs: { power: '25W', color_temp: '2700-12000K', CRI: '97+', length: '4ft' } },
  { id: nextId(), name: 'Nanlite PavoSlim 120C', brand: 'Nanlite', category: 'Lighting', subcategory: 'LED Panel', description: 'Тонкая RGBWW LED панель', price_min: 600, price_max: 700, image_url: null, specs: { power: '120W', color_temp: '2700-6500K', CRI: '96+', size: '2x1 ft' } },

  // Zhiyun
  { id: nextId(), name: 'Zhiyun Molus X100', brand: 'Zhiyun', category: 'Lighting', subcategory: 'LED COB', description: 'Ультракомпактный 100W COB LED', price_min: 250, price_max: 300, image_url: null, specs: { power: '100W', color_temp: '2700-6500K', CRI: '95+', weight: '400g' } },
  { id: nextId(), name: 'Zhiyun Molus X200', brand: 'Zhiyun', category: 'Lighting', subcategory: 'LED COB', description: 'Компактный 200W bi-color COB', price_min: 400, price_max: 450, image_url: null, specs: { power: '200W', color_temp: '2700-6500K', CRI: '96+', weight: '800g' } },

  // Elgato (для контент-криэйторов)
  { id: nextId(), name: 'Elgato Key Light', brand: 'Elgato', category: 'Lighting', subcategory: 'LED Panel', description: 'LED панель для стримеров и видеозвонков', price_min: 180, price_max: 200, image_url: null, specs: { power: '45W', color_temp: '2900-7000K', lumens: '2800', control: 'WiFi' } },
  { id: nextId(), name: 'Elgato Ring Light', brand: 'Elgato', category: 'Lighting', subcategory: 'Ring Light', description: 'Кольцевой свет для контента', price_min: 180, price_max: 200, image_url: null, specs: { power: '50W', color_temp: '2900-7000K', lumens: '2500', control: 'WiFi' } },
]

// ---- Световые модификаторы ----
const lightModifiers: EquipmentCatalog[] = [
  { id: nextId(), name: 'Aputure Light Dome III', brand: 'Aputure', category: 'Lighting', subcategory: 'Softbox', description: 'Октабокс 34", быстрая сборка', price_min: 200, price_max: 250, image_url: null, specs: { size: '85cm', shape: 'Octabox', mount: 'Bowens' } },
  { id: nextId(), name: 'Aputure Lantern 90', brand: 'Aputure', category: 'Lighting', subcategory: 'Softbox', description: 'Китайский фонарик-рассеиватель 90cm', price_min: 120, price_max: 150, image_url: null, specs: { size: '90cm', shape: 'Lantern', mount: 'Bowens' } },
  { id: nextId(), name: 'Godox QR-P90T', brand: 'Godox', category: 'Lighting', subcategory: 'Softbox', description: 'Быстроскладной параболический софтбокс', price_min: 100, price_max: 130, image_url: null, specs: { size: '90cm', shape: 'Parabolic', mount: 'Bowens' } },
]

// --------------- ШТАТИВЫ И СТАБИЛИЗАТОРЫ ---------------

const support: EquipmentCatalog[] = [
  // Штативы
  { id: nextId(), name: 'Peak Design Travel Tripod', brand: 'Peak Design', category: 'Support', subcategory: 'Tripod', description: 'Самый компактный карбоновый штатив в мире', price_min: 600, price_max: 650, image_url: null, specs: { max_height: '152cm', max_load: '9kg', weight: '1.27kg', material: 'Carbon' } },
  { id: nextId(), name: 'Manfrotto Befree Advanced', brand: 'Manfrotto', category: 'Support', subcategory: 'Tripod', description: 'Легкий алюминиевый штатив для путешествий', price_min: 250, price_max: 300, image_url: null, specs: { max_height: '150cm', max_load: '8kg', weight: '1.49kg', material: 'Aluminum' } },
  { id: nextId(), name: 'Manfrotto 055', brand: 'Manfrotto', category: 'Support', subcategory: 'Tripod', description: 'Профессиональный студийный штатив', price_min: 400, price_max: 500, image_url: null, specs: { max_height: '183cm', max_load: '12kg', weight: '2.5kg', material: 'Aluminum' } },
  { id: nextId(), name: 'Gitzo Traveler GT1545T', brand: 'Gitzo', category: 'Support', subcategory: 'Tripod', description: 'Премиальный карбоновый штатив Gitzo', price_min: 800, price_max: 900, image_url: null, specs: { max_height: '163cm', max_load: '10kg', weight: '1.1kg', material: 'Carbon' } },
  { id: nextId(), name: 'SmallRig FreeBlazer AP-01', brand: 'SmallRig', category: 'Support', subcategory: 'Tripod', description: 'Штатив с 180° центральной колонной', price_min: 200, price_max: 250, image_url: null, specs: { max_height: '161cm', max_load: '15kg', weight: '1.7kg', material: 'Aluminum' } },

  // Стабилизаторы
  { id: nextId(), name: 'DJI RS 4 Pro', brand: 'DJI', category: 'Support', subcategory: 'Gimbal', description: 'Профессиональный стабилизатор для камер до 4.5 кг', price_min: 800, price_max: 900, image_url: null, specs: { payload: '4.5kg', runtime: '12h', axis: '3-axis' } },
  { id: nextId(), name: 'DJI RS 4', brand: 'DJI', category: 'Support', subcategory: 'Gimbal', description: 'Стабилизатор для камер до 3 кг', price_min: 450, price_max: 500, image_url: null, specs: { payload: '3kg', runtime: '12h', axis: '3-axis' } },
  { id: nextId(), name: 'DJI RS 4 Mini', brand: 'DJI', category: 'Support', subcategory: 'Gimbal', description: 'Компактный стабилизатор до 2 кг', price_min: 300, price_max: 350, image_url: null, specs: { payload: '2kg', runtime: '10h', axis: '3-axis' } },
  { id: nextId(), name: 'Zhiyun Weebill 3S', brand: 'Zhiyun', category: 'Support', subcategory: 'Gimbal', description: 'Компактный стабилизатор со встроенным светом', price_min: 350, price_max: 400, image_url: null, specs: { payload: '3.3kg', runtime: '21h', axis: '3-axis' } },
  { id: nextId(), name: 'Zhiyun Crane 4', brand: 'Zhiyun', category: 'Support', subcategory: 'Gimbal', description: 'Профессиональный стабилизатор с экраном', price_min: 500, price_max: 600, image_url: null, specs: { payload: '4.3kg', runtime: '16h', axis: '3-axis' } },

  // Головки
  { id: nextId(), name: 'Manfrotto XPRO Ball Head', brand: 'Manfrotto', category: 'Support', subcategory: 'Ball Head', description: 'Шаровая голова XPRO с быстросъемной площадкой', price_min: 150, price_max: 180, image_url: null, specs: { max_load: '10kg', weight: '500g', type: 'Ball' } },
  { id: nextId(), name: 'Smallrig Video Fluid Head', brand: 'SmallRig', category: 'Support', subcategory: 'Fluid Head', description: 'Видеоголова с плавным ходом', price_min: 100, price_max: 130, image_url: null, specs: { max_load: '8kg', weight: '550g', type: 'Fluid' } },
]

// --------------- АУДИО ---------------

const audio: EquipmentCatalog[] = [
  { id: nextId(), name: 'Rode Wireless PRO', brand: 'Rode', category: 'Audio', subcategory: 'Wireless Mic', description: 'Беспроводная система 2 передатчика + приемник, 32-bit float', price_min: 400, price_max: 450, image_url: null, specs: { channels: '2 TX', range: '260m', recording: '32-bit float', battery: '7h' } },
  { id: nextId(), name: 'Rode Wireless GO II', brand: 'Rode', category: 'Audio', subcategory: 'Wireless Mic', description: 'Компактная беспроводная система, 2 канала', price_min: 280, price_max: 300, image_url: null, specs: { channels: '2 TX', range: '200m', recording: 'On-board', battery: '7h' } },
  { id: nextId(), name: 'Rode VideoMic Pro+', brand: 'Rode', category: 'Audio', subcategory: 'Shotgun Mic', description: 'Накамерный микрофон-пушка', price_min: 250, price_max: 280, image_url: null, specs: { type: 'Shotgun', power: 'LB-1 battery', pattern: 'Super-cardioid', frequency: '20Hz-20kHz' } },
  { id: nextId(), name: 'Rode NTG5', brand: 'Rode', category: 'Audio', subcategory: 'Shotgun Mic', description: 'Профессиональный микрофон-пушка для видео', price_min: 500, price_max: 550, image_url: null, specs: { type: 'Shotgun', pattern: 'Super-cardioid', weight: '76g', frequency: '20Hz-20kHz' } },
  { id: nextId(), name: 'DJI Mic 2', brand: 'DJI', category: 'Audio', subcategory: 'Wireless Mic', description: 'Беспроводная система с кейсом-зарядкой', price_min: 300, price_max: 350, image_url: null, specs: { channels: '2 TX', range: '250m', recording: '32-bit float', battery: '6h' } },
  { id: nextId(), name: 'Hollyland Lark M2', brand: 'Hollyland', category: 'Audio', subcategory: 'Wireless Mic', description: 'Ультракомпактная беспроводная система', price_min: 200, price_max: 250, image_url: null, specs: { channels: '2 TX', range: '300m', recording: 'On-board', battery: '9h' } },
  { id: nextId(), name: 'Sennheiser MKE 600', brand: 'Sennheiser', category: 'Audio', subcategory: 'Shotgun Mic', description: 'Профессиональная пушка для кино и видео', price_min: 300, price_max: 350, image_url: null, specs: { type: 'Shotgun', pattern: 'Super-cardioid/Lobe', phantom: '48V', frequency: '40Hz-20kHz' } },
  { id: nextId(), name: 'Zoom H6 Essential', brand: 'Zoom', category: 'Audio', subcategory: 'Recorder', description: '32-bit float рекордер, 6 дорожек', price_min: 250, price_max: 280, image_url: null, specs: { channels: '6', bit_depth: '32-bit float', recording: 'WAV/MP3', phantom: '48V' } },
]

// --------------- ХРАНЕНИЕ И КАРТЫ ПАМЯТИ ---------------

const storage: EquipmentCatalog[] = [
  { id: nextId(), name: 'Sony CFexpress Type A 160GB', brand: 'Sony', category: 'Storage', subcategory: 'CFexpress A', description: 'Быстрая карта для камер Sony', price_min: 350, price_max: 400, image_url: null, specs: { capacity: '160GB', read: '800MB/s', write: '700MB/s', type: 'CFexpress A' } },
  { id: nextId(), name: 'SanDisk Extreme Pro CFexpress B 256GB', brand: 'SanDisk', category: 'Storage', subcategory: 'CFexpress B', description: 'Профессиональная карта для Canon/Nikon', price_min: 250, price_max: 300, image_url: null, specs: { capacity: '256GB', read: '1700MB/s', write: '1400MB/s', type: 'CFexpress B' } },
  { id: nextId(), name: 'SanDisk Extreme Pro SDXC 256GB V60', brand: 'SanDisk', category: 'Storage', subcategory: 'SD Card', description: 'Быстрая SD карта для фото и 4K видео', price_min: 40, price_max: 60, image_url: null, specs: { capacity: '256GB', read: '280MB/s', write: '150MB/s', type: 'SDXC V60' } },
  { id: nextId(), name: 'ProGrade Digital CFexpress B 650GB', brand: 'ProGrade', category: 'Storage', subcategory: 'CFexpress B', description: 'Карта большой емкости для 8K', price_min: 500, price_max: 600, image_url: null, specs: { capacity: '650GB', read: '1700MB/s', write: '1500MB/s', type: 'CFexpress B' } },
  { id: nextId(), name: 'Samsung T7 Shield 2TB', brand: 'Samsung', category: 'Storage', subcategory: 'External SSD', description: 'Портативный SSD для бэкапа в поле', price_min: 150, price_max: 180, image_url: null, specs: { capacity: '2TB', read: '1050MB/s', write: '1000MB/s', type: 'USB-C SSD' } },
  { id: nextId(), name: 'SanDisk Professional G-DRIVE 4TB', brand: 'SanDisk', category: 'Storage', subcategory: 'External SSD', description: 'Профессиональный внешний SSD для видео', price_min: 350, price_max: 400, image_url: null, specs: { capacity: '4TB', read: '2000MB/s', write: '2000MB/s', type: 'Thunderbolt' } },
]

// --------------- ДРОНЫ ---------------

const drones: EquipmentCatalog[] = [
  { id: nextId(), name: 'DJI Mavic 3 Pro', brand: 'DJI', category: 'Drone', subcategory: 'Camera Drone', description: 'Тройная камера: Hasselblad 4/3", 70мм, 166мм', price_min: 2200, price_max: 2500, image_url: null, specs: { sensor: '4/3 Hasselblad', video: '5.1K30', flight_time: '43min', range: '15km' } },
  { id: nextId(), name: 'DJI Air 3', brand: 'DJI', category: 'Drone', subcategory: 'Camera Drone', description: 'Двойная камера, компактный для путешествий', price_min: 1000, price_max: 1200, image_url: null, specs: { sensor: '1/1.3 inch', video: '4K100', flight_time: '46min', range: '20km' } },
  { id: nextId(), name: 'DJI Mini 4 Pro', brand: 'DJI', category: 'Drone', subcategory: 'Mini Drone', description: 'До 249г, не нужна регистрация, 4K HDR', price_min: 750, price_max: 900, image_url: null, specs: { sensor: '1/1.3 inch', video: '4K60 HDR', flight_time: '34min', weight: '249g' } },
  { id: nextId(), name: 'DJI Inspire 3', brand: 'DJI', category: 'Drone', subcategory: 'Cinema Drone', description: 'Кинематографический дрон, Full Frame, 8K', price_min: 16000, price_max: 17000, image_url: null, specs: { sensor: 'Full Frame', video: '8K25 CinemaDNG', flight_time: '28min', type: 'Cinema' } },
]

// --------------- ТЕХНИКА APPLE ---------------

const appleTech: EquipmentCatalog[] = [
  // MacBook Pro
  { id: nextId(), name: 'MacBook Pro 16" M4 Max', brand: 'Apple', category: 'Computer', subcategory: 'Laptop', description: 'Мощнейший ноутбук для видеомонтажа и цветокоррекции', price_min: 3500, price_max: 5000, image_url: null, specs: { chip: 'M4 Max', ram: '48-128GB', storage: '1-8TB', display: '16.2" Liquid Retina XDR' } },
  { id: nextId(), name: 'MacBook Pro 14" M4 Pro', brand: 'Apple', category: 'Computer', subcategory: 'Laptop', description: 'Профессиональный ноутбук для фото и видео', price_min: 2000, price_max: 3500, image_url: null, specs: { chip: 'M4 Pro', ram: '24-48GB', storage: '512GB-4TB', display: '14.2" Liquid Retina XDR' } },
  { id: nextId(), name: 'MacBook Pro 14" M4', brand: 'Apple', category: 'Computer', subcategory: 'Laptop', description: 'Базовый Pro для фотографов', price_min: 1600, price_max: 2000, image_url: null, specs: { chip: 'M4', ram: '16-32GB', storage: '512GB-2TB', display: '14.2" Liquid Retina XDR' } },
  { id: nextId(), name: 'MacBook Air 15" M4', brand: 'Apple', category: 'Computer', subcategory: 'Laptop', description: 'Легкий ноутбук для обработки фото в поездках', price_min: 1300, price_max: 1700, image_url: null, specs: { chip: 'M4', ram: '16-32GB', storage: '256GB-2TB', display: '15.3" Liquid Retina' } },

  // Mac Studio & iMac
  { id: nextId(), name: 'Mac Studio M4 Max', brand: 'Apple', category: 'Computer', subcategory: 'Desktop', description: 'Компактный десктоп для профессиональной обработки', price_min: 2000, price_max: 5000, image_url: null, specs: { chip: 'M4 Max / M4 Ultra', ram: '64-192GB', storage: '512GB-8TB' } },
  { id: nextId(), name: 'Mac Pro M2 Ultra', brand: 'Apple', category: 'Computer', subcategory: 'Desktop', description: 'Топовый десктоп для кинопроизводства', price_min: 7000, price_max: 14000, image_url: null, specs: { chip: 'M2 Ultra', ram: '192GB', storage: '1-8TB', expansion: 'PCIe slots' } },
  { id: nextId(), name: 'iMac 24" M4', brand: 'Apple', category: 'Computer', subcategory: 'Desktop', description: 'Элегантный моноблок для фото-студии', price_min: 1300, price_max: 2500, image_url: null, specs: { chip: 'M4', ram: '16-32GB', storage: '256GB-2TB', display: '24" 4.5K Retina' } },

  // Мониторы
  { id: nextId(), name: 'Apple Pro Display XDR', brand: 'Apple', category: 'Computer', subcategory: 'Monitor', description: '32" 6K Retina, 1600 нит, P3 гамут для цветокоррекции', price_min: 5000, price_max: 5500, image_url: null, specs: { size: '32 inch', resolution: '6K', brightness: '1600 nit', gamut: 'P3' } },
  { id: nextId(), name: 'Apple Studio Display', brand: 'Apple', category: 'Computer', subcategory: 'Monitor', description: '27" 5K Retina монитор для работы', price_min: 1600, price_max: 1800, image_url: null, specs: { size: '27 inch', resolution: '5K', brightness: '600 nit', gamut: 'P3' } },

  // iPad
  { id: nextId(), name: 'iPad Pro 13" M4', brand: 'Apple', category: 'Computer', subcategory: 'Tablet', description: 'Планшет для ретуши и показа портфолио клиентам', price_min: 1300, price_max: 2000, image_url: null, specs: { chip: 'M4', ram: '16GB', storage: '256GB-2TB', display: '13" Ultra Retina XDR' } },
  { id: nextId(), name: 'iPad Pro 11" M4', brand: 'Apple', category: 'Computer', subcategory: 'Tablet', description: 'Компактный планшет для ретуши на ходу', price_min: 1000, price_max: 1700, image_url: null, specs: { chip: 'M4', ram: '16GB', storage: '256GB-2TB', display: '11" Ultra Retina XDR' } },
  { id: nextId(), name: 'Apple Pencil Pro', brand: 'Apple', category: 'Computer', subcategory: 'Accessory', description: 'Стилус для ретуши в Lightroom/Affinity на iPad', price_min: 130, price_max: 130, image_url: null, specs: { compatibility: 'iPad Pro M4', features: 'Squeeze, Haptic, Hover, Find My' } },

  // iPhone
  { id: nextId(), name: 'iPhone 16 Pro Max', brand: 'Apple', category: 'Computer', subcategory: 'Smartphone', description: '48 МП ProRAW, 4K120 Dolby Vision, для контента на ходу', price_min: 1200, price_max: 1600, image_url: null, specs: { camera: '48MP + 48MP + 12MP', video: '4K120 Dolby Vision', chip: 'A18 Pro' } },
  { id: nextId(), name: 'iPhone 16 Pro', brand: 'Apple', category: 'Computer', subcategory: 'Smartphone', description: '48 МП ProRAW для мобильной съемки', price_min: 1000, price_max: 1400, image_url: null, specs: { camera: '48MP + 48MP + 12MP', video: '4K120 Dolby Vision', chip: 'A18 Pro' } },
]

// --------------- РЮКЗАКИ И СУМКИ ---------------

const bags: EquipmentCatalog[] = [
  { id: nextId(), name: 'Peak Design Everyday Backpack V2 30L', brand: 'Peak Design', category: 'Bag', subcategory: 'Backpack', description: 'Культовый фоторюкзак с FlexFold разделителями', price_min: 280, price_max: 300, image_url: null, specs: { volume: '30L', fits: '16" laptop + camera', material: 'Recycled nylon', weight: '1.4kg' } },
  { id: nextId(), name: 'Peak Design Everyday Backpack V2 20L', brand: 'Peak Design', category: 'Bag', subcategory: 'Backpack', description: 'Компактная версия для повседневной носки', price_min: 260, price_max: 280, image_url: null, specs: { volume: '20L', fits: '13" laptop + camera', material: 'Recycled nylon', weight: '1.2kg' } },
  { id: nextId(), name: 'Lowepro ProTactic BP 450 AW II', brand: 'Lowepro', category: 'Bag', subcategory: 'Backpack', description: 'Профессиональный фоторюкзак для большого комплекта', price_min: 250, price_max: 300, image_url: null, specs: { volume: '25L', fits: '15" laptop + 2 bodies', material: 'Nylon', weight: '2.3kg' } },
  { id: nextId(), name: 'Think Tank Airport Advantage Plus', brand: 'Think Tank', category: 'Bag', subcategory: 'Rolling Bag', description: 'Роллер для перелетов с полным сетапом', price_min: 300, price_max: 350, image_url: null, specs: { volume: '40L', fits: 'DSLR + 6-8 lenses', type: 'Rolling', weight: '3.5kg' } },
  { id: nextId(), name: 'Shimoda Explore V2 30', brand: 'Shimoda', category: 'Bag', subcategory: 'Backpack', description: 'Рюкзак для активных фотографов и путешественников', price_min: 250, price_max: 300, image_url: null, specs: { volume: '30L', fits: '16" laptop + camera', material: 'Nylon 210D', weight: '1.6kg' } },
]

// --------------- АКСЕССУАРЫ ---------------

const accessories: EquipmentCatalog[] = [
  { id: nextId(), name: 'Peak Design Capture Clip V3', brand: 'Peak Design', category: 'Accessory', subcategory: 'Camera Clip', description: 'Крепление камеры на рюкзак или пояс', price_min: 70, price_max: 80, image_url: null, specs: { max_load: '90kg', weight: '84g', material: 'Anodized aluminum' } },
  { id: nextId(), name: 'Peak Design Slide Strap', brand: 'Peak Design', category: 'Accessory', subcategory: 'Camera Strap', description: 'Универсальный ремень для камеры', price_min: 60, price_max: 70, image_url: null, specs: { width: '45mm', material: 'Seatbelt-style nylon', adjustable: 'Quick-adjust' } },
  { id: nextId(), name: 'NiSi V7 Filter Kit', brand: 'NiSi', category: 'Accessory', subcategory: 'Filter', description: 'Комплект фильтров: CPL + ND + GND', price_min: 350, price_max: 400, image_url: null, specs: { size: '100mm system', includes: 'CPL, ND64, Medium GND', glass: 'Optical' } },
  { id: nextId(), name: 'Hoya HD MKII CIR-PL 77mm', brand: 'Hoya', category: 'Accessory', subcategory: 'Filter', description: 'Поляризационный фильтр 77мм', price_min: 80, price_max: 100, image_url: null, specs: { size: '77mm', type: 'Circular Polarizer', coating: 'HD' } },
  { id: nextId(), name: 'SmallRig Camera Cage for Sony A7IV', brand: 'SmallRig', category: 'Accessory', subcategory: 'Cage', description: 'Клетка для видеографов', price_min: 60, price_max: 80, image_url: null, specs: { compatibility: 'Sony A7 IV', threads: '1/4", 3/8", ARRI', weight: '180g' } },
  { id: nextId(), name: 'Atomos Ninja V+', brand: 'Atomos', category: 'Accessory', subcategory: 'External Recorder', description: 'Внешний рекордер 5.2" HDR, 8K ProRes RAW', price_min: 800, price_max: 900, image_url: null, specs: { display: '5.2" 1000nit HDR', recording: 'ProRes RAW, DNxHR', input: 'HDMI 2.1', storage: 'SSD' } },
  { id: nextId(), name: 'Tilta Nucleus-M', brand: 'Tilta', category: 'Accessory', subcategory: 'Follow Focus', description: 'Беспроводной контроллер фокуса', price_min: 1100, price_max: 1300, image_url: null, specs: { range: '100m', motors: '2', power: '14.4V', torque: 'Adjustable' } },
  { id: nextId(), name: 'Datacolor SpyderX Pro', brand: 'Datacolor', category: 'Accessory', subcategory: 'Calibrator', description: 'Калибратор монитора для точных цветов', price_min: 150, price_max: 180, image_url: null, specs: { accuracy: 'Delta E ≤ 1', speed: '2 min', compatibility: 'Mac/PC', type: 'Colorimeter' } },
  { id: nextId(), name: 'X-Rite i1Display Studio', brand: 'X-Rite', category: 'Accessory', subcategory: 'Calibrator', description: 'Профессиональная калибровка для фотографов', price_min: 250, price_max: 300, image_url: null, specs: { accuracy: 'Delta E ≤ 0.5', speed: '90s', compatibility: 'Mac/PC', type: 'Colorimeter' } },
]

// =====================================================
// ОБЪЕДИНЁННЫЙ КАТАЛОГ
// =====================================================

export const mockEquipmentCatalog: EquipmentCatalog[] = [
  ...canonCameras,
  ...sonyCameras,
  ...nikonCameras,
  ...fujiCameras,
  ...panasonicCameras,
  ...premiumCameras,
  ...djiCameras,
  ...goproCameras,
  ...canonLenses,
  ...sonyLenses,
  ...nikonLenses,
  ...sigmaLenses,
  ...tamronLenses,
  ...flashes,
  ...lighting,
  ...lightModifiers,
  ...support,
  ...audio,
  ...storage,
  ...drones,
  ...appleTech,
  ...bags,
  ...accessories,
]

// =====================================================
// ИКОНКИ ДЛЯ КАТЕГОРИЙ И SUBCATEGORY (для борда)
// =====================================================

export const categoryIcons: Record<string, string> = {
  Camera: '📷',
  Lens: '🔭',
  Flash: '⚡',
  Lighting: '💡',
  Support: '🔩',
  Audio: '🎙️',
  Storage: '💾',
  Drone: '🚁',
  Computer: '💻',
  Bag: '🎒',
  Accessory: '🔧',
}

export const subcategoryIcons: Record<string, string> = {
  // Cameras
  Mirrorless: '📷',
  Cinema: '🎥',
  'Medium Format': '📸',
  Compact: '📱',
  Action: '🏃',
  Vlog: '🤳',
  // Lenses
  Zoom: '🔍',
  Prime: '🎯',
  Telephoto: '🔭',
  Wide: '🌅',
  'Ultra Wide': '🏔️',
  'Super Telephoto': '🦅',
  Macro: '🔬',
  // Flash & Lighting
  Speedlight: '⚡',
  'Portable Strobe': '💥',
  Monolight: '🔆',
  Trigger: '📡',
  'LED COB': '☀️',
  'LED Panel': '🟨',
  'LED Tube': '🌈',
  Softbox: '☁️',
  'Ring Light': '⭕',
  // Support
  Tripod: '📐',
  Gimbal: '🎬',
  'Ball Head': '🔘',
  'Fluid Head': '🎞️',
  // Audio
  'Wireless Mic': '🎤',
  'Shotgun Mic': '🎙️',
  Recorder: '⏺️',
  // Storage
  'CFexpress A': '💳',
  'CFexpress B': '💳',
  'SD Card': '💳',
  'External SSD': '🗄️',
  // Drone
  'Camera Drone': '🚁',
  'Mini Drone': '🛸',
  'Cinema Drone': '🎬',
  // Computer
  Laptop: '💻',
  Desktop: '🖥️',
  Monitor: '🖥️',
  Tablet: '📱',
  Smartphone: '📲',
  Accessory: '🔧',
  // Bags
  Backpack: '🎒',
  'Rolling Bag': '🧳',
  // Accessories
  'Camera Clip': '📎',
  'Camera Strap': '🔗',
  Filter: '🔲',
  Cage: '🏗️',
  'External Recorder': '⏺️',
  'Follow Focus': '🎛️',
  Calibrator: '🎨',
}

// =====================================================
// NICHE REQUIREMENTS (обновлённые)
// =====================================================

export const mockNicheRequirements: NicheRequirement[] = [
  // Portrait
  { id: '1', niche_id: '1', category: 'Camera', equipment_id: null, tier: 'must_have', level_required: 'beginner', weight: 10, reason: 'Основной инструмент для портретной съемки' },
  { id: '2', niche_id: '1', category: 'Lens', equipment_id: null, tier: 'must_have', level_required: 'beginner', weight: 9, reason: 'Качественный портретный объектив необходим (85mm, 50mm)' },
  { id: '3', niche_id: '1', category: 'Flash', equipment_id: null, tier: 'must_have', level_required: 'advanced', weight: 8, reason: 'Вспышка для контролируемого освещения' },
  { id: '4', niche_id: '1', category: 'Lighting', equipment_id: null, tier: 'pro_level', level_required: 'advanced', weight: 7, reason: 'Постоянный свет для видеопортретов и студии' },
  { id: '5', niche_id: '1', category: 'Computer', equipment_id: null, tier: 'must_have', level_required: 'beginner', weight: 7, reason: 'Мощный компьютер для обработки' },
  // Landscape
  { id: '6', niche_id: '2', category: 'Camera', equipment_id: null, tier: 'must_have', level_required: 'beginner', weight: 10, reason: 'Камера с высоким разрешением для пейзажей' },
  { id: '7', niche_id: '2', category: 'Lens', equipment_id: null, tier: 'must_have', level_required: 'beginner', weight: 9, reason: 'Широкоугольный объектив для пейзажей' },
  { id: '8', niche_id: '2', category: 'Support', equipment_id: null, tier: 'must_have', level_required: 'beginner', weight: 8, reason: 'Штатив для стабильной съемки' },
  { id: '9', niche_id: '2', category: 'Accessory', equipment_id: null, tier: 'pro_level', level_required: 'advanced', weight: 6, reason: 'Фильтры для пейзажной фотографии' },
  { id: '10', niche_id: '2', category: 'Drone', equipment_id: null, tier: 'pro_level', level_required: 'advanced', weight: 5, reason: 'Дрон для аэросъемки пейзажей' },
  // Wedding
  { id: '11', niche_id: '3', category: 'Camera', equipment_id: null, tier: 'must_have', level_required: 'beginner', weight: 10, reason: 'Надежная камера для свадебной съемки' },
  { id: '12', niche_id: '3', category: 'Lens', equipment_id: null, tier: 'must_have', level_required: 'beginner', weight: 9, reason: 'Зум 24-70 f/2.8 — рабочая лошадка для свадеб' },
  { id: '13', niche_id: '3', category: 'Flash', equipment_id: null, tier: 'must_have', level_required: 'beginner', weight: 8, reason: 'Вспышка для съемки в любых условиях' },
  { id: '14', niche_id: '3', category: 'Audio', equipment_id: null, tier: 'pro_level', level_required: 'advanced', weight: 5, reason: 'Микрофон для записи клятв' },
  // Product
  { id: '15', niche_id: '4', category: 'Lighting', equipment_id: null, tier: 'must_have', level_required: 'beginner', weight: 10, reason: 'Освещение критично для предметной фотографии' },
  { id: '16', niche_id: '4', category: 'Camera', equipment_id: null, tier: 'must_have', level_required: 'beginner', weight: 9, reason: 'Камера с высоким разрешением для каталогов' },
  { id: '17', niche_id: '4', category: 'Lens', equipment_id: null, tier: 'must_have', level_required: 'beginner', weight: 8, reason: 'Макро-объектив для мелких деталей' },
  { id: '18', niche_id: '4', category: 'Support', equipment_id: null, tier: 'must_have', level_required: 'beginner', weight: 7, reason: 'Штатив для стабильных повторяемых ракурсов' },
  // Video
  { id: '19', niche_id: '6', category: 'Camera', equipment_id: null, tier: 'must_have', level_required: 'beginner', weight: 10, reason: 'Камера с отличными видео-характеристиками' },
  { id: '20', niche_id: '6', category: 'Audio', equipment_id: null, tier: 'must_have', level_required: 'beginner', weight: 9, reason: 'Хороший звук критичен для видео' },
  { id: '21', niche_id: '6', category: 'Support', equipment_id: null, tier: 'must_have', level_required: 'beginner', weight: 8, reason: 'Стабилизатор или штатив для плавного видео' },
  { id: '22', niche_id: '6', category: 'Lighting', equipment_id: null, tier: 'pro_level', level_required: 'advanced', weight: 7, reason: 'Постоянный свет для видео' },
  { id: '23', niche_id: '6', category: 'Computer', equipment_id: null, tier: 'must_have', level_required: 'beginner', weight: 8, reason: 'Мощный компьютер для монтажа' },
  { id: '24', niche_id: '6', category: 'Storage', equipment_id: null, tier: 'must_have', level_required: 'beginner', weight: 6, reason: 'Быстрые карты и SSD для видеоматериала' },
  // Content Creator
  { id: '25', niche_id: '10', category: 'Camera', equipment_id: null, tier: 'must_have', level_required: 'beginner', weight: 10, reason: 'Камера с хорошим автофокусом и видео' },
  { id: '26', niche_id: '10', category: 'Audio', equipment_id: null, tier: 'must_have', level_required: 'beginner', weight: 9, reason: 'Беспроводной микрофон для контента' },
  { id: '27', niche_id: '10', category: 'Lighting', equipment_id: null, tier: 'must_have', level_required: 'beginner', weight: 7, reason: 'Свет для стримов и видеоконтента' },
  { id: '28', niche_id: '10', category: 'Computer', equipment_id: null, tier: 'must_have', level_required: 'beginner', weight: 8, reason: 'Компьютер для монтажа контента' },
]

export const mockUserProfile = {
  id: 'demo-user',
  email: 'demo@kitwise.app',
  full_name: 'Демо Пользователь',
  avatar_url: null,
  niche_id: '1',
  level: 'beginner' as const,
  setup_score: 45,
  is_business: false,
  onboarding_completed: true,
}

export const mockUserEquipment = [
  {
    id: '1',
    user_id: 'demo-user',
    equipment_id: '3',
    custom_name: null,
    category: 'Camera',
    status: 'owned' as const,
    acquired_at: '2023-01-15',
    notes: null,
  },
  {
    id: '2',
    user_id: 'demo-user',
    equipment_id: '56',
    custom_name: null,
    category: 'Lens',
    status: 'owned' as const,
    acquired_at: '2023-03-20',
    notes: null,
  },
  {
    id: '3',
    user_id: 'demo-user',
    equipment_id: '82',
    custom_name: null,
    category: 'Support',
    status: 'planned' as const,
    acquired_at: null,
    notes: 'На следующий месяц',
  },
]

export const mockRecommendations = [
  {
    id: '1',
    user_id: 'demo-user',
    equipment_id: '68',
    category: 'Flash',
    name: 'Godox AD200 Pro',
    priority: 'high' as const,
    score: 95,
    reason: 'Необходимо для профессиональных портретных сессий — мощная портативная вспышка',
    price_range: '$350-400',
    status: 'pending' as const,
    ai_generated: true,
  },
  {
    id: '2',
    user_id: 'demo-user',
    equipment_id: '57',
    category: 'Lens',
    name: 'Canon RF 85mm f/1.2L USM',
    priority: 'high' as const,
    score: 92,
    reason: 'Лучший портретный объектив с невероятным боке',
    price_range: '$2800-2900',
    status: 'pending' as const,
    ai_generated: true,
  },
  {
    id: '3',
    user_id: 'demo-user',
    equipment_id: '83',
    category: 'Lighting',
    name: 'Aputure 300d Mark III',
    priority: 'medium' as const,
    score: 78,
    reason: 'Студийный постоянный свет для видеопортретов',
    price_range: '$1100-1200',
    status: 'pending' as const,
    ai_generated: true,
  },
  {
    id: '4',
    user_id: 'demo-user',
    equipment_id: '97',
    category: 'Audio',
    name: 'Rode Wireless PRO',
    priority: 'medium' as const,
    score: 72,
    reason: 'Беспроводной микрофон для видеоконтента',
    price_range: '$400-450',
    status: 'pending' as const,
    ai_generated: false,
  },
  {
    id: '5',
    user_id: 'demo-user',
    equipment_id: '113',
    category: 'Computer',
    name: 'MacBook Pro 14" M4 Pro',
    priority: 'low' as const,
    score: 65,
    reason: 'Мощный ноутбук для мобильной обработки фото и видео',
    price_range: '$2000-3500',
    status: 'pending' as const,
    ai_generated: true,
  },
]
