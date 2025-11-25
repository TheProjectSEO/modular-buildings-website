'use client'

import { useState, useEffect } from 'react'

interface IndexStats {
  totalDocuments: number
  totalTerms: number
  processedDocuments: number
  pendingDocuments: number
  averageWordCount: number
}

interface Settings {
  id: string
  enabled: boolean
  max_recommendations: number
  similarity_threshold: number
  max_terms_per_doc: number
  max_similar_per_doc: number
  auto_index: boolean
  display_position: string
  heading_text: string
}

export default function InternalLinkingPage() {
  const [stats, setStats] = useState<IndexStats | null>(null)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsRes, settingsRes] = await Promise.all([
        fetch('/api/admin/internal-linking/index'),
        fetch('/api/admin/internal-linking/settings')
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        setSettings(settingsData)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const startIndexing = async () => {
    setProcessing(true)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/internal-linking/index', {
        method: 'POST'
      })

      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: data.message })
        loadData()
      } else {
        setMessage({ type: 'error', text: data.message })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setProcessing(false)
    }
  }

  const processBatch = async () => {
    setProcessing(true)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/internal-linking/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchSize: 10 })
      })

      const data = await res.json()

      if (data.success) {
        setMessage({
          type: 'success',
          text: `Processed ${data.processed} documents. ${data.remaining} remaining.`
        })
        loadData()
      } else {
        setMessage({ type: 'error', text: data.error || 'Processing failed' })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setProcessing(false)
    }
  }

  const calculateSimilarities = async () => {
    setProcessing(true)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/internal-linking/similarities', {
        method: 'POST'
      })

      const data = await res.json()

      if (data.success) {
        setMessage({
          type: 'success',
          text: `Calculated ${data.calculated} similarity pairs.`
        })
        loadData()
      } else {
        setMessage({ type: 'error', text: data.error || 'Calculation failed' })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setProcessing(false)
    }
  }

  const clearIndex = async () => {
    if (!confirm('Are you sure you want to clear the entire index? This cannot be undone.')) {
      return
    }

    setProcessing(true)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/internal-linking/index', {
        method: 'DELETE'
      })

      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: data.message })
        loadData()
      } else {
        setMessage({ type: 'error', text: data.message })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setProcessing(false)
    }
  }

  const updateSettings = async () => {
    if (!settings) return

    setProcessing(true)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/internal-linking/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      const data = await res.json()

      if (res.ok) {
        setSettings(data)
        setMessage({ type: 'success', text: 'Settings updated successfully' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Update failed' })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Internal Linking System</h1>
        <p>Loading...</p>
      </div>
    )
  }

  const progress = stats
    ? stats.totalDocuments > 0
      ? Math.round((stats.processedDocuments / stats.totalDocuments) * 100)
      : 0
    : 0

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Internal Linking System</h1>

      {message && (
        <div
          className={`mb-6 p-4 rounded ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Index Statistics</h2>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-2xl font-bold">{stats.totalDocuments}</div>
              <div className="text-sm text-gray-600">Total Documents</div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <div className="text-2xl font-bold">{stats.processedDocuments}</div>
              <div className="text-sm text-gray-600">Processed</div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <div className="text-2xl font-bold">{stats.pendingDocuments}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <div className="text-2xl font-bold">{stats.totalTerms.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Unique Terms</div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <div className="text-2xl font-bold">{stats.averageWordCount}</div>
              <div className="text-sm text-gray-600">Avg Words/Doc</div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <div className="text-2xl font-bold">{progress}%</div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Index Management</h2>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={startIndexing}
              disabled={processing}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : 'Start Indexing'}
            </button>
            <p className="text-sm text-gray-600">
              Scan all published pages and queue them for processing
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={processBatch}
              disabled={processing || !stats || stats.pendingDocuments === 0}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : 'Process Batch'}
            </button>
            <p className="text-sm text-gray-600">
              Process next 10 pending documents (calculates TF-IDF scores)
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={calculateSimilarities}
              disabled={processing || !stats || stats.processedDocuments < 2}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : 'Calculate Similarities'}
            </button>
            <p className="text-sm text-gray-600">
              Calculate similarity scores between all processed documents
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={clearIndex}
              disabled={processing}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : 'Clear Index'}
            </button>
            <p className="text-sm text-gray-600">
              Delete all indexed data and start fresh
            </p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>

        {settings && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) =>
                    setSettings({ ...settings, enabled: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Enable Internal Linking</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Max Recommendations
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={settings.max_recommendations}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      max_recommendations: parseInt(e.target.value)
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Similarity Threshold (0-1)
                </label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.similarity_threshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      similarity_threshold: parseFloat(e.target.value)
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Heading Text
                </label>
                <input
                  type="text"
                  value={settings.heading_text}
                  onChange={(e) =>
                    setSettings({ ...settings, heading_text: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Display Position
                </label>
                <select
                  value={settings.display_position}
                  onChange={(e) =>
                    setSettings({ ...settings, display_position: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="after_content">After Content</option>
                  <option value="manual">Manual Placement</option>
                </select>
              </div>
            </div>

            <button
              onClick={updateSettings}
              disabled={processing}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {processing ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
