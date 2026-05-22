/** Minimal stub so tsx seed scripts can import modules that use `next/font` (empty in plain Node). */
function createNextFontStub() {
  return {
    className: '',
    variable: '--font-next-stub',
    style: { fontFamily: 'system-ui, sans-serif' },
  }
}

function fontLoader() {
  return createNextFontStub()
}

export default fontLoader

export const DM_Serif_Text = fontLoader
export const JetBrains_Mono = fontLoader
export const Inter = fontLoader
export const Marcellus = fontLoader
export const Fraunces = fontLoader
export const Instrument_Serif = fontLoader
