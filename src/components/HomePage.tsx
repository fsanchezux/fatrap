'use client'

import React, { useRef, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import GooeyContactButton from './GooeyContactButton'
import GooeyMakeItYoursButton from './GooeyMakeItYoursButton'

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
    photo: '/images/ivangbbb-fatrap-30.png' as string | null,
    bg: 'bg-neutral-700',
    href: 'https://www.instagram.com/fatrap.co',
  },
]

// Hero photo on the right column — set a URL here when ready
const HERO_PHOTO: string | null = '/images/hero.png'

// Scattered positions for the floating mood-board state
const SCATTER: Record<string, { x: number; y: number; rotation: number; scale: number }> = {
  brand:   { x: -60,  y: -80,  rotation: -6,  scale: 0.85 },
  cell1:   { x: -120, y: 100,  rotation: 8,   scale: 0.75 },
  cell2:   { x: 80,   y: -120, rotation: -10, scale: 0.7  },
  cell3:   { x: -40,  y: 160,  rotation: 5,   scale: 0.8  },
  hero:    { x: 100,  y: -40,  rotation: 4,   scale: 0.9  },
  contact: { x: 60,   y: -100, rotation: -8,  scale: 0.8  },
}

export default function HomePage({ onNavigate, onMakeItYours }: HomePageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const cell1Ref = useRef<HTMLDivElement>(null)
  const cell2Ref = useRef<HTMLDivElement>(null)
  const cell3Ref = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0) // 0 = scattered, 1 = ordered
  const touchStartY = useRef(0)

  useEffect(() => {
    const els: Record<string, HTMLElement | null> = {
      brand: brandRef.current,
      cell1: cell1Ref.current,
      cell2: cell2Ref.current,
      cell3: cell3Ref.current,
      hero: heroRef.current,
      contact: contactRef.current,
    }
    const bg = bgRef.current
    const container = containerRef.current

    if (!bg || !container) return

    const allCards = Object.values(els).filter(Boolean) as HTMLElement[]

    // --- Phase 1: Set scattered initial state ---
    for (const [key, el] of Object.entries(els)) {
      if (!el) continue
      const s = SCATTER[key]
      gsap.set(el, {
        x: s.x,
        y: s.y,
        rotation: s.rotation,
        scale: s.scale,
        opacity: 0,
      })
    }

    gsap.set(bg, { backgroundColor: '#0a0a0a' })

    // Notch elements start hidden
    const notchEls = container.querySelectorAll('[data-notch]')
    gsap.set(notchEls, { opacity: 0 })

    // --- Intro: fade cards in with stagger ---
    const introTl = gsap.timeline({ delay: 0.15 })
    introTl.to(allCards, {
      opacity: 1,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
    })

    // --- Progress-driven animation ---
    const applyProgress = (p: number) => {
      for (const [key, el] of Object.entries(els)) {
        if (!el) continue
        const s = SCATTER[key]
        gsap.to(el, {
          x: s.x * (1 - p),
          y: s.y * (1 - p),
          rotation: s.rotation * (1 - p),
          scale: s.scale + (1 - s.scale) * p,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: true,
        })
      }

      // Notch elements
      gsap.to(notchEls, {
        opacity: p,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    // --- Wheel (desktop) ---
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY / 800
      progressRef.current = Math.max(0, Math.min(1, progressRef.current + delta))
      applyProgress(progressRef.current)
    }

    // --- Touch (mobile) ---
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const deltaY = touchStartY.current - e.touches[0].clientY
      touchStartY.current = e.touches[0].clientY
      const delta = deltaY / 400
      progressRef.current = Math.max(0, Math.min(1, progressRef.current + delta))
      applyProgress(progressRef.current)
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      introTl.kill()
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden flex">

      {/* Background layer — always dark */}
      <div ref={bgRef} className="absolute inset-0 z-0" style={{ backgroundColor: '#0a0a0a' }} />

      {/* ══════════════════════════════════════════
          LEFT COLUMN — always visible
      ══════════════════════════════════════════ */}
      <div className="relative z-10 w-full md:w-[45%] h-full flex flex-col p-8 md:p-10 shrink-0 overflow-hidden">

        {/* Brand block */}
        <div ref={brandRef} className="flex flex-col justify-between bg-gray-100 rounded-2xl p-4 md:p-5" style={{ height: '14rem' }}>

          {/* FATRAP logotype */}
          <div>
            <Image
              src="/images/logo-wordmark-compressed.png"
              alt="FATRAP"
              width={3500}
              height={700}
              className="w-64 md:w-72 h-auto"
              priority
            />
          </div>

          {/* Description with inline icons */}
          <p className="text-xs md:text-sm text-gray-700 w-full" style={{ lineHeight: '2' }}>
            <Image
              src="/images/icon-fatrap-logo.png"
              alt="Fatrap"
              width={80}
              height={24}
              className="inline-block align-middle mx-0.5 transition-transform duration-300 ease-out hover:scale-110 hover:-translate-y-0.5 hover:rotate-[-3deg]"
              style={{ height: '1.6em', width: 'auto' }}
            />
            {' '}Brand is an open source streetwear{' '}
            <Image
              src="/images/icon-project.png"
              alt="project"
              width={100}
              height={30}
              className="inline-block align-middle mx-0.5 transition-transform duration-300 ease-out hover:scale-110 hover:-translate-y-0.5 hover:rotate-[2deg]"
              style={{ height: '1.8em', width: 'auto' }}
            />
            {' '}&mdash; all design files,{' '}
            <Image
              src="/images/icon-printer.png"
              alt="print"
              width={28}
              height={28}
              className="inline-block align-middle mx-0.5 transition-transform duration-300 ease-out hover:scale-110 hover:-translate-y-0.5 hover:rotate-[-2deg]"
              style={{ height: '1.6em', width: 'auto' }}
            />
            {' '}print-ready artwork and brand assets are freely available. Download,{' '}
            <Image
              src="/images/icon-print.png"
              alt="print"
              width={70}
              height={26}
              className="inline-block align-middle mx-0.5 transition-transform duration-300 ease-out hover:scale-110 hover:-translate-y-0.5 hover:rotate-[3deg]"
              style={{ height: '1.8em', width: 'auto' }}
            />
            {' '}and wear.
          </p>

          {/* Make it yours CTA */}
          <div className="flex items-center justify-end">
            <GooeyMakeItYoursButton onClick={onMakeItYours} />
          </div>
        </div>

        {/* ── Bottom photo grid ── */}
        <div className="grid grid-cols-2 grid-rows-[2fr_1fr] gap-2 flex-1 min-h-48 mt-4">

          {/* Cell 1 — #PRINTFILES (top-left) */}
          <GridCell item={gridItems[0]} onNavigate={onNavigate} innerRef={cell1Ref} />

          {/* Cell 2 — #CONTRIBUTE (top-right) */}
          <GridCell item={gridItems[1]} onNavigate={onNavigate} innerRef={cell2Ref} />

          {/* Cell 3 — @FATRAP.CO (full width) */}
          <GridCell item={gridItems[2]} onNavigate={onNavigate} className="col-span-2" innerRef={cell3Ref} />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT COLUMN — hidden on mobile
      ══════════════════════════════════════════ */}
      <div className="relative z-10 hidden md:flex flex-1 h-full relative">

        {/* Photo — clipped to rounded-2xl */}
        <div ref={heroRef} className="absolute top-8 md:top-10 bottom-8 md:bottom-10 left-0 right-8 md:right-10 rounded-2xl overflow-hidden">
          {HERO_PHOTO ? (
            <Image
              src={HERO_PHOTO}
              alt="Fatrap crew"
              fill
              className="object-cover object-top"
              priority
            />
          ) : (
            <div className="w-full h-full bg-neutral-400 flex items-end p-6">
              <span className="text-neutral-600 text-xs uppercase tracking-widest font-semibold">
                Hero photo — add URL to HERO_PHOTO in HomePage.tsx
              </span>
            </div>
          )}

          {/* Notch: masks the top-right corner so the photo doesn't show behind the button */}
          <div
            data-notch
            className="absolute top-0 right-0 bg-[#e4e4e4] rounded-bl-[16px] z-[5]"
            style={{ width: 230, height: 62 }}
          />
          {/* Inverse radius scoop — left side of notch */}
          <div
            data-notch
            className="absolute z-[5]"
            style={{
              top: 0,
              right: 230,
              width: 16,
              height: 16,
              background: 'radial-gradient(circle at 0% 100%, transparent 16px, #e4e4e4 16.5px)',
            }}
          />
          {/* Inverse radius scoop — bottom-right of notch */}
          <div
            data-notch
            className="absolute z-[5]"
            style={{
              top: 62,
              right: 0,
              width: 16,
              height: 16,
              background: 'radial-gradient(circle at 0% 100%, transparent 16px, #e4e4e4 16.5px)',
            }}
          />
        </div>

        {/* Contact button — aligned to top-right of the hero image */}
        <div ref={contactRef} className="absolute top-10 right-10 z-10">
          {/* Desktop: Gooey liquid button */}
          <div className="hidden md:block">
            <GooeyContactButton onClick={() => onNavigate('/contact')} />
          </div>
          {/* Mobile: simple pill button */}
          <button
            onClick={() => onNavigate('/contact')}
            className="flex md:hidden items-center gap-2 bg-white rounded-full px-5 py-2.5 font-bold text-sm uppercase tracking-widest hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            CONTACT US
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M2 7L12 13L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

      </div>

    </div>
  )
}

/* ── Shared grid cell ── */
interface GridCellProps {
  item: { tag: string; path: string; photo: string | null; bg: string; href?: string }
  onNavigate: (path: string) => void
  className?: string
  innerRef?: React.RefObject<HTMLDivElement | HTMLAnchorElement | null>
}

function GridCell({ item, onNavigate, className = '', innerRef }: GridCellProps) {
  const baseClassName = `relative rounded-xl overflow-hidden cursor-pointer hover:opacity-90 active:opacity-80 transition-opacity ${item.bg} ${className}`

  const content = (
    <>
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" style={{ height: '100rem' }} />
      <span className="absolute bottom-2 left-3 text-white font-black text-xs md:text-sm uppercase tracking-wide drop-shadow">
        {item.tag}
      </span>
    </>
  )

  if (item.href) {
    return (
      <a ref={innerRef as React.RefObject<HTMLAnchorElement | null>} href={item.href} target="_blank" rel="noopener noreferrer" className={baseClassName}>
        {content}
      </a>
    )
  }

  return (
    <div
      ref={innerRef as React.RefObject<HTMLDivElement | null>}
      className={baseClassName}
      onClick={() => onNavigate(item.path)}
    >
      {content}
    </div>
  )
}
