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
  Edit,
  X,
  Save,
  User,
  Mail,
  AlertTriangle,
  FileText
} from 'lucide-react'
import {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  type Author
} from '@/lib/admin-api'

export default function AuthorsAdminPage() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar_url: '',
    bio: '',
    social_links: {
      twitter: '',
      linkedin: '',
      github: '',
      website: ''
    }
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const result = await getAuthors({ limit: 100 })
      setAuthors(result.authors || [])
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load authors')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.name || !formData.email) {
      setError('Please fill in all required fields: name and email')
      return
    }

    try {
      const result = await createAuthor(formData)
      setAuthors([result.author, ...authors])
      resetForm()
      setShowAddForm(false)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      const result = await updateAuthor(id, formData)
      setAuthors(authors.map(a => a.id === id ? result.author : a))
      resetForm()
      setEditingId(null)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteAuthor(id)
      setAuthors(authors.filter(a => a.id !== id))
      setDeleteConfirm(null)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const startEdit = (author: Author) => {
    setFormData({
      name: author.name,
      email: author.email,
      avatar_url: author.avatar_url || '',
      bio: author.bio || '',
      social_links: {
        twitter: author.social_links?.twitter || '',
        linkedin: author.social_links?.linkedin || '',
        github: author.social_links?.github || '',
        website: author.social_links?.website || ''
      }
    })
    setEditingId(author.id)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      avatar_url: '',
      bio: '',
      social_links: {
        twitter: '',
        linkedin: '',
        github: '',
        website: ''
      }
    })
  }

  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    author.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (author.bio && author.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Authors</h1>
          <p className="text-gray-600 mt-1">Manage blog post authors and their profiles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.href = '/admin/blog'}>
            <FileText className="h-4 w-4 mr-2" />
            Blog Posts
          </Button>
          <Button variant="primary" onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Author
          </Button>
        </div>
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
              {editingId ? 'Edit Author' : 'New Author'}
              <Button variant="ghost" size="sm" onClick={() => {
                setShowAddForm(false)
                setEditingId(null)
                resetForm()
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
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Avatar URL</Label>
              <Input
                value={formData.avatar_url}
                onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                placeholder="https://example.com/avatar.jpg or https://api.dicebear.com/..."
              />
              {formData.avatar_url && (
                <img src={formData.avatar_url} alt="Avatar preview" className="w-20 h-20 rounded-full object-cover" />
              )}
              <p className="text-xs text-gray-500">
                Try: https://api.dicebear.com/7.x/avataaars/svg?seed={formData.name.replace(/\s/g, '')}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Short bio about the author..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[100px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Social Links</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">Twitter</Label>
                  <Input
                    value={formData.social_links.twitter}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      social_links: { ...prev.social_links, twitter: e.target.value }
                    }))}
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">LinkedIn</Label>
                  <Input
                    value={formData.social_links.linkedin}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      social_links: { ...prev.social_links, linkedin: e.target.value }
                    }))}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">GitHub</Label>
                  <Input
                    value={formData.social_links.github}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      social_links: { ...prev.social_links, github: e.target.value }
                    }))}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">Website</Label>
                  <Input
                    value={formData.social_links.website}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      social_links: { ...prev.social_links, website: e.target.value }
                    }))}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}
              >
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Update Author' : 'Save Author'}
              </Button>
              <Button variant="outline" onClick={() => {
                setShowAddForm(false)
                setEditingId(null)
                resetForm()
              }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{authors.length}</p>
            <p className="text-sm text-gray-500">Total Authors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {authors.filter(a => a.avatar_url).length}
            </p>
            <p className="text-sm text-gray-500">With Avatar</p>
          </CardContent>
        </Card>
      </div>

      {/* Authors List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredAuthors.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No authors found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? 'Try adjusting your search'
                : 'Add authors to assign to blog posts'}
            </p>
            <Button variant="primary" onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Author
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredAuthors.map((author) => (
            <Card key={author.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {author.avatar_url ? (
                    <img
                      src={author.avatar_url}
                      alt={author.name}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-lg font-bold">{author.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {author.email}
                        </p>
                      </div>
                    </div>
                    {author.bio && (
                      <p className="text-sm text-gray-700 line-clamp-2 mb-2">{author.bio}</p>
                    )}
                    {author.social_links && Object.values(author.social_links).some(Boolean) && (
                      <div className="flex gap-2 mb-2">
                        {Object.entries(author.social_links).map(([platform, url]) =>
                          url ? (
                            <Badge key={platform} variant="outline">
                              {platform}
                            </Badge>
                          ) : null
                        )}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => startEdit(author)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {deleteConfirm === author.id ? (
                        <>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(author.id)}
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
                          onClick={() => setDeleteConfirm(author.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
