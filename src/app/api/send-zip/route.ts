import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
const JSZip = require('jszip')

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { to, files } = await req.json()

    if (!to || !files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: 'Email and files are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const zip = new JSZip()
    const used: Record<string, boolean> = {}

    await Promise.all(
      files.map(async (file: { name: string; url: string }) => {
        const res = await fetch(file.url)
        if (!res.ok) return
        const blob = await res.blob()
        const buffer = await blob.arrayBuffer()
        let name = file.name
        while (used[name]) {
          const dot = name.lastIndexOf('.')
          name = dot > 0 ? name.slice(0, dot) + '-2' + name.slice(dot) : name + '-2'
        }
        used[name] = true
        zip.file(name, buffer)
      })
    )

    const zipBlob = await zip.generateAsync({ type: 'nodebuffer' })
    const zipBase64 = zipBlob.toString('base64')

    const dropNames = Array.from(new Set(files.map((f: { name: string }) => f.name.split('_')[1]?.replace(/_/g, ' ') || ''))).filter(Boolean)
    const subject = dropNames.length > 0
      ? `[Fatrap] Archivos — ${dropNames.join(', ')}`
      : '[Fatrap] Tus archivos de estampar'

    const { error } = await resend.emails.send({
      from: 'Fatrap Brand <onboarding@resend.dev>',
      to: to,
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111;">Tus archivos de Fatrap</h2>
          <p style="color: #333;">Hola! Adjunto encontrarás un .zip con los archivos de estampar que seleccionaste en <a href="https://fatrap.vercel.app" style="color: #c3c491;">fatrap.vercel.app</a>.</p>
          <p style="color: #666; font-size: 13px;">${files.length} archivo${files.length !== 1 ? 's' : ''} incluido${files.length !== 1 ? 's' : ''}.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #aaa; font-size: 12px;">Fatrap Brand — Open source streetwear</p>
        </div>
      `,
      attachments: [
        {
          filename: 'fatrap-files.zip',
          content: zipBase64,
          contentType: 'application/zip',
        },
      ],
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Send-zip API error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
