'use client'

import React from 'react'
import { GridIcon, ListIcon, SearchIcon, ChevronDownIcon } from './Icons'

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
      {/* Left side - Navigation buttons */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
        <h1 className="text-sm font-medium text-gray-800 ml-2">{title}</h1>
      </div>

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

        {/* Sort button */}
        <button className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
          <span>Sort</span>
          <ChevronDownIcon />
        </button>

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
