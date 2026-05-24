#!/usr/bin/env node
/**
 * Non-interactive migrate for CI/server deploys.
 *
 * 1. Remove dev/push markers (batch = -1) so Payload migrate is not interactive.
 * 2. Run drift-tolerant migrations — prod DBs updated via push may already contain
 *    tables from pending migrations; those are baselined instead of failing CI.
 */
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const nodeOptions = '--no-deprecation --loader ./scripts/ignore-scss-loader.mjs'

function loadPg() {
  const req = createRequire(resolve(root, 'package.json'))
  const reqDb = createRequire(req.resolve('@payloadcms/db-postgres'))
  return reqDb('pg')
}

async function clearDevModeMarkers() {
  const uri = process.env.DATABASE_URI
  if (!uri) {
    console.error('Missing DATABASE_URI')
    process.exit(1)
  }

  const pg = loadPg()
  const client = new pg.Client({ connectionString: uri })

  try {
    await client.connect()
    const result = await client.query(
      'DELETE FROM payload_migrations WHERE batch = -1 RETURNING name',
    )
    if (result.rowCount > 0) {
      const names = result.rows.map((row) => row.name).join(', ')
      console.log(`Cleared ${result.rowCount} dev-mode migration marker(s): ${names}`)
    }
  } finally {
    await client.end()
  }
}

function runDriftTolerantMigrate() {
  const result = spawnSync(
    'pnpm',
    ['exec', 'tsx', 'scripts/migrate-with-drift-tolerance.ts'],
    {
      cwd: root,
      env: {
        ...process.env,
        NODE_NO_WARNINGS: '1',
        NODE_OPTIONS: nodeOptions,
      },
      stdio: 'inherit',
    },
  )

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

await clearDevModeMarkers()
runDriftTolerantMigrate()
