import { NextResponse } from 'next/server'
import { STATES } from '@/lib/mockDataGenerators'

const BASE_URL = 'https://modular-buildings.co'

const CLASSROOM_TYPES = ['single', 'double-wide', 'multi-complexes', 'restrooms', 'kitchens']

export async function GET() {
  const urls: { url: string; priority: string; changefreq: string }[] = []
  const states = Object.keys(STATES)

  // Main modular classrooms page
  urls.push({
    url: '/modular-classrooms',
    priority: '0.9',
    changefreq: 'weekly',
  })

  // Type pages (single, double-wide, etc.)
  for (const type of CLASSROOM_TYPES) {
    urls.push({
      url: `/modular-classrooms/${type}`,
      priority: '0.8',
      changefreq: 'weekly',
    })

    // Type + Location pages
    for (const state of states) {
      urls.push({
        url: `/modular-classrooms/${type}/${state}`,
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
