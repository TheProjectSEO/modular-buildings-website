'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AuthWrapper, useAuth } from '@/components/admin/AuthWrapper'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Home,
  FileText,
  HelpCircle,
  Link2,
  Code,
  Layers,
  Image,
  ArrowRight,
  User,
  LogOut,
  Menu,
  X,
  Building2,
  Settings,
  List,
  Activity
} from 'lucide-react'

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    href: '/admin'
  },
  {
    id: 'pages',
    label: 'Pages',
    icon: FileText,
    href: '/admin/pages'
  },
  {
    id: 'page-types',
    label: 'Page Types',
    icon: List,
    href: '/admin/page-types'
  },
  {
    id: 'faqs',
    label: 'FAQs',
    icon: HelpCircle,
    href: '/admin/faqs'
  },
  {
    id: 'internal-links',
    label: 'Internal Links',
    icon: Link2,
    href: '/admin/internal-links'
  },
  {
    id: 'structured-data',
    label: 'Schema/SEO',
    icon: Code,
    href: '/admin/structured-data'
  },
  {
    id: 'content-sections',
    label: 'Content Sections',
    icon: Layers,
    href: '/admin/content-sections'
  },
  {
    id: 'media',
    label: 'Media Library',
    icon: Image,
    href: '/admin/media'
  },
  {
    id: 'redirects',
    label: 'Redirects',
    icon: ArrowRight,
    href: '/admin/redirects'
  },
  {
    id: 'audit-logs',
    label: 'Audit Logs',
    icon: Activity,
    href: '/admin/audit-logs'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/admin/settings'
  }
]

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const { userProfile, handleLogout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-6">
              <Link href="/admin" className="flex items-center text-base sm:text-lg font-bold text-gray-900 whitespace-nowrap">
                <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                Modular Buildings CMS
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`flex items-center px-2 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 mr-1.5" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-2">
              {/* User Account Display */}
              {userProfile && (
                <div className="hidden md:flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg">
                  <User className="h-3.5 w-3.5 text-blue-600" />
                  <span className="text-xs font-medium text-blue-900">
                    {userProfile.username}
                  </span>
                  <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 border-blue-200 capitalize px-1.5 py-0">
                    {userProfile.role}
                  </Badge>
                </div>
              )}

              <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-xs">
                <Link href="/">
                  <Home className="h-3.5 w-3.5 mr-1.5" />
                  View Site
                </Link>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:flex text-xs"
              >
                <LogOut className="h-3.5 w-3.5 mr-1.5" />
                Logout
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
              {/* User Info on Mobile */}
              {userProfile && (
                <div className="md:hidden mb-3 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      {userProfile.username}
                    </span>
                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 border-blue-200 capitalize">
                      {userProfile.role}
                    </Badge>
                  </div>
                </div>
              )}

              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Link>
                )
              })}
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-t border-gray-200 mt-2 pt-3"
              >
                <Home className="h-5 w-5 mr-3" />
                View Site
              </Link>
              <button
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center px-4 py-3 rounded-md text-sm font-medium text-red-600 hover:text-red-900 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthWrapper>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </AuthWrapper>
  )
}
