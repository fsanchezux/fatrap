'use client'

import React, { useState } from 'react'
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

export default function FileGrid({ files, viewMode }: FileGridProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return <FolderIcon size={48} />
    }
    if (file.type === 'image') {
      return <ImageIcon size={48} className="text-gray-300" />
    }
    return getIconByName('file')
  }

  if (viewMode === 'list') {
    return (
      <div className="flex-1 overflow-auto p-4">
        <table className="w-full">
          <thead className="text-xs text-gray-500 uppercase border-b border-gray-200">
            <tr>
              <th className="text-left py-2 px-3 font-medium">Name</th>
              <th className="text-left py-2 px-3 font-medium">Type</th>
              <th className="text-left py-2 px-3 font-medium">Path</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr
                key={file.id}
                onClick={() => setSelectedId(file.id)}
                className={`border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedId === file.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5">{getFileIcon(file)}</span>
                    <span className="text-sm text-gray-800">{file.name}</span>
                  </div>
                </td>
                <td className="py-2 px-3 text-sm text-gray-500 capitalize">{file.type}</td>
                <td className="py-2 px-3 text-sm text-gray-400">{file.path}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Grid view - scattered layout like the reference image
  return (
    <div className="flex-1 overflow-auto p-6 relative">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4 auto-rows-max">
        {files.map((file, index) => {
          // Create pseudo-random offsets for scattered look
          const offsetX = (Math.sin(index * 7) * 10).toFixed(0)
          const offsetY = (Math.cos(index * 5) * 8).toFixed(0)

          return (
            <div
              key={file.id}
              onClick={() => setSelectedId(file.id)}
              style={{
                transform: `translate(${offsetX}px, ${offsetY}px)`,
              }}
              className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all hover:bg-gray-100/70 ${
                selectedId === file.id ? 'bg-blue-100/50 ring-2 ring-blue-400/30' : ''
              }`}
            >
              {/* Thumbnail or Icon */}
              <div className="w-16 h-16 flex items-center justify-center mb-1 relative">
                {file.thumbnail ? (
                  <div className="w-full h-full bg-gray-200 rounded shadow-sm flex items-center justify-center overflow-hidden">
                    {/* Placeholder for actual thumbnails */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <ImageIcon size={24} className="text-gray-400" />
                    </div>
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
  )
}
