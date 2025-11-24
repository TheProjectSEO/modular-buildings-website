const baseUrl = 'http://localhost:3004';

const pagesToTest = [
  { name: 'Homepage', url: '/' },
  { name: 'Containers', url: '/category/containers' },
  { name: 'Prefabricated Buildings', url: '/category/prefabricated-buildings' },
  { name: 'Modular School Buildings', url: '/category/modular-school-buildings' },
  { name: 'Prefabricated Hotels', url: '/category/prefabricated-hotels' },
  { name: 'Modular Cabins', url: '/category/modular-cabins' },
  { name: 'Projects', url: '/projects' },
  // Try subcategory variations
  { name: 'Modular School Buildings (subcategory)', url: '/category/prefabricated-buildings/modular-school-buildings' },
  { name: 'Prefabricated Hotels (subcategory)', url: '/category/prefabricated-buildings/prefabricated-hotels' },
];

async function checkPages() {
  console.log('🔍 Checking specific pages...\n');

  for (const page of pagesToTest) {
    try {
      const response = await fetch(`${baseUrl}${page.url}`);
      const status = response.status;

      if (status === 200) {
        console.log(`✅ ${page.name.padEnd(50)} - ${status} OK`);
      } else if (status === 404) {
        console.log(`❌ ${page.name.padEnd(50)} - ${status} NOT FOUND - ${page.url}`);
      } else {
        console.log(`⚠️  ${page.name.padEnd(50)} - ${status}`);
      }
    } catch (error) {
      console.log(`💥 ${page.name.padEnd(50)} - ERROR: ${error.message}`);
    }
  }
}

checkPages();
