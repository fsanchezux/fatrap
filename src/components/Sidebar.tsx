'use client'

import React, { useState } from 'react'
import { ChevronDownIcon, ChevronRightIcon, getIconByName } from './Icons'

interface SidebarOption {
  id: number
  name: string
  icon: string
  path: string
  color?: string | null
  children?: SidebarOption[]
}

interface SidebarSection {
  id: number
  name: string
  options: SidebarOption[]
}

interface SidebarProps {
  sections: SidebarSection[]
  activePath: string
  onNavigate: (path: string) => void
}

// Paths that belong to a collapsible group in the sidebar
const STICKER_PATHS = ['/print/stickers/print', '/print/stickers/edit']

export default function Sidebar({ sections, activePath, onNavigate }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<number | string, boolean>>(
    sections.reduce((acc, section) => ({ ...acc, [section.id]: true }), { stickers: true } as Record<number | string, boolean>)
  )

  const toggleSection = (key: number | string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Check if any sticker subpath is active to keep group highlighted
  const stickerActive = STICKER_PATHS.includes(activePath)

  const renderOption = (option: SidebarOption, indent = false) => {
    const isActive = activePath === option.path

    // "Stickers" group: render as collapsible parent with sub-items
    if (option.path === '/print/stickers') {
      return (
        <li key={option.id}>
          {/* Stickers group header */}
          <button
            onClick={() => toggleSection('stickers')}
            className={`w-full px-4 py-1.5 flex items-center gap-2 text-sm transition-colors ${
              stickerActive ? 'text-blue-600' : 'text-gray-700 hover:bg-sidebar-hover'
            }`}
          >
            <span className="w-4 h-4 flex items-center justify-center">
              {getIconByName(option.icon, option.color || undefined)}
            </span>
            <span className="flex-1 truncate text-left">{option.name}</span>
            <span className="text-gray-400">
              {expandedSections['stickers'] ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </span>
          </button>

          {/* Sub-items */}
          {expandedSections['stickers'] && (
            <ul>
              {STICKER_PATHS.map((subPath, i) => {
                const labels = ['Print files', 'Edit']
                const icons = ['sticker', 'palette']
                const isSubActive = activePath === subPath
                return (
                  <li key={subPath}>
                    <button
                      onClick={() => onNavigate(subPath)}
                      className={`w-full pl-10 pr-4 py-1.5 flex items-center gap-2 text-sm transition-colors ${
                        isSubActive ? 'bg-blue-500/10 text-blue-600' : 'text-gray-600 hover:bg-sidebar-hover'
                      }`}
                    >
                      <span className="w-3 h-3 flex items-center justify-center opacity-70">
                        {getIconByName(icons[i])}
                      </span>
                      <span className="truncate">{labels[i]}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </li>
      )
    }

    return (
      <li key={option.id}>
        <button
          onClick={() => onNavigate(option.path)}
          className={`w-full ${indent ? 'pl-8' : 'px-4'} pr-4 py-1.5 flex items-center gap-2 text-sm transition-colors ${
            isActive ? 'bg-blue-500/10 text-blue-600' : 'text-gray-700 hover:bg-sidebar-hover'
          }`}
        >
          <span className="w-4 h-4 flex items-center justify-center">
            {getIconByName(option.icon, option.color || undefined)}
          </span>
          <span className="truncate">{option.name}</span>
        </button>
      </li>
    )
  }

  return (
    <aside className="w-56 h-full bg-sidebar-bg/80 backdrop-blur-sm border-r border-gray-200/50 flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="px-4 py-3 border-b border-gray-200/50">
        <div className="w-8 h-8 rounded-lg overflow-hidden">
          <img src="/logo.png" alt="Fatrap logo" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto py-2">
        {sections.map((section) => (
          <div key={section.id} className="mb-2">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-3 py-1 flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
            >
              {expandedSections[section.id] ? (
                <ChevronDownIcon className="text-gray-400" />
              ) : (
                <ChevronRightIcon className="text-gray-400" />
              )}
              {section.name}
            </button>

            {/* Section Options */}
            {expandedSections[section.id] && (
              <ul className="mt-1">
                {section.options.map((option) => renderOption(option))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}
