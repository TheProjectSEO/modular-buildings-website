/**
 * Admin API Client
 *
 * This module provides functions to interact with admin API routes
 * instead of making direct Supabase calls. All routes use service role key
 * on the server-side to bypass RLS restrictions.
 */

export interface Page {
  id: string
  page_type_id: string
  slug: string
  title: string
  meta_title?: string
  meta_description?: string
  content?: any
  status: 'draft' | 'published' | 'archived'
  is_featured?: boolean
  view_count?: number
  created_at: string
  updated_at: string
  page_type?: {
    id: string
    name: string
    slug: string
  }
}

export interface ContentSection {
  id: string
  page_id: string
  section_type: string
  heading?: string
  subheading?: string
  content?: any
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Redirect {
  id: string
  source_path: string
  destination_path: string
  redirect_type: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface FAQ {
  id: string
  page_id?: string
  question: string
  answer: string
  category?: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Author {
  id: string
  name: string
  email: string
  avatar_url?: string
  bio?: string
  social_links?: {
    twitter?: string
    linkedin?: string
    github?: string
    website?: string
    [key: string]: string | undefined
  }
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  author_id?: string
  author?: Author
  category?: string
  featured_image?: string
  is_featured: boolean
  is_published: boolean
  published_at?: string
  updated_at: string
  created_at: string
  read_time?: number
  seo_title?: string
  seo_description?: string
  faq_schema?: Array<{ question: string; answer: string }>
  custom_schema?: Record<string, any>
  callouts?: Array<{
    type: 'info' | 'warning' | 'success' | 'error'
    title?: string
    content: string
    position?: string
  }>
}

// Pages API
export async function getPages(options?: {
  page_type?: string
  limit?: number
  offset?: number
}): Promise<{ pages: Page[] }> {
  const params = new URLSearchParams()
  if (options?.page_type) params.append('page_type', options.page_type)
  if (options?.limit) params.append('limit', options.limit.toString())
  if (options?.offset) params.append('offset', options.offset.toString())

  const response = await fetch(`/api/admin/pages?${params.toString()}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch pages')
  }
  return response.json()
}

export async function getPage(id: string): Promise<{ page: Page }> {
  const response = await fetch(`/api/admin/pages/${id}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch page')
  }
  return response.json()
}

export async function createPage(data: {
  page_type_id: string
  slug: string
  title?: string
  meta_title?: string
  meta_description?: string
  content?: any
  status?: 'draft' | 'published' | 'archived'
}): Promise<{ page: Page }> {
  const response = await fetch('/api/admin/pages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create page')
  }
  return response.json()
}

export async function updatePage(
  id: string,
  data: Partial<{
    page_type_id: string
    slug: string
    title: string
    meta_title: string
    meta_description: string
    content: any
    status: 'draft' | 'published' | 'archived'
  }>
): Promise<{ page: Page }> {
  const response = await fetch(`/api/admin/pages/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update page')
  }
  return response.json()
}

export async function deletePage(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/admin/pages/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete page')
  }
  return response.json()
}

// Content Sections API
export async function getContentSections(options?: {
  page_id?: string
  section_type?: string
  limit?: number
  offset?: number
}): Promise<{ sections: ContentSection[] }> {
  const params = new URLSearchParams()
  if (options?.page_id) params.append('page_id', options.page_id)
  if (options?.section_type) params.append('section_type', options.section_type)
  if (options?.limit) params.append('limit', options.limit.toString())
  if (options?.offset) params.append('offset', options.offset.toString())

  const response = await fetch(`/api/admin/content-sections?${params.toString()}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch content sections')
  }
  return response.json()
}

export async function getContentSection(id: string): Promise<{ section: ContentSection }> {
  const response = await fetch(`/api/admin/content-sections/${id}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch content section')
  }
  return response.json()
}

export async function createContentSection(data: {
  page_id: string
  section_type: string
  heading?: string
  subheading?: string
  content?: any
  order_index: number
  is_active?: boolean
}): Promise<{ section: ContentSection }> {
  const response = await fetch('/api/admin/content-sections', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create content section')
  }
  return response.json()
}

export async function updateContentSection(
  id: string,
  data: Partial<{
    section_type: string
    heading: string
    subheading: string
    content: any
    order_index: number
    is_active: boolean
  }>
): Promise<{ section: ContentSection }> {
  const response = await fetch(`/api/admin/content-sections/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update content section')
  }
  return response.json()
}

export async function deleteContentSection(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/admin/content-sections/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete content section')
  }
  return response.json()
}

// Redirects API
export async function getRedirects(options?: {
  is_active?: boolean
  limit?: number
  offset?: number
}): Promise<{ redirects: Redirect[] }> {
  const params = new URLSearchParams()
  if (options?.is_active !== undefined) params.append('is_active', options.is_active.toString())
  if (options?.limit) params.append('limit', options.limit.toString())
  if (options?.offset) params.append('offset', options.offset.toString())

  const response = await fetch(`/api/admin/redirects?${params.toString()}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch redirects')
  }
  return response.json()
}

export async function getRedirect(id: string): Promise<{ redirect: Redirect }> {
  const response = await fetch(`/api/admin/redirects/${id}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch redirect')
  }
  return response.json()
}

export async function createRedirect(data: {
  source_path: string
  destination_path: string
  redirect_type: number
  is_active?: boolean
}): Promise<{ redirect: Redirect }> {
  const response = await fetch('/api/admin/redirects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create redirect')
  }
  return response.json()
}

export async function updateRedirect(
  id: string,
  data: Partial<{
    source_path: string
    destination_path: string
    redirect_type: number
    is_active: boolean
  }>
): Promise<{ redirect: Redirect }> {
  const response = await fetch(`/api/admin/redirects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update redirect')
  }
  return response.json()
}

export async function deleteRedirect(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/admin/redirects/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete redirect')
  }
  return response.json()
}

// FAQs API
export async function getFAQs(options?: {
  page_id?: string
  category?: string
  limit?: number
  offset?: number
}): Promise<{ faqs: FAQ[] }> {
  const params = new URLSearchParams()
  if (options?.page_id) params.append('page_id', options.page_id)
  if (options?.category) params.append('category', options.category)
  if (options?.limit) params.append('limit', options.limit.toString())
  if (options?.offset) params.append('offset', options.offset.toString())

  const response = await fetch(`/api/admin/faqs?${params.toString()}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch FAQs')
  }
  return response.json()
}

export async function getFAQ(id: string): Promise<{ faq: FAQ }> {
  const response = await fetch(`/api/admin/faqs/${id}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch FAQ')
  }
  return response.json()
}

export async function createFAQ(data: {
  page_id?: string
  question: string
  answer: string
  category?: string
  order_index: number
  is_active?: boolean
}): Promise<{ faq: FAQ }> {
  const response = await fetch('/api/admin/faqs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create FAQ')
  }
  return response.json()
}

export async function updateFAQ(
  id: string,
  data: Partial<{
    question: string
    answer: string
    category: string
    order_index: number
    is_active: boolean
  }>
): Promise<{ faq: FAQ }> {
  const response = await fetch(`/api/admin/faqs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update FAQ')
  }
  return response.json()
}

export async function deleteFAQ(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/admin/faqs/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete FAQ')
  }
  return response.json()
}

// Authors API
export async function getAuthors(options?: {
  search?: string
  limit?: number
  offset?: number
}): Promise<{ authors: Author[]; total: number }> {
  const params = new URLSearchParams()
  if (options?.search) params.append('search', options.search)
  if (options?.limit) params.append('limit', options.limit.toString())
  if (options?.offset) params.append('offset', options.offset.toString())

  const response = await fetch(`/api/admin/authors?${params.toString()}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch authors')
  }
  return response.json()
}

export async function getAuthor(id: string): Promise<{ author: Author; post_count: number }> {
  const response = await fetch(`/api/admin/authors/${id}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch author')
  }
  return response.json()
}

export async function createAuthor(data: {
  name: string
  email: string
  avatar_url?: string
  bio?: string
  social_links?: Record<string, string>
}): Promise<{ author: Author }> {
  const response = await fetch('/api/admin/authors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create author')
  }
  return response.json()
}

export async function updateAuthor(
  id: string,
  data: Partial<{
    name: string
    email: string
    avatar_url: string
    bio: string
    social_links: Record<string, string>
  }>
): Promise<{ author: Author }> {
  const response = await fetch(`/api/admin/authors/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update author')
  }
  return response.json()
}

export async function deleteAuthor(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/admin/authors/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete author')
  }
  return response.json()
}

// Blog Posts API
export async function getBlogPosts(options?: {
  is_published?: boolean
  category?: string
  search?: string
  limit?: number
  offset?: number
}): Promise<{ posts: BlogPost[]; total: number }> {
  const params = new URLSearchParams()
  if (options?.is_published !== undefined) params.append('is_published', options.is_published.toString())
  if (options?.category) params.append('category', options.category)
  if (options?.search) params.append('search', options.search)
  if (options?.limit) params.append('limit', options.limit.toString())
  if (options?.offset) params.append('offset', options.offset.toString())

  const response = await fetch(`/api/admin/blog-posts?${params.toString()}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch blog posts')
  }
  return response.json()
}

export async function getBlogPost(id: string): Promise<{ post: BlogPost }> {
  const response = await fetch(`/api/admin/blog-posts/${id}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch blog post')
  }
  return response.json()
}

export async function createBlogPost(data: {
  title: string
  slug: string
  excerpt?: string
  content: string
  author_id?: string
  category?: string
  featured_image?: string
  is_featured?: boolean
  is_published?: boolean
  published_at?: string
  read_time?: number
  seo_title?: string
  seo_description?: string
  faq_schema?: Array<{ question: string; answer: string }>
  custom_schema?: Record<string, any>
  callouts?: Array<any>
}): Promise<{ post: BlogPost }> {
  const response = await fetch('/api/admin/blog-posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create blog post')
  }
  return response.json()
}

export async function updateBlogPost(
  id: string,
  data: Partial<{
    title: string
    slug: string
    excerpt: string
    content: string
    author_id: string
    category: string
    featured_image: string
    is_featured: boolean
    is_published: boolean
    published_at: string
    read_time: number
    seo_title: string
    seo_description: string
    faq_schema: Array<{ question: string; answer: string }>
    custom_schema: Record<string, any>
    callouts: Array<any>
  }>
): Promise<{ post: BlogPost }> {
  const response = await fetch(`/api/admin/blog-posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update blog post')
  }
  return response.json()
}

export async function deleteBlogPost(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/admin/blog-posts/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete blog post')
  }
  return response.json()
}
