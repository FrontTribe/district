'use client'

import React, { useEffect } from 'react'
import Lenis from 'lenis'

type Props = {
  children?: React.ReactNode
}

// Initializes Lenis smooth scroll on the client side.
// It renders no DOM and simply mounts/unmounts the Lenis instance.
export default function LenisProvider({ children }: Props) {
  useEffect(() => {
    const lenis = new Lenis({
      // Defaults that feel close to design expectations; adjustable later
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      // cleanup
      // @ts-expect-error destroy exists in runtime
      if (typeof (lenis as any)?.destroy === 'function') (lenis as any).destroy()
    }
  }, [])

  return <>{children}</>
}
