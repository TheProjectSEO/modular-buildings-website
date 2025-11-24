/**
 * Site Navigation Configuration
 *
 * This file centralizes all navigation links used throughout the site
 * including header, footer, and sitemap generation.
 */

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export const products = [
  { label: 'Modular Office Buildings', href: '/modular-office-building' },
  { label: 'Modular Classrooms', href: '/modular-classrooms' },
  { label: 'Used Modular Buildings', href: '/used-modular-buildings' },
]

export const industries = [
  { label: 'Healthcare', href: '/industries/medical' },
  { label: 'Education', href: '/industries/education' },
  { label: 'Government', href: '/industries/government' },
  { label: 'Religious Organizations', href: '/industries/religion' },
  { label: 'Construction', href: '/industries/construction' },
  { label: 'Retail', href: '/industries/retail' },
  { label: 'Events & Hospitality', href: '/industries/events-hospitality' },
  { label: 'Manufacturing', href: '/industries/manufacturing' },
  { label: 'Oil & Gas', href: '/industries/oil-gas' },
]

export const locations = [
  { label: 'Texas', href: '/location/texas' },
  { label: 'California', href: '/location/california' },
  { label: 'Florida', href: '/location/florida' },
  { label: 'New York', href: '/location/new-york' },
  { label: 'Pennsylvania', href: '/location/pennsylvania' },
  { label: 'Illinois', href: '/location/illinois' },
  { label: 'Ohio', href: '/location/ohio' },
  { label: 'Georgia', href: '/location/georgia' },
  { label: 'North Carolina', href: '/location/north-carolina' },
  { label: 'Michigan', href: '/location/michigan' },
  { label: 'New Jersey', href: '/location/new-jersey' },
  { label: 'Virginia', href: '/location/virginia' },
  { label: 'Washington', href: '/location/washington' },
  { label: 'Arizona', href: '/location/arizona' },
  { label: 'Massachusetts', href: '/location/massachusetts' },
  { label: 'Tennessee', href: '/location/tennessee' },
  { label: 'Indiana', href: '/location/indiana' },
  { label: 'Missouri', href: '/location/missouri' },
  { label: 'Maryland', href: '/location/maryland' },
  { label: 'Wisconsin', href: '/location/wisconsin' },
  { label: 'Colorado', href: '/location/colorado' },
  { label: 'Minnesota', href: '/location/minnesota' },
  { label: 'South Carolina', href: '/location/south-carolina' },
  { label: 'Alabama', href: '/location/alabama' },
  { label: 'Louisiana', href: '/location/louisiana' },
]

export const company = [
  { label: 'About Us', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
  { label: 'Blog', href: '/blog' },
  { label: 'Certifications', href: '/certifications' },
  { label: 'Careers', href: '/careers' },
]

export const resources = [
  { label: 'Used Modular Buildings', href: '/used-modular-buildings' },
  { label: 'Financing Options', href: '/financing' },
  { label: 'Installation Services', href: '/installation' },
  { label: 'Maintenance & Repair', href: '/maintenance' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Request a Quote', href: '/quote' },
]

// Main navigation for header (with dropdowns)
export const mainNavigation: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Products',
    href: '/modular-office-building',
    children: products,
  },
  {
    label: 'Industries',
    href: '/industries',
    children: industries,
  },
  {
    label: 'Locations',
    href: '/location',
    children: locations.slice(0, 10), // Top 10 locations for header dropdown
  },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

// All locations for sitemap and footer
export const allStates = [
  'texas',
  'california',
  'florida',
  'new-york',
  'pennsylvania',
  'illinois',
  'ohio',
  'georgia',
  'north-carolina',
  'michigan',
  'new-jersey',
  'virginia',
  'washington',
  'arizona',
  'massachusetts',
  'tennessee',
  'indiana',
  'missouri',
  'maryland',
  'wisconsin',
  'colorado',
  'minnesota',
  'south-carolina',
  'alabama',
  'louisiana',
  'kentucky',
  'oregon',
  'oklahoma',
  'connecticut',
  'utah',
  'iowa',
  'nevada',
  'arkansas',
  'mississippi',
  'kansas',
  'new-mexico',
  'nebraska',
  'west-virginia',
  'idaho',
  'hawaii',
  'new-hampshire',
  'maine',
  'montana',
  'rhode-island',
  'delaware',
  'south-dakota',
  'north-dakota',
  'alaska',
  'vermont',
  'wyoming',
]

// Major cities for sitemap
export const majorCities = [
  // Texas
  { state: 'texas', city: 'houston', label: 'Houston, TX' },
  { state: 'texas', city: 'dallas', label: 'Dallas, TX' },
  { state: 'texas', city: 'austin', label: 'Austin, TX' },
  { state: 'texas', city: 'san-antonio', label: 'San Antonio, TX' },
  { state: 'texas', city: 'fort-worth', label: 'Fort Worth, TX' },
  // California
  { state: 'california', city: 'los-angeles', label: 'Los Angeles, CA' },
  { state: 'california', city: 'san-diego', label: 'San Diego, CA' },
  { state: 'california', city: 'san-jose', label: 'San Jose, CA' },
  { state: 'california', city: 'san-francisco', label: 'San Francisco, CA' },
  { state: 'california', city: 'fresno', label: 'Fresno, CA' },
  // Florida
  { state: 'florida', city: 'jacksonville', label: 'Jacksonville, FL' },
  { state: 'florida', city: 'miami', label: 'Miami, FL' },
  { state: 'florida', city: 'tampa', label: 'Tampa, FL' },
  { state: 'florida', city: 'orlando', label: 'Orlando, FL' },
  { state: 'florida', city: 'st-petersburg', label: 'St. Petersburg, FL' },
  // New York
  { state: 'new-york', city: 'new-york-city', label: 'New York City, NY' },
  { state: 'new-york', city: 'buffalo', label: 'Buffalo, NY' },
  { state: 'new-york', city: 'rochester', label: 'Rochester, NY' },
  { state: 'new-york', city: 'yonkers', label: 'Yonkers, NY' },
  { state: 'new-york', city: 'syracuse', label: 'Syracuse, NY' },
]

// Static pages for sitemap
export const staticPages = [
  { path: '', label: 'Home', priority: 1.0 },
  { path: '/about', label: 'About Us', priority: 0.8 },
  { path: '/contact', label: 'Contact', priority: 0.8 },
  { path: '/projects', label: 'Projects', priority: 0.8 },
  { path: '/blog', label: 'Blog', priority: 0.7 },
  { path: '/certifications', label: 'Certifications', priority: 0.6 },
  { path: '/careers', label: 'Careers', priority: 0.6 },
  { path: '/used-modular-buildings', label: 'Used Modular Buildings', priority: 0.7 },
  { path: '/financing', label: 'Financing Options', priority: 0.6 },
  { path: '/installation', label: 'Installation Services', priority: 0.6 },
  { path: '/maintenance', label: 'Maintenance & Repair', priority: 0.6 },
  { path: '/faqs', label: 'FAQs', priority: 0.7 },
  { path: '/quote', label: 'Request a Quote', priority: 0.9 },
  { path: '/privacy-policy', label: 'Privacy Policy', priority: 0.3 },
  { path: '/terms-of-service', label: 'Terms of Service', priority: 0.3 },
  { path: '/sitemap', label: 'Sitemap', priority: 0.5 },
]
