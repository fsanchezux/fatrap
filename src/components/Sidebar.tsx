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
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
  /** When true the sidebar is always a slide-over drawer (even on desktop) */
  isLanding?: boolean
}

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

const PATH_TO_GROUP: Record<string, string> = {
  '/print/stickers': 'stickers',
  '/print/dtf': 'dtf',
}

function HamburgerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function Sidebar({ sections, activePath, onNavigate, isOpen, onClose, onOpen, isLanding = false }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<number | string, boolean>>(
    sections.reduce(
      (acc, section) => ({ ...acc, [section.id]: true }),
      { stickers: true, dtf: true } as Record<number | string, boolean>
    )
  )

  const toggleSection = (key: number | string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleNavigate = (path: string) => {
    onNavigate(path)
    onClose()
  }

  const renderOption = (option: SidebarOption) => {
    const groupKey = PATH_TO_GROUP[option.path]

    if (groupKey) {
      const group = GROUPS[groupKey]
      const groupActive = group.paths.includes(activePath)

      return (
        <li key={option.id}>
          <button
            onClick={() => toggleSection(groupKey)}
            className={`w-full px-4 py-1.5 flex items-center gap-2 text-sm transition-colors ${
              groupActive ? 'text-blue-600' : 'text-gray-700 hover:bg-gray-100'
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
                      onClick={() => handleNavigate(subPath)}
                      className={`w-full pl-10 pr-4 py-1.5 flex items-center gap-2 text-sm transition-colors ${
                        isSubActive ? 'bg-blue-500/10 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
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

    const isActive = activePath === option.path
    return (
      <li key={option.id}>
        <button
          onClick={() => handleNavigate(option.path)}
          className={`w-full px-4 py-1.5 flex items-center gap-2 text-sm transition-colors ${
            isActive ? 'bg-blue-500/10 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
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

  const sidebarContent = (
    <aside className="w-56 h-full bg-[#f5f5f5] border-r border-gray-200/60 flex flex-col overflow-hidden">
      {/* Logo header — flush to top */}
      <div className="px-4 pt-5 pb-4 flex items-center justify-between border-b border-gray-200/60">
        <button onClick={() => onNavigate('/')} className="block">
          <div className="w-14 h-14 rounded-xl overflow-hidden">
            <img src="/logo.png" alt="Fatrap logo" className="w-full h-full object-contain" />
          </div>
        </button>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors"
          aria-label="Close menu"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {/* Inicio */}
        <div className="mb-2 px-2">
          <button
            onClick={() => handleNavigate('/')}
            className={`w-full px-3 py-2 flex items-center gap-2 text-sm font-semibold rounded-lg transition-colors ${
              activePath === '' ? 'bg-blue-500/10 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h4a1 1 0 001-1v-3h2v3a1 1 0 001 1h4a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Inicio
          </button>
        </div>

        {sections.map((section) => (
          <div key={section.id} className="mb-2">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-3 py-1 flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600"
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

  // On the landing page the sidebar is ALWAYS a slide-over drawer (all screen sizes).
  // On inner pages it behaves as a persistent sidebar on desktop.
  if (isLanding) {
    return (
      <>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={onClose}
            />
            <div className="fixed inset-y-0 left-0 z-50">
              {sidebarContent}
            </div>
          </>
        )}
      </>
    )
  }

  return (
    <>
      {/* Desktop — always visible */}
      <div className="hidden md:block h-full shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile — hamburger button (when closed) */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="fixed top-4 left-4 z-40 md:hidden p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors shadow-sm"
          aria-label="Open menu"
        >
          <HamburgerIcon />
        </button>
      )}

      {/* Mobile — drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 z-50 md:hidden">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  )
}
