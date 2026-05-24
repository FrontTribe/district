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

function isAlreadyAppliedError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err)
  const code =
    err && typeof err === 'object' && 'code' in err ? String((err as { code?: string }).code) : ''

  return (
    code === '42P07' ||
    /already exists/i.test(message) ||
    /duplicate (column|key|object|table)/i.test(message)
  )
}

async function main() {
  process.env.PAYLOAD_MIGRATING = 'true'

  const { default: payloadConfig } = await import('@payload-config')
  const config = (await Promise.resolve(payloadConfig)) as SanitizedConfig
  const payload = await getPayload({ config })

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

  for (const migration of migrations) {
    if (applied.has(migration.name)) continue

    latestBatch += 1
    const batch = latestBatch
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
    }
  }

  payload.logger.info({ msg: 'Done.' })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
