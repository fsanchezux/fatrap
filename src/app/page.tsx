'use client'

import { useState, useEffect } from 'react'
import WindowFrame from '@/components/WindowFrame'
import Sidebar from '@/components/Sidebar'
import Toolbar from '@/components/Toolbar'
import FileGrid from '@/components/FileGrid'
import ContactForm from '@/components/ContactForm'
import DownloadGrid from '@/components/DownloadGrid'

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

interface DownloadFile {
  name: string
  url: string
}

// Sticker print images (Cloudinary)
const stickerPrintFiles: FileItem[] = [
  { id: 101, name: 'sticker_logo_caribu.png', type: 'image', path: '/print/stickers/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771440070/fatrap/print/stickers/hwsrel4fo1mviqtaemtf.png' },
  { id: 102, name: 'sticker_logo_pequeño.png', type: 'image', path: '/print/stickers/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771440072/fatrap/print/stickers/s7qjv99zowrqvq8ldm3t.png' },
  { id: 103, name: 'a4_square_logo.png', type: 'image', path: '/print/stickers/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771440072/fatrap/print/stickers/f0ksktufczxjkqct9svn.png' },
  { id: 104, name: 'a4_lettering_sticker.png', type: 'image', path: '/print/stickers/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771440073/fatrap/print/stickers/q4inbuv7snxncdixwfgj.png' },
  { id: 105, name: 'fatrap_lettering sticker.png', type: 'image', path: '/print/stickers/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771440074/fatrap/print/stickers/jxvywm78698ighyia2ht.png' },
]

// Sticker edit files (Affinity Designer .af)
const stickerEditFiles: DownloadFile[] = [
  { name: 'fatrap_lettering sticker.af', url: 'https://res.cloudinary.com/dduwvhgl9/raw/upload/v1771440192/fatrap/edit/stickers/ptpzvk4upt8xo1taxapb.af' },
  { name: 'round logo sticker.af', url: 'https://res.cloudinary.com/dduwvhgl9/raw/upload/v1771440193/fatrap/edit/stickers/fwcsvv3idtncm8xzi9mi.af' },
  { name: 'sticker_logo_pequeño.af', url: 'https://res.cloudinary.com/dduwvhgl9/raw/upload/v1771440193/fatrap/edit/stickers/mphcmlmhkwglrcamdww3.af' },
  { name: 'sticker_logo_caribu.af', url: 'https://res.cloudinary.com/dduwvhgl9/raw/upload/v1771440194/fatrap/edit/stickers/xvdpxssdufdk5c5cvehu.af' },
  { name: 'a4_lettering_sticker.af', url: 'https://res.cloudinary.com/dduwvhgl9/raw/upload/v1771440195/fatrap/edit/stickers/dq2adm93wxjkkjwetipe.af' },
  { name: 'a4_square_logo.af', url: 'https://res.cloudinary.com/dduwvhgl9/raw/upload/v1771440195/fatrap/edit/stickers/wu6ftrnhvob4ocdndm0f.af' },
]

// Default sidebar data
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
      { id: 111, name: '(2025) Fatrap Pa\' esa mierda ya no tengo tiempo', icon: 'gallery', path: '/gallery/2025-pa-esa-mierda' },
    ],
  },
  {
    id: 3,
    name: 'Contact us',
    options: [
      { id: 120, name: 'Contact us', icon: 'mail', path: '/contact' },
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
    'Print files': 'Stickers — Print files',
    'Edit': 'Stickers — Edit files',
  }

  const getWindowTitle = () => {
    if (!activePath) return undefined
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

  // Decide what to render in the main area
  const renderMain = () => {
    if (activePath === '/contact') {
      return <ContactForm />
    }
    if (activePath === '/print/stickers/print') {
      return (
        <>
          <Toolbar title={getTitle()} viewMode={viewMode} onViewModeChange={setViewMode} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <FileGrid files={stickerPrintFiles} viewMode={viewMode} />
        </>
      )
    }
    if (activePath === '/print/stickers/edit') {
      return (
        <>
          <Toolbar title={getTitle()} viewMode={viewMode} onViewModeChange={setViewMode} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <DownloadGrid files={stickerEditFiles} />
        </>
      )
    }
    return (
      <>
        <Toolbar title={getTitle()} viewMode={viewMode} onViewModeChange={setViewMode} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <FileGrid files={filteredFiles} viewMode={viewMode} />
      </>
    )
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
        {renderMain()}
      </main>
    </WindowFrame>
  )
}
