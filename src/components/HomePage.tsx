'use client'

import React from 'react'
import Image from 'next/image'

interface HomePageProps {
  onNavigate: (path: string) => void
  onMakeItYours: () => void
}

// Placeholder grid items — swap `photo` for a real URL or import when ready
const gridItems = [
  {
    tag: '#PRINTFILES',
    path: '/print/stickers/print',
    photo: '/images/printfiles.png' as string | null,
    bg: 'bg-neutral-600',
  },
  {
    tag: '#CONTRIBUTE',
    path: '/contact',
    photo: '/images/contribute.png' as string | null,
    bg: 'bg-neutral-500',
  },
  {
    tag: '@FATRAP.CO',
    path: '/contact',
    photo: null as string | null,
    bg: 'bg-neutral-700',
  },
]

// Hero photo on the right column — set a URL here when ready
const HERO_PHOTO: string | null = '/images/hero.png'

export default function HomePage({ onNavigate, onMakeItYours }: HomePageProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden flex bg-[#e4e4e4]">


      {/* ══════════════════════════════════════════
          LEFT COLUMN — always visible
      ══════════════════════════════════════════ */}
      <div className="w-full md:w-[45%] h-full flex flex-col p-8 md:p-10 shrink-0 overflow-y-auto">

        {/* Brand block */}
        <div className="flex flex-col justify-start pt-2 bg-gray-100 rounded-2xl p-6">

          {/* FATRAP logotype */}
          <div className="mb-0.5">
            <Image
              src="/images/logo-wordmark-compressed.png"
              alt="FATRAP"
              width={3500}
              height={700}
              className="w-96 md:w-96 h-auto"
              priority
            />
          </div>

          {/* Subtitle */}
          <h2 className="w-full whitespace-nowrap text-[25px] md:text-[25px] uppercase leading-tight mb-4 font-medium tracking-tight">
            THE FIRST <strong className="font-black">OPEN SOURCE</strong> BRAND
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-700 leading-relaxed mb-6 w-full">
            Fatrap Brand is an open source streetwear project — all design files, print-ready artwork
            and brand assets are freely available. Download, remix, print and wear.
          </p>

          {/* Make it yours CTA */}
          <div className="mb-6 flex items-center justify-end gap-3">
            <button
              onClick={onMakeItYours}
              className="group flex items-center gap-3 px-5 py-2.5 border-2 border-black rounded-full font-bold text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              MAKE IT YOURS!
            </button>
            <button
              type="button"
              onClick={onMakeItYours}
              aria-label="Make it yours"
              className="w-11 h-11 rounded-full bg-[#aabed5] text-white flex items-center justify-center hover:bg-[#97afc9] transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-current"
              >
                <path
                  d="M5 12H19M19 12L13 6M19 12L13 18"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Bottom photo grid ── */}
        <div className="grid grid-cols-2 gap-2 h-48 md:h-52 shrink-0 mt-4">

          {/* Cell 1 — #PRINTFILES (top-left) */}
          <GridCell item={gridItems[0]} onNavigate={onNavigate} />

          {/* Cell 2 — #CONTRIBUTE (top-right) */}
          <GridCell item={gridItems[1]} onNavigate={onNavigate} />

          {/* Cell 3 — @FATRAP.CO (full width) */}
          <GridCell item={gridItems[2]} onNavigate={onNavigate} className="col-span-2" />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT COLUMN — hidden on mobile
      ══════════════════════════════════════════ */}
      <div className="hidden md:block flex-1 h-full relative overflow-hidden rounded-l-2xl">
        {HERO_PHOTO ? (
          <Image
            src={HERO_PHOTO}
            alt="Fatrap crew"
            fill
            className="object-cover object-top"
            priority
          />
        ) : (
          /* Placeholder until a real photo is added */
          <div className="w-full h-full bg-neutral-400 flex items-end p-6">
            <span className="text-neutral-600 text-xs uppercase tracking-widest font-semibold">
              Hero photo — add URL to HERO_PHOTO in HomePage.tsx
            </span>
          </div>
        )}
      </div>

    </div>
  )
}

/* ── Shared grid cell ── */
interface GridCellProps {
  item: { tag: string; path: string; photo: string | null; bg: string }
  onNavigate: (path: string) => void
  className?: string
}

function GridCell({ item, onNavigate, className = '' }: GridCellProps) {
  return (
    <div
      className={`relative rounded-xl overflow-hidden cursor-pointer hover:opacity-90 active:opacity-80 transition-opacity ${item.bg} ${className}`}
      onClick={() => onNavigate(item.path)}
    >
      {item.photo ? (
        <Image src={item.photo} alt={item.tag} fill className="object-cover object-center" />
      ) : (
        /* Placeholder hint */
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z" />
          </svg>
        </div>
      )}

      {/* Tag label */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <span className="absolute bottom-2 left-3 text-white font-black text-xs md:text-sm uppercase tracking-wide drop-shadow">
        {item.tag}
      </span>
    </div>
  )
}
