'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

interface ProductCardProps {
  title: string
  category: string
  imageUrl: string
  href: string
  area?: number
  completionDays?: number
}

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  category,
  imageUrl,
  href,
  area,
  completionDays,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Category Badge */}
      <div className="relative">
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-mb-warning text-white text-xs font-semibold px-3 py-1 rounded-mb">
            {category}
          </span>
        </div>

        {/* Image */}
        <div className="relative h-50 overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className={`object-cover transition-opacity duration-200 ${isHovered ? 'opacity-70' : 'opacity-100'}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>

      {/* Title Section */}
      <div className="h-24 p-4">
        <h3 className="text-base font-semibold line-clamp-3 text-mb-dark">
          {title}
        </h3>
        {(area || completionDays) && (
          <div className="mt-2 flex gap-3 text-xs text-mb-gray">
            {area && <span>{area} m²</span>}
            {completionDays && <span>{completionDays} days</span>}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <Link
          href={href}
          className="text-mb-link-blue hover:text-mb-warning text-sm font-medium transition-colors inline-flex items-center gap-1"
        >
          Get Price Detail
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
