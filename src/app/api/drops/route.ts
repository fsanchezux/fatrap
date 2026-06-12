import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { isAdmin } from '@/lib/adminAuth'
import { DEFAULT_DROPS } from '@/lib/defaultDrops'

// The drop -> stampable-files relation, stored in a tiny key/value table in the
// same Postgres (Neon) DB so it works on Vercel and is shared by all visitors.

let tableReady = false

// Neon (serverless) auto-suspends; the first query after idle can fail while it
// wakes up. Retry a couple of times before giving up.
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

// GET — public. Returns the saved relation, or factory defaults if none yet.
export async function GET() {
  try {
    const map = await withRetry(async () => {
      await ensureTable()
      const rows = await prisma.$queryRaw<Array<{ value: unknown }>>`
        SELECT value FROM "app_setting" WHERE key = 'drops' LIMIT 1
      `
      let m: unknown = rows.length ? rows[0].value : DEFAULT_DROPS
      if (typeof m === 'string') m = JSON.parse(m)
      return m
    })
    return NextResponse.json(map)
  } catch (e) {
    console.error('GET /api/drops failed', e)
    // Fall back to defaults so the gallery still works even if the DB is down.
    return NextResponse.json(DEFAULT_DROPS)
  }
}

// POST — admin only. Replaces the relation.
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

  // Sanitize to { [drop: string]: string[] }
  const clean: Record<string, string[]> = {}
  for (const [k, v] of Object.entries(body as Record<string, unknown>)) {
    if (Array.isArray(v)) clean[k] = v.filter((x): x is string => typeof x === 'string')
  }

  try {
    const json = JSON.stringify(clean)
    await withRetry(async () => {
      await ensureTable()
      await prisma.$executeRaw`
        INSERT INTO "app_setting" (key, value) VALUES ('drops', ${json}::jsonb)
        ON CONFLICT (key) DO UPDATE SET value = ${json}::jsonb, "updatedAt" = now()
      `
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('POST /api/drops failed', e)
    return NextResponse.json({ error: 'No se pudo guardar en el servidor.' }, { status: 500 })
  }
}
