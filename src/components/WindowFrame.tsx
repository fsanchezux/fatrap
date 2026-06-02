'use client'

import React from 'react'

interface WindowFrameProps {
  children: React.ReactNode
}

// WindowFrame is now just a full-screen shell — no title bar
export default function WindowFrame({ children }: WindowFrameProps) {
  return (
    <div className="w-full h-screen flex overflow-hidden bg-[#0a0a0a]">
      {children}
    </div>
  )
}
