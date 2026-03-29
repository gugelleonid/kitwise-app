export interface Niche {
  id: string
  name: string
  slug: string
  icon: string
  description: string
  parent_id: string | null
  sort_order: number
}

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  niche_id: string | null
  level: 'beginner' | 'advanced' | 'pro'
  setup_score: number
  is_business: boolean
  onboarding_completed: boolean
}

export interface EquipmentCatalog {
  id: string
  name: string
  brand: string
  category: string
  subcategory: string
  description: string
  price_min: number | null
  price_max: number | null
  image_url: string | null
  specs: Record<string, any> | null
}

export interface NicheRequirement {
  id: string
  niche_id: string
  category: string
  equipment_id: string | null
  tier: 'must_have' | 'pro_level' | 'optimization'
  level_required: 'beginner' | 'advanced' | 'pro'
  weight: number
  reason: string
}

export interface UserEquipment {
  id: string
  user_id: string
  equipment_id: string
  custom_name: string | null
  category: string
  status: 'owned' | 'planned' | 'dream'
  quantity: number
  acquired_at: string | null
  notes: string | null
}

// Gamification
export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  condition: (equipment: UserEquipment[], niches: string[]) => boolean
  xp: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface UserProgress {
  level: number
  xp: number
  xpToNext: number
  title: string
  achievements: string[]
  streak: number
}

export interface Recommendation {
  id: string
  user_id: string
  equipment_id: string
  category: string
  name: string
  priority: 'high' | 'medium' | 'low'
  score: number
  reason: string
  price_range: string
  status: 'pending' | 'implemented' | 'dismissed'
  ai_generated: boolean
}

export interface ProfileCard {
  id: string
  user_id: string
  profile_id: string
  is_public: boolean
  share_token: string | null
  created_at: string
  updated_at: string
}

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]
