#!/usr/bin/env node
/**
 * Fails when migration files are out of sync with the repo or not applied to the database.
 *
 * Usage:
 *   DATABASE_URI=... PAYLOAD_SECRET=... node scripts/check-pending-migrations.mjs
 *
 * Optional (local/CI escape hatch only — do not use in GitHub Actions):
 *   SKIP_DB_CHECK=true  — only validate migration files vs src/migrations/index.ts
 */
import { createRequire } from 'node:module'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const migrationDir = resolve(root, 'src/migrations')

function loadPg() {
  const req = createRequire(resolve(root, 'package.json'))
  const reqDb = createRequire(req.resolve('@payloadcms/db-postgres'))
  return reqDb('pg')
}

function listMigrationNames() {
  return readdirSync(migrationDir)
    .filter((file) => file.endsWith('.ts') && file !== 'index.ts')
    .map((file) => file.replace(/\.ts$/, ''))
    .sort()
}

function checkMigrationIndexSync(migrationNames) {
  const indexContent = readFileSync(resolve(migrationDir, 'index.ts'), 'utf8')
  const registeredNames = [...indexContent.matchAll(/name:\s*['"]([^'"]+)['"]/g)].map(
    (match) => match[1],
  )

  const missingFromIndex = migrationNames.filter((name) => !registeredNames.includes(name))
  const missingFiles = registeredNames.filter((name) => !migrationNames.includes(name))

  if (missingFromIndex.length > 0 || missingFiles.length > 0) {
    console.error('✗ src/migrations/index.ts is out of sync with migration files.')

    if (missingFromIndex.length > 0) {
      console.error('\n.ts files not registered in index.ts:')
      missingFromIndex.forEach((name) => console.error(`  - ${name}`))
    }

    if (missingFiles.length > 0) {
      console.error('\nRegistered in index.ts but missing .ts files:')
      missingFiles.forEach((name) => console.error(`  - ${name}`))
    }

    console.error('\nUpdate src/migrations/index.ts after creating migrations.')
    process.exit(1)
  }

  console.log(`✓ ${migrationNames.length} migration file(s) registered in index.ts`)
}

async function checkDatabaseMigrations(migrationNames) {
  if (process.env.SKIP_DB_CHECK === 'true') {
    console.log('Skipping database migration check (SKIP_DB_CHECK=true)')
    return
  }

  for (const key of ['DATABASE_URI', 'PAYLOAD_SECRET']) {
    if (!process.env[key]) {
      console.error(`Missing ${key}. Set it in the environment to verify applied migrations.`)
      process.exit(1)
    }
  }

  const pg = loadPg()
  const client = new pg.Client({ connectionString: process.env.DATABASE_URI })

  try {
    await client.connect()
    const { rows } = await client.query(
      'SELECT name FROM payload_migrations WHERE batch IS DISTINCT FROM -1',
    )
    const applied = new Set(rows.map((row) => String(row.name)))
    const pending = migrationNames.filter((name) => !applied.has(name))

    if (pending.length > 0) {
      console.error('\n✗ Pending migrations (not applied to the database):')
      pending.forEach((name) => console.error(`  - ${name}`))
      console.error('\nApply them before deploying: pnpm run migrate:ci')
      process.exit(1)
    }

    console.log('\n✓ All migrations are applied to the database.')
  } catch (err) {
    console.error('\n✗ Failed to read migration status from the database.')
    console.error(err)
    process.exit(1)
  } finally {
    await client.end()
  }
}

const migrationNames = listMigrationNames()
checkMigrationIndexSync(migrationNames)
await checkDatabaseMigrations(migrationNames)
process.exit(0)
