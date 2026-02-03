'use client'

import { useState, useEffect } from 'react'
import WindowFrame from '@/components/WindowFrame'
import Sidebar from '@/components/Sidebar'
import Toolbar from '@/components/Toolbar'
import FileGrid from '@/components/FileGrid'

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
    name: 'Favorites',
    options: [
      { id: 1, name: 'AirDrop', icon: 'airdrop', path: '/airdrop' },
      { id: 2, name: 'Recents', icon: 'clock', path: '/recents' },
      { id: 3, name: 'Applications', icon: 'apps', path: '/applications' },
      { id: 4, name: 'Desktop', icon: 'desktop', path: '/desktop' },
      { id: 5, name: 'Documents', icon: 'folder', path: '/documents' },
      { id: 6, name: 'Downloads', icon: 'download', path: '/downloads' },
    ],
  },
  {
    id: 2,
    name: 'iCloud',
    options: [
      { id: 7, name: 'iCloud Drive', icon: 'cloud', path: '/icloud-drive' },
      { id: 8, name: 'Shared', icon: 'users', path: '/shared' },
    ],
  },
  {
    id: 3,
    name: 'Tags',
    options: [
      { id: 9, name: 'Red', icon: 'tag', path: '/tags/red', color: '#ff6b6b' },
      { id: 10, name: 'Orange', icon: 'tag', path: '/tags/orange', color: '#ffa94d' },
      { id: 11, name: 'Yellow', icon: 'tag', path: '/tags/yellow', color: '#ffd43b' },
      { id: 12, name: 'Green', icon: 'tag', path: '/tags/green', color: '#69db7c' },
      { id: 13, name: 'Blue', icon: 'tag', path: '/tags/blue', color: '#4dabf7' },
      { id: 14, name: 'Purple', icon: 'tag', path: '/tags/purple', color: '#da77f2' },
      { id: 15, name: 'Gray', icon: 'tag', path: '/tags/gray', color: '#868e96' },
      { id: 16, name: 'All Tags...', icon: 'tags', path: '/tags' },
    ],
  },
]

// Default files for demo
const defaultFiles: FileItem[] = [
  { id: 1, name: 'tylenol.jpeg', type: 'image', path: '/files/tylenol.jpeg' },
  { id: 2, name: 'balm_dr_m.webp', type: 'image', path: '/files/balm_dr_m.webp' },
  { id: 3, name: 'bobby_pin.jpeg', type: 'image', path: '/files/bobby_pin.jpeg' },
  { id: 4, name: 'trident_white.webp', type: 'image', path: '/files/trident_white.webp' },
  { id: 5, name: 'keys3.webp', type: 'image', path: '/files/keys3.webp' },
  { id: 6, name: 'kindle.jpeg', type: 'image', path: '/files/kindle.jpeg' },
  { id: 7, name: 'lipstick_knife.jpeg', type: 'image', path: '/files/lipstick_knife.jpeg' },
  { id: 8, name: 'sunglasses_case.jpeg', type: 'image', path: '/files/sunglasses_case.jpeg' },
  { id: 9, name: 'waterbottle.jpeg', type: 'image', path: '/files/waterbottle.jpeg' },
  { id: 10, name: 'tampons.png', type: 'image', path: '/files/tampons.png' },
  { id: 11, name: 'sharpie.png', type: 'image', path: '/files/sharpie.png' },
  { id: 12, name: 'touchland.png', type: 'image', path: '/files/touchland.png' },
  { id: 13, name: 'receipt_sephora.jpeg', type: 'image', path: '/files/receipt_sephora.jpeg' },
  { id: 14, name: 'phone_charger.png', type: 'image', path: '/files/phone_charger.png' },
  { id: 15, name: 'aquaphor.jpeg', type: 'image', path: '/files/aquaphor.jpeg' },
]

export default function Home() {
  const [sections, setSections] = useState<SidebarSection[]>(defaultSections)
  const [files, setFiles] = useState<FileItem[]>(defaultFiles)
  const [activePath, setActivePath] = useState('/desktop')
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

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTitle = () => {
    const option = sections
      .flatMap((s) => s.options)
      .find((o) => o.path === activePath)
    return option?.name || 'WHAT\'S IN MY BAG'
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
    <WindowFrame>
      <Sidebar
        sections={sections}
        activePath={activePath}
        onNavigate={handleNavigate}
      />
      <main className="flex-1 flex flex-col bg-white">
        <Toolbar
          title={getTitle()}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <FileGrid files={filteredFiles} viewMode={viewMode} />
      </main>
    </WindowFrame>
  )
}
