import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client configured to use todoAAPP schema
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'todoAAPP'  // All queries will use todoAAPP schema
  }
})

// Database types for todoAAPP schema
export interface Product {
  id: string
  title: string
  slug: string
  category: string
  subcategory?: string
  description?: string
  total_area?: number
  area_unit?: string
  floor_count?: number
  completion_days?: number
  specifications?: Record<string, any>
  features?: string[]
  images?: Array<{
    url: string
    alt: string
    thumbnail?: string
  }>
  price_range?: string
  meta_title?: string
  meta_description?: string
  is_published: boolean
  is_featured: boolean
  views_count: number
  created_at: string
  updated_at: string
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  parent_id?: string
  description?: string
  banner_image_url?: string
  icon_svg?: string
  sort_order: number
  is_active: boolean
}

export interface Project {
  id: string
  title: string
  slug: string
  category?: string
  location?: string
  country?: string
  city?: string
  completion_date?: string
  completion_days?: number
  total_area?: number
  description?: string
  features?: string[]
  images?: Array<{
    url: string
    alt: string
  }>
  is_featured: boolean
  is_published: boolean
}

export interface DesignToken {
  token_type: string
  token_name: string
  value: string
  description?: string
}
