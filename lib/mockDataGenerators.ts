// Utility functions for generating smart mock data based on slugs

export const PRODUCTS = {
  'portable-offices': {
    name: 'Portable Offices',
    category: 'modular-buildings',
    description: 'High-quality portable office buildings designed for quick deployment and maximum functionality.',
    variations: ['single-wide', 'double-wide', 'multi-story', 'custom'],
  },
  'portable-classrooms': {
    name: 'Portable Classrooms',
    category: 'modular-buildings',
    description: 'Temporary and permanent modular classroom solutions for educational institutions.',
    variations: ['single-classroom', 'multi-classroom', 'with-restrooms', 'science-lab'],
  },
  'office-trailers': {
    name: 'Office Trailers',
    category: 'modular-buildings',
    description: 'Mobile office trailers perfect for construction sites and temporary office needs.',
    variations: ['standard', 'executive', 'mobile', 'multi-unit'],
  },
  'storage-containers': {
    name: 'Storage Containers',
    category: 'containers',
    description: 'Secure storage container solutions for equipment, materials, and inventory.',
    variations: ['20ft', '40ft', 'climate-controlled', 'high-security'],
  },
  'container': {
    name: 'Container',
    category: 'containers',
    description: 'Versatile shipping container conversions for offices, storage, and custom spaces.',
    variations: ['office', 'storage', 'living', 'custom'],
  },
  'prefabricated-buildings': {
    name: 'Prefabricated Buildings',
    category: 'modular-buildings',
    description: 'Complete prefabricated building solutions for commercial, industrial, and residential use.',
    variations: ['commercial', 'residential', 'industrial', 'custom'],
  },
  'modular-homes': {
    name: 'Modular Homes',
    category: 'residential',
    description: 'High-quality modular homes with customizable designs and fast construction.',
    variations: ['single-family', 'multi-family', 'tiny-homes', 'luxury'],
  },
  'steel-houses': {
    name: 'Steel Houses',
    category: 'residential',
    description: 'Durable steel frame houses with modern designs and superior strength.',
    variations: ['standard', 'custom', 'multi-story', 'luxury'],
  },
  'kiosks': {
    name: 'Kiosks',
    category: 'commercial',
    description: 'Guard houses, security kiosks, and small commercial structures.',
    variations: ['security', 'ticket-booth', 'information', 'retail'],
  },
  'restrooms': {
    name: 'Modular Restrooms',
    category: 'modular-buildings',
    description: 'Portable restroom and bathroom facilities for various applications.',
    variations: ['single', 'multi-stall', 'ada-compliant', 'shower-facilities'],
  },
  'blast-modular': {
    name: 'Blast-Resistant Modular Buildings',
    category: 'specialized',
    description: 'Blast-resistant modular structures for high-risk industrial environments.',
    variations: ['level-1', 'level-2', 'level-3', 'custom-spec'],
  },
  'temporary-modular-buildings': {
    name: 'Temporary Modular Buildings',
    category: 'modular-buildings',
    description: 'Flexible temporary modular building solutions for short-term projects.',
    variations: ['office', 'storage', 'housing', 'medical'],
  },
  'guard-houses': {
    name: 'Guard Houses',
    category: 'commercial',
    description: 'Secure guard houses and security structures for controlled access points and property protection.',
    variations: ['standard-guard', 'bulletproof', 'gatehouse', 'checkpoint'],
  },
  'ticket-booths': {
    name: 'Ticket Booths',
    category: 'commercial',
    description: 'Compact ticket booths for entry points, toll collection, and event management facilities.',
    variations: ['single-window', 'dual-window', 'toll-booth', 'automated'],
  },
  'concession-stands': {
    name: 'Concession Stands',
    category: 'commercial',
    description: 'Food and retail concession stands with built-in service counters and storage facilities.',
    variations: ['food-service', 'retail-kiosk', 'beverage-station', 'combo-unit'],
  },
  'modular-clinics': {
    name: 'Modular Clinics',
    category: 'healthcare',
    description: 'Compact medical clinics with examination rooms, waiting areas, and essential healthcare infrastructure.',
    variations: ['basic-clinic', 'dental-clinic', 'urgent-care', 'veterinary-ready'],
  },
  'modular-hospitals': {
    name: 'Modular Hospitals',
    category: 'healthcare',
    description: 'Scalable hospital facilities featuring patient wards, surgical areas, and advanced medical infrastructure.',
    variations: ['emergency-ward', 'patient-wards', 'surgical-suite', 'full-hospital'],
  },
  'modular-schools': {
    name: 'Modular Schools',
    category: 'educational',
    description: 'Complete educational facilities including classrooms, administrative offices, and learning spaces.',
    variations: ['elementary', 'middle-school', 'high-school', 'campus-complex'],
  },
  'modular-dormitories': {
    name: 'Modular Dormitories',
    category: 'residential',
    description: 'Student housing solutions with individual rooms, common areas, and residential support facilities.',
    variations: ['standard-dorm', 'suite-style', 'apartment-style', 'premium-housing'],
  },
  'modular-apartments': {
    name: 'Modular Apartments',
    category: 'residential',
    description: 'Multi-family apartment buildings with flexible unit configurations and shared amenities.',
    variations: ['studio-units', 'one-bedroom', 'two-bedroom', 'mixed-configuration'],
  },
  'modular-hotels': {
    name: 'Modular Hotels',
    category: 'hospitality',
    description: 'Customizable hotel solutions with guest rooms, lobbies, restaurants, and hospitality services.',
    variations: ['budget-hotel', 'mid-range-hotel', 'luxury-hotel', 'resort-complex'],
  },
  'modular-laboratories': {
    name: 'Modular Laboratories',
    category: 'specialized',
    description: 'Research and testing laboratories with specialized utilities, ventilation, and equipment infrastructure.',
    variations: ['chemistry-lab', 'biology-lab', 'research-facility', 'testing-center'],
  },
  'modular-warehouses': {
    name: 'Modular Warehouses',
    category: 'industrial',
    description: 'Scalable warehouse and storage solutions for inventory management and material handling.',
    variations: ['standard-warehouse', 'cold-storage', 'climate-controlled', 'high-bay'],
  },
  'modular-workshops': {
    name: 'Modular Workshops',
    category: 'industrial',
    description: 'Manufacturing and assembly workshops with production floors and tool storage areas.',
    variations: ['fabrication-shop', 'assembly-line', 'maintenance-workshop', 'tech-workshop'],
  },
  'modular-garages': {
    name: 'Modular Garages',
    category: 'automotive',
    description: 'Vehicle storage and maintenance facilities with service bays and equipment storage.',
    variations: ['single-bay', 'multi-bay', 'service-center', 'storage-facility'],
  },
  'modular-carports': {
    name: 'Modular Carports',
    category: 'automotive',
    description: 'Weather-protected vehicle parking structures with open-air design and flexible configurations.',
    variations: ['single-row', 'double-row', 'covered-parking', 'solar-integrated'],
  },
  'modular-greenhouses': {
    name: 'Modular Greenhouses',
    category: 'agricultural',
    description: 'Controlled-environment agriculture facilities for crop cultivation and horticultural operations.',
    variations: ['standard-greenhouse', 'hydroponic-system', 'nursery-facility', 'propagation-house'],
  },
  'modular-barns': {
    name: 'Modular Barns',
    category: 'agricultural',
    description: 'Farm storage and animal housing structures with climate control and management systems.',
    variations: ['hay-barn', 'livestock-barn', 'equipment-storage', 'mixed-use-barn'],
  },
  'modular-cafeterias': {
    name: 'Modular Cafeterias',
    category: 'commercial',
    description: 'Full-service dining facilities with commercial kitchens and seating areas for bulk food service.',
    variations: ['school-cafeteria', 'corporate-cafeteria', 'institutional-dining', 'event-catering'],
  },
  'modular-kitchens': {
    name: 'Modular Kitchens',
    category: 'commercial',
    description: 'Commercial food preparation facilities with cooking equipment and sanitary infrastructure.',
    variations: ['commercial-kitchen', 'catering-kitchen', 'prep-facility', 'ghost-kitchen'],
  },
  'modular-laundries': {
    name: 'Modular Laundries',
    category: 'commercial',
    description: 'Industrial laundry facilities with washing, drying, and textile processing equipment.',
    variations: ['self-service', 'industrial-laundry', 'hotel-laundry', 'hospital-laundry'],
  },
  'modular-shower-blocks': {
    name: 'Modular Shower Blocks',
    category: 'modular-buildings',
    description: 'Hygienic shower and bathing facilities for camps, worksites, and temporary accommodations.',
    variations: ['basic-showers', 'premium-facilities', 'outdoor-camp', 'industrial-site'],
  },
  'modular-locker-rooms': {
    name: 'Modular Locker Rooms',
    category: 'commercial',
    description: 'Changing facilities with lockers, benches, and hygiene infrastructure for sports and work environments.',
    variations: ['sports-facility', 'workplace-lockers', 'gym-facility', 'pool-changing'],
  },
  'modular-retail-stores': {
    name: 'Modular Retail Stores',
    category: 'commercial',
    description: 'Customizable retail spaces with display areas, checkout counters, and storage facilities.',
    variations: ['pop-up-store', 'small-retail', 'anchor-store', 'shopping-center'],
  },
  'modular-banks': {
    name: 'Modular Banks',
    category: 'commercial',
    description: 'Secure financial facilities with vault systems, teller areas, and private meeting spaces.',
    variations: ['branch-office', 'atm-center', 'full-service-bank', 'secure-facility'],
  },
  'modular-pharmacies': {
    name: 'Modular Pharmacies',
    category: 'healthcare',
    description: 'Pharmaceutical retail and distribution facilities with secure storage and dispensing areas.',
    variations: ['retail-pharmacy', 'clinical-pharmacy', 'distribution-center', 'specialty-pharmacy'],
  },
  'modular-veterinary-clinics': {
    name: 'Modular Veterinary Clinics',
    category: 'healthcare',
    description: 'Animal care facilities with examination rooms, surgical suites, and quarantine areas.',
    variations: ['small-animal-clinic', 'large-animal-facility', 'emergency-clinic', 'specialty-veterinary'],
  },
}

export const STATES = {
  texas: { name: 'Texas', code: 'TX', region: 'South', population: 29000000 },
  california: { name: 'California', code: 'CA', region: 'West', population: 39500000 },
  florida: { name: 'Florida', code: 'FL', region: 'Southeast', population: 21500000 },
  'new-york': { name: 'New York', code: 'NY', region: 'Northeast', population: 19500000 },
  pennsylvania: { name: 'Pennsylvania', code: 'PA', region: 'Northeast', population: 12800000 },
  illinois: { name: 'Illinois', code: 'IL', region: 'Midwest', population: 12700000 },
  ohio: { name: 'Ohio', code: 'OH', region: 'Midwest', population: 11700000 },
  georgia: { name: 'Georgia', code: 'GA', region: 'Southeast', population: 10600000 },
  'north-carolina': { name: 'North Carolina', code: 'NC', region: 'Southeast', population: 10400000 },
  michigan: { name: 'Michigan', code: 'MI', region: 'Midwest', population: 10000000 },
}

export const CITIES: Record<string, { name: string; state: string; population: number }[]> = {
  texas: [
    { name: 'Houston', state: 'texas', population: 2300000 },
    { name: 'San Antonio', state: 'texas', population: 1500000 },
    { name: 'Dallas', state: 'texas', population: 1300000 },
    { name: 'Austin', state: 'texas', population: 950000 },
    { name: 'Fort Worth', state: 'texas', population: 900000 },
  ],
  california: [
    { name: 'Los Angeles', state: 'california', population: 3900000 },
    { name: 'San Diego', state: 'california', population: 1400000 },
    { name: 'San Jose', state: 'california', population: 1000000 },
    { name: 'San Francisco', state: 'california', population: 870000 },
    { name: 'Fresno', state: 'california', population: 540000 },
  ],
  florida: [
    { name: 'Jacksonville', state: 'florida', population: 950000 },
    { name: 'Miami', state: 'florida', population: 470000 },
    { name: 'Tampa', state: 'florida', population: 400000 },
    { name: 'Orlando', state: 'florida', population: 310000 },
    { name: 'St. Petersburg', state: 'florida', population: 265000 },
  ],
}

export const INDUSTRIES = {
  'healthcare-modular-buildings': {
    name: 'Healthcare Modular Buildings',
    icon: 'Hospital',
    description: 'Medical facilities, clinics, and hospitals',
  },
  'school-modular-buildings': {
    name: 'School Modular Buildings',
    icon: 'School',
    description: 'Educational facilities from K-12 to universities',
  },
  'construction-site-offices': {
    name: 'Construction Site Offices',
    icon: 'Building2',
    description: 'Temporary offices for construction projects',
  },
  'government-facilities': {
    name: 'Government Facilities',
    icon: 'Shield',
    description: 'Municipal and government buildings',
  },
  'industrial-facilities': {
    name: 'Industrial Facilities',
    icon: 'Factory',
    description: 'Manufacturing and industrial spaces',
  },
  'commercial-buildings': {
    name: 'Commercial Buildings',
    icon: 'Building',
    description: 'Retail and commercial spaces',
  },
  'hospitality-modular-buildings': {
    name: 'Hospitality Modular Buildings',
    icon: 'Bed',
    description: 'Hotels, resorts, and guest accommodation solutions',
  },
  'retail-modular-buildings': {
    name: 'Retail Modular Buildings',
    icon: 'ShoppingCart',
    description: 'Retail stores, shopping centers, and pop-up shops',
  },
  'warehouse-modular-buildings': {
    name: 'Warehouse Modular Buildings',
    icon: 'Package',
    description: 'Storage facilities, distribution centers, and inventory management',
  },
  'agriculture-modular-buildings': {
    name: 'Agriculture Modular Buildings',
    icon: 'Leaf',
    description: 'Farm offices, processing facilities, and agricultural operations',
  },
  'mining-modular-buildings': {
    name: 'Mining Modular Buildings',
    icon: 'Pickaxe',
    description: 'Site offices, worker camps, and mining operation facilities',
  },
  'oil-gas-modular-buildings': {
    name: 'Oil & Gas Modular Buildings',
    icon: 'Droplet',
    description: 'Offshore platforms, refineries, and energy sector operations',
  },
  'military-modular-buildings': {
    name: 'Military Modular Buildings',
    icon: 'Shield',
    description: 'Military bases, barracks, and defense facility structures',
  },
  'emergency-response-buildings': {
    name: 'Emergency Response Buildings',
    icon: 'AlertCircle',
    description: 'Disaster relief centers, emergency shelters, and crisis management facilities',
  },
  'sports-recreation-buildings': {
    name: 'Sports & Recreation Buildings',
    icon: 'Trophy',
    description: 'Gymnasiums, fitness facilities, and recreational activity centers',
  },
  'laboratory-modular-buildings': {
    name: 'Laboratory Modular Buildings',
    icon: 'Beaker',
    description: 'Research labs, testing facilities, and scientific research spaces',
  },
  'data-center-buildings': {
    name: 'Data Center Buildings',
    icon: 'Server',
    description: 'Server rooms, cloud infrastructure, and technology facilities',
  },
  'telecommunications-buildings': {
    name: 'Telecommunications Buildings',
    icon: 'Radio',
    description: 'Equipment facilities, signal towers, and telecom operations',
  },
  'airport-modular-buildings': {
    name: 'Airport Modular Buildings',
    icon: 'Plane',
    description: 'Terminal facilities, hangars, and aviation operations centers',
  },
  'railway-modular-buildings': {
    name: 'Railway Modular Buildings',
    icon: 'Train',
    description: 'Station facilities, maintenance depots, and railway operations',
  },
  'port-maritime-buildings': {
    name: 'Port & Maritime Buildings',
    icon: 'Anchor',
    description: 'Harbor facilities, dock offices, and maritime operations centers',
  },
  'religious-buildings': {
    name: 'Religious Buildings',
    icon: 'Cross',
    description: 'Churches, temples, mosques, and places of worship',
  },
  'community-center-buildings': {
    name: 'Community Center Buildings',
    icon: 'Users',
    description: 'Civic centers, social halls, and community gathering spaces',
  },
  'security-buildings': {
    name: 'Security Buildings',
    icon: 'Lock',
    description: 'Checkpoints, guard houses, and security operation centers',
  },
  'food-service-buildings': {
    name: 'Food Service Buildings',
    icon: 'UtensilsCrossed',
    description: 'Commercial kitchens, dining facilities, and food preparation centers',
  },
}

export function generateProductData(slug: string) {
  const product = PRODUCTS[slug as keyof typeof PRODUCTS]

  if (!product) {
    return {
      name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      category: 'modular-buildings',
      description: `Premium ${slug.replace(/-/g, ' ')} solutions for your project needs.`,
      variations: ['standard', 'custom'],
    }
  }

  return product
}

export function generateStateData(stateSlug: string) {
  return STATES[stateSlug as keyof typeof STATES] || {
    name: stateSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    code: 'XX',
    region: 'United States',
    population: 5000000,
  }
}

export function generateCityData(stateSlug: string, citySlug: string) {
  const cities = CITIES[stateSlug] || []
  const city = cities.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === citySlug)

  if (city) return city

  return {
    name: citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    state: stateSlug,
    population: 250000,
  }
}

export function generateIndustryData(slug: string) {
  return INDUSTRIES[slug as keyof typeof INDUSTRIES] || {
    name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    icon: 'Building2',
    description: `Specialized modular building solutions for ${slug.replace(/-/g, ' ')} industry.`,
  }
}

export function generateFAQs(type: 'product' | 'location' | 'industry', context: string) {
  const productFAQs = [
    {
      question: `What is the typical delivery time for ${context}?`,
      answer: `Delivery times vary based on customization and location, but typically range from 4-8 weeks for standard units and 8-12 weeks for custom configurations. Rush delivery options may be available.`,
    },
    {
      question: `Can I customize the ${context}?`,
      answer: `Yes! We offer extensive customization options including layout modifications, exterior finishes, interior fixtures, electrical systems, HVAC configurations, and specialized features to meet your exact requirements.`,
    },
    {
      question: `Are these buildings suitable for permanent installation?`,
      answer: `Absolutely. Our modular buildings are engineered to meet or exceed local building codes and can serve as permanent structures. They're built with the same quality materials as traditional construction.`,
    },
    {
      question: `What kind of warranty do you provide?`,
      answer: `We offer a comprehensive warranty covering structural components for 10 years, with additional warranties available for specific systems. All buildings are backed by our commitment to quality and customer satisfaction.`,
    },
    {
      question: `Do you handle installation?`,
      answer: `Yes, we provide complete turnkey solutions including site preparation, delivery, installation, and setup. Our experienced installation teams ensure your building is ready for occupancy quickly and professionally.`,
    },
    {
      question: `What maintenance is required?`,
      answer: `Our modular buildings require minimal maintenance. Regular inspections, cleaning, and standard building maintenance practices will keep your structure in excellent condition for decades.`,
    },
  ]

  const locationFAQs = [
    {
      question: `Do you deliver to ${context}?`,
      answer: `Yes! We provide delivery and installation services throughout ${context}. Our logistics team coordinates all aspects of transportation and setup to ensure a smooth process.`,
    },
    {
      question: `Are your buildings compliant with ${context} building codes?`,
      answer: `All our modular buildings are designed to meet or exceed local building codes and regulations in ${context}. We handle all necessary permits and ensure full compliance with state and local requirements.`,
    },
    {
      question: `How long does installation take in ${context}?`,
      answer: `Installation typically takes 1-3 days for standard units and up to 2 weeks for larger, complex projects. Timeline depends on site preparation, size, and customization level.`,
    },
    {
      question: `What is the cost range in ${context}?`,
      answer: `Pricing varies based on size, features, and customization. We offer competitive rates for the ${context} market. Contact us for a detailed quote tailored to your specific needs.`,
    },
  ]

  const industryFAQs = [
    {
      question: `What makes your buildings ideal for ${context}?`,
      answer: `Our modular buildings are specifically designed with ${context} requirements in mind, featuring appropriate layouts, safety features, and compliance with industry-specific regulations.`,
    },
    {
      question: `Can these buildings be expanded later?`,
      answer: `Yes, our modular design allows for easy expansion. You can add additional units or sections as your ${context} needs grow.`,
    },
    {
      question: `What safety features are included?`,
      answer: `All buildings include fire-resistant materials, emergency exits, proper ventilation, and electrical systems that meet current safety standards. Additional safety features can be customized based on your industry requirements.`,
    },
  ]

  if (type === 'location') return locationFAQs
  if (type === 'industry') return industryFAQs
  return productFAQs
}

export function generateRelatedLinks(type: string, context: string) {
  // Generate contextual internal links based on page type
  const links = []

  if (type === 'product') {
    Object.entries(PRODUCTS).forEach(([slug, data]) => {
      if (slug !== context) {
        links.push({
          title: data.name,
          url: `/${slug}`,
          description: data.description,
        })
      }
    })
  } else if (type === 'state') {
    links.push(
      ...Object.keys(PRODUCTS).map(slug => ({
        title: `${PRODUCTS[slug as keyof typeof PRODUCTS].name} in ${context}`,
        url: `/${slug}/${context}`,
        description: `Find ${PRODUCTS[slug as keyof typeof PRODUCTS].name.toLowerCase()} available in ${context}.`,
      }))
    )
  } else if (type === 'industry') {
    links.push(
      ...Object.entries(PRODUCTS).slice(0, 6).map(([slug, data]) => ({
        title: data.name,
        url: `/${slug}`,
        description: `${data.name} solutions for your industry needs.`,
      }))
    )
  }

  return links.slice(0, 6)
}
