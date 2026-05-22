/**
 * Generates scoped `momento-landing.scss` from embedded CSS in `Momento by District.html`.
 * Run: node scripts/build-momento-scss.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const htmlPath = path.join(root, 'Momento by District.html')
const outPath = path.join(root, 'src/components/momento-landing/momento-landing.scss')

function extractEmbeddedHtml(raw) {
  const marker = '"<!DOCTYPE html>\\n'
  const start = raw.indexOf(marker)
  if (start < 0) throw new Error('Embedded HTML not found')
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
  return out
}

const raw = fs.readFileSync(htmlPath, 'utf8')
const embedded = extractEmbeddedHtml(raw)

const styleBlocks = []
let searchFrom = 0
while (true) {
  const styleOpen = embedded.indexOf('<style>', searchFrom)
  if (styleOpen < 0) break
  const styleClose = embedded.indexOf('</style>', styleOpen)
  if (styleClose < 0) break
  styleBlocks.push(embedded.slice(styleOpen + 7, styleClose))
  searchFrom = styleClose + 8
}

if (styleBlocks.length === 0) throw new Error('No <style> in embedded HTML')

/** Layout CSS lives in the block that defines :root (first block is Google Fonts @font-face only). */
let css = styleBlocks.find((block) => block.includes(':root')) ?? styleBlocks[styleBlocks.length - 1]

/** Fonts come from `next/font` in `landingFonts.ts` — drop bundled @font-face URLs. */
css = css.replace(/@font-face\s*\{[\s\S]*?\}/g, '')

css = css.replace(/^\* \{[^}]+\}/m, '')
css = css.replace(/^html, body \{[^}]+\}/m, '')
css = css.replace(/^html \{[^}]+\}/m, '')
css = css.replace(/^body \{[^}]+\}/m, '')
css = css.replace(/^a \{[^}]+\}/m, '')
css = css.replace(/^button \{[^}]+\}/m, '')
css = css.replace(/^img \{[^}]+\}/m, '')
css = css.replace(/^::selection \{[^}]+\}/m, '')

css = css.replace(/background-image:\s*url\("[a-f0-9-]+"\);?\s*/g, '')

css = css.replace(':root {', '.momento-landing {')
css = css.replace(
  /--serif-display:\s*"Cormorant Garamond"[^;]+;/g,
  '--serif-display: var(--font-re-landing-serif), "DM Serif Text", Georgia, serif;',
)
css = css.replace(
  /--serif:\s*"Cormorant Garamond"[^;]+;/g,
  '--serif: var(--font-re-landing-serif), "DM Serif Text", Georgia, "Times New Roman", serif;',
)
css = css.replace(/font-weight:\s*300;/g, 'font-weight: 400;')
css = css.replace(/\[data-palette="terracotta"\]/g, '.momento-landing[data-palette="terracotta"]')
css = css.replace(/\[data-palette="emerald"\]/g, '.momento-landing[data-palette="emerald"]')

const lines = css.split('\n')
const scoped = []
let inKeyframes = false
let inMedia = false
let braceDepth = 0

function countBraces(line) {
  return (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length
}

function scopeSelectorLine(line) {
  const trimmed = line.trim()
  const needsScoping = (selector) => {
    const s = selector.trim()
    return (
      (s.startsWith('.') || s.startsWith('footer') || s.startsWith('#')) &&
      !s.startsWith('.momento-landing')
    )
  }

  if (trimmed.includes(',')) {
    return line
      .split(',')
      .map((part) => (needsScoping(part) ? `.momento-landing ${part.trim()}` : part.trim()))
      .join(', ')
  }

  if (needsScoping(trimmed)) {
    return `.momento-landing ${line}`
  }
  return line
}

for (const line of lines) {
  const t = line.trim()
  if (!t) {
    scoped.push('')
    continue
  }

  if (t.startsWith('@keyframes')) {
    scoped.push(line)
    inKeyframes = true
    braceDepth += countBraces(line)
    continue
  }

  if (inKeyframes) {
    scoped.push(line)
    braceDepth += countBraces(line)
    if (braceDepth <= 0) inKeyframes = false
    continue
  }

  if (t.startsWith('@media')) {
    scoped.push(line)
    inMedia = true
    braceDepth += countBraces(line)
    continue
  }

  if (inMedia) {
    scoped.push(scopeSelectorLine(line))
    braceDepth += countBraces(line)
    if (braceDepth <= 0) inMedia = false
    continue
  }

  scoped.push(scopeSelectorLine(line))
}

const header = `/**
 * Momento landing — scoped styles from \`Momento by District.html\`.
 * Regenerate: node scripts/build-momento-scss.mjs
 */

.momento-landing {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  font-family: var(--sans);
  color: var(--ink);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-size: 16px;
  line-height: 1.55;
  overflow-x: hidden;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font: inherit;
    color: inherit;
    background: none;
    border: 0;
    cursor: pointer;
    padding: 0;
  }

  img {
    display: block;
    max-width: 100%;
  }

  ::selection {
    background: var(--accent);
    color: var(--cream);
  }
}

`

fs.mkdirSync(path.dirname(outPath), { recursive: true })
const body = scoped.join('\n')
const extras = `
/* Serif naslovi — DM Serif Text (isti kao RE landing, iz next/font u shellu) */
.momento-landing {
  --serif: var(--font-re-landing-serif), "DM Serif Text", Georgia, "Times New Roman", serif;
  --serif-display: var(--font-re-landing-serif), "DM Serif Text", Georgia, serif;
}

/* Momento brand — tamna šuma + prigušeni sage (ne neon emerald) */
.momento-landing[data-palette="emerald"] {
  --bg-deep: oklch(0.16 0.034 158);
  --bg-deeper: oklch(0.11 0.03 158);
  --accent: oklch(0.50 0.065 156);
  --accent-deep: oklch(0.38 0.055 160);
  --accent-soft: oklch(0.56 0.058 154);
}

.momento-landing[data-palette="emerald"] .offer-card:hover {
  border-color: color-mix(in oklch, var(--accent) 42%, transparent);
}

.momento-landing[data-palette="emerald"] .offer-card.featured {
  background: oklch(0.44 0.07 155);
  border-color: oklch(0.44 0.07 155);
}

.momento-landing[data-palette="emerald"] .offer-card.featured:hover {
  background: oklch(0.40 0.065 158);
  border-color: oklch(0.40 0.065 158);
}

.momento-landing[data-palette="emerald"] .badge-open .pulse {
  animation-name: momento-pulse-emerald;
}

@keyframes momento-pulse-emerald {
  0% { box-shadow: 0 0 0 0 oklch(0.50 0.065 156 / 0.55); }
  100% { box-shadow: 0 0 0 14px oklch(0.50 0.065 156 / 0); }
}

.momento-landing .shell {
  box-sizing: border-box;
  max-width: min(var(--shell), 100%);
}

.momento-landing .hero-title .l2 {
  color: var(--accent);
}

.momento-landing .hero-flourish {
  color: var(--accent);
}

.momento-landing .hero-flourish .line {
  background: var(--accent);
}

.momento-landing .cta-pill {
  color: var(--bg-deeper);
}

.momento-landing .menu-editorial .menu-section--hidden {
  display: none !important;
}

.momento-landing .menu-editorial .menu-section:last-child:not(.menu-section--hidden) {
  margin-bottom: 0;
}

.momento-landing .section--menu-filtered {
  padding-bottom: clamp(56px, 8vw, 110px);
}

/* O nama → marquee → Prostor — jedan ritam razmaka */
.momento-landing .momento-story-flow {
  --momento-flow-gap: clamp(56px, 7vw, 88px);
}
.momento-landing .section--o-nama { padding-bottom: 0; }
.momento-landing .momento-story-flow > .marquee {
  margin-top: var(--momento-flow-gap);
  margin-bottom: var(--momento-flow-gap);
}
.momento-landing .section--prostor {
  padding-top: 0;
  padding-bottom: var(--momento-flow-gap);
}
.momento-landing .section--prostor .section-head {
  margin-bottom: clamp(52px, 6vw, 72px);
}
.momento-landing .momento-story-flow > .marquee {
  padding: clamp(22px, 3vw, 32px) 0;
}
.momento-landing .momento-story-flow + .offers-wrap {
  margin-top: var(--momento-flow-gap);
}

/* Cjenik — filter ostaje ispod fiksnog nav-a + hint za horizontalni scroll */
.momento-landing .menu-bar-wrap {
  position: sticky;
  top: 88px;
  z-index: 40;
  background: var(--bg);
}
.momento-landing .menu-bar-wrap--more-right::after {
  right: 0;
  background: linear-gradient(90deg, transparent, var(--bg));
}
.momento-landing .menu-bar-hint--right { right: 4px; }
.momento-landing .menu-bar-wrap--more-right .menu-bar { padding-right: 44px; }

.momento-landing .foot-tag--mono {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.65;
}
`
fs.writeFileSync(outPath, header + body + extras)
console.info(`Wrote ${outPath} (${header.length + body.length} bytes)`)
