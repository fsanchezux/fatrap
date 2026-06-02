'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import JSZip from 'jszip'
import { ChevronDownIcon, ChevronRightIcon, getIconByName } from './Icons'

/* ─────────────────────────  TYPES  ───────────────────────── */

export interface ExplorerFile {
  id: string
  name: string
  url: string
  thumbnail?: string | null
}

export interface ExplorerLeaf {
  id: string
  label: string
  icon?: string
  files: ExplorerFile[]
  /** Optional action: when defined, clicking the leaf runs this instead of selecting files. */
  external?: () => void
  /** Optional custom content for the right panel. When defined, replaces the file grid. */
  renderContent?: () => React.ReactNode
}

export interface ExplorerGroup {
  id: string
  label: string
  icon?: string
  leaves: ExplorerLeaf[]
}

export interface ExplorerSection {
  /** When empty/undefined, the section header is omitted entirely. */
  label?: string
  groups?: ExplorerGroup[]
  leaves?: ExplorerLeaf[]
}

type CloseMode = 'dismiss' | 'minimize' | 'maximize'

interface ExplorerProps {
  tree: ExplorerSection[]
  open: boolean
  onClose: () => void
  /** Optional leaf id to focus when the explorer opens (e.g., 'contact-us'). */
  initialLeafId?: string
}

/* ─────────────────────────  COMPONENT  ───────────────────────── */

export default function Explorer({ tree, open, onClose, initialLeafId }: ExplorerProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLDivElement>(null)

  // Which traffic-light triggered close (drives the close animation flavour)
  const closeModeRef = useRef<CloseMode>('dismiss')

  // Mobile sidebar drawer state
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => {
      const mobile = window.matchMedia('(max-width: 767px)').matches
      setIsMobile(mobile)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // When opening on mobile, start with sidebar collapsed; on desktop always open
  useEffect(() => {
    if (!open) return
    setSidebarOpen(!isMobile)
  }, [open, isMobile])

  // When the explorer opens with an initialLeafId, focus that leaf
  useEffect(() => {
    if (open && initialLeafId) {
      setActiveLeafId(initialLeafId)
    }
  }, [open, initialLeafId])

  const closeWith = (mode: CloseMode) => {
    closeModeRef.current = mode
    onClose()
  }

  // Flatten all leaves for quick lookup + default selection
  const allLeaves = useMemo(() => {
    const out: ExplorerLeaf[] = []
    for (const section of tree) {
      if (section.groups) for (const g of section.groups) out.push(...g.leaves)
      if (section.leaves) out.push(...section.leaves)
    }
    return out
  }, [tree])

  const [activeLeafId, setActiveLeafId] = useState<string | null>(allLeaves[0]?.id ?? null)
  const activeLeaf = useMemo(
    () => allLeaves.find(l => l.id === activeLeafId) ?? null,
    [allLeaves, activeLeafId]
  )

  // Expand-state per group
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    tree.forEach(section => section.groups?.forEach(g => { init[g.id] = true }))
    return init
  })

  const [basket, setBasket] = useState<ExplorerFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [zipping, setZipping] = useState(false)

  /* ── Smooth open/close transition ── */
  const isFirstRun = useRef(true)
  useEffect(() => {
    const root = rootRef.current
    const bg = bgRef.current
    const sidebar = sidebarRef.current
    const panel = panelRef.current
    const closeBtn = closeBtnRef.current
    if (!root) return

    if (isFirstRun.current) {
      isFirstRun.current = false
      if (!open) return
    }

    if (open) {
      gsap.set(root, { display: 'flex', pointerEvents: 'auto' })
      gsap.set(bg, { opacity: 0 })
      gsap.set(sidebar, { opacity: 0, x: -40 })
      gsap.set(panel, { opacity: 0, scale: 0.96, y: 30, rotation: 0, transformOrigin: 'center center' })
      gsap.set(closeBtn, { opacity: 0, scale: 0.7 })

      const tl = gsap.timeline()
      tl.to(bg, { opacity: 1, duration: 0.55, ease: 'power2.out' })
        .to(sidebar, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, 0.05)
        .to(panel, { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.1)
        .to(closeBtn, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.6)' }, 0.45)
    } else {
      const mode = closeModeRef.current
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(root, { display: 'none', pointerEvents: 'none' })
          // Reset mode for next open/close
          closeModeRef.current = 'dismiss'
        },
      })
      tl.to(closeBtn, { opacity: 0, scale: 0.7, duration: 0.2, ease: 'power2.in' }, 0)

      if (mode === 'minimize') {
        // Yellow → slip downward, shrinking toward the bottom edge (like macOS minimise to dock)
        gsap.set(panel, { transformOrigin: 'bottom center' })
        tl.to(panel, { y: '110vh', scale: 0.25, opacity: 0, duration: 0.75, ease: 'power3.in' }, 0)
          .to(sidebar, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0)
          .to(bg, { opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.2)
      } else if (mode === 'maximize') {
        // Green → zoom in big and fade (like maximising past the viewport)
        gsap.set(panel, { transformOrigin: 'center center' })
        tl.to(panel, { scale: 1.35, opacity: 0, duration: 0.6, ease: 'power2.in' }, 0)
          .to(sidebar, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0)
          .to(bg, { opacity: 0, duration: 0.55, ease: 'power2.in' }, 0.1)
      } else {
        // Red → gentle dismiss (default)
        tl.to(panel, { opacity: 0, scale: 0.96, y: 30, duration: 0.5, ease: 'power2.in' }, 0)
          .to(sidebar, { opacity: 0, x: -40, duration: 0.45, ease: 'power3.in' }, 0.05)
          .to(bg, { opacity: 0, duration: 0.55, ease: 'power2.in' }, 0.15)
      }
    }
  }, [open])

  /* ── Drag handlers ── */
  const onDragStartFile = (e: React.DragEvent, file: ExplorerFile) => {
    e.dataTransfer.setData('application/json', JSON.stringify(file))
    e.dataTransfer.effectAllowed = 'copy'
  }

  const onDropZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    if (!isDragOver) setIsDragOver(true)
  }

  const onDropZoneDragLeave = () => setIsDragOver(false)

  const onDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    try {
      const data = e.dataTransfer.getData('application/json')
      if (!data) return
      const file = JSON.parse(data) as ExplorerFile
      setBasket(prev => prev.some(f => f.id === file.id) ? prev : [...prev, file])
    } catch { /* ignore */ }
  }

  const removeFromBasket = (id: string) =>
    setBasket(prev => prev.filter(f => f.id !== id))

  /* ── Zip download ── */
  const downloadZip = async () => {
    if (!basket.length || zipping) return
    setZipping(true)
    try {
      const zip = new JSZip()
      const results = await Promise.all(basket.map(async file => {
        const res = await fetch(file.url)
        const blob = await res.blob()
        return { name: file.name, blob }
      }))
      results.forEach(({ name, blob }) => zip.file(name, blob))
      const out = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(out)
      const a = document.createElement('a')
      a.href = url
      a.download = `fatrap-files-${Date.now()}.zip`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Zip download failed', err)
    } finally {
      setZipping(false)
    }
  }

  const toggleGroup = (id: string) =>
    setExpandedGroups(prev => ({ ...prev, [id]: !prev[id] }))

  /* ── Sidebar leaf render ── */
  const renderLeaf = (leaf: ExplorerLeaf, indented = false) => (
    <li key={leaf.id}>
      <button
        onClick={() => {
          if (leaf.external) {
            leaf.external()
            return
          }
          setActiveLeafId(leaf.id)
          // Auto-collapse the drawer on mobile after picking a leaf
          if (isMobile) setSidebarOpen(false)
        }}
        className={`w-full ${indented ? 'pl-9 pr-3' : 'px-3'} py-1.5 flex items-center gap-2 text-sm rounded-md transition-colors ${
          activeLeafId === leaf.id && !leaf.external
            ? 'bg-white/20 text-white'
            : 'text-white/75 hover:bg-white/10 hover:text-white'
        }`}
      >
        <span className="w-3.5 h-3.5 flex items-center justify-center opacity-70 flex-shrink-0">
          {leaf.icon ? getIconByName(leaf.icon) : (
            <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 012-2h5l1 2h5a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" />
            </svg>
          )}
        </span>
        <span className="truncate text-left flex-1">{leaf.label}</span>
      </button>
    </li>
  )

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[60] flex"
      style={{ display: open ? 'flex' : 'none' }}
    >
      {/* Blurred background */}
      <div ref={bgRef} className="absolute inset-0 -z-10">
        <Image
          src="/images/ivangbbb-fatrap-30.png"
          alt=""
          fill
          className="object-cover"
          style={{ filter: 'blur(28px)', transform: 'scale(1.1)' }}
          priority
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* ── UNIFIED CARD: sidebar (left) + white panel (right) ── */}
      <div className="relative z-10 w-full h-full p-4 md:p-6">
        <div
          ref={panelRef}
          className="relative w-full h-full rounded-2xl shadow-2xl overflow-hidden flex"
        >
          {/* Mobile-only hamburger — visible when the drawer is collapsed */}
          {isMobile && !sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
              className="absolute top-3 left-3 z-40 w-9 h-9 rounded-md bg-neutral-800/70 backdrop-blur-md text-white flex items-center justify-center md:hidden"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}

          {/* macOS-style traffic lights — top-left of unified card, FIXED (don't scroll with sidebar) */}
          <div
            ref={closeBtnRef}
            className="absolute top-4 left-4 z-40 flex items-center gap-2"
          >
            <button
              onClick={() => closeWith('dismiss')}
              aria-label="Cerrar"
              className="w-3.5 h-3.5 rounded-full bg-[#FF5F57] hover:brightness-95 transition-all"
            />
            <button
              onClick={() => closeWith('minimize')}
              aria-label="Minimizar"
              className="w-3.5 h-3.5 rounded-full bg-[#FEBC2E] hover:brightness-95 transition-all"
            />
            <button
              onClick={() => closeWith('maximize')}
              aria-label="Maximizar"
              className="w-3.5 h-3.5 rounded-full hover:brightness-95 transition-all"
              style={{ backgroundColor: '#c3c491' }}
            />
          </div>

          {/* SIDEBAR — semi-opaque, joined to white panel (mobile: slide-in drawer) */}
          <aside
            ref={sidebarRef}
            className={`absolute md:relative top-0 left-0 z-30 w-60 h-full overflow-y-auto pt-12 pb-6 px-2 text-white shrink-0 transition-transform duration-300 ease-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}
            style={{ backgroundColor: 'rgba(30,30,30,0.55)', backdropFilter: 'blur(10px)' }}
          >
            {/* Mobile-only close-drawer button */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Cerrar menú"
                className="absolute top-3.5 right-3 z-30 text-white/70 hover:text-white md:hidden"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M11 4L5 10M5 4l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}

            {tree.map((section, i) => (
              <div key={i} className="mb-4">
                {section.label && (
                  <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/55">
                    {section.label}
                  </div>
                )}
                <ul className="mt-1 space-y-0.5">
                  {section.groups?.map(group => {
                    const isOpen = expandedGroups[group.id]
                    return (
                      <li key={group.id}>
                        <button
                          onClick={() => toggleGroup(group.id)}
                          className="w-full px-3 py-1.5 flex items-center gap-2 text-sm text-white/85 hover:bg-white/10 hover:text-white rounded-md transition-colors"
                        >
                          <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                            {group.icon ? getIconByName(group.icon) : null}
                          </span>
                          <span className="flex-1 truncate text-left">{group.label}</span>
                          <span className="text-white/50">
                            {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
                          </span>
                        </button>
                        {isOpen && (
                          <ul className="mt-0.5 space-y-0.5">
                            {group.leaves.map(leaf => renderLeaf(leaf, true))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                  {section.leaves?.map(leaf => renderLeaf(leaf))}
                </ul>
              </div>
            ))}
          </aside>

          {/* WHITE PANEL — files grid + folder drop zone in top-right */}
          <div className="relative flex-1 h-full bg-white overflow-hidden">
          {/* Folder drop zone — top-right inside the panel */}
          <div className="absolute top-5 right-5 z-20 flex flex-col items-end gap-2">
            <div
              onDragOver={onDropZoneDragOver}
              onDragLeave={onDropZoneDragLeave}
              onDrop={onDropZoneDrop}
              className={`relative transition-transform duration-300 ${isDragOver ? 'scale-110' : 'scale-100'}`}
            >
              <svg
                width="100"
                height="80"
                viewBox="0 0 180 140"
                fill="none"
                className="drop-shadow-md"
              >
                <path
                  d="M10 30 Q10 20 20 20 L70 20 L82 32 L160 32 Q170 32 170 42 L170 120 Q170 130 160 130 L20 130 Q10 130 10 120 Z"
                  fill="#c3c491"
                  opacity={isDragOver ? 1 : 0.95}
                />
                <path
                  d="M10 50 L170 50 L170 120 Q170 130 160 130 L20 130 Q10 130 10 120 Z"
                  fill="#a8a97a"
                  opacity="0.4"
                />
              </svg>
              {basket.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1.5 rounded-full bg-black text-white text-xs font-medium flex items-center justify-center">
                  {basket.length}
                </span>
              )}
            </div>

            {/* Mini thumbnails under the folder */}
            {basket.length > 0 && (
              <div className="flex flex-wrap items-center justify-end gap-1 max-w-[200px]">
                {basket.map(file => (
                  <div
                    key={file.id}
                    className="relative w-10 h-10 rounded-md overflow-hidden bg-neutral-200 border border-neutral-300 shadow-sm group"
                  >
                    {file.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M4 4a2 2 0 012-2h5l1 2h5a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" />
                        </svg>
                      </div>
                    )}
                    <button
                      onClick={() => removeFromBasket(file.id)}
                      className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                      aria-label="Quitar"
                    >×</button>
                  </div>
                ))}
              </div>
            )}

            {basket.length > 0 && (
              <button
                onClick={downloadZip}
                disabled={zipping}
                className="mt-1 px-4 py-1.5 rounded-full bg-[#c3c491] text-black font-medium text-sm hover:bg-[#d4d5a2] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-wait"
              >
                {zipping ? 'Empaquetando…' : 'Descargar .zip'}
              </button>
            )}
          </div>

          {/* Right panel content */}
          <div className="absolute inset-0 pt-6 pb-6 pl-6 md:pl-8 pr-[150px] md:pr-[170px] overflow-y-auto">
            {activeLeaf?.renderContent ? (
              activeLeaf.renderContent()
            ) : (
              <>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1 leading-tight">
                  {activeLeaf?.label || 'Selecciona una categoría'}
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Arrastra los archivos a la carpeta para descargar todos en un .zip
                </p>

                {activeLeaf && activeLeaf.files.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {activeLeaf.files.map(file => (
                      <div
                        key={file.id}
                        draggable
                        onDragStart={(e) => onDragStartFile(e, file)}
                        className="group relative cursor-grab active:cursor-grabbing rounded-xl overflow-hidden bg-neutral-50 hover:shadow-lg hover:scale-[1.02] transition-all select-none"
                      >
                        <div className="aspect-square bg-neutral-100">
                          {file.thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={file.thumbnail}
                              alt={file.name}
                              className="w-full h-full object-cover"
                              draggable={false}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                              <svg width="34" height="34" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M4 4a2 2 0 012-2h5l1 2h5a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="px-3 py-2 text-xs text-gray-700 truncate" title={file.name}>
                          {file.name}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">No hay archivos en esta categoría aún.</div>
                )}
              </>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
