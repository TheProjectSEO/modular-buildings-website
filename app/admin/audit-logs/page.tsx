'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Clock,
  User,
  FileText,
  HelpCircle,
  Code,
  Image,
  ArrowRight,
  Layers,
  Plus,
  Edit,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Activity,
  Eye
} from 'lucide-react'
import { getAuditLogs, AuditLog } from '@/lib/supabase'

const ITEMS_PER_PAGE = 20

// Entity type icons mapping
const entityTypeIcons: Record<string, React.ElementType> = {
  page: FileText,
  faq: HelpCircle,
  structured_data: Code,
  content_section: Layers,
  media: Image,
  redirect: ArrowRight,
  internal_link: ArrowRight,
  specification: FileText
}

// Action badge colors
const actionBadgeVariants: Record<string, 'success' | 'warning' | 'destructive' | 'outline'> = {
  create: 'success',
  update: 'warning',
  delete: 'destructive'
}

// Action icons
const actionIcons: Record<string, React.ElementType> = {
  create: Plus,
  update: Edit,
  delete: Trash2
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  // Entity type options for filter
  const entityTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'page', label: 'Pages' },
    { value: 'faq', label: 'FAQs' },
    { value: 'structured_data', label: 'Schema/SEO' },
    { value: 'content_section', label: 'Content Sections' },
    { value: 'media', label: 'Media' },
    { value: 'redirect', label: 'Redirects' },
    { value: 'internal_link', label: 'Internal Links' },
    { value: 'specification', label: 'Specifications' }
  ]

  // Action options for filter
  const actions = [
    { value: 'all', label: 'All Actions' },
    { value: 'create', label: 'Created' },
    { value: 'update', label: 'Updated' },
    { value: 'delete', label: 'Deleted' }
  ]

  useEffect(() => {
    loadLogs()
  }, [entityTypeFilter, actionFilter, currentPage])

  const loadLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getAuditLogs({
        entity_type: entityTypeFilter === 'all' ? undefined : entityTypeFilter,
        action: actionFilter === 'all' ? undefined : actionFilter as 'create' | 'update' | 'delete',
        limit: ITEMS_PER_PAGE,
        offset: (currentPage - 1) * ITEMS_PER_PAGE
      })
      setLogs(result.data)
      setTotalCount(result.count)
    } catch (err) {
      console.error('Error loading audit logs:', err)
      setError('Failed to load audit logs')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 60) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return formatDate(dateString)
  }

  const getEntityIcon = (entityType: string) => {
    const Icon = entityTypeIcons[entityType] || FileText
    return <Icon className="h-4 w-4" />
  }

  const getActionBadge = (action: string) => {
    const variant = actionBadgeVariants[action] || 'outline'
    const Icon = actionIcons[action] || Edit
    return (
      <Badge variant={variant} className="flex items-center gap-1 capitalize">
        <Icon className="h-3 w-3" />
        {action}
      </Badge>
    )
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600" />
            Audit Logs
          </h1>
          <p className="text-gray-600 mt-1">Track all content changes in the CMS</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          {totalCount} total entries
        </div>
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
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={entityTypeFilter}
                onChange={(e) => {
                  setEntityTypeFilter(e.target.value)
                  handleFilterChange()
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {entityTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value)
                  handleFilterChange()
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {actions.map(action => (
                  <option key={action.value} value={action.value}>{action.label}</option>
                ))}
              </select>
              {(entityTypeFilter !== 'all' || actionFilter !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEntityTypeFilter('all')
                    setActionFilter('all')
                    handleFilterChange()
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Showing {logs.length} of {totalCount} entries
          {currentPage > 1 && ` (Page ${currentPage} of ${totalPages})`}
        </p>
      </div>

      {/* Audit Logs Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : logs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs found</h3>
            <p className="text-gray-600">
              {entityTypeFilter !== 'all' || actionFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Activity will appear here when content is created, updated, or deleted'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entity Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-900">
                              {formatRelativeTime(log.created_at)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(log.created_at)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                                {log.user_email || 'Unknown User'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {getActionBadge(log.action)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getEntityIcon(log.entity_type)}
                            <span className="text-sm text-gray-900 capitalize">
                              {log.entity_type.replace('_', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                              {log.entity_title || 'Untitled'}
                            </span>
                            {log.entity_id && (
                              <span className="text-xs text-gray-500 font-mono truncate max-w-[200px]">
                                {log.entity_id.substring(0, 8)}...
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedLog(log)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Audit Log Details
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLog(null)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Timestamp</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedLog.created_at)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">User</label>
                  <p className="text-sm text-gray-900">{selectedLog.user_email || 'Unknown'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Action</label>
                  <div className="mt-1">{getActionBadge(selectedLog.action)}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Entity Type</label>
                  <p className="text-sm text-gray-900 capitalize">{selectedLog.entity_type.replace('_', ' ')}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase">Entity Title</label>
                  <p className="text-sm text-gray-900">{selectedLog.entity_title || 'Untitled'}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase">Entity ID</label>
                  <p className="text-sm text-gray-900 font-mono">{selectedLog.entity_id || 'N/A'}</p>
                </div>
              </div>

              {selectedLog.changes && Object.keys(selectedLog.changes).length > 0 && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Changes</label>
                  <div className="mt-2 bg-gray-50 rounded-md p-4 overflow-x-auto">
                    <pre className="text-xs text-gray-800">
                      {JSON.stringify(selectedLog.changes, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {(selectedLog.ip_address || selectedLog.user_agent) && (
                <div className="border-t pt-4">
                  <label className="text-xs font-medium text-gray-500 uppercase">Request Info</label>
                  <div className="mt-2 space-y-1">
                    {selectedLog.ip_address && (
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">IP:</span> {selectedLog.ip_address}
                      </p>
                    )}
                    {selectedLog.user_agent && (
                      <p className="text-xs text-gray-600 truncate">
                        <span className="font-medium">User Agent:</span> {selectedLog.user_agent}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
