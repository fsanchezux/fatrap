import { NextRequest, NextResponse } from 'next/server'
import { makeToken, COOKIE_NAME, COOKIE_MAX_AGE } from '@/lib/adminAuth'

export async function POST(req: NextRequest) {
  let password = ''
  try {
    const body = await req.json()
    password = typeof body?.password === 'string' ? body.password : ''
  } catch {
    // ignore — treated as empty password below
  }

  const expected = process.env.ADMIN_PASSWORD
  if (!expected) {
    return NextResponse.json({ error: 'Admin no configurado en el servidor.' }, { status: 503 })
  }
  if (!password || password !== expected) {
    return NextResponse.json({ error: 'Contraseña incorrecta.' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, makeToken(), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === 'production',
  })
  return res
}
