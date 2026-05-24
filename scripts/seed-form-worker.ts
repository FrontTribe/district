/**
 * Isolated form seed worker — fresh Node process + DB pool.
 * Avoids hangs when the main seed script shares Postgres with PM2.
 *
 * Usage: tsx scripts/seed-form-worker.ts boutique|real-estate
 * Prints: FORM_ID=123
 */
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

process.env.PAYLOAD_DISABLE_DB_TRANSACTIONS = 'true'
process.env.DISABLE_PAYLOAD_HMR = 'true'

const kindArg = process.argv.slice(2).find((arg) => arg === 'boutique' || arg === 'real-estate')
const kind = kindArg?.trim()

if (kind !== 'boutique' && kind !== 'real-estate') {
  console.error('Usage: tsx scripts/seed-form-worker.ts boutique|real-estate')
  process.exit(1)
}

const silentStep = {
  detail(message: string) {
    console.info(`[form-worker] ${message}`)
  },
  done(message?: string) {
    if (message) console.info(`[form-worker] ✓ ${message}`)
  },
  skip(message: string) {
    console.info(`[form-worker] ⊘ ${message}`)
  },
  fail(message: string): never {
    throw new Error(message)
  },
}

async function main() {
  const [{ getPayload }, { default: payloadConfig }] = await Promise.all([
    import('payload'),
    import('@payload-config'),
  ])

  const payload = await getPayload({
    config: await Promise.resolve(payloadConfig),
  })

  const { ensureBoutiqueContactForm, ensureReLandingInquiryForm } = await import('./seed-forms.js')

  const formId =
    kind === 'boutique'
      ? await ensureBoutiqueContactForm(payload, silentStep)
      : await ensureReLandingInquiryForm(payload, silentStep)

  const idFile = process.env.SEED_FORM_ID_FILE?.trim()
  if (idFile) {
    fs.writeFileSync(idFile, String(formId), 'utf8')
  }
  console.log(`FORM_ID=${formId}`)
  process.exit(0)
}

main().catch((err) => {
  console.error('[form-worker] failed:', err)
  process.exit(1)
})
