'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface SimilarityResult {
  contentId: string
  url: string
  title: string
  similarityScore: number
}

interface RecommendedLinksProps {
  pageId: string
  limit?: number
  minSimilarity?: number
  className?: string
  showScores?: boolean
}

export default function RecommendedLinks({
  pageId,
  limit = 5,
  minSimilarity = 0.3,
  className = '',
  showScores = false
}: RecommendedLinksProps) {
  const [recommendations, setRecommendations] = useState<SimilarityResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRecommendations()
  }, [pageId, limit, minSimilarity])

  const loadRecommendations = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `/api/admin/internal-linking/recommendations/${pageId}?limit=${limit}&minSimilarity=${minSimilarity}`
      )

      if (!res.ok) {
        throw new Error('Failed to load recommendations')
      }

      const data = await res.json()
      setRecommendations(data.recommendations || [])
    } catch (err: any) {
      console.error('Error loading recommendations:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-2 text-blue-800">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-sm">Loading recommendations...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <p className="text-sm text-red-800">Error: {error}</p>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
        <p className="text-sm text-gray-600">
          No similar content found. Make sure the content is indexed.
        </p>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Recommended Internal Links
      </h3>

      <ul className="space-y-2">
        {recommendations.map((rec) => (
          <li
            key={rec.contentId}
            className="flex items-start gap-2 text-sm hover:bg-gray-50 p-2 rounded transition-colors"
          >
            <div className="flex-1">
              <Link
                href={rec.url}
                target="_blank"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {rec.title}
              </Link>

              {showScores && (
                <span className="ml-2 text-xs text-gray-500">
                  ({Math.round(rec.similarityScore * 100)}% similar)
                </span>
              )}

              <div className="text-xs text-gray-500 mt-1">{rec.url}</div>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(rec.url)
              }}
              className="text-gray-400 hover:text-gray-600 p-1"
              title="Copy URL"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={loadRecommendations}
        className="mt-3 text-xs text-blue-600 hover:text-blue-800"
      >
        Refresh recommendations
      </button>
    </div>
  )
}
