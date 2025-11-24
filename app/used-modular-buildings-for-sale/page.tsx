import { HeroBanner } from '@/components/ui/HeroBanner'
import { ProductCard } from '@/components/ui/ProductCard'
import { ProductGrid } from '@/components/ui/ProductGrid'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FAQSection } from '@/components/sections/FAQSection'
import { ContentBlockSection } from '@/components/sections/ContentBlockSection'
import { InternalLinksSection } from '@/components/sections/InternalLinksSection'
import { CTASection } from '@/components/sections/CTASection'
import { ContactForm } from '@/components/forms/ContactForm'
import { PRODUCTS, STATES } from '@/lib/mockDataGenerators'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CheckCircle2,
  DollarSign,
  Clock,
  Shield,
  TrendingDown,
  Recycle,
  MapPin,
  Building2,
  Star,
  Filter,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Used Modular Buildings for Sale - Quality Pre-Owned Units',
  description: 'Browse our inventory of high-quality used modular buildings for sale. Save 40-60% on pre-owned portable offices, classrooms, and storage containers. Inspected, refurbished, and ready to deploy.',
  keywords: 'used modular buildings, pre-owned portable offices, used classrooms for sale, refurbished containers',
}

export default function UsedModularBuildingsPage() {
  // Generate mock inventory of used buildings
  const usedInventory = [
    {
      id: 'used-1',
      title: '24x60 Portable Office - Excellent Condition',
      category: 'Portable Offices',
      slug: 'portable-offices',
      condition: 'Excellent',
      year: '2020',
      location: 'Texas',
      originalPrice: '$85,000',
      salePrice: '$52,000',
      savings: '39%',
      imageUrl: getPlaceholderImage(400, 300, 'Portable Office'),
      features: ['Recently refurbished', 'New HVAC', 'Fresh paint', 'Ready to deliver'],
    },
    {
      id: 'used-2',
      title: '40ft Storage Container - Good Condition',
      category: 'Storage Containers',
      slug: 'storage-containers',
      condition: 'Good',
      year: '2019',
      location: 'California',
      originalPrice: '$12,000',
      salePrice: '$6,500',
      savings: '46%',
      imageUrl: getPlaceholderImage(400, 300, 'Storage Container'),
      features: ['Weatherproof', 'Secure locking', 'Clean interior', 'Inspected'],
    },
    {
      id: 'used-3',
      title: 'Double-Wide Classroom - Like New',
      category: 'Portable Classrooms',
      slug: 'portable-classrooms',
      condition: 'Like New',
      year: '2021',
      location: 'Florida',
      originalPrice: '$95,000',
      salePrice: '$58,000',
      savings: '39%',
      imageUrl: getPlaceholderImage(400, 300, 'Portable Classroom'),
      features: ['Low usage', 'Complete interior', 'ADA compliant', 'Warranty included'],
    },
    {
      id: 'used-4',
      title: '12x60 Office Trailer - Good Condition',
      category: 'Office Trailers',
      slug: 'office-trailers',
      condition: 'Good',
      year: '2018',
      location: 'Georgia',
      originalPrice: '$48,000',
      salePrice: '$24,000',
      savings: '50%',
      imageUrl: getPlaceholderImage(400, 300, 'Office Trailer'),
      features: ['Mobile ready', 'Functional utilities', 'Solid structure', 'Great value'],
    },
    {
      id: 'used-5',
      title: '20ft Modified Container Office - Excellent',
      category: 'Storage Containers',
      slug: 'storage-containers',
      condition: 'Excellent',
      year: '2020',
      location: 'Illinois',
      originalPrice: '$28,000',
      salePrice: '$16,500',
      savings: '41%',
      imageUrl: getPlaceholderImage(400, 300, 'Container Office'),
      features: ['Windows installed', 'Insulated', 'Electrical ready', 'Recently painted'],
    },
    {
      id: 'used-6',
      title: 'Modular Restroom Unit - Good Condition',
      category: 'Modular Restrooms',
      slug: 'restrooms',
      condition: 'Good',
      year: '2019',
      location: 'Texas',
      originalPrice: '$35,000',
      salePrice: '$19,500',
      savings: '44%',
      imageUrl: getPlaceholderImage(400, 300, 'Modular Restroom'),
      features: ['ADA compliant', 'Plumbing ready', 'Clean condition', 'Inspected'],
    },
  ]

  // Benefits of buying used
  const benefits = [
    {
      title: 'Huge Savings',
      description: 'Save 40-60% compared to new modular buildings',
      icon: <DollarSign className="w-8 h-8" />,
    },
    {
      title: 'Immediate Availability',
      description: 'In-stock units ready for quick delivery',
      icon: <Clock className="w-8 h-8" />,
    },
    {
      title: 'Quality Assured',
      description: 'All units inspected, refurbished, and certified',
      icon: <Shield className="w-8 h-8" />,
    },
    {
      title: 'Sustainable Choice',
      description: 'Environmentally friendly option that reduces waste',
      icon: <Recycle className="w-8 h-8" />,
    },
  ]

  // Why buy used
  const reasons = [
    'Significantly lower cost than new buildings',
    'Immediate availability - no manufacturing wait',
    'Same quality and durability as new',
    'Thoroughly inspected and refurbished',
    'Warranty options available',
    'Environmentally responsible choice',
    'Perfect for budget-conscious projects',
    'Ideal for temporary or short-term needs',
    'Wide variety of sizes and configurations',
    'Professional delivery and installation',
    'Financing options available',
    'Great ROI for rental or resale',
  ]

  // Buying process
  const buyingProcess = [
    {
      step: '1',
      title: 'Browse Inventory',
      description: 'Explore our current selection of used modular buildings',
    },
    {
      step: '2',
      title: 'Request Details',
      description: 'Get complete specifications, photos, and condition reports',
    },
    {
      step: '3',
      title: 'Inspection',
      description: 'Schedule a site visit or video inspection',
    },
    {
      step: '4',
      title: 'Purchase',
      description: 'Complete paperwork and arrange payment',
    },
    {
      step: '5',
      title: 'Delivery',
      description: 'We coordinate delivery and installation',
    },
  ]

  // FAQs
  const faqs = [
    {
      question: 'What condition are the used buildings in?',
      answer: 'All our used modular buildings are thoroughly inspected and graded by condition: Excellent (like-new, minimal use), Good (well-maintained, normal wear), and Fair (functional, may need cosmetic work). We provide detailed condition reports and photos for every unit.',
    },
    {
      question: 'Do used buildings come with warranties?',
      answer: 'Yes! We offer warranty options on all used buildings. Basic structural warranties are included, and extended coverage is available for purchase. The specific warranty terms depend on the age and condition of the unit.',
    },
    {
      question: 'Can I inspect the building before buying?',
      answer: 'Absolutely! We encourage inspections. You can schedule an in-person visit to our yard, or we can provide comprehensive video walkthroughs showing all aspects of the building including interior, exterior, and any cosmetic or functional issues.',
    },
    {
      question: 'How much can I save buying used?',
      answer: 'Used modular buildings typically cost 40-60% less than comparable new units. The exact savings depend on age, condition, and configuration. For example, a used office that would cost $80,000 new might sell for $35,000-$45,000 used.',
    },
    {
      question: 'Do you offer refurbishment services?',
      answer: 'Yes! We can refurbish used buildings to your specifications including new flooring, fresh paint, HVAC replacement, window upgrades, and more. This lets you customize the building while still enjoying significant savings over new construction.',
    },
    {
      question: 'What about delivery and installation?',
      answer: 'Delivery and installation services are available for all used buildings, just like new units. We handle transportation, site preparation coordination, and professional setup. Delivery costs vary by distance and building size.',
    },
    {
      question: 'Can I get financing for a used building?',
      answer: 'Yes, financing options are available for used modular buildings. We work with multiple lenders who specialize in equipment financing. Terms and rates depend on your credit profile and the specific unit.',
    },
    {
      question: 'How often does your inventory change?',
      answer: 'Our used inventory changes frequently as units sell and new trade-ins arrive. We recommend checking back often or contacting us about specific needs - we may have units coming available soon that aren\'t listed yet.',
    },
  ]

  // Related links
  const relatedLinks = Object.entries(PRODUCTS).slice(0, 6).map(([slug, data]) => ({
    title: `New ${data.name}`,
    url: `/${slug}`,
    description: `Compare prices with new ${data.name.toLowerCase()}`,
  }))

  return (
    <>
      {/* Hero Banner */}
      <HeroBanner
        title="Used Modular Buildings for Sale"
        subtitle="Quality pre-owned portable offices, classrooms, and storage containers. Save 40-60% on inspected and refurbished units ready for immediate delivery."
        backgroundImage="/placeholder-banner.jpg"
        height="lg"
        ctaButton={
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="#inventory">
              <Button variant="warning" size="lg">
                Browse Inventory
              </Button>
            </Link>
            <Link href="#contact">
              <Button variant="outline" size="lg">
                Request Info
              </Button>
            </Link>
          </div>
        }
      />

      {/* Benefits Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              Why Buy Used Modular Buildings?
            </h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              Get the same quality and functionality at a fraction of the cost
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-mb-bg-light rounded-full text-mb-navy">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-mb-dark mb-2">{benefit.title}</h3>
                <p className="text-mb-gray">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reasons.map((reason, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-mb-bg-light rounded-mb">
                <CheckCircle2 className="w-5 h-5 text-mb-warning flex-shrink-0 mt-0.5" />
                <span className="text-mb-gray font-medium">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inventory Section */}
      <section id="inventory" className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-2">
                Current Inventory
              </h2>
              <p className="text-mb-gray">
                {usedInventory.length} used modular buildings available now
              </p>
            </div>
            <Button variant="outline">
              <Filter className="w-5 h-5 mr-2" />
              Filter
            </Button>
          </div>

          <ProductGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
            {usedInventory.map(building => (
              <div key={building.id} className="relative">
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  <Badge variant="warning">SAVE {building.savings}</Badge>
                  <Badge variant="primary">{building.condition}</Badge>
                </div>
                <Link href={`/${building.slug}`}>
                  <div className="bg-white rounded-mb-lg overflow-hidden border border-mb-border-gray hover:shadow-lg transition-all">
                    <div className="relative h-48 bg-gray-200">
                      <img
                        src={building.imageUrl}
                        alt={building.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-mb-dark mb-2">{building.title}</h3>
                      <p className="text-sm text-mb-gray mb-3">
                        {building.year} • {building.location}
                      </p>
                      <div className="flex items-center gap-3 mb-4">
                        <div>
                          <div className="text-xs text-mb-gray line-through">{building.originalPrice}</div>
                          <div className="text-2xl font-bold text-mb-navy">{building.salePrice}</div>
                        </div>
                        <div className="text-mb-warning font-bold text-lg">
                          Save {building.savings}
                        </div>
                      </div>
                      <div className="space-y-1 mb-4">
                        {building.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-mb-warning flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-mb-gray">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button variant="primary" size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </ProductGrid>

          <div className="text-center mt-12">
            <p className="text-mb-gray mb-4">
              Don't see what you're looking for? We're getting new inventory regularly.
            </p>
            <Button variant="warning" size="lg">
              Request Custom Search
            </Button>
          </div>
        </div>
      </section>

      {/* Buying Process */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              How to Buy
            </h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              Simple, transparent process from browsing to delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {buyingProcess.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-mb-navy text-white rounded-full text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-mb-dark mb-2">{item.title}</h3>
                <p className="text-sm text-mb-gray">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison: New vs Used */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              New vs. Used Comparison
            </h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              Understand the difference to make the best choice for your project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-mb-lg">
              <h3 className="text-2xl font-bold text-mb-dark mb-6">New Buildings</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-mb-warning flex-shrink-0 mt-0.5" />
                  <span className="text-mb-gray">Fully customizable</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-mb-warning flex-shrink-0 mt-0.5" />
                  <span className="text-mb-gray">Latest features and materials</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-mb-warning flex-shrink-0 mt-0.5" />
                  <span className="text-mb-gray">Full manufacturer warranty</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-mb-warning flex-shrink-0 mt-0.5" />
                  <span className="text-mb-gray">4-8 week lead time</span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingDown className="w-5 h-5 text-mb-gray flex-shrink-0 mt-0.5" />
                  <span className="text-mb-gray">Higher upfront cost</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-mb-bg-light rounded-mb">
                <div className="text-sm text-mb-gray">Typical Price Range</div>
                <div className="text-2xl font-bold text-mb-dark">$50,000 - $150,000</div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-mb-lg border-2 border-mb-warning">
              <h3 className="text-2xl font-bold text-mb-dark mb-6">Used Buildings</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-mb-warning flex-shrink-0 mt-0.5" />
                  <span className="text-mb-gray">40-60% cost savings</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-mb-warning flex-shrink-0 mt-0.5" />
                  <span className="text-mb-gray">Immediate availability</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-mb-warning flex-shrink-0 mt-0.5" />
                  <span className="text-mb-gray">Inspected and certified</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-mb-warning flex-shrink-0 mt-0.5" />
                  <span className="text-mb-gray">Warranty options available</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-mb-warning flex-shrink-0 mt-0.5" />
                  <span className="text-mb-gray">Environmentally friendly</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-mb-warning/10 rounded-mb border-l-4 border-mb-warning">
                <div className="text-sm text-mb-gray">Typical Price Range</div>
                <div className="text-2xl font-bold text-mb-dark">$20,000 - $75,000</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <ContentBlockSection
        title="Quality Pre-Owned Modular Buildings"
        content={`
          <p class="mb-4">Buying used modular buildings is a smart financial decision that doesn't compromise on quality. All our pre-owned units undergo thorough inspection and refurbishment to ensure they meet our high standards. You get the same functionality and durability as new buildings at a fraction of the cost.</p>

          <h3 class="text-xl font-bold mt-6 mb-3">Inspection and Certification</h3>
          <p class="mb-4">Every used building is comprehensively inspected by our certified technicians. We check structural integrity, roof condition, wall systems, flooring, doors, windows, electrical systems, and HVAC. Any issues are repaired or clearly disclosed in the listing.</p>

          <h3 class="text-xl font-bold mt-6 mb-3">Refurbishment Services</h3>
          <p class="mb-4">Want to customize a used building? We offer complete refurbishment services including interior remodeling, new flooring, fresh paint, HVAC replacement, window upgrades, and more. This lets you get exactly what you need while still enjoying substantial savings.</p>

          <h3 class="text-xl font-bold mt-6 mb-3">Perfect for Many Applications</h3>
          <p>Used modular buildings are ideal for temporary projects, budget-conscious organizations, startups, rental properties, or any situation where immediate availability and cost savings are priorities. They work perfectly for construction site offices, storage, classrooms, and more.</p>
        `}
        backgroundColor="white"
      />

      {/* FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        subtitle="Common questions about buying used modular buildings"
        questions={faqs}
        className="bg-mb-bg-light"
      />

      {/* Contact Form */}
      <section id="contact" className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
                Inquire About Used Buildings
              </h2>
              <p className="text-lg text-mb-gray">
                Contact us about current inventory or request a custom search
              </p>
            </div>

            <div className="bg-mb-bg-light p-8 md:p-12 rounded-mb-lg">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <InternalLinksSection
        title="Compare with New Buildings"
        subtitle="See our new modular building options"
        links={relatedLinks}
        columns={3}
        showIcon={true}
      />

      {/* CTA Section */}
      <CTASection
        title="Find Your Perfect Used Building"
        description="Browse our current inventory or contact us to be notified when units matching your requirements become available. Our team is here to help you find the perfect used modular building for your needs and budget."
        primaryButton={{
          text: 'Browse Inventory',
          href: '#inventory',
          variant: 'warning',
        }}
        secondaryButton={{
          text: 'Request Custom Search',
          href: '#contact',
          variant: 'outline',
        }}
        variant="full-width"
        backgroundColor="navy"
      />
    </>
  )
}
