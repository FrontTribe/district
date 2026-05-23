/**
 * Iz `District Real Estate.html` (Cursor / bundler export) čita `__bundler/manifest`
 * i zapisuje JPEG-e u `public/re-landing/` — isti izvori kao u `reLandingDemoImageUrls`.
 *
 * Pokretanje (root repozitorija):
 *   node scripts/extract-district-html-images.mjs
 *
 * Ako HTML nije u rootu, postavi: DISTRICT_HTML_PATH=/put/do/District\ Real\ Estate.html
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

/** UUID iz manifesta → ime datoteke u `public/re-landing/` (usklađeno s `realEstateLandingDemo.ts`). */
const MANIFEST_UUID_TO_FILE = {
  'edc291d4-8a4e-4ac8-a6b3-f4e70de5afae': 'real-estate-hero.jpg', // heroJpg
  'e4b06d84-6059-4f04-8dc3-ccbdfe6e28df': 'tzd_018.jpg',
  'f3818f87-bbf7-48c2-99ca-aa929a51f7b0': 'tzd_019.jpg',
  'bea4ae64-513f-465d-b28a-5107620992c3': 'tzd_021.jpg',
  '4aa5c6eb-1594-4a3a-806a-d660a79a918c': 'tzd_026.jpg',
}

function decodeManifestEntry(entry) {
  if (!entry?.data || typeof entry.data !== 'string') {
    throw new Error('Manifest entry missing base64 data')
  }
  const buf = Buffer.from(entry.data, 'base64')
  if (entry.compressed) {
    throw new Error('Compressed manifest image not supported in this script (use browser export without gzip).')
  }
  return buf
}

function main() {
  const htmlPath =
    process.env.DISTRICT_HTML_PATH?.trim() || path.join(root, 'District Real Estate.html')
  if (!fs.existsSync(htmlPath)) {
    console.error(`Nema datoteke: ${htmlPath}`)
    console.error('Kopiraj `District Real Estate.html` u root projekta ili postavi DISTRICT_HTML_PATH.')
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
  const outDir = path.join(root, 'public/re-landing')
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

  console.info('\nGotovo. Slike su u public/re-landing/ — seed:real-estate ih učitava s tih putanja.')
}

main()
