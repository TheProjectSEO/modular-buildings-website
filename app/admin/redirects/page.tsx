'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Plus,
  Search,
  Trash2,
  ArrowRight,
  AlertTriangle,
  X,
  Save,
  Edit
} from 'lucide-react'
import { supabase, Redirect } from '@/lib/supabase'

export default function RedirectsPage() {
  const [redirects, setRedirects] = useState<Redirect[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    source_url: '',
    target_url: '',
    redirect_type: 301 as 301 | 302 | 307 | 308,
    is_active: true
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('redirects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setRedirects(data || [])
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load redirects')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.source_url || !formData.target_url) {
      setError('Please fill in all required fields')
      return
    }

    // Ensure paths start with /
    const sourcePath = formData.source_url.startsWith('/') ? formData.source_url : '/' + formData.source_url
    const targetPath = formData.target_url.startsWith('/') || formData.target_url.startsWith('http')
      ? formData.target_url
      : '/' + formData.target_url

    const { data, error } = await supabase
      .from('redirects')
      .insert({
        source_url: sourcePath,
        target_url: targetPath,
        redirect_type: formData.redirect_type,
        is_active: formData.is_active
      })
      .select()
      .single()

    if (error) {
      setError(error.message)
    } else if (data) {
      setRedirects([data, ...redirects])
      setFormData({
        source_url: '',
        target_url: '',
        redirect_type: 301,
        is_active: true
      })
      setShowAddForm(false)
    }
  }

  const handleUpdate = async (id: string) => {
    const redirect = redirects.find(r => r.id === id)
    if (!redirect) return

    const { error } = await supabase
      .from('redirects')
      .update({
        source_url: formData.source_url,
        target_url: formData.target_url,
        redirect_type: formData.redirect_type,
        is_active: formData.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      setRedirects(redirects.map(r => r.id === id ? {
        ...r,
        source_url: formData.source_url,
        target_url: formData.target_url,
        redirect_type: formData.redirect_type,
        is_active: formData.is_active
      } : r))
      setEditingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('redirects')
      .delete()
      .eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      setRedirects(redirects.filter(r => r.id !== id))
      setDeleteConfirm(null)
    }
  }

  const toggleActive = async (redirect: Redirect) => {
    const { error } = await supabase
      .from('redirects')
      .update({ is_active: !redirect.is_active, updated_at: new Date().toISOString() })
      .eq('id', redirect.id)

    if (!error) {
      setRedirects(redirects.map(r => r.id === redirect.id ? { ...r, is_active: !r.is_active } : r))
    }
  }

  const startEdit = (redirect: Redirect) => {
    setFormData({
      source_url: redirect.source_url,
      target_url: redirect.target_url,
      redirect_type: redirect.redirect_type,
      is_active: redirect.is_active
    })
    setEditingId(redirect.id)
  }

  const filteredRedirects = redirects.filter(redirect => {
    const matchesSearch =
      redirect.source_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      redirect.target_url.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || redirect.redirect_type.toString() === typeFilter
    return matchesSearch && matchesType
  })

  const getTypeBadge = (type: number) => {
    switch (type) {
      case 301:
        return <Badge variant="primary">301 Permanent</Badge>
      case 302:
        return <Badge variant="warning">302 Temporary</Badge>
      case 307:
        return <Badge variant="outline">307 Temp Redirect</Badge>
      case 308:
        return <Badge variant="success">308 Permanent</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  // Hit count removed - column not in database schema

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Redirects</h1>
          <p className="text-gray-600 mt-1">Manage URL redirects for SEO and user experience</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Redirect
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
              {editingId ? 'Edit Redirect' : 'Add New Redirect'}
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
                <Label>Source Path *</Label>
                <Input
                  value={formData.source_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, source_url: e.target.value }))}
                  placeholder="/old-page"
                />
                <p className="text-xs text-gray-500">The old URL that should redirect</p>
              </div>
              <div className="space-y-2">
                <Label>Target Path *</Label>
                <Input
                  value={formData.target_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_url: e.target.value }))}
                  placeholder="/new-page or https://..."
                />
                <p className="text-xs text-gray-500">Where users should be redirected</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Redirect Type</Label>
                <select
                  value={formData.redirect_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, redirect_type: parseInt(e.target.value) as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value={301}>301 - Permanent Redirect</option>
                  <option value={302}>302 - Temporary Redirect</option>
                  <option value={307}>307 - Temporary Redirect (preserve method)</option>
                  <option value={308}>308 - Permanent Redirect (preserve method)</option>
                </select>
              </div>
              <div className="space-y-2 flex items-end">
                <div className="flex items-center gap-2 pb-2">
                  <input
                    type="checkbox"
                    id="is_active_form"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                  <Label htmlFor="is_active_form" className="text-sm font-normal">Active</Label>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}
              >
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Update Redirect' : 'Save Redirect'}
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
                placeholder="Search redirects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Types</option>
              <option value="301">301 Permanent</option>
              <option value="302">302 Temporary</option>
              <option value="307">307 Temp Redirect</option>
              <option value="308">308 Permanent</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{redirects.length}</p>
            <p className="text-sm text-gray-500">Total Redirects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{redirects.filter(r => r.is_active).length}</p>
            <p className="text-sm text-gray-500">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{redirects.filter(r => r.redirect_type === 301).length}</p>
            <p className="text-sm text-gray-500">301 Redirects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{redirects.filter(r => r.redirect_type === 302).length}</p>
            <p className="text-sm text-gray-500">302 Redirects</p>
          </CardContent>
        </Card>
      </div>

      {/* Redirects List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredRedirects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ArrowRight className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No redirects found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || typeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Add redirects to manage URL changes'}
            </p>
            <Button variant="primary" onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Redirect
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredRedirects.map((redirect) => (
            <Card key={redirect.id} className={`${!redirect.is_active ? 'opacity-60' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded truncate max-w-[200px]">
                        {redirect.source_url}
                      </code>
                      <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <code className="text-sm font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded truncate max-w-[200px]">
                        {redirect.target_url}
                      </code>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {getTypeBadge(redirect.redirect_type)}
                      {!redirect.is_active && <Badge variant="gray">Inactive</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(redirect)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive(redirect)}
                    >
                      {redirect.is_active ? 'Disable' : 'Enable'}
                    </Button>
                    {deleteConfirm === redirect.id ? (
                      <>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(redirect.id)}
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
                        onClick={() => setDeleteConfirm(redirect.id)}
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
