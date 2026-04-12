'use client'

import React, { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'

interface GooeyMakeItYoursButtonProps {
  onClick: () => void
}

export default function GooeyMakeItYoursButton({ onClick }: GooeyMakeItYoursButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const blobRef = useRef<HTMLDivElement>(null)
  const idleTl = useRef<gsap.core.Timeline | null>(null)

  // Idle: small blob orbits around the main circle
  useEffect(() => {
    if (!blobRef.current) return
    idleTl.current = gsap.timeline({ repeat: -1, delay: 0.3 })
    idleTl.current
      .to(blobRef.current, { x: 18, y: -10, duration: 1.4, ease: 'sine.inOut' })
      .to(blobRef.current, { x: 10, y: 18, duration: 1.4, ease: 'sine.inOut' })
      .to(blobRef.current, { x: -14, y: 10, duration: 1.4, ease: 'sine.inOut' })
      .to(blobRef.current, { x: -8, y: -16, duration: 1.4, ease: 'sine.inOut' })
      .to(blobRef.current, { x: 0, y: 0, duration: 1.2, ease: 'sine.inOut' })
    return () => { idleTl.current?.kill() }
  }, [])

  const handleEnter = useCallback(() => {
    if (!mainRef.current || !blobRef.current) return
    idleTl.current?.pause()
    gsap.to(mainRef.current, {
      scale: 1.1,
      duration: 0.4,
      ease: 'elastic.out(1, 0.4)',
      overwrite: true,
    })
    gsap.to(blobRef.current, {
      x: 28,
      y: 0,
      scale: 1.3,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)',
      overwrite: true,
    })
  }, [])

  const handleLeave = useCallback(() => {
    if (!mainRef.current || !blobRef.current) return
    gsap.to(mainRef.current, {
      scale: 1,
      duration: 0.6,
      ease: 'elastic.out(1, 0.3)',
      overwrite: true,
    })
    gsap.to(blobRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: 'elastic.out(1, 0.25)',
      overwrite: true,
      onComplete: () => { idleTl.current?.restart() },
    })
  }, [])

  return (
    <>
      {/* SVG gooey filter */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <filter id="gooey-miy">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 25 -10"
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
        aria-label="Make it yours"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick() }}
        style={{ padding: 10 }}
      >
        {/* Gooey-filtered layer: circles only */}
        <div style={{ filter: 'url(#gooey-miy)' }}>
          {/* Main circle */}
          <div
            ref={mainRef}
            className="relative rounded-full"
            style={{
              width: 60,
              height: 60,
              backgroundColor: '#E8330A',
            }}
          />

          {/* Small orbiting blob — merges with main circle via gooey filter */}
          <div
            ref={blobRef}
            className="absolute rounded-full"
            style={{
              width: 22,
              height: 22,
              backgroundColor: '#E8330A',
              top: '50%',
              left: '50%',
              marginTop: -11,
              marginLeft: -11,
            }}
          />
        </div>

        {/* Arrow icon — outside the gooey filter so it doesn't get blurred away */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M5 12H19M19 12L13 6M19 12L13 18"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </>
  )
}
