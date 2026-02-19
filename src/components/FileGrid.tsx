'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { getIconByName, ImageIcon, FolderIcon } from './Icons'

interface FileItem {
  id: number
  name: string
  type: string
  thumbnail?: string | null
  path: string
}

interface FileGridProps {
  files: FileItem[]
  viewMode: 'grid' | 'list'
}

// -------------------------------------------------------------------
// Cloudinary URL helpers
// -------------------------------------------------------------------

/**
 * Injects Cloudinary transformation params into an upload URL.
 * Works for URLs like:
 *   https://res.cloudinary.com/<cloud>/image/upload/v123/path/file.jpg
 * Inserts the transforms after "/upload/".
 */
function cloudinaryTransform(url: string, transforms: string): string {
  if (!url || !url.includes('res.cloudinary.com')) return url
  return url.replace('/upload/', `/upload/${transforms}/`)
}

/** Tiny thumbnail for the grid (150 px wide, auto-height, webp, q_auto) */
function thumbUrl(url: string): string {
  return cloudinaryTransform(url, 'w_150,c_fill,f_webp,q_auto:low')
}

/** Blurred micro-preview for the placeholder (20 px wide) */
function blurUrl(url: string): string {
  return cloudinaryTransform(url, 'w_20,c_fill,f_webp,q_1,e_blur:200')
}

/** Full-quality image for the lightbox */
function fullUrl(url: string): string {
  return cloudinaryTransform(url, 'f_webp,q_auto:good')
}

/** Original file URL — no transforms, for download */
function originalUrl(url: string): string {
  if (!url || !url.includes('res.cloudinary.com')) return url
  // Remove any existing transform segments between /upload/ and /v<digits>/
  return url.replace(/\/upload\/([^/]+\/)*v\d+/, (match) => {
    // Keep only /upload/v<version>/
    const vMatch = match.match(/\/upload\/(v\d+)/)
    return vMatch ? `/upload/${vMatch[1]}` : '/upload/'
  })
}

// -------------------------------------------------------------------
// Thumbnail component with blur-up effect
// -------------------------------------------------------------------

function Thumb({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative w-full h-full">
      {/* Blur placeholder */}
      <img
        src={blurUrl(src)}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover scale-110"
        style={{ filter: 'blur(8px)', transition: 'opacity 0.3s' }}
      />
      {/* Real thumbnail */}
      <img
        src={thumbUrl(src)}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        style={{ opacity: loaded ? 1 : 0 }}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}

// -------------------------------------------------------------------
// Lightbox
// -------------------------------------------------------------------

interface LightboxProps {
  files: FileItem[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

function Lightbox({ files, index, onClose, onPrev, onNext }: LightboxProps) {
  const file = files[index]
  const [imgLoaded, setImgLoaded] = useState(false)

  // Reset loaded state when image changes
  useEffect(() => {
    setImgLoaded(false)
  }, [index])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, onPrev, onNext])

  if (!file) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Image container */}
      <div
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Blur placeholder while full image loads */}
        {!imgLoaded && file.thumbnail && (
          <img
            src={blurUrl(file.thumbnail)}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-contain"
            style={{ filter: 'blur(20px)', transform: 'scale(1.05)' }}
          />
        )}
        {file.thumbnail && (
          <img
            src={fullUrl(file.thumbnail)}
            alt={file.name}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl transition-opacity duration-300"
            style={{ opacity: imgLoaded ? 1 : 0 }}
            onLoad={() => setImgLoaded(true)}
          />
        )}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
        aria-label="Close"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Prev button */}
      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
          aria-label="Previous"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 2L4 8l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Next button */}
      {index < files.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
          aria-label="Next"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 2l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Bottom bar: filename + counter + download */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/70 text-sm">
        <div className="text-center space-y-0.5">
          <p className="font-medium">{file.name}</p>
          <p className="text-xs">{index + 1} / {files.length}</p>
        </div>
        {file.thumbnail && (
          <a
            href={originalUrl(file.thumbnail)}
            download={file.name}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/30 text-white text-xs font-medium transition-colors"
            title="Download original"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1v7.5M3 6l3.5 3.5L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 11.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Download
          </a>
        )}
      </div>
    </div>
  )
}

// -------------------------------------------------------------------
// Main FileGrid
// -------------------------------------------------------------------

export default function FileGrid({ files, viewMode }: FileGridProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const imageFiles = files.filter((f) => f.type === 'image' && f.thumbnail)

  const openLightbox = useCallback((file: FileItem) => {
    const idx = imageFiles.findIndex((f) => f.id === file.id)
    if (idx !== -1) setLightboxIndex(idx)
  }, [imageFiles])

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  const prevImage = useCallback(() => {
    setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))
  }, [])

  const nextImage = useCallback(() => {
    setLightboxIndex((i) => (i !== null && i < imageFiles.length - 1 ? i + 1 : i))
  }, [imageFiles.length])

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') return <FolderIcon size={48} />
    if (file.type === 'image') return <ImageIcon size={48} className="text-gray-300" />
    return getIconByName('file')
  }

  // ---- List view ----
  if (viewMode === 'list') {
    return (
      <>
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full">
            <thead className="text-xs text-gray-500 uppercase border-b border-gray-200">
              <tr>
                <th className="text-left py-2 px-3 font-medium">Name</th>
                <th className="text-left py-2 px-3 font-medium">Type</th>
                <th className="text-right py-2 px-3 font-medium">Download</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr
                  key={file.id}
                  onClick={() => {
                    setSelectedId(file.id)
                    if (file.type === 'image' && file.thumbnail) openLightbox(file)
                  }}
                  className={`border-b border-gray-100 cursor-pointer transition-colors ${
                    selectedId === file.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      {file.thumbnail ? (
                        <img
                          src={thumbUrl(file.thumbnail)}
                          alt={file.name}
                          className="w-5 h-5 object-cover rounded"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <span className="w-5 h-5">{getFileIcon(file)}</span>
                      )}
                      <span className="text-sm text-gray-800">{file.name}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-sm text-gray-500 capitalize">{file.type}</td>
                  <td className="py-2 px-3 text-right">
                    {file.thumbnail && (
                      <a
                        href={originalUrl(file.thumbnail)}
                        download={file.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <path d="M5.5 1v6M2.5 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M1 10h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        Download
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {lightboxIndex !== null && (
          <Lightbox
            files={imageFiles}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </>
    )
  }

  // ---- Grid view ----
  return (
    <>
      <div className="flex-1 overflow-auto p-6 relative">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4 auto-rows-max">
          {files.map((file, index) => {
            const offsetX = (Math.sin(index * 7) * 10).toFixed(0)
            const offsetY = (Math.cos(index * 5) * 8).toFixed(0)

            return (
              <div
                key={file.id}
                onClick={() => {
                  setSelectedId(file.id)
                  if (file.type === 'image' && file.thumbnail) openLightbox(file)
                }}
                style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}
                className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all hover:bg-gray-100/70 ${
                  selectedId === file.id ? 'bg-blue-100/50 ring-2 ring-blue-400/30' : ''
                }`}
              >
                {/* Thumbnail or Icon */}
                <div className="w-16 h-16 flex items-center justify-center mb-1 relative">
                  {file.thumbnail ? (
                    <div className="w-full h-full bg-gray-200 rounded shadow-sm overflow-hidden">
                      <Thumb src={file.thumbnail} alt={file.name} />
                    </div>
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center">
                      {getFileIcon(file)}
                    </div>
                  )}
                </div>

                {/* File name */}
                <span
                  className="text-[11px] text-gray-700 text-center leading-tight max-w-[90px] truncate"
                  title={file.name}
                >
                  {file.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          files={imageFiles}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </>
  )
}
