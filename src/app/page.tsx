'use client'

import { useState, useEffect } from 'react'
import WindowFrame from '@/components/WindowFrame'
import Sidebar from '@/components/Sidebar'
import Toolbar from '@/components/Toolbar'
import FileGrid from '@/components/FileGrid'
import ContactForm from '@/components/ContactForm'

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

interface FileItem {
  id: number
  name: string
  type: string
  thumbnail?: string | null
  path: string
}

// Default sidebar data for when database is not available
const defaultSections: SidebarSection[] = [
  {
    id: 1,
    name: 'Print files',
    options: [
      { id: 1, name: 'Stickers', icon: 'sticker', path: '/print/stickers' },
      { id: 2, name: 'DTF', icon: 'dtf', path: '/print/dtf' },
      { id: 3, name: 'DIY recomendations', icon: 'palette', path: '/print/diy' },
    ],
  },
  {
    id: 2,
    name: 'Gallery',
    options: [
      { id: 4, name: '(2018) First steps', icon: 'gallery', path: '/gallery/2018-first-steps' },
      { id: 5, name: '(2023) Fatrap x Caribu', icon: 'gallery', path: '/gallery/2023-fatrap-caribu' },
      { id: 6, name: '(2024) Fatrap College', icon: 'gallery', path: '/gallery/2024-fatrap-college' },
      { id: 7, name: '(2024) Les Santes Olimpiques', icon: 'gallery', path: '/gallery/2024-les-santes-olimpiques' },
      { id: 8, name: '(2025) Fatrap Don\'t Stay Relevant', icon: 'gallery', path: '/gallery/2025-dont-stay-relevant' },
      { id: 9, name: '(2025) Fatrap Welcome to the basics', icon: 'gallery', path: '/gallery/2025-welcome-to-basics' },
      { id: 10, name: '(2025) Fatrap x Court', icon: 'gallery', path: '/gallery/2025-fatrap-court' },
      { id: 11, name: '(2025) Fatrap Pa\' esa mierda ya no tengo tiempo', icon: 'gallery', path: '/gallery/2025-pa-esa-mierda' },
    ],
  },
  {
    id: 3,
    name: 'Contact us',
    options: [
      { id: 12, name: 'Contact us', icon: 'mail', path: '/contact' },
    ],
  },
]

// Default files - populated from database/API
const defaultFiles: FileItem[] = []

export default function Home() {
  const [sections, setSections] = useState<SidebarSection[]>(defaultSections)
  const [files, setFiles] = useState<FileItem[]>(defaultFiles)
  const [activePath, setActivePath] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch sidebar sections from API
    async function fetchData() {
      try {
        const [sectionsRes, filesRes] = await Promise.all([
          fetch('/api/sidebar-options'),
          fetch('/api/files'),
        ])

        if (sectionsRes.ok) {
          const sectionsData = await sectionsRes.json()
          if (sectionsData.length > 0) {
            setSections(sectionsData)
          }
        }

        if (filesRes.ok) {
          const filesData = await filesRes.json()
          if (filesData.length > 0) {
            setFiles(filesData)
          }
        }
      } catch (error) {
        console.log('Using default data (API not available):', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleNavigate = (path: string) => {
    setActivePath(path)
  }

  const filteredFiles = files
    .filter((file) => activePath && file.path === activePath)
    .filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

  // Map option names to display titles
  const titleMap: Record<string, string> = {
    'DTF': 'PRINT Files',
  }

  const getWindowTitle = () => {
    if (!activePath) return undefined // shows default 'FATRAP BRAND ®'
    const option = sections
      .flatMap((s) => s.options)
      .find((o) => o.path === activePath)
    if (!option) return undefined
    return titleMap[option.name] || option.name
  }

  const getTitle = () => {
    if (!activePath) return 'Fatrap'
    const option = sections
      .flatMap((s) => s.options)
      .find((o) => o.path === activePath)
    if (!option) return 'Fatrap'
    return titleMap[option.name] || option.name
  }

  if (isLoading) {
    return (
      <WindowFrame>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </WindowFrame>
    )
  }

  return (
    <WindowFrame title={getWindowTitle()}>
      <Sidebar
        sections={sections}
        activePath={activePath ?? ''}
        onNavigate={handleNavigate}
      />
      <main className="flex-1 flex flex-col bg-white overflow-hidden">
        {activePath === '/contact' ? (
          <ContactForm />
        ) : (
          <>
            <Toolbar
              title={getTitle()}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <FileGrid files={filteredFiles} viewMode={viewMode} />
          </>
        )}
      </main>
    </WindowFrame>
  )
}
