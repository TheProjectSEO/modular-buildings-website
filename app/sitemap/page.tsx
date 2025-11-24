import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sitemap | Modular Buildings Co',
  description: 'Complete sitemap of Modular Buildings Co website. Find all products, industries, locations, and resources.',
}

export default function SitemapPage() {
  const products = [
    { label: 'Portable Offices', href: '/products/portable-offices' },
    { label: 'Portable Classrooms', href: '/products/portable-classrooms' },
    { label: 'Office Trailers', href: '/products/office-trailers' },
    { label: 'Storage Containers', href: '/products/storage-containers' },
    { label: 'Portable Restrooms', href: '/products/portable-restrooms' },
    { label: 'Blast Resistant Modular Buildings', href: '/products/blast-resistant-modular' },
    { label: 'Temporary Buildings', href: '/products/temporary-buildings' },
    { label: 'Prefabricated Buildings', href: '/products/prefabricated-buildings' },
    { label: 'Modular Cabins', href: '/products/modular-cabins' },
  ]

  const industries = [
    { label: 'Healthcare', href: '/industries/healthcare' },
    { label: 'Education', href: '/industries/education' },
    { label: 'Government', href: '/industries/government' },
    { label: 'Religious Organizations', href: '/industries/religious' },
    { label: 'Construction', href: '/industries/construction' },
    { label: 'Retail', href: '/industries/retail' },
    { label: 'Events & Hospitality', href: '/industries/events-hospitality' },
    { label: 'Manufacturing', href: '/industries/manufacturing' },
    { label: 'Oil & Gas', href: '/industries/oil-gas' },
  ]

  const locations = [
    { label: 'Texas', href: '/locations/texas' },
    { label: 'California', href: '/locations/california' },
    { label: 'Florida', href: '/locations/florida' },
    { label: 'New York', href: '/locations/new-york' },
    { label: 'Pennsylvania', href: '/locations/pennsylvania' },
    { label: 'Illinois', href: '/locations/illinois' },
    { label: 'Ohio', href: '/locations/ohio' },
    { label: 'Georgia', href: '/locations/georgia' },
    { label: 'North Carolina', href: '/locations/north-carolina' },
    { label: 'Michigan', href: '/locations/michigan' },
    { label: 'New Jersey', href: '/locations/new-jersey' },
    { label: 'Virginia', href: '/locations/virginia' },
    { label: 'Washington', href: '/locations/washington' },
    { label: 'Arizona', href: '/locations/arizona' },
    { label: 'Massachusetts', href: '/locations/massachusetts' },
    { label: 'Tennessee', href: '/locations/tennessee' },
    { label: 'Indiana', href: '/locations/indiana' },
    { label: 'Missouri', href: '/locations/missouri' },
    { label: 'Maryland', href: '/locations/maryland' },
    { label: 'Wisconsin', href: '/locations/wisconsin' },
  ]

  const company = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blog', href: '/blog' },
    { label: 'Certifications', href: '/certifications' },
    { label: 'Careers', href: '/careers' },
  ]

  const resources = [
    { label: 'Used Buildings for Sale', href: '/used-buildings' },
    { label: 'Financing Options', href: '/financing' },
    { label: 'Installation Services', href: '/installation' },
    { label: 'Maintenance & Repair', href: '/maintenance' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Request a Quote', href: '/quote' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
  ]

  return (
    <div className="min-h-screen bg-mb-bg-light py-16">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold text-mb-navy mb-4">Sitemap</h1>
            <p className="text-lg text-mb-gray">
              Navigate through all pages and resources on our website
            </p>
          </div>

          {/* Sitemap Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Company Pages */}
            <div className="bg-white p-6 rounded-mb shadow-sm border border-mb-border-gray">
              <h2 className="text-xl font-bold text-mb-navy mb-4 pb-2 border-b border-mb-border-gray">
                Company
              </h2>
              <ul className="space-y-2">
                {company.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-mb-dark hover:text-mb-warning transition-colors flex items-center"
                    >
                      <span className="mr-2">›</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div className="bg-white p-6 rounded-mb shadow-sm border border-mb-border-gray">
              <h2 className="text-xl font-bold text-mb-navy mb-4 pb-2 border-b border-mb-border-gray">
                Products
              </h2>
              <ul className="space-y-2">
                {products.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-mb-dark hover:text-mb-warning transition-colors flex items-center"
                    >
                      <span className="mr-2">›</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Industries */}
            <div className="bg-white p-6 rounded-mb shadow-sm border border-mb-border-gray">
              <h2 className="text-xl font-bold text-mb-navy mb-4 pb-2 border-b border-mb-border-gray">
                Industries
              </h2>
              <ul className="space-y-2">
                {industries.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-mb-dark hover:text-mb-warning transition-colors flex items-center"
                    >
                      <span className="mr-2">›</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Locations */}
            <div className="bg-white p-6 rounded-mb shadow-sm border border-mb-border-gray">
              <h2 className="text-xl font-bold text-mb-navy mb-4 pb-2 border-b border-mb-border-gray">
                Locations (Top States)
              </h2>
              <ul className="space-y-2 max-h-96 overflow-y-auto">
                {locations.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-mb-dark hover:text-mb-warning transition-colors flex items-center"
                    >
                      <span className="mr-2">›</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="bg-white p-6 rounded-mb shadow-sm border border-mb-border-gray">
              <h2 className="text-xl font-bold text-mb-navy mb-4 pb-2 border-b border-mb-border-gray">
                Resources
              </h2>
              <ul className="space-y-2">
                {resources.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-mb-dark hover:text-mb-warning transition-colors flex items-center"
                    >
                      <span className="mr-2">›</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* XML Sitemap */}
            <div className="bg-white p-6 rounded-mb shadow-sm border border-mb-border-gray">
              <h2 className="text-xl font-bold text-mb-navy mb-4 pb-2 border-b border-mb-border-gray">
                For Search Engines
              </h2>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/sitemap.xml"
                    className="text-mb-dark hover:text-mb-warning transition-colors flex items-center"
                  >
                    <span className="mr-2">›</span>
                    XML Sitemap
                  </a>
                </li>
                <li>
                  <a
                    href="/robots.txt"
                    className="text-mb-dark hover:text-mb-warning transition-colors flex items-center"
                  >
                    <span className="mr-2">›</span>
                    Robots.txt
                  </a>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-mb-bg-light rounded">
                <p className="text-sm text-mb-gray">
                  Our XML sitemap helps search engines discover and index all pages on our website.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Note */}
          <div className="mt-12 p-6 bg-white rounded-mb shadow-sm border border-mb-border-gray">
            <h3 className="text-lg font-bold text-mb-navy mb-2">Need Help Finding Something?</h3>
            <p className="text-mb-gray mb-4">
              If you can't find what you're looking for, please contact us. Our team is here to help you
              find the perfect modular building solution for your needs.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-mb-warning text-white font-semibold rounded-mb hover:bg-mb-warning-dark transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
