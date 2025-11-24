'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
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
  Edit,
  Trash2,
  HelpCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  FileText
} from 'lucide-react'
import { supabase, FAQ } from '@/lib/supabase'

// Simplified page type for the dropdown selection
interface PageListItem {
  id: string
  title: string
  slug: string
}

interface FAQWithPage extends FAQ {
  page?: { id: string; title: string; slug: string }
}

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQWithPage[]>([])
  const [pages, setPages] = useState<PageListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPage, setSelectedPage] = useState<string>('all')
  const [error, setError] = useState<string | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [editingFaq, setEditingFaq] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    page_id: '',
    question: '',
    answer: '',
    is_active: true
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [faqsResult, pagesResult] = await Promise.all([
        supabase
          .from('faqs')
          .select('*, page:pages(id, title, slug)')
          .order('created_at', { ascending: false }),
        supabase
          .from('pages')
          .select('id, title, slug')
          .order('title')
      ])

      if (faqsResult.error) throw faqsResult.error
      if (pagesResult.error) throw pagesResult.error

      setFaqs(faqsResult.data || [])
      setPages(pagesResult.data || [])
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load FAQs')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.page_id || !formData.question || !formData.answer) {
      setError('Please fill in all required fields')
      return
    }

    const maxOrder = faqs.filter(f => f.page_id === formData.page_id).length

    const { data, error } = await supabase
      .from('faqs')
      .insert({
        ...formData,
        order_index: maxOrder
      })
      .select('*, page:pages(id, title, slug)')
      .single()

    if (error) {
      setError(error.message)
    } else if (data) {
      setFaqs([data, ...faqs])
      setFormData({ page_id: '', question: '', answer: '', is_active: true })
      setShowAddForm(false)
    }
  }

  const handleUpdate = async (id: string, updates: Partial<FAQ>) => {
    const { error } = await supabase
      .from('faqs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      setFaqs(faqs.map(f => f.id === id ? { ...f, ...updates } : f))
      setEditingFaq(null)
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      setFaqs(faqs.filter(f => f.id !== id))
      setDeleteConfirm(null)
    }
  }

  const toggleActive = async (faq: FAQWithPage) => {
    await handleUpdate(faq.id, { is_active: !faq.is_active })
  }

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPage = selectedPage === 'all' || faq.page_id === selectedPage
    return matchesSearch && matchesPage
  })

  // Group FAQs by page
  const groupedFaqs = filteredFaqs.reduce((acc, faq) => {
    const pageTitle = faq.page?.title || 'Unassigned'
    if (!acc[pageTitle]) {
      acc[pageTitle] = []
    }
    acc[pageTitle].push(faq)
    return acc
  }, {} as Record<string, FAQWithPage[]>)

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
          <p className="text-gray-600 mt-1">Manage frequently asked questions for all pages</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add FAQ
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
              Add New FAQ
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label>Question *</Label>
              <Input
                value={formData.question}
                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Enter the question"
              />
            </div>
            <div className="space-y-2">
              <Label>Answer *</Label>
              <Textarea
                value={formData.answer}
                onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                placeholder="Enter the answer"
                rows={4}
              />
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
              <Button variant="primary" onClick={handleAdd}>
                <Save className="h-4 w-4 mr-2" />
                Save FAQ
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
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
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
            <p className="text-2xl font-bold text-gray-900">{faqs.length}</p>
            <p className="text-sm text-gray-500">Total FAQs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{faqs.filter(f => f.is_active).length}</p>
            <p className="text-sm text-gray-500">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-400">{faqs.filter(f => !f.is_active).length}</p>
            <p className="text-sm text-gray-500">Inactive</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{Object.keys(groupedFaqs).length}</p>
            <p className="text-sm text-gray-500">Pages with FAQs</p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedPage !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first FAQ'}
            </p>
            <Button variant="primary" onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedFaqs).map(([pageTitle, pageFaqs]) => (
            <Card key={pageTitle}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  {pageTitle}
                  <Badge variant="outline" className="ml-auto">{pageFaqs.length} FAQs</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pageFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      className={`border rounded-lg overflow-hidden ${faq.is_active ? 'border-gray-200' : 'border-gray-200 bg-gray-50 opacity-60'}`}
                    >
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <HelpCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="font-medium text-gray-900 truncate">{faq.question}</span>
                          {!faq.is_active && <Badge variant="gray">Inactive</Badge>}
                        </div>
                        <div className="flex items-center gap-2">
                          {expandedFaq === faq.id ? (
                            <ChevronUp className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {expandedFaq === faq.id && (
                        <div className="px-4 pb-4 border-t border-gray-100">
                          {editingFaq === faq.id ? (
                            <EditFaqForm
                              faq={faq}
                              onSave={(updates) => handleUpdate(faq.id, updates)}
                              onCancel={() => setEditingFaq(null)}
                            />
                          ) : (
                            <>
                              <p className="text-gray-600 mt-3 whitespace-pre-wrap">{faq.answer}</p>
                              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setEditingFaq(faq.id)
                                  }}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleActive(faq)
                                  }}
                                >
                                  {faq.is_active ? 'Deactivate' : 'Activate'}
                                </Button>
                                {deleteConfirm === faq.id ? (
                                  <>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDelete(faq.id)
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
                                      setDeleteConfirm(faq.id)
                                    }}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Delete
                                  </Button>
                                )}
                              </div>
                            </>
                          )}
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

function EditFaqForm({
  faq,
  onSave,
  onCancel
}: {
  faq: FAQ
  onSave: (updates: Partial<FAQ>) => void
  onCancel: () => void
}) {
  const [question, setQuestion] = useState(faq.question)
  const [answer, setAnswer] = useState(faq.answer)

  return (
    <div className="mt-3 space-y-3">
      <Input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Question"
      />
      <Textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Answer"
        rows={4}
      />
      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onSave({ question, answer })}
        >
          <Save className="h-3 w-3 mr-1" />
          Save
        </Button>
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
