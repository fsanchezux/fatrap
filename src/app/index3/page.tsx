'use client'

import { useState } from 'react'
import WindowFrame from '@/components/WindowFrame'
import ContactForm from '@/components/ContactForm'
import HomePage from '@/components/HomePage'
import Explorer, { ExplorerSection, ExplorerFile } from '@/components/Explorer'
import cloudinaryUrls from '../../../scripts/cloudinary-urls.json'

// Group gallery files by their galleryPath so we can inject them into each leaf below
const galleryByPath: Record<string, ExplorerFile[]> = {}
for (const f of cloudinaryUrls as Array<{ name: string; thumbnail: string; galleryPath: string }>) {
  if (!galleryByPath[f.galleryPath]) galleryByPath[f.galleryPath] = []
  const idx = galleryByPath[f.galleryPath].length
  galleryByPath[f.galleryPath].push({
    id: `g-${f.galleryPath}-${idx}`,
    name: f.name,
    url: f.thumbnail,
    thumbnail: f.thumbnail,
  })
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

export default function Home() {
  const [explorerOpen, setExplorerOpen] = useState(false)
  const [explorerInitialLeafId, setExplorerInitialLeafId] = useState<string | undefined>(undefined)

  const openExplorer = (leafId?: string) => {
    setExplorerInitialLeafId(leafId)
    setExplorerOpen(true)
  }

  // Tree structure for the Explorer (mirrors original sidebar layout)
  const explorerTree: ExplorerSection[] = [
    {
      // No section label at the top — the user wants this section to start without a header
      groups: [
        {
          id: 'stickers',
          label: 'Stickers',
          icon: 'sticker',
          leaves: [
            {
              id: 'stickers-print',
              label: 'Print files',
              icon: 'sticker',
              files: stickerPrintFiles.map(f => ({ id: `sp-${f.id}`, name: f.name, url: f.thumbnail || '', thumbnail: f.thumbnail })),
            },
            {
              id: 'stickers-edit',
              label: 'Edit',
              icon: 'palette',
              files: stickerEditFiles.map((f, i) => ({ id: `se-${i}`, name: f.name, url: f.url, thumbnail: null })),
            },
          ],
        },
        {
          id: 'dtf',
          label: 'DTF',
          icon: 'dtf',
          leaves: [
            {
              id: 'dtf-print',
              label: 'Print files',
              icon: 'dtf',
              files: dtfPrintFiles.map(f => ({ id: `dp-${f.id}`, name: f.name, url: f.thumbnail || '', thumbnail: f.thumbnail })),
            },
            {
              id: 'dtf-edit',
              label: 'Edit',
              icon: 'palette',
              files: dtfEditFiles.map((f, i) => ({ id: `de-${i}`, name: f.name, url: f.url, thumbnail: null })),
            },
          ],
        },
      ],
    },
    {
      label: 'Gallery',
      leaves: [
        { id: 'gallery-2018', label: '(2018) First steps', icon: 'gallery', files: galleryByPath['/gallery/2018-first-steps'] || [] },
        { id: 'gallery-2023-caribu', label: '(2023) Fatrap x Caribu', icon: 'gallery', files: galleryByPath['/gallery/2023-fatrap-caribu'] || [] },
        { id: 'gallery-2024-college', label: '(2024) Fatrap College', icon: 'gallery', files: galleryByPath['/gallery/2024-fatrap-college'] || [] },
        { id: 'gallery-2024-santes', label: '(2024) Les Santes Olimpiques', icon: 'gallery', files: galleryByPath['/gallery/2024-les-santes-olimpiques'] || [] },
        { id: 'gallery-2025-dsr', label: "(2025) Fatrap Don't Stay Relevant", icon: 'gallery', files: galleryByPath['/gallery/2025-dont-stay-relevant'] || [] },
        { id: 'gallery-2025-basics', label: '(2025) Fatrap Welcome to the basics', icon: 'gallery', files: galleryByPath['/gallery/2025-welcome-to-basics'] || [] },
        { id: 'gallery-2025-court', label: '(2025) Fatrap x Court', icon: 'gallery', files: galleryByPath['/gallery/2025-fatrap-court'] || [] },
        { id: 'gallery-2025-pa-esa', label: "(2025) Fatrap Pa' esa mierda ya no tengo tiempo", icon: 'gallery', files: galleryByPath['/gallery/2025-pa-esa-mierda'] || [] },
      ],
    },
    {
      label: 'Contact us',
      leaves: [
        {
          id: 'contact-us',
          label: 'Contact us',
          icon: 'mail',
          files: [],
          renderContent: () => <ContactForm />,
        },
      ],
    },
  ]

  return (
    <WindowFrame>
      <main className="relative flex-1 flex flex-col bg-[#0a0a0a] overflow-hidden">
        <HomePage
          onNavigate={() => { /* legacy noop — kept to satisfy HomePage prop */ }}
          onOpenExplorer={openExplorer}
          onMakeItYours={() => { /* legacy noop — DIY flow removed */ }}
        />
      </main>

      {/* ── Explorer overlay — animates open/close on top of HomePage ── */}
      <Explorer
        tree={explorerTree}
        open={explorerOpen}
        onClose={() => setExplorerOpen(false)}
        initialLeafId={explorerInitialLeafId}
      />
    </WindowFrame>
  )
}
