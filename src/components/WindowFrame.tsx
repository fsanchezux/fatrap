'use client'

import React from 'react'

interface WindowFrameProps {
  children: React.ReactNode
  title?: string
}

export default function WindowFrame({ children, title }: WindowFrameProps) {
  return (
    <div className="w-full h-screen flex flex-col bg-white overflow-hidden">
      {/* Window Title Bar */}
      <div className="h-11 bg-gradient-to-b from-gray-100 to-gray-50 border-b border-gray-200/80 flex items-center justify-center px-4 shrink-0">
        <span className="text-sm text-gray-600 font-medium tracking-wide">
          {title || 'FATRAP BRAND ®'}
        </span>
      </div>

      {/* Window Content */}
      <div className="flex-1 flex overflow-hidden">
        {children}
      </div>
    </div>
  )
}
