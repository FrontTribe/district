const useColor = Boolean(process.stdout.isTTY && process.env.NO_COLOR == null)

const esc = (code: number, text: string) => (useColor ? `\x1b[${code}m${text}\x1b[0m` : text)

export const seedColor = {
  ok: (text: string) => esc(32, text),
  err: (text: string) => esc(31, text),
  warn: (text: string) => esc(33, text),
  info: (text: string) => esc(36, text),
  dim: (text: string) => esc(2, text),
  bold: (text: string) => esc(1, text),
}

export type SeedStep = {
  detail: (message: string) => void
  done: (message?: string) => void
  skip: (message: string) => void
  fail: (message: string) => never
}

export function createSeedLog(scriptId: string) {
  const line = '─'.repeat(52)

  return {
    banner(title: string, meta?: Record<string, string>) {
      console.info('')
      console.info(seedColor.dim(line))
      console.info(`  ${seedColor.bold(scriptId)}  ${seedColor.dim('│')}  ${title}`)
      console.info(seedColor.dim(line))
      if (meta) {
        for (const [key, value] of Object.entries(meta)) {
          console.info(`  ${seedColor.dim(`${key}:`)} ${value}`)
        }
      }
    },

    step(index: number, total: number, label: string): SeedStep {
      console.info('')
      console.info(`  ${seedColor.info(`▶ [${index}/${total}]`)} ${seedColor.bold(label)}`)
      const startedAt = Date.now()

      return {
        detail(message: string) {
          console.info(`    ${seedColor.dim('·')} ${message}`)
        },
        done(message = 'gotovo') {
          const seconds = ((Date.now() - startedAt) / 1000).toFixed(1)
          console.info(`    ${seedColor.ok('✓')} ${message} ${seedColor.dim(`(${seconds}s)`)}`)
        },
        skip(message: string) {
          console.info(`    ${seedColor.warn('⊘')} ${seedColor.dim(message)}`)
        },
        fail(message: string): never {
          console.error(`    ${seedColor.err('✗')} ${message}`)
          throw new Error(message)
        },
      }
    },

    success(message: string) {
      console.info('')
      console.info(`  ${seedColor.ok('✓')} ${seedColor.bold(message)}`)
      console.info('')
    },

    error(message: string, err?: unknown) {
      console.error('')
      console.error(`  ${seedColor.err('✗')} ${seedColor.bold(message)}`)
      if (err) console.error(err)
      console.error('')
    },
  }
}

type PgPoolLike = {
  totalCount?: number
  idleCount?: number
  waitingCount?: number
}

/** Log pg pool pressure — useful when form create hangs after many S3 uploads. */
export function logDbPoolStats(payload: unknown, label: string): void {
  const pool = (payload as { db?: { pool?: PgPoolLike } })?.db?.pool
  if (!pool || typeof pool.totalCount !== 'number') return
  console.info(
    `    ${seedColor.dim('·')} DB pool (${label}): total=${pool.totalCount} idle=${pool.idleCount ?? '?'} waiting=${pool.waitingCount ?? '?'}`,
  )
}

export async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`${label} — timeout nakon ${Math.round(ms / 1000)}s`)),
          ms,
        )
      }),
    ])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

/** Same as withTimeout but emits a heartbeat every 15s while waiting (SSH terminals look frozen otherwise). */
export async function withTimeoutHeartbeat<T>(
  promise: Promise<T>,
  ms: number,
  label: string,
  detail?: (message: string) => void,
): Promise<T> {
  let heartbeat: ReturnType<typeof setInterval> | undefined
  if (detail) {
    const startedAt = Date.now()
    heartbeat = setInterval(() => {
      const seconds = Math.round((Date.now() - startedAt) / 1000)
      detail(`… ${label} (${seconds}s)`)
    }, 15_000)
  }

  try {
    return await withTimeout(promise, ms, label)
  } finally {
    if (heartbeat) clearInterval(heartbeat)
  }
}

/** Payload hook context — skip Next cache revalidation during CLI seeds. */
export const seedPayloadContext = { disableRevalidate: true }
