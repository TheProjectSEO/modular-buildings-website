import { NextResponse } from 'next/server'
import { STATES } from '@/lib/mockDataGenerators'

const BASE_URL = 'https://modular-buildings.co'

// Industries based on the CSV structure
const INDUSTRIES = ['construction', 'medical', 'government', 'education', 'religion']

export async function GET() {
  const urls: { url: string; priority: string; changefreq: string }[] = []
  const states = Object.keys(STATES)

  // Main industries page
  urls.push({
    url: '/industries',
    priority: '0.9',
    changefreq: 'weekly',
  })

  // Industry pages
  for (const industry of INDUSTRIES) {
    urls.push({
      url: `/industries/${industry}`,
      priority: '0.8',
      changefreq: 'weekly',
    })

    // Industry + Location pages
    for (const state of states) {
      urls.push({
        url: `/industries/${industry}/${state}`,
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
