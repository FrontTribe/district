/**
 * Iz `Momento by District.html` (Cursor / bundler export) čita `__bundler/manifest`
 * i zapisuje JPEG-e u `public/momento-landing/`.
 *
 * Pokretanje (root repozitorija):
 *   pnpm run extract:momento-images
 *
 * Ako HTML nije u rootu: MOMENTO_HTML_PATH=/put/do/Momento\ by\ District.html
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

/** UUID iz manifesta → ime datoteke u `public/momento-landing/`. */
const MANIFEST_UUID_TO_FILE = {
  'a363c415-8379-4ef9-b846-b15087b90e6c': 'hero.jpg',
  'ebd3fb02-5cd2-4d2d-a3a2-d1c37d131a90': 'interior-1.jpg',
  '72da0ca8-d0b2-46df-8613-8e5fc82b917f': 'interior-2.jpg',
  'f3d329e1-87f2-45fd-a4fc-e12dac7d1e29': 'interior-3.jpg',
  '7cb565f4-9b33-49b1-a952-aa711a913ed4': 'terrace.jpg',
  'd8d284ab-0c20-45e0-a199-0bd8b38b030b': 'career.jpg',
}

function decodeManifestEntry(entry) {
  if (!entry?.data || typeof entry.data !== 'string') {
    throw new Error('Manifest entry missing base64 data')
  }
  const buf = Buffer.from(entry.data, 'base64')
  if (entry.compressed) {
    throw new Error('Compressed manifest image not supported in this script.')
  }
  return buf
}

function main() {
  const htmlPath =
    process.env.MOMENTO_HTML_PATH?.trim() || path.join(root, 'Momento by District.html')
  if (!fs.existsSync(htmlPath)) {
    console.error(`Nema datoteke: ${htmlPath}`)
    process.exit(1)
  }

  console.info(`Čitam: ${htmlPath}`)
  const html = fs.readFileSync(htmlPath, 'utf8')
  const m = html.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/)
  if (!m) {
    console.error('Nema <script type="__bundler/manifest"> u HTML-u.')
    process.exit(1)
  }

  const manifest = JSON.parse(m[1])
  const outDir = path.join(root, 'public/momento-landing')
  fs.mkdirSync(outDir, { recursive: true })

  for (const [uuid, fileName] of Object.entries(MANIFEST_UUID_TO_FILE)) {
    const entry = manifest[uuid]
    if (!entry) {
      console.error(`UUID nije u manifestu: ${uuid}`)
      process.exit(1)
    }
    const buf = decodeManifestEntry(entry)
    const outPath = path.join(outDir, fileName)
    fs.writeFileSync(outPath, buf)
    console.info(`  → ${fileName} (${buf.length} bytes, ${entry.mime})`)
  }

  console.info('\nGotovo. Slike su u public/momento-landing/ — seed:momento ih učitava s tih putanja.')
}

main()
