#!/usr/bin/env node
/**
 * Payload migrate:create diffs the latest migration JSON snapshot vs current schema.
 * Server DB drift (legacy forms_blocks `name` column) is not visible to migrate:create
 * when the latest snapshot already matches config. Temporarily restore the old
 * forms_blocks tables in a throwaway snapshot, generate the migration, then remove it.
 */
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const migrationsDir = path.join(root, 'src/migrations')

const LEGACY_SOURCE = path.join(migrationsDir, '20260407_133034.json')
const LATEST_SNAPSHOT = path.join(migrationsDir, '20260523_234706_sync_menu_schema.json')
const TEMP_SNAPSHOT = path.join(migrationsDir, '20260524_120000_temp_form_blocks_before.json')

// Parent tables only — locale label→placeholder renames need interactive drizzle-kit prompts.
const FORM_BLOCK_TABLES = [
  'public.forms_blocks_text',
  'public.forms_blocks_textarea',
  'public.forms_blocks_select',
]

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function patchLegacyFormBlocks(target, legacy) {
  for (const table of FORM_BLOCK_TABLES) {
    if (!legacy.tables[table]) {
      throw new Error(`Missing legacy table definition: ${table}`)
    }
    target.tables[table] = structuredClone(legacy.tables[table])
  }

  // Keep btq_ft aligned with current config so migrate:create only emits forms_blocks changes.
  const btqFooter = target.tables['public.btq_ft']
  if (btqFooter?.columns) {
    delete btqFooter.columns.newsletter_heading
    delete btqFooter.columns.newsletter_note
  }

  // Placeholder moved to locales in current schema; omit from legacy parent row.
  const selectBlock = target.tables['public.forms_blocks_select']
  if (selectBlock?.columns) {
    delete selectBlock.columns.placeholder
  }
}

function cleanupTempSnapshot() {
  if (fs.existsSync(TEMP_SNAPSHOT)) {
    fs.unlinkSync(TEMP_SNAPSHOT)
  }
}

function main() {
  const legacy = readJson(LEGACY_SOURCE)
  const latest = readJson(LATEST_SNAPSHOT)
  patchLegacyFormBlocks(latest, legacy)

  cleanupTempSnapshot()
  fs.writeFileSync(TEMP_SNAPSHOT, `${JSON.stringify(latest, null, 2)}\n`)

  const result = spawnSync(
    'pnpm',
    ['run', 'payload', '--', 'migrate:create', 'form_blocks_schema_sync', '--force-accept-warning'],
    {
      cwd: root,
      stdio: ['pipe', 'inherit', 'inherit'],
      env: process.env,
      input: '\n'.repeat(20),
    },
  )

  cleanupTempSnapshot()

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }

  console.log('\n[generate-form-blocks-migration] Done. Review src/migrations/*form_blocks_schema_sync* before committing.')
}

main()
