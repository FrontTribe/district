'use client'

import React, { useEffect, useRef, useState } from 'react'
import { getOptimizedImageUrl } from '@/utils/getOptimizedImageUrl'

type RoomImage = { image: unknown; alt?: string }

type Props = {
  images: RoomImage[]
  roomNumber?: string
  sqmLabel?: string
}

export function BoutiqueRoomImage({ images, roomNumber, sqmLabel }: Props) {
  const [idx, setIdx] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const displayImages = images.slice(0, 4)

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current)
    },
    [],
  )

  const getUrl = (m: unknown) =>
    getOptimizedImageUrl(m as Parameters<typeof getOptimizedImageUrl>[0], {
      widthHint: 1024,
      aspect: 'portrait34',
    })

  const onEnter = () => {
    if (displayImages.length <= 1) return
    if (timer.current) clearInterval(timer.current)
    timer.current = setInterval(() => {
      setIdx((i) => (i + 1) % displayImages.length)
    }, 1400)
  }

  const onLeave = () => {
    if (timer.current) clearInterval(timer.current)
    setIdx(0)
  }

  if (displayImages.length === 0) {
    return <div className="room-image room-image--empty" aria-hidden />
  }

  return (
    <div className="room-image" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {displayImages.map((item, i) => {
        const src = getUrl(item.image)
        if (!src) return null
        return (
          <div
            key={i}
            className="room-image-layer"
            style={{
              backgroundImage: `url(${src})`,
              opacity: i === idx ? 1 : 0,
            }}
            aria-hidden={i !== idx}
          />
        )
      })}
      {(roomNumber || sqmLabel) && (
        <div className="room-num">
          {roomNumber ? `№ ${roomNumber}` : ''}
          {roomNumber && sqmLabel ? ' · ' : ''}
          {sqmLabel ?? ''}
        </div>
      )}
      {displayImages.length > 1 && (
        <div className="room-dots" aria-hidden>
          {displayImages.map((_, i) => (
            <span key={i} className={i === idx ? 'is-active' : ''} />
          ))}
        </div>
      )}
    </div>
  )
}
