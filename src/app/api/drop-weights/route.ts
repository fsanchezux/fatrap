import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { isAdmin } from '@/lib/adminAuth'

// Per-drop priority weights (0..100, default 50). Used by the frontend to bias
// the shuffle of the gallery so higher-weighted drops tend to surface earlier.
// Same storage pattern as /api/drops: app_setting key/value table.

let tableReady = false

async function withRetry<T>(fn: () => Promise<T>, attempts = 3, delayMs = 700): Promise<T> {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (e) {
      lastErr = e
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, delayMs))
    }
  }
  throw lastErr
}

async function ensureTable() {
  if (tableReady) return
  await prisma.$executeRawUnsafe(
    'CREATE TABLE IF NOT EXISTS "app_setting" (key text PRIMARY KEY, value jsonb NOT NULL, "updatedAt" timestamptz NOT NULL DEFAULT now())'
  )
  tableReady = true
}

// GET — public. Returns { [drop]: number } or {} if nothing saved yet.
export async function GET() {
  try {
    const map = await withRetry(async () => {
      await ensureTable()
      const rows = await prisma.$queryRaw<Array<{ value: unknown }>>`
        SELECT value FROM "app_setting" WHERE key = 'drop_weights' LIMIT 1
      `
      let m: unknown = rows.length ? rows[0].value : {}
      if (typeof m === 'string') m = JSON.parse(m)
      return m
    })
    return NextResponse.json(map)
  } catch (e) {
    console.error('GET /api/drop-weights failed', e)
    return NextResponse.json({})
  }
}

// POST — admin only. Replaces the weights map. Values clamped to 0..100.
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 })
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Formato inválido.' }, { status: 400 })
  }

  const clean: Record<string, number> = {}
  for (const [k, v] of Object.entries(body as Record<string, unknown>)) {
    const n = typeof v === 'number' ? v : Number(v)
    if (Number.isFinite(n)) clean[k] = Math.max(0, Math.min(100, Math.round(n)))
  }

  try {
    const json = JSON.stringify(clean)
    await withRetry(async () => {
      await ensureTable()
      await prisma.$executeRaw`
        INSERT INTO "app_setting" (key, value) VALUES ('drop_weights', ${json}::jsonb)
        ON CONFLICT (key) DO UPDATE SET value = ${json}::jsonb, "updatedAt" = now()
      `
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('POST /api/drop-weights failed', e)
    return NextResponse.json({ error: 'No se pudo guardar en el servidor.' }, { status: 500 })
  }
}
