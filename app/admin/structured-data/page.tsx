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
  Code,
  AlertTriangle,
  X,
  Save,
  Copy,
  Check,
  FileText,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { supabase, StructuredData } from '@/lib/supabase'

// Simplified page type for the dropdown selection
interface PageListItem {
  id: string
  title: string
  slug: string
}

interface StructuredDataWithPage extends StructuredData {
  page?: { id: string; title: string; slug: string }
}

const SCHEMA_TEMPLATES: Record<string, object> = {
  Product: {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "",
    "description": "",
    "image": "",
    "brand": {
      "@type": "Brand",
      "name": "Modular Buildings"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "",
      "url": ""
    }
  },
  FAQPage: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": []
  },
  Organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Modular Buildings",
    "url": "https://modular-buildings.co",
    "logo": "",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "",
      "contactType": "customer service"
    }
  },
  LocalBusiness: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "",
      "addressLocality": "",
      "addressRegion": "",
      "postalCode": "",
      "addressCountry": ""
    },
    "telephone": "",
    "openingHours": ""
  },
  BreadcrumbList: {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": []
  },
  Article: {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "",
    "datePublished": "",
    "dateModified": "",
    "author": {
      "@type": "Organization",
      "name": "Modular Buildings"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Modular Buildings",
      "logo": {
        "@type": "ImageObject",
        "url": ""
      }
    }
  },
  WebPage: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "",
    "description": "",
    "url": ""
  }
}

export default function StructuredDataPage() {
  const [schemas, setSchemas] = useState<StructuredDataWithPage[]>([])
  const [pages, setPages] = useState<PageListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [schemaTypeFilter, setSchemaTypeFilter] = useState<string>('all')
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [expandedSchema, setExpandedSchema] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [jsonError, setJsonError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    page_id: '',
    schema_type: 'Product',
    data: JSON.stringify(SCHEMA_TEMPLATES.Product, null, 2),
    is_active: true
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [schemasResult, pagesResult] = await Promise.all([
        supabase
          .from('structured_data')
          .select('*, page:pages(id, title, slug)')
          .order('created_at', { ascending: false }),
        supabase
          .from('pages')
          .select('id, title, slug')
          .order('title')
      ])

      if (schemasResult.error) throw schemasResult.error
      if (pagesResult.error) throw pagesResult.error

      setSchemas(schemasResult.data || [])
      setPages(pagesResult.data || [])
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load structured data')
    } finally {
      setLoading(false)
    }
  }

  const handleSchemaTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      schema_type: type,
      data: JSON.stringify(SCHEMA_TEMPLATES[type] || {}, null, 2)
    }))
    setJsonError(null)
  }

  const validateJson = (json: string): boolean => {
    try {
      JSON.parse(json)
      setJsonError(null)
      return true
    } catch (e) {
      setJsonError('Invalid JSON format')
      return false
    }
  }

  const handleAdd = async () => {
    if (!formData.page_id) {
      setError('Please select a page')
      return
    }

    if (!validateJson(formData.data)) {
      return
    }

    const { data, error } = await supabase
      .from('structured_data')
      .insert({
        page_id: formData.page_id,
        schema_type: formData.schema_type,
        json_ld: JSON.parse(formData.data),
        is_active: formData.is_active
      })
      .select('*, page:pages(id, title, slug)')
      .single()

    if (error) {
      setError(error.message)
    } else if (data) {
      setSchemas([data, ...schemas])
      setFormData({
        page_id: '',
        schema_type: 'Product',
        data: JSON.stringify(SCHEMA_TEMPLATES.Product, null, 2),
        is_active: true
      })
      setShowAddForm(false)
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('structured_data')
      .delete()
      .eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      setSchemas(schemas.filter(s => s.id !== id))
      setDeleteConfirm(null)
    }
  }

  const toggleActive = async (schema: StructuredDataWithPage) => {
    const { error } = await supabase
      .from('structured_data')
      .update({ is_active: !schema.is_active, updated_at: new Date().toISOString() })
      .eq('id', schema.id)

    if (!error) {
      setSchemas(schemas.map(s => s.id === schema.id ? { ...s, is_active: !s.is_active } : s))
    }
  }

  const copyToClipboard = (schema: StructuredDataWithPage) => {
    const jsonString = JSON.stringify(schema.data, null, 2)
    navigator.clipboard.writeText(jsonString)
    setCopied(schema.id)
    setTimeout(() => setCopied(null), 2000)
  }

  const filteredSchemas = schemas.filter(schema => {
    const matchesSearch =
      schema.schema_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schema.page?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = schemaTypeFilter === 'all' || schema.schema_type === schemaTypeFilter
    return matchesSearch && matchesType
  })

  const schemaTypes = [...new Set(schemas.map(s => s.schema_type))]

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Structured Data / Schema</h1>
          <p className="text-gray-600 mt-1">Manage Schema.org JSON-LD markup for SEO</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Schema
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
              Add Schema Markup
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
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
                >
                  <option value="">Select a page</option>
                  {pages.map(page => (
                    <option key={page.id} value={page.id}>{page.title}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Schema Type</Label>
                <select
                  value={formData.schema_type}
                  onChange={(e) => handleSchemaTypeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {Object.keys(SCHEMA_TEMPLATES).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>JSON-LD Data *</Label>
              <Textarea
                value={formData.data}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, data: e.target.value }))
                  validateJson(e.target.value)
                }}
                placeholder='{"@context": "https://schema.org", ...}'
                rows={12}
                className={`font-mono text-sm ${jsonError ? 'border-red-500' : ''}`}
              />
              {jsonError && <p className="text-sm text-red-500">{jsonError}</p>}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active_new"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <Label htmlFor="is_active_new" className="text-sm font-normal">Active</Label>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={handleAdd} disabled={!!jsonError}>
                <Save className="h-4 w-4 mr-2" />
                Save Schema
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
                placeholder="Search schemas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={schemaTypeFilter}
              onChange={(e) => setSchemaTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Types</option>
              {schemaTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{schemas.length}</p>
            <p className="text-sm text-gray-500">Total Schemas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{schemas.filter(s => s.is_active).length}</p>
            <p className="text-sm text-gray-500">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{schemaTypes.length}</p>
            <p className="text-sm text-gray-500">Schema Types</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {new Set(schemas.map(s => s.page_id)).size}
            </p>
            <p className="text-sm text-gray-500">Pages with Schema</p>
          </CardContent>
        </Card>
      </div>

      {/* Schemas List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredSchemas.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schema markup found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || schemaTypeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Add structured data to improve SEO'}
            </p>
            <Button variant="primary" onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Schema
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredSchemas.map((schema) => (
            <Card key={schema.id} className={`${!schema.is_active ? 'opacity-60' : ''}`}>
              <CardContent className="p-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedSchema(expandedSchema === schema.id ? null : schema.id)}
                >
                  <div className="flex items-center gap-3">
                    <Code className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="primary">{schema.schema_type}</Badge>
                        {!schema.is_active && <Badge variant="gray">Inactive</Badge>}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        <FileText className="h-3 w-3 inline mr-1" />
                        {schema.page?.title || 'Unknown page'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {expandedSchema === schema.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedSchema === schema.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-green-400 font-mono">
                        {JSON.stringify(schema.data, null, 2)}
                      </pre>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          copyToClipboard(schema)
                        }}
                      >
                        {copied === schema.id ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy JSON
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleActive(schema)
                        }}
                      >
                        {schema.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      {deleteConfirm === schema.id ? (
                        <>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(schema.id)
                            }}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteConfirm(null)
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteConfirm(schema.id)
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
