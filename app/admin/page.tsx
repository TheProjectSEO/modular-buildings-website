'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  HelpCircle,
  Link2,
  Code,
  Layers,
  Image,
  ArrowRight,
  Plus,
  Settings,
  TrendingUp,
  Eye,
  Clock,
  Activity
} from 'lucide-react'
import { getDashboardStats, getPages } from '@/lib/supabase'
import type { Page } from '@/lib/supabase'

interface DashboardStats {
  totalPages: number
  publishedPages: number
  draftPages: number
  totalFAQs: number
  totalRedirects: number
  totalMedia: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPages: 0,
    publishedPages: 0,
    draftPages: 0,
    totalFAQs: 0,
    totalRedirects: 0,
    totalMedia: 0
  })
  const [recentPages, setRecentPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)

  const adminSections = [
    {
      id: 'pages',
      title: 'Pages',
      description: 'Manage all website pages',
      icon: FileText,
      href: '/admin/pages',
      color: 'bg-blue-500',
      stats: `${stats.totalPages} total`
    },
    {
      id: 'faqs',
      title: 'FAQs',
      description: 'Manage frequently asked questions',
      icon: HelpCircle,
      href: '/admin/faqs',
      color: 'bg-green-500',
      stats: `${stats.totalFAQs} FAQs`
    },
    {
      id: 'internal-links',
      title: 'Internal Links',
      description: 'Manage internal linking structure',
      icon: Link2,
      href: '/admin/internal-links',
      color: 'bg-purple-500',
      stats: 'SEO optimization'
    },
    {
      id: 'structured-data',
      title: 'Schema/SEO',
      description: 'Manage structured data & SEO',
      icon: Code,
      href: '/admin/structured-data',
      color: 'bg-indigo-500',
      stats: 'JSON-LD schemas'
    },
    {
      id: 'content-sections',
      title: 'Content Sections',
      description: 'Manage reusable content blocks',
      icon: Layers,
      href: '/admin/content-sections',
      color: 'bg-orange-500',
      stats: 'Page sections'
    },
    {
      id: 'media',
      title: 'Media Library',
      description: 'Manage images and files',
      icon: Image,
      href: '/admin/media',
      color: 'bg-pink-500',
      stats: `${stats.totalMedia} files`
    },
    {
      id: 'redirects',
      title: 'Redirects',
      description: 'Manage URL redirects',
      icon: ArrowRight,
      href: '/admin/redirects',
      color: 'bg-cyan-500',
      stats: `${stats.totalRedirects} active`
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Site-wide settings',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500',
      stats: 'Configuration'
    }
  ]

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Load dashboard stats
      const dashboardStats = await getDashboardStats()
      setStats(dashboardStats)

      // Load recent pages
      const { data: pages } = await getPages({ limit: 5 })
      setRecentPages(pages)

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-[1600px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Welcome to Modular Buildings CMS</p>
        </div>
        <Button asChild className="w-full sm:w-auto flex-shrink-0 bg-blue-600 hover:bg-blue-700">
          <Link href="/admin/pages/new">
            <Plus className="h-4 w-4 mr-2" />
            New Page
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Pages</h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{loading ? '...' : stats.totalPages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 truncate">Published</h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{loading ? '...' : stats.publishedPages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                </div>
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 truncate">Drafts</h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{loading ? '...' : stats.draftPages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 truncate">FAQs</h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{loading ? '...' : stats.totalFAQs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {adminSections.map((section) => {
              const Icon = section.icon
              return (
                <Link
                  key={section.id}
                  href={section.href}
                  className="group block p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 ${section.color} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-gray-700 truncate">
                        {section.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                        {section.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 sm:mt-2">
                        {section.stats}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Pages and System Status */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Pages */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                Recent Pages
              </CardTitle>
              <Button variant="ghost" size="sm" asChild className="w-full sm:w-auto text-xs sm:text-sm">
                <Link href="/admin/pages">
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentPages.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {recentPages.map((page) => (
                  <div key={page.id} className="flex items-start sm:items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/admin/pages/${page.id}/edit`}
                        className="text-sm sm:text-base font-medium text-gray-900 hover:text-blue-600 line-clamp-2 block"
                      >
                        {page.title}
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge
                          variant={page.status === 'published' ? 'success' : 'secondary'}
                          className="text-xs"
                        >
                          {page.status}
                        </Badge>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(page.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
                      <Link href={`/${page.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <FileText className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                <p className="text-sm sm:text-base">No pages found</p>
                <Button asChild className="mt-3 sm:mt-4 w-full sm:w-auto text-xs sm:text-sm" variant="outline">
                  <Link href="/admin/pages/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Page
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm text-gray-700 truncate">Admin Panel</span>
                </div>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 whitespace-nowrap flex-shrink-0">
                  Active
                </Badge>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm text-gray-700 truncate">Supabase Connection</span>
                </div>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 whitespace-nowrap flex-shrink-0">
                  Connected
                </Badge>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm text-gray-700 truncate">Schema Management</span>
                </div>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 whitespace-nowrap flex-shrink-0">
                  Active
                </Badge>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm text-gray-700 truncate">SEO Tools</span>
                </div>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 whitespace-nowrap flex-shrink-0">
                  Active
                </Badge>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm text-gray-700 truncate">Media Library</span>
                </div>
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 whitespace-nowrap flex-shrink-0">
                  Ready
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
