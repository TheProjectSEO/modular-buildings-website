import Image from 'next/image'
import { ReactNode } from 'react'

interface HeroBannerProps {
  title: string
  subtitle?: string
  backgroundImage: string
  height?: 'sm' | 'md' | 'lg'
  overlay?: boolean
  ctaButton?: ReactNode
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  backgroundImage,
  height = 'md',
  overlay = true,
  ctaButton,
}) => {
  const heightClasses = {
    sm: 'h-60',
    md: 'h-96',
    lg: 'h-[500px]',
  }

  return (
    <div className={`relative ${heightClasses[height]} w-full overflow-hidden`}>
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt={title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30" />
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-hero font-extrabold text-white mb-4 drop-shadow-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-white/90 mb-6 drop-shadow">
              {subtitle}
            </p>
          )}
          {ctaButton && <div>{ctaButton}</div>}
        </div>
      </div>
    </div>
  )
}
