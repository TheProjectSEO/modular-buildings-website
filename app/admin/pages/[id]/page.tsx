'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
  Info,
  HelpCircle,
  Code,
  Layers,
  ExternalLink,
  Plus,
  Trash2,
  GripVertical,
  CheckCircle
} from 'lucide-react'
import {
  getPageById,
  getPageTypes,
  updatePage,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  createStructuredData,
  updateStructuredData,
  deleteStructuredData,
  Page,
  PageType,
  FAQ,
  StructuredData
} from '@/lib/supabase'
import { logUpdate, logCreate, logDelete, getUserInfoForAudit } from '@/lib/audit-utils'
import { useAuth } from '@/components/admin/AuthWrapper'

export default function EditPagePage() {
  const router = useRouter()
  const params = useParams()
  const pageId = params.id as string
  const { userProfile } = useAuth()
  const userInfo = getUserInfoForAudit(userProfile)

  const [page, setPage] = useState<Page | null>(null)
  const [pageTypes, setPageTypes] = useState<PageType[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'og' | 'faqs' | 'schema'>('content')

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

  // FAQs state
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' })

  // Schema state
  const [schemas, setSchemas] = useState<StructuredData[]>([])
  const [newSchema, setNewSchema] = useState({ schema_type: 'Product', data: '{}' })

  useEffect(() => {
    loadData()
  }, [pageId])

  const loadData = async () => {
    setLoading(true)
    try {
      const [pageData, typesData] = await Promise.all([
        getPageById(pageId),
        getPageTypes()
      ])

      if (pageData) {
        setPage(pageData)
        setFormData({
          title: pageData.title,
          slug: pageData.slug,
          page_type_id: pageData.page_type_id,
          status: pageData.status,
          content: pageData.content || '',
          meta_title: pageData.meta_title || '',
          meta_description: pageData.meta_description || '',
          canonical_url: pageData.canonical_url || '',
          og_title: pageData.og_title || '',
          og_description: pageData.og_description || '',
          og_image: pageData.og_image || '',
          is_featured: pageData.is_featured,
          sort_order: pageData.sort_order
        })
        setFaqs(pageData.faqs || [])
        setSchemas(pageData.structured_data || [])
      } else {
        setError('Page not found')
      }
      setPageTypes(typesData)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load page')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const oldPageData = page ? { ...page } : null
      const result = await updatePage(pageId, {
        ...formData,
        published_at: formData.status === 'published' && page?.status !== 'published'
          ? new Date().toISOString()
          : page?.published_at
      })

      if (result.success) {
        // Log the update to audit trail
        await logUpdate({
          entityType: 'page',
          entityId: pageId,
          entityTitle: result.data?.title || formData.title,
          oldData: oldPageData || undefined,
          newData: formData,
          ...userInfo
        })
        setSuccess('Page saved successfully')
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || 'Failed to save page')
      }
    } catch (err) {
      setError('An error occurred while saving')
    } finally {
      setSaving(false)
    }
  }

  const handleAddFAQ = async () => {
    if (!newFaq.question || !newFaq.answer) return

    const result = await createFAQ({
      page_id: pageId,
      question: newFaq.question,
      answer: newFaq.answer,
      sort_order: faqs.length,
      is_active: true
    })

    if (result.success && result.data) {
      // Log the FAQ creation
      await logCreate({
        entityType: 'faq',
        entityId: result.data.id,
        entityTitle: newFaq.question,
        newData: { question: newFaq.question, answer: newFaq.answer, page_id: pageId },
        ...userInfo
      })
      setFaqs([...faqs, result.data])
      setNewFaq({ question: '', answer: '' })
    }
  }

  const handleDeleteFAQ = async (id: string) => {
    const faqToDelete = faqs.find(f => f.id === id)
    const result = await deleteFAQ(id)
    if (result.success) {
      // Log the FAQ deletion
      await logDelete({
        entityType: 'faq',
        entityId: id,
        entityTitle: faqToDelete?.question || 'FAQ',
        deletedData: faqToDelete,
        ...userInfo
      })
      setFaqs(faqs.filter(f => f.id !== id))
    }
  }

  const handleAddSchema = async () => {
    try {
      const parsedData = JSON.parse(newSchema.data)
      const result = await createStructuredData({
        page_id: pageId,
        schema_type: newSchema.schema_type,
        json_ld: parsedData,
        is_active: true
      })

      if (result.success && result.data) {
        // Log the schema creation
        await logCreate({
          entityType: 'structured_data',
          entityId: result.data.id,
          entityTitle: `${newSchema.schema_type} Schema`,
          newData: { schema_type: newSchema.schema_type, page_id: pageId },
          ...userInfo
        })
        setSchemas([...schemas, result.data])
        setNewSchema({ schema_type: 'Product', data: '{}' })
      }
    } catch (err) {
      setError('Invalid JSON in schema data')
    }
  }

  const handleDeleteSchema = async (id: string) => {
    const schemaToDelete = schemas.find(s => s.id === id)
    const result = await deleteStructuredData(id)
    if (result.success) {
      // Log the schema deletion
      await logDelete({
        entityType: 'structured_data',
        entityId: id,
        entityTitle: `${schemaToDelete?.schema_type || 'Schema'} Schema`,
        deletedData: schemaToDelete,
        ...userInfo
      })
      setSchemas(schemas.filter(s => s.id !== id))
    }
  }

  const tabs = [
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'og', label: 'Open Graph', icon: Globe },
    { id: 'faqs', label: `FAQs (${faqs.length})`, icon: HelpCircle },
    { id: 'schema', label: `Schema (${schemas.length})`, icon: Code }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Page not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/pages">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Edit Page</h1>
            <p className="text-sm text-gray-500">/{page.slug}</p>
          </div>
        </div>
        {page.status === 'published' && (
          <Button variant="outline" size="sm" asChild>
            <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Live
            </a>
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
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
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="page_type">Page Type</Label>
                    <select
                      id="page_type"
                      value={formData.page_type_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, page_type_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      {pageTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Card>
              <CardHeader className="pb-0">
                <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
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
                        rows={15}
                      />
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
                      />
                    </div>

                    {/* Preview */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">Search Preview</p>
                      <div className="text-blue-800 text-lg truncate">
                        {formData.meta_title || formData.title}
                      </div>
                      <div className="text-green-700 text-sm">
                        https://modular-buildings.co/{formData.slug}
                      </div>
                      <div className="text-gray-600 text-sm line-clamp-2">
                        {formData.meta_description || 'No description set'}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'og' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="og_title">OG Title</Label>
                      <Input
                        id="og_title"
                        value={formData.og_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, og_title: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="og_description">OG Description</Label>
                      <Textarea
                        id="og_description"
                        value={formData.og_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, og_description: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="og_image">OG Image URL</Label>
                      <Input
                        id="og_image"
                        value={formData.og_image}
                        onChange={(e) => setFormData(prev => ({ ...prev, og_image: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'faqs' && (
                  <div className="space-y-4">
                    {faqs.length > 0 ? (
                      <div className="space-y-3">
                        {faqs.map((faq, index) => (
                          <div key={faq.id} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{faq.question}</p>
                                <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteFAQ(faq.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4">No FAQs yet</p>
                    )}

                    <div className="border-t pt-4">
                      <p className="font-medium text-gray-900 mb-3">Add New FAQ</p>
                      <div className="space-y-3">
                        <Input
                          placeholder="Question"
                          value={newFaq.question}
                          onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                        />
                        <Textarea
                          placeholder="Answer"
                          value={newFaq.answer}
                          onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                          rows={3}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddFAQ}
                          disabled={!newFaq.question || !newFaq.answer}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add FAQ
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'schema' && (
                  <div className="space-y-4">
                    {schemas.length > 0 ? (
                      <div className="space-y-3">
                        {schemas.map((schema) => (
                          <div key={schema.id} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <Badge variant="outline">{schema.schema_type}</Badge>
                                <pre className="text-xs text-gray-600 mt-2 overflow-x-auto">
                                  {JSON.stringify(schema.json_ld, null, 2)}
                                </pre>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSchema(schema.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4">No schema markup yet</p>
                    )}

                    <div className="border-t pt-4">
                      <p className="font-medium text-gray-900 mb-3">Add Schema Markup</p>
                      <div className="space-y-3">
                        <select
                          value={newSchema.schema_type}
                          onChange={(e) => setNewSchema(prev => ({ ...prev, schema_type: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="Product">Product</option>
                          <option value="FAQPage">FAQ Page</option>
                          <option value="Organization">Organization</option>
                          <option value="LocalBusiness">Local Business</option>
                          <option value="BreadcrumbList">Breadcrumb</option>
                          <option value="Article">Article</option>
                          <option value="WebPage">Web Page</option>
                        </select>
                        <Textarea
                          placeholder='{"@context": "https://schema.org", ...}'
                          value={newSchema.data}
                          onChange={(e) => setNewSchema(prev => ({ ...prev, data: e.target.value }))}
                          rows={6}
                          className="font-mono text-sm"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddSchema}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Schema
                        </Button>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
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
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                  <Label htmlFor="is_featured" className="text-sm font-normal">
                    Featured page
                  </Label>
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Button type="submit" variant="primary" className="w-full" disabled={saving}>
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Page Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Views</span>
                    <span className="font-medium">{page.view_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">FAQs</span>
                    <span className="font-medium">{faqs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Schema Items</span>
                    <span className="font-medium">{schemas.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created</span>
                    <span className="font-medium">{new Date(page.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Updated</span>
                    <span className="font-medium">{new Date(page.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
