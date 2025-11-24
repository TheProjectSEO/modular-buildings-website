'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
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
  Image as ImageIcon,
  AlertTriangle,
  X,
  Save,
  Copy,
  Check,
  FileText,
  Film,
  FileIcon,
  Grid,
  List,
  ExternalLink,
  Download,
  Upload,
  CloudUpload,
  Loader2
} from 'lucide-react'
import { supabase, Media } from '@/lib/supabase'

// Simplified page type for the dropdown selection
interface PageListItem {
  id: string
  title: string
  slug: string
}

interface MediaWithPage extends Media {
  page?: { id: string; title: string; slug: string }
}

interface UploadingFile {
  id: string
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'complete' | 'error'
  error?: string
  preview?: string
}

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaWithPage[]>([])
  const [pages, setPages] = useState<PageListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showUploadZone, setShowUploadZone] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [selectedMedia, setSelectedMedia] = useState<MediaWithPage | null>(null)

  // Upload state
  const [isDragging, setIsDragging] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [uploadPageId, setUploadPageId] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state for manual URL entry
  const [formData, setFormData] = useState({
    page_id: '',
    file_name: '',
    file_url: '',
    file_type: 'image',
    alt_text: '',
    caption: '',
    width: 0,
    height: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      uploadingFiles.forEach(f => {
        if (f.preview) URL.revokeObjectURL(f.preview)
      })
    }
  }, [uploadingFiles])

  const loadData = async () => {
    setLoading(true)
    try {
      const [mediaResult, pagesResult] = await Promise.all([
        supabase
          .from('media')
          .select('*, page:pages(id, title, slug)')
          .order('created_at', { ascending: false }),
        supabase
          .from('pages')
          .select('id, title, slug')
          .order('title')
      ])

      if (mediaResult.error) throw mediaResult.error
      if (pagesResult.error) throw pagesResult.error

      setMedia(mediaResult.data || [])
      setPages(pagesResult.data || [])
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load media')
    } finally {
      setLoading(false)
    }
  }

  // File upload handler
  const uploadFile = async (uploadingFile: UploadingFile) => {
    const formData = new FormData()
    formData.append('file', uploadingFile.file)
    if (uploadPageId) {
      formData.append('page_id', uploadPageId)
    }

    try {
      // Update status to uploading
      setUploadingFiles(prev =>
        prev.map(f =>
          f.id === uploadingFile.id
            ? { ...f, status: 'uploading' as const, progress: 10 }
            : f
        )
      )

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      // Simulate progress updates
      setUploadingFiles(prev =>
        prev.map(f =>
          f.id === uploadingFile.id ? { ...f, progress: 50 } : f
        )
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      // Update to complete
      setUploadingFiles(prev =>
        prev.map(f =>
          f.id === uploadingFile.id
            ? { ...f, status: 'complete' as const, progress: 100 }
            : f
        )
      )

      // Add to media list
      if (result.data) {
        setMedia(prev => [result.data, ...prev])
      }

      // Remove from uploading list after a delay
      setTimeout(() => {
        setUploadingFiles(prev => prev.filter(f => f.id !== uploadingFile.id))
      }, 2000)
    } catch (err) {
      console.error('Upload error:', err)
      setUploadingFiles(prev =>
        prev.map(f =>
          f.id === uploadingFile.id
            ? {
                ...f,
                status: 'error' as const,
                error: err instanceof Error ? err.message : 'Upload failed'
              }
            : f
        )
      )
    }
  }

  // Handle file selection
  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return

      const newUploadingFiles: UploadingFile[] = Array.from(files).map(file => {
        const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        let preview: string | undefined

        // Create preview for images
        if (file.type.startsWith('image/')) {
          preview = URL.createObjectURL(file)
        }

        return {
          id,
          file,
          progress: 0,
          status: 'pending',
          preview
        }
      })

      setUploadingFiles(prev => [...prev, ...newUploadingFiles])

      // Start uploading each file
      newUploadingFiles.forEach(uploadFile)
    },
    [uploadPageId]
  )

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect]
  )

  // Handle manual URL add
  const handleAdd = async () => {
    if (!formData.file_name || !formData.file_url) {
      setError('Please fill in file name and URL')
      return
    }

    const { data, error } = await supabase
      .from('media')
      .insert({
        page_id: formData.page_id || null,
        file_name: formData.file_name,
        file_url: formData.file_url,
        file_type: formData.file_type,
        alt_text: formData.alt_text || null,
        caption: formData.caption || null,
        width: formData.width || null,
        height: formData.height || null
      })
      .select('*, page:pages(id, title, slug)')
      .single()

    if (error) {
      setError(error.message)
    } else if (data) {
      setMedia([data, ...media])
      setFormData({
        page_id: '',
        file_name: '',
        file_url: '',
        file_type: 'image',
        alt_text: '',
        caption: '',
        width: 0,
        height: 0
      })
      setShowAddForm(false)
    }
  }

  // Handle delete with storage cleanup
  const handleDelete = async (id: string) => {
    try {
      // Use the API route to delete both storage and database record
      const response = await fetch(`/api/admin/upload?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Delete failed')
      }

      setMedia(media.filter(m => m.id !== id))
      setDeleteConfirm(null)
      setSelectedMedia(null)
    } catch (err) {
      console.error('Delete error:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete media')
    }
  }

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const filteredMedia = media.filter(item => {
    const matchesSearch =
      item.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alt_text?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || item.file_type.includes(typeFilter)
    return matchesSearch && matchesType
  })

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <ImageIcon className="h-5 w-5" />
    if (fileType.includes('video')) return <Film className="h-5 w-5" />
    return <FileIcon className="h-5 w-5" />
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const imageCount = media.filter(m => m.file_type.includes('image')).length
  const videoCount = media.filter(m => m.file_type.includes('video')).length
  const otherCount = media.length - imageCount - videoCount

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-1">Manage images, videos, and other media files</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add URL
          </Button>
          <Button variant="primary" onClick={() => setShowUploadZone(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            {error}
            <Button variant="ghost" size="sm" onClick={() => setError(null)}>
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Upload Zone */}
      {showUploadZone && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CloudUpload className="h-5 w-5" />
                Upload Files
              </span>
              <Button variant="ghost" size="sm" onClick={() => setShowUploadZone(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Page Selection */}
            <div className="space-y-2">
              <Label>Associate with Page (Optional)</Label>
              <select
                value={uploadPageId}
                onChange={(e) => setUploadPageId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">None (Global)</option>
                {pages.map(page => (
                  <option key={page.id} value={page.id}>{page.title}</option>
                ))}
              </select>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/webm,application/pdf"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
              <CloudUpload className={`h-12 w-12 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
              <p className="text-lg font-medium text-gray-900 mb-1">
                {isDragging ? 'Drop files here' : 'Drag & drop files here'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to browse
              </p>
              <p className="text-xs text-gray-400">
                Supported: JPG, PNG, WebP, GIF, SVG, MP4, WebM, PDF (max 10MB)
              </p>
            </div>

            {/* Uploading Files List */}
            {uploadingFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Uploading Files</p>
                {uploadingFiles.map(file => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    {/* Preview */}
                    <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.file.size)}
                      </p>

                      {/* Progress bar */}
                      {file.status === 'uploading' && (
                        <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      )}

                      {/* Error message */}
                      {file.status === 'error' && (
                        <p className="text-xs text-red-600 mt-1">{file.error}</p>
                      )}
                    </div>

                    {/* Status icon */}
                    <div className="flex-shrink-0">
                      {file.status === 'pending' && (
                        <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                      )}
                      {file.status === 'uploading' && (
                        <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                      )}
                      {file.status === 'complete' && (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                      {file.status === 'error' && (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Form (Manual URL) */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Add Media by URL
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>File Name *</Label>
                <Input
                  value={formData.file_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, file_name: e.target.value }))}
                  placeholder="my-image.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label>File Type</Label>
                <select
                  value={formData.file_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, file_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="image/jpeg">Image (JPEG)</option>
                  <option value="image/png">Image (PNG)</option>
                  <option value="image/webp">Image (WebP)</option>
                  <option value="image/svg+xml">Image (SVG)</option>
                  <option value="video/mp4">Video (MP4)</option>
                  <option value="application/pdf">PDF</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>File URL *</Label>
              <Input
                value={formData.file_url}
                onChange={(e) => setFormData(prev => ({ ...prev, file_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Alt Text</Label>
                <Input
                  value={formData.alt_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                  placeholder="Description for accessibility"
                />
              </div>
              <div className="space-y-2">
                <Label>Associated Page</Label>
                <select
                  value={formData.page_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, page_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">None (Global)</option>
                  {pages.map(page => (
                    <option key={page.id} value={page.id}>{page.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Width (px)</Label>
                <Input
                  type="number"
                  value={formData.width || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, width: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Height (px)</Label>
                <Input
                  type="number"
                  value={formData.height || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={handleAdd}>
                <Save className="h-4 w-4 mr-2" />
                Save Media
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
                placeholder="Search media..."
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
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="pdf">PDFs</option>
            </select>
            <div className="flex gap-1">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{media.length}</p>
            <p className="text-sm text-gray-500">Total Files</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{imageCount}</p>
            <p className="text-sm text-gray-500">Images</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{videoCount}</p>
            <p className="text-sm text-gray-500">Videos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-600">{otherCount}</p>
            <p className="text-sm text-gray-500">Other</p>
          </CardContent>
        </Card>
      </div>

      {/* Media Display */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredMedia.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No media found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || typeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Add media files to your library'}
            </p>
            <Button variant="primary" onClick={() => setShowUploadZone(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedMedia(item)}
            >
              <div className="aspect-square bg-gray-100 relative">
                {item.file_type.includes('image') ? (
                  <img
                    src={item.file_url}
                    alt={item.alt_text || item.file_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f3f4f6" width="100" height="100"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12">No Preview</text></svg>'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getFileIcon(item.file_type)}
                  </div>
                )}
              </div>
              <CardContent className="p-2">
                <p className="text-sm font-medium text-gray-900 truncate">{item.file_name}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">{item.file_type.split('/')[1]?.toUpperCase()}</p>
                  {item.file_size && (
                    <p className="text-xs text-gray-400">{formatFileSize(item.file_size)}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredMedia.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                  {item.file_type.includes('image') ? (
                    <img
                      src={item.file_url}
                      alt={item.alt_text || item.file_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getFileIcon(item.file_type)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.file_name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Badge variant="outline">{item.file_type.split('/')[1]?.toUpperCase()}</Badge>
                    {item.file_size && (
                      <span>{formatFileSize(item.file_size)}</span>
                    )}
                    {item.width && item.height && (
                      <span>{item.width}x{item.height}</span>
                    )}
                    {item.page && (
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {item.page.title}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyUrl(item.file_url, item.id)}
                  >
                    {copied === item.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  {deleteConfirm === item.id ? (
                    <>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
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
                      onClick={() => setDeleteConfirm(item.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Media Detail Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedMedia(null)}>
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {selectedMedia.file_name}
                <Button variant="ghost" size="sm" onClick={() => setSelectedMedia(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedMedia.file_type.includes('image') && (
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={selectedMedia.file_url}
                    alt={selectedMedia.alt_text || selectedMedia.file_name}
                    className="w-full h-auto max-h-[400px] object-contain"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Type</p>
                  <p className="font-medium">{selectedMedia.file_type}</p>
                </div>
                {selectedMedia.file_size && (
                  <div>
                    <p className="text-gray-500">Size</p>
                    <p className="font-medium">{formatFileSize(selectedMedia.file_size)}</p>
                  </div>
                )}
                {selectedMedia.width && selectedMedia.height && (
                  <div>
                    <p className="text-gray-500">Dimensions</p>
                    <p className="font-medium">{selectedMedia.width}x{selectedMedia.height}</p>
                  </div>
                )}
                {selectedMedia.alt_text && (
                  <div className="col-span-2">
                    <p className="text-gray-500">Alt Text</p>
                    <p className="font-medium">{selectedMedia.alt_text}</p>
                  </div>
                )}
                {selectedMedia.page && (
                  <div className="col-span-2">
                    <p className="text-gray-500">Associated Page</p>
                    <p className="font-medium">{selectedMedia.page.title}</p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-gray-500 text-sm">URL</p>
                <div className="flex gap-2">
                  <Input value={selectedMedia.file_url} readOnly className="font-mono text-xs" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyUrl(selectedMedia.file_url, selectedMedia.id)}
                  >
                    {copied === selectedMedia.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" asChild>
                  <a href={selectedMedia.file_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Original
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={selectedMedia.file_url} download={selectedMedia.file_name}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDelete(selectedMedia.id)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
