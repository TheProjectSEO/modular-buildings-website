/**
 * SECTION UTILITIES
 *
 * Common patterns and helper components for sections
 */

import React from 'react'

// =============================================================================
// Section Container
// =============================================================================

interface SectionContainerProps {
  children: React.ReactNode
  className?: string
  backgroundColor?: 'white' | 'light' | 'navy' | 'warning'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  className = '',
  backgroundColor = 'white',
  padding = 'md',
  fullWidth = false,
}) => {
  const bgClasses = {
    white: 'bg-white',
    light: 'bg-mb-bg-light',
    navy: 'bg-mb-navy text-white',
    warning: 'bg-mb-warning text-white',
  }

  const paddingClasses = {
    none: '',
    sm: 'py-8',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-24',
  }

  return (
    <section className={`${bgClasses[backgroundColor]} ${paddingClasses[padding]} ${className}`}>
      {fullWidth ? children : <div className="container-custom">{children}</div>}
    </section>
  )
}

// =============================================================================
// Section Header
// =============================================================================

interface SectionHeaderProps {
  title: string
  subtitle?: string
  description?: string
  alignment?: 'left' | 'center' | 'right'
  className?: string
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  description,
  alignment = 'center',
  className = '',
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <div className={`mb-10 ${alignmentClasses[alignment]} ${className}`}>
      {subtitle && (
        <p className="text-sm md:text-base font-semibold mb-2 uppercase tracking-wide text-mb-navy">
          {subtitle}
        </p>
      )}
      <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-base text-mb-gray max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}

// =============================================================================
// Divider
// =============================================================================

interface DividerProps {
  type?: 'line' | 'space' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Divider: React.FC<DividerProps> = ({
  type = 'line',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
  }

  if (type === 'space') {
    return <div className={`${sizeClasses[size]} ${className}`} />
  }

  if (type === 'gradient') {
    return (
      <div className={`${sizeClasses[size]} flex items-center ${className}`}>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-mb-border-gray to-transparent" />
      </div>
    )
  }

  // Default: line
  return (
    <div className={`${sizeClasses[size]} flex items-center ${className}`}>
      <div className="w-full border-t border-mb-border-gray" />
    </div>
  )
}

// =============================================================================
// Stats Grid
// =============================================================================

interface Stat {
  value: string | number
  label: string
  unit?: string
  icon?: React.ReactNode
}

interface StatsGridProps {
  stats: Stat[]
  columns?: 2 | 3 | 4
  variant?: 'minimal' | 'card' | 'highlighted'
  className?: string
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  columns = 4,
  variant = 'minimal',
  className = '',
}) => {
  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }

  if (variant === 'card') {
    return (
      <div className={`grid ${gridClasses[columns]} gap-6 ${className}`}>
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-mb-border-gray rounded-mb-lg p-6 text-center hover:shadow-md transition-shadow"
          >
            {stat.icon && <div className="text-mb-navy mb-3">{stat.icon}</div>}
            <div className="text-3xl font-bold text-mb-navy mb-2">
              {stat.value}
              {stat.unit && <span className="text-xl ml-1">{stat.unit}</span>}
            </div>
            <div className="text-sm text-mb-gray">{stat.label}</div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'highlighted') {
    return (
      <div className={`grid ${gridClasses[columns]} gap-6 ${className}`}>
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            {stat.icon && (
              <div className="text-mb-warning text-3xl mb-3 flex justify-center">
                {stat.icon}
              </div>
            )}
            <div className="text-4xl font-extrabold text-mb-navy mb-2">
              {stat.value}
              {stat.unit && <span className="text-2xl ml-1">{stat.unit}</span>}
            </div>
            <div className="text-base text-mb-dark font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    )
  }

  // Default: minimal
  return (
    <div className={`grid ${gridClasses[columns]} gap-8 ${className}`}>
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          {stat.icon && <div className="text-mb-navy mb-2">{stat.icon}</div>}
          <div className="text-3xl md:text-4xl font-bold text-mb-navy mb-1">
            {stat.value}
            {stat.unit && <span className="text-xl ml-1">{stat.unit}</span>}
          </div>
          <div className="text-sm md:text-base text-mb-gray">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// Feature Grid
// =============================================================================

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

interface FeatureGridProps {
  features: Feature[]
  columns?: 2 | 3 | 4
  variant?: 'icon-top' | 'icon-left'
  className?: string
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({
  features,
  columns = 3,
  variant = 'icon-top',
  className = '',
}) => {
  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  if (variant === 'icon-left') {
    return (
      <div className={`space-y-6 ${className}`}>
        {features.map((feature, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-mb bg-mb-navy text-white">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-mb-dark mb-2">
                {feature.title}
              </h3>
              <p className="text-base text-mb-gray leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Default: icon-top
  return (
    <div className={`grid ${gridClasses[columns]} gap-8 ${className}`}>
      {features.map((feature, index) => (
        <div key={index} className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-mb-lg bg-mb-navy text-white mb-4">
            {feature.icon}
          </div>
          <h3 className="text-lg font-semibold text-mb-dark mb-2">
            {feature.title}
          </h3>
          <p className="text-base text-mb-gray leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// Example Usage
// =============================================================================

/*
import {
  SectionContainer,
  SectionHeader,
  Divider,
  StatsGrid,
  FeatureGrid
} from '@/components/sections/SectionUtils'

// Section Container
<SectionContainer backgroundColor="light" padding="lg">
  <SectionHeader
    title="Our Achievements"
    subtitle="By the Numbers"
    description="See what makes Modular Buildings Co the industry leader"
    alignment="center"
  />
  <StatsGrid
    columns={4}
    variant="highlighted"
    stats={[
      { value: "50+", label: "Years Experience" },
      { value: "100+", label: "Countries" },
      { value: "10k+", label: "Projects" },
      { value: "A+", label: "Energy Rating" }
    ]}
  />
</SectionContainer>

// Feature Grid
<SectionContainer backgroundColor="white" padding="md">
  <SectionHeader title="Why Choose Us" alignment="center" />
  <FeatureGrid
    columns={3}
    variant="icon-top"
    features={[
      {
        icon: <Clock className="w-8 h-8" />,
        title: "Fast Delivery",
        description: "Projects completed in 30-60 days"
      },
      {
        icon: <Shield className="w-8 h-8" />,
        title: "Quality Assured",
        description: "ISO certified manufacturing"
      },
      {
        icon: <Leaf className="w-8 h-8" />,
        title: "Sustainable",
        description: "Eco-friendly materials"
      }
    ]}
  />
</SectionContainer>

// Divider
<Divider type="gradient" size="lg" />
*/
