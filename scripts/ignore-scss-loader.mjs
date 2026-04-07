/** Treat .scss and .css as empty modules so Node doesn't fail on unknown extension (e.g. react-image-crop CSS). */
function isStyleSpecifier(specifier) {
  const normalized = specifier.split('?')[0]
  return normalized.endsWith('.scss') || normalized.endsWith('.css')
}

function isStyleUrl(url) {
  const normalized = url.split('?')[0]
  return normalized.endsWith('.scss') || normalized.endsWith('.css')
}

export async function resolve(specifier, context, defaultResolve) {
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
