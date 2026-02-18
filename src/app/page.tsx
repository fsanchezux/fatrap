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

// DTF print images (Cloudinary)
const dtfPrintFiles: FileItem[] = [
  { id: 201, name: 'DTF para imprimir a metros.png', type: 'image', path: '/print/dtf/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771441281/fatrap/print/dtf/swaki70qepphaajjch0t.png' },
  { id: 202, name: 'Box_logo_vector_black.png', type: 'image', path: '/print/dtf/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771441283/fatrap/print/dtf/iiwax53mgdsuejp5s8pj.png' },
  { id: 203, name: 'Box_logo_vector_white.png', type: 'image', path: '/print/dtf/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771441284/fatrap/print/dtf/iryumkidt1cbmp4s1nyb.png' },
  { id: 204, name: 'logo_pecho_black.png', type: 'image', path: '/print/dtf/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771441285/fatrap/print/dtf/qlcstmsuxy50qx0tvdt4.png' },
  { id: 205, name: 'logo_pecho_white.png', type: 'image', path: '/print/dtf/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771441286/fatrap/print/dtf/jltooquszhu5emwc1d0x.png' },
  { id: 206, name: 'back_basics_black_A3.png', type: 'image', path: '/print/dtf/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771441290/fatrap/print/dtf/m1nnabisly3gp746rn0i.png' },
  { id: 207, name: 'back_basics_white_A3.png', type: 'image', path: '/print/dtf/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771441291/fatrap/print/dtf/mfxyonlfaddzhttw6xjc.png' },
  { id: 208, name: 'Yanotengotiempo_white_A3.png', type: 'image', path: '/print/dtf/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771441292/fatrap/print/dtf/tpcv0w1x0rhjcmtf3gwl.png' },
  { id: 209, name: 'Yanotengotiempo_black_A3.png', type: 'image', path: '/print/dtf/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771441293/fatrap/print/dtf/hkarhvvocsuhomhljagz.png' },
  { id: 210, name: 'Imprimir a metros_NoTengoTiempo.png', type: 'image', path: '/print/dtf/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771441294/fatrap/print/dtf/nqvdndbplpdl7klmrhcz.png' },
  { id: 211, name: 'DontStayRelevant_A3.png', type: 'image', path: '/print/dtf/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771441295/fatrap/print/dtf/dztywzhwbslbiymqkxwg.png' },
  { id: 212, name: 'Logo_College_white.png', type: 'image', path: '/print/dtf/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771441297/fatrap/print/dtf/yymt0thautvquxub4ief.png' },
  { id: 213, name: 'Logo_College_black.png', type: 'image', path: '/print/dtf/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771441300/fatrap/print/dtf/vxtsy2scwd19gofp0fov.png' },
  { id: 214, name: 'Logo_College_green.png', type: 'image', path: '/print/dtf/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771441314/fatrap/print/dtf/juui0x3zcuh89odis7mn.png' },
  { id: 215, name: 'Court_black_vector.png', type: 'image', path: '/print/dtf/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771441319/fatrap/print/dtf/nllb4ovdazhusymwiiuh.png' },
  { id: 216, name: 'Court_white_vector.png', type: 'image', path: '/print/dtf/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771441319/fatrap/print/dtf/wlhpbvnrwj3iho9fuqth.png' },
  { id: 217, name: 'logo_retro_black.png', type: 'image', path: '/print/dtf/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771441320/fatrap/print/dtf/yeu4gjtms2ouirkyrjqq.png' },
  { id: 218, name: 'logo_retro_white.png', type: 'image', path: '/print/dtf/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771441321/fatrap/print/dtf/tgpmeoxtabdg2ojdrbf3.png' },
  { id: 219, name: 'caribu_back_white.png', type: 'image', path: '/print/dtf/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771441322/fatrap/print/dtf/rvuipkajahw4y6acmdhx.png' },
  { id: 220, name: 'logo_pecho_caribu.png', type: 'image', path: '/print/dtf/print', thumbnail: 'https://res.cloudinary.com/dduwvhgl9/image/upload/v1771441323/fatrap/print/dtf/ukxjylvjr89yetthzqna.png' },
]

// DTF edit files (Affinity Designer .af)
const dtfEditFiles: DownloadFile[] = [
  { name: 'Box_logo_vector.af', url: 'https://res.cloudinary.com/dduwvhgl9/raw/upload/v1771441332/fatrap/edit/dtf/bfshrmpvgcnawyizxwiu.af' },
  { name: 'logo_pecho.af', url: 'https://res.cloudinary.com/dduwvhgl9/raw/upload/v1771441333/fatrap/edit/dtf/c3kiqe2tqxoxgzp4cheu.af' },
  { name: 'Basics_back.af', url: 'https://res.cloudinary.com/dduwvhgl9/raw/upload/v1771441334/fatrap/edit/dtf/gd2nzbst3pwvmqjw878p.af' },
  { name: 'PaEsaMierdaYaNoTengoTiempo_vector.af', url: 'https://res.cloudinary.com/dduwvhgl9/raw/upload/v1771441335/fatrap/edit/dtf/fd8b72plojlsz9cxwo1p.af' },
  { name: 'Logo_College_vector.af', url: 'https://res.cloudinary.com/dduwvhgl9/raw/upload/v1771441336/fatrap/edit/dtf/mufzy75oyrqmhdrialzt.af' },
  { name: 'Dontstayrelevant_vector.af', url: 'https://res.cloudinary.com/dduwvhgl9/raw/upload/v1771441337/fatrap/edit/dtf/ayv9sihr40dl0xraeemj.af' },
  { name: 'Logo_Retro_vector.af', url: 'https://res.cloudinary.com/dduwvhgl9/raw/upload/v1771441339/fatrap/edit/dtf/s4zmuno47sygwkeiwsbv.af' },
  { name: 'Logo_Court_vector.af', url: 'https://res.cloudinary.com/dduwvhgl9/raw/upload/v1771441339/fatrap/edit/dtf/fj3cbya3y3mqx1nr8ntl.af' },
  { name: 'caribu_back.af', url: 'https://res.cloudinary.com/dduwvhgl9/raw/upload/v1771441340/fatrap/edit/dtf/o9dzxrmmk4x3pe7cby95.af' },
  { name: 'caribu_pecho.af', url: 'https://res.cloudinary.com/dduwvhgl9/raw/upload/v1771441341/fatrap/edit/dtf/woqwvzu2u8lgijl24hw3.af' },
  { name: 'round_logo_vector.af', url: 'https://res.cloudinary.com/dduwvhgl9/raw/upload/v1771441345/fatrap/edit/dtf/iqrqqc7lrse7st52f9op.af' },
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  // Map paths to display titles
  const pathTitleMap: Record<string, string> = {
    '/print/stickers/print': 'Stickers — Print files',
    '/print/stickers/edit': 'Stickers — Edit files',
    '/print/dtf/print': 'DTF — Print files',
    '/print/dtf/edit': 'DTF — Edit files',
  }

  const getWindowTitle = () => {
    if (!activePath) return undefined
    if (pathTitleMap[activePath]) return pathTitleMap[activePath]
    const option = sections.flatMap((s) => s.options).find((o) => o.path === activePath)
    return option?.name
  }

  const getTitle = () => {
    if (!activePath) return 'Fatrap'
    if (pathTitleMap[activePath]) return pathTitleMap[activePath]
    const option = sections.flatMap((s) => s.options).find((o) => o.path === activePath)
    return option?.name || 'Fatrap'
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
          <DownloadGrid files={stickerEditFiles} viewMode={viewMode} />
        </>
      )
    }
    if (activePath === '/print/dtf/print') {
      return (
        <>
          <Toolbar title={getTitle()} viewMode={viewMode} onViewModeChange={setViewMode} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <FileGrid files={dtfPrintFiles} viewMode={viewMode} />
        </>
      )
    }
    if (activePath === '/print/dtf/edit') {
      return (
        <>
          <Toolbar title={getTitle()} viewMode={viewMode} onViewModeChange={setViewMode} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <DownloadGrid files={dtfEditFiles} viewMode={viewMode} />
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
    <WindowFrame title={getWindowTitle()} onMenuToggle={() => setSidebarOpen(o => !o)}>
      <Sidebar
        sections={sections}
        activePath={activePath ?? ''}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 flex flex-col bg-white overflow-hidden">
        {renderMain()}
      </main>
    </WindowFrame>
  )
}
