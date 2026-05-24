'use client'

import React from 'react'
import type { Form } from '@/payload-types'
import { RealEstateLandingInquiry } from '@/components/real-estate-landing/RealEstateLandingInquiry'

type HeadingPart = { text: string; italic?: boolean | null; lineBreak?: boolean | null; id?: string }

type Props = {
  blockType: 'real-estate-landing-inquiry'
  sectionId?: string | null
  eyebrow?: string | null
  headingParts: HeadingPart[] | null | undefined
  introHtml?: string | null
  form?: string | number | Form | null
  submitButtonLabel?: string | null
  disabledSubmitHelp?: string | null
  successMessage?: string | null
  locale?: string
}

export const RealEstateLandingInquiryBlock: React.FC<Props> = (props) => (
  <RealEstateLandingInquiry
    sectionId={props.sectionId ?? undefined}
    eyebrow={props.eyebrow ?? undefined}
    headingParts={(props.headingParts ?? []).map((p) => ({
      text: p.text,
      italic: p.italic ?? undefined,
    }))}
    introHtml={props.introHtml ?? null}
    form={props.form ?? null}
    locale={props.locale}
    submitButtonLabel={props.submitButtonLabel ?? undefined}
    disabledSubmitHelp={props.disabledSubmitHelp ?? undefined}
    successMessage={props.successMessage ?? undefined}
  />
)
