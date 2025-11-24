import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { ImageGallery } from '@/components/ui/ImageGallery'
import { FeatureList } from '@/components/ui/FeatureList'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ContactForm } from '@/components/forms/ContactForm'
import { ProductCard } from '@/components/ui/ProductCard'
import { ProductGrid } from '@/components/ui/ProductGrid'
import { FAQSection } from '@/components/sections/FAQSection'
import { SpecificationsTable } from '@/components/sections/SpecificationsTable'
import { CTASection } from '@/components/sections/CTASection'
import { ContentBlockSection } from '@/components/sections/ContentBlockSection'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  Phone,
  Mail,
  Download,
  Building2,
  Ruler,
  Clock,
  Home,
  Layers,
  CheckCircle2,
  Shield,
  Zap,
  Users
} from 'lucide-react'
import { getPlaceholderImage } from '@/lib/placeholder-image'

interface ProductPageProps {
  params: {
    slug: string
  }
}

async function getProduct(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error || !data) {
    return null
  }

  // Increment view count
  await supabase.rpc('increment_product_views', { product_slug: slug })

  return data
}

async function getRelatedProducts(category: string, currentSlug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('is_published', true)
    .neq('slug', currentSlug)
    .limit(3)

  if (error) {
    console.error('Error fetching related products:', error)
    return []
  }

  return data
}

async function getProjectsUsingProduct(productId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .contains('products_used', [productId])
    .eq('is_published', true)
    .limit(4)

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return data
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: product.meta_title || product.title,
    description: product.meta_description || product.description?.substring(0, 160),
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const dbProduct = await getProduct(params.slug)

  // Use database product if available, otherwise create comprehensive mock product
  const product = dbProduct || {
    id: params.slug,
    title: params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    slug: params.slug,
    category: params.slug.includes('container') ? 'containers' : params.slug.includes('school') ? 'prefabricated-buildings' : 'modular-buildings',
    subcategory: params.slug.includes('office') ? 'offices' : params.slug.includes('school') ? 'schools' : null,
    description: `High-quality ${params.slug.replace(/-/g, ' ')} solution with modern design and fast installation.`,
    total_area: 560,
    area_unit: 'm²',
    floor_count: 2,
    completion_days: 32,
    specifications: {
      total_area: '560 m²',
      floor_count: 2,
      ceiling_height: '3m',
      type: 'Commercial Building'
    },
    features: [
      'High quality construction',
      'Fast installation',
      'Energy efficient',
      'Customizable layout',
      'Weather resistant',
      'Modern design',
      'Durable materials',
      'ISO certified'
    ],
    images: [],
    price_range: 'Contact for pricing',
    is_published: true,
    is_featured: false,
    views_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const relatedProducts = await getRelatedProducts(product.category, params.slug)
  const projects = await getProjectsUsingProduct(product.id)

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: product.category, href: `/products?category=${product.category}` },
    { label: product.title, href: `/products/${params.slug}` },
  ]

  // Images - Use comprehensive mock data if not available
  const images = product.images?.length
    ? product.images.map((img: any) => ({
        url: img.url,
        alt: img.alt || product.title,
        thumbnail: img.thumbnail,
      }))
    : [
        { url: getPlaceholderImage(800, 600, `${product.title} Front`), alt: `${product.title} - Front View` },
        { url: getPlaceholderImage(800, 600, `${product.title} Interior`), alt: `${product.title} - Interior` },
        { url: getPlaceholderImage(800, 600, `${product.title} Side`), alt: `${product.title} - Side View` },
        { url: getPlaceholderImage(800, 600, 'Floor Plan'), alt: `${product.title} - Floor Plan` },
        { url: getPlaceholderImage(800, 600, 'Meeting Room'), alt: `${product.title} - Meeting Room` },
        { url: getPlaceholderImage(800, 600, 'Workspace'), alt: `${product.title} - Workspace` },
        { url: getPlaceholderImage(800, 600, 'Exterior Night'), alt: `${product.title} - Exterior Night` },
        { url: getPlaceholderImage(800, 600, 'Installation'), alt: `${product.title} - Installation` },
      ]

  // Specifications for SpecificationsTable component
  const technicalSpecifications = product.specifications || [
    { label: 'Total Area', value: '560', unit: 'm²' },
    { label: 'Building Type', value: 'Prefabricated Office' },
    { label: 'Number of Floors', value: '2 Floors' },
    { label: 'Wall Type', value: 'Sandwich Panel' },
    { label: 'Wall Thickness', value: '10', unit: 'cm' },
    { label: 'Roof Type', value: 'Insulated Sandwich Panel' },
    { label: 'Roof Thickness', value: '10', unit: 'cm' },
    { label: 'Floor System', value: 'Reinforced Steel Frame' },
    { label: 'Insulation Type', value: 'Mineral Wool / EPS' },
    { label: 'Fire Resistance', value: 'Class A1' },
    { label: 'Wind Load Capacity', value: '120', unit: 'km/h' },
    { label: 'Snow Load Capacity', value: '150', unit: 'kg/m²' },
    { label: 'Earthquake Resistance', value: 'Up to 8.0 Magnitude' },
    { label: 'Foundation Type', value: 'Concrete Slab or Piles' },
    { label: 'Exterior Finish', value: 'Metal Cladding / HPL Panels' },
    { label: 'Interior Finish', value: 'Gypsum Board' },
    { label: 'Window Type', value: 'Double Glazed PVC' },
    { label: 'Door Type', value: 'Steel Security Doors' },
    { label: 'Electrical System', value: '220-380V, 50Hz' },
    { label: 'Plumbing System', value: 'Included' },
    { label: 'HVAC System', value: 'Optional' },
    { label: 'Estimated Lifespan', value: '30+', unit: 'years' },
  ]

  // Grouped Specifications
  const groupedSpecifications = [
    {
      groupName: 'Structural Specifications',
      specs: [
        { label: 'Total Area', value: '560', unit: 'm²', icon: <Ruler className="w-5 h-5" /> },
        { label: 'Number of Floors', value: '2', tooltip: 'Can be customized' },
        { label: 'Building Height', value: '6.5', unit: 'm' },
        { label: 'Frame Material', value: 'Galvanized Steel' },
        { label: 'Foundation Type', value: 'Concrete Slab or Piles' },
      ]
    },
    {
      groupName: 'Wall & Roof System',
      specs: [
        { label: 'Wall Type', value: 'Sandwich Panel', icon: <Layers className="w-5 h-5" /> },
        { label: 'Wall Thickness', value: '10', unit: 'cm' },
        { label: 'Roof Type', value: 'Insulated Sandwich Panel' },
        { label: 'Roof Thickness', value: '10', unit: 'cm' },
        { label: 'Insulation Material', value: 'Mineral Wool / EPS' },
        { label: 'Fire Resistance', value: 'Class A1' },
      ]
    },
    {
      groupName: 'Load Capacities',
      specs: [
        { label: 'Wind Load', value: '120', unit: 'km/h', icon: <Shield className="w-5 h-5" /> },
        { label: 'Snow Load', value: '150', unit: 'kg/m²' },
        { label: 'Earthquake Resistance', value: 'Up to 8.0 Magnitude' },
        { label: 'Live Load', value: '200', unit: 'kg/m²' },
      ]
    },
    {
      groupName: 'Systems & Finishes',
      specs: [
        { label: 'Window Type', value: 'Double Glazed PVC', icon: <Home className="w-5 h-5" /> },
        { label: 'Door Type', value: 'Steel Security Doors' },
        { label: 'Electrical System', value: '220-380V, 50Hz' },
        { label: 'Plumbing', value: 'Complete System Included' },
        { label: 'Interior Finish', value: 'Gypsum Board with Paint' },
        { label: 'Exterior Finish', value: 'Metal Cladding / HPL Panels' },
      ]
    },
    {
      groupName: 'Timeline & Warranty',
      specs: [
        { label: 'Production Time', value: '45-60', unit: 'days', icon: <Clock className="w-5 h-5" /> },
        { label: 'Installation Time', value: '30-45', unit: 'days' },
        { label: 'Total Completion', value: '75-105', unit: 'days' },
        { label: 'Structural Warranty', value: '10', unit: 'years' },
        { label: 'Estimated Lifespan', value: '30+', unit: 'years' },
      ]
    },
  ]

  // Key Features
  const features = product.features || [
    'Rapid construction with prefabricated components',
    'Energy-efficient insulation system (U-value: 0.35 W/m²K)',
    'Fully customizable floor plans and layouts',
    'High-quality sandwich panel walls and roof',
    'Earthquake and wind resistant steel structure',
    'Turnkey solution including all MEP systems',
    'Modern and professional exterior design',
    'Low maintenance requirements',
    'Relocatable and expandable design',
    'Compliant with international building codes',
    'Eco-friendly materials and construction methods',
    'Cost-effective compared to traditional construction',
  ]

  // Applications
  const applications = [
    {
      title: 'Corporate Offices',
      description: 'Ideal for company headquarters, branch offices, and administrative centers requiring professional workspace.',
      icon: <Building2 className="w-6 h-6" />
    },
    {
      title: 'Government Buildings',
      description: 'Suitable for municipal offices, public service centers, and government administrative facilities.',
      icon: <Shield className="w-6 h-6" />
    },
    {
      title: 'Construction Site Offices',
      description: 'Perfect for temporary or permanent site management offices, engineering departments, and project coordination centers.',
      icon: <Layers className="w-6 h-6" />
    },
    {
      title: 'Educational Facilities',
      description: 'Can be used for school administrative offices, training centers, and educational support buildings.',
      icon: <Users className="w-6 h-6" />
    },
    {
      title: 'Healthcare Administration',
      description: 'Suitable for hospital administrative wings, clinic offices, and healthcare management centers.',
      icon: <CheckCircle2 className="w-6 h-6" />
    },
    {
      title: 'Commercial Complexes',
      description: 'Ideal for shopping center management offices, commercial real estate offices, and retail headquarters.',
      icon: <Zap className="w-6 h-6" />
    },
  ]

  // FAQ Data
  const faqs = [
    {
      question: 'What is the typical delivery time for this prefabricated office?',
      answer: 'The production time is typically 45-60 days, followed by 30-45 days for on-site installation. Total completion time ranges from 75-105 days depending on project complexity and location.'
    },
    {
      question: 'Can the design and layout be customized?',
      answer: 'Yes, absolutely! We offer full customization of floor plans, interior layouts, exterior finishes, and color schemes. Our engineering team will work with you to create a design that meets your specific requirements and preferences.'
    },
    {
      question: 'What foundation is required for this building?',
      answer: 'The building can be installed on a concrete slab foundation or pile foundation depending on soil conditions. Our engineers will assess your site and recommend the most appropriate foundation type. Foundation preparation is typically completed in 7-14 days.'
    },
    {
      question: 'Is this building suitable for extreme weather conditions?',
      answer: 'Yes, our prefabricated offices are designed to withstand extreme weather conditions including high winds (up to 120 km/h), heavy snow loads (150 kg/m²), and seismic activity (up to 8.0 magnitude). The insulated sandwich panels provide excellent thermal performance in both hot and cold climates.'
    },
    {
      question: 'What utilities and systems are included?',
      answer: 'The building comes with complete electrical wiring (220-380V), plumbing systems, lighting fixtures, and all necessary infrastructure. HVAC systems can be added as an option. All systems comply with international standards and local building codes.'
    },
    {
      question: 'Can this building be relocated or expanded in the future?',
      answer: 'Yes, one of the major advantages of our modular construction is relocatability. The building can be disassembled and moved to a new location if needed. Additionally, the modular design allows for easy expansion by adding more units horizontally or vertically.'
    },
    {
      question: 'What kind of warranty do you provide?',
      answer: 'We provide a 10-year structural warranty covering the main frame and load-bearing components. Additional warranties are available for specific systems like roofing, windows, and doors. The building has an estimated lifespan of 30+ years with proper maintenance.'
    },
    {
      question: 'How does the cost compare to traditional construction?',
      answer: 'Prefabricated construction typically costs 30-40% less than traditional construction methods. You save on labor costs, construction time, and material waste. Additionally, the faster completion time means earlier occupancy and return on investment.'
    },
  ]

  // Technical Details Content
  const technicalDetailsContent = `
    <h3 class="text-xl font-bold mb-4">Construction Method & Materials</h3>
    <p class="mb-4">Our prefabricated office buildings utilize advanced modular construction technology, combining factory precision with on-site efficiency. The structural frame is constructed from hot-dip galvanized steel profiles that provide superior strength-to-weight ratio and corrosion resistance.</p>

    <h4 class="text-lg font-semibold mb-3 mt-6">Wall System</h4>
    <p class="mb-4">The exterior walls feature high-quality sandwich panels with 10cm thickness, consisting of two galvanized steel sheets with mineral wool or EPS insulation core. This provides excellent thermal insulation (U-value: 0.35 W/m²K) and soundproofing (Rw: 35-40 dB).</p>

    <h4 class="text-lg font-semibold mb-3 mt-6">Roof System</h4>
    <p class="mb-4">The roof utilizes insulated sandwich panels similar to the walls, with additional waterproofing membrane and proper drainage system. The roof is designed to handle significant snow loads and includes provisions for roof equipment mounting.</p>

    <h4 class="text-lg font-semibold mb-3 mt-6">Floor System</h4>
    <p class="mb-4">Ground floor can be finished with ceramic tiles, vinyl flooring, or raised access floors depending on requirements. The second floor uses steel composite decking with cement screed and finished flooring. The floor system is designed for live loads of 200 kg/m².</p>

    <h4 class="text-lg font-semibold mb-3 mt-6">Windows & Doors</h4>
    <p class="mb-4">All windows are double-glazed PVC profiles with thermal break, providing energy efficiency and sound insulation. Main entrance features steel security doors with powder-coated finish, while interior doors are available in various materials including wood, steel, or aluminum.</p>
  `

  // Description Content
  const descriptionContent = `
    <p class="mb-4">The Modular Buildings Co Prefabricated Office 560 m² represents the pinnacle of modern modular construction technology, offering businesses a fast, cost-effective, and high-quality solution for their workspace needs. This two-story office building combines functionality with aesthetic appeal, providing a professional environment suitable for various corporate, governmental, and commercial applications.</p>

    <p class="mb-4">Designed with flexibility in mind, this prefabricated office can be customized to accommodate different organizational structures and workflow requirements. Whether you need an open-plan workspace, individual offices, meeting rooms, or a combination of all three, our design team can create a layout that maximizes efficiency and employee comfort.</p>

    <p class="mb-4">The building's modular construction method allows for rapid deployment without compromising on quality or durability. Factory-built components ensure precision manufacturing and quality control, while on-site assembly is quick and minimally disruptive to surrounding operations. This approach can reduce construction time by up to 50% compared to traditional building methods.</p>

    <p class="mb-4">Energy efficiency is a key feature of our prefabricated offices. The high-performance insulation system significantly reduces heating and cooling costs, while the option to integrate solar panels and other green technologies makes this an environmentally responsible choice. The building can achieve various green building certifications depending on your requirements.</p>
  `

  return (
    <>
      {/* 1. Breadcrumbs via Banner */}
      <CategoryBanner
        title={product.title}
        backgroundImage={images[0]?.url}
        breadcrumbs={breadcrumbs}
      />

      {/* Main Product Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* 2. Image Gallery */}
            <div>
              <ImageGallery images={images} />
            </div>

            {/* 3. Product Info */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Badge variant="warning">{product.category}</Badge>
                {product.is_new && <Badge variant="primary">New</Badge>}
              </div>

              <h1 className="text-4xl font-bold mb-4 text-mb-dark">{product.title}</h1>

              {/* Quick Stats */}
              <div className="bg-mb-bg-light p-6 rounded-mb-lg mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <Ruler className="w-6 h-6 mx-auto mb-2 text-mb-navy" />
                    <div className="text-2xl font-bold text-mb-navy">
                      {product.total_area || '560'}
                    </div>
                    <div className="text-sm text-mb-gray">Total Area (m²)</div>
                  </div>
                  <div>
                    <Building2 className="w-6 h-6 mx-auto mb-2 text-mb-navy" />
                    <div className="text-2xl font-bold text-mb-navy">
                      {product.floor_count || '2'}
                    </div>
                    <div className="text-sm text-mb-gray">Floors</div>
                  </div>
                  <div>
                    <Clock className="w-6 h-6 mx-auto mb-2 text-mb-navy" />
                    <div className="text-2xl font-bold text-mb-navy">
                      {product.completion_days || '75-105'}
                    </div>
                    <div className="text-sm text-mb-gray">Days</div>
                  </div>
                </div>
              </div>

              {/* Price Range */}
              {product.price_range && (
                <div className="mb-6 p-4 bg-mb-warning/10 rounded-mb border-l-4 border-mb-warning">
                  <div className="text-sm text-mb-gray mb-1">Estimated Price Range</div>
                  <div className="text-2xl font-bold text-mb-dark">{product.price_range}</div>
                  <div className="text-xs text-mb-gray mt-1">*Final price depends on specifications and location</div>
                </div>
              )}

              {/* 5. Features List */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-4 text-mb-dark">Key Features</h3>
                <ul className="space-y-2">
                  {features.slice(0, 8).map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-mb-warning flex-shrink-0 mt-0.5" />
                      <span className="text-mb-gray">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 13. Additional CTAs */}
              <div className="flex flex-wrap gap-4 mb-6">
                <Button variant="primary" size="lg">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us Now
                </Button>
                <Button variant="warning" size="lg">
                  <Mail className="w-5 h-5 mr-2" />
                  Get Price Quote
                </Button>
                <Button variant="outline" size="lg">
                  <Download className="w-5 h-5 mr-2" />
                  Download Brochure
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 pt-6 border-t border-mb-border-light">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-mb-navy" />
                  <span className="text-sm text-mb-gray">10 Year Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-mb-navy" />
                  <span className="text-sm text-mb-gray">ISO Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-mb-navy" />
                  <span className="text-sm text-mb-gray">Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Description Content */}
      <ContentBlockSection
        title="About This Product"
        content={descriptionContent}
        backgroundColor="light"
      />

      {/* 4. Specifications Table - Grouped Variant */}
      <SpecificationsTable
        specifications={groupedSpecifications}
        title="Technical Specifications"
        variant="grouped"
        showIcons={true}
        className="bg-white"
      />

      {/* 7. Technical Details */}
      <ContentBlockSection
        title="Technical Details & Construction"
        content={technicalDetailsContent}
        backgroundColor="white"
      />

      {/* 8. Applications */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4 text-center">
            Applications & Use Cases
          </h2>
          <p className="text-base text-mb-gray max-w-3xl mx-auto text-center mb-12">
            This versatile prefabricated office solution is ideal for various industries and applications
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-mb-lg border border-mb-border-light hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-mb-navy/10 rounded-mb flex items-center justify-center text-mb-navy mb-4">
                  {app.icon}
                </div>
                <h3 className="text-lg font-bold text-mb-dark mb-2">{app.title}</h3>
                <p className="text-sm text-mb-gray">{app.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ Section */}
      <FAQSection
        questions={faqs}
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our prefabricated office buildings"
        className="bg-white"
      />

      {/* 11. Projects Using This Product */}
      {projects.length > 0 && (
        <section className="section-padding bg-mb-bg-light">
          <div className="container-custom">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4 text-center">
              Case Studies & Projects
            </h2>
            <p className="text-base text-mb-gray max-w-2xl mx-auto text-center mb-12">
              See how our clients have successfully implemented this product
            </p>

            <ProductGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }}>
              {projects.map((project: any) => (
                <ProductCard
                  key={project.id}
                  title={project.title}
                  category={project.location || 'Project'}
                  imageUrl={project.images?.[0]?.url || getPlaceholderImage(400, 300, 'Project Photo')}
                  href={`/projects/${project.slug}`}
                  area={project.total_area}
                />
              ))}
            </ProductGrid>
          </div>
        </section>
      )}

      {/* 12. Contact Form - Get a Quote */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
                Request a Detailed Quote
              </h2>
              <p className="text-base text-mb-gray">
                Fill out the form below and our sales team will contact you within 24 hours with a customized proposal
              </p>
            </div>
            <ContactForm
              productInterest={product.id}
              sourcePage={`/products/${params.slug}`}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Get Started?"
        subtitle="Talk to Our Experts"
        description="Our experienced team is ready to help you find the perfect prefabricated solution for your project. Contact us today for a free consultation and quote."
        primaryButton={{
          text: 'Contact Sales',
          href: '/contact',
          variant: 'warning'
        }}
        secondaryButton={{
          text: 'View All Products',
          href: '/products',
          variant: 'outline'
        }}
        variant="contained"
        backgroundColor="navy"
      />

      {/* 10. Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              Related Products
            </h2>
            <p className="text-base text-mb-gray mb-8">
              Explore similar products that might interest you
            </p>

            <ProductGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
              {relatedProducts.map((relatedProduct: any) => (
                <ProductCard
                  key={relatedProduct.id}
                  title={relatedProduct.title}
                  category={relatedProduct.category}
                  imageUrl={relatedProduct.images?.[0]?.url || getPlaceholderImage(400, 300, 'Product')}
                  href={`/products/${relatedProduct.slug}`}
                  area={relatedProduct.total_area}
                  completionDays={relatedProduct.completion_days}
                />
              ))}
            </ProductGrid>
          </div>
        </section>
      )}

      {/* Additional Information Section */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-mb-lg">
              <Shield className="w-12 h-12 mx-auto mb-4 text-mb-navy" />
              <h3 className="text-lg font-bold text-mb-dark mb-2">Quality Guarantee</h3>
              <p className="text-sm text-mb-gray">
                All products manufactured to ISO 9001 standards with rigorous quality control
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-mb-lg">
              <Users className="w-12 h-12 mx-auto mb-4 text-mb-navy" />
              <h3 className="text-lg font-bold text-mb-dark mb-2">Expert Support</h3>
              <p className="text-sm text-mb-gray">
                Dedicated project managers and technical support throughout the entire process
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-mb-lg">
              <Zap className="w-12 h-12 mx-auto mb-4 text-mb-navy" />
              <h3 className="text-lg font-bold text-mb-dark mb-2">Fast Delivery</h3>
              <p className="text-sm text-mb-gray">
                Streamlined production and installation process for quick project completion
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
