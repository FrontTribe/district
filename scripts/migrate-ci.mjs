#!/usr/bin/env node
/**
 * Non-interactive migrate for CI/server deploys.
 */
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  clearDevModeMarkers,
  getPendingMigrationNames,
} from './migration-pg-utils.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const nodeOptions = '--no-deprecation --loader ./scripts/ignore-scss-loader.mjs'

const databaseUri = process.env.DATABASE_URI
if (!databaseUri) {
  console.error('Missing DATABASE_URI')
  process.exit(1)
}

await clearDevModeMarkers(databaseUri, root)

const pending = await getPendingMigrationNames(databaseUri, root)
if (pending.length === 0) {
  console.log('No pending migrations — skipping Payload migrate.')
  process.exit(0)
}

console.log(`Applying ${pending.length} pending migration(s)...`)

const result = spawnSync(
  process.execPath,
  [
    '--no-warnings',
    `--import`,
    'tsx/esm',
    resolve(root, 'scripts/migrate-with-drift-tolerance.ts'),
  ],
  {
    cwd: root,
    env: {
      ...process.env,
      NODE_NO_WARNINGS: '1',
      NODE_OPTIONS: nodeOptions,
      PAYLOAD_MIGRATING: 'true',
      PAYLOAD_RUN_MIGRATIONS_ON_BOOT: 'false',
    },
    stdio: ['ignore', 'inherit', 'inherit'],
  },
)

process.exit(result.status ?? 1)
