'use client'

import React from 'react'

interface DownloadFile {
  name: string
  url: string
}

interface DownloadGridProps {
  files: DownloadFile[]
  viewMode?: 'grid' | 'list'
}

function AffinityIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="7" fill="#3D5AFE" opacity="0.12" />
      <path d="M16 6L26 24H6L16 6Z" fill="#3D5AFE" opacity="0.7" />
      <path d="M16 12L21 22H11L16 12Z" fill="#3D5AFE" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1v8M3 7l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export default function DownloadGrid({ files, viewMode = 'grid' }: DownloadGridProps) {
  if (files.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        No files available.
      </div>
    )
  }

  // ---- List view ----
  if (viewMode === 'list') {
    return (
      <div className="flex-1 overflow-auto p-4">
        <table className="w-full">
          <thead className="text-xs text-gray-500 uppercase border-b border-gray-200">
            <tr>
              <th className="text-left py-2 px-3 font-medium">Name</th>
              <th className="text-left py-2 px-3 font-medium">Format</th>
              <th className="text-right py-2 px-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.url} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <AffinityIcon size={18} />
                    <span className="text-sm text-gray-800">{file.name.replace(/\.af$/, '')}</span>
                  </div>
                </td>
                <td className="py-2 px-3 text-sm text-gray-500">.af (Affinity Designer)</td>
                <td className="py-2 px-3 text-right">
                  <a
                    href={file.url}
                    download={file.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    <DownloadIcon />
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // ---- Grid view ----
  return (
    <div className="flex-1 overflow-auto p-6">
      <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider font-medium">
        Affinity Designer files · Click to download
      </p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
        {files.map((file) => (
          <a
            key={file.url}
            href={file.url}
            download={file.name}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all cursor-pointer"
          >
            <div className="mb-3 transition-transform group-hover:scale-105">
              <AffinityIcon />
            </div>
            <span
              className="text-[11px] text-gray-700 text-center leading-tight font-medium break-words w-full"
              title={file.name}
            >
              {file.name.replace(/\.af$/, '')}
            </span>
            <span className="text-[10px] text-gray-400 mt-0.5">.af</span>
            <div className="mt-2 flex items-center gap-1 text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <DownloadIcon />
              Download
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
