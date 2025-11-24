interface FeatureItem {
  label: string
  value: string
}

interface FeatureListProps {
  features: FeatureItem[]
}

export const FeatureList: React.FC<FeatureListProps> = ({ features }) => {
  return (
    <div className="border border-mb-border-gray rounded-mb-lg overflow-hidden">
      {features.map((feature, index) => (
        <div
          key={index}
          className={`
            flex items-center
            ${index !== features.length - 1 ? 'border-b border-dashed border-mb-border-gray' : ''}
          `}
        >
          <div className="w-2/5 p-4 font-semibold text-mb-dark">
            {feature.label}:
          </div>
          <div className="w-3/5 p-4 text-gray-700">
            {feature.value}
          </div>
        </div>
      ))}
    </div>
  )
}
