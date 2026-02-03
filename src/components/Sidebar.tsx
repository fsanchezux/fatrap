'use client'

import React, { useState } from 'react'
import { ChevronDownIcon, ChevronRightIcon, getIconByName } from './Icons'

interface SidebarOption {
  id: number
  name: string
  icon: string
  path: string
  color?: string | null
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

export default function Sidebar({ sections, activePath, onNavigate }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>(
    sections.reduce((acc, section) => ({ ...acc, [section.id]: true }), {})
  )

  const toggleSection = (sectionId: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  return (
    <aside className="w-56 h-full bg-sidebar-bg/80 backdrop-blur-sm border-r border-gray-200/50 flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="px-4 py-3 border-b border-gray-200/50">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">F</span>
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
                {section.options.map((option) => (
                  <li key={option.id}>
                    <button
                      onClick={() => onNavigate(option.path)}
                      className={`w-full px-4 py-1.5 flex items-center gap-2 text-sm transition-colors ${
                        activePath === option.path
                          ? 'bg-blue-500/10 text-blue-600'
                          : 'text-gray-700 hover:bg-sidebar-hover'
                      }`}
                    >
                      <span className="w-4 h-4 flex items-center justify-center">
                        {getIconByName(option.icon, option.color || undefined)}
                      </span>
                      <span className="truncate">{option.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}
