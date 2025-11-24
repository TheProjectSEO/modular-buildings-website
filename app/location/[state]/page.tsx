import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { ProductCard } from '@/components/ui/ProductCard'
import { ProductGrid } from '@/components/ui/ProductGrid'
import { FAQSection, FAQItem } from '@/components/sections/FAQSection'
import { CTASection } from '@/components/sections/CTASection'
import { ContactForm } from '@/components/forms/ContactForm'
import { getPageBySlug, type Page, type FAQ, type StructuredData } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail, Building2, Truck, Clock, Shield, CheckCircle, ArrowRight } from 'lucide-react'
import { getPlaceholderImage } from '@/lib/placeholder-image'

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

// Helper to merge database FAQs with static FAQs
function mergeFAQs(
  dbFaqs: FAQ[] | undefined,
  staticFaqs: FAQItem[]
): FAQItem[] {
  if (dbFaqs && dbFaqs.length > 0) {
    return dbFaqs
      .filter((faq) => faq.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((faq) => ({ question: faq.question, answer: faq.answer }))
  }
  return staticFaqs
}

interface StatePageProps {
  params: {
    state: string
  }
}

interface StateData {
  name: string
  slug: string
  abbreviation: string
  description: string
  longDescription: string
  majorCities: { name: string; slug: string; population: string }[]
  imageUrl: string
  bannerUrl: string
  regionalPhone: string
  regionalEmail: string
  deliveryTime: string
  projectsCompleted: number
}

const stateDataMap: Record<string, StateData> = {
  'texas': {
    name: 'Texas',
    slug: 'texas',
    abbreviation: 'TX',
    description: 'Premium modular buildings and prefabricated structures for Texas businesses and residents.',
    longDescription: 'Modular Buildings Co has been serving Texas for over a decade, providing high-quality modular buildings to businesses, schools, healthcare facilities, and residential customers across the Lone Star State. From the bustling metro areas of Houston and Dallas to the growing communities throughout Texas, we deliver durable, cost-effective modular solutions designed to withstand Texas weather conditions.',
    majorCities: [
      { name: 'Houston', slug: 'houston', population: '2.3M' },
      { name: 'Dallas', slug: 'dallas', population: '1.3M' },
      { name: 'Austin', slug: 'austin', population: '1.0M' },
      { name: 'San Antonio', slug: 'san-antonio', population: '1.5M' },
      { name: 'Fort Worth', slug: 'fort-worth', population: '918K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'Texas'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Texas'),
    regionalPhone: '1-800-MODULAR-TX',
    regionalEmail: 'texas@modular-buildings.co',
    deliveryTime: '2-3 weeks',
    projectsCompleted: 450
  },
  'california': {
    name: 'California',
    slug: 'california',
    abbreviation: 'CA',
    description: 'Seismic-compliant modular buildings and sustainable prefab solutions for California.',
    longDescription: 'California demands the highest standards in construction, and Modular Buildings Co delivers. Our modular buildings are engineered to meet California seismic requirements and energy efficiency standards. From Silicon Valley tech campuses to Southern California schools, we provide sustainable, code-compliant modular solutions that help California businesses and communities build faster and smarter.',
    majorCities: [
      { name: 'Los Angeles', slug: 'los-angeles', population: '4.0M' },
      { name: 'San Francisco', slug: 'san-francisco', population: '874K' },
      { name: 'San Diego', slug: 'san-diego', population: '1.4M' },
      { name: 'San Jose', slug: 'san-jose', population: '1.0M' },
      { name: 'Sacramento', slug: 'sacramento', population: '524K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'California'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings California'),
    regionalPhone: '1-800-MODULAR-CA',
    regionalEmail: 'california@modular-buildings.co',
    deliveryTime: '2-4 weeks',
    projectsCompleted: 380
  },
  'florida': {
    name: 'Florida',
    slug: 'florida',
    abbreviation: 'FL',
    description: 'Hurricane-resistant modular buildings designed for Florida climate and conditions.',
    longDescription: 'Florida presents unique building challenges, and Modular Buildings Co rises to meet them. Our modular buildings are engineered to withstand hurricane-force winds and Florida humidity. We serve the entire Sunshine State, from Miami to Jacksonville, providing durable, weather-resistant modular solutions for commercial, educational, and residential applications.',
    majorCities: [
      { name: 'Miami', slug: 'miami', population: '467K' },
      { name: 'Orlando', slug: 'orlando', population: '307K' },
      { name: 'Tampa', slug: 'tampa', population: '387K' },
      { name: 'Jacksonville', slug: 'jacksonville', population: '949K' },
      { name: 'Fort Lauderdale', slug: 'fort-lauderdale', population: '182K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'Florida'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Florida'),
    regionalPhone: '1-800-MODULAR-FL',
    regionalEmail: 'florida@modular-buildings.co',
    deliveryTime: '2-3 weeks',
    projectsCompleted: 320
  },
  'new-york': {
    name: 'New York',
    slug: 'new-york',
    abbreviation: 'NY',
    description: 'Premium modular construction solutions for New York City and throughout New York State.',
    longDescription: 'New York demands quality, efficiency, and innovation in construction. Modular Buildings Co delivers modular buildings that meet New York building codes and the demanding requirements of urban and suburban projects. From Manhattan commercial spaces to upstate educational facilities, we provide turnkey modular solutions that save time and reduce construction disruption.',
    majorCities: [
      { name: 'New York City', slug: 'new-york-city', population: '8.3M' },
      { name: 'Buffalo', slug: 'buffalo', population: '278K' },
      { name: 'Albany', slug: 'albany', population: '99K' },
      { name: 'Rochester', slug: 'rochester', population: '211K' },
      { name: 'Syracuse', slug: 'syracuse', population: '148K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'New York'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings New York'),
    regionalPhone: '1-800-MODULAR-NY',
    regionalEmail: 'newyork@modular-buildings.co',
    deliveryTime: '2-4 weeks',
    projectsCompleted: 290
  },
  'pennsylvania': {
    name: 'Pennsylvania',
    slug: 'pennsylvania',
    abbreviation: 'PA',
    description: 'Quality modular buildings for Philadelphia, Pittsburgh, and communities across Pennsylvania.',
    longDescription: 'Pennsylvania businesses and institutions trust Modular Buildings Co for reliable modular building solutions. We serve the entire Commonwealth, from the urban centers of Philadelphia and Pittsburgh to growing communities in between. Our modular structures are designed to handle Pennsylvania seasons and built to meet state and local building codes.',
    majorCities: [
      { name: 'Philadelphia', slug: 'philadelphia', population: '1.6M' },
      { name: 'Pittsburgh', slug: 'pittsburgh', population: '302K' },
      { name: 'Allentown', slug: 'allentown', population: '125K' },
      { name: 'Erie', slug: 'erie', population: '94K' },
      { name: 'Harrisburg', slug: 'harrisburg', population: '50K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'Pennsylvania'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Pennsylvania'),
    regionalPhone: '1-800-MODULAR-PA',
    regionalEmail: 'pennsylvania@modular-buildings.co',
    deliveryTime: '2-3 weeks',
    projectsCompleted: 210
  },
  'illinois': {
    name: 'Illinois',
    slug: 'illinois',
    abbreviation: 'IL',
    description: 'Innovative modular building solutions for Chicago and communities throughout Illinois.',
    longDescription: 'Illinois is home to diverse industries and communities, all of which benefit from Modular Buildings Co modular building solutions. From downtown Chicago commercial projects to suburban schools and rural facilities, we provide versatile, code-compliant modular structures designed to meet Illinois building requirements and climate conditions.',
    majorCities: [
      { name: 'Chicago', slug: 'chicago', population: '2.7M' },
      { name: 'Springfield', slug: 'springfield', population: '114K' },
      { name: 'Aurora', slug: 'aurora', population: '180K' },
      { name: 'Naperville', slug: 'naperville', population: '149K' },
      { name: 'Rockford', slug: 'rockford', population: '148K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'Illinois'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Illinois'),
    regionalPhone: '1-800-MODULAR-IL',
    regionalEmail: 'illinois@modular-buildings.co',
    deliveryTime: '2-3 weeks',
    projectsCompleted: 245
  },
  'ohio': {
    name: 'Ohio',
    slug: 'ohio',
    abbreviation: 'OH',
    description: 'Modular buildings for Columbus, Cleveland, Cincinnati, and communities throughout Ohio.',
    longDescription: 'Ohio businesses and communities choose Modular Buildings Co for dependable modular construction. We serve the entire Buckeye State with quality prefabricated buildings suitable for offices, classrooms, healthcare facilities, and more. Our team understands Ohio building codes and delivers structures built to last through Ohio seasons.',
    majorCities: [
      { name: 'Columbus', slug: 'columbus', population: '905K' },
      { name: 'Cleveland', slug: 'cleveland', population: '372K' },
      { name: 'Cincinnati', slug: 'cincinnati', population: '309K' },
      { name: 'Toledo', slug: 'toledo', population: '270K' },
      { name: 'Akron', slug: 'akron', population: '190K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'Ohio'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Ohio'),
    regionalPhone: '1-800-MODULAR-OH',
    regionalEmail: 'ohio@modular-buildings.co',
    deliveryTime: '2-3 weeks',
    projectsCompleted: 198
  },
  'georgia': {
    name: 'Georgia',
    slug: 'georgia',
    abbreviation: 'GA',
    description: 'Premium prefabricated structures for Atlanta, Savannah, and the entire state of Georgia.',
    longDescription: 'Georgia growing economy demands flexible, fast construction solutions. Modular Buildings Co delivers modular buildings throughout the Peach State, from Atlanta business parks to coastal Savannah developments. Our structures are designed for Georgia climate conditions and built to meet state building codes.',
    majorCities: [
      { name: 'Atlanta', slug: 'atlanta', population: '498K' },
      { name: 'Savannah', slug: 'savannah', population: '147K' },
      { name: 'Augusta', slug: 'augusta', population: '202K' },
      { name: 'Columbus', slug: 'columbus-ga', population: '206K' },
      { name: 'Macon', slug: 'macon', population: '157K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'Georgia'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Georgia'),
    regionalPhone: '1-800-MODULAR-GA',
    regionalEmail: 'georgia@modular-buildings.co',
    deliveryTime: '2-3 weeks',
    projectsCompleted: 176
  },
  'north-carolina': {
    name: 'North Carolina',
    slug: 'north-carolina',
    abbreviation: 'NC',
    description: 'Quality modular construction for Charlotte, Raleigh, Durham, and all of North Carolina.',
    longDescription: 'North Carolina rapid growth creates demand for efficient construction solutions. Modular Buildings Co serves the Tar Heel State with premium modular buildings for businesses, schools, and healthcare facilities. From the Research Triangle to Charlotte business district, we deliver quality modular structures on time and on budget.',
    majorCities: [
      { name: 'Charlotte', slug: 'charlotte', population: '874K' },
      { name: 'Raleigh', slug: 'raleigh', population: '467K' },
      { name: 'Durham', slug: 'durham', population: '283K' },
      { name: 'Greensboro', slug: 'greensboro', population: '299K' },
      { name: 'Winston-Salem', slug: 'winston-salem', population: '249K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'North Carolina'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings NC'),
    regionalPhone: '1-800-MODULAR-NC',
    regionalEmail: 'northcarolina@modular-buildings.co',
    deliveryTime: '2-3 weeks',
    projectsCompleted: 165
  },
  'michigan': {
    name: 'Michigan',
    slug: 'michigan',
    abbreviation: 'MI',
    description: 'Durable modular building solutions for Detroit, Grand Rapids, and throughout Michigan.',
    longDescription: 'Michigan businesses trust Modular Buildings Co for modular buildings that stand up to Great Lakes weather. We serve the entire state, from Detroit industrial facilities to Grand Rapids commercial spaces. Our modular structures are engineered for Michigan climate conditions and built to exceed state building code requirements.',
    majorCities: [
      { name: 'Detroit', slug: 'detroit', population: '639K' },
      { name: 'Grand Rapids', slug: 'grand-rapids', population: '198K' },
      { name: 'Ann Arbor', slug: 'ann-arbor', population: '123K' },
      { name: 'Lansing', slug: 'lansing', population: '118K' },
      { name: 'Flint', slug: 'flint', population: '97K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'Michigan'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Michigan'),
    regionalPhone: '1-800-MODULAR-MI',
    regionalEmail: 'michigan@modular-buildings.co',
    deliveryTime: '2-3 weeks',
    projectsCompleted: 154
  },
  'new-jersey': {
    name: 'New Jersey',
    slug: 'new-jersey',
    abbreviation: 'NJ',
    description: 'Modular buildings for Newark, Jersey City, and communities throughout New Jersey.',
    longDescription: 'New Jersey densely populated areas and strict building codes require experienced modular construction partners. Modular Buildings Co delivers quality prefabricated buildings throughout the Garden State, from urban Newark developments to suburban commercial projects. Our modular solutions help New Jersey businesses build faster without compromising on quality.',
    majorCities: [
      { name: 'Newark', slug: 'newark', population: '311K' },
      { name: 'Jersey City', slug: 'jersey-city', population: '292K' },
      { name: 'Trenton', slug: 'trenton', population: '90K' },
      { name: 'Atlantic City', slug: 'atlantic-city', population: '38K' },
      { name: 'Princeton', slug: 'princeton', population: '31K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'New Jersey'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings NJ'),
    regionalPhone: '1-800-MODULAR-NJ',
    regionalEmail: 'newjersey@modular-buildings.co',
    deliveryTime: '2-3 weeks',
    projectsCompleted: 142
  },
  'virginia': {
    name: 'Virginia',
    slug: 'virginia',
    abbreviation: 'VA',
    description: 'Premium modular structures for Virginia Beach, Richmond, Norfolk, and all of Virginia.',
    longDescription: 'Virginia diverse landscape from coastal regions to mountain communities all benefit from Modular Buildings Co modular building solutions. We serve government contractors, businesses, and educational institutions throughout the Commonwealth with quality prefabricated structures that meet Virginia building standards.',
    majorCities: [
      { name: 'Virginia Beach', slug: 'virginia-beach', population: '459K' },
      { name: 'Richmond', slug: 'richmond', population: '226K' },
      { name: 'Norfolk', slug: 'norfolk', population: '238K' },
      { name: 'Arlington', slug: 'arlington', population: '238K' },
      { name: 'Alexandria', slug: 'alexandria', population: '159K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'Virginia'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Virginia'),
    regionalPhone: '1-800-MODULAR-VA',
    regionalEmail: 'virginia@modular-buildings.co',
    deliveryTime: '2-3 weeks',
    projectsCompleted: 138
  },
  'washington': {
    name: 'Washington',
    slug: 'washington',
    abbreviation: 'WA',
    description: 'Innovative modular building solutions for Seattle, Tacoma, and throughout Washington State.',
    longDescription: 'Washington State innovation-driven economy demands forward-thinking construction solutions. Modular Buildings Co delivers sustainable, energy-efficient modular buildings from Seattle to Spokane. Our structures are designed for Pacific Northwest conditions and built to meet Washington strict environmental and building code standards.',
    majorCities: [
      { name: 'Seattle', slug: 'seattle', population: '749K' },
      { name: 'Tacoma', slug: 'tacoma', population: '219K' },
      { name: 'Spokane', slug: 'spokane', population: '228K' },
      { name: 'Vancouver', slug: 'vancouver-wa', population: '190K' },
      { name: 'Bellevue', slug: 'bellevue', population: '151K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'Washington'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Washington'),
    regionalPhone: '1-800-MODULAR-WA',
    regionalEmail: 'washington@modular-buildings.co',
    deliveryTime: '3-4 weeks',
    projectsCompleted: 125
  },
  'arizona': {
    name: 'Arizona',
    slug: 'arizona',
    abbreviation: 'AZ',
    description: 'Climate-optimized modular buildings for Phoenix, Tucson, and all Arizona locations.',
    longDescription: 'Arizona extreme heat demands specially engineered building solutions. Modular Buildings Co delivers modular buildings designed for desert conditions, with enhanced insulation and climate control systems. From Phoenix metro area to Tucson and beyond, we provide durable, energy-efficient prefabricated structures that perform in Arizona unique environment.',
    majorCities: [
      { name: 'Phoenix', slug: 'phoenix', population: '1.6M' },
      { name: 'Tucson', slug: 'tucson', population: '542K' },
      { name: 'Mesa', slug: 'mesa', population: '504K' },
      { name: 'Scottsdale', slug: 'scottsdale', population: '241K' },
      { name: 'Chandler', slug: 'chandler', population: '275K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'Arizona'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Arizona'),
    regionalPhone: '1-800-MODULAR-AZ',
    regionalEmail: 'arizona@modular-buildings.co',
    deliveryTime: '2-3 weeks',
    projectsCompleted: 118
  },
  'massachusetts': {
    name: 'Massachusetts',
    slug: 'massachusetts',
    abbreviation: 'MA',
    description: 'Premium modular buildings for Boston, Worcester, and communities throughout Massachusetts.',
    longDescription: 'Massachusetts historic communities and growing business centers benefit from Modular Buildings Co innovative modular solutions. We deliver quality prefabricated buildings that meet strict New England building codes and are designed to withstand Massachusetts harsh winters. From Boston commercial projects to suburban educational facilities, we serve the entire Bay State.',
    majorCities: [
      { name: 'Boston', slug: 'boston', population: '675K' },
      { name: 'Worcester', slug: 'worcester', population: '206K' },
      { name: 'Springfield', slug: 'springfield-ma', population: '155K' },
      { name: 'Cambridge', slug: 'cambridge', population: '118K' },
      { name: 'Lowell', slug: 'lowell', population: '115K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'Massachusetts'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Massachusetts'),
    regionalPhone: '1-800-MODULAR-MA',
    regionalEmail: 'massachusetts@modular-buildings.co',
    deliveryTime: '2-4 weeks',
    projectsCompleted: 132
  },
  'tennessee': {
    name: 'Tennessee',
    slug: 'tennessee',
    abbreviation: 'TN',
    description: 'Quality modular buildings for Nashville, Memphis, and all of Tennessee.',
    longDescription: 'Tennessee growing economy creates strong demand for efficient modular construction. Modular Buildings Co serves the Volunteer State with quality prefabricated structures for businesses, schools, and healthcare facilities. From Nashville entertainment district to Memphis industrial centers, we deliver modular buildings built for Tennessee conditions.',
    majorCities: [
      { name: 'Nashville', slug: 'nashville', population: '689K' },
      { name: 'Memphis', slug: 'memphis', population: '633K' },
      { name: 'Knoxville', slug: 'knoxville', population: '190K' },
      { name: 'Chattanooga', slug: 'chattanooga', population: '181K' },
      { name: 'Clarksville', slug: 'clarksville', population: '166K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'Tennessee'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Tennessee'),
    regionalPhone: '1-800-MODULAR-TN',
    regionalEmail: 'tennessee@modular-buildings.co',
    deliveryTime: '2-3 weeks',
    projectsCompleted: 145
  },
  'indiana': {
    name: 'Indiana',
    slug: 'indiana',
    abbreviation: 'IN',
    description: 'Modular building solutions for Indianapolis, Fort Wayne, and throughout Indiana.',
    longDescription: 'Indiana central location and strong manufacturing heritage make it ideal for modular building adoption. Modular Buildings Co serves the Hoosier State with quality prefabricated structures designed to meet Indiana building codes and climate requirements. From Indianapolis commercial centers to rural agricultural facilities, we deliver throughout Indiana.',
    majorCities: [
      { name: 'Indianapolis', slug: 'indianapolis', population: '887K' },
      { name: 'Fort Wayne', slug: 'fort-wayne', population: '264K' },
      { name: 'Evansville', slug: 'evansville', population: '117K' },
      { name: 'South Bend', slug: 'south-bend', population: '103K' },
      { name: 'Carmel', slug: 'carmel', population: '99K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'Indiana'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Indiana'),
    regionalPhone: '1-800-MODULAR-IN',
    regionalEmail: 'indiana@modular-buildings.co',
    deliveryTime: '2-3 weeks',
    projectsCompleted: 128
  },
  'missouri': {
    name: 'Missouri',
    slug: 'missouri',
    abbreviation: 'MO',
    description: 'Premium prefabricated structures for St. Louis, Kansas City, and all of Missouri.',
    longDescription: 'Missouri strategic Midwest location makes it a hub for commerce and industry. Modular Buildings Co serves the Show-Me State with quality modular buildings designed for Missouri variable climate. From St. Louis metropolitan area to Kansas City and communities throughout Missouri, we deliver professional modular construction solutions.',
    majorCities: [
      { name: 'Kansas City', slug: 'kansas-city', population: '508K' },
      { name: 'St. Louis', slug: 'st-louis', population: '301K' },
      { name: 'Springfield', slug: 'springfield-mo', population: '169K' },
      { name: 'Columbia', slug: 'columbia-mo', population: '126K' },
      { name: 'Independence', slug: 'independence', population: '123K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'Missouri'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Missouri'),
    regionalPhone: '1-800-MODULAR-MO',
    regionalEmail: 'missouri@modular-buildings.co',
    deliveryTime: '2-3 weeks',
    projectsCompleted: 115
  },
  'maryland': {
    name: 'Maryland',
    slug: 'maryland',
    abbreviation: 'MD',
    description: 'Modular buildings for Baltimore, Annapolis, and communities throughout Maryland.',
    longDescription: 'Maryland proximity to the nation capital creates unique opportunities for modular construction. Modular Buildings Co serves the Old Line State with quality prefabricated buildings for government contractors, businesses, and educational institutions. Our modular structures meet Maryland building codes and are designed for mid-Atlantic weather conditions.',
    majorCities: [
      { name: 'Baltimore', slug: 'baltimore', population: '585K' },
      { name: 'Frederick', slug: 'frederick', population: '78K' },
      { name: 'Rockville', slug: 'rockville', population: '68K' },
      { name: 'Gaithersburg', slug: 'gaithersburg', population: '68K' },
      { name: 'Annapolis', slug: 'annapolis', population: '40K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'Maryland'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Maryland'),
    regionalPhone: '1-800-MODULAR-MD',
    regionalEmail: 'maryland@modular-buildings.co',
    deliveryTime: '2-3 weeks',
    projectsCompleted: 108
  },
  'wisconsin': {
    name: 'Wisconsin',
    slug: 'wisconsin',
    abbreviation: 'WI',
    description: 'Cold-climate modular buildings for Milwaukee, Madison, and all Wisconsin locations.',
    longDescription: 'Wisconsin harsh winters demand specially engineered building solutions. Modular Buildings Co delivers modular structures with enhanced insulation and climate control systems designed for Wisconsin extreme temperatures. From Milwaukee industrial facilities to Madison educational campuses, we serve the entire Badger State.',
    majorCities: [
      { name: 'Milwaukee', slug: 'milwaukee', population: '577K' },
      { name: 'Madison', slug: 'madison', population: '269K' },
      { name: 'Green Bay', slug: 'green-bay', population: '107K' },
      { name: 'Kenosha', slug: 'kenosha', population: '99K' },
      { name: 'Racine', slug: 'racine', population: '77K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'Wisconsin'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Wisconsin'),
    regionalPhone: '1-800-MODULAR-WI',
    regionalEmail: 'wisconsin@modular-buildings.co',
    deliveryTime: '2-4 weeks',
    projectsCompleted: 98
  },
  'colorado': {
    name: 'Colorado',
    slug: 'colorado',
    abbreviation: 'CO',
    description: 'High-altitude modular buildings for Denver, Colorado Springs, and throughout Colorado.',
    longDescription: 'Colorado unique mountain climate and altitude present special building challenges. Modular Buildings Co delivers modular structures engineered for Colorado conditions, from Denver urban developments to mountain resort communities. Our buildings are designed to handle Colorado extreme temperature variations and heavy snow loads.',
    majorCities: [
      { name: 'Denver', slug: 'denver', population: '715K' },
      { name: 'Colorado Springs', slug: 'colorado-springs', population: '478K' },
      { name: 'Aurora', slug: 'aurora-co', population: '386K' },
      { name: 'Fort Collins', slug: 'fort-collins', population: '169K' },
      { name: 'Boulder', slug: 'boulder', population: '105K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'Colorado'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Colorado'),
    regionalPhone: '1-800-MODULAR-CO',
    regionalEmail: 'colorado@modular-buildings.co',
    deliveryTime: '2-4 weeks',
    projectsCompleted: 112
  },
  'minnesota': {
    name: 'Minnesota',
    slug: 'minnesota',
    abbreviation: 'MN',
    description: 'Winter-ready modular buildings for Minneapolis, St. Paul, and all of Minnesota.',
    longDescription: 'Minnesota extreme winters demand the highest standards in building construction. Modular Buildings Co delivers modular structures with superior insulation and energy efficiency, designed specifically for Minnesota brutal cold. From the Twin Cities metropolitan area to communities throughout the Land of 10,000 Lakes, we provide reliable modular solutions.',
    majorCities: [
      { name: 'Minneapolis', slug: 'minneapolis', population: '429K' },
      { name: 'St. Paul', slug: 'st-paul', population: '311K' },
      { name: 'Rochester', slug: 'rochester-mn', population: '121K' },
      { name: 'Duluth', slug: 'duluth', population: '90K' },
      { name: 'Bloomington', slug: 'bloomington-mn', population: '89K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'Minnesota'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Minnesota'),
    regionalPhone: '1-800-MODULAR-MN',
    regionalEmail: 'minnesota@modular-buildings.co',
    deliveryTime: '2-4 weeks',
    projectsCompleted: 95
  },
  'south-carolina': {
    name: 'South Carolina',
    slug: 'south-carolina',
    abbreviation: 'SC',
    description: 'Quality modular buildings for Charleston, Columbia, and throughout South Carolina.',
    longDescription: 'South Carolina growing economy and coastal communities benefit from Modular Buildings Co prefabricated solutions. We deliver hurricane-resistant modular buildings designed for the Palmetto State climate. From Charleston historic district to Columbia business centers, we serve all of South Carolina with quality modular construction.',
    majorCities: [
      { name: 'Charleston', slug: 'charleston', population: '150K' },
      { name: 'Columbia', slug: 'columbia-sc', population: '137K' },
      { name: 'Greenville', slug: 'greenville', population: '72K' },
      { name: 'Myrtle Beach', slug: 'myrtle-beach', population: '35K' },
      { name: 'Rock Hill', slug: 'rock-hill', population: '74K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'South Carolina'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings SC'),
    regionalPhone: '1-800-MODULAR-SC',
    regionalEmail: 'southcarolina@modular-buildings.co',
    deliveryTime: '2-3 weeks',
    projectsCompleted: 88
  },
  'alabama': {
    name: 'Alabama',
    slug: 'alabama',
    abbreviation: 'AL',
    description: 'Premium prefabricated structures for Birmingham, Montgomery, and all of Alabama.',
    longDescription: 'Alabama diverse economy and growing communities rely on efficient construction solutions. Modular Buildings Co serves the Heart of Dixie with quality modular buildings designed for Alabama climate conditions. From Birmingham industrial centers to Mobile port facilities, we deliver professional modular construction throughout Alabama.',
    majorCities: [
      { name: 'Birmingham', slug: 'birmingham', population: '200K' },
      { name: 'Montgomery', slug: 'montgomery', population: '200K' },
      { name: 'Huntsville', slug: 'huntsville', population: '215K' },
      { name: 'Mobile', slug: 'mobile', population: '187K' },
      { name: 'Tuscaloosa', slug: 'tuscaloosa', population: '100K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'Alabama'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Alabama'),
    regionalPhone: '1-800-MODULAR-AL',
    regionalEmail: 'alabama@modular-buildings.co',
    deliveryTime: '2-3 weeks',
    projectsCompleted: 82
  },
  'louisiana': {
    name: 'Louisiana',
    slug: 'louisiana',
    abbreviation: 'LA',
    description: 'Hurricane-resistant modular buildings for New Orleans, Baton Rouge, and all Louisiana.',
    longDescription: 'Louisiana unique climate and coastal location demand specially engineered building solutions. Modular Buildings Co delivers hurricane-resistant modular structures designed for Louisiana humidity and storm conditions. From New Orleans commercial developments to Baton Rouge industrial facilities, we serve the entire Pelican State.',
    majorCities: [
      { name: 'New Orleans', slug: 'new-orleans', population: '383K' },
      { name: 'Baton Rouge', slug: 'baton-rouge', population: '227K' },
      { name: 'Shreveport', slug: 'shreveport', population: '187K' },
      { name: 'Lafayette', slug: 'lafayette', population: '126K' },
      { name: 'Lake Charles', slug: 'lake-charles', population: '84K' }
    ],
    imageUrl: getPlaceholderImage(800, 600, 'Louisiana'),
    bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Louisiana'),
    regionalPhone: '1-800-MODULAR-LA',
    regionalEmail: 'louisiana@modular-buildings.co',
    deliveryTime: '2-3 weeks',
    projectsCompleted: 78
  }
}

function getStateFAQs(stateName: string): FAQItem[] {
  return [
    {
      question: `What types of modular buildings are available in ${stateName}?`,
      answer: `Modular Buildings Co offers a complete range of modular buildings in ${stateName}, including modular offices, prefabricated classrooms, healthcare facilities, container buildings, site accommodation, and storage solutions. All our buildings are engineered to meet ${stateName} building codes and are available for delivery throughout the state.`
    },
    {
      question: `How long does delivery take to ${stateName}?`,
      answer: `Delivery times to ${stateName} typically range from 2-4 weeks depending on your specific location and the complexity of your order. We have established logistics networks serving all major cities and rural areas in ${stateName}. Our team will provide a detailed delivery timeline during the quotation process.`
    },
    {
      question: `Do your modular buildings meet ${stateName} building codes?`,
      answer: `Yes, all Modular Buildings Co modular buildings are engineered to meet or exceed ${stateName} state building codes and local requirements. Our engineering team is familiar with ${stateName}-specific regulations and can provide the necessary documentation for permit applications. We work closely with local building departments to ensure compliance.`
    },
    {
      question: `Do you provide installation services in ${stateName}?`,
      answer: `Yes, we offer comprehensive installation services throughout ${stateName}. Our professional installation teams handle site preparation guidance, delivery coordination, module placement, utility connections, and final inspections. We can also provide turnkey solutions that include everything from foundation work to interior finishing.`
    },
    {
      question: `Can I customize a modular building for my ${stateName} project?`,
      answer: `Absolutely! Modular Buildings Co specializes in customized modular solutions. You can choose from various sizes, layouts, exterior finishes, interior configurations, and feature packages. Our design team will work with you to create a modular building that meets your specific requirements and is optimized for ${stateName} conditions.`
    }
  ]
}

function getMockProducts(stateName: string) {
  return [
    {
      id: '1',
      title: `Modern Office Building - ${stateName}`,
      slug: 'modern-office-building',
      category: 'Modular Offices',
      imageUrl: getPlaceholderImage(400, 300, 'Modular Office'),
      area: 120,
      completionDays: 30
    },
    {
      id: '2',
      title: 'Prefabricated Classroom Unit',
      slug: 'prefabricated-classroom',
      category: 'Modular Classrooms',
      imageUrl: getPlaceholderImage(400, 300, 'Modular Classroom'),
      area: 80,
      completionDays: 25
    },
    {
      id: '3',
      title: 'Container Office Solution',
      slug: 'container-office',
      category: 'Container Buildings',
      imageUrl: getPlaceholderImage(400, 300, 'Container Office'),
      area: 30,
      completionDays: 15
    },
    {
      id: '4',
      title: 'Healthcare Clinic Module',
      slug: 'healthcare-clinic',
      category: 'Healthcare Units',
      imageUrl: getPlaceholderImage(400, 300, 'Healthcare Module'),
      area: 100,
      completionDays: 35
    },
    {
      id: '5',
      title: 'Site Accommodation Unit',
      slug: 'site-accommodation',
      category: 'Site Accommodation',
      imageUrl: getPlaceholderImage(400, 300, 'Site Accommodation'),
      area: 50,
      completionDays: 20
    },
    {
      id: '6',
      title: 'Industrial Storage Container',
      slug: 'industrial-storage',
      category: 'Storage Solutions',
      imageUrl: getPlaceholderImage(400, 300, 'Storage Container'),
      area: 40,
      completionDays: 10
    }
  ]
}

export async function generateStaticParams() {
  return Object.keys(stateDataMap).map((state) => ({
    state: state
  }))
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  // Try to fetch from database first
  const slug = `location/${params.state}`
  const dbPage = await getPageBySlug(slug)

  if (dbPage) {
    return {
      title: dbPage.meta_title || dbPage.title,
      description: dbPage.meta_description || dbPage.content?.substring(0, 160),
      openGraph: {
        title: dbPage.og_title || dbPage.meta_title || dbPage.title,
        description: dbPage.og_description || dbPage.meta_description,
        images: dbPage.og_image ? [dbPage.og_image] : undefined,
      },
      alternates: {
        canonical: dbPage.canonical_url,
      },
    }
  }

  // Fallback to static data
  const stateData = stateDataMap[params.state]

  if (!stateData) {
    return {
      title: 'Location Not Found'
    }
  }

  return {
    title: `Modular Buildings in ${stateData.name} | Modular Buildings Co ${stateData.abbreviation}`,
    description: `${stateData.description} Fast delivery and professional installation in ${stateData.majorCities.map(c => c.name).join(', ')}, and throughout ${stateData.name}.`,
    openGraph: {
      title: `Modular Buildings in ${stateData.name} | Modular Buildings Co`,
      description: stateData.description,
      images: [stateData.bannerUrl]
    }
  }
}

export default async function StatePage({ params }: StatePageProps) {
  // Try to fetch from database
  const slug = `location/${params.state}`
  const dbPage = await getPageBySlug(slug)

  // Get static fallback data
  const staticStateData = stateDataMap[params.state]

  // If no database page and no static data, show 404
  if (!dbPage && !staticStateData) {
    notFound()
  }

  // Use staticStateData for backward compatibility with existing template
  const stateData = staticStateData

  // Get custom fields from database if available
  const customFields = (dbPage?.custom_fields || {}) as Record<string, unknown>

  // Override title from database if available
  const pageTitle = dbPage?.title || (stateData ? `Modular Buildings in ${stateData.name}` : '')
  const stateName = (customFields.name as string) || stateData?.name || ''

  // Merge FAQs - prefer database FAQs if available
  const faqs = mergeFAQs(dbPage?.faqs, stateData ? getStateFAQs(stateData.name) : [])

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Locations', href: '/location' },
    { label: stateName, href: `/location/${params.state}` }
  ]

  const products = getMockProducts(stateName)

  return (
    <>
      {/* Structured Data JSON-LD from database */}
      <StructuredDataScript structuredData={dbPage?.structured_data} />

      {/* Category Banner */}
      <CategoryBanner
        title={pageTitle}
        backgroundImage={stateData?.bannerUrl || getPlaceholderImage(1920, 400, pageTitle)}
        breadcrumbs={breadcrumbs}
      />

      {/* Location Overview Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-6">
                Premium Modular Buildings in {stateData.name}
              </h2>
              <p className="text-lg text-mb-gray leading-relaxed mb-6">
                {stateData.longDescription}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-mb-bg-light rounded-mb p-4 text-center">
                  <div className="text-2xl font-bold text-mb-navy">{stateData.projectsCompleted}+</div>
                  <div className="text-sm text-mb-gray">Projects Completed</div>
                </div>
                <div className="bg-mb-bg-light rounded-mb p-4 text-center">
                  <div className="text-2xl font-bold text-mb-navy">{stateData.deliveryTime}</div>
                  <div className="text-sm text-mb-gray">Delivery Time</div>
                </div>
                <div className="bg-mb-bg-light rounded-mb p-4 text-center">
                  <div className="text-2xl font-bold text-mb-navy">{stateData.majorCities.length}</div>
                  <div className="text-sm text-mb-gray">Major Cities</div>
                </div>
              </div>

              {/* Service Features */}
              <div className="space-y-3">
                {[
                  'Local building code compliance',
                  'Professional installation teams',
                  'Climate-optimized designs',
                  'Comprehensive warranty coverage'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-mb-warning flex-shrink-0" />
                    <span className="text-mb-gray">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-[400px] rounded-mb-lg overflow-hidden">
              <Image
                src={stateData.imageUrl}
                alt={`Modular buildings in ${stateData.name}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cities Served Section */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              Cities We Serve in {stateData.name}
            </h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              We deliver and install modular buildings throughout {stateData.name}. Select a city to learn more about local services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {stateData.majorCities.map((city) => (
              <Link
                key={city.slug}
                href={`/location/${stateData.slug}/${city.slug}`}
                className="group bg-white rounded-mb-lg p-6 border border-mb-border-gray hover:border-mb-navy hover:shadow-mb transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-mb-warning" />
                  <h3 className="font-semibold text-mb-dark group-hover:text-mb-navy transition-colors">
                    {city.name}
                  </h3>
                </div>
                <div className="text-sm text-mb-gray mb-3">
                  Population: {city.population}
                </div>
                <div className="flex items-center text-sm text-mb-link-blue group-hover:text-mb-navy">
                  View Details
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              Products Available in {stateData.name}
            </h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              Our complete range of modular building solutions is available for delivery and installation throughout {stateData.name}.
            </p>
          </div>

          <ProductGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                category={product.category}
                imageUrl={product.imageUrl}
                href={`/products/${product.slug}`}
                area={product.area}
                completionDays={product.completionDays}
              />
            ))}
          </ProductGrid>

          <div className="text-center mt-10">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-mb-navy text-white px-8 py-3 rounded-mb font-semibold hover:bg-mb-navy/90 transition-colors"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Local Contact Section */}
      <section className="section-padding bg-mb-navy text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 md:text-h1 font-bold mb-6">
                Contact Our {stateData.name} Team
              </h2>
              <p className="text-lg opacity-90 mb-8 leading-relaxed">
                Our regional sales team is ready to assist with your {stateData.name} modular building project.
                Get expert advice on product selection, site requirements, and local regulations.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-mb-warning rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm opacity-80">{stateData.name} Sales Line</div>
                    <div className="text-lg font-semibold">{stateData.regionalPhone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-mb-warning rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm opacity-80">Email</div>
                    <div className="text-lg font-semibold">{stateData.regionalEmail}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-mb-warning rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm opacity-80">Typical Delivery</div>
                    <div className="text-lg font-semibold">{stateData.deliveryTime}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-mb-lg p-8">
              <h3 className="text-xl font-bold text-mb-dark mb-6">
                Request a Free Quote for {stateData.name}
              </h3>
              <ContactForm sourcePage={`location-${stateData.slug}`} />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        questions={faqs}
        title={`Frequently Asked Questions About ${stateName}`}
        subtitle={`Common questions about modular buildings in ${stateName}`}
        className="bg-white"
      />

      {/* CTA Section */}
      <CTASection
        title={`Ready to Start Your ${stateName} Project?`}
        subtitle="Get a Free Quote Today"
        description={`Our ${stateName} team is ready to help you find the perfect modular building solution. Contact us for a free consultation and detailed project estimate.`}
        primaryButton={{
          text: 'Request a Quote',
          href: '/contact?inquiry=quote',
          variant: 'primary'
        }}
        secondaryButton={{
          text: 'Call Us Now',
          href: `tel:${stateData.regionalPhone}`,
          variant: 'outline'
        }}
        variant="contained"
        backgroundColor="navy"
      />
    </>
  )
}
