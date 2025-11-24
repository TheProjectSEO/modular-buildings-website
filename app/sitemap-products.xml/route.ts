import { NextResponse } from 'next/server'
import { PRODUCTS, STATES } from '@/lib/mockDataGenerators'

const BASE_URL = 'https://modular-buildings.co'

export async function GET() {
  const urls: { url: string; priority: string; changefreq: string }[] = []
  const products = Object.keys(PRODUCTS)
  const states = Object.keys(STATES)

  // Product pages
  for (const product of products) {
    urls.push({
      url: `/${product}`,
      priority: '0.8',
      changefreq: 'weekly',
    })

    // Product + Location pages
    for (const state of states) {
      urls.push({
        url: `/${product}/${state}`,
        priority: '0.7',
        changefreq: 'monthly',
      })
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(page => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
