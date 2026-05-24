'use client'

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import BookingDrawer from '@/components/BookingDrawer'

type RoomData = {
  title: string
  description?: string
  rentlioUnitTypeId?: string
  rentlioPropertyId?: string
  rentlioSalesChannelId?: string
  image?: unknown
  badges?: Array<{ text?: string }>
}

type BoutiqueBookingContextValue = {
  openBooking: (room?: RoomData | null) => void
  closeBooking: () => void
}

const BoutiqueBookingContext = createContext<BoutiqueBookingContextValue | null>(null)

export function useBoutiqueBooking() {
  const ctx = useContext(BoutiqueBookingContext)
  return ctx
}

export function BoutiqueBookingProvider({
  children,
  locale = 'hr',
  defaultSalesChannelId = 45,
}: {
  children: React.ReactNode
  locale?: string
  defaultSalesChannelId?: number
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [room, setRoom] = useState<RoomData | null>(null)

  const openBooking = useCallback((nextRoom?: RoomData | null) => {
    setRoom(nextRoom ?? null)
    setIsOpen(true)
  }, [])

  const closeBooking = useCallback(() => {
    setIsOpen(false)
    setRoom(null)
  }, [])

  const value = useMemo(
    () => ({ openBooking, closeBooking }),
    [openBooking, closeBooking],
  )

  return (
    <BoutiqueBookingContext.Provider value={value}>
      {children}
      <BookingDrawer
        isOpen={isOpen}
        onClose={closeBooking}
        roomData={room}
        locale={locale}
        visualTheme="boutique"
        salesChannelId={
          room?.rentlioSalesChannelId
            ? parseInt(room.rentlioSalesChannelId, 10)
            : defaultSalesChannelId
        }
      />
    </BoutiqueBookingContext.Provider>
  )
}
