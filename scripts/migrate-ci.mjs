#!/usr/bin/env node
/**
 * Non-interactive migrate for CI/server deploys.
 *
 * Payload prompts when payload_migrations contains dev-mode rows (batch = -1),
 * which happens if dev/push ever ran against the same database. CI cannot answer
 * that prompt — auto-confirm so pending migrations can apply.
 *
 * Permanent fix on the DB (recommended once on prod):
 *   DELETE FROM payload_migrations WHERE batch = -1;
 */
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const result = spawnSync('pnpm', ['run', 'migrate'], {
  cwd: root,
  env: process.env,
  input: 'y\n',
  stdio: ['pipe', 'inherit', 'inherit'],
})

process.exit(result.status ?? 1)
