'use client'

import React from 'react'

interface WindowFrameProps {
  children: React.ReactNode
  title?: string
  onMenuToggle?: () => void
}

export default function WindowFrame({ children, title, onMenuToggle }: WindowFrameProps) {
  return (
    <div className="w-full h-screen flex flex-col bg-white overflow-hidden">
      {/* Title Bar */}
      <div className="h-11 bg-gradient-to-b from-gray-100 to-gray-50 border-b border-gray-200/80 flex items-center px-4 shrink-0 relative">

        {/* Hamburger — mobile only, left side */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors"
          aria-label="Toggle menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Title — centered */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-sm text-gray-600 font-medium tracking-wide">
            {title || 'FATRAP BRAND ®'}
          </span>
        </div>

        {/* Spacer right (balances hamburger on mobile) */}
        <div className="md:hidden ml-auto w-8" />
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {children}
      </div>
    </div>
  )
}
