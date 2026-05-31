import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const freePixel = localFont({ src: '../../public/fonts/FreePixel.ttf', variable: '--font-pixel' })

export const metadata: Metadata = {
  title: 'Fatrap Explorer',
  description: 'A file explorer-style web application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${freePixel.variable}`}>{children}</body>
    </html>
  )
}
