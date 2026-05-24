import { createRequire } from 'node:module'
import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'

export function loadPg(root) {
  const req = createRequire(resolve(root, 'package.json'))
  const reqDb = createRequire(req.resolve('@payloadcms/db-postgres'))
  return reqDb('pg')
}

export function listMigrationNames(root) {
  const migrationDir = resolve(root, 'src/migrations')
  return readdirSync(migrationDir)
    .filter((file) => file.endsWith('.ts') && file !== 'index.ts')
    .map((file) => file.replace(/\.ts$/, ''))
    .sort()
}

export async function queryAppliedMigrationNames(databaseUri, root) {
  const pg = loadPg(root)
  const client = new pg.Client({ connectionString: databaseUri })

  try {
    await client.connect()
    const { rows } = await client.query(
      'SELECT name FROM payload_migrations WHERE batch IS DISTINCT FROM -1',
    )
    return rows.map((row) => String(row.name))
  } finally {
    await client.end()
  }
}

export async function getPendingMigrationNames(databaseUri, root) {
  const migrationNames = listMigrationNames(root)
  const applied = new Set(await queryAppliedMigrationNames(databaseUri, root))
  return migrationNames.filter((name) => !applied.has(name))
}

export async function clearDevModeMarkers(databaseUri, root) {
  const pg = loadPg(root)
  const client = new pg.Client({ connectionString: databaseUri })

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
