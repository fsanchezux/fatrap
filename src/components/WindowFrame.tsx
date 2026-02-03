'use client'

import React from 'react'

interface WindowFrameProps {
  children: React.ReactNode
}

export default function WindowFrame({ children }: WindowFrameProps) {
  return (
    <div className="w-full h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-6xl h-[80vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Window Title Bar */}
        <div className="h-11 bg-gradient-to-b from-gray-100 to-gray-50 border-b border-gray-200/80 flex items-center px-4 shrink-0">
          {/* Traffic lights */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e14640] hover:brightness-90 cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d4a028] hover:brightness-90 cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#24a932] hover:brightness-90 cursor-pointer" />
          </div>

          {/* Window title (can be customized) */}
          <div className="flex-1 text-center">
            <span className="text-sm text-gray-600 font-medium">WHAT&apos;S IN MY BAG</span>
          </div>

          {/* Spacer to balance the traffic lights */}
          <div className="w-14" />
        </div>

        {/* Window Content */}
        <div className="flex-1 flex overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
