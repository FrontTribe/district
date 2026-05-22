import fs from 'node:fs'

const raw = fs.readFileSync(new URL('../Momento by District.html', import.meta.url), 'utf8')
const marker = '"<!DOCTYPE html>\\n'
const start = raw.indexOf(marker)
if (start === -1) throw new Error('no embedded HTML')
let i = start + 1
let out = ''
while (i < raw.length) {
  const ch = raw[i]
  if (ch === '\\') {
    const next = raw[i + 1]
    if (next === 'n') {
      out += '\n'
      i += 2
      continue
    }
    if (next === 't') {
      out += '\t'
      i += 2
      continue
    }
    if (next === '"') {
      out += '"'
      i += 2
      continue
    }
    if (next === '\\') {
      out += '\\'
      i += 2
      continue
    }
    if (next === 'u') {
      const hex = raw.slice(i + 2, i + 6)
      out += String.fromCharCode(parseInt(hex, 16))
      i += 6
      continue
    }
    out += next
    i += 2
    continue
  }
  if (ch === '"') break
  out += ch
  i++
}

const sections = [...out.matchAll(/<section[^>]*id="([^"]*)"[^>]*>/g)].map((m) => m[1])
const dataSections = [...out.matchAll(/data-section="([^"]*)"/g)].map((m) => m[1])
const ids = [...out.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]).filter((id) => !id.startsWith('__'))
const headings = [...out.matchAll(/<h[12][^>]*>([^<]+)</g)].map((m) => m[1].trim())

console.log('SECTION ids:', [...new Set(sections)])
console.log('data-section:', [...new Set(dataSections)])
console.log('unique ids sample:', [...new Set(ids)].slice(0, 40))
console.log('headings:', headings.slice(0, 30))
