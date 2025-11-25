import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { Metadata } from 'next'
import { getPlaceholderImage } from '@/lib/placeholder-image'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore our completed prefabricated and modular building projects around the world.',
}

async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('completion_date', { ascending: false })

  if (error) {
    // Silently handle if projects table doesn't exist yet
    // Will use mock data as fallback
    if (error.code !== 'PGRST205') {
      console.error('Error fetching projects:', error)
    }
    return []
  }

  return data
}

function getMockProjects() {
  return [
    {
      id: '1',
      title: 'Prefabricated Office Complex - Istanbul',
      slug: 'prefab-office-istanbul',
      category: 'Office Buildings',
      location: 'Arnavutköy, Istanbul, Turkey',
      country: 'Turkey',
      city: 'Istanbul',
      completion_days: 32,
      total_area: 560,
      description: '2-storey prefabricated office building with modern design, completed in just 32 days. Features energy-efficient systems and customizable interior layout.',
      features: ['560 m² total area', '2 floors', 'Completed in 32 days', 'Modern design', 'Energy efficient'],
      images: [{ url: getPlaceholderImage(600, 400, 'Istanbul Office'), alt: 'Office Complex Istanbul' }],
      is_featured: true,
      is_published: true,
    },
    {
      id: '2',
      title: 'Modular School Building - Dubai',
      slug: 'modular-school-dubai',
      category: 'Educational Facilities',
      location: 'Dubai, UAE',
      country: 'UAE',
      city: 'Dubai',
      completion_days: 45,
      total_area: 1840,
      description: 'Large-scale modular school facility with 14 classrooms and 4 laboratories. Built to accommodate 900 students with all modern amenities.',
      features: ['1840 m² total area', '14 classrooms', '900 student capacity', '4 laboratories', 'Safety certified'],
      images: [{ url: getPlaceholderImage(600, 400, 'Dubai School'), alt: 'School Dubai' }],
      is_featured: true,
      is_published: true,
    },
    {
      id: '3',
      title: 'Container Office Park - London',
      slug: 'container-office-london',
      category: 'Container Solutions',
      location: 'Canary Wharf, London, UK',
      country: 'UK',
      city: 'London',
      completion_days: 15,
      total_area: 280,
      description: 'Modern container office complex featuring 20 individual office units. Perfect for startups and creative agencies.',
      features: ['20 office units', 'Portable design', 'Quick installation', 'Modern amenities'],
      images: [{ url: getPlaceholderImage(600, 400, 'London Container Office'), alt: 'Container Office London' }],
      is_featured: false,
      is_published: true,
    },
    {
      id: '4',
      title: 'Modular Hotel - Paris',
      slug: 'modular-hotel-paris',
      category: 'Hospitality',
      location: 'Paris, France',
      country: 'France',
      city: 'Paris',
      completion_days: 60,
      total_area: 3200,
      description: 'Boutique modular hotel with 40 rooms. Features sustainable design and rapid construction timeline.',
      features: ['40 hotel rooms', '3200 m² total area', 'Eco-friendly', 'Modern design'],
      images: [{ url: getPlaceholderImage(600, 400, 'Paris Hotel'), alt: 'Modular Hotel Paris' }],
      is_featured: true,
      is_published: true,
    },
    {
      id: '5',
      title: 'Construction Site Cabins - Berlin',
      slug: 'site-cabins-berlin',
      category: 'Site Accommodation',
      location: 'Berlin, Germany',
      country: 'Germany',
      city: 'Berlin',
      completion_days: 7,
      total_area: 150,
      description: 'Temporary site accommodation for major construction project. 10 modular cabins for worker facilities.',
      features: ['10 cabin units', 'Weather resistant', 'Quick setup', 'Mobile'],
      images: [{ url: getPlaceholderImage(600, 400, 'Berlin Site Cabins'), alt: 'Site Cabins Berlin' }],
      is_featured: false,
      is_published: true,
    },
    {
      id: '6',
      title: 'Modular Hospital Wing - Madrid',
      slug: 'hospital-madrid',
      category: 'Healthcare',
      location: 'Madrid, Spain',
      country: 'Spain',
      city: 'Madrid',
      completion_days: 50,
      total_area: 2400,
      description: 'Emergency modular hospital wing with 30 patient rooms and medical facilities. Built during urgent healthcare capacity expansion.',
      features: ['30 patient rooms', '2400 m² area', 'Medical grade', 'Fast deployment'],
      images: [{ url: getPlaceholderImage(600, 400, 'Madrid Hospital'), alt: 'Hospital Madrid' }],
      is_featured: true,
      is_published: true,
    },
  ]
}

export default async function ProjectsPage() {
  const dbProjects = await getProjects()

  // Use database projects if available, otherwise use mock data
  const projects = dbProjects.length > 0 ? dbProjects : getMockProjects()

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
  ]

  return (
    <>
      <CategoryBanner
        title="Our Projects"
        backgroundImage={getPlaceholderImage(1920, 400, 'Our Projects')}
        breadcrumbs={breadcrumbs}
      />

      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold mb-4">Completed Projects Worldwide</h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              From schools to offices, hotels to residential buildings, see how we've helped customers around the globe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="card group"
              >
                {/* Project Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={project.images?.[0]?.url || getPlaceholderImage(600, 400, 'Project Photo')}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {project.is_featured && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="warning">Featured</Badge>
                    </div>
                  )}
                </div>

                {/* Project Details */}
                <div className="p-6">
                  {project.category && (
                    <div className="text-sm text-mb-warning font-semibold mb-2">
                      {project.category}
                    </div>
                  )}

                  <h3 className="text-xl font-bold mb-2 line-clamp-2">
                    {project.title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-mb-gray mb-3">
                    {project.location && (
                      <span>{project.location}</span>
                    )}
                  </div>

                  {project.description && (
                    <p className="text-sm text-mb-gray line-clamp-3 mb-4">
                      {project.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex gap-4 text-sm border-t border-mb-border-gray pt-4">
                    {project.total_area && (
                      <div>
                        <span className="font-semibold">{project.total_area} m²</span>
                      </div>
                    )}
                    {project.completion_days && (
                      <div>
                        <span className="font-semibold">{project.completion_days} days</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-mb-gray">No projects available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
