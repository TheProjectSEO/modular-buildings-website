const baseUrl = 'http://localhost:3004';

const pagesToTest = [
  // Product pages
  { name: 'Product: Portable Offices', url: '/portable-offices' },
  { name: 'Product: Portable Classrooms', url: '/portable-classrooms' },

  // State pages
  { name: 'State: Texas', url: '/texas' },
  { name: 'State: California', url: '/california' },

  // Industry pages
  { name: 'Industry: Healthcare', url: '/healthcare-modular-buildings' },
  { name: 'Industry: Schools', url: '/school-modular-buildings' },

  // Product + State
  { name: 'Portable Offices in Texas', url: '/portable-offices/texas' },
  { name: 'Portable Classrooms in California', url: '/portable-classrooms/california' },

  // State + City
  { name: 'Texas - Houston', url: '/texas/houston' },
  { name: 'California - Los Angeles', url: '/california/los-angeles' },

  // Product + Variation
  { name: 'Portable Offices - Single Wide', url: '/portable-offices/single-wide' },
  { name: 'Portable Classrooms - Double Wide', url: '/portable-classrooms/double-wide' },
];

async function checkPages() {
  console.log('🔍 Checking new dynamic routes...\n');

  for (const page of pagesToTest) {
    try {
      const response = await fetch(`${baseUrl}${page.url}`);
      const status = response.status;

      if (status === 200) {
        console.log(`✅ ${page.name.padEnd(40)} - ${status} OK`);
      } else if (status === 404) {
        console.log(`❌ ${page.name.padEnd(40)} - ${status} NOT FOUND`);
      } else {
        console.log(`⚠️  ${page.name.padEnd(40)} - ${status}`);
      }
    } catch (error) {
      console.log(`💥 ${page.name.padEnd(40)} - ERROR: ${error.message}`);
    }
  }
}

checkPages();
