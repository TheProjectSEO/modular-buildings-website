import { notFound } from 'next/navigation'
import { HeroBanner } from '@/components/ui/HeroBanner'
import { ContactForm } from '@/components/forms/ContactForm'
import { CTASection } from '@/components/sections/CTASection'
import { BreadcrumbsComponent, BreadcrumbItem } from '@/components/sections/BreadcrumbsComponent'
import { FAQSection } from '@/components/sections/FAQSection'
import { ContentBlockSection } from '@/components/sections/ContentBlockSection'
import { InternalLinksSection } from '@/components/sections/InternalLinksSection'
import { ProductCard } from '@/components/ui/ProductCard'
import { ProductGrid } from '@/components/ui/ProductGrid'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import {
  PRODUCTS,
  STATES,
  INDUSTRIES,
  generateProductData,
  generateStateData,
  generateIndustryData,
  generateFAQs,
  generateRelatedLinks,
} from '@/lib/mockDataGenerators'
import Link from 'next/link'
import { Building2, MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Product Page Component
function ProductPage({ slug }: { slug: string }) {
  const productData = generateProductData(slug)
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Products', href: '/products' },
    { label: productData.name, href: `/${slug}` },
  ]
  const faqs = generateFAQs('product', productData.name)
  const relatedLinks = generateRelatedLinks('product', slug)

  return (
    <>
      {/* Breadcrumbs */}
      <BreadcrumbsComponent items={breadcrumbs} />

      {/* Hero Banner */}
      <HeroBanner
        title={productData.name}
        subtitle={productData.description}
        backgroundImage={getPlaceholderImage(1920, 600, productData.name)}
        height="md"
      />

      {/* Product Overview Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-h2 font-bold mb-6">About {productData.name}</h2>
              <p className="text-lg text-mb-gray mb-6">
                Our {productData.name.toLowerCase()} are engineered for quality, durability, and fast installation.
                Whether you need a temporary solution or a permanent structure, we provide comprehensive modular
                building solutions tailored to your specific requirements.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-mb-warning flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Fast Installation</h3>
                    <p className="text-mb-gray">Ready for use in weeks, not months</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-mb-warning flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Customizable Design</h3>
                    <p className="text-mb-gray">Tailored to your specific needs and preferences</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-mb-warning flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Durable Construction</h3>
                    <p className="text-mb-gray">Built to last with premium materials</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-mb-warning flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Cost-Effective</h3>
                    <p className="text-mb-gray">Save up to 40% compared to traditional construction</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-mb-lg overflow-hidden">
              <img
                src={getPlaceholderImage(800, 600, productData.name)}
                alt={productData.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Variations Section */}
      {productData.variations && productData.variations.length > 0 && (
        <section className="section-padding bg-mb-bg-light">
          <div className="container-custom">
            <h2 className="text-h2 font-bold mb-8">Available Variations</h2>
            <ProductGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }}>
              {productData.variations.map((variation) => (
                <ProductCard
                  key={variation}
                  title={variation
                    .split('-')
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(' ')}
                  category={productData.name}
                  imageUrl={getPlaceholderImage(400, 300, `${productData.name} - ${variation}`)}
                  href={`/${slug}/${variation}`}
                />
              ))}
            </ProductGrid>
          </div>
        </section>
      )}

      {/* Location Availability Section */}
      <ContentBlockSection
        title={`${productData.name} Available Nationwide`}
        content={`
          <p>We deliver ${productData.name.toLowerCase()} to all 50 states across the United States. Our experienced logistics team ensures timely delivery and professional installation, no matter where your project is located.</p>
          <p class="mt-4">Popular locations include Texas, California, Florida, New York, and Pennsylvania. Each building is manufactured to meet or exceed local building codes and regulations.</p>
        `}
        layout="text-only"
        backgroundColor="white"
      />

      {/* FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        subtitle={`Common questions about ${productData.name}`}
        questions={faqs}
        className="bg-mb-bg-light"
      />

      {/* Related Products */}
      <InternalLinksSection
        title="Related Products"
        subtitle="Explore other modular building solutions"
        links={relatedLinks}
        columns={3}
        showIcon={true}
      />

      {/* Contact Form Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-h2 font-bold mb-4">Get a Free Quote</h2>
              <p className="text-lg text-mb-gray">
                Interested in {productData.name.toLowerCase()}? Fill out the form below and our team will contact
                you shortly with a customized quote.
              </p>
            </div>
            <div className="bg-mb-bg-light p-8 md:p-12 rounded-mb-lg">
              <ContactForm productInterest={productData.name} sourcePage={`/${slug}`} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Start Your Project?"
        description="Contact our team today to discuss your modular building needs and get a custom quote."
        primaryButton={{
          text: 'Call Us Now',
          href: 'tel:+905376563068',
          variant: 'warning',
        }}
        secondaryButton={{
          text: 'View All Products',
          href: '/products',
          variant: 'outline',
        }}
        variant="full-width"
        backgroundColor="navy"
      />
    </>
  )
}

// State Page Component
function StatePage({ slug }: { slug: string }) {
  const stateData = generateStateData(slug)
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Locations', href: '/locations' },
    { label: stateData.name, href: `/${slug}` },
  ]
  const faqs = generateFAQs('location', stateData.name)
  const relatedLinks = generateRelatedLinks('state', slug)

  return (
    <>
      {/* Breadcrumbs */}
      <BreadcrumbsComponent items={breadcrumbs} />

      {/* Hero Banner */}
      <HeroBanner
        title={`Modular Buildings in ${stateData.name}`}
        subtitle={`Quality prefabricated building solutions delivered across ${stateData.name}`}
        backgroundImage={getPlaceholderImage(1920, 600, `${stateData.name} Landscape`)}
        height="md"
      />

      {/* State Overview Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-mb-bg-light p-6 rounded-mb-lg text-center">
              <MapPin className="w-12 h-12 text-mb-navy mx-auto mb-3" />
              <h3 className="font-bold text-xl mb-2">Statewide Coverage</h3>
              <p className="text-mb-gray">Serving all cities across {stateData.name}</p>
            </div>
            <div className="bg-mb-bg-light p-6 rounded-mb-lg text-center">
              <Building2 className="w-12 h-12 text-mb-navy mx-auto mb-3" />
              <h3 className="font-bold text-xl mb-2">All Building Types</h3>
              <p className="text-mb-gray">Offices, classrooms, housing, and more</p>
            </div>
            <div className="bg-mb-bg-light p-6 rounded-mb-lg text-center">
              <Clock className="w-12 h-12 text-mb-navy mx-auto mb-3" />
              <h3 className="font-bold text-xl mb-2">Fast Delivery</h3>
              <p className="text-mb-gray">Quick installation and setup</p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-h2 font-bold mb-6 text-center">
              Modular Building Solutions for {stateData.name}
            </h2>
            <p className="text-lg text-mb-gray mb-6">
              As a leading provider of modular and prefabricated buildings, we proudly serve customers throughout{' '}
              {stateData.name} ({stateData.code}). Our {stateData.region} region expertise ensures that all
              buildings meet local building codes, weather requirements, and regulatory standards.
            </p>
            <p className="text-lg text-mb-gray mb-6">
              With a population of over {(stateData.population / 1000000).toFixed(1)} million people,{' '}
              {stateData.name} has diverse modular building needs. We work with businesses, schools, government
              agencies, and individuals to provide customized solutions that meet exact specifications.
            </p>
          </div>
        </div>
      </section>

      {/* Products Available in State */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <h2 className="text-h2 font-bold mb-8 text-center">
            Popular Products in {stateData.name}
          </h2>
          <ProductGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
            {Object.entries(PRODUCTS)
              .slice(0, 6)
              .map(([productSlug, product]) => (
                <ProductCard
                  key={productSlug}
                  title={`${product.name} in ${stateData.name}`}
                  category={product.category}
                  imageUrl={getPlaceholderImage(400, 300, product.name)}
                  href={`/${productSlug}/${slug}`}
                />
              ))}
          </ProductGrid>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <ContentBlockSection
        title={`Why Choose Us for Modular Buildings in ${stateData.name}`}
        content={`
          <p>We have extensive experience delivering modular buildings throughout ${stateData.name}. Our team understands the unique requirements of the ${stateData.region} region, including climate considerations, local building codes, and permitting processes.</p>
          <ul class="list-disc list-inside space-y-2 mt-4">
            <li>Full compliance with ${stateData.name} building codes and regulations</li>
            <li>Experienced local installation teams</li>
            <li>Buildings designed for ${stateData.region} climate conditions</li>
            <li>Fast delivery and setup across the state</li>
            <li>Comprehensive warranty and support</li>
          </ul>
        `}
        layout="text-only"
        backgroundColor="white"
      />

      {/* FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        subtitle={`Common questions about modular buildings in ${stateData.name}`}
        questions={faqs}
        className="bg-mb-bg-light"
      />

      {/* Related Links */}
      <InternalLinksSection
        title={`Modular Building Options in ${stateData.name}`}
        subtitle="Browse our complete product lineup"
        links={relatedLinks}
        columns={3}
        showIcon={true}
      />

      {/* Contact Form Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-h2 font-bold mb-4">Request a Quote for {stateData.name}</h2>
              <p className="text-lg text-mb-gray">
                Get in touch with our {stateData.name} team to discuss your project needs and receive a detailed
                quote.
              </p>
            </div>
            <div className="bg-mb-bg-light p-8 md:p-12 rounded-mb-lg">
              <ContactForm sourcePage={`/${slug}`} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title={`Serving ${stateData.name} with Quality Modular Buildings`}
        description="Contact us today to learn more about our modular building solutions available in your area."
        primaryButton={{
          text: 'Call Us Now',
          href: 'tel:+905376563068',
          variant: 'warning',
        }}
        secondaryButton={{
          text: 'Email Us',
          href: 'mailto:info@modular-buildings.co',
          variant: 'outline',
        }}
        variant="full-width"
        backgroundColor="navy"
      />
    </>
  )
}

// Industry Page Component
function IndustryPage({ slug }: { slug: string }) {
  const industryData = generateIndustryData(slug)
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Industries', href: '/industries' },
    { label: industryData.name, href: `/${slug}` },
  ]
  const faqs = generateFAQs('industry', industryData.name)
  const relatedLinks = generateRelatedLinks('industry', slug)

  return (
    <>
      {/* Breadcrumbs */}
      <BreadcrumbsComponent items={breadcrumbs} />

      {/* Hero Banner */}
      <HeroBanner
        title={industryData.name}
        subtitle={industryData.description}
        backgroundImage={getPlaceholderImage(1920, 600, industryData.name)}
        height="md"
      />

      {/* Industry Overview Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-h2 font-bold mb-6">Specialized Solutions for Your Industry</h2>
            <p className="text-lg text-mb-gray">
              Our modular buildings are designed specifically for the unique needs of the{' '}
              {industryData.name.toLowerCase()} sector. We understand the challenges and requirements of your
              industry and provide tailored solutions that meet regulatory standards and operational needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-mb-bg-light rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-mb-navy" />
              </div>
              <h3 className="font-bold mb-2">Industry Compliant</h3>
              <p className="text-mb-gray text-sm">
                Meets all regulatory and safety requirements
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-mb-bg-light rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-mb-navy" />
              </div>
              <h3 className="font-bold mb-2">Custom Design</h3>
              <p className="text-mb-gray text-sm">Tailored layouts for your specific needs</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-mb-bg-light rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-mb-navy" />
              </div>
              <h3 className="font-bold mb-2">Fast Deployment</h3>
              <p className="text-mb-gray text-sm">Quick installation to minimize downtime</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-mb-bg-light rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-mb-navy" />
              </div>
              <h3 className="font-bold mb-2">Scalable</h3>
              <p className="text-mb-gray text-sm">Expandable as your needs grow</p>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <ContentBlockSection
        title="Applications and Use Cases"
        content={`
          <p>Our ${industryData.name.toLowerCase()} are used in a wide variety of applications, providing flexible, cost-effective solutions for diverse operational needs.</p>
          <h3 class="text-xl font-bold mt-6 mb-3">Key Features</h3>
          <ul class="list-disc list-inside space-y-2">
            <li>Industry-specific layouts and design elements</li>
            <li>Compliance with sector regulations and standards</li>
            <li>Energy-efficient systems to reduce operational costs</li>
            <li>Durable construction for long-term reliability</li>
            <li>Professional installation and ongoing support</li>
          </ul>
          <h3 class="text-xl font-bold mt-6 mb-3">Benefits</h3>
          <p class="mt-4">Choose modular construction for faster project completion, lower costs, and superior quality. Our buildings can be installed in a fraction of the time required for traditional construction, allowing you to start operations sooner.</p>
        `}
        image={{
          url: getPlaceholderImage(800, 600, industryData.name),
          alt: industryData.name,
        }}
        layout="image-right"
        backgroundColor="light"
      />

      {/* Recommended Products */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-h2 font-bold mb-8 text-center">Recommended Products</h2>
          <ProductGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
            {Object.entries(PRODUCTS)
              .slice(0, 6)
              .map(([productSlug, product]) => (
                <ProductCard
                  key={productSlug}
                  title={product.name}
                  category={product.category}
                  imageUrl={getPlaceholderImage(400, 300, product.name)}
                  href={`/${productSlug}`}
                />
              ))}
          </ProductGrid>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        subtitle={`Common questions about ${industryData.name.toLowerCase()}`}
        questions={faqs}
        className="bg-mb-bg-light"
      />

      {/* Related Links */}
      <InternalLinksSection
        title="Explore More Solutions"
        subtitle="Discover other products and services"
        links={relatedLinks}
        columns={3}
        showIcon={true}
      />

      {/* Contact Form Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-h2 font-bold mb-4">Discuss Your Project</h2>
              <p className="text-lg text-mb-gray">
                Tell us about your {industryData.name.toLowerCase()} needs and our experts will provide a
                customized solution.
              </p>
            </div>
            <div className="bg-mb-bg-light p-8 md:p-12 rounded-mb-lg">
              <ContactForm productInterest={industryData.name} sourcePage={`/${slug}`} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Let's Build Your Future Together"
        description="Partner with us for industry-leading modular building solutions designed for your success."
        primaryButton={{
          text: 'Get Started',
          href: '/contact',
          variant: 'warning',
        }}
        secondaryButton={{
          text: 'View Portfolio',
          href: '/projects',
          variant: 'outline',
        }}
        variant="full-width"
        backgroundColor="navy"
      />
    </>
  )
}

// Main Page Component with Route Logic
export default async function UnifiedPage({ params }: PageProps) {
  const { slug } = await params

  // Check if slug is a product
  if (slug in PRODUCTS) {
    return <ProductPage slug={slug} />
  }

  // Check if slug is a state
  if (slug in STATES) {
    return <StatePage slug={slug} />
  }

  // Check if slug is an industry
  if (slug in INDUSTRIES) {
    return <IndustryPage slug={slug} />
  }

  // If slug ends with -modular-buildings or similar industry patterns, treat as industry
  if (
    slug.includes('modular-buildings') ||
    slug.includes('-facilities') ||
    slug.includes('site-offices')
  ) {
    return <IndustryPage slug={slug} />
  }

  // If nothing matches, return 404
  notFound()
}

// Generate static params for known routes
export async function generateStaticParams() {
  const productSlugs = Object.keys(PRODUCTS).map((slug) => ({ slug }))
  const stateSlugs = Object.keys(STATES).map((slug) => ({ slug }))
  const industrySlugs = Object.keys(INDUSTRIES).map((slug) => ({ slug }))

  return [...productSlugs, ...stateSlugs, ...industrySlugs]
}

// Generate metadata
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params

  if (slug in PRODUCTS) {
    const product = PRODUCTS[slug as keyof typeof PRODUCTS]
    return {
      title: `${product.name} | Modular Buildings Co`,
      description: product.description,
    }
  }

  if (slug in STATES) {
    const state = STATES[slug as keyof typeof STATES]
    return {
      title: `Modular Buildings in ${state.name} | Modular Buildings Co`,
      description: `Quality prefabricated and modular building solutions delivered across ${state.name}. Fast installation, customizable designs.`,
    }
  }

  if (slug in INDUSTRIES) {
    const industry = INDUSTRIES[slug as keyof typeof INDUSTRIES]
    return {
      title: `${industry.name} | Modular Buildings Co`,
      description: industry.description,
    }
  }

  return {
    title: `${slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} | Modular Buildings Co`,
    description: 'Premium modular building solutions',
  }
}
