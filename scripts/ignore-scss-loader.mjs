/** Treat .scss/.css as empty modules; stub `next/font` for Node seed scripts. */
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const nextFontStubUrl = pathToFileURL(path.resolve(__dirname, 'next-font-stub.mjs')).href

function isNextFontSpecifier(specifier) {
  return specifier === 'next/font/google' || specifier === 'next/font/local'
}

function isStyleSpecifier(specifier) {
  const normalized = specifier.split('?')[0]
  return normalized.endsWith('.scss') || normalized.endsWith('.css')
}

function isStyleUrl(url) {
  const normalized = url.split('?')[0]
  return normalized.endsWith('.scss') || normalized.endsWith('.css')
}

export async function resolve(specifier, context, defaultResolve) {
  if (isNextFontSpecifier(specifier)) {
    return { url: nextFontStubUrl, format: 'module', shortCircuit: true }
  }
  if (isStyleSpecifier(specifier)) {
    const url = new URL(specifier, context.parentURL || 'file://').href
    return { url, format: 'module', shortCircuit: true }
  }
  return defaultResolve(specifier, context, defaultResolve)
}

export async function load(url, context, defaultLoad) {
  if (isStyleUrl(url)) {
    return {
      format: 'module',
      shortCircuit: true,
      source: 'export default {}',
    }
  }
  return defaultLoad(url, context, defaultLoad)
}
