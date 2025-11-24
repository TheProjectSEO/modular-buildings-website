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
  Link2,
  AlertTriangle,
  ArrowRight,
  X,
  Save,
  ExternalLink,
  Filter
} from 'lucide-react'
import { supabase, InternalLink } from '@/lib/supabase'

// Simplified page type for the dropdown selection
interface PageListItem {
  id: string
  title: string
  slug: string
}

interface InternalLinkWithPages extends Omit<InternalLink, 'source_page' | 'target_page'> {
  source_page?: { id: string; title: string; slug: string }
  target_page?: { id: string; title: string; slug: string }
}

export default function InternalLinksPage() {
  const [links, setLinks] = useState<InternalLinkWithPages[]>([])
  const [pages, setPages] = useState<PageListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [linkTypeFilter, setLinkTypeFilter] = useState<string>('all')
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    source_page_id: '',
    target_page_id: '',
    anchor_text: '',
    context: '',
    link_type: 'manual' as 'manual' | 'auto' | 'related',
    is_active: true
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [linksResult, pagesResult] = await Promise.all([
        supabase
          .from('internal_links')
          .select(`
            *,
            source_page:pages!source_page_id(id, title, slug),
            target_page:pages!target_page_id(id, title, slug)
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('pages')
          .select('id, title, slug')
          .eq('status', 'published')
          .order('title')
      ])

      if (linksResult.error) throw linksResult.error
      if (pagesResult.error) throw pagesResult.error

      setLinks(linksResult.data || [])
      setPages(pagesResult.data || [])
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load internal links')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.source_page_id || !formData.target_page_id || !formData.anchor_text) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.source_page_id === formData.target_page_id) {
      setError('Source and target pages cannot be the same')
      return
    }

    const maxOrder = links.filter(l => l.source_page_id === formData.source_page_id).length

    const { data, error } = await supabase
      .from('internal_links')
      .insert({
        ...formData,
        sort_order: maxOrder
      })
      .select(`
        *,
        source_page:pages!source_page_id(id, title, slug),
        target_page:pages!target_page_id(id, title, slug)
      `)
      .single()

    if (error) {
      setError(error.message)
    } else if (data) {
      setLinks([data, ...links])
      setFormData({
        source_page_id: '',
        target_page_id: '',
        anchor_text: '',
        context: '',
        link_type: 'manual',
        is_active: true
      })
      setShowAddForm(false)
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('internal_links')
      .delete()
      .eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      setLinks(links.filter(l => l.id !== id))
      setDeleteConfirm(null)
    }
  }

  const toggleActive = async (link: InternalLinkWithPages) => {
    const { error } = await supabase
      .from('internal_links')
      .update({ is_active: !link.is_active, updated_at: new Date().toISOString() })
      .eq('id', link.id)

    if (!error) {
      setLinks(links.map(l => l.id === link.id ? { ...l, is_active: !l.is_active } : l))
    }
  }

  const filteredLinks = links.filter(link => {
    const matchesSearch =
      link.anchor_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.source_page?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.target_page?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = linkTypeFilter === 'all' || link.link_type === linkTypeFilter
    return matchesSearch && matchesType
  })

  const getLinkTypeBadge = (type: string) => {
    switch (type) {
      case 'manual':
        return <Badge variant="primary">Manual</Badge>
      case 'auto':
        return <Badge variant="secondary">Auto</Badge>
      case 'related':
        return <Badge variant="outline">Related</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Internal Links</h1>
          <p className="text-gray-600 mt-1">Manage internal linking between pages for SEO</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Add Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Add Internal Link
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Source Page *</Label>
                <select
                  value={formData.source_page_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, source_page_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Select source page</option>
                  {pages.map(page => (
                    <option key={page.id} value={page.id}>{page.title}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Target Page *</Label>
                <select
                  value={formData.target_page_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_page_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Select target page</option>
                  {pages.map(page => (
                    <option key={page.id} value={page.id}>{page.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Anchor Text *</Label>
              <Input
                value={formData.anchor_text}
                onChange={(e) => setFormData(prev => ({ ...prev, anchor_text: e.target.value }))}
                placeholder="Link text (e.g., 'modular office buildings')"
              />
            </div>
            <div className="space-y-2">
              <Label>Context</Label>
              <Textarea
                value={formData.context}
                onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
                placeholder="Where in the content should this link appear?"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Link Type</Label>
                <select
                  value={formData.link_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, link_type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="manual">Manual</option>
                  <option value="auto">Auto</option>
                  <option value="related">Related</option>
                </select>
              </div>
              <div className="space-y-2 flex items-end">
                <div className="flex items-center gap-2 pb-2">
                  <input
                    type="checkbox"
                    id="is_active_new"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                  <Label htmlFor="is_active_new" className="text-sm font-normal">Active</Label>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={handleAdd}>
                <Save className="h-4 w-4 mr-2" />
                Save Link
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
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
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={linkTypeFilter}
              onChange={(e) => setLinkTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Types</option>
              <option value="manual">Manual</option>
              <option value="auto">Auto</option>
              <option value="related">Related</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{links.length}</p>
            <p className="text-sm text-gray-500">Total Links</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{links.filter(l => l.is_active).length}</p>
            <p className="text-sm text-gray-500">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{links.filter(l => l.link_type === 'manual').length}</p>
            <p className="text-sm text-gray-500">Manual</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{links.filter(l => l.link_type === 'related').length}</p>
            <p className="text-sm text-gray-500">Related</p>
          </CardContent>
        </Card>
      </div>

      {/* Links List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredLinks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Link2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No internal links found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || linkTypeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Start building your internal linking strategy'}
            </p>
            <Button variant="primary" onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredLinks.map((link) => (
            <Card key={link.id} className={`${!link.is_active ? 'opacity-60' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="font-medium text-gray-900 truncate">
                        {link.source_page?.title || 'Unknown'}
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="font-medium text-blue-600 truncate">
                        {link.target_page?.title || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Anchor:</span>
                      <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">
                        {link.anchor_text}
                      </span>
                      {getLinkTypeBadge(link.link_type)}
                      {!link.is_active && <Badge variant="gray">Inactive</Badge>}
                    </div>
                    {link.context && (
                      <p className="text-sm text-gray-500 mt-1 truncate">{link.context}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive(link)}
                    >
                      {link.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    {deleteConfirm === link.id ? (
                      <>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(link.id)}
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteConfirm(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(link.id)}
                        className="text-red-600 hover:text-red-700"
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
