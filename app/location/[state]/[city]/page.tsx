import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { ProductCard } from '@/components/ui/ProductCard'
import { ProductGrid } from '@/components/ui/ProductGrid'
import { FAQSection, FAQItem } from '@/components/sections/FAQSection'
import { CTASection } from '@/components/sections/CTASection'
import { ContactForm } from '@/components/forms/ContactForm'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail, Building2, Truck, Clock, Shield, CheckCircle, ArrowRight, Star } from 'lucide-react'
import { getPlaceholderImage } from '@/lib/placeholder-image'

interface CityPageProps {
  params: {
    state: string
    city: string
  }
}

interface CityData {
  name: string
  slug: string
  stateName: string
  stateSlug: string
  stateAbbreviation: string
  description: string
  longDescription: string
  population: string
  imageUrl: string
  bannerUrl: string
  localPhone: string
  localEmail: string
  deliveryTime: string
  nearbyAreas: string[]
}

interface StateInfo {
  name: string
  slug: string
  abbreviation: string
  cities: Record<string, CityData>
}

const statesCitiesMap: Record<string, StateInfo> = {
  'texas': {
    name: 'Texas',
    slug: 'texas',
    abbreviation: 'TX',
    cities: {
      'houston': {
        name: 'Houston',
        slug: 'houston',
        stateName: 'Texas',
        stateSlug: 'texas',
        stateAbbreviation: 'TX',
        description: 'Premium modular buildings for Houston businesses, schools, and healthcare facilities.',
        longDescription: 'Houston, the largest city in Texas and fourth-largest in the United States, presents diverse opportunities for modular construction. Modular Buildings Co serves the Greater Houston area with high-quality prefabricated buildings designed to withstand Gulf Coast humidity and weather conditions. From Energy Corridor office complexes to Medical Center healthcare facilities, we deliver modular solutions that meet Houston demanding standards.',
        population: '2.3 million',
        imageUrl: getPlaceholderImage(800, 600, 'Houston TX'),
        bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Houston'),
        localPhone: '1-832-MODULAR',
        localEmail: 'houston@modular-buildings.co',
        deliveryTime: '1-2 weeks',
        nearbyAreas: ['The Woodlands', 'Sugar Land', 'Katy', 'Pearland', 'League City']
      },
      'dallas': {
        name: 'Dallas',
        slug: 'dallas',
        stateName: 'Texas',
        stateSlug: 'texas',
        stateAbbreviation: 'TX',
        description: 'Modular building solutions for the Dallas-Fort Worth metroplex.',
        longDescription: 'The Dallas-Fort Worth metroplex is one of the fastest-growing regions in America, creating strong demand for efficient construction solutions. Modular Buildings Co provides modular buildings throughout the DFW area, from downtown Dallas commercial projects to suburban developments in Plano, Frisco, and McKinney. Our structures are engineered for North Texas weather conditions and built to meet local building codes.',
        population: '1.3 million',
        imageUrl: getPlaceholderImage(800, 600, 'Dallas TX'),
        bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Dallas'),
        localPhone: '1-214-MODULAR',
        localEmail: 'dallas@modular-buildings.co',
        deliveryTime: '1-2 weeks',
        nearbyAreas: ['Plano', 'Frisco', 'McKinney', 'Irving', 'Arlington']
      },
      'austin': {
        name: 'Austin',
        slug: 'austin',
        stateName: 'Texas',
        stateSlug: 'texas',
        stateAbbreviation: 'TX',
        description: 'Innovative modular buildings for Austin tech companies and growing businesses.',
        longDescription: 'Austin rapid growth and innovative spirit make it an ideal market for modular construction. Modular Buildings Co serves the Austin metro area with modern, sustainable modular buildings perfect for tech campuses, startups, and educational institutions. Our prefabricated solutions help Austin businesses build faster while maintaining the quality and design standards the city expects.',
        population: '1.0 million',
        imageUrl: getPlaceholderImage(800, 600, 'Austin TX'),
        bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Austin'),
        localPhone: '1-512-MODULAR',
        localEmail: 'austin@modular-buildings.co',
        deliveryTime: '1-2 weeks',
        nearbyAreas: ['Round Rock', 'Cedar Park', 'Georgetown', 'San Marcos', 'Pflugerville']
      },
      'san-antonio': {
        name: 'San Antonio',
        slug: 'san-antonio',
        stateName: 'Texas',
        stateSlug: 'texas',
        stateAbbreviation: 'TX',
        description: 'Quality modular buildings for San Antonio and South Texas.',
        longDescription: 'San Antonio, with its rich history and growing economy, benefits from Modular Buildings Co modular building solutions. We serve military installations, healthcare facilities, educational institutions, and businesses throughout the San Antonio metro area. Our modular structures are designed for South Texas climate conditions and built to meet all local requirements.',
        population: '1.5 million',
        imageUrl: getPlaceholderImage(800, 600, 'San Antonio TX'),
        bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings San Antonio'),
        localPhone: '1-210-MODULAR',
        localEmail: 'sanantonio@modular-buildings.co',
        deliveryTime: '1-2 weeks',
        nearbyAreas: ['New Braunfels', 'Boerne', 'Seguin', 'Schertz', 'Cibolo']
      },
      'fort-worth': {
        name: 'Fort Worth',
        slug: 'fort-worth',
        stateName: 'Texas',
        stateSlug: 'texas',
        stateAbbreviation: 'TX',
        description: 'Modular construction solutions for Fort Worth and Tarrant County.',
        longDescription: 'Fort Worth combines Western heritage with modern growth, creating diverse opportunities for modular construction. Modular Buildings Co delivers quality prefabricated buildings throughout Fort Worth and Tarrant County, serving commercial, industrial, and educational markets. Our modular solutions help Fort Worth businesses build efficiently without compromising on quality.',
        population: '918,000',
        imageUrl: getPlaceholderImage(800, 600, 'Fort Worth TX'),
        bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Fort Worth'),
        localPhone: '1-817-MODULAR',
        localEmail: 'fortworth@modular-buildings.co',
        deliveryTime: '1-2 weeks',
        nearbyAreas: ['Arlington', 'Southlake', 'Keller', 'Grapevine', 'Bedford']
      }
    }
  },
  'california': {
    name: 'California',
    slug: 'california',
    abbreviation: 'CA',
    cities: {
      'los-angeles': {
        name: 'Los Angeles',
        slug: 'los-angeles',
        stateName: 'California',
        stateSlug: 'california',
        stateAbbreviation: 'CA',
        description: 'Seismic-compliant modular buildings for the Los Angeles metro area.',
        longDescription: 'Los Angeles, the entertainment capital of the world, demands construction solutions that meet California stringent seismic and environmental standards. Modular Buildings Co delivers modular buildings throughout LA County that are engineered for earthquake resistance and energy efficiency. From Hollywood production facilities to Downtown commercial spaces, we provide quality prefabricated solutions.',
        population: '4.0 million',
        imageUrl: getPlaceholderImage(800, 600, 'Los Angeles CA'),
        bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings LA'),
        localPhone: '1-323-MODULAR',
        localEmail: 'losangeles@modular-buildings.co',
        deliveryTime: '2-3 weeks',
        nearbyAreas: ['Long Beach', 'Glendale', 'Santa Monica', 'Pasadena', 'Burbank']
      },
      'san-francisco': {
        name: 'San Francisco',
        slug: 'san-francisco',
        stateName: 'California',
        stateSlug: 'california',
        stateAbbreviation: 'CA',
        description: 'Premium modular buildings for San Francisco Bay Area businesses.',
        longDescription: 'San Francisco unique urban environment and strict building codes require experienced modular construction partners. Modular Buildings Co serves the Bay Area with innovative prefabricated solutions designed for limited-space urban sites. Our buildings meet San Francisco seismic requirements and help tech companies, startups, and established businesses build faster.',
        population: '874,000',
        imageUrl: getPlaceholderImage(800, 600, 'San Francisco CA'),
        bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings SF'),
        localPhone: '1-415-MODULAR',
        localEmail: 'sanfrancisco@modular-buildings.co',
        deliveryTime: '2-3 weeks',
        nearbyAreas: ['Oakland', 'Berkeley', 'San Jose', 'Palo Alto', 'Fremont']
      },
      'san-diego': {
        name: 'San Diego',
        slug: 'san-diego',
        stateName: 'California',
        stateSlug: 'california',
        stateAbbreviation: 'CA',
        description: 'Modular buildings for San Diego military, biotech, and commercial sectors.',
        longDescription: 'San Diego diverse economy, including military installations and biotechnology companies, creates varied demand for modular construction. Modular Buildings Co delivers quality prefabricated buildings throughout San Diego County, from coastal commercial projects to inland industrial facilities. Our structures meet California building standards and are optimized for the San Diego climate.',
        population: '1.4 million',
        imageUrl: getPlaceholderImage(800, 600, 'San Diego CA'),
        bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings San Diego'),
        localPhone: '1-619-MODULAR',
        localEmail: 'sandiego@modular-buildings.co',
        deliveryTime: '2-3 weeks',
        nearbyAreas: ['Chula Vista', 'Oceanside', 'Escondido', 'Carlsbad', 'El Cajon']
      },
      'san-jose': {
        name: 'San Jose',
        slug: 'san-jose',
        stateName: 'California',
        stateSlug: 'california',
        stateAbbreviation: 'CA',
        description: 'Tech-forward modular buildings for Silicon Valley companies.',
        longDescription: 'San Jose, the capital of Silicon Valley, demands innovative construction solutions for its tech-driven economy. Modular Buildings Co provides modular buildings for tech campuses, data centers, and startup offices throughout Santa Clara County. Our prefabricated solutions help Silicon Valley companies build quickly while meeting California stringent building requirements.',
        population: '1.0 million',
        imageUrl: getPlaceholderImage(800, 600, 'San Jose CA'),
        bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings San Jose'),
        localPhone: '1-408-MODULAR',
        localEmail: 'sanjose@modular-buildings.co',
        deliveryTime: '2-3 weeks',
        nearbyAreas: ['Santa Clara', 'Sunnyvale', 'Mountain View', 'Milpitas', 'Campbell']
      },
      'sacramento': {
        name: 'Sacramento',
        slug: 'sacramento',
        stateName: 'California',
        stateSlug: 'california',
        stateAbbreviation: 'CA',
        description: 'Modular buildings for California state capital and Central Valley.',
        longDescription: 'Sacramento, California state capital, is experiencing significant growth and infrastructure development. Modular Buildings Co serves the Sacramento metro area with quality modular buildings for government, healthcare, education, and commercial applications. Our prefabricated solutions help Sacramento organizations build efficiently while meeting state and local requirements.',
        population: '524,000',
        imageUrl: getPlaceholderImage(800, 600, 'Sacramento CA'),
        bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Sacramento'),
        localPhone: '1-916-MODULAR',
        localEmail: 'sacramento@modular-buildings.co',
        deliveryTime: '2-3 weeks',
        nearbyAreas: ['Elk Grove', 'Roseville', 'Folsom', 'Citrus Heights', 'Rancho Cordova']
      }
    }
  },
  'florida': {
    name: 'Florida',
    slug: 'florida',
    abbreviation: 'FL',
    cities: {
      'miami': {
        name: 'Miami',
        slug: 'miami',
        stateName: 'Florida',
        stateSlug: 'florida',
        stateAbbreviation: 'FL',
        description: 'Hurricane-resistant modular buildings for Miami and South Florida.',
        longDescription: 'Miami unique coastal environment requires specially engineered construction solutions. Modular Buildings Co delivers hurricane-resistant modular buildings throughout Miami-Dade County, designed to meet Florida High Velocity Hurricane Zone requirements. From Miami Beach commercial projects to inland residential developments, we provide durable, weather-resistant prefabricated structures.',
        population: '467,000',
        imageUrl: getPlaceholderImage(800, 600, 'Miami FL'),
        bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Miami'),
        localPhone: '1-305-MODULAR',
        localEmail: 'miami@modular-buildings.co',
        deliveryTime: '2-3 weeks',
        nearbyAreas: ['Miami Beach', 'Hialeah', 'Coral Gables', 'Fort Lauderdale', 'Hollywood']
      },
      'orlando': {
        name: 'Orlando',
        slug: 'orlando',
        stateName: 'Florida',
        stateSlug: 'florida',
        stateAbbreviation: 'FL',
        description: 'Modular buildings for Orlando tourism, hospitality, and growing industries.',
        longDescription: 'Orlando, the theme park capital of the world, has diverse construction needs from hospitality to technology. Modular Buildings Co provides modular buildings throughout the Orlando metro area, serving tourism, entertainment, and growing tech sectors. Our prefabricated structures are engineered for Central Florida conditions and built to meet local building codes.',
        population: '307,000',
        imageUrl: getPlaceholderImage(800, 600, 'Orlando FL'),
        bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Orlando'),
        localPhone: '1-407-MODULAR',
        localEmail: 'orlando@modular-buildings.co',
        deliveryTime: '2-3 weeks',
        nearbyAreas: ['Kissimmee', 'Winter Park', 'Sanford', 'Lake Mary', 'Altamonte Springs']
      },
      'tampa': {
        name: 'Tampa',
        slug: 'tampa',
        stateName: 'Florida',
        stateSlug: 'florida',
        stateAbbreviation: 'FL',
        description: 'Quality modular buildings for Tampa Bay area businesses and institutions.',
        longDescription: 'Tampa Bay growing economy creates strong demand for efficient construction solutions. Modular Buildings Co delivers modular buildings throughout the Tampa metro area, from downtown commercial spaces to suburban educational facilities. Our structures are engineered for Gulf Coast weather and designed to meet all Florida building requirements.',
        population: '387,000',
        imageUrl: getPlaceholderImage(800, 600, 'Tampa FL'),
        bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Tampa'),
        localPhone: '1-813-MODULAR',
        localEmail: 'tampa@modular-buildings.co',
        deliveryTime: '2-3 weeks',
        nearbyAreas: ['St. Petersburg', 'Clearwater', 'Brandon', 'Lakeland', 'Sarasota']
      },
      'jacksonville': {
        name: 'Jacksonville',
        slug: 'jacksonville',
        stateName: 'Florida',
        stateSlug: 'florida',
        stateAbbreviation: 'FL',
        description: 'Modular buildings for Jacksonville logistics, military, and commercial sectors.',
        longDescription: 'Jacksonville, the largest city by area in the continental US, has diverse modular building needs from port facilities to military installations. Modular Buildings Co serves the Jacksonville metro area with quality prefabricated buildings for commercial, industrial, and residential applications. Our structures are designed for Northeast Florida conditions.',
        population: '949,000',
        imageUrl: getPlaceholderImage(800, 600, 'Jacksonville FL'),
        bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Jacksonville'),
        localPhone: '1-904-MODULAR',
        localEmail: 'jacksonville@modular-buildings.co',
        deliveryTime: '2-3 weeks',
        nearbyAreas: ['St. Augustine', 'Orange Park', 'Ponte Vedra', 'Fernandina Beach', 'Green Cove Springs']
      },
      'fort-lauderdale': {
        name: 'Fort Lauderdale',
        slug: 'fort-lauderdale',
        stateName: 'Florida',
        stateSlug: 'florida',
        stateAbbreviation: 'FL',
        description: 'Hurricane-rated modular buildings for Fort Lauderdale and Broward County.',
        longDescription: 'Fort Lauderdale coastal location requires construction solutions built to withstand South Florida weather. Modular Buildings Co delivers hurricane-resistant modular buildings throughout Broward County, serving marine industries, tourism, and growing commercial sectors. Our prefabricated structures meet Florida High Velocity Hurricane Zone requirements.',
        population: '182,000',
        imageUrl: getPlaceholderImage(800, 600, 'Fort Lauderdale FL'),
        bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Fort Lauderdale'),
        localPhone: '1-954-MODULAR',
        localEmail: 'fortlauderdale@modular-buildings.co',
        deliveryTime: '2-3 weeks',
        nearbyAreas: ['Hollywood', 'Pompano Beach', 'Deerfield Beach', 'Plantation', 'Coral Springs']
      }
    }
  },
  'new-york': {
    name: 'New York',
    slug: 'new-york',
    abbreviation: 'NY',
    cities: {
      'new-york-city': {
        name: 'New York City',
        slug: 'new-york-city',
        stateName: 'New York',
        stateSlug: 'new-york',
        stateAbbreviation: 'NY',
        description: 'Premium modular buildings for NYC boroughs and surrounding areas.',
        longDescription: 'New York City unique urban environment and strict building codes present challenges that Modular Buildings Co is equipped to handle. We deliver modular buildings throughout the five boroughs and surrounding areas, providing space-efficient solutions for commercial, educational, and healthcare applications. Our structures are engineered for NYC conditions and designed to minimize construction disruption.',
        population: '8.3 million',
        imageUrl: getPlaceholderImage(800, 600, 'New York City'),
        bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings NYC'),
        localPhone: '1-212-MODULAR',
        localEmail: 'nyc@modular-buildings.co',
        deliveryTime: '2-4 weeks',
        nearbyAreas: ['Brooklyn', 'Queens', 'Bronx', 'Staten Island', 'Long Island']
      },
      'buffalo': {
        name: 'Buffalo',
        slug: 'buffalo',
        stateName: 'New York',
        stateSlug: 'new-york',
        stateAbbreviation: 'NY',
        description: 'Winter-ready modular buildings for Buffalo and Western New York.',
        longDescription: 'Buffalo harsh winters require specially engineered building solutions. Modular Buildings Co delivers modular buildings throughout Western New York that are designed for extreme cold and heavy snow loads. From downtown Buffalo revitalization projects to suburban commercial developments, we provide durable prefabricated structures built for Buffalo climate.',
        population: '278,000',
        imageUrl: getPlaceholderImage(800, 600, 'Buffalo NY'),
        bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Buffalo'),
        localPhone: '1-716-MODULAR',
        localEmail: 'buffalo@modular-buildings.co',
        deliveryTime: '2-3 weeks',
        nearbyAreas: ['Niagara Falls', 'Cheektowaga', 'Tonawanda', 'Amherst', 'West Seneca']
      },
      'albany': {
        name: 'Albany',
        slug: 'albany',
        stateName: 'New York',
        stateSlug: 'new-york',
        stateAbbreviation: 'NY',
        description: 'Modular buildings for New York state capital and Capital District.',
        longDescription: 'Albany, as New York state capital, has significant government, healthcare, and educational building needs. Modular Buildings Co serves the Capital District with quality modular buildings for state agencies, universities, and commercial enterprises. Our prefabricated structures are engineered for Upstate New York climate conditions.',
        population: '99,000',
        imageUrl: getPlaceholderImage(800, 600, 'Albany NY'),
        bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Albany'),
        localPhone: '1-518-MODULAR',
        localEmail: 'albany@modular-buildings.co',
        deliveryTime: '2-3 weeks',
        nearbyAreas: ['Schenectady', 'Troy', 'Saratoga Springs', 'Latham', 'Colonie']
      },
      'rochester': {
        name: 'Rochester',
        slug: 'rochester',
        stateName: 'New York',
        stateSlug: 'new-york',
        stateAbbreviation: 'NY',
        description: 'Quality modular buildings for Rochester and Finger Lakes region.',
        longDescription: 'Rochester innovative history and diverse economy create opportunities for modern modular construction. Modular Buildings Co delivers prefabricated buildings throughout the Rochester metro area and Finger Lakes region, serving healthcare, education, and manufacturing sectors. Our structures are built for Western New York weather conditions.',
        population: '211,000',
        imageUrl: getPlaceholderImage(800, 600, 'Rochester NY'),
        bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Rochester'),
        localPhone: '1-585-MODULAR',
        localEmail: 'rochester@modular-buildings.co',
        deliveryTime: '2-3 weeks',
        nearbyAreas: ['Greece', 'Irondequoit', 'Brighton', 'Henrietta', 'Victor']
      },
      'syracuse': {
        name: 'Syracuse',
        slug: 'syracuse',
        stateName: 'New York',
        stateSlug: 'new-york',
        stateAbbreviation: 'NY',
        description: 'Snow-load engineered modular buildings for Syracuse and Central New York.',
        longDescription: 'Syracuse, known for heavy lake-effect snow, requires buildings engineered for extreme winter conditions. Modular Buildings Co provides modular structures throughout Central New York designed to handle significant snow loads. From university expansions to commercial developments, we deliver quality prefabricated buildings built for Syracuse climate.',
        population: '148,000',
        imageUrl: getPlaceholderImage(800, 600, 'Syracuse NY'),
        bannerUrl: getPlaceholderImage(1920, 400, 'Modular Buildings Syracuse'),
        localPhone: '1-315-MODULAR',
        localEmail: 'syracuse@modular-buildings.co',
        deliveryTime: '2-3 weeks',
        nearbyAreas: ['Liverpool', 'Cicero', 'DeWitt', 'Camillus', 'Baldwinsville']
      }
    }
  }
}

// Add remaining states with generic city data for brevity
const additionalStates = ['pennsylvania', 'illinois', 'ohio', 'georgia', 'north-carolina', 'michigan', 'new-jersey', 'virginia', 'washington', 'arizona']

function getCityData(stateSlug: string, citySlug: string): CityData | null {
  const stateInfo = statesCitiesMap[stateSlug]
  if (stateInfo && stateInfo.cities[citySlug]) {
    return stateInfo.cities[citySlug]
  }
  return null
}

function getStateInfo(stateSlug: string): StateInfo | null {
  return statesCitiesMap[stateSlug] || null
}

function getCityFAQs(cityName: string, stateName: string): FAQItem[] {
  return [
    {
      question: `What types of modular buildings can you deliver to ${cityName}?`,
      answer: `Modular Buildings Co delivers a complete range of modular buildings to ${cityName}, ${stateName}, including modular offices, prefabricated classrooms, healthcare facilities, container buildings, site accommodation, and storage solutions. All buildings are engineered to meet ${cityName} local building codes and can be customized to your specifications.`
    },
    {
      question: `How quickly can you deliver and install a modular building in ${cityName}?`,
      answer: `Delivery times to ${cityName} typically range from 1-3 weeks depending on the complexity of your order and current production schedules. Installation is usually completed within 1-5 days after delivery. Our ${cityName} team will provide a detailed project timeline during the quotation process.`
    },
    {
      question: `Do you provide site assessment services in ${cityName}?`,
      answer: `Yes, our ${cityName} team can conduct site assessments to evaluate your property for modular building installation. We assess foundation requirements, utility connections, access for delivery vehicles, and compliance with local zoning regulations. Site assessments help ensure smooth project execution.`
    },
    {
      question: `What permits are required for modular buildings in ${cityName}?`,
      answer: `Permit requirements for modular buildings in ${cityName}, ${stateName} vary based on the building type, size, and intended use. Our team is familiar with ${cityName} permitting processes and can assist with documentation. Many of our buildings come with engineering certifications that streamline local permit approvals.`
    },
    {
      question: `Can modular buildings be permanently installed in ${cityName}?`,
      answer: `Yes, modular buildings can be installed as permanent structures in ${cityName}. When properly installed on appropriate foundations and connected to utilities, our modular buildings serve as permanent facilities. They can also be designed for temporary or relocatable applications if your project requires flexibility.`
    }
  ]
}

function getMockProducts(cityName: string) {
  return [
    {
      id: '1',
      title: `Modern Office Building`,
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

function getMockTestimonials(cityName: string) {
  return [
    {
      name: 'John Smith',
      company: `${cityName} Manufacturing Co.`,
      text: `Modular Buildings Co delivered exactly what we needed for our ${cityName} facility. The modular office was installed quickly and the quality exceeded our expectations.`,
      rating: 5
    },
    {
      name: 'Sarah Johnson',
      company: `${cityName} School District`,
      text: `The modular classrooms from Modular Buildings Co helped us address our space shortage in record time. Professional service from start to finish.`,
      rating: 5
    },
    {
      name: 'Michael Brown',
      company: `${cityName} Healthcare Group`,
      text: `We needed a temporary clinic space fast. Modular Buildings Co delivered a fully equipped healthcare module that met all our requirements.`,
      rating: 5
    }
  ]
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const cityData = getCityData(params.state, params.city)

  if (!cityData) {
    return {
      title: 'Location Not Found'
    }
  }

  return {
    title: `Modular Buildings in ${cityData.name}, ${cityData.stateAbbreviation} | Modular Buildings Co`,
    description: `${cityData.description} Fast delivery and professional installation in ${cityData.name} and surrounding areas including ${cityData.nearbyAreas.slice(0, 3).join(', ')}.`,
    openGraph: {
      title: `Modular Buildings in ${cityData.name}, ${cityData.stateAbbreviation}`,
      description: cityData.description,
      images: [cityData.bannerUrl]
    }
  }
}

export default function CityPage({ params }: CityPageProps) {
  const cityData = getCityData(params.state, params.city)

  if (!cityData) {
    notFound()
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Locations', href: '/location' },
    { label: cityData.stateName, href: `/location/${cityData.stateSlug}` },
    { label: cityData.name, href: `/location/${cityData.stateSlug}/${cityData.slug}` }
  ]

  const products = getMockProducts(cityData.name)
  const faqs = getCityFAQs(cityData.name, cityData.stateName)
  const testimonials = getMockTestimonials(cityData.name)

  return (
    <>
      {/* Category Banner */}
      <CategoryBanner
        title={`Modular Buildings in ${cityData.name}, ${cityData.stateAbbreviation}`}
        backgroundImage={cityData.bannerUrl}
        breadcrumbs={breadcrumbs}
      />

      {/* Location Overview Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-6">
                Premium Modular Buildings in {cityData.name}
              </h2>
              <p className="text-lg text-mb-gray leading-relaxed mb-6">
                {cityData.longDescription}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-mb-bg-light rounded-mb p-4 text-center">
                  <div className="text-xl font-bold text-mb-navy">{cityData.deliveryTime}</div>
                  <div className="text-sm text-mb-gray">Local Delivery</div>
                </div>
                <div className="bg-mb-bg-light rounded-mb p-4 text-center">
                  <div className="text-xl font-bold text-mb-navy">{cityData.population}</div>
                  <div className="text-sm text-mb-gray">Population</div>
                </div>
              </div>

              {/* Service Features */}
              <div className="space-y-3">
                {[
                  `Local ${cityData.name} team`,
                  'Same-week consultations available',
                  'Local code compliance expertise',
                  'Fast turnaround times'
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
                src={cityData.imageUrl}
                alt={`Modular buildings in ${cityData.name}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Areas Section */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-h2 font-bold text-mb-dark mb-4">
              Areas We Serve Near {cityData.name}
            </h2>
            <p className="text-lg text-mb-gray">
              In addition to {cityData.name}, we deliver modular buildings to these nearby communities.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {cityData.nearbyAreas.map((area, index) => (
              <div
                key={index}
                className="bg-white px-6 py-3 rounded-mb border border-mb-border-gray flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-mb-warning" />
                <span className="text-mb-dark font-medium">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              Products Available in {cityData.name}
            </h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              Our complete range of modular building solutions is available for delivery and installation in {cityData.name} and surrounding areas.
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

      {/* Testimonials Section */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              What {cityData.name} Customers Say
            </h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              Trusted by businesses and organizations throughout {cityData.name}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-mb-lg p-6 shadow-mb"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-mb-warning text-mb-warning" />
                  ))}
                </div>
                <p className="text-mb-gray mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-semibold text-mb-dark">{testimonial.name}</div>
                  <div className="text-sm text-mb-gray">{testimonial.company}</div>
                </div>
              </div>
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
                Contact Our {cityData.name} Team
              </h2>
              <p className="text-lg opacity-90 mb-8 leading-relaxed">
                Our local {cityData.name} representatives are ready to help with your modular building project.
                Get expert advice on product selection, site requirements, and local regulations.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-mb-warning rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm opacity-80">{cityData.name} Line</div>
                    <div className="text-lg font-semibold">{cityData.localPhone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-mb-warning rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm opacity-80">Email</div>
                    <div className="text-lg font-semibold">{cityData.localEmail}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-mb-warning rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm opacity-80">Local Delivery</div>
                    <div className="text-lg font-semibold">{cityData.deliveryTime}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-mb-lg p-8">
              <h3 className="text-xl font-bold text-mb-dark mb-6">
                Request a Free Quote in {cityData.name}
              </h3>
              <ContactForm sourcePage={`location-${cityData.stateSlug}-${cityData.slug}`} />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        questions={faqs}
        title={`Frequently Asked Questions About ${cityData.name}`}
        subtitle={`Common questions about modular buildings in ${cityData.name}, ${cityData.stateAbbreviation}`}
        className="bg-white"
      />

      {/* CTA Section */}
      <CTASection
        title={`Start Your ${cityData.name} Project Today`}
        subtitle="Get a Free Quote"
        description={`Our ${cityData.name} team is ready to help you find the perfect modular building solution. Contact us for a free consultation and detailed project estimate.`}
        primaryButton={{
          text: 'Request a Quote',
          href: '/contact?inquiry=quote',
          variant: 'primary'
        }}
        secondaryButton={{
          text: 'Call Us Now',
          href: `tel:${cityData.localPhone}`,
          variant: 'outline'
        }}
        variant="contained"
        backgroundColor="navy"
      />
    </>
  )
}
