export async function resolve(specifier, context, defaultResolve) {
  const normalized = specifier.split('?')[0]
  if (normalized.endsWith('.scss')) {
    const url = new URL(specifier, context.parentURL || 'file://').href
    return { url, format: 'module', shortCircuit: true }
  }
  return defaultResolve(specifier, context, defaultResolve)
}

export async function load(url, context, defaultLoad) {
  const normalized = url.split('?')[0]
  if (normalized.endsWith('.scss')) {
    return {
      format: 'module',
      shortCircuit: true,
      source: 'export default {}',
    }
  }
  return defaultLoad(url, context, defaultLoad)
}
