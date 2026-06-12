// Builds the data the simplified index2.html UI consumes:
//
//   public/fatrap-data.json  -> { gallery: [{name,url,drop}], prints: [{name,url,group}] }
//        gallery = lifestyle photos (NOT the stampable files) shown in the grid,
//                  each tagged with its "drop" (collection).
//        prints  = the stampable print-ready files pool (Stickers + DTF).
//
//   public/drops.json        -> { "<drop>": ["<print file name>", ...] }
//        The editable drop -> stampable-files relation. Written only if it does
//        NOT already exist, so manual edits (or in-app editor exports) survive
//        re-runs of this script.
//
//   node scripts/build-index2-data.mjs

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'))

// Pretty drop labels per galleryPath — mirrors src/app/page.tsx
const GALLERY_LABELS = {
  '/gallery/2018-first-steps': '(2018) First steps',
  '/gallery/2023-fatrap-caribu': '(2023) Fatrap x Caribu',
  '/gallery/2024-fatrap-college': '(2024) Fatrap College',
  '/gallery/2024-les-santes-olimpiques': '(2024) Les Santes Olimpiques',
  '/gallery/2025-dont-stay-relevant': "(2025) Fatrap Don't Stay Relevant",
  '/gallery/2025-welcome-to-basics': '(2025) Fatrap Welcome to the basics',
  '/gallery/2025-fatrap-court': '(2025) Fatrap x Court',
  '/gallery/2025-pa-esa-mierda': "(2025) Fatrap Pa' esa mierda ya no tengo tiempo",
}
const titleFromPath = (p = '') =>
  p.split('/').filter(Boolean).pop().replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

const data = { gallery: [], prints: [] }

// Gallery photos — `thumbnail` is the base (full-res) Cloudinary URL
for (const f of read('scripts/cloudinary-urls.json')) {
  data.gallery.push({
    name: f.name,
    url: f.thumbnail,
    drop: GALLERY_LABELS[f.galleryPath] || titleFromPath(f.galleryPath || f.path),
  })
}

// Stampable print-ready files pool
for (const f of read('scripts/sticker-print-urls.json')) data.prints.push({ name: f.name, url: f.url, group: 'Stickers' })
for (const f of read('scripts/dtf-print-urls.json')) data.prints.push({ name: f.name, url: f.url, group: 'DTF' })

writeFileSync(join(root, 'public/fatrap-data.json'), JSON.stringify(data))

// Default drop -> stampable files relation (best-guess by name; edit in the app).
const DEFAULT_DROPS = {
  '(2024) Fatrap College': ['Logo_College_white.png', 'Logo_College_black.png', 'Logo_College_green.png'],
  '(2023) Fatrap x Caribu': ['sticker_logo_caribu.png', 'caribu_back_white.png', 'logo_pecho_caribu.png'],
  '(2025) Fatrap Welcome to the basics': ['back_basics_black_A3.png', 'back_basics_white_A3.png'],
  '(2025) Fatrap x Court': ['Court_black_vector.png', 'Court_white_vector.png'],
  "(2025) Fatrap Pa' esa mierda ya no tengo tiempo": ['Yanotengotiempo_white_A3.png', 'Yanotengotiempo_black_A3.png', 'Imprimir a metros_NoTengoTiempo.png'],
  '(2024) Les Santes Olimpiques': ['logo_retro_black.png', 'logo_retro_white.png'],
  '(2018) First steps': ['Box_logo_vector_black.png', 'Box_logo_vector_white.png', 'logo_pecho_black.png', 'logo_pecho_white.png'],
}

const dropsPath = join(root, 'public/drops.json')
let wroteDrops = false
if (!existsSync(dropsPath)) {
  writeFileSync(dropsPath, JSON.stringify(DEFAULT_DROPS, null, 2))
  wroteDrops = true
}

console.log(`Wrote public/fatrap-data.json — ${data.gallery.length} photos, ${data.prints.length} stampable files`)
console.log(wroteDrops ? 'Wrote public/drops.json (default relation)' : 'Kept existing public/drops.json (not overwritten)')
const drops = [...new Set(data.gallery.map((g) => g.drop))]
console.log('Drops:', drops)
