'use client'

import React, { useRef, useEffect, useLayoutEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import GooeyContactButton from './GooeyContactButton'

interface HomePageProps {
  onNavigate: (path: string) => void
  onOpenExplorer: (initialLeafId?: string) => void
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

// Scattered positions for the floating mood-board state — collage feel:
// big, heavily rotated, overlapping pieces that snap into the grid on scroll.
const SCATTER: Record<string, { x: number; y: number; rotation: number; scale: number; z: number }> = {
  brand:   { x: 180,  y: 120,  rotation: -14, scale: 1.05, z: 3 },
  cell1:   { x: 80,   y: -180, rotation: 16,  scale: 1.15, z: 6 },
  cell2:   { x: 260,  y: 40,   rotation: -18, scale: 1.20, z: 5 },
  cell3:   { x: 140,  y: 220,  rotation: 10,  scale: 1.10, z: 4 },
  hero:    { x: -220, y: -60,  rotation: 12,  scale: 1.15, z: 2 },
  contact: { x: -120, y: 180,  rotation: -10, scale: 1.05, z: 7 },
}

export default function HomePage({ onNavigate, onOpenExplorer }: HomePageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const cell1Ref = useRef<HTMLDivElement>(null)
  const cell2Ref = useRef<HTMLDivElement>(null)
  const cell3Ref = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const scrollCtaRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef(0)
  const [clipNotch, setClipNotch] = useState('30%')
  const [imagesReady, setImagesReady] = useState(false)

  // ── Images that must be fully loaded before the intro fade-in runs ──
  const IMAGES_TO_PRELOAD = [
    '/images/logo-wordmark-compressed.png',
    '/images/contribute.png',
    '/images/ivangbbb-fatrap-30.png',
    '/images/hero.png',
  ]

  // Pre-paint hide: set every card to opacity 0 + scatter position synchronously,
  // BEFORE the browser ever paints them. Prevents any "pop in" before images load.
  useLayoutEffect(() => {
    const refs: Record<string, HTMLElement | null> = {
      brand: brandRef.current,
      cell1: cell1Ref.current,
      cell2: cell2Ref.current,
      cell3: cell3Ref.current,
      hero: heroRef.current,
      contact: contactRef.current,
    }
    for (const [key, el] of Object.entries(refs)) {
      if (!el) continue
      const s = SCATTER[key]
      gsap.set(el, {
        x: s.x,
        y: s.y + 40,
        rotation: s.rotation,
        scale: s.scale * 0.85,
        zIndex: s.z,
        opacity: 0,
      })
    }
    if (scrollCtaRef.current) gsap.set(scrollCtaRef.current, { opacity: 0 })
  }, [])

  // Preload all hero/grid images. When every one resolves we unlock the intro.
  useEffect(() => {
    let cancelled = false
    Promise.all(
      IMAGES_TO_PRELOAD.map(src => new Promise<void>(resolve => {
        const img = new window.Image()
        img.onload = () => resolve()
        img.onerror = () => resolve() // don't block on a 404
        img.src = src
      }))
    ).then(() => {
      if (!cancelled) setImagesReady(true)
    })
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Recalculate clip-path notch based on actual element positions
  const updateClipNotch = useCallback(() => {
    const contribute = cell2Ref.current
    const fatrap = cell3Ref.current
    if (!contribute || !fatrap) return
    const cRect = contribute.getBoundingClientRect()
    const fRect = fatrap.getBoundingClientRect()
    const overlap = cRect.bottom - fRect.top + 8 // +8px to match grid gap-2
    if (overlap > 0 && fRect.height > 0) {
      const pct = Math.round((overlap / fRect.height) * 100)
      setClipNotch(`${pct}%`)
    }
  }, [])

  // Observe resizes to keep clip-path in sync
  useEffect(() => {
    const contribute = cell2Ref.current
    const fatrap = cell3Ref.current
    if (!contribute || !fatrap) return

    const ro = new ResizeObserver(updateClipNotch)
    ro.observe(contribute)
    ro.observe(fatrap)

    return () => ro.disconnect()
  }, [updateClipNotch])

  useEffect(() => {
    // Hold the intro until all preload images have resolved
    if (!imagesReady) return

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

    // (useLayoutEffect above already set initial scatter+opacity 0 pre-paint.
    // Re-apply here in case the refs weren't ready then.)
    const ENTRY_Y_OFFSET = 40
    const ENTRY_SCALE_FACTOR = 0.85
    for (const [key, el] of Object.entries(els)) {
      if (!el) continue
      const s = SCATTER[key]
      gsap.set(el, {
        x: s.x,
        y: s.y + ENTRY_Y_OFFSET,
        rotation: s.rotation,
        scale: s.scale * ENTRY_SCALE_FACTOR,
        zIndex: s.z,
        opacity: 0,
      })
    }

    gsap.set(bg, { backgroundColor: '#0a0a0a' })

    // Notch elements start hidden
    const notchEls = container.querySelectorAll('[data-notch]')
    gsap.set(notchEls, { opacity: 0 })

    // --- Intro: each card rises + scales up + fades into its scatter slot ---
    const scrollCta = scrollCtaRef.current
    if (scrollCta) gsap.set(scrollCta, { opacity: 0 })

    const breathTls: gsap.core.Tween[] = []
    let ctaTween: gsap.core.Tween | null = null

    const introTl = gsap.timeline({ delay: 0.25 })
    Object.entries(els).forEach(([key, el], i) => {
      if (!el) return
      const s = SCATTER[key]
      introTl.to(el, {
        y: s.y,
        scale: s.scale,
        opacity: 1,
        duration: 1.5,
        ease: 'power3.out',
      }, i * 0.14)
    })

    // After intro finishes: kick off the very subtle breath drift + CTA fade-in
    introTl.call(() => {
      Object.entries(els).forEach(([key, el], i) => {
        if (!el) return
        const startY = SCATTER[key].y
        const amplitude = 4 + (i % 3) * 1.5 // ultra-subtle (4-7px)
        const t = gsap.to(el, {
          y: startY + amplitude,
          duration: 5.5 + (i % 4) * 0.6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.4,
        })
        breathTls.push(t)
      })

      if (scrollCta) {
        ctaTween = gsap.to(scrollCta, {
          opacity: 1,
          duration: 4,
          delay: 0.5,
          ease: 'power1.inOut',
        })
      }
    })

    // --- Single-shot scroll animation ---
    let ambientKilled = false
    const killAmbient = () => {
      if (ambientKilled) return
      ambientKilled = true
      introTl.kill()
      breathTls.forEach(t => t.kill())
      if (ctaTween) ctaTween.kill()
      if (scrollCta) {
        gsap.to(scrollCta, { opacity: 0, duration: 0.3, ease: 'power2.out', overwrite: true })
      }
    }

    // Driver object animated 0 -> 1 -> 0; onUpdate writes transforms directly
    // so it never fights GSAP's per-property tween table.
    const driver = { p: 0 }
    let direction: 'forward' | 'back' | 'idle' = 'idle'
    let activeTween: gsap.core.Tween | null = null

    const renderProgress = () => {
      const p = driver.p
      for (const [key, el] of Object.entries(els)) {
        if (!el) continue
        const s = SCATTER[key]
        gsap.set(el, {
          x: s.x * (1 - p),
          y: s.y * (1 - p),
          rotation: s.rotation * (1 - p),
          scale: s.scale + (1 - s.scale) * p,
        })
      }
      if (notchEls.length) gsap.set(notchEls, { opacity: p })
    }

    const ANIM_DURATION = 1.4

    const playForward = () => {
      if (activeTween) activeTween.kill()
      direction = 'forward'
      killAmbient()
      activeTween = gsap.to(driver, {
        p: 1,
        duration: ANIM_DURATION * (1 - driver.p),
        ease: 'power3.inOut',
        onUpdate: renderProgress,
        onComplete: () => {
          direction = 'idle'
          activeTween = null
          updateClipNotch()
        },
      })
    }

    const playBack = () => {
      if (activeTween) activeTween.kill()
      direction = 'back'

      // Phase 1: tween the cards smoothly back to the initial scatter state.
      const phase1 = gsap.to(driver, {
        p: 0,
        duration: ANIM_DURATION * driver.p,
        ease: 'power3.inOut',
        onUpdate: renderProgress,
        onComplete: () => {
          // Phase 2: kill ambient and fade everything out, then hard-reload.
          // The new mount keeps cards invisible until images preload, then runs intro.
          introTl.kill()
          breathTls.forEach(t => t.kill())
          if (ctaTween) ctaTween.kill()

          const FADE_OUT_DURATION = 1.2
          const fadeOutTl = gsap.timeline({
            onComplete: () => {
              window.location.reload()
            },
          })
          fadeOutTl.to(allCards, {
            opacity: 0,
            duration: FADE_OUT_DURATION,
            stagger: 0.05,
            ease: 'power2.inOut',
          }, 0)
          if (scrollCta) {
            fadeOutTl.to(scrollCta, {
              opacity: 0,
              duration: FADE_OUT_DURATION * 0.6,
              ease: 'power2.inOut',
            }, 0)
          }
          activeTween = fadeOutTl as unknown as gsap.core.Tween
        },
      })
      activeTween = phase1
    }

    // --- Wheel (desktop) — single tick triggers the whole animation ---
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (direction !== 'idle') return
      if (e.deltaY > 0 && driver.p < 1) {
        playForward()
      } else if (e.deltaY < 0 && driver.p >= 1) {
        playBack()
      }
    }

    // --- Touch (mobile) — single swipe triggers the whole animation ---
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (direction !== 'idle') return
      const dy = touchStartY.current - e.touches[0].clientY
      if (Math.abs(dy) < 10) return
      if (dy > 0 && driver.p < 1) {
        playForward()
      } else if (dy < 0 && driver.p >= 1) {
        playBack()
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      introTl.kill()
      if (ctaTween) ctaTween.kill()
      breathTls.forEach(t => t.kill())
      if (activeTween) activeTween.kill()
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
    }
  }, [updateClipNotch, imagesReady])

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden flex">

      {/* Background layer — always dark */}
      <div ref={bgRef} className="absolute inset-0 z-0" style={{ backgroundColor: '#0a0a0a' }} />

      {/* Scroll CTA — fades in slowly if user doesn't scroll */}
      <div
        ref={scrollCtaRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[15] pointer-events-none select-none"
        style={{ opacity: 0 }}
      >
        <div className="bg-neutral-700/80 backdrop-blur-sm text-white text-sm md:text-base font-medium px-5 py-2.5 rounded-full whitespace-nowrap">
          Scroll down to start
        </div>
      </div>

      {/* ══════════════════════════════════════════
          LEFT COLUMN — always visible
      ══════════════════════════════════════════ */}
      <div className="relative z-10 w-full md:w-[45%] h-full flex flex-col p-8 md:py-10 md:pl-10 md:pr-2 shrink-0 overflow-hidden">

        {/* Brand block */}
        <div ref={brandRef} className="relative flex flex-col bg-gray-100 rounded-2xl p-5 md:p-6">

          {/* FATRAP logotype + 01 */}
          <div className="flex items-start justify-between mb-2">
            <Image
              src="/images/logo-wordmark-compressed.png"
              alt="FATRAP"
              width={3500}
              height={700}
              className="w-48 md:w-64 lg:w-72 h-auto"
              priority
            />
            <span className="text-xs font-medium text-gray-400 tracking-wide">01</span>
          </div>

          {/* Description text — highlighted words in medium weight + darker, rest in lighter grey */}
          <div className="text-base md:text-lg lg:text-xl text-gray-400 w-full leading-snug md:pb-2 font-normal">
            Fatrap Brand is an <span className="font-medium text-gray-900">open source</span> streetwear project
            &mdash; all design files, print-ready artwork and brand assets
            are <span className="font-medium text-gray-900">freely available</span>. Download, remix, <span className="font-medium text-gray-900">and wear</span>.
          </div>
        </div>

        {/* ── Bottom photo grid — L-shaped @FATRAP card ── */}
        <div className="relative flex-1 min-h-48 mt-2">
          {/* CSS Grid: 2 cols × 3 rows. EXPLORE=short top-left, CONTRIBUTE=top-right spanning 2 rows,
              @FATRAP=full-width bottom spanning 2 rows with clip-path notch in top-left */}
          <div
            className="grid h-full gap-2"
            style={{
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '5.5rem 1fr 1fr 1fr',
            }}
          >
            {/* Explore our files — row1, col1 (compact, minimal pill-style) */}
            <div
              ref={cell1Ref}
              className="relative rounded-xl overflow-hidden cursor-pointer hover:opacity-90 active:opacity-80 transition-opacity px-5 z-10 flex items-center"
              style={{ backgroundColor: '#c3c491', gridColumn: '1', gridRow: '1' }}
              onClick={() => onOpenExplorer()}
            >
              <div className="flex items-center gap-4">
                <span className="rounded-full bg-black flex-shrink-0" style={{ width: '1.25rem', height: '1.25rem' }} />
                <span className="text-black font-medium text-xl md:text-2xl lg:text-3xl leading-tight">
                  Explore our files
                </span>
              </div>
            </div>

            {/* Contribute — row1+row2, col2 (with grey translucent pill bottom-right) */}
            <div
              ref={cell2Ref}
              className="relative rounded-xl overflow-hidden cursor-pointer hover:opacity-90 active:opacity-80 transition-opacity z-10"
              style={{ gridColumn: '2', gridRow: '1 / 4', height: 'clamp(8rem, 18vw, 14rem)' }}
              onClick={() => onOpenExplorer('contact-us')}
            >
              {gridItems[1].photo && (
                <Image src={gridItems[1].photo} alt={gridItems[1].tag} fill className="object-cover object-center" />
              )}
              {/* Grey translucent pill — bottom-right */}
              <span className="absolute bottom-3 right-3 bg-neutral-700/80 backdrop-blur-sm text-white text-xs md:text-sm font-medium px-3 py-1.5 rounded-md">
                Contribute
              </span>
            </div>

            {/* @FATRAP.CO — row2+row3, col1+col2, L-shaped with rounded notch */}
            <div
              ref={cell3Ref as React.RefObject<HTMLDivElement>}
              className="relative overflow-hidden cursor-pointer hover:opacity-90 active:opacity-80 transition-opacity rounded-xl"
              style={{
                gridColumn: '1 / 3',
                gridRow: '2 / 5',
              }}
              onClick={() => {
                if (gridItems[2].href) {
                  window.open(gridItems[2].href, '_blank')
                } else {
                  onNavigate(gridItems[2].path)
                }
              }}
            >
              {gridItems[2].photo && (
                <Image src={gridItems[2].photo} alt={gridItems[2].tag} fill className="object-cover object-top" />
              )}
              {/* Footer overlay — single translucent rectangle with 3 columns inside */}
              <div className="absolute bottom-3 left-3 right-3 bg-neutral-700/80 backdrop-blur-sm px-4 py-2 rounded-md flex items-center justify-between gap-4 text-white text-[10px] md:text-[11px] leading-tight z-[6]">
                <div className="flex flex-col">
                  <span className="font-semibold uppercase tracking-wide">FATRAP BRAND</span>
                  <span className="text-white/70">created by FSANCHEZ.CO</span>
                </div>
                <div className="hidden md:flex flex-col items-center text-center">
                  <span className="font-semibold">We don&apos;t gatekeep</span>
                  <span className="text-white/70">2026 © All rights are not reserved</span>
                </div>
                <div className="flex flex-col items-end text-right">
                  <span className="font-semibold">Follow us on instagram</span>
                  <span className="text-white/70">instagram.com/fatrap.co</span>
                </div>
              </div>

              {/* Notch overlay — covers top-right where Contribute sits. Clean L-shape, no scoops. */}
              <div
                className="absolute bg-[#0a0a0a] z-[5] rounded-bl-xl"
                style={{
                  top: 0,
                  right: 0,
                  width: 'calc(50% + 4px)',
                  height: clipNotch,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT COLUMN — hidden on mobile
      ══════════════════════════════════════════ */}
      <div className="relative z-10 hidden md:flex flex-1 h-full relative">

        {/* Photo — full rectangle, contact button overlays on top */}
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
        </div>

        {/* Contact button — overlays on top of the hero photo */}
        <div ref={contactRef} className="absolute top-10 right-10 z-20">
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
  labelPosition?: 'bottom-left' | 'top-left'
  style?: React.CSSProperties
}

function GridCell({ item, onNavigate, className = '', innerRef, labelPosition = 'bottom-left', style }: GridCellProps) {
  const baseClassName = `relative rounded-xl overflow-hidden cursor-pointer hover:opacity-90 active:opacity-80 transition-opacity ${item.bg} ${className}`

  const isTop = labelPosition === 'top-left'

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
      {isTop ? (
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" style={{ height: '50%' }} />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" style={{ height: '100rem' }} />
      )}
      <span className={`absolute text-white font-black text-xs md:text-sm uppercase tracking-wide drop-shadow ${isTop ? 'top-3 right-4' : 'bottom-2 left-3'}`}>
        {item.tag}
      </span>
    </>
  )

  if (item.href) {
    return (
      <a ref={innerRef as unknown as React.Ref<HTMLAnchorElement>} href={item.href} target="_blank" rel="noopener noreferrer" className={baseClassName} style={style}>
        {content}
      </a>
    )
  }

  return (
    <div
      ref={innerRef as unknown as React.Ref<HTMLDivElement>}
      className={baseClassName}
      style={style}
      onClick={() => onNavigate(item.path)}
    >
      {content}
    </div>
  )
}
