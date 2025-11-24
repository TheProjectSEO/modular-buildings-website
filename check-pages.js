const baseUrl = 'http://localhost:3004';

const pagesToTest = [
  { name: 'Homepage', url: '/' },
  { name: 'Contact', url: '/contact' },
  { name: 'Projects', url: '/projects' },
  { name: 'Category: Containers', url: '/category/containers' },
  { name: 'Category: Prefabricated Buildings', url: '/category/prefabricated-buildings' },
  { name: 'Category: Modular Homes', url: '/category/modular-homes' },
  { name: 'Category: Steel Frame Houses', url: '/category/steel-frame-houses' },
  { name: 'Category: Kiosks', url: '/category/kiosks' },
  { name: 'Category: Modular Cabins', url: '/category/modular-cabins' },
  { name: 'Product: Prefab Office 560m2', url: '/products/prefabricated-office-560-m2' },
  { name: 'Product: School 1840m2', url: '/products/modular-school-buildings-1840-m2' },
  { name: 'Product: Container Office 20ft', url: '/products/container-office-20ft' },
  { name: 'Product: Modular Cabin', url: '/products/modular-cabin-construction' },
];

async function checkPages() {
  console.log('🔍 Checking page status...\n');

  const results = {
    working: [],
    notFound: [],
    error: []
  };

  for (const page of pagesToTest) {
    try {
      const response = await fetch(`${baseUrl}${page.url}`);
      const status = response.status;

      if (status === 200) {
        results.working.push({ ...page, status });
        console.log(`✅ ${page.name.padEnd(40)} - ${status} OK`);
      } else if (status === 404) {
        results.notFound.push({ ...page, status });
        console.log(`❌ ${page.name.padEnd(40)} - ${status} NOT FOUND`);
      } else {
        results.error.push({ ...page, status });
        console.log(`⚠️  ${page.name.padEnd(40)} - ${status}`);
      }
    } catch (error) {
      results.error.push({ ...page, error: error.message });
      console.log(`💥 ${page.name.padEnd(40)} - ERROR: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📊 SUMMARY:\n');
  console.log(`✅ Working (200):     ${results.working.length}/${pagesToTest.length}`);
  console.log(`❌ Not Found (404):   ${results.notFound.length}/${pagesToTest.length}`);
  console.log(`⚠️  Errors:           ${results.error.length}/${pagesToTest.length}`);

  console.log('\n' + '='.repeat(80));
  console.log('\n✅ WORKING PAGES:\n');
  results.working.forEach(p => console.log(`   ${p.url}`));

  if (results.notFound.length > 0) {
    console.log('\n❌ 404 PAGES:\n');
    results.notFound.forEach(p => console.log(`   ${p.url}`));
  }

  if (results.error.length > 0) {
    console.log('\n⚠️  ERROR PAGES:\n');
    results.error.forEach(p => console.log(`   ${p.url}`));
  }

  console.log('\n' + '='.repeat(80));
}

checkPages();
