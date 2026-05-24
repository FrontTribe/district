/**
 * Run Payload migrations on databases that were partially updated via dev/push.
 * When a migration fails because objects already exist, record it as applied and continue.
 */
import {
  commitTransaction,
  createLocalReq,
  getPayload,
  initTransaction,
  killTransaction,
} from 'payload'
import type { PayloadRequest, SanitizedConfig } from 'payload'
import { migrations } from '../src/migrations/index.js'

type MigrationDb = Awaited<ReturnType<typeof getMigrationDb>>

async function shutdownDbPool(payload: Awaited<ReturnType<typeof getPayload>>): Promise<void> {
  try {
    const db = payload.db as {
      pool?: { end: () => Promise<void> }
      destroy?: () => Promise<void>
    }

    if (typeof db.destroy === 'function') {
      await db.destroy()
    }

    if (db.pool && typeof db.pool.end === 'function') {
      await db.pool.end()
    }
  } catch {
    // Best-effort — CI must still exit even if pool teardown fails.
  }
}

async function getMigrationDb(
  adapter: NonNullable<Awaited<ReturnType<typeof getPayload>>['db']>,
  req: PayloadRequest,
): Promise<MigrationDb> {
  if (req.transactionID) {
    const session = adapter.sessions[await req.transactionID]
    if (session?.db) return session.db
  }

  return adapter.drizzle
}

function collectErrorParts(err: unknown): { messages: string[]; codes: string[] } {
  const messages: string[] = []
  const codes: string[] = []
  const seen = new Set<unknown>()
  let current: unknown = err

  while (current && typeof current === 'object' && !seen.has(current)) {
    seen.add(current)

    if ('message' in current && current.message != null) {
      messages.push(String(current.message))
    }
    if ('code' in current && current.code != null) {
      codes.push(String(current.code))
    }

    current = 'cause' in current ? (current as { cause?: unknown }).cause : undefined
  }

  if (typeof err === 'string') messages.push(err)

  return { messages, codes }
}

function isAlreadyAppliedError(err: unknown): boolean {
  const { messages, codes } = collectErrorParts(err)
  const haystack = messages.join('\n')

  const duplicateCodes = new Set(['42P07', '42701', '42710', '23505'])

  return (
    codes.some((code) => duplicateCodes.has(code)) ||
    /already exists/i.test(haystack) ||
    /duplicate (column|key|object|table|relation)/i.test(haystack)
  )
}

async function main() {
  process.env.PAYLOAD_MIGRATING = 'true'

  const { default: payloadConfig } = await import('@payload-config')
  const config = (await Promise.resolve(payloadConfig)) as SanitizedConfig
  const payload = await getPayload({ config })

  try {
    const { docs: migrationsInDb } = await payload.find({
      collection: 'payload-migrations',
      limit: 0,
      sort: '-batch',
    })

    const applied = new Set(
      migrationsInDb.filter((row) => row.batch !== -1).map((row) => String(row.name)),
    )

    let latestBatch = migrationsInDb
      .map((row) => Number(row.batch))
      .filter((batch) => Number.isFinite(batch) && batch > 0)
      .reduce((max, batch) => Math.max(max, batch), 0)

    const runBatch = latestBatch + 1

    for (const migration of migrations) {
      if (applied.has(migration.name)) continue

      const batch = runBatch
      const req = await createLocalReq({}, payload)

      payload.logger.info({ msg: `Migrating: ${migration.name}` })
      const started = Date.now()

      try {
        await initTransaction(req)
        const db = await getMigrationDb(payload.db, req)
        await migration.up({ db, payload, req })

        await payload.create({
          collection: 'payload-migrations',
          data: { name: migration.name, batch },
          req,
        })

        await commitTransaction(req)
        payload.logger.info({
          msg: `Migrated:  ${migration.name} (${Date.now() - started}ms)`,
        })
      } catch (err) {
        await killTransaction(req)

        if (!isAlreadyAppliedError(err)) {
          throw err
        }

        payload.logger.warn({
          msg: `Baseline skip (schema already present): ${migration.name}`,
        })

        await payload.create({
          collection: 'payload-migrations',
          data: { name: migration.name, batch },
        })
        applied.add(migration.name)
      }
    }

    payload.logger.info({ msg: 'Done.' })
  } finally {
    await shutdownDbPool(payload)
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
