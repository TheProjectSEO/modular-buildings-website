import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Modular Buildings Co | Prefabricated & Modular Buildings',
    template: '%s | Modular Buildings Co',
  },
  description: 'Leading manufacturer of prefabricated and modular buildings since 1986. Containers, offices, schools, cabins, and more. Serving 130+ countries worldwide.',
  keywords: ['prefabricated buildings', 'modular buildings', 'containers', 'modular offices', 'prefab schools', 'cabins'],
  authors: [{ name: 'Modular Buildings Co' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.modular-buildings.co',
    siteName: 'Modular Buildings Co',
    title: 'Modular Buildings Co | Prefabricated & Modular Buildings',
    description: 'Leading manufacturer of prefabricated and modular buildings since 1986.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
