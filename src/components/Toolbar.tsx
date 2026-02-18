'use client'

import React from 'react'
import { GridIcon, ListIcon, SearchIcon } from './Icons'

interface ToolbarProps {
  title: string
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function Toolbar({
  title,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange
}: ToolbarProps) {
  return (
    <div className="h-12 px-4 flex items-center justify-between border-b border-gray-200/50 bg-white/50 backdrop-blur-sm">
    


      {/* Right side - View controls and search */}
      <div className="flex items-center gap-3">
        {/* View mode toggle */}
        <div className="flex items-center bg-gray-100 rounded-md p-0.5">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded ${
              viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <GridIcon size={14} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded ${
              viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ListIcon size={14} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-40 pl-8 pr-3 py-1.5 text-sm bg-gray-100 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
      </div>
    </div>
  )
}
