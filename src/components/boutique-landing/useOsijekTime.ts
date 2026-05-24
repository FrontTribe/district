'use client'

import { useEffect, useState } from 'react'

export function useOsijekTime() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => {
      const formatted = new Intl.DateTimeFormat('hr-HR', {
        timeZone: 'Europe/Zagreb',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date())
      setTime(formatted)
    }
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])

  return time
}
