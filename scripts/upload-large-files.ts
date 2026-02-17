import { v2 as cloudinary } from 'cloudinary'
import * as fs from 'fs'
import * as path from 'path'
import sharp from 'sharp'

cloudinary.config({
  cloud_name: 'dduwvhgl9',
})

const UPLOAD_PRESET = 'fatrap_unsigned'
const PHOTOS_BASE = 'G:/Mi unidad/Fatrap 24-25/Fatrap [time machine]/Photos'
const MAX_SIZE = 10 * 1024 * 1024 // 10MB Cloudinary limit
const TEMP_DIR = path.join(__dirname, 'temp')

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

async function compressImage(inputPath: string, outputPath: string): Promise<void> {
  await sharp(inputPath)
    .resize(2400, 2400, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toFile(outputPath)
}

async function main() {
  // Load existing URLs to know which files already uploaded
  const urlsPath = path.join(__dirname, 'cloudinary-urls.json')
  let existingFiles: UploadedFile[] = []
  if (fs.existsSync(urlsPath)) {
    existingFiles = JSON.parse(fs.readFileSync(urlsPath, 'utf-8'))
  }
  const existingSet = new Set(existingFiles.map(f => `${f.path}/${f.name}`))

  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true })
  }

  console.log(`Found ${existingFiles.length} already uploaded files.`)
  console.log('Uploading large/missing files with compression...\n')

  const newFiles: UploadedFile[] = []

  for (const [galleryPath, folderName] of Object.entries(GALLERY_FOLDERS)) {
    const fullPath = path.join(PHOTOS_BASE, folderName)

    if (!fs.existsSync(fullPath)) {
      console.log(`Folder not found: ${fullPath}`)
      continue
    }

    const files = fs.readdirSync(fullPath).filter(f => {
      const ext = f.toLowerCase()
      return ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png') || ext.endsWith('.webp') || ext.endsWith('.arw') || ext.endsWith('.raw') || ext.endsWith('.cr2') || ext.endsWith('.nef')
    })

    const missingFiles = files.filter(f => !existingSet.has(`${galleryPath}/${f}`))

    if (missingFiles.length === 0) {
      console.log(`[${folderName}] All ${files.length} files already uploaded. Skipping.`)
      continue
    }

    console.log(`[${folderName}] ${missingFiles.length} files to upload...`)
    const cloudinaryFolder = `fatrap${galleryPath}`

    for (let i = 0; i < missingFiles.length; i++) {
      const file = missingFiles[i]
      const filePath = path.join(fullPath, file)

      try {
        const stats = fs.statSync(filePath)
        let uploadPath = filePath
        const isRaw = /\.(arw|raw|cr2|nef)$/i.test(file)

        if (stats.size > MAX_SIZE || isRaw) {
          const tempPath = path.join(TEMP_DIR, `compressed_${file.replace(/\.\w+$/, '.jpg')}`)
          await compressImage(filePath, tempPath)
          uploadPath = tempPath
          const newSize = fs.statSync(tempPath).size
          console.log(`  Compressed ${file}: ${(stats.size / 1024 / 1024).toFixed(1)}MB -> ${(newSize / 1024 / 1024).toFixed(1)}MB`)
        }

        const result = await cloudinary.uploader.unsigned_upload(uploadPath, UPLOAD_PRESET, {
          folder: cloudinaryFolder,
          resource_type: 'image',
        })

        newFiles.push({
          name: file,
          type: 'image',
          path: galleryPath,
          thumbnail: result.secure_url,
          galleryPath: galleryPath,
        })

        console.log(`  [${i + 1}/${missingFiles.length}] ${file} -> OK`)

        // Clean up temp file
        if (uploadPath !== filePath && fs.existsSync(uploadPath)) {
          fs.unlinkSync(uploadPath)
        }
      } catch (error: any) {
        console.error(`  [${i + 1}/${missingFiles.length}] ${file} -> FAILED:`, error?.message || error)
      }
    }
  }

  // Merge with existing files and save
  const allFiles = [...existingFiles, ...newFiles]
  fs.writeFileSync(urlsPath, JSON.stringify(allFiles, null, 2))
  console.log(`\nDone! ${newFiles.length} new files uploaded. Total: ${allFiles.length}`)

  // Clean up temp directory
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true })
  }
}

main().catch(console.error)
