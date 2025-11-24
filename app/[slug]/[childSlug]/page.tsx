import { notFound } from 'next/navigation'
import { HeroBanner } from '@/components/ui/HeroBanner'
import { ContactForm } from '@/components/forms/ContactForm'
import { CTASection } from '@/components/sections/CTASection'
import { BreadcrumbsComponent, BreadcrumbItem } from '@/components/sections/BreadcrumbsComponent'
import { FAQSection } from '@/components/sections/FAQSection'
import { ContentBlockSection } from '@/components/sections/ContentBlockSection'
import { InternalLinksSection } from '@/components/sections/InternalLinksSection'
import { SpecificationsTable } from '@/components/sections/SpecificationsTable'
import { ImageGallery } from '@/components/ui/ImageGallery'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import {
  PRODUCTS,
  STATES,
  CITIES,
  generateProductData,
  generateStateData,
  generateCityData,
  generateFAQs,
} from '@/lib/mockDataGenerators'
import Link from 'next/link'
import { MapPin, Building2, CheckCircle, TrendingUp, Clock, Award } from 'lucide-react'

interface PageProps {
  params: Promise<{
    slug: string
    childSlug: string
  }>
}

// Product + State Page (Location-specific Product)
function ProductStatePage({ productSlug, stateSlug }: { productSlug: string; stateSlug: string }) {
  const productData = generateProductData(productSlug)
  const stateData = generateStateData(stateSlug)

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Products', href: '/products' },
    { label: productData.name, href: `/${productSlug}` },
    { label: stateData.name, href: `/${productSlug}/${stateSlug}` },
  ]

  const faqs = generateFAQs('location', `${productData.name} in ${stateData.name}`)

  const specifications = [
    { label: 'Building Type', value: productData.name },
    { label: 'Location', value: `${stateData.name} (${stateData.code})` },
    { label: 'Region', value: stateData.region },
    { label: 'Installation Time', value: '2-6 weeks' },
    { label: 'Customization', value: 'Available' },
    { label: 'Warranty', value: '10 years structural' },
  ]

  const galleryImages = [
    {
      url: getPlaceholderImage(800, 600, `${productData.name} 1`),
      alt: `${productData.name} view 1`,
    },
    {
      url: getPlaceholderImage(800, 600, `${productData.name} 2`),
      alt: `${productData.name} view 2`,
    },
    {
      url: getPlaceholderImage(800, 600, `${productData.name} 3`),
      alt: `${productData.name} view 3`,
    },
    {
      url: getPlaceholderImage(800, 600, `${productData.name} 4`),
      alt: `${productData.name} view 4`,
    },
  ]

  const relatedLinks = Object.entries(PRODUCTS)
    .filter(([slug]) => slug !== productSlug)
    .slice(0, 6)
    .map(([slug, product]) => ({
      title: `${product.name} in ${stateData.name}`,
      url: `/${slug}/${stateSlug}`,
      description: `${product.description}`,
    }))

  return (
    <>
      {/* Breadcrumbs */}
      <BreadcrumbsComponent items={breadcrumbs} />

      {/* Hero Banner */}
      <HeroBanner
        title={`${productData.name} in ${stateData.name}`}
        subtitle={`Professional ${productData.name.toLowerCase()} delivered and installed across ${stateData.name}`}
        backgroundImage={getPlaceholderImage(1920, 600, `${productData.name} ${stateData.name}`)}
        height="md"
      />

      {/* Overview Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-h2 font-bold mb-6">
                {productData.name} for {stateData.name}
              </h2>
              <p className="text-lg text-mb-gray mb-6">
                Looking for {productData.name.toLowerCase()} in {stateData.name}? We provide comprehensive
                modular building solutions throughout the state, with full compliance to {stateData.code} building
                codes and regulations.
              </p>
              <p className="text-lg text-mb-gray mb-6">
                Our {productData.name.toLowerCase()} are ideal for {stateData.name} businesses, schools,
                construction sites, and government facilities. With fast delivery and professional installation, you
                can have your building operational in weeks, not months.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-mb-bg-light p-4 rounded-mb">
                  <MapPin className="w-8 h-8 text-mb-navy mb-2" />
                  <h3 className="font-bold mb-1">Statewide Service</h3>
                  <p className="text-sm text-mb-gray">All {stateData.name} cities</p>
                </div>
                <div className="bg-mb-bg-light p-4 rounded-mb">
                  <Clock className="w-8 h-8 text-mb-navy mb-2" />
                  <h3 className="font-bold mb-1">Fast Delivery</h3>
                  <p className="text-sm text-mb-gray">2-6 weeks typical</p>
                </div>
                <div className="bg-mb-bg-light p-4 rounded-mb">
                  <CheckCircle className="w-8 h-8 text-mb-navy mb-2" />
                  <h3 className="font-bold mb-1">Code Compliant</h3>
                  <p className="text-sm text-mb-gray">{stateData.code} certified</p>
                </div>
                <div className="bg-mb-bg-light p-4 rounded-mb">
                  <Award className="w-8 h-8 text-mb-navy mb-2" />
                  <h3 className="font-bold mb-1">10-Year Warranty</h3>
                  <p className="text-sm text-mb-gray">Full structural coverage</p>
                </div>
              </div>
            </div>

            <div>
              <ImageGallery images={galleryImages} />
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <h2 className="text-h2 font-bold mb-8 text-center">Product Specifications</h2>
          <div className="max-w-3xl mx-auto">
            <SpecificationsTable specifications={specifications} />
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <ContentBlockSection
        title={`Why Choose Our ${productData.name} in ${stateData.name}`}
        content={`
          <h3 class="text-xl font-bold mb-3">Local Expertise</h3>
          <p>We have extensive experience delivering modular buildings throughout ${stateData.name}. Our team understands the unique requirements of the ${stateData.region} region, including climate considerations and local permitting.</p>

          <h3 class="text-xl font-bold mt-6 mb-3">Quality Construction</h3>
          <p>Every building is constructed with premium materials including galvanized steel frames and high-grade insulated panels. Our ${productData.name.toLowerCase()} meet or exceed all ${stateData.name} building standards.</p>

          <h3 class="text-xl font-bold mt-6 mb-3">Cost-Effective Solution</h3>
          <p>Modular construction offers significant cost savings compared to traditional building methods. Clients typically save 20-40% on construction costs while receiving a higher quality product with faster delivery.</p>
        `}
        layout="text-only"
        backgroundColor="white"
      />

      {/* Benefits Section */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <h2 className="text-h2 font-bold mb-12 text-center">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-mb-navy" />
              </div>
              <h3 className="font-bold mb-2">Cost Savings</h3>
              <p className="text-mb-gray text-sm">Save 20-40% vs traditional construction</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-mb-navy" />
              </div>
              <h3 className="font-bold mb-2">Fast Installation</h3>
              <p className="text-mb-gray text-sm">75% faster than traditional building</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-mb-navy" />
              </div>
              <h3 className="font-bold mb-2">Customizable</h3>
              <p className="text-mb-gray text-sm">Tailored to your exact requirements</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-mb-navy" />
              </div>
              <h3 className="font-bold mb-2">Quality Assured</h3>
              <p className="text-mb-gray text-sm">Premium materials and construction</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        subtitle={`Common questions about ${productData.name.toLowerCase()} in ${stateData.name}`}
        questions={faqs}
        className="bg-white"
      />

      {/* Related Products */}
      <InternalLinksSection
        title={`More Products Available in ${stateData.name}`}
        subtitle="Explore our complete product lineup"
        links={relatedLinks}
        columns={3}
        showIcon={true}
      />

      {/* Contact Form */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-h2 font-bold mb-4">
                Get a Quote for {productData.name} in {stateData.name}
              </h2>
              <p className="text-lg text-mb-gray">
                Fill out the form below and our {stateData.name} team will contact you with a detailed quote.
              </p>
            </div>
            <div className="bg-white p-8 md:p-12 rounded-mb-lg">
              <ContactForm
                productInterest={`${productData.name} in ${stateData.name}`}
                sourcePage={`/${productSlug}/${stateSlug}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Get Started?"
        description={`Contact our ${stateData.name} team today to discuss your ${productData.name.toLowerCase()} project.`}
        primaryButton={{
          text: 'Call Now',
          href: 'tel:+905376563068',
          variant: 'warning',
        }}
        secondaryButton={{
          text: 'View More Products',
          href: '/products',
          variant: 'outline',
        }}
        variant="full-width"
        backgroundColor="navy"
      />
    </>
  )
}

// Product + Variation Page
function ProductVariationPage({ productSlug, variationSlug }: { productSlug: string; variationSlug: string }) {
  const productData = generateProductData(productSlug)
  const variationName = variationSlug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Products', href: '/products' },
    { label: productData.name, href: `/${productSlug}` },
    { label: variationName, href: `/${productSlug}/${variationSlug}` },
  ]

  const faqs = generateFAQs('product', `${variationName} ${productData.name}`)

  const specifications = [
    { label: 'Product Type', value: productData.name },
    { label: 'Variation', value: variationName },
    { label: 'Category', value: productData.category },
    { label: 'Delivery Time', value: '4-8 weeks' },
    { label: 'Installation', value: '1-3 days' },
    { label: 'Warranty', value: '10 years' },
  ]

  const galleryImages = [
    {
      url: getPlaceholderImage(800, 600, `${variationName} ${productData.name} 1`),
      alt: `${variationName} ${productData.name} exterior`,
    },
    {
      url: getPlaceholderImage(800, 600, `${variationName} ${productData.name} 2`),
      alt: `${variationName} ${productData.name} interior`,
    },
    {
      url: getPlaceholderImage(800, 600, `${variationName} ${productData.name} 3`),
      alt: `${variationName} ${productData.name} detail`,
    },
    {
      url: getPlaceholderImage(800, 600, `${variationName} ${productData.name} 4`),
      alt: `${variationName} ${productData.name} layout`,
    },
  ]

  const relatedLinks =
    productData.variations?.filter((v) => v !== variationSlug).map((variation) => ({
      title: variation
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
      url: `/${productSlug}/${variation}`,
      description: `Explore our ${variation.replace(/-/g, ' ')} configuration`,
    })) || []

  return (
    <>
      {/* Breadcrumbs */}
      <BreadcrumbsComponent items={breadcrumbs} />

      {/* Hero Banner */}
      <HeroBanner
        title={`${variationName} ${productData.name}`}
        subtitle={productData.description}
        backgroundImage={getPlaceholderImage(1920, 600, `${variationName} ${productData.name}`)}
        height="md"
      />

      {/* Overview Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-h2 font-bold mb-6">{variationName} Configuration</h2>
              <p className="text-lg text-mb-gray mb-6">
                Our {variationName.toLowerCase()} {productData.name.toLowerCase()} provide the perfect balance of
                functionality, quality, and value. This configuration is designed to meet specific operational
                requirements while maintaining the highest standards of construction and durability.
              </p>

              <h3 className="text-xl font-bold mb-4">Key Features</h3>
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-mb-warning flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold">Premium Construction</h4>
                    <p className="text-mb-gray">Galvanized steel frame with superior insulation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-mb-warning flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold">Optimized Layout</h4>
                    <p className="text-mb-gray">Efficient space utilization for maximum functionality</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-mb-warning flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold">Full Customization</h4>
                    <p className="text-mb-gray">Modify layout, finishes, and features to your needs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-mb-warning flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold">Rapid Installation</h4>
                    <p className="text-mb-gray">Professional setup in just 1-3 days</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <ImageGallery images={galleryImages} />
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <h2 className="text-h2 font-bold mb-8 text-center">Specifications</h2>
          <div className="max-w-3xl mx-auto">
            <SpecificationsTable specifications={specifications} />
          </div>
        </div>
      </section>

      {/* Detailed Information */}
      <ContentBlockSection
        title="Comprehensive Solution"
        content={`
          <p>The ${variationName.toLowerCase()} configuration of our ${productData.name.toLowerCase()} represents the pinnacle of modular building design and engineering. Every detail has been carefully considered to provide a superior product that meets the demands of modern applications.</p>

          <h3 class="text-xl font-bold mt-6 mb-3">Construction Quality</h3>
          <p>Built with heavy-duty galvanized steel frames and premium insulated panels, these buildings are designed to withstand harsh weather conditions and provide decades of reliable service. All materials are sourced from certified suppliers and undergo rigorous quality control.</p>

          <h3 class="text-xl font-bold mt-6 mb-3">Flexibility and Expandability</h3>
          <p>Need to expand in the future? Our modular design makes it easy to add additional sections or modify the existing structure. The ${variationName.toLowerCase()} configuration can be adapted as your needs evolve.</p>

          <h3 class="text-xl font-bold mt-6 mb-3">Energy Efficiency</h3>
          <p>Superior insulation and energy-efficient systems significantly reduce heating and cooling costs. Our buildings are designed to minimize environmental impact while maximizing occupant comfort.</p>
        `}
        layout="text-only"
        backgroundColor="white"
      />

      {/* FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        subtitle={`Learn more about ${variationName.toLowerCase()} ${productData.name.toLowerCase()}`}
        questions={faqs}
        className="bg-mb-bg-light"
      />

      {/* Related Variations */}
      {relatedLinks.length > 0 && (
        <InternalLinksSection
          title="Other Variations"
          subtitle="Explore different configurations"
          links={relatedLinks}
          columns={3}
          showIcon={true}
        />
      )}

      {/* Contact Form */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-h2 font-bold mb-4">Request Information</h2>
              <p className="text-lg text-mb-gray">
                Interested in {variationName.toLowerCase()} {productData.name.toLowerCase()}? Contact us for
                detailed specifications and pricing.
              </p>
            </div>
            <div className="bg-mb-bg-light p-8 md:p-12 rounded-mb-lg">
              <ContactForm
                productInterest={`${variationName} ${productData.name}`}
                sourcePage={`/${productSlug}/${variationSlug}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Get Your Custom Quote Today"
        description="Our team is ready to help you design the perfect modular building solution."
        primaryButton={{
          text: 'Contact Us',
          href: '/contact',
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

// State + City Page
function StateCityPage({ stateSlug, citySlug }: { stateSlug: string; citySlug: string }) {
  const stateData = generateStateData(stateSlug)
  const cityData = generateCityData(stateSlug, citySlug)

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Locations', href: '/locations' },
    { label: stateData.name, href: `/${stateSlug}` },
    { label: cityData.name, href: `/${stateSlug}/${citySlug}` },
  ]

  const faqs = generateFAQs('location', `${cityData.name}, ${stateData.name}`)

  const cityProducts = Object.entries(PRODUCTS)
    .slice(0, 6)
    .map(([slug, product]) => ({
      title: `${product.name} in ${cityData.name}`,
      url: `/${slug}/${stateSlug}`,
      description: `${product.description} Available in ${cityData.name}, ${stateData.code}.`,
    }))

  return (
    <>
      {/* Breadcrumbs */}
      <BreadcrumbsComponent items={breadcrumbs} />

      {/* Hero Banner */}
      <HeroBanner
        title={`Modular Buildings in ${cityData.name}, ${stateData.name}`}
        subtitle={`Professional modular building solutions serving ${cityData.name} and surrounding areas`}
        backgroundImage={getPlaceholderImage(1920, 600, `${cityData.name} ${stateData.name}`)}
        height="md"
      />

      {/* City Overview */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-h2 font-bold mb-6">
              Serving {cityData.name}, {stateData.code}
            </h2>
            <p className="text-lg text-mb-gray">
              As a leading provider of modular and prefabricated buildings, we proudly serve {cityData.name} and
              the greater {stateData.name} area. Our local expertise ensures fast delivery, professional
              installation, and full compliance with {cityData.name} building codes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-mb-bg-light p-8 rounded-mb-lg text-center">
              <MapPin className="w-12 h-12 text-mb-navy mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">Local Service</h3>
              <p className="text-mb-gray">
                Population: {cityData.population.toLocaleString()}
              </p>
              <p className="text-sm text-mb-gray mt-2">
                Serving all {cityData.name} neighborhoods
              </p>
            </div>
            <div className="bg-mb-bg-light p-8 rounded-mb-lg text-center">
              <Clock className="w-12 h-12 text-mb-navy mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">Fast Delivery</h3>
              <p className="text-mb-gray">2-6 weeks typical</p>
              <p className="text-sm text-mb-gray mt-2">Rush options available</p>
            </div>
            <div className="bg-mb-bg-light p-8 rounded-mb-lg text-center">
              <Building2 className="w-12 h-12 text-mb-navy mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">Full Compliance</h3>
              <p className="text-mb-gray">{cityData.name} codes</p>
              <p className="text-sm text-mb-gray mt-2">Permitted and certified</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <ContentBlockSection
        title={`Why Choose Us in ${cityData.name}`}
        content={`
          <p>We have extensive experience delivering modular buildings throughout ${cityData.name} and ${stateData.name}. Our team understands the unique requirements of the ${stateData.region} region and ${cityData.name}'s local building environment.</p>

          <h3 class="text-xl font-bold mt-6 mb-3">Local Expertise</h3>
          <ul class="list-disc list-inside space-y-2">
            <li>Understanding of ${cityData.name} building codes and permitting</li>
            <li>Experience with ${stateData.region} climate and weather conditions</li>
            <li>Established relationships with local authorities</li>
            <li>Fast response times for ${cityData.name} projects</li>
          </ul>

          <h3 class="text-xl font-bold mt-6 mb-3">Comprehensive Service</h3>
          <p class="mt-4">From initial consultation to final installation, we handle every aspect of your project. Our ${cityData.name} team provides site evaluation, design customization, permitting assistance, delivery, installation, and ongoing support.</p>
        `}
        image={{
          url: getPlaceholderImage(800, 600, `${cityData.name} Service`),
          alt: `Modular buildings in ${cityData.name}`,
        }}
        layout="image-right"
        backgroundColor="light"
      />

      {/* Applications Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-h2 font-bold mb-8 text-center">
            Popular Applications in {cityData.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 border border-mb-border-gray rounded-mb-lg">
              <Building2 className="w-10 h-10 text-mb-navy mb-4" />
              <h3 className="font-bold text-lg mb-2">Commercial Offices</h3>
              <p className="text-mb-gray">
                Temporary and permanent office solutions for {cityData.name} businesses
              </p>
            </div>
            <div className="p-6 border border-mb-border-gray rounded-mb-lg">
              <Building2 className="w-10 h-10 text-mb-navy mb-4" />
              <h3 className="font-bold text-lg mb-2">Educational Facilities</h3>
              <p className="text-mb-gray">
                Classroom expansions and temporary school buildings
              </p>
            </div>
            <div className="p-6 border border-mb-border-gray rounded-mb-lg">
              <Building2 className="w-10 h-10 text-mb-navy mb-4" />
              <h3 className="font-bold text-lg mb-2">Construction Sites</h3>
              <p className="text-mb-gray">
                Site offices and worker accommodation for projects
              </p>
            </div>
            <div className="p-6 border border-mb-border-gray rounded-mb-lg">
              <Building2 className="w-10 h-10 text-mb-navy mb-4" />
              <h3 className="font-bold text-lg mb-2">Healthcare</h3>
              <p className="text-mb-gray">
                Medical clinics and healthcare facility expansions
              </p>
            </div>
            <div className="p-6 border border-mb-border-gray rounded-mb-lg">
              <Building2 className="w-10 h-10 text-mb-navy mb-4" />
              <h3 className="font-bold text-lg mb-2">Retail Spaces</h3>
              <p className="text-mb-gray">Pop-up shops and temporary retail locations</p>
            </div>
            <div className="p-6 border border-mb-border-gray rounded-mb-lg">
              <Building2 className="w-10 h-10 text-mb-navy mb-4" />
              <h3 className="font-bold text-lg mb-2">Storage & Warehousing</h3>
              <p className="text-mb-gray">
                Secure storage solutions for {cityData.name} businesses
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        subtitle={`Common questions about modular buildings in ${cityData.name}`}
        questions={faqs}
        className="bg-mb-bg-light"
      />

      {/* Available Products */}
      <InternalLinksSection
        title={`Products Available in ${cityData.name}`}
        subtitle="Browse our complete modular building solutions"
        links={cityProducts}
        columns={3}
        showIcon={true}
      />

      {/* Contact Form */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-h2 font-bold mb-4">
                Contact Our {cityData.name} Team
              </h2>
              <p className="text-lg text-mb-gray">
                Get in touch to discuss your modular building project in {cityData.name}, {stateData.code}.
              </p>
            </div>
            <div className="bg-mb-bg-light p-8 md:p-12 rounded-mb-lg">
              <ContactForm sourcePage={`/${stateSlug}/${citySlug}`} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title={`Serving ${cityData.name} with Excellence`}
        description="Your trusted partner for modular building solutions in the area."
        primaryButton={{
          text: 'Get a Quote',
          href: '/contact',
          variant: 'warning',
        }}
        secondaryButton={{
          text: 'Call Us',
          href: 'tel:+905376563068',
          variant: 'outline',
        }}
        variant="full-width"
        backgroundColor="navy"
      />
    </>
  )
}

// Main Page Component with Route Logic
export default async function ChildSlugPage({ params }: PageProps) {
  const { slug, childSlug } = await params

  // Check if slug is a product
  if (slug in PRODUCTS) {
    const product = PRODUCTS[slug as keyof typeof PRODUCTS]

    // Check if childSlug is a state (Product + State)
    if (childSlug in STATES) {
      return <ProductStatePage productSlug={slug} stateSlug={childSlug} />
    }

    // Check if childSlug is a product variation (Product + Variation)
    if (product.variations && product.variations.includes(childSlug)) {
      return <ProductVariationPage productSlug={slug} variationSlug={childSlug} />
    }
  }

  // Check if slug is a state and childSlug might be a city (State + City)
  if (slug in STATES) {
    return <StateCityPage stateSlug={slug} citySlug={childSlug} />
  }

  // If nothing matches, return 404
  notFound()
}

// Generate static params for known routes
export async function generateStaticParams() {
  const params: { slug: string; childSlug: string }[] = []

  // Product + State combinations
  Object.keys(PRODUCTS).forEach((productSlug) => {
    Object.keys(STATES).forEach((stateSlug) => {
      params.push({ slug: productSlug, childSlug: stateSlug })
    })
  })

  // Product + Variation combinations
  Object.entries(PRODUCTS).forEach(([productSlug, product]) => {
    if (product.variations) {
      product.variations.forEach((variation) => {
        params.push({ slug: productSlug, childSlug: variation })
      })
    }
  })

  // State + City combinations
  Object.entries(CITIES).forEach(([stateSlug, cities]) => {
    cities.forEach((city) => {
      const citySlug = city.name.toLowerCase().replace(/\s+/g, '-')
      params.push({ slug: stateSlug, childSlug: citySlug })
    })
  })

  return params
}

// Generate metadata
export async function generateMetadata({ params }: PageProps) {
  const { slug, childSlug } = await params

  // Product + State
  if (slug in PRODUCTS && childSlug in STATES) {
    const product = PRODUCTS[slug as keyof typeof PRODUCTS]
    const state = STATES[childSlug as keyof typeof STATES]
    return {
      title: `${product.name} in ${state.name} | Modular Buildings Co`,
      description: `${product.description} Professional delivery and installation throughout ${state.name}.`,
    }
  }

  // Product + Variation
  if (slug in PRODUCTS) {
    const product = PRODUCTS[slug as keyof typeof PRODUCTS]
    const variationName = childSlug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
    return {
      title: `${variationName} ${product.name} | Modular Buildings Co`,
      description: `${product.description} ${variationName} configuration available.`,
    }
  }

  // State + City
  if (slug in STATES) {
    const state = STATES[slug as keyof typeof STATES]
    const cityName = childSlug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
    return {
      title: `Modular Buildings in ${cityName}, ${state.name} | Modular Buildings Co`,
      description: `Quality modular and prefabricated buildings in ${cityName}, ${state.code}. Fast delivery and professional installation.`,
    }
  }

  return {
    title: 'Modular Buildings | Modular Buildings Co',
    description: 'Premium modular building solutions',
  }
}
