import { NextResponse } from 'next/server'

const BASE_URL = 'https://modular-buildings.co'

export async function GET() {
  const sitemaps = [
    'sitemap-static.xml',
    'sitemap-modular-office-building.xml',
    'sitemap-modular-classrooms.xml',
    'sitemap-industries.xml',
    'sitemap-locations.xml',
    'sitemap-products.xml',
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => `  <sitemap>
    <loc>${BASE_URL}/${sitemap}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
