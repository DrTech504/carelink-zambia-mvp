// apps/web/app/layout.tsx

import { GeistSans } from 'geist/font/sans'
import './globals.css'
import Header from '@/app/components/Header'

export const dynamic = 'force-dynamic'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'CareLink Zambia',
  description: 'Connecting Healthcare in Zambia',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          <Header />
          {children}
        </main>
      </body>
    </html>
  )
}
