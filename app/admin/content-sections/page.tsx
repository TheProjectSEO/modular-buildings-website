'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Plus,
  Search,
  Trash2,
  Layers,
  AlertTriangle,
  X,
  Save,
  Edit,
  FileText,
  ChevronDown,
  ChevronUp,
  GripVertical
} from 'lucide-react'
import {
  getContentSections,
  createContentSection,
  updateContentSection,
  deleteContentSection,
  ContentSection
} from '@/lib/admin-api'
import { supabase } from '@/lib/supabase'

// Simplified page type for the dropdown selection
interface PageListItem {
  id: string
  title: string
  slug: string
}

interface ContentSectionWithPage extends ContentSection {
  page?: { id: string; title: string; slug: string }
}

const SECTION_TYPES = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'features', label: 'Features Grid' },
  { value: 'cta', label: 'Call to Action' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'gallery', label: 'Image Gallery' },
  { value: 'text', label: 'Text Content' },
  { value: 'specs', label: 'Specifications' },
  { value: 'comparison', label: 'Comparison Table' },
  { value: 'video', label: 'Video Embed' },
  { value: 'custom', label: 'Custom HTML' }
]

export default function ContentSectionsPage() {
  const [sections, setSections] = useState<ContentSectionWithPage[]>([])
  const [pages, setPages] = useState<PageListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [pageFilter, setPageFilter] = useState<string>('all')
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    page_id: '',
    section_type: 'text',
    title: '',
    content: '',
    data: '{}',
    is_active: true
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [sectionsResult, pagesResult] = await Promise.all([
        getContentSections(),
        supabase
          .from('pages')
          .select('id, meta_title, slug')
          .order('meta_title')
      ])

      if (pagesResult.error) throw pagesResult.error

      setSections(sectionsResult.sections || [])
      setPages((pagesResult.data || []).map(p => ({
        id: p.id,
        title: p.meta_title || p.slug,
        slug: p.slug
      })))
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load content sections')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.page_id || !formData.section_type) {
      setError('Please select a page and section type')
      return
    }

    let parsedData = {}
    try {
      parsedData = JSON.parse(formData.data || '{}')
    } catch {
      setError('Invalid JSON in data field')
      return
    }

    const maxOrder = sections.filter(s => s.page_id === formData.page_id).length

    try {
      const result = await createContentSection({
        page_id: formData.page_id,
        section_type: formData.section_type,
        heading: formData.title || undefined,
        content: parsedData,
        order_index: maxOrder,
        is_active: formData.is_active
      })

      setSections([...sections, result.section])
      setFormData({
        page_id: '',
        section_type: 'text',
        title: '',
        content: '',
        data: '{}',
        is_active: true
      })
      setShowAddForm(false)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleUpdate = async (id: string) => {
    let parsedData = {}
    try {
      parsedData = JSON.parse(formData.data || '{}')
    } catch {
      setError('Invalid JSON in data field')
      return
    }

    try {
      await updateContentSection(id, {
        section_type: formData.section_type,
        heading: formData.title || undefined,
        content: parsedData,
        is_active: formData.is_active
      })

      setSections(sections.map(s => s.id === id ? {
        ...s,
        section_type: formData.section_type,
        heading: formData.title,
        content: parsedData,
        is_active: formData.is_active
      } : s))
      setEditingId(null)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteContentSection(id)
      setSections(sections.filter(s => s.id !== id))
      setDeleteConfirm(null)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const toggleActive = async (section: ContentSectionWithPage) => {
    try {
      await updateContentSection(section.id, { is_active: !section.is_active })
      setSections(sections.map(s => s.id === section.id ? { ...s, is_active: !s.is_active } : s))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const startEdit = (section: ContentSectionWithPage) => {
    setFormData({
      page_id: section.page_id,
      section_type: section.section_type,
      title: section.heading || '',
      content: JSON.stringify(section.content || {}),
      data: JSON.stringify(section.content || {}, null, 2),
      is_active: section.is_active
    })
    setEditingId(section.id)
  }

  const filteredSections = sections.filter(section => {
    const matchesSearch =
      section.heading?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.section_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.page?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPage = pageFilter === 'all' || section.page_id === pageFilter
    return matchesSearch && matchesPage
  })

  // Group by page
  const groupedSections = filteredSections.reduce((acc, section) => {
    const pageTitle = section.page?.title || 'Unassigned'
    if (!acc[pageTitle]) {
      acc[pageTitle] = []
    }
    acc[pageTitle].push(section)
    return acc
  }, {} as Record<string, ContentSectionWithPage[]>)

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Sections</h1>
          <p className="text-gray-600 mt-1">Manage reusable content blocks for pages</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              {editingId ? 'Edit Content Section' : 'Add Content Section'}
              <Button variant="ghost" size="sm" onClick={() => {
                setShowAddForm(false)
                setEditingId(null)
              }}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Page *</Label>
                <select
                  value={formData.page_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, page_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  disabled={!!editingId}
                >
                  <option value="">Select a page</option>
                  {pages.map(page => (
                    <option key={page.id} value={page.id}>{page.title}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Section Type *</Label>
                <select
                  value={formData.section_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, section_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {SECTION_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Section title"
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Section content (HTML supported)"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Data (JSON)</Label>
              <Textarea
                value={formData.data}
                onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                placeholder="{}"
                rows={4}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">Additional structured data for this section</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active_form"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <Label htmlFor="is_active_form" className="text-sm font-normal">Active</Label>
            </div>
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}
              >
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Update' : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => {
                setShowAddForm(false)
                setEditingId(null)
              }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={pageFilter}
              onChange={(e) => setPageFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Pages</option>
              {pages.map(page => (
                <option key={page.id} value={page.id}>{page.title}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{sections.length}</p>
            <p className="text-sm text-gray-500">Total Sections</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{sections.filter(s => s.is_active).length}</p>
            <p className="text-sm text-gray-500">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{Object.keys(groupedSections).length}</p>
            <p className="text-sm text-gray-500">Pages</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {new Set(sections.map(s => s.section_type)).size}
            </p>
            <p className="text-sm text-gray-500">Section Types</p>
          </CardContent>
        </Card>
      </div>

      {/* Sections List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredSections.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content sections found</h3>
            <p className="text-gray-600 mb-4">Add reusable content blocks to your pages</p>
            <Button variant="primary" onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSections).map(([pageTitle, pageSections]) => (
            <Card key={pageTitle}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  {pageTitle}
                  <Badge variant="outline" className="ml-auto">{pageSections.length} sections</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pageSections.map((section, index) => (
                    <div
                      key={section.id}
                      className={`border rounded-lg overflow-hidden ${!section.is_active ? 'opacity-60' : ''}`}
                    >
                      <div
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                        onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 text-sm">#{index + 1}</span>
                          <Badge variant="primary">
                            {SECTION_TYPES.find(t => t.value === section.section_type)?.label || section.section_type}
                          </Badge>
                          {section.heading && (
                            <span className="font-medium text-gray-900">{section.heading}</span>
                          )}
                          {!section.is_active && <Badge variant="gray">Inactive</Badge>}
                        </div>
                        <div className="flex items-center gap-2">
                          {expandedSection === section.id ? (
                            <ChevronUp className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {expandedSection === section.id && (
                        <div className="px-3 pb-3 border-t border-gray-100">
                          {section.content && typeof section.content === 'object' && Object.keys(section.content).length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs text-gray-500 mb-1">Content Data:</p>
                              <pre className="p-2 bg-gray-900 text-green-400 rounded text-xs overflow-x-auto">
                                {JSON.stringify(section.content, null, 2)}
                              </pre>
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                            <Button variant="outline" size="sm" onClick={() => startEdit(section)}>
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => toggleActive(section)}>
                              {section.is_active ? 'Deactivate' : 'Activate'}
                            </Button>
                            {deleteConfirm === section.id ? (
                              <>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(section.id)}>
                                  Confirm
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)}>
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteConfirm(section.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
