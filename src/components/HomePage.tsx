'use client'

import React from 'react'

interface HomePageProps {
  onNavigate: (path: string) => void
}

const links = [
  { label: 'print files', path: '/print/stickers/print' },
  { label: 'our history', path: '/gallery/2018-first-steps' },
  { label: 'contribute', path: '/contact' },
  { label: 'license', path: '/contact' },
  { label: '@fatrap.co', path: '/contact' },
]

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 md:px-16 bg-white overflow-auto">
      <div className="w-full max-w-3xl">

        {/* Main title */}
        <h1
          className="text-[clamp(3rem,10vw,7rem)] font-black leading-none tracking-tight text-black uppercase mb-6"
          style={{ fontFamily: 'Inter, Arial Black, sans-serif' }}
        >
          FATRAP BRAND
        </h1>

        {/* Subtitle pill */}
        <div className="inline-block mb-8">
          <span className="px-5 py-2.5 bg-gray-100 rounded-full text-lg md:text-xl font-semibold text-black">
            The first &ldquo;open source&rdquo; brand
          </span>
        </div>

        {/* Description */}
        <div className="space-y-4 mb-10 max-w-2xl">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            Fatrap Brand is an open source streetwear project — all design files, print-ready artwork and
            brand assets are freely available. Download, remix, print and wear.
          </p>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            Browse the sections on the left to find sticker sheets, DTF transfers, gallery photos and
            editable Affinity Designer source files for every drop.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-3">
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => onNavigate(link.path)}
              className="px-5 py-2.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-sm md:text-base font-medium text-black transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
