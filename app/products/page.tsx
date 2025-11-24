import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { CTASection } from '@/components/sections/CTASection'
import { FAQSection, FAQItem } from '@/components/sections/FAQSection'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Building2, Home, Warehouse, ArrowRight, CheckCircle2, Package, Boxes, Factory, Container } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Modular Building Products | Modular Buildings Co',
  description: 'Explore our complete range of modular building products including offices, classrooms, healthcare facilities, and more. Quality prefabricated solutions for every need.',
  openGraph: {
    title: 'Modular Building Products | Modular Buildings Co',
    description: 'Explore our complete range of modular building products. Quality prefabricated solutions for every need.',
    images: [getPlaceholderImage(1200, 630, 'Modular Building Products')],
  },
}

interface Product {
  slug: string
  name: string
  description: string
  icon: React.ReactNode
  features: string[]
  imageUrl: string
  category: string
}

const products: Product[] = [
  {
    slug: 'modular-office-building',
    name: 'Modular Office Buildings',
    description: 'Professional office spaces designed for productivity. Our modular offices feature modern layouts, climate control, and full IT infrastructure for businesses of all sizes.',
    icon: <Building2 className="w-8 h-8" />,
    features: [
      'Open plan and private office layouts',
      'Conference and meeting rooms',
      'Reception and lobby areas',
      'IT infrastructure ready',
    ],
    imageUrl: getPlaceholderImage(600, 400, 'Modular Office'),
    category: 'Commercial',
  },
  {
    slug: 'modular-classrooms',
    name: 'Modular Classrooms',
    description: 'Modern educational spaces optimized for learning. Designed with proper acoustics, lighting, and ventilation to create ideal learning environments for students.',
    icon: <Factory className="w-8 h-8" />,
    features: [
      'Optimal acoustic design',
      'Natural and LED lighting',
      'Climate controlled',
      'Technology integrated',
    ],
    imageUrl: getPlaceholderImage(600, 400, 'Modular Classroom'),
    category: 'Education',
  },
  {
    slug: 'modular-homes',
    name: 'Modular Homes',
    description: 'Quality residential solutions for modern living. From single-family homes to multi-unit developments, our modular homes combine style, comfort, and energy efficiency.',
    icon: <Home className="w-8 h-8" />,
    features: [
      'Single and multi-family designs',
      'Energy efficient construction',
      'Custom floor plans available',
      'Premium interior finishes',
    ],
    imageUrl: getPlaceholderImage(600, 400, 'Modular Home'),
    category: 'Residential',
  },
  {
    slug: 'prefabricated-buildings',
    name: 'Prefabricated Buildings',
    description: 'Versatile prefab structures for various applications. Factory-built quality with rapid on-site assembly for commercial, industrial, and institutional uses.',
    icon: <Boxes className="w-8 h-8" />,
    features: [
      'Factory-controlled quality',
      'Rapid installation',
      'Customizable designs',
      'Cost-effective solutions',
    ],
    imageUrl: getPlaceholderImage(600, 400, 'Prefab Building'),
    category: 'Commercial',
  },
  {
    slug: 'container',
    name: 'Container Buildings',
    description: 'Innovative shipping container conversions for modern applications. Sustainable, durable, and uniquely designed spaces for offices, retail, and accommodation.',
    icon: <Container className="w-8 h-8" />,
    features: [
      'Sustainable construction',
      'Stackable and expandable',
      'Quick deployment',
      'Industrial aesthetic',
    ],
    imageUrl: getPlaceholderImage(600, 400, 'Container Building'),
    category: 'Commercial',
  },
  {
    slug: 'used-modular-buildings',
    name: 'Used Modular Buildings',
    description: 'Quality pre-owned modular buildings at competitive prices. Inspected, refurbished, and ready for immediate deployment with significant cost savings.',
    icon: <Package className="w-8 h-8" />,
    features: [
      'Inspected and certified',
      'Refurbished options',
      'Immediate availability',
      'Budget-friendly',
    ],
    imageUrl: getPlaceholderImage(600, 400, 'Used Modular'),
    category: 'Value',
  },
]

const faqs: FAQItem[] = [
  {
    question: 'What types of modular buildings do you offer?',
    answer: 'We offer a comprehensive range of modular buildings including office buildings, classrooms, healthcare facilities, residential homes, container conversions, and industrial structures. Each product line can be customized to meet your specific requirements and industry standards.',
  },
  {
    question: 'How long does it take to manufacture a modular building?',
    answer: 'Manufacturing time varies based on size and complexity. Standard modules typically take 4-8 weeks to manufacture in our factory. During this time, site preparation can proceed simultaneously, significantly reducing overall project timelines compared to traditional construction.',
  },
  {
    question: 'Can modular buildings be customized to our specifications?',
    answer: 'Absolutely! All our modular buildings can be customized including floor plans, exterior finishes, interior fit-out, MEP systems, and special features. Our design team works with you to create buildings that meet your exact requirements while optimizing for modular construction.',
  },
  {
    question: 'Are modular buildings as durable as traditional construction?',
    answer: 'Yes, our modular buildings are built to the same or higher standards as traditional construction. Factory-controlled manufacturing ensures consistent quality, and our buildings are engineered to withstand transportation and installation stresses, resulting in robust, long-lasting structures.',
  },
  {
    question: 'What is the warranty on your modular buildings?',
    answer: 'We provide comprehensive warranties on all our modular buildings: 10 years on structural components, 5 years on exterior finishes, and 2 years on systems and equipment. Extended warranty options and maintenance contracts are also available.',
  },
  {
    question: 'Do you offer financing options for modular buildings?',
    answer: 'Yes, we offer various financing options including purchase, lease, and lease-to-own arrangements. Our financing specialists can help structure a solution that works with your budget and cash flow requirements.',
  },
]

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
]

export default function ProductsPage() {
  return (
    <>
      {/* Category Banner */}
      <CategoryBanner
        title="Our Products"
        backgroundImage={getPlaceholderImage(1920, 400, 'Products Banner')}
        breadcrumbs={breadcrumbs}
      />

      {/* Introduction Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-6">
              Quality Modular Solutions for Every Need
            </h2>
            <p className="text-lg text-mb-gray leading-relaxed">
              Modular Buildings Co offers a comprehensive range of prefabricated and modular building solutions.
              From commercial offices to residential homes, our products are manufactured to the highest
              standards in our state-of-the-art facilities, ensuring quality, durability, and rapid deployment.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-16 bg-mb-bg-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/${product.slug}`}
                className="group bg-white rounded-mb-lg overflow-hidden border border-mb-border-gray hover:shadow-mb-hover transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-mb-dark/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 bg-mb-warning p-3 rounded-mb">
                    {product.icon}
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-mb-navy text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Product Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-mb-dark mb-3 group-hover:text-mb-navy transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-mb-gray mb-4 line-clamp-3">
                    {product.description}
                  </p>

                  {/* Features Preview */}
                  <ul className="space-y-2 mb-4">
                    {product.features.slice(0, 2).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-mb-gray">
                        <CheckCircle2 className="w-4 h-4 text-mb-navy flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Learn More Link */}
                  <div className="flex items-center gap-2 text-mb-navy font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Products Section */}
      <section className="py-12 md:py-16 bg-mb-navy text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold mb-4">
              Why Choose Modular Buildings Co Products
            </h2>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Quality craftsmanship, innovative design, and customer-focused solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-mb-warning mb-2">ISO</div>
              <div className="text-lg font-semibold mb-1">Certified Manufacturing</div>
              <p className="text-sm opacity-80">Quality assured production</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-mb-warning mb-2">50%</div>
              <div className="text-lg font-semibold mb-1">Faster Delivery</div>
              <p className="text-sm opacity-80">Compared to traditional build</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-mb-warning mb-2">30+</div>
              <div className="text-lg font-semibold mb-1">Year Lifespan</div>
              <p className="text-sm opacity-80">Built to last</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-mb-warning mb-2">100%</div>
              <div className="text-lg font-semibold mb-1">Customizable</div>
              <p className="text-sm opacity-80">Tailored to your needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        questions={faqs}
        title="Frequently Asked Questions"
        subtitle="Common questions about our modular building products"
        className="bg-white"
      />

      {/* CTA Section */}
      <CTASection
        title="Ready to Get Started?"
        subtitle="Find the Perfect Solution"
        description="Our team is ready to help you find the right modular building solution for your needs. Contact us today for a free consultation and detailed quote."
        primaryButton={{
          text: 'Request a Quote',
          href: '/contact?inquiry=quote',
          variant: 'warning',
        }}
        secondaryButton={{
          text: 'View Industries',
          href: '/industries',
          variant: 'outline',
        }}
        variant="contained"
        backgroundColor="navy"
      />
    </>
  )
}
