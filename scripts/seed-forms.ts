import type { Payload } from 'payload'

import { BOUTIQUE_INQUIRY_FORM_TITLE, getBoutiqueLocalePack } from '../src/data/boutiqueSeedDefaults'
import { getReLandingLocalePack } from '../src/data/realEstateLandingLocales'
import {
  logDbPoolStats,
  seedPayloadContext,
  withTimeout,
  withTimeoutHeartbeat,
  type SeedStep,
} from './seed-ui'

const LOCALES = ['hr', 'en', 'de'] as const
const FORM_OP_TIMEOUT_MS = 120_000

type SeedFormLocale = (typeof LOCALES)[number]

type SeedFormData = {
  title: string
  submitButtonLabel: string
  confirmationType: 'message'
  confirmationMessage: ReturnType<typeof lexicalPlain>
  fields: unknown[]
}

/** Create empty shell first, then patch fields — avoids long DB transactions on nested blocks. */
async function ensureSeedFormShell(
  payload: Payload,
  step: SeedStep,
  title: string,
  dataForLocale: (loc: SeedFormLocale) => SeedFormData,
  knownId?: string | number,
): Promise<number> {
  let id = knownId ?? (await findFormIdByTitle(payload, title))

  if (id == null) {
    const shell = dataForLocale('hr')
    step.detail('Kreiram obrazac (hr) — osnova…')
    logDbPoolStats(payload, 'prije create forms')
    const created = await withTimeoutHeartbeat(
      payload.create({
        collection: 'forms',
        locale: 'hr',
        overrideAccess: true,
        context: seedPayloadContext,
        data: {
          title: shell.title,
          submitButtonLabel: shell.submitButtonLabel,
          confirmationType: shell.confirmationType,
          confirmationMessage: shell.confirmationMessage,
          fields: [],
        },
      }),
      FORM_OP_TIMEOUT_MS,
      'kreiranje obrasca (hr)',
      step.detail,
    )
    id = created.id
    step.detail(`Obrazac id=${id} — polja i lokalizacije…`)
  } else {
    step.detail(`Obrazac već postoji id=${id} — ažuriram lokalizacije`)
  }

  for (const loc of LOCALES) {
    step.detail(`Obrazac lokalizacija: ${loc}…`)
    await withTimeoutHeartbeat(
      payload.update({
        collection: 'forms',
        id: id!,
        locale: loc,
        overrideAccess: true,
        context: seedPayloadContext,
        data: dataForLocale(loc),
      }),
      FORM_OP_TIMEOUT_MS,
      `obrazac ${loc}`,
      step.detail,
    )
  }

  step.done(`obrazac id=${id} (hr, en, de)`)
  return Number(id)
}

const RE_LANDING_INQUIRY_FORM_TITLE = 'Upit — KVART ŽIGICA'
const LEGACY_RE_LANDING_INQUIRY_FORM_TITLES = ['RE Landing — inquiry (seed)', 'RE Landing — inquiry']

function lexicalPlain(text: string) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              version: 1,
            },
          ],
        },
      ],
    },
  }
}

/** @deprecated Pool-level options in payload.config apply lock_timeout to every connection. */
export async function prepareDbSession(_payload: Payload): Promise<void> {
  // no-op
}

export async function shutdownSeedDbPool(payload: Payload): Promise<void> {
  try {
    const pool = (payload as { db?: { pool?: { end?: () => Promise<void> } } }).db?.pool
    if (pool?.end) await pool.end()
  } catch {
    // ignore
  }
}

async function findFormIdByTitle(payload: Payload, title: string): Promise<string | number | undefined> {
  const existing = await withTimeout(
    payload.find({
      collection: 'forms',
      locale: 'hr',
      where: { title: { equals: title } },
      limit: 1,
      depth: 0,
      pagination: false,
      overrideAccess: true,
      context: seedPayloadContext,
      select: { id: true, title: true },
    }),
    30_000,
    'pretraga obrasca',
  )
  return existing.docs[0]?.id
}

export async function ensureBoutiqueContactForm(payload: Payload, step: SeedStep): Promise<number> {
  step.detail(`Tražim obrazac „${BOUTIQUE_INQUIRY_FORM_TITLE}”…`)

  const buildFields = (loc: SeedFormLocale) => {
    const fs = getBoutiqueLocalePack(loc).formSeed
    return [
      {
        blockType: 'text' as const,
        name: 'naziv',
        label: fs.nameFieldLabel,
        required: true,
        placeholder: fs.namePlaceholder,
      },
      {
        blockType: 'email' as const,
        name: 'email',
        label: fs.emailFieldLabel,
        required: true,
        placeholder: fs.emailPlaceholder,
      },
      {
        blockType: 'text' as const,
        name: 'telefon',
        label: fs.phoneFieldLabel,
        required: false,
        placeholder: fs.phonePlaceholder,
      },
      {
        blockType: 'select' as const,
        name: 'tip',
        label: fs.typeFieldLabel,
        required: true,
        placeholder: fs.typePlaceholder,
        options: fs.typeOptions.map((option) => ({
          label: option.label,
          value: option.value,
        })),
      },
      {
        blockType: 'textarea' as const,
        name: 'poruka',
        label: fs.messageFieldLabel,
        required: true,
        placeholder: fs.messagePlaceholder,
      },
    ]
  }

  const formData = (loc: SeedFormLocale): SeedFormData => {
    const pack = getBoutiqueLocalePack(loc)
    return {
      title: BOUTIQUE_INQUIRY_FORM_TITLE,
      submitButtonLabel: pack.formSeed.submitButtonLabel,
      confirmationType: 'message',
      confirmationMessage: lexicalPlain(pack.formSeed.successMessage),
      fields: buildFields(loc),
    }
  }

  return ensureSeedFormShell(payload, step, BOUTIQUE_INQUIRY_FORM_TITLE, formData)
}

export async function ensureReLandingInquiryForm(payload: Payload, step: SeedStep): Promise<number> {
  step.detail(`Tražim obrazac „${RE_LANDING_INQUIRY_FORM_TITLE}”…`)

  let existingId = await findFormIdByTitle(payload, RE_LANDING_INQUIRY_FORM_TITLE)

  if (existingId == null) {
    const legacy = await withTimeout(
      payload.find({
        collection: 'forms',
        locale: 'hr',
        where: { title: { in: LEGACY_RE_LANDING_INQUIRY_FORM_TITLES } },
        limit: 1,
        depth: 0,
        pagination: false,
        overrideAccess: true,
        context: seedPayloadContext,
        select: { id: true, title: true },
      }),
      30_000,
      'pretraga legacy obrasca',
    )
    existingId = legacy.docs[0]?.id
  }

  const buildFields = (loc: SeedFormLocale) => {
    const fs = getReLandingLocalePack(loc).formSeed
    return [
      {
        blockType: 'text' as const,
        name: 'name',
        label: fs.nameFieldLabel,
        required: true,
        placeholder: fs.namePlaceholder,
      },
      {
        blockType: 'text' as const,
        name: 'contact',
        label: fs.contactFieldLabel,
        required: true,
        placeholder: fs.contactPlaceholder,
      },
      {
        blockType: 'select' as const,
        name: 'interest',
        label: fs.interestFieldLabel,
        required: true,
        placeholder: fs.interestPlaceholder,
        options: fs.interestOptions.map((o) => ({ label: o.label, value: o.value })),
      },
      {
        blockType: 'textarea' as const,
        name: 'message',
        label: fs.messageFieldLabel,
        required: false,
        placeholder: fs.messagePlaceholder,
      },
    ]
  }

  const formDataForLocale = (loc: SeedFormLocale): SeedFormData => {
    const pack = getReLandingLocalePack(loc)
    return {
      title: RE_LANDING_INQUIRY_FORM_TITLE,
      submitButtonLabel: pack.inquiry.submitButtonLabel,
      confirmationType: 'message',
      confirmationMessage: lexicalPlain(pack.inquiry.successMessage),
      fields: buildFields(loc),
    }
  }

  return ensureSeedFormShell(
    payload,
    step,
    RE_LANDING_INQUIRY_FORM_TITLE,
    formDataForLocale,
    existingId,
  )
}
