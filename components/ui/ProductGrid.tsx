interface ProductGridProps {
  children: React.ReactNode
  columns?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
}) => {
  return (
    <div
      className={`
        grid gap-5
        grid-cols-${columns.mobile}
        md:grid-cols-${columns.tablet}
        lg:grid-cols-${columns.desktop}
      `}
    >
      {children}
    </div>
  )
}
