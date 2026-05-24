#!/usr/bin/env node
/**
 * Non-interactive migrate for CI/server deploys.
 *
 * Payload prompts when payload_migrations contains dev-mode rows (batch = -1).
 * Piping stdin through pnpm/cross-env does not reach that prompt — Payload exits 0
 * with initial=false and applies nothing. Clear dev markers first, then migrate.
 */
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

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

function runMigrate() {
  const result = spawnSync(
    'pnpm',
    ['run', 'migrate'],
    {
      cwd: root,
      env: process.env,
      stdio: 'inherit',
    },
  )

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

await clearDevModeMarkers()
runMigrate()
