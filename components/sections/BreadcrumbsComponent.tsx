import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsComponentProps {
  items: BreadcrumbItem[]
  showHome?: boolean
  className?: string
}

export const BreadcrumbsComponent: React.FC<BreadcrumbsComponentProps> = ({
  items,
  showHome = true,
  className = '',
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`py-4 ${className}`}
    >
      <div className="container-custom">
        <ol className="flex items-center flex-wrap gap-2 text-sm">
          {/* Home Link */}
          {showHome && (
            <>
              <li>
                <Link
                  href="/"
                  className="flex items-center text-mb-link-blue hover:text-mb-navy transition-colors"
                  aria-label="Home"
                >
                  <Home className="w-4 h-4" />
                </Link>
              </li>
              <li>
                <ChevronRight className="w-4 h-4 text-mb-gray" />
              </li>
            </>
          )}

          {/* Breadcrumb Items */}
          {items.map((item, index) => {
            const isLast = index === items.length - 1

            return (
              <li key={index} className="flex items-center gap-2">
                {isLast ? (
                  <span
                    className="text-mb-gray font-medium"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <>
                    <Link
                      href={item.href}
                      className="text-mb-link-blue hover:text-mb-navy transition-colors hover:underline"
                    >
                      {item.label}
                    </Link>
                    <ChevronRight className="w-4 h-4 text-mb-gray" />
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
