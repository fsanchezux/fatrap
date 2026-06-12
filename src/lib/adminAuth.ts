import crypto from 'crypto'
import type { NextRequest } from 'next/server'

// Signed, httpOnly session cookie for the index2.html drops admin.
// The password lives only on the server (ADMIN_PASSWORD env); the cookie is an
// HMAC-signed token so the client can't forge it.

export const COOKIE_NAME = 'fatrap_admin'
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days (seconds)

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || 'insecure-dev-secret-change-me'
}

function hmac(data: string): string {
  return crypto.createHmac('sha256', secret()).update(data).digest('hex')
}

export function makeToken(): string {
  const ts = Date.now().toString()
  return `${ts}.${hmac(ts)}`
}

export function verifyToken(token: string | undefined | null): boolean {
  if (!token) return false
  const i = token.lastIndexOf('.')
  if (i <= 0) return false
  const ts = token.slice(0, i)
  const sig = token.slice(i + 1)
  const expected = hmac(ts)
  if (sig.length !== expected.length) return false
  let ok = false
  try {
    ok = crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
  if (!ok) return false
  const age = Date.now() - Number(ts)
  return Number.isFinite(age) && age >= 0 && age <= COOKIE_MAX_AGE * 1000
}

export function isAdmin(req: NextRequest): boolean {
  return verifyToken(req.cookies.get(COOKIE_NAME)?.value)
}
