import Image from 'next/image'

export type ContentLayout = 'text-only' | 'image-left' | 'image-right' | 'image-top' | 'image-bottom'

interface ContentBlockSectionProps {
  title?: string
  content: string
  image?: {
    url: string
    alt: string
    width?: number
    height?: number
  }
  layout?: ContentLayout
  backgroundColor?: 'white' | 'light' | 'navy'
  className?: string
}

export const ContentBlockSection: React.FC<ContentBlockSectionProps> = ({
  title,
  content,
  image,
  layout = 'text-only',
  backgroundColor = 'white',
  className = '',
}) => {
  const bgClasses = {
    white: 'bg-white',
    light: 'bg-mb-bg-light',
    navy: 'bg-mb-navy text-white',
  }

  const renderContent = () => (
    <div className={`${image && (layout === 'image-left' || layout === 'image-right') ? 'flex-1' : ''}`}>
      {title && (
        <h2 className={`text-h2 md:text-h1 font-bold mb-6 ${backgroundColor === 'navy' ? 'text-white' : 'text-mb-dark'}`}>
          {title}
        </h2>
      )}
      <div
        className={`text-base leading-relaxed prose max-w-none ${
          backgroundColor === 'navy' ? 'text-white prose-invert' : 'text-mb-gray'
        }`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )

  const renderImage = () =>
    image ? (
      <div className={`${
        layout === 'image-left' || layout === 'image-right'
          ? 'flex-1'
          : 'w-full'
      } relative ${
        layout === 'image-top' ? 'mb-8' : layout === 'image-bottom' ? 'mt-8' : ''
      }`}>
        <div className="relative w-full h-64 md:h-96 rounded-mb-lg overflow-hidden">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
          />
        </div>
      </div>
    ) : null

  return (
    <section className={`py-12 md:py-16 ${bgClasses[backgroundColor]} ${className}`}>
      <div className="container-custom">
        {layout === 'text-only' && renderContent()}

        {layout === 'image-top' && (
          <>
            {renderImage()}
            {renderContent()}
          </>
        )}

        {layout === 'image-bottom' && (
          <>
            {renderContent()}
            {renderImage()}
          </>
        )}

        {layout === 'image-left' && (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            {renderImage()}
            {renderContent()}
          </div>
        )}

        {layout === 'image-right' && (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            {renderContent()}
            {renderImage()}
          </div>
        )}
      </div>
    </section>
  )
}
