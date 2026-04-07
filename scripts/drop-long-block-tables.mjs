#!/usr/bin/env node
/**
 * One-time script to drop Postgres tables that exceed the 63-char identifier limit.
 * Run after adding dbName to RealEstateProjectsWeDid block so Payload can create short-named tables.
 *
 * Usage: node scripts/drop-long-block-tables.mjs
 * Requires: DATABASE_URI in env (e.g. from .env.local). Runs the SQL file via psql.
 */
import { spawnSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnv() {
  const envPath = resolve(__dirname, '../.env.local')
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, 'utf8')
    for (const line of content.split('\n')) {
      const match = line.match(/^([^#=]+)=(.*)$/)
      if (match) {
        const key = match[1].trim()
        const value = match[2].trim().replace(/^["']|["']$/g, '')
        if (!process.env[key]) process.env[key] = value
      }
    }
  }
}

loadEnv()

const connectionString = process.env.DATABASE_URI
if (!connectionString) {
  console.error('Missing DATABASE_URI. Set it in .env.local or the environment.')
  process.exit(1)
}

const sqlPath = resolve(__dirname, 'drop-long-block-tables.sql')
const result = spawnSync('psql', [connectionString, '-f', sqlPath], {
  stdio: 'inherit',
  shell: true,
})
if (result.status !== 0) {
  console.error('psql failed. You can run the SQL manually:')
  console.error('  psql "$DATABASE_URI" -f scripts/drop-long-block-tables.sql')
  console.error('Or open scripts/drop-long-block-tables.sql in your DB client and run it.')
  process.exit(1)
}
console.log('Done. Restart the dev server so Payload can create the new short-named tables.')
