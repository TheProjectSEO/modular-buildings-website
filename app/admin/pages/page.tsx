'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  FileText,
  Filter,
  MoreHorizontal,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertTriangle,
  Archive
} from 'lucide-react'
import { getPages, deletePage, Page } from '@/lib/admin-api'
import { getPageTypes, PageType } from '@/lib/supabase'
import { logDelete, getUserInfoForAudit } from '@/lib/audit-utils'
import { useAuth } from '@/components/admin/AuthWrapper'

export default function PagesListPage() {
  const router = useRouter()
  const { userProfile } = useAuth()
  const userInfo = getUserInfoForAudit(userProfile)
  const [pages, setPages] = useState<Page[]>([])
  const [pageTypes, setPageTypes] = useState<PageType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all')
  const [pageTypeFilter, setPageTypeFilter] = useState<string>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    loadData()
  }, [statusFilter, pageTypeFilter])

  const loadData = async () => {
    setLoading(true)
    try {
      const [pagesData, typesData] = await Promise.all([
        getPages({
          page_type: pageTypeFilter === 'all' ? undefined : pageTypeFilter
        }),
        getPageTypes()
      ])
      setPages(pagesData.pages)
      setTotalCount(pagesData.pages.length)
      setPageTypes(typesData)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load pages')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const pageToDelete = pages.find(p => p.id === id)
    try {
      await deletePage(id)
      // Log the page deletion
      await logDelete({
        entityType: 'page',
        entityId: id,
        entityTitle: pageToDelete?.meta_title || pageToDelete?.title || 'Page',
        deletedData: pageToDelete,
        ...userInfo
      })
      setPages(pages.filter(p => p.id !== id))
      setDeleteConfirm(null)
    } catch (err: any) {
      setError(err.message || 'Failed to delete page')
    }
  }

  const filteredPages = pages.filter(page =>
    (page.meta_title || page.slug).toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Published</Badge>
      case 'draft':
        return <Badge variant="warning" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Draft</Badge>
      case 'archived':
        return <Badge variant="gray" className="flex items-center gap-1"><Archive className="h-3 w-3" /> Archived</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
          <p className="text-gray-600 mt-1">Manage all website pages and their content</p>
        </div>
        <Button asChild variant="primary">
          <Link href="/admin/pages/new">
            <Plus className="h-4 w-4 mr-2" />
            New Page
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              <select
                value={pageTypeFilter}
                onChange={(e) => setPageTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                {pageTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredPages.length} of {totalCount} pages
        </p>
      </div>

      {/* Pages List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredPages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pages found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || statusFilter !== 'all' || pageTypeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first page'}
            </p>
            <Button asChild variant="primary">
              <Link href="/admin/pages/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Page
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredPages.map(page => (
            <Card key={page.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/admin/pages/${page.id}`}
                        className="text-lg font-medium text-gray-900 hover:text-blue-600 truncate"
                      >
                        {page.meta_title || page.slug}
                      </Link>
                      {page.is_featured && (
                        <Badge variant="primary" className="text-xs">Featured</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">/{page.slug}</span>
                      {page.page_type && (
                        <Badge variant="outline" className="text-xs">{page.page_type.name}</Badge>
                      )}
                      {getStatusBadge(page.status)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Updated: {formatDate(page.updated_at)}</span>
                      {page.view_count > 0 && (
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" /> {page.view_count} views
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {page.status === 'published' && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/pages/${page.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    {deleteConfirm === page.id ? (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(page.id)}
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
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(page.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
