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

// Collapsible groups config
const GROUPS: Record<string, { paths: string[]; labels: string[]; icons: string[] }> = {
  stickers: {
    paths: ['/print/stickers/print', '/print/stickers/edit'],
    labels: ['Print files', 'Edit'],
    icons: ['sticker', 'palette'],
  },
  dtf: {
    paths: ['/print/dtf/print', '/print/dtf/edit'],
    labels: ['Print files', 'Edit'],
    icons: ['dtf', 'palette'],
  },
}

// Which option path triggers each group
const PATH_TO_GROUP: Record<string, string> = {
  '/print/stickers': 'stickers',
  '/print/dtf': 'dtf',
}

export default function Sidebar({ sections, activePath, onNavigate }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<number | string, boolean>>(
    sections.reduce(
      (acc, section) => ({ ...acc, [section.id]: true }),
      { stickers: true, dtf: true } as Record<number | string, boolean>
    )
  )

  const toggleSection = (key: number | string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const renderOption = (option: SidebarOption) => {
    const groupKey = PATH_TO_GROUP[option.path]

    // Render as collapsible group if this option has sub-paths
    if (groupKey) {
      const group = GROUPS[groupKey]
      const groupActive = group.paths.includes(activePath)

      return (
        <li key={option.id}>
          <button
            onClick={() => toggleSection(groupKey)}
            className={`w-full px-4 py-1.5 flex items-center gap-2 text-sm transition-colors ${
              groupActive ? 'text-blue-600' : 'text-gray-700 hover:bg-sidebar-hover'
            }`}
          >
            <span className="w-4 h-4 flex items-center justify-center">
              {getIconByName(option.icon, option.color || undefined)}
            </span>
            <span className="flex-1 truncate text-left">{option.name}</span>
            <span className="text-gray-400">
              {expandedSections[groupKey] ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </span>
          </button>

          {expandedSections[groupKey] && (
            <ul>
              {group.paths.map((subPath, i) => {
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
                        {getIconByName(group.icons[i])}
                      </span>
                      <span className="truncate">{group.labels[i]}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </li>
      )
    }

    // Regular option
    const isActive = activePath === option.path
    return (
      <li key={option.id}>
        <button
          onClick={() => onNavigate(option.path)}
          className={`w-full px-4 pr-4 py-1.5 flex items-center gap-2 text-sm transition-colors ${
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
