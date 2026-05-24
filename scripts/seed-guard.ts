/**
 * Blocks seed scripts from running against production/staging databases unless
 * `ALLOW_SEED=true` is set explicitly.
 */
function maskDatabaseUri(uri: string): string {
  return uri.replace(/:\/\/([^:@/]+):([^@/]+)@/, '://$1:***@')
}

function databaseUriLooksDev(uri: string): boolean {
  if (!uri.trim()) return false
  return (
    /localhost|127\.0\.0\.1/i.test(uri) ||
    /district_dev|_dev\b|-dev\b/i.test(uri) ||
    /:5434\//.test(uri)
  )
}

export function assertSeedAllowed(scriptName: string): void {
  // Skip interactive Drizzle schema push during CLI seeds (avoids long/hanging init on shared DBs).
  process.env.PAYLOAD_MIGRATING = 'true'

  if (process.env.ALLOW_SEED === 'true') {
    console.info(`[${scriptName}] ALLOW_SEED=true — seed allowed on this database.`)
    return
  }

  const uri = process.env.DATABASE_URI ?? ''
  if (databaseUriLooksDev(uri)) return

  throw new Error(
    [
      `[${scriptName}] Seed blocked: DATABASE_URI does not look like a dev database.`,
      `  URI: ${maskDatabaseUri(uri) || '(empty)'}`,
      '',
      '  Dev/staging: use a separate database (e.g. district_dev on localhost:5434).',
      '  Production: do not run seed scripts against live CMS data.',
      '  Intentional run: ALLOW_SEED=true pnpm run …',
    ].join('\n'),
  )
}
