/**
 * Preuzima slike s boutique.district.hr CDN-a u `public/boutique-landing/`.
 *
 *   node scripts/extract-boutique-images.mjs
 *   pnpm run extract:boutique-images
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'public/boutique-landing')

const CDN = 'https://boutique.district.hr/api/media/file/'

const FILES = {
  hero: '_DSC8896.jpg',
  about1: '_DSC8812.jpg',
  about2: '_DSC8546-1024x683.jpg',
  about3: '_DSC8855.jpg',
  rooftopHero: '_DSC8530%20(1)%202-1920x1280.jpg',
  rooftop1: '_DSC9307-480x320.jpg',
  rooftop2: '_DSC9318-480x320.jpg',
  rooftop3: '_DSC9340-480x320.jpg',
  rooftop4: 'DJI_20241207142535_0167_D-480x270.jpg',
  premium1: '_DSC8926-1024x683.jpg',
  premium2: '_DSC8933-1024x683.jpg',
  premium3: '_DSC8981-1024x683.jpg',
  premium4: '_DSC9000-1024x682.jpg',
  deluxe1: '_DSC8535-1024x682.jpg',
  deluxe2: '_DSC8546-1024x683.jpg',
  deluxe3: '_DSC8573-1024x683.jpg',
  deluxe4: '_DSC8956-1024x683.jpg',
  suite1: '_DSC8819-1024x683.jpg',
  suite2: '_DSC8827-1024x683.jpg',
  suite3: '_DSC8863-1024x683.jpg',
  suite4: '_DSC8869-1024x683.jpg',
  jacuzzi1: '_DSC8636-1024x683.jpg',
  jacuzzi2: '_DSC8640%20(1)-1024x683.jpg',
  jacuzzi3: '_DSC8654-1024x683.jpg',
  jacuzzi4: '_DSC8656-1024x683.jpg',
}

async function download(key, fileName) {
  const url = CDN + fileName
  const outPath = path.join(outDir, `${key}.jpg`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(outPath, buf)
  console.info(`  → ${key}.jpg (${buf.length} bytes)`)
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true })
  console.info('Preuzimanje boutique slika…')
  for (const [key, file] of Object.entries(FILES)) {
    await download(key, file)
  }
  console.info('\nGotovo. Slike su u public/boutique-landing/')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
