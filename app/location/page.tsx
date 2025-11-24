import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { FAQSection, FAQItem } from '@/components/sections/FAQSection'
import { CTASection } from '@/components/sections/CTASection'
import { ContactForm } from '@/components/forms/ContactForm'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail, Building2, Truck, Clock, Shield, CheckCircle } from 'lucide-react'
import { getPlaceholderImage } from '@/lib/placeholder-image'

export const metadata: Metadata = {
  title: 'Locations | Modular Buildings Across the USA',
  description: 'Find Modular Buildings Co modular buildings and prefabricated structures in your state. We serve Texas, California, Florida, New York, and more. Local delivery and installation available.',
  openGraph: {
    title: 'Modular Buildings Co Locations | Modular Buildings Across the USA',
    description: 'Find modular buildings and prefabricated structures near you. Fast delivery and professional installation in all 50 states.',
  }
}

interface StateLocation {
  name: string
  slug: string
  abbreviation: string
  description: string
  majorCities: string[]
  imageUrl: string
}

const stateLocations: StateLocation[] = [
  {
    name: 'Texas',
    slug: 'texas',
    abbreviation: 'TX',
    description: 'Serving Houston, Dallas, Austin, San Antonio, and all of Texas with premium modular buildings.',
    majorCities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
    imageUrl: getPlaceholderImage(600, 400, 'Texas')
  },
  {
    name: 'California',
    slug: 'california',
    abbreviation: 'CA',
    description: 'Complete modular building solutions for Los Angeles, San Francisco, San Diego, and throughout California.',
    majorCities: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento'],
    imageUrl: getPlaceholderImage(600, 400, 'California')
  },
  {
    name: 'Florida',
    slug: 'florida',
    abbreviation: 'FL',
    description: 'Hurricane-resistant modular buildings for Miami, Orlando, Tampa, and all Florida locations.',
    majorCities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
    imageUrl: getPlaceholderImage(600, 400, 'Florida')
  },
  {
    name: 'New York',
    slug: 'new-york',
    abbreviation: 'NY',
    description: 'Premium modular construction for New York City, Buffalo, Albany, and throughout New York State.',
    majorCities: ['New York City', 'Buffalo', 'Albany', 'Rochester', 'Syracuse'],
    imageUrl: getPlaceholderImage(600, 400, 'New York')
  },
  {
    name: 'Pennsylvania',
    slug: 'pennsylvania',
    abbreviation: 'PA',
    description: 'Quality modular buildings for Philadelphia, Pittsburgh, and communities across Pennsylvania.',
    majorCities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Harrisburg'],
    imageUrl: getPlaceholderImage(600, 400, 'Pennsylvania')
  },
  {
    name: 'Illinois',
    slug: 'illinois',
    abbreviation: 'IL',
    description: 'Serving Chicago, Springfield, and all of Illinois with innovative modular building solutions.',
    majorCities: ['Chicago', 'Springfield', 'Aurora', 'Naperville', 'Rockford'],
    imageUrl: getPlaceholderImage(600, 400, 'Illinois')
  },
  {
    name: 'Ohio',
    slug: 'ohio',
    abbreviation: 'OH',
    description: 'Modular buildings for Columbus, Cleveland, Cincinnati, and communities throughout Ohio.',
    majorCities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'],
    imageUrl: getPlaceholderImage(600, 400, 'Ohio')
  },
  {
    name: 'Georgia',
    slug: 'georgia',
    abbreviation: 'GA',
    description: 'Premium prefabricated structures for Atlanta, Savannah, and the entire state of Georgia.',
    majorCities: ['Atlanta', 'Savannah', 'Augusta', 'Columbus', 'Macon'],
    imageUrl: getPlaceholderImage(600, 400, 'Georgia')
  },
  {
    name: 'North Carolina',
    slug: 'north-carolina',
    abbreviation: 'NC',
    description: 'Quality modular construction for Charlotte, Raleigh, Durham, and all of North Carolina.',
    majorCities: ['Charlotte', 'Raleigh', 'Durham', 'Greensboro', 'Winston-Salem'],
    imageUrl: getPlaceholderImage(600, 400, 'North Carolina')
  },
  {
    name: 'Michigan',
    slug: 'michigan',
    abbreviation: 'MI',
    description: 'Serving Detroit, Grand Rapids, and Michigan with durable modular building solutions.',
    majorCities: ['Detroit', 'Grand Rapids', 'Ann Arbor', 'Lansing', 'Flint'],
    imageUrl: getPlaceholderImage(600, 400, 'Michigan')
  },
  {
    name: 'New Jersey',
    slug: 'new-jersey',
    abbreviation: 'NJ',
    description: 'Modular buildings for Newark, Jersey City, and communities throughout New Jersey.',
    majorCities: ['Newark', 'Jersey City', 'Trenton', 'Atlantic City', 'Princeton'],
    imageUrl: getPlaceholderImage(600, 400, 'New Jersey')
  },
  {
    name: 'Virginia',
    slug: 'virginia',
    abbreviation: 'VA',
    description: 'Premium modular structures for Virginia Beach, Richmond, Norfolk, and all of Virginia.',
    majorCities: ['Virginia Beach', 'Richmond', 'Norfolk', 'Arlington', 'Alexandria'],
    imageUrl: getPlaceholderImage(600, 400, 'Virginia')
  },
  {
    name: 'Washington',
    slug: 'washington',
    abbreviation: 'WA',
    description: 'Innovative modular building solutions for Seattle, Tacoma, and throughout Washington State.',
    majorCities: ['Seattle', 'Tacoma', 'Spokane', 'Vancouver', 'Bellevue'],
    imageUrl: getPlaceholderImage(600, 400, 'Washington')
  },
  {
    name: 'Arizona',
    slug: 'arizona',
    abbreviation: 'AZ',
    description: 'Climate-optimized modular buildings for Phoenix, Tucson, and all Arizona locations.',
    majorCities: ['Phoenix', 'Tucson', 'Mesa', 'Scottsdale', 'Chandler'],
    imageUrl: getPlaceholderImage(600, 400, 'Arizona')
  }
]

const locationFAQs: FAQItem[] = [
  {
    question: 'Do you deliver modular buildings nationwide?',
    answer: 'Yes, Modular Buildings Co delivers modular buildings to all 50 states across the United States. We have established logistics networks and partnerships that enable us to efficiently transport our prefabricated structures to any location. Delivery times vary based on your location and the complexity of your order, but we typically complete delivery within 2-4 weeks of production completion.'
  },
  {
    question: 'How much does delivery cost for modular buildings?',
    answer: 'Delivery costs depend on the distance from our manufacturing facilities, the size and number of modules, and any special requirements for your site. We provide detailed delivery quotes as part of our comprehensive project estimates. In many cases, we can optimize delivery costs by coordinating with regional shipping partners or combining shipments for larger orders.'
  },
  {
    question: 'Do you provide local installation services?',
    answer: 'Yes, we offer professional installation services in all our service areas. Our experienced installation teams travel nationwide to ensure your modular building is properly set up, connected to utilities, and ready for occupancy. We coordinate all aspects of installation including site preparation guidance, crane services, and final inspections.'
  },
  {
    question: 'Can I visit a showroom or see sample buildings in my area?',
    answer: 'We have completed projects in virtually every state, and we can often arrange for prospective customers to visit completed installations near their location. Contact our sales team to inquire about viewing opportunities in your area. We also provide virtual tours, detailed photo galleries, and video walkthroughs of our products.'
  },
  {
    question: 'What permits are required for modular buildings in my state?',
    answer: 'Permit requirements vary by state and local jurisdiction. Our team is experienced with building codes and permit processes across all 50 states. We provide guidance on permit requirements and can assist with the documentation needed for your local building department. Many of our modular buildings come with engineering certifications that streamline the permit process.'
  }
]

const serviceFeatures = [
  {
    icon: <Truck className="w-8 h-8" />,
    title: 'Nationwide Delivery',
    description: 'We deliver to all 50 states with reliable logistics partners and efficient transportation networks.'
  },
  {
    icon: <Building2 className="w-8 h-8" />,
    title: 'Professional Installation',
    description: 'Expert installation teams ensure your modular building is set up correctly and ready for use.'
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: 'Fast Turnaround',
    description: 'From order to installation, our streamlined process gets you operational faster than traditional construction.'
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Local Code Compliance',
    description: 'All buildings are engineered to meet or exceed state and local building code requirements.'
  }
]

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Locations', href: '/location' }
]

export default function LocationsPage() {
  return (
    <>
      {/* Category Banner */}
      <CategoryBanner
        title="Modular Buildings Across the USA"
        backgroundImage={getPlaceholderImage(1920, 400, 'USA Locations')}
        breadcrumbs={breadcrumbs}
      />

      {/* Location Overview Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-6">
              Find Modular Buildings Near You
            </h2>
            <p className="text-lg text-mb-gray leading-relaxed">
              Modular Buildings Co serves customers across the United States with premium modular buildings,
              prefabricated structures, and container solutions. Whether you need an office,
              warehouse, classroom, or residential unit, we deliver and install high-quality
              buildings in your area.
            </p>
          </div>

          {/* Service Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {serviceFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-mb-bg-light rounded-mb-lg p-6 text-center hover:shadow-mb transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-mb-navy text-white rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-mb-dark mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-mb-gray">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* State Locations Grid */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              Select Your State
            </h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              Click on your state to view available products, local projects, and contact information for your area.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stateLocations.map((state) => (
              <Link
                key={state.slug}
                href={`/location/${state.slug}`}
                className="group bg-white rounded-mb-lg overflow-hidden border border-mb-border-gray hover:shadow-mb-hover transition-all duration-300"
              >
                <div className="relative h-40">
                  <Image
                    src={state.imageUrl}
                    alt={`Modular buildings in ${state.name}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute top-3 right-3 bg-mb-navy text-white text-sm font-bold px-3 py-1 rounded-mb">
                    {state.abbreviation}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-mb-dark/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-xl font-bold text-white">{state.name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-mb-gray mb-3 line-clamp-2">
                    {state.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {state.majorCities.slice(0, 3).map((city) => (
                      <span
                        key={city}
                        className="text-xs bg-mb-bg-light px-2 py-1 rounded text-mb-gray"
                      >
                        {city}
                      </span>
                    ))}
                    {state.majorCities.length > 3 && (
                      <span className="text-xs text-mb-link-blue">
                        +{state.majorCities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products Available Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              Products Available Nationwide
            </h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              Our complete range of modular building solutions is available for delivery and installation across the United States.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Modular Offices',
                description: 'Professional workspace solutions for businesses of all sizes.',
                href: '/category/modular-offices',
                features: ['Quick installation', 'Fully customizable', 'Climate controlled']
              },
              {
                title: 'Prefabricated Buildings',
                description: 'Complete prefab structures for commercial and residential use.',
                href: '/category/prefabricated-buildings',
                features: ['Factory built', 'Code compliant', 'Energy efficient']
              },
              {
                title: 'Container Buildings',
                description: 'Versatile container-based solutions for various applications.',
                href: '/category/container-buildings',
                features: ['Durable steel construction', 'Portable', 'Secure']
              },
              {
                title: 'Modular Classrooms',
                description: 'Educational facilities designed for effective learning environments.',
                href: '/category/modular-classrooms',
                features: ['ADA compliant', 'Expandable', 'Modern amenities']
              },
              {
                title: 'Site Accommodation',
                description: 'Temporary housing for construction and remote work sites.',
                href: '/category/site-accommodation',
                features: ['Comfortable living spaces', 'Utility ready', 'Relocatable']
              },
              {
                title: 'Storage Solutions',
                description: 'Secure storage containers and warehouse structures.',
                href: '/category/storage-solutions',
                features: ['Weather resistant', 'Multiple sizes', 'Heavy duty']
              }
            ].map((product, index) => (
              <Link
                key={index}
                href={product.href}
                className="group bg-mb-bg-light rounded-mb-lg p-6 hover:bg-mb-navy hover:text-white transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-3 group-hover:text-white">
                  {product.title}
                </h3>
                <p className="text-mb-gray group-hover:text-white/80 mb-4">
                  {product.description}
                </p>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-mb-warning" />
                      <span className="group-hover:text-white/90">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Local Contact Section */}
      <section className="section-padding bg-mb-navy text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 md:text-h1 font-bold mb-6">
                Contact Your Local Representative
              </h2>
              <p className="text-lg opacity-90 mb-8 leading-relaxed">
                Our regional sales teams are ready to assist you with product selection,
                site evaluation, and project planning. Get personalized support for your
                modular building project.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-mb-warning rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm opacity-80">Sales Hotline</div>
                    <div className="text-lg font-semibold">1-800-MODULAR</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-mb-warning rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm opacity-80">Email Us</div>
                    <div className="text-lg font-semibold">sales@modular-buildings.co</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-mb-warning rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm opacity-80">Headquarters</div>
                    <div className="text-lg font-semibold">United States</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-mb-lg p-8">
              <h3 className="text-xl font-bold text-mb-dark mb-6">
                Request a Free Quote
              </h3>
              <ContactForm sourcePage="locations-main" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        questions={locationFAQs}
        title="Frequently Asked Questions"
        subtitle="Common questions about our location-based services and delivery"
        className="bg-white"
      />

      {/* CTA Section */}
      <CTASection
        title="Ready to Get Started?"
        subtitle="Find Modular Buildings in Your Area"
        description="Contact us today to discuss your modular building needs. Our team will help you find the perfect solution and coordinate delivery to your location."
        primaryButton={{
          text: 'Request a Quote',
          href: '/contact?inquiry=quote',
          variant: 'primary'
        }}
        secondaryButton={{
          text: 'View All Products',
          href: '/products',
          variant: 'outline'
        }}
        variant="contained"
        backgroundColor="navy"
      />
    </>
  )
}
