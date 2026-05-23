import fs from 'node:fs'
import zlib from 'node:zlib'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const htmlPath = path.resolve(__dirname, '../Momento by District.html')
const raw = fs.readFileSync(htmlPath, 'utf8')
const manifest = JSON.parse(raw.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/)[1])
const entry = manifest['d18a6319-38e6-4940-af31-8d7207695579']
let buf = Buffer.from(entry.data, 'base64')
if (entry.compressed) buf = zlib.gunzipSync(buf)
const text = buf.toString('utf8')

function extractArray(name) {
  const start = text.indexOf(`window.${name} = `)
  if (start < 0) throw new Error(`Missing window.${name}`)
  let i = start + `window.${name} = `.length
  if (text[i] !== '[') throw new Error(`Expected [ for ${name}`)
  let depth = 0
  let inStr = false
  let strQuote = ''
  let escaped = false
  for (; i < text.length; i++) {
    const ch = text[i]
    if (inStr) {
      if (escaped) {
        escaped = false
        continue
      }
      if (ch === '\\') {
        escaped = true
        continue
      }
      if (ch === strQuote) inStr = false
      continue
    }
    if (ch === '"' || ch === "'") {
      inStr = true
      strQuote = ch
      continue
    }
    if (ch === '[') depth++
    if (ch === ']') {
      depth--
      if (depth === 0) {
        const slice = text.slice(start + `window.${name} = `.length, i + 1)
        // eslint-disable-next-line no-new-func
        return Function(`"use strict"; return (${slice})`)()
      }
    }
  }
  throw new Error(`Unterminated array for ${name}`)
}

const menuData = extractArray('MENU_DATA')
const offers = extractArray('OFFERS')
const out = path.resolve(__dirname, '../src/data/momentoMenuSeedData.json')
fs.writeFileSync(out, JSON.stringify({ menuData, offers }, null, 2))
console.info(`Wrote ${out}: ${menuData.length} categories, ${offers.length} offers`)
