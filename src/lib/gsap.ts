import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import CustomEase from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, CustomEase)

export const LENIS_READY_EVENT = 'district-lenis-ready'

export { gsap, ScrollTrigger, CustomEase }
