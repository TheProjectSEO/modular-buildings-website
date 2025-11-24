import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'

export interface InternalLink {
  title: string
  url: string
  description?: string
  isExternal?: boolean
}

interface InternalLinksSectionProps {
  links: InternalLink[]
  title?: string
  subtitle?: string
  columns?: 2 | 3 | 4
  showIcon?: boolean
  className?: string
}

export const InternalLinksSection: React.FC<InternalLinksSectionProps> = ({
  links,
  title = 'Related Products',
  subtitle,
  columns = 3,
  showIcon = true,
  className = '',
}) => {
  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section className={`py-12 md:py-16 bg-mb-bg-light ${className}`}>
      <div className="container-custom">
        {/* Section Header */}
        {(title || subtitle) && (
          <div className="text-center mb-10">
            {title && (
              <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-3">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base text-mb-gray max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Links Grid */}
        <div className={`grid ${gridClasses[columns]} gap-6`}>
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              className="group bg-white border border-mb-border-gray rounded-mb-lg p-6 hover:border-mb-navy hover:shadow-mb-hover transition-all duration-200"
              target={link.isExternal ? '_blank' : undefined}
              rel={link.isExternal ? 'noopener noreferrer' : undefined}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-mb-dark group-hover:text-mb-navy transition-colors mb-2">
                    {link.title}
                  </h3>
                  {link.description && (
                    <p className="text-sm text-mb-gray line-clamp-2 leading-normal">
                      {link.description}
                    </p>
                  )}
                </div>
                {showIcon && (
                  <span className="flex-shrink-0 text-mb-link-blue group-hover:text-mb-navy transition-colors">
                    {link.isExternal ? (
                      <ExternalLink className="w-5 h-5" />
                    ) : (
                      <ArrowRight className="w-5 h-5" />
                    )}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
