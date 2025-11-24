import Image from 'next/image'
import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href: string
}

interface CategoryBannerProps {
  title: string
  backgroundImage: string
  breadcrumbs: BreadcrumbItem[]
}

export const CategoryBanner: React.FC<CategoryBannerProps> = ({
  title,
  backgroundImage,
  breadcrumbs,
}) => {
  return (
    <div className="relative h-[260px] w-full overflow-hidden">
      <Image
        src={backgroundImage}
        alt={title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <div className="container-custom">
          {/* Breadcrumb */}
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-white/80 text-sm">
              {breadcrumbs.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  {index > 0 && <span>&gt;</span>}
                  {index < breadcrumbs.length - 1 ? (
                    <Link href={item.href} className="hover:text-white">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-white">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Title */}
          <h1 className="text-4xl font-extrabold text-white">
            {title}
          </h1>
        </div>
      </div>
    </div>
  )
}
