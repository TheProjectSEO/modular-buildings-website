import { HeroBanner } from '@/components/ui/HeroBanner'
import { ProductCard } from '@/components/ui/ProductCard'
import { ProductGrid } from '@/components/ui/ProductGrid'
import { Button } from '@/components/ui/button'
import { ImageGallery } from '@/components/ui/ImageGallery'
import { FAQSection } from '@/components/sections/FAQSection'
import { ContentBlockSection } from '@/components/sections/ContentBlockSection'
import { InternalLinksSection } from '@/components/sections/InternalLinksSection'
import { CTASection } from '@/components/sections/CTASection'
import { ContactForm } from '@/components/forms/ContactForm'
import Link from 'next/link'
import { ArrowRight, Building2, Container, Home, School, Hospital, Factory, CheckCircle, Globe, Users, Award, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import { getPageBySlug, type StructuredData } from '@/lib/supabase'

// Helper component to render JSON-LD structured data
function StructuredDataScript({ structuredData }: { structuredData?: StructuredData[] }) {
  if (!structuredData || structuredData.length === 0) return null

  return (
    <>
      {structuredData
        .filter((sd) => sd.is_active)
        .map((sd) => (
          <script
            key={sd.id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(sd.json_ld) }}
          />
        ))}
    </>
  )
}

// Mock data for featured products
const featuredProducts = [
  {
    id: '1',
    title: 'Modular Office Building 232 m²',
    category: 'Prefab Buildings',
    slug: 'modular-office-232',
    images: [{ url: getPlaceholderImage(400, 300, 'Modular Office Building'), alt: 'Modular Office' }],
    total_area: 232,
    completion_days: 45,
  },
  {
    id: '2',
    title: 'Container Office K1001',
    category: 'Containers',
    slug: 'container-office-k1001',
    images: [{ url: getPlaceholderImage(400, 300, 'Container Office'), alt: 'Container Office' }],
    total_area: 21,
    completion_days: 7,
  },
  {
    id: '3',
    title: 'Modular School Building 1840 m²',
    category: 'Prefab Buildings',
    slug: 'modular-school-1840',
    images: [{ url: getPlaceholderImage(400, 300, 'Modular School'), alt: 'Modular School' }],
    total_area: 1840,
    completion_days: 90,
  },
  {
    id: '4',
    title: 'Steel Frame House 120 m²',
    category: 'Steel Houses',
    slug: 'steel-house-120',
    images: [{ url: getPlaceholderImage(400, 300, 'Steel House'), alt: 'Steel House' }],
    total_area: 120,
    completion_days: 60,
  },
  {
    id: '5',
    title: 'Modular Hospital 500 m²',
    category: 'Prefab Buildings',
    slug: 'modular-hospital-500',
    images: [{ url: getPlaceholderImage(400, 300, 'Modular Hospital'), alt: 'Modular Hospital' }],
    total_area: 500,
    completion_days: 75,
  },
  {
    id: '6',
    title: 'Container Accommodation Unit',
    category: 'Containers',
    slug: 'container-accommodation',
    images: [{ url: getPlaceholderImage(400, 300, 'Container Accommodation'), alt: 'Container Accommodation' }],
    total_area: 28,
    completion_days: 10,
  },
]

// Mock data for categories
const categories = [
  {
    id: '1',
    name: 'Prefab Buildings',
    slug: 'prefabricated-buildings',
    icon: Building2,
    description: 'Commercial and institutional buildings',
  },
  {
    id: '2',
    name: 'Containers',
    slug: 'container',
    icon: Container,
    description: 'Versatile container solutions',
  },
  {
    id: '3',
    name: 'Modular Homes',
    slug: 'modular-homes',
    icon: Home,
    description: 'Residential housing solutions',
  },
  {
    id: '4',
    name: 'Steel Houses',
    slug: 'steel-houses',
    icon: Factory,
    description: 'Durable steel frame homes',
  },
  {
    id: '5',
    name: 'Kiosks',
    slug: 'kiosks',
    icon: Building2,
    description: 'Guard houses and security huts',
  },
  {
    id: '6',
    name: 'Modular Schools',
    slug: 'prefabricated-buildings/modular-school-buildings',
    icon: School,
    description: 'Educational facilities',
  },
]

// Mock data for projects
const completedProjects = [
  {
    id: '1',
    name: 'Mass Housing Project',
    location: 'Iraq',
    image: getPlaceholderImage(600, 400, 'Mass Housing Iraq'),
    type: 'Residential',
  },
  {
    id: '2',
    name: 'Nuclear Power Plant Workers Camp',
    location: 'Turkey - Akkuyu',
    image: getPlaceholderImage(600, 400, 'Akkuyu Workers Camp'),
    type: 'Site Accommodation',
  },
  {
    id: '3',
    name: 'Gold Mine Construction Site',
    location: 'Greenland',
    image: getPlaceholderImage(600, 400, 'Greenland Mine Site'),
    type: 'Mining',
  },
  {
    id: '4',
    name: 'Manchester United Official Store',
    location: 'United Kingdom',
    image: getPlaceholderImage(600, 400, 'Manchester United Store'),
    type: 'Commercial',
  },
  {
    id: '5',
    name: 'Container School',
    location: 'Paris, France',
    image: getPlaceholderImage(600, 400, 'Paris Container School'),
    type: 'Education',
  },
]

// Mock data for client logos
const clientLogos = [
  { name: 'Client 1', logo: '/logos/client-1.png' },
  { name: 'Client 2', logo: '/logos/client-2.png' },
  { name: 'Client 3', logo: '/logos/client-3.png' },
  { name: 'Client 4', logo: '/logos/client-4.png' },
  { name: 'Client 5', logo: '/logos/client-5.png' },
  { name: 'Client 6', logo: '/logos/client-6.png' },
]

// Mock data for industries
const industries = [
  {
    id: '1',
    name: 'Education',
    description: 'Steel system school buildings with fast installation. From kindergartens to universities, we provide complete modular educational facilities.',
    icon: School,
    image: getPlaceholderImage(800, 600, 'Education Facilities'),
    link: '/prefabricated-buildings/modular-school-buildings',
  },
  {
    id: '2',
    name: 'Construction',
    description: 'Site camps from energy to mining projects. Workforce accommodation, offices, and dining facilities for large-scale construction sites.',
    icon: Factory,
    image: getPlaceholderImage(800, 600, 'Construction Sites'),
    link: '/container/container-accommodation',
  },
  {
    id: '3',
    name: 'Office',
    description: 'Commercial buildings with modern aesthetics. Flexible, cost-effective office solutions for businesses of all sizes.',
    icon: Building2,
    image: getPlaceholderImage(800, 600, 'Office Buildings'),
    link: '/prefabricated-buildings/prefabricated-office',
  },
  {
    id: '4',
    name: 'Health',
    description: 'Hospital and facility prefabrication. From clinics to complete hospitals, we deliver healthcare infrastructure quickly and efficiently.',
    icon: Hospital,
    image: getPlaceholderImage(800, 600, 'Healthcare Facilities'),
    link: '/prefabricated-buildings/modular-hospitals',
  },
  {
    id: '5',
    name: 'Housing',
    description: 'Mass housing and individual residential units. Affordable, high-quality homes with customizable designs and rapid delivery.',
    icon: Home,
    image: getPlaceholderImage(800, 600, 'Residential Housing'),
    link: '/modular-homes',
  },
  {
    id: '6',
    name: 'Mining',
    description: 'Mining site construction structures. Durable, weather-resistant buildings designed for harsh environments and remote locations.',
    icon: Factory,
    image: getPlaceholderImage(800, 600, 'Mining Facilities'),
    link: '/container/container-accommodation',
  },
]

// Mock data for news/blog
const newsArticles = [
  {
    id: '1',
    title: 'Saudi Arabia NEOM Project',
    date: '2024-01-26',
    image: getPlaceholderImage(600, 400, 'NEOM Project'),
    slug: 'saudi-arabia-neom-project',
  },
  {
    id: '2',
    title: 'Istanbul Medipol University Visit',
    date: '2024-07-27',
    image: getPlaceholderImage(600, 400, 'Medipol Visit'),
    slug: 'istanbul-medipol-university-visit',
  },
  {
    id: '3',
    title: 'Boutique Holiday Hotel Project',
    date: '2024-08-17',
    image: getPlaceholderImage(600, 400, 'Hotel Project'),
    slug: 'boutique-holiday-hotel',
  },
  {
    id: '4',
    title: 'Azerbaijan Housing Installation',
    date: '2024-08-17',
    image: getPlaceholderImage(600, 400, 'Azerbaijan Housing'),
    slug: 'azerbaijan-housing-installation',
  },
  {
    id: '5',
    title: 'COVID-19 Modular Hospital',
    date: '2024-08-17',
    image: getPlaceholderImage(600, 400, 'COVID Hospital'),
    slug: 'covid-19-modular-hospital',
  },
  {
    id: '6',
    title: 'Field Hospital Success Story',
    date: '2024-08-17',
    image: getPlaceholderImage(600, 400, 'Field Hospital'),
    slug: 'field-hospital-success',
  },
]

// Mock data for testimonials
const testimonials = [
  {
    id: '1',
    name: 'John Smith',
    company: 'Construction Ltd',
    country: 'United Kingdom',
    text: 'Modular Buildings Co delivered our site accommodation on time and within budget. The quality exceeded our expectations.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Marie Dubois',
    company: 'Education Department',
    country: 'France',
    text: 'The modular school buildings are perfect for our needs. Installation was quick and students love the modern facilities.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Ahmed Al-Rashid',
    company: 'Housing Authority',
    country: 'Saudi Arabia',
    text: 'Excellent quality and service. Modular Buildings Co is our trusted partner for modular construction projects.',
    rating: 5,
  },
]

// Mock data for FAQs
const faqs = [
  {
    question: 'What is prefabricated construction?',
    answer: 'Prefabricated construction involves manufacturing building components in a controlled factory environment, then transporting and assembling them on-site. This method is faster, more cost-effective, and produces less waste than traditional construction.',
  },
  {
    question: 'How long does it take to install a modular building?',
    answer: 'Installation time varies by project size and complexity. Small container units can be ready in 7-10 days, while larger projects like schools or hospitals typically take 45-90 days. This is 75% faster than traditional construction methods.',
  },
  {
    question: 'Are prefabricated buildings durable?',
    answer: 'Yes, our prefabricated buildings are extremely durable. Built with galvanized steel frames and high-quality insulated panels, they are designed to last for decades and withstand harsh weather conditions. All structures meet international safety and building standards.',
  },
  {
    question: 'Can I customize the design?',
    answer: 'Absolutely! We offer fully customizable designs to meet your specific requirements. You can choose layouts, finishes, colors, and features. Our design team works closely with clients to create solutions that match their exact needs.',
  },
  {
    question: 'What countries do you serve?',
    answer: 'Modular Buildings Co serves customers in over 130 countries across 6 continents. We have successfully completed projects worldwide, from Europe and the Middle East to Africa, Asia, Americas, and even remote locations like Greenland.',
  },
]

// Mock data for internal links
const relatedLinks = [
  {
    title: 'Container Offices',
    url: '/container/container-offices',
    description: 'Portable, cost-effective office solutions for businesses',
  },
  {
    title: 'Modular Commercial Buildings',
    url: '/prefabricated-buildings/modular-commercial',
    description: 'Large-scale commercial prefab structures',
  },
  {
    title: 'Steel Frame Houses',
    url: '/steel-houses',
    description: 'Durable residential homes with steel construction',
  },
  {
    title: 'Site Accommodation',
    url: '/container/container-accommodation',
    description: 'Workforce housing for construction and mining sites',
  },
  {
    title: 'Modular Hospitals',
    url: '/prefabricated-buildings/modular-hospitals',
    description: 'Complete healthcare facility solutions',
  },
  {
    title: 'Custom Containers',
    url: '/container/custom-container',
    description: 'Tailor-made container structures for any purpose',
  },
]

export default async function HomePage() {
  // Fetch homepage data from database for structured data
  // Try multiple possible homepage slugs
  let dbPage = await getPageBySlug('/')
  if (!dbPage) {
    dbPage = await getPageBySlug('')
  }
  if (!dbPage) {
    dbPage = await getPageBySlug('home')
  }

  return (
    <>
      {/* JSON-LD Structured Data from database */}
      <StructuredDataScript structuredData={dbPage?.structured_data} />

      {/* 1. Hero Banner Section */}
      <HeroBanner
        title="Prefabricated & Modular Building Solutions"
        subtitle="Fast, reliable, and high-quality construction for every need. Serving 130+ countries since 1986."
        backgroundImage={getPlaceholderImage(1920, 600, 'Modular Buildings')}
        height="lg"
        ctaButton={
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact">
              <Button variant="warning" size="lg">
                Get a Quote
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" size="lg">
                View Products
              </Button>
            </Link>
          </div>
        }
      />

      {/* 2. Category Grid Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold mb-4">Our Product Categories</h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              From containers to complete modular buildings, we provide comprehensive solutions for all your construction needs.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <Link
                  key={category.id}
                  href={`/${category.slug}`}
                  className="flex flex-col items-center p-6 border border-mb-border-gray rounded-mb hover:shadow-mb-hover hover:border-mb-warning transition-all"
                >
                  <div className="w-16 h-16 mb-3 flex items-center justify-center text-mb-navy">
                    <IconComponent className="w-12 h-12" />
                  </div>
                  <h3 className="text-center font-semibold text-sm">{category.name}</h3>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. Featured Products Section */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-h2 font-bold">Featured Products</h2>
            <Link
              href="/products"
              className="text-mb-link-blue hover:text-mb-warning font-medium inline-flex items-center gap-2"
            >
              View All
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <ProductGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                category={product.category}
                imageUrl={product.images?.[0]?.url || getPlaceholderImage(400, 300, product.title || 'Product')}
                href={`/products/${product.slug}`}
                area={product.total_area}
                completionDays={product.completion_days}
              />
            ))}
          </ProductGrid>
        </div>
      </section>

      {/* 4. Company Stats Section */}
      <section className="section-padding bg-mb-navy text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold mb-3">World's Prefabricated Preference - Modular Buildings Co</h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              With nearly 40 years of experience, we are a global leader in modular construction
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-extrabold mb-2">1986</div>
              <div className="text-white/80">Established</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold mb-2">130+</div>
              <div className="text-white/80">Countries Served</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold mb-2">45,000</div>
              <div className="text-white/80">m² Production Capacity</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold mb-2">1000+</div>
              <div className="text-white/80">Completed Projects</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Modular Buildings Co Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold mb-4">Why Choose Modular Buildings Co</h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              Discover what makes us the preferred choice for modular construction worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-mb-bg-light rounded-full">
                <Home className="w-8 h-8 text-mb-navy" />
              </div>
              <h3 className="text-xl font-bold mb-3">Comfortable & Stylish</h3>
              <p className="text-mb-gray">
                Modern architectural design with ergonomic layouts and contemporary aesthetics
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-mb-bg-light rounded-full">
                <TrendingUp className="w-8 h-8 text-mb-navy" />
              </div>
              <h3 className="text-xl font-bold mb-3">Cost Advantage</h3>
              <p className="text-mb-gray">
                Material efficiency and controlled manufacturing result in significant cost savings
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-mb-bg-light rounded-full">
                <Users className="w-8 h-8 text-mb-navy" />
              </div>
              <h3 className="text-xl font-bold mb-3">Personalized</h3>
              <p className="text-mb-gray">
                Fully customizable solutions tailored to your specific requirements
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-mb-bg-light rounded-full">
                <Award className="w-8 h-8 text-mb-navy" />
              </div>
              <h3 className="text-xl font-bold mb-3">Long Life</h3>
              <p className="text-mb-gray">
                Galvanized steel construction ensures durability for decades
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Projects Showcase Section */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold mb-4">Our Completed Projects</h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              Delivering excellence across the globe in diverse industries and applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group relative overflow-hidden rounded-mb-lg aspect-[4/3] bg-gray-200"
              >
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <span className="text-xs font-semibold uppercase tracking-wide text-mb-warning mb-2 block">
                    {project.type}
                  </span>
                  <h3 className="text-lg font-bold mb-1">{project.name}</h3>
                  <p className="text-sm text-white/80">{project.location}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/projects">
              <Button variant="primary" size="lg">
                View All Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Video Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold mb-4">See Our Solutions in Action</h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              Watch how we transform spaces with innovative modular construction
            </p>
          </div>

          <div className="max-w-4xl mx-auto aspect-video bg-gray-200 rounded-mb-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Modular Buildings Co"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* 8. Testimonials/Social Proof Section */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold mb-4">What Our Clients Say</h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              Trusted by businesses, governments, and organizations worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white p-8 rounded-mb-lg border border-mb-border-gray"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-mb-warning fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-mb-gray mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-mb-dark">{testimonial.name}</p>
                  <p className="text-sm text-mb-gray">{testimonial.company}</p>
                  <p className="text-sm text-mb-gray">{testimonial.country}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social Media Stats */}
          <div className="mt-16 text-center">
            <h3 className="text-xl font-bold mb-8">Follow Us on Social Media</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <p className="text-2xl font-bold text-mb-navy">321K+</p>
                <p className="text-sm text-mb-gray">Facebook</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-mb-navy">80K+</p>
                <p className="text-sm text-mb-gray">Instagram</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-mb-navy">16K+</p>
                <p className="text-sm text-mb-gray">YouTube</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-mb-navy">580+</p>
                <p className="text-sm text-mb-gray">LinkedIn</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-mb-navy">1.5K+</p>
                <p className="text-sm text-mb-gray">Twitter</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-mb-navy">349+</p>
                <p className="text-sm text-mb-gray">Pinterest</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Industries Served Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold mb-4">Our Industries</h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              Serving diverse sectors with specialized modular solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry) => {
              const IconComponent = industry.icon
              return (
                <Link
                  key={industry.id}
                  href={industry.link}
                  className="group bg-mb-bg-light p-6 rounded-mb-lg hover:shadow-mb-hover transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-mb text-mb-navy">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-mb-dark group-hover:text-mb-navy transition-colors">
                      {industry.name}
                    </h3>
                  </div>
                  <p className="text-mb-gray mb-4">{industry.description}</p>
                  <div className="relative aspect-video rounded-mb overflow-hidden">
                    <Image
                      src={industry.image}
                      alt={industry.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 10. News/Blog Section */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-h2 font-bold">Latest News</h2>
            <Link
              href="/news"
              className="text-mb-link-blue hover:text-mb-warning font-medium inline-flex items-center gap-2"
            >
              View All News
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsArticles.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="group bg-white rounded-mb-lg overflow-hidden border border-mb-border-gray hover:shadow-mb-hover transition-all"
              >
                <div className="relative aspect-video bg-gray-200">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-mb-gray mb-2">
                    {new Date(article.date).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <h3 className="text-lg font-semibold text-mb-dark group-hover:text-mb-navy transition-colors">
                    {article.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Educational Content Blocks */}
      <ContentBlockSection
        title="Prefabricated Building: Innovative Building Style"
        content={`
          <p>Prefabricated buildings represent a revolutionary approach to construction that combines efficiency, quality, and innovation. Our advanced manufacturing processes ensure every component is built to exact specifications in a controlled environment, eliminating weather delays and material waste.</p>

          <h3 class="text-xl font-bold mt-6 mb-3">System Advantages</h3>
          <p>Our weldless bolt-nut snap-on technology allows for quick assembly without specialized equipment. Buildings can be erected 75% faster than traditional construction methods, with no compromise on quality or durability.</p>

          <h3 class="text-xl font-bold mt-6 mb-3">Design Flexibility</h3>
          <p>From single-room units to multi-story complexes, our modular system adapts to any requirement. Choose from standard designs or work with our team to create custom solutions that perfectly match your vision.</p>

          <h3 class="text-xl font-bold mt-6 mb-3">Energy Efficiency</h3>
          <p>All our buildings feature superior insulation and energy-efficient design. Reduced heating and cooling costs mean significant savings over the building's lifetime, while environmental impact is minimized.</p>

          <h3 class="text-xl font-bold mt-6 mb-3">Cost Advantages</h3>
          <p>Factory production reduces labor costs, material waste, and construction time. Our clients typically save 15-40% compared to traditional construction while receiving a higher quality product.</p>
        `}
        layout="text-only"
        backgroundColor="white"
      />

      <ContentBlockSection
        title="Quality Materials & Construction"
        content={`
          <p>Every Modular Buildings Co building is constructed using galvanized steel frames and high-quality insulated panels. Our materials are sourced from certified suppliers and undergo rigorous quality control testing.</p>

          <p class="mt-4">The steel frame construction provides superior strength and resistance to wear and tear compared to traditional wood or concrete buildings. Our structures meet or exceed international building codes and safety standards.</p>
        `}
        image={{
          url: getPlaceholderImage(800, 600, 'Quality Construction'),
          alt: 'Quality Construction',
        }}
        layout="image-right"
        backgroundColor="light"
      />

      {/* 12. Internal Links Section */}
      <InternalLinksSection
        title="Explore Our Solutions"
        subtitle="Discover the perfect modular building solution for your project"
        links={relatedLinks}
        columns={3}
        showIcon={true}
      />

      {/* 13. FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our modular buildings"
        questions={faqs}
        className="bg-white"
      />

      {/* 14. Contact Form Section */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-h2 font-bold mb-4">We'll Call You</h2>
              <p className="text-lg text-mb-gray">
                Fill out the form below and our team will contact you shortly
              </p>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-mb-lg border border-mb-border-gray">
              <ContactForm />
            </div>

            {/* Alternative Contact Methods */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white p-6 rounded-mb border border-mb-border-gray">
                <h3 className="font-bold mb-2">Call Us</h3>
                <a href="tel:+905376563068" className="text-mb-link-blue hover:text-mb-warning">
                  +90 (537) 656 30 68
                </a>
              </div>
              <div className="bg-white p-6 rounded-mb border border-mb-border-gray">
                <h3 className="font-bold mb-2">WhatsApp</h3>
                <a
                  href="https://wa.me/905396358938"
                  className="text-mb-link-blue hover:text-mb-warning"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +90 (539) 635 89 38
                </a>
              </div>
              <div className="bg-white p-6 rounded-mb border border-mb-border-gray">
                <h3 className="font-bold mb-2">Email</h3>
                <a href="mailto:info@modular-buildings.co" className="text-mb-link-blue hover:text-mb-warning">
                  info@modular-buildings.co
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 15. Final CTA Section */}
      <CTASection
        title="Ready to Start Your Project?"
        description="Get a customized quote for your prefabricated or modular building project. Our team of experts is ready to help bring your vision to life with fast, reliable, and high-quality construction."
        primaryButton={{
          text: 'Get a Free Quote',
          href: '/contact',
          variant: 'warning',
        }}
        secondaryButton={{
          text: 'Browse Products',
          href: '/products',
          variant: 'outline',
        }}
        variant="full-width"
        backgroundColor="navy"
      />
    </>
  )
}
