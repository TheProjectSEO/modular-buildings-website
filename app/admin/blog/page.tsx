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
  Eye,
  X,
  Save,
  FileText,
  User,
  Calendar,
  AlertTriangle,
  Image as ImageIcon,
  Code
} from 'lucide-react'
import {
  getBlogPosts,
  getAuthors,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  type BlogPost,
  type Author
} from '@/lib/admin-api'

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'schema'>('content')

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author_id: '',
    category: '',
    featured_image: '',
    is_featured: false,
    is_published: false,
    read_time: 5,
    seo_title: '',
    seo_description: '',
    faq_schema: [] as Array<{ question: string; answer: string }>,
    custom_schema: {} as Record<string, any>,
    callouts: [] as Array<{
      type: 'info' | 'warning' | 'success' | 'error'
      title?: string
      content: string
      position?: string
    }>
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [postsResult, authorsResult] = await Promise.all([
        getBlogPosts({ limit: 100 }),
        getAuthors({ limit: 100 })
      ])
      setPosts(postsResult.posts || [])
      setAuthors(authorsResult.authors || [])
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.title || !formData.slug || !formData.content) {
      setError('Please fill in all required fields: title, slug, and content')
      return
    }

    try {
      const result = await createBlogPost(formData)
      setPosts([result.post, ...posts])
      resetForm()
      setShowAddForm(false)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      const result = await updateBlogPost(id, formData)
      setPosts(posts.map(p => p.id === id ? result.post : p))
      resetForm()
      setEditingId(null)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteBlogPost(id)
      setPosts(posts.filter(p => p.id !== id))
      setDeleteConfirm(null)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const togglePublished = async (post: BlogPost) => {
    try {
      const result = await updateBlogPost(post.id, { is_published: !post.is_published })
      setPosts(posts.map(p => p.id === post.id ? result.post : p))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const startEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      author_id: post.author_id || '',
      category: post.category || '',
      featured_image: post.featured_image || '',
      is_featured: post.is_featured,
      is_published: post.is_published,
      read_time: post.read_time || 5,
      seo_title: post.seo_title || '',
      seo_description: post.seo_description || '',
      faq_schema: post.faq_schema || [],
      custom_schema: post.custom_schema || {},
      callouts: post.callouts || []
    })
    setEditingId(post.id)
    setActiveTab('content')
  }

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author_id: '',
      category: '',
      featured_image: '',
      is_featured: false,
      is_published: false,
      read_time: 5,
      seo_title: '',
      seo_description: '',
      faq_schema: [],
      custom_schema: {},
      callouts: []
    })
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const addFAQ = () => {
    setFormData(prev => ({
      ...prev,
      faq_schema: [...prev.faq_schema, { question: '', answer: '' }]
    }))
  }

  const removeFAQ = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faq_schema: prev.faq_schema.filter((_, i) => i !== index)
    }))
  }

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    setFormData(prev => ({
      ...prev,
      faq_schema: prev.faq_schema.map((faq, i) =>
        i === index ? { ...faq, [field]: value } : faq
      )
    }))
  }

  const addCallout = () => {
    setFormData(prev => ({
      ...prev,
      callouts: [...prev.callouts, { type: 'info', title: '', content: '', position: '' }]
    }))
  }

  const removeCallout = (index: number) => {
    setFormData(prev => ({
      ...prev,
      callouts: prev.callouts.filter((_, i) => i !== index)
    }))
  }

  const updateCallout = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      callouts: prev.callouts.map((callout, i) =>
        i === index ? { ...callout, [field]: value } : callout
      )
    }))
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && post.is_published) ||
      (statusFilter === 'draft' && !post.is_published)
    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = Array.from(new Set(posts.map(p => p.category).filter(Boolean)))

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600 mt-1">Manage blog content, authors, and SEO</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.href = '/admin/authors'}>
            <User className="h-4 w-4 mr-2" />
            Authors
          </Button>
          <Button variant="primary" onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Post
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
              {editingId ? 'Edit Blog Post' : 'New Blog Post'}
              <Button variant="ghost" size="sm" onClick={() => {
                setShowAddForm(false)
                setEditingId(null)
                resetForm()
              }}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b">
              <button
                onClick={() => setActiveTab('content')}
                className={`px-4 py-2 font-medium ${activeTab === 'content' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Content
              </button>
              <button
                onClick={() => setActiveTab('seo')}
                className={`px-4 py-2 font-medium ${activeTab === 'seo' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                <Search className="h-4 w-4 inline mr-2" />
                SEO
              </button>
              <button
                onClick={() => setActiveTab('schema')}
                className={`px-4 py-2 font-medium ${activeTab === 'schema' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                <Code className="h-4 w-4 inline mr-2" />
                Schema & Callouts
              </button>
            </div>

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, title: e.target.value }))
                        if (!editingId && !formData.slug) {
                          setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }))
                        }
                      }}
                      placeholder="Blog post title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Slug *</Label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="blog-post-url"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Excerpt</Label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Short description for preview..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Content * (HTML/Markdown)</Label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="<h2>Main content here</h2><p>Write your blog post content...</p>"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[300px] font-mono"
                  />
                  <p className="text-xs text-gray-500">Supports HTML and Markdown</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Author</Label>
                    <select
                      value={formData.author_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, author_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Select author</option>
                      {authors.map(author => (
                        <option key={author.id} value={author.id}>{author.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Technology, Tips, etc."
                      list="categories"
                    />
                    <datalist id="categories">
                      {categories.map(cat => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>
                  <div className="space-y-2">
                    <Label>Read Time (min)</Label>
                    <Input
                      type="number"
                      value={formData.read_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, read_time: parseInt(e.target.value) || 5 }))}
                      min="1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Featured Image URL</Label>
                  <Input
                    value={formData.featured_image}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.featured_image && (
                    <img src={formData.featured_image} alt="Preview" className="w-32 h-32 object-cover rounded" />
                  )}
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-sm">Featured Post</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-sm">Publish Now</span>
                  </label>
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>SEO Title</Label>
                  <Input
                    value={formData.seo_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                    placeholder={formData.title || 'SEO optimized title'}
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500">{formData.seo_title.length}/60 characters</p>
                </div>

                <div className="space-y-2">
                  <Label>SEO Description</Label>
                  <textarea
                    value={formData.seo_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                    placeholder={formData.excerpt || 'SEO description for search results'}
                    maxLength={160}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[100px]"
                  />
                  <p className="text-xs text-gray-500">{formData.seo_description.length}/160 characters</p>
                </div>
              </div>
            )}

            {/* Schema & Callouts Tab */}
            {activeTab === 'schema' && (
              <div className="space-y-6">
                {/* FAQ Schema */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-semibold">FAQ Schema</Label>
                    <Button variant="outline" size="sm" onClick={addFAQ}>
                      <Plus className="h-4 w-4 mr-1" /> Add FAQ
                    </Button>
                  </div>
                  {formData.faq_schema.map((faq, index) => (
                    <div key={index} className="mb-3 p-3 border rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium">FAQ {index + 1}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeFAQ(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        value={faq.question}
                        onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                        placeholder="Question"
                        className="mb-2"
                      />
                      <textarea
                        value={faq.answer}
                        onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                        placeholder="Answer"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        rows={3}
                      />
                    </div>
                  ))}
                </div>

                {/* Callouts */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-semibold">Callout Boxes</Label>
                    <Button variant="outline" size="sm" onClick={addCallout}>
                      <Plus className="h-4 w-4 mr-1" /> Add Callout
                    </Button>
                  </div>
                  {formData.callouts.map((callout, index) => (
                    <div key={index} className="mb-3 p-3 border rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium">Callout {index + 1}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeCallout(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <select
                          value={callout.type}
                          onChange={(e) => updateCallout(index, 'type', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="info">Info</option>
                          <option value="warning">Warning</option>
                          <option value="success">Success</option>
                          <option value="error">Error</option>
                        </select>
                        <Input
                          value={callout.position}
                          onChange={(e) => updateCallout(index, 'position', e.target.value)}
                          placeholder="Position (e.g., after-paragraph-3)"
                        />
                      </div>
                      <Input
                        value={callout.title}
                        onChange={(e) => updateCallout(index, 'title', e.target.value)}
                        placeholder="Callout title (optional)"
                        className="mb-2"
                      />
                      <textarea
                        value={callout.content}
                        onChange={(e) => updateCallout(index, 'content', e.target.value)}
                        placeholder="Callout content"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        rows={3}
                      />
                    </div>
                  ))}
                </div>

                {/* Custom Schema */}
                <div>
                  <Label className="text-base font-semibold mb-2 block">Custom JSON-LD Schema</Label>
                  <textarea
                    value={JSON.stringify(formData.custom_schema, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value)
                        setFormData(prev => ({ ...prev, custom_schema: parsed }))
                      } catch {
                        // Invalid JSON, ignore
                      }
                    }}
                    placeholder='{"@type": "HowTo", "name": "How to..."}'
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono min-h-[150px]"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter valid JSON for custom schema.org markup</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-6">
              <Button
                variant="primary"
                onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}
              >
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Update Post' : 'Save Post'}
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

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
            <p className="text-sm text-gray-500">Total Posts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{posts.filter(p => p.is_published).length}</p>
            <p className="text-sm text-gray-500">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{posts.filter(p => !p.is_published).length}</p>
            <p className="text-sm text-gray-500">Drafts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{posts.filter(p => p.is_featured).length}</p>
            <p className="text-sm text-gray-500">Featured</p>
          </CardContent>
        </Card>
      </div>

      {/* Blog Posts List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first blog post to get started'}
            </p>
            <Button variant="primary" onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <Card key={post.id} className={`${!post.is_published ? 'opacity-60' : ''}`}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {post.featured_image && (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-24 h-24 object-cover rounded flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1">{post.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
                      {post.category && <Badge variant="primary">{post.category}</Badge>}
                      {post.is_featured && <Badge variant="warning">Featured</Badge>}
                      {!post.is_published && <Badge variant="gray">Draft</Badge>}
                      {post.is_published && <Badge variant="success">Published</Badge>}
                      {post.author && (
                        <span className="text-gray-600 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author.name}
                        </span>
                      )}
                      {post.read_time && (
                        <span className="text-gray-600">{post.read_time} min read</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => startEdit(post)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePublished(post)}
                      >
                        {post.is_published ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {deleteConfirm === post.id ? (
                        <>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(post.id)}
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
                          onClick={() => setDeleteConfirm(post.id)}
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
