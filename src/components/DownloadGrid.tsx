'use client'

import React from 'react'

interface DownloadFile {
  name: string
  url: string
}

interface DownloadGridProps {
  files: DownloadFile[]
}

function AffinityIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="7" fill="#3D5AFE" opacity="0.12" />
      <path d="M16 6L26 24H6L16 6Z" fill="#3D5AFE" opacity="0.7" />
      <path d="M16 12L21 22H11L16 12Z" fill="#3D5AFE" />
    </svg>
  )
}

export default function DownloadGrid({ files }: DownloadGridProps) {
  if (files.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        No files available.
      </div>
    )
  }

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
            {/* Icon */}
            <div className="mb-3 transition-transform group-hover:scale-105">
              <AffinityIcon />
            </div>

            {/* Filename */}
            <span
              className="text-[11px] text-gray-700 text-center leading-tight font-medium break-words w-full"
              title={file.name}
            >
              {file.name.replace(/\.af$/, '')}
            </span>
            <span className="text-[10px] text-gray-400 mt-0.5">.af</span>

            {/* Download indicator */}
            <div className="mt-2 flex items-center gap-1 text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 1v6M2 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 9h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Download
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
