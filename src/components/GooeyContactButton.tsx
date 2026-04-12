'use client'

import React, { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'

interface GooeyContactButtonProps {
  onClick: () => void
}

export default function GooeyContactButton({ onClick }: GooeyContactButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const idleTl = useRef<gsap.core.Timeline | null>(null)

  // Idle breathing
  useEffect(() => {
    if (!circleRef.current) return
    idleTl.current = gsap.timeline({ repeat: -1, yoyo: true, delay: 0.3 })
    idleTl.current.to(circleRef.current, {
      x: 7,
      duration: 1.8,
      ease: 'sine.inOut',
    })
    return () => { idleTl.current?.kill() }
  }, [])

  const handleEnter = useCallback(() => {
    if (!circleRef.current || !pillRef.current) return
    idleTl.current?.pause()
    gsap.to(circleRef.current, {
      x: 22,
      scale: 1.12,
      duration: 0.55,
      ease: 'elastic.out(1, 0.4)',
      overwrite: true,
    })
    gsap.to(pillRef.current, {
      scaleX: 1.03,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: true,
    })
  }, [])

  const handleLeave = useCallback(() => {
    if (!circleRef.current || !pillRef.current) return
    gsap.to(circleRef.current, {
      x: 0,
      scale: 1,
      duration: 0.7,
      ease: 'elastic.out(1, 0.25)',
      overwrite: true,
      onComplete: () => { idleTl.current?.resume() },
    })
    gsap.to(pillRef.current, {
      scaleX: 1,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: true,
    })
  }, [])

  return (
    <>
      {/* SVG gooey filter definition */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <filter id="gooey-contact">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 30 -11"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div
        ref={containerRef}
        className="relative cursor-pointer select-none"
        onClick={onClick}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{ filter: 'url(#gooey-contact)' }}
      >
        {/* Row layout: pill + gap + circle. The gooey filter bridges the gap. */}
        <div className="flex items-center" style={{ gap: 6 }}>
          {/* Pill body */}
          <div
            ref={pillRef}
            className="rounded-full font-bold text-sm uppercase tracking-widest whitespace-nowrap text-white"
            style={{
              padding: '13px 26px',
              transformOrigin: 'left center',
              backgroundColor: '#E8330A',
            }}
          >
            CONTACT US
          </div>

          {/* Circle — sits next to the pill with a small gap */}
          <div
            ref={circleRef}
            className="rounded-full flex items-center justify-center flex-shrink-0"
            style={{ width: 46, height: 46, backgroundColor: '#E8330A' }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M2 7L12 13L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </>
  )
}
