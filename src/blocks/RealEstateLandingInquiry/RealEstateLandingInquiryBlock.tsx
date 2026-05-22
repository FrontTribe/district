'use client'

import React from 'react'
import { RealEstateLandingInquiry } from '@/components/real-estate-landing/RealEstateLandingInquiry'

type HeadingPart = { text: string; italic?: boolean | null; lineBreak?: boolean | null; id?: string }

type Props = {
  blockType: 'real-estate-landing-inquiry'
  sectionId?: string | null
  eyebrow: string
  headingParts: HeadingPart[] | null | undefined
  introHtml?: string | null
  formActionUrl?: string | null
  formMethod?: 'GET' | 'POST' | null
  submitButtonLabel?: string | null
  disabledSubmitHelp?: string | null
  nameFieldLabel?: string | null
  emailFieldLabel?: string | null
  phoneFieldLabel?: string | null
  interestFieldLabel?: string | null
  messageFieldLabel?: string | null
  interestPlaceholder?: string | null
  messagePlaceholder?: string | null
  privacyHtml?: string | null
  interestOptions?: { label: string; value: string; id?: string }[] | null
  contacts?: { label: string; valueHtml: string; id?: string }[] | null
}

export const RealEstateLandingInquiryBlock: React.FC<Props> = (props) => (
  <RealEstateLandingInquiry
    sectionId={props.sectionId ?? undefined}
    eyebrow={props.eyebrow}
    headingParts={(props.headingParts ?? []).map((p) => ({
      text: p.text,
      italic: p.italic ?? undefined,
    }))}
    introHtml={props.introHtml ?? null}
    formActionUrl={props.formActionUrl ?? null}
    formMethod={(props.formMethod ?? 'POST') as 'GET' | 'POST'}
    submitButtonLabel={props.submitButtonLabel ?? undefined}
    disabledSubmitHelp={props.disabledSubmitHelp ?? undefined}
    nameFieldLabel={props.nameFieldLabel ?? undefined}
    emailFieldLabel={props.emailFieldLabel ?? undefined}
    phoneFieldLabel={props.phoneFieldLabel ?? undefined}
    interestFieldLabel={props.interestFieldLabel ?? undefined}
    messageFieldLabel={props.messageFieldLabel ?? undefined}
    interestPlaceholder={props.interestPlaceholder ?? undefined}
    messagePlaceholder={props.messagePlaceholder ?? undefined}
    privacyHtml={props.privacyHtml ?? null}
    interestOptions={(props.interestOptions ?? []).map((o) => ({ label: o.label, value: o.value }))}
    contacts={(props.contacts ?? []).map((c) => ({ label: c.label, valueHtml: c.valueHtml }))}
  />
)
