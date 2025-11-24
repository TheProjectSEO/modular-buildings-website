'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Save,
  Eye,
  FileText,
  Settings,
  Search,
  Image,
  Globe,
  AlertTriangle,
  Info
} from 'lucide-react'
import { createPage, getPageTypes, PageType } from '@/lib/supabase'
import { logCreate, getUserInfoForAudit } from '@/lib/audit-utils'
import { useAuth } from '@/components/admin/AuthWrapper'

export default function NewPagePage() {
  const router = useRouter()
  const { userProfile } = useAuth()
  const userInfo = getUserInfoForAudit(userProfile)
  const [pageTypes, setPageTypes] = useState<PageType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'og'>('content')

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    page_type_id: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    content: '',
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    og_title: '',
    og_description: '',
    og_image: '',
    is_featured: false,
    sort_order: 0
  })

  useEffect(() => {
    loadPageTypes()
  }, [])

  const loadPageTypes = async () => {
    const types = await getPageTypes()
    setPageTypes(types)
    if (types.length > 0) {
      setFormData(prev => ({ ...prev, page_type_id: types[0].id }))
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
      meta_title: prev.meta_title || title,
      og_title: prev.og_title || title
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await createPage({
        ...formData,
        published_at: formData.status === 'published' ? new Date().toISOString() : undefined
      })

      if (result.success && result.data) {
        // Log the page creation
        await logCreate({
          entityType: 'page',
          entityId: result.data.id,
          entityTitle: result.data.title,
          newData: formData,
          ...userInfo
        })
        router.push(`/admin/pages/${result.data.id}`)
      } else {
        setError(result.error || 'Failed to create page')
      }
    } catch (err) {
      setError('An error occurred while creating the page')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'og', label: 'Open Graph', icon: Globe }
  ]

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/pages">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Create New Page</h1>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Page Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Enter page title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">/</span>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="page-url-slug"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500">URL: https://modular-buildings.co/{formData.slug || 'page-slug'}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="page_type">Page Type *</Label>
                  <select
                    id="page_type"
                    value={formData.page_type_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, page_type_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {pageTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Card>
              <CardHeader className="pb-0">
                <div className="flex gap-2 border-b border-gray-200">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {activeTab === 'content' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="content">Page Content</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Enter page content..."
                        rows={12}
                      />
                      <p className="text-xs text-gray-500">Supports HTML and markdown</p>
                    </div>
                  </div>
                )}

                {activeTab === 'seo' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="meta_title">Meta Title</Label>
                      <Input
                        id="meta_title"
                        value={formData.meta_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                        placeholder="SEO title for search engines"
                        maxLength={60}
                      />
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Recommended: 50-60 characters</span>
                        <span className={formData.meta_title.length > 60 ? 'text-red-500' : 'text-gray-500'}>
                          {formData.meta_title.length}/60
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="meta_description">Meta Description</Label>
                      <Textarea
                        id="meta_description"
                        value={formData.meta_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                        placeholder="Brief description for search results"
                        rows={3}
                        maxLength={160}
                      />
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Recommended: 120-160 characters</span>
                        <span className={formData.meta_description.length > 160 ? 'text-red-500' : 'text-gray-500'}>
                          {formData.meta_description.length}/160
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="canonical_url">Canonical URL</Label>
                      <Input
                        id="canonical_url"
                        value={formData.canonical_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, canonical_url: e.target.value }))}
                        placeholder="https://modular-buildings.co/..."
                      />
                      <p className="text-xs text-gray-500">Leave empty to use the page URL</p>
                    </div>

                    {/* Search Preview */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">Search Preview</p>
                      <div className="text-blue-800 text-lg hover:underline cursor-pointer truncate">
                        {formData.meta_title || formData.title || 'Page Title'}
                      </div>
                      <div className="text-green-700 text-sm">
                        https://modular-buildings.co/{formData.slug || 'page-slug'}
                      </div>
                      <div className="text-gray-600 text-sm line-clamp-2">
                        {formData.meta_description || 'Add a meta description to show a preview here...'}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'og' && (
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg flex gap-2">
                      <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-800">
                        Open Graph tags control how your page appears when shared on social media like Facebook, Twitter, and LinkedIn.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="og_title">OG Title</Label>
                      <Input
                        id="og_title"
                        value={formData.og_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, og_title: e.target.value }))}
                        placeholder="Title for social media"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="og_description">OG Description</Label>
                      <Textarea
                        id="og_description"
                        value={formData.og_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, og_description: e.target.value }))}
                        placeholder="Description for social media"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="og_image">OG Image URL</Label>
                      <Input
                        id="og_image"
                        value={formData.og_image}
                        onChange={(e) => setFormData(prev => ({ ...prev, og_image: e.target.value }))}
                        placeholder="https://..."
                      />
                      <p className="text-xs text-gray-500">Recommended size: 1200x630 pixels</p>
                    </div>

                    {/* Social Preview */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">Social Media Preview</p>
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-w-sm">
                        <div className="h-32 bg-gray-200 flex items-center justify-center">
                          {formData.og_image ? (
                            <img src={formData.og_image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Image className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-gray-500 uppercase">modular-buildings.co</p>
                          <p className="font-medium text-gray-900 truncate">
                            {formData.og_title || formData.title || 'Page Title'}
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {formData.og_description || formData.meta_description || 'Page description...'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Publish
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="is_featured" className="text-sm font-normal">
                    Featured page
                  </Label>
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Create Page
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">*</span>
                    Use descriptive titles for better SEO
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">*</span>
                    Keep URLs short and keyword-rich
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">*</span>
                    Add FAQs and schema after creating
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
