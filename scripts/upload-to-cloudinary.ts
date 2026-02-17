import { v2 as cloudinary } from 'cloudinary'
import * as fs from 'fs'
import * as path from 'path'

// Only cloud_name needed for unsigned uploads
cloudinary.config({
  cloud_name: 'dduwvhgl9',
})

const UPLOAD_PRESET = 'fatrap_unsigned'
const PHOTOS_BASE = 'G:/Mi unidad/Fatrap 24-25/Fatrap [time machine]/Photos'

const GALLERY_FOLDERS: Record<string, string> = {
  '/gallery/2018-first-steps': '(2018) First steps',
  '/gallery/2023-fatrap-caribu': '(2023) Fatrap x caribú',
  '/gallery/2024-fatrap-college': '(2024) Fatrap college',
  '/gallery/2024-les-santes-olimpiques': '(2024) Fatrap x Les Santes Olímpiques',
  '/gallery/2025-dont-stay-relevant': "(2025) Fatrap Don't Stay Relevant",
  '/gallery/2025-welcome-to-basics': '(2025) Fatrap Welcome to the basics',
  '/gallery/2025-fatrap-court': '(2025) Fatrap x court',
  '/gallery/2025-pa-esa-mierda': '(2025) Fatrap, pa esa mierda ya no tengo tiempo',
}

interface UploadedFile {
  name: string
  type: string
  path: string
  thumbnail: string
  galleryPath: string
}

async function uploadGallery(galleryPath: string, folderName: string): Promise<UploadedFile[]> {
  const fullPath = path.join(PHOTOS_BASE, folderName)

  if (!fs.existsSync(fullPath)) {
    console.error(`Folder not found: ${fullPath}`)
    return []
  }

  const files = fs.readdirSync(fullPath).filter(f => {
    const ext = f.toLowerCase()
    return ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png') || ext.endsWith('.webp')
  })

  console.log(`\nUploading ${files.length} files from "${folderName}"...`)

  const uploaded: UploadedFile[] = []
  const cloudinaryFolder = `fatrap${galleryPath}`

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const filePath = path.join(fullPath, file)

    try {
      const result = await cloudinary.uploader.unsigned_upload(filePath, UPLOAD_PRESET, {
        folder: cloudinaryFolder,
        resource_type: 'image',
      })

      uploaded.push({
        name: file,
        type: 'image',
        path: galleryPath,
        thumbnail: result.secure_url,
        galleryPath: galleryPath,
      })

      console.log(`  [${i + 1}/${files.length}] ${file} -> OK`)
    } catch (error: any) {
      console.error(`  [${i + 1}/${files.length}] ${file} -> FAILED:`, error?.message || error)
    }
  }

  return uploaded
}

async function main() {
  console.log('Starting Cloudinary upload (unsigned)...')
  console.log(`Base path: ${PHOTOS_BASE}`)
  console.log(`Upload preset: ${UPLOAD_PRESET}`)

  const allFiles: UploadedFile[] = []

  for (const [galleryPath, folderName] of Object.entries(GALLERY_FOLDERS)) {
    const files = await uploadGallery(galleryPath, folderName)
    allFiles.push(...files)
    console.log(`  -> ${files.length} files uploaded for ${folderName}`)
  }

  // Save mapping to JSON
  const outputPath = path.join(__dirname, 'cloudinary-urls.json')
  fs.writeFileSync(outputPath, JSON.stringify(allFiles, null, 2))
  console.log(`\nDone! ${allFiles.length} total files uploaded.`)
  console.log(`URL mapping saved to: ${outputPath}`)
}

main().catch(console.error)
