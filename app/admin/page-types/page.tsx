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
  Trash2,
  AlertTriangle,
  X,
  Save,
  Edit,
  List,
  FileText,
  Settings
} from 'lucide-react'
import { supabase, PageType } from '@/lib/supabase'

export default function PageTypesPage() {
  const [pageTypes, setPageTypes] = useState<PageType[]>([])
  const [pageCounts, setPageCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    template: 'default'
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [typesResult, pagesResult] = await Promise.all([
        supabase
          .from('page_types')
          .select('*')
          .order('name'),
        supabase
          .from('pages')
          .select('page_type_id')
      ])

      if (typesResult.error) throw typesResult.error
      if (pagesResult.error) throw pagesResult.error

      setPageTypes(typesResult.data || [])

      // Count pages per type
      const counts: Record<string, number> = {}
      pagesResult.data?.forEach(page => {
        counts[page.page_type_id] = (counts[page.page_type_id] || 0) + 1
      })
      setPageCounts(counts)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load page types')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleAdd = async () => {
    if (!formData.name || !formData.slug) {
      setError('Please fill in name and slug')
      return
    }

    const { data, error } = await supabase
      .from('page_types')
      .insert({
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        template: formData.template
      })
      .select()
      .single()

    if (error) {
      setError(error.message)
    } else if (data) {
      setPageTypes([...pageTypes, data])
      setFormData({ name: '', slug: '', description: '', template: 'default' })
      setShowAddForm(false)
    }
  }

  const handleUpdate = async (id: string) => {
    const { error } = await supabase
      .from('page_types')
      .update({
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        template: formData.template,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      setPageTypes(pageTypes.map(t => t.id === id ? {
        ...t,
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        template: formData.template
      } : t))
      setEditingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (pageCounts[id] > 0) {
      setError('Cannot delete page type with existing pages')
      return
    }

    const { error } = await supabase
      .from('page_types')
      .delete()
      .eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      setPageTypes(pageTypes.filter(t => t.id !== id))
      setDeleteConfirm(null)
    }
  }

  const startEdit = (pageType: PageType) => {
    setFormData({
      name: pageType.name,
      slug: pageType.slug,
      description: pageType.description || '',
      template: pageType.template || 'default'
    })
    setEditingId(pageType.id)
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Page Types</h1>
          <p className="text-gray-600 mt-1">Define different types of pages for your website</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Page Type
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
              {editingId ? 'Edit Page Type' : 'Add New Page Type'}
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
                <Label>Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setFormData(prev => ({
                      ...prev,
                      name,
                      slug: prev.slug || generateSlug(name)
                    }))
                  }}
                  placeholder="Product Page"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="product-page"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this page type..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Template</Label>
              <select
                value={formData.template}
                onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="default">Default</option>
                <option value="product">Product</option>
                <option value="category">Category</option>
                <option value="landing">Landing Page</option>
                <option value="article">Article</option>
                <option value="contact">Contact</option>
              </select>
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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{pageTypes.length}</p>
            <p className="text-sm text-gray-500">Page Types</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {Object.values(pageCounts).reduce((a, b) => a + b, 0)}
            </p>
            <p className="text-sm text-gray-500">Total Pages</p>
          </CardContent>
        </Card>
      </div>

      {/* Page Types List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : pageTypes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <List className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No page types defined</h3>
            <p className="text-gray-600 mb-4">Create page types to organize your content</p>
            <Button variant="primary" onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Page Type
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {pageTypes.map((pageType) => (
            <Card key={pageType.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{pageType.name}</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{pageType.slug}</code>
                        <Badge variant="outline">{pageType.template || 'default'}</Badge>
                        <span className="text-gray-500">
                          {pageCounts[pageType.id] || 0} pages
                        </span>
                      </div>
                      {pageType.description && (
                        <p className="text-sm text-gray-500 mt-1">{pageType.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(pageType)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {deleteConfirm === pageType.id ? (
                      <>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(pageType.id)}
                          disabled={pageCounts[pageType.id] > 0}
                        >
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
                        onClick={() => setDeleteConfirm(pageType.id)}
                        className="text-red-600"
                        disabled={pageCounts[pageType.id] > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
