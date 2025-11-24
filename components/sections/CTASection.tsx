import { Button } from '@/components/ui/button'
import Image from 'next/image'

export interface CTAButton {
  text: string
  href: string
  variant?: 'primary' | 'warning' | 'outline'
  onClick?: () => void
}

interface CTASectionProps {
  title: string
  subtitle?: string
  description?: string
  primaryButton?: CTAButton
  secondaryButton?: CTAButton
  variant?: 'contained' | 'full-width' | 'centered' | 'with-image'
  backgroundImage?: string
  backgroundColor?: 'navy' | 'warning' | 'light' | 'white'
  className?: string
}

export const CTASection: React.FC<CTASectionProps> = ({
  title,
  subtitle,
  description,
  primaryButton,
  secondaryButton,
  variant = 'contained',
  backgroundImage,
  backgroundColor = 'navy',
  className = '',
}) => {
  const bgClasses = {
    navy: 'bg-mb-navy text-white',
    warning: 'bg-mb-warning text-white',
    light: 'bg-mb-bg-light text-mb-dark',
    white: 'bg-white text-mb-dark',
  }

  const renderButtons = () => (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {primaryButton && (
        <Button
          variant={primaryButton.variant || 'primary'}
          size="lg"
          onClick={primaryButton.onClick}
          className="min-w-[180px]"
        >
          <a href={primaryButton.href} className="w-full">
            {primaryButton.text}
          </a>
        </Button>
      )}
      {secondaryButton && (
        <Button
          variant={secondaryButton.variant || 'outline'}
          size="lg"
          onClick={secondaryButton.onClick}
          className="min-w-[180px]"
        >
          <a href={secondaryButton.href} className="w-full">
            {secondaryButton.text}
          </a>
        </Button>
      )}
    </div>
  )

  const renderContent = () => (
    <>
      {subtitle && (
        <p className="text-sm md:text-base font-semibold mb-2 uppercase tracking-wide opacity-90">
          {subtitle}
        </p>
      )}
      <h2 className="text-h2 md:text-h1 font-bold mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-base md:text-lg mb-8 opacity-90 leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      )}
      {renderButtons()}
    </>
  )

  if (variant === 'with-image' && backgroundImage) {
    return (
      <section className={`relative py-16 md:py-24 overflow-hidden ${className}`}>
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt={title}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-mb-navy/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 container-custom text-center text-white">
          {renderContent()}
        </div>
      </section>
    )
  }

  if (variant === 'full-width') {
    return (
      <section className={`py-16 md:py-24 ${bgClasses[backgroundColor]} ${className}`}>
        <div className="text-center px-6">
          {renderContent()}
        </div>
      </section>
    )
  }

  if (variant === 'centered') {
    return (
      <section className={`py-16 md:py-24 ${bgClasses[backgroundColor]} ${className}`}>
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            {renderContent()}
          </div>
        </div>
      </section>
    )
  }

  // Default: contained variant
  return (
    <section className={`py-12 md:py-16 ${className}`}>
      <div className="container-custom">
        <div className={`${bgClasses[backgroundColor]} rounded-mb-lg p-8 md:p-12 text-center`}>
          {renderContent()}
        </div>
      </div>
    </section>
  )
}
