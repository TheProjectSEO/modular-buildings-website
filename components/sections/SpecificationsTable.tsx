import { Info } from 'lucide-react'

export interface Specification {
  label: string
  value: string | number
  unit?: string
  icon?: React.ReactNode
  tooltip?: string
}

export interface SpecificationGroup {
  groupName: string
  specs: Specification[]
}

interface SpecificationsTableProps {
  specifications: Specification[] | SpecificationGroup[]
  title?: string
  variant?: 'simple' | 'grouped' | 'cards'
  showIcons?: boolean
  striped?: boolean
  className?: string
}

export const SpecificationsTable: React.FC<SpecificationsTableProps> = ({
  specifications,
  title = 'Technical Specifications',
  variant = 'simple',
  showIcons = false,
  striped = true,
  className = '',
}) => {
  const isGrouped = specifications.length > 0 && 'groupName' in specifications[0]

  const renderSpecRow = (spec: Specification, index: number, total: number) => (
    <tr
      key={index}
      className={`border-b border-mb-border-light last:border-b-0 ${
        striped && index % 2 === 0 ? 'bg-mb-bg-light' : 'bg-white'
      } hover:bg-mb-bg-light/50 transition-colors`}
    >
      <td className="px-4 py-3 text-sm md:text-base font-semibold text-mb-dark">
        <div className="flex items-center gap-2">
          {showIcons && spec.icon && (
            <span className="text-mb-navy">{spec.icon}</span>
          )}
          {spec.label}
          {spec.tooltip && (
            <span
              className="text-mb-gray hover:text-mb-navy cursor-help"
              title={spec.tooltip}
            >
              <Info className="w-4 h-4" />
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm md:text-base text-mb-gray text-right">
        {spec.value}
        {spec.unit && <span className="ml-1 text-xs">{spec.unit}</span>}
      </td>
    </tr>
  )

  const renderSimpleTable = (specs: Specification[]) => (
    <div className="overflow-x-auto">
      <table className="w-full border border-mb-border-gray rounded-mb-lg overflow-hidden">
        <tbody>
          {specs.map((spec, index) => renderSpecRow(spec, index, specs.length))}
        </tbody>
      </table>
    </div>
  )

  const renderGroupedTable = (groups: SpecificationGroup[]) => (
    <div className="space-y-6">
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="border border-mb-border-gray rounded-mb-lg overflow-hidden">
          <div className="bg-mb-navy text-white px-4 py-3">
            <h3 className="text-lg font-bold">{group.groupName}</h3>
          </div>
          <table className="w-full">
            <tbody>
              {group.specs.map((spec, index) => renderSpecRow(spec, index, group.specs.length))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )

  const renderCardsView = (specs: Specification[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {specs.map((spec, index) => (
        <div
          key={index}
          className="border border-mb-border-gray rounded-mb-lg p-4 bg-white hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-3">
            {showIcons && spec.icon && (
              <span className="text-mb-navy text-xl">{spec.icon}</span>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-mb-gray">{spec.label}</p>
                {spec.tooltip && (
                  <span
                    className="text-mb-gray hover:text-mb-navy cursor-help"
                    title={spec.tooltip}
                  >
                    <Info className="w-3 h-3" />
                  </span>
                )}
              </div>
              <p className="text-lg font-bold text-mb-dark">
                {spec.value}
                {spec.unit && <span className="ml-1 text-sm font-normal">{spec.unit}</span>}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <section className={`py-12 md:py-16 ${className}`}>
      <div className="container-custom">
        {/* Section Header */}
        {title && (
          <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-8">
            {title}
          </h2>
        )}

        {/* Specifications Content */}
        {variant === 'cards' && !isGrouped && renderCardsView(specifications as Specification[])}
        {variant === 'grouped' && isGrouped && renderGroupedTable(specifications as SpecificationGroup[])}
        {variant === 'simple' && !isGrouped && renderSimpleTable(specifications as Specification[])}
      </div>
    </section>
  )
}
