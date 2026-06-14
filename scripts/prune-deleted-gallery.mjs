// Removes entries from scripts/cloudinary-urls.json whose Cloudinary URL is dead
// (HTTP != 200, typically 404 after a manual delete in the Cloudinary dashboard).
//
//   node scripts/prune-deleted-gallery.mjs            # dry run, just lists
//   node scripts/prune-deleted-gallery.mjs --apply    # rewrites the JSON
//
// After applying, run `node scripts/build-index2-data.mjs` to regenerate
// public/fatrap-data.json, then commit + push.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const jsonPath = join(root, 'scripts/cloudinary-urls.json')
const apply = process.argv.includes('--apply')
const CONCURRENCY = 12

const entries = JSON.parse(readFileSync(jsonPath, 'utf8'))
console.log(`Checking ${entries.length} gallery entries (concurrency ${CONCURRENCY})…`)

let done = 0
const results = new Array(entries.length)

async function check(i) {
  const e = entries[i]
  try {
    let r = await fetch(e.thumbnail, { method: 'HEAD' })
    // Some CDNs reject HEAD; fall back to GET if status looks off
    if (r.status === 405 || r.status === 400) r = await fetch(e.thumbnail, { method: 'GET' })
    results[i] = { ok: r.ok, status: r.status }
  } catch (err) {
    results[i] = { ok: false, status: 'ERR', err: err.message }
  }
  done++
  if (done % 25 === 0) process.stdout.write(`  ${done}/${entries.length}\r`)
}

// simple worker pool
let next = 0
async function worker() {
  while (next < entries.length) {
    const i = next++
    await check(i)
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker))
process.stdout.write(`  ${done}/${entries.length}\n`)

const dead = []
const alive = []
entries.forEach((e, i) => {
  if (results[i].ok) alive.push(e)
  else dead.push({ ...e, _status: results[i].status })
})

console.log(`\nAlive: ${alive.length}`)
console.log(`Dead:  ${dead.length}`)
if (dead.length) {
  console.log('\nDead entries:')
  for (const d of dead) console.log(`  [${d._status}] ${d.galleryPath}/${d.name}`)
}

if (!apply) {
  console.log('\n(dry run — pass --apply to rewrite cloudinary-urls.json)')
  process.exit(0)
}

if (!dead.length) {
  console.log('\nNothing to remove.')
  process.exit(0)
}

writeFileSync(jsonPath, JSON.stringify(alive, null, 2))
console.log(`\nWrote ${jsonPath} — removed ${dead.length} dead entries.`)
console.log('Next: node scripts/build-index2-data.mjs, then git commit + push.')
