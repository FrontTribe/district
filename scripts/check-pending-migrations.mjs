#!/usr/bin/env node
/**
 * Fails when migration files are out of sync with the repo or not applied to the database.
 *
 * Usage:
 *   DATABASE_URI=... PAYLOAD_SECRET=... node scripts/check-pending-migrations.mjs
 *
 * Optional:
 *   SKIP_DB_CHECK=true  — only validate migration files vs src/migrations/index.ts
 */
import { spawnSync } from 'child_process'
import { readdirSync, readFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const migrationDir = resolve(__dirname, '../src/migrations')

function stripAnsi(value) {
  return value.replace(/\x1b\[[0-9;]*m/g, '')
}

function checkMigrationIndexSync() {
  const migrationNames = readdirSync(migrationDir)
    .filter((file) => file.endsWith('.ts') && file !== 'index.ts')
    .map((file) => file.replace(/\.ts$/, ''))
    .sort()

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

function parsePendingMigrations(output) {
  const plain = stripAnsi(output)

  return plain
    .split('\n')
    .filter((line) => line.includes('│') && /│\s*No\s*│/.test(line))
    .map((line) => line.split('│').map((part) => part.trim()).filter(Boolean)[0])
    .filter(Boolean)
}

function checkDatabaseMigrations() {
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

  const result = spawnSync('pnpm', ['run', 'payload', '--', 'migrate:status'], {
    cwd: resolve(__dirname, '..'),
    env: process.env,
    encoding: 'utf8',
  })

  const output = `${result.stdout || ''}${result.stderr || ''}`
  process.stdout.write(output)

  if (result.status !== 0) {
    console.error('\n✗ Failed to read migration status from the database.')
    process.exit(result.status || 1)
  }

  const pending = parsePendingMigrations(output)

  if (pending.length > 0) {
    console.error('\n✗ Pending migrations (not applied to the database):')
    pending.forEach((name) => console.error(`  - ${name}`))
    console.error('\nApply them before deploying: pnpm payload migrate')
    process.exit(1)
  }

  console.log('\n✓ All migrations are applied to the database.')
}

checkMigrationIndexSync()
checkDatabaseMigrations()
