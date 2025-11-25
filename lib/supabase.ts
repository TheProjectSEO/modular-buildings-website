import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not set')
}

// Create Supabase client configured to use Modular-buildings.co schema
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  db: {
    schema: 'Modular-buildings.co'
  }
})

// Service role client for server-side operations (bypasses RLS)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      db: {
        schema: 'Modular-buildings.co'
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Public schema client for auth operations
export const supabaseAuth = createClient(supabaseUrl || '', supabaseAnonKey || '')

// ============================================
// Database Types for Modular-buildings.co schema
// ============================================

export interface PageType {
  id: string
  name: string
  slug: string
  description?: string
  template?: string
  fields_config?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Page {
  id: string
  page_type_id: string
  title: string
  slug: string
  parent_id?: string
  status: 'draft' | 'published' | 'archived'
  meta_title?: string
  meta_description?: string
  canonical_url?: string
  og_title?: string
  og_description?: string
  og_image?: string
  content?: string
  custom_fields?: Record<string, any>
  sort_order: number
  is_featured: boolean
  view_count: number
  published_at?: string
  created_at: string
  updated_at: string
  // Relations
  page_type?: PageType
  parent?: Page
  faqs?: FAQ[]
  internal_links?: InternalLink[]
  structured_data?: StructuredData[]
  content_sections?: ContentSection[]
  media?: Media[]
  specifications?: Specification[]
}

export interface FAQ {
  id: string
  page_id: string
  question: string
  answer: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface InternalLink {
  id: string
  source_page_id: string
  target_page_id: string
  anchor_text: string
  context?: string
  link_type: 'manual' | 'auto' | 'related'
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  // Relations
  source_page?: Page
  target_page?: Page
}

export interface StructuredData {
  id: string
  page_id: string
  schema_type: string
  json_ld: Record<string, any>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ContentSection {
  id: string
  page_id: string
  section_type: string
  title?: string
  content?: string
  data?: Record<string, any>
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Media {
  id: string
  page_id?: string
  file_name: string
  file_url: string
  file_type: string
  file_size?: number
  alt_text?: string
  caption?: string
  width?: number
  height?: number
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface PageRelationship {
  id: string
  source_page_id: string
  target_page_id: string
  relationship_type: 'parent' | 'related' | 'variant' | 'cross-sell'
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Specification {
  id: string
  page_id: string
  spec_group?: string
  spec_name: string
  spec_value: string
  spec_unit?: string
  sort_order: number
  is_highlighted: boolean
  created_at: string
  updated_at: string
}

export interface Redirect {
  id: string
  source_url: string
  target_url: string
  redirect_type: 301 | 302 | 307 | 308
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  email: string
  username: string
  role: 'admin' | 'moderator' | 'editor' | 'viewer'
  avatar_url?: string
  created_at: string
  updated_at: string
}

// Legacy types for backward compatibility
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

// ============================================
// Data Fetching Functions
// ============================================

// Pages
export async function getPages(options?: {
  status?: 'draft' | 'published' | 'archived'
  page_type_id?: string
  limit?: number
  offset?: number
}): Promise<{ data: Page[]; count: number }> {
  let query = supabase
    .from('pages')
    .select('*, page_type:page_types(*)', { count: 'exact' })

  if (options?.status) {
    query = query.eq('status', options.status)
  }
  if (options?.page_type_id) {
    query = query.eq('page_type_id', options.page_type_id)
  }

  query = query.order('updated_at', { ascending: false })

  if (options?.limit) {
    const offset = options.offset || 0
    query = query.range(offset, offset + options.limit - 1)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching pages:', error)
    return { data: [], count: 0 }
  }

  return { data: data || [], count: count || 0 }
}

export async function getPageById(id: string): Promise<Page | null> {
  const { data, error } = await supabase
    .from('pages')
    .select(`
      *,
      page_type:page_types(*),
      faqs(*),
      internal_links:internal_links!source_page_id(*),
      structured_data(*),
      content_sections(*),
      media(*),
      specifications(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching page:', error)
    return null
  }

  return data
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const { data, error } = await supabase
    .from('pages')
    .select(`
      *,
      page_type:page_types(*),
      faqs(*),
      structured_data(*),
      content_sections(*),
      media(*),
      specifications(*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    // Silently handle missing pages during static generation
    // Only log actual errors (not "no rows" errors)
    if (error.code !== 'PGRST116') {
      console.error('Error fetching page by slug:', error)
    }
    return null
  }

  return data
}

export async function createPage(page: Partial<Page>): Promise<{ success: boolean; data?: Page; error?: string }> {
  const { data, error } = await supabase
    .from('pages')
    .insert(page)
    .select()
    .single()

  if (error) {
    console.error('Error creating page:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updatePage(id: string, updates: Partial<Page>): Promise<{ success: boolean; data?: Page; error?: string }> {
  const { data, error } = await supabase
    .from('pages')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating page:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function deletePage(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting page:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Page Types
export async function getPageTypes(): Promise<PageType[]> {
  const { data, error } = await supabase
    .from('page_types')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching page types:', error)
    return []
  }

  return data || []
}

// FAQs
export async function getFAQsByPageId(pageId: string): Promise<FAQ[]> {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('page_id', pageId)
    .order('sort_order')

  if (error) {
    console.error('Error fetching FAQs:', error)
    return []
  }

  return data || []
}

export async function createFAQ(faq: Partial<FAQ>): Promise<{ success: boolean; data?: FAQ; error?: string }> {
  const { data, error } = await supabase
    .from('faqs')
    .insert(faq)
    .select()
    .single()

  if (error) {
    console.error('Error creating FAQ:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updateFAQ(id: string, updates: Partial<FAQ>): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('faqs')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('Error updating FAQ:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteFAQ(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('faqs')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting FAQ:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Internal Links
export async function getInternalLinks(): Promise<InternalLink[]> {
  const { data, error } = await supabase
    .from('internal_links')
    .select(`
      *,
      source_page:pages!source_page_id(id, title, slug),
      target_page:pages!target_page_id(id, title, slug)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching internal links:', error)
    return []
  }

  return data || []
}

export async function createInternalLink(link: Partial<InternalLink>): Promise<{ success: boolean; data?: InternalLink; error?: string }> {
  const { data, error } = await supabase
    .from('internal_links')
    .insert(link)
    .select()
    .single()

  if (error) {
    console.error('Error creating internal link:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function deleteInternalLink(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('internal_links')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting internal link:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Structured Data
export async function getStructuredDataByPageId(pageId: string): Promise<StructuredData[]> {
  const { data, error } = await supabase
    .from('structured_data')
    .select('*')
    .eq('page_id', pageId)

  if (error) {
    console.error('Error fetching structured data:', error)
    return []
  }

  return data || []
}

export async function createStructuredData(schema: Partial<StructuredData>): Promise<{ success: boolean; data?: StructuredData; error?: string }> {
  const { data, error } = await supabase
    .from('structured_data')
    .insert(schema)
    .select()
    .single()

  if (error) {
    console.error('Error creating structured data:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updateStructuredData(id: string, updates: Partial<StructuredData>): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('structured_data')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('Error updating structured data:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteStructuredData(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('structured_data')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting structured data:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Media
export async function getMedia(options?: { page_id?: string; limit?: number }): Promise<Media[]> {
  let query = supabase.from('media').select('*')

  if (options?.page_id) {
    query = query.eq('page_id', options.page_id)
  }

  query = query.order('created_at', { ascending: false })

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching media:', error)
    return []
  }

  return data || []
}

export async function createMedia(media: Partial<Media>): Promise<{ success: boolean; data?: Media; error?: string }> {
  const { data, error } = await supabase
    .from('media')
    .insert(media)
    .select()
    .single()

  if (error) {
    console.error('Error creating media:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function deleteMedia(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('media')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting media:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Redirects
export async function getRedirects(): Promise<Redirect[]> {
  const { data, error } = await supabase
    .from('redirects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching redirects:', error)
    return []
  }

  return data || []
}

export async function createRedirect(redirect: Partial<Redirect>): Promise<{ success: boolean; data?: Redirect; error?: string }> {
  const { data, error } = await supabase
    .from('redirects')
    .insert(redirect)
    .select()
    .single()

  if (error) {
    console.error('Error creating redirect:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updateRedirect(id: string, updates: Partial<Redirect>): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('redirects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('Error updating redirect:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteRedirect(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('redirects')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting redirect:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Content Sections
export async function getContentSections(pageId: string): Promise<ContentSection[]> {
  const { data, error } = await supabase
    .from('content_sections')
    .select('*')
    .eq('page_id', pageId)
    .order('sort_order')

  if (error) {
    console.error('Error fetching content sections:', error)
    return []
  }

  return data || []
}

export async function createContentSection(section: Partial<ContentSection>): Promise<{ success: boolean; data?: ContentSection; error?: string }> {
  const { data, error } = await supabase
    .from('content_sections')
    .insert(section)
    .select()
    .single()

  if (error) {
    console.error('Error creating content section:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updateContentSection(id: string, updates: Partial<ContentSection>): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('content_sections')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('Error updating content section:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteContentSection(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('content_sections')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting content section:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Specifications
export async function getSpecifications(pageId: string): Promise<Specification[]> {
  const { data, error } = await supabase
    .from('specifications')
    .select('*')
    .eq('page_id', pageId)
    .order('sort_order')

  if (error) {
    console.error('Error fetching specifications:', error)
    return []
  }

  return data || []
}

export async function createSpecification(spec: Partial<Specification>): Promise<{ success: boolean; data?: Specification; error?: string }> {
  const { data, error } = await supabase
    .from('specifications')
    .insert(spec)
    .select()
    .single()

  if (error) {
    console.error('Error creating specification:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updateSpecification(id: string, updates: Partial<Specification>): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('specifications')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('Error updating specification:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteSpecification(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('specifications')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting specification:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Dashboard Stats
export async function getDashboardStats(): Promise<{
  totalPages: number
  publishedPages: number
  draftPages: number
  totalFAQs: number
  totalRedirects: number
  totalMedia: number
}> {
  const [pagesResult, faqsResult, redirectsResult, mediaResult] = await Promise.all([
    supabase.from('pages').select('status', { count: 'exact' }),
    supabase.from('faqs').select('*', { count: 'exact', head: true }),
    supabase.from('redirects').select('*', { count: 'exact', head: true }),
    supabase.from('media').select('*', { count: 'exact', head: true })
  ])

  const pages = pagesResult.data || []
  const publishedCount = pages.filter(p => p.status === 'published').length
  const draftCount = pages.filter(p => p.status === 'draft').length

  return {
    totalPages: pagesResult.count || 0,
    publishedPages: publishedCount,
    draftPages: draftCount,
    totalFAQs: faqsResult.count || 0,
    totalRedirects: redirectsResult.count || 0,
    totalMedia: mediaResult.count || 0
  }
}

// ============================================
// Audit Logging
// ============================================

export interface AuditLog {
  id: string
  user_id: string | null
  user_email: string | null
  action: 'create' | 'update' | 'delete'
  entity_type: string
  entity_id: string | null
  entity_title: string | null
  changes: Record<string, any> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export interface CreateAuditLogInput {
  user_id?: string | null
  user_email?: string | null
  action: 'create' | 'update' | 'delete'
  entity_type: string
  entity_id?: string | null
  entity_title?: string | null
  changes?: Record<string, any> | null
  ip_address?: string | null
  user_agent?: string | null
}

/**
 * Create an audit log entry
 * @param log - The audit log data to insert
 * @returns Success status and optional error message
 */
export async function createAuditLog(log: CreateAuditLogInput): Promise<{ success: boolean; data?: AuditLog; error?: string }> {
  const { data, error } = await supabase
    .from('audit_logs')
    .insert({
      user_id: log.user_id || null,
      user_email: log.user_email || null,
      action: log.action,
      entity_type: log.entity_type,
      entity_id: log.entity_id || null,
      entity_title: log.entity_title || null,
      changes: log.changes || null,
      ip_address: log.ip_address || null,
      user_agent: log.user_agent || null
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating audit log:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

/**
 * Get audit logs with optional filtering and pagination
 * @param filters - Optional filters for entity_type, action, and pagination
 * @returns Array of audit logs and total count
 */
export async function getAuditLogs(filters?: {
  entity_type?: string
  action?: 'create' | 'update' | 'delete'
  user_id?: string
  limit?: number
  offset?: number
}): Promise<{ data: AuditLog[]; count: number }> {
  let query = supabase
    .from('audit_logs')
    .select('*', { count: 'exact' })

  if (filters?.entity_type) {
    query = query.eq('entity_type', filters.entity_type)
  }
  if (filters?.action) {
    query = query.eq('action', filters.action)
  }
  if (filters?.user_id) {
    query = query.eq('user_id', filters.user_id)
  }

  query = query.order('created_at', { ascending: false })

  const limit = filters?.limit || 50
  const offset = filters?.offset || 0
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching audit logs:', error)
    return { data: [], count: 0 }
  }

  return { data: data || [], count: count || 0 }
}

/**
 * Get a single audit log by ID
 * @param id - The audit log ID
 * @returns The audit log or null
 */
export async function getAuditLogById(id: string): Promise<AuditLog | null> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching audit log:', error)
    return null
  }

  return data
}

/**
 * Get audit logs for a specific entity
 * @param entityType - The type of entity (page, faq, etc.)
 * @param entityId - The entity's ID
 * @returns Array of audit logs for the entity
 */
export async function getAuditLogsForEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching audit logs for entity:', error)
    return []
  }

  return data || []
}

/**
 * Helper function to get audit log stats
 * @returns Statistics about audit logs
 */
export async function getAuditLogStats(): Promise<{
  totalLogs: number
  logsByAction: Record<string, number>
  logsByEntityType: Record<string, number>
  recentActivity: AuditLog[]
}> {
  const [totalResult, recentResult] = await Promise.all([
    supabase.from('audit_logs').select('action, entity_type', { count: 'exact' }),
    supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(10)
  ])

  const logs = totalResult.data || []
  const logsByAction: Record<string, number> = {}
  const logsByEntityType: Record<string, number> = {}

  logs.forEach(log => {
    logsByAction[log.action] = (logsByAction[log.action] || 0) + 1
    logsByEntityType[log.entity_type] = (logsByEntityType[log.entity_type] || 0) + 1
  })

  return {
    totalLogs: totalResult.count || 0,
    logsByAction,
    logsByEntityType,
    recentActivity: recentResult.data || []
  }
}
