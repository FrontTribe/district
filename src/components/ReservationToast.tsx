'use client'

import React, { useEffect } from 'react'
import { getTranslation } from '@/utils/translations'
import './ReservationToast.scss'

interface ReservationData {
  confirmationNumber?: string
  fullName: string
  email: string
  checkIn: string
  checkOut: string
  roomName?: string
  nights?: number
  totalPrice?: number
  currency?: string
}

interface ReservationToastProps {
  isOpen: boolean
  onClose: () => void
  reservationData: ReservationData
  locale?: string
}

export const ReservationToast: React.FC<ReservationToastProps> = ({
  isOpen,
  onClose,
  reservationData,
  locale = 'hr',
}) => {
  useEffect(() => {
    if (isOpen) {
      // Auto close after 10 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  return (
    <>
      {/* Overlay */}
      <div className="reservation-toast-overlay" onClick={onClose} />

      {/* Toast Modal */}
      <div className="reservation-toast">
        {/* Success Icon */}
        <div className="reservation-toast__header">
          <div className="reservation-toast__success-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h2 className="reservation-toast__title">
            {getTranslation('reservationSuccess', locale)}
          </h2>

          <p className="reservation-toast__subtitle">
            {getTranslation('reservationSuccessMessage', locale)}
          </p>
        </div>

        {/* Reservation Details */}
        <div className="reservation-toast__body">
          <div className="reservation-toast__section">
            <div className="reservation-toast__section-label">
              {getTranslation('confirmationDetails', locale)}
            </div>

            {reservationData.confirmationNumber && (
              <div className="reservation-toast__confirmation">
                #{reservationData.confirmationNumber}
              </div>
            )}
          </div>

          <div className="reservation-toast__details">
            {/* Guest Name */}
            <div className="reservation-toast__detail-row">
              <span className="reservation-toast__detail-label">
                {getTranslation('guestName', locale)}
              </span>
              <span className="reservation-toast__detail-value">{reservationData.fullName}</span>
            </div>

            {/* Email */}
            <div className="reservation-toast__detail-row">
              <span className="reservation-toast__detail-label">
                {getTranslation('email', locale)}
              </span>
              <span className="reservation-toast__detail-value reservation-toast__detail-value--email">
                {reservationData.email}
              </span>
            </div>

            {/* Room Name */}
            {reservationData.roomName && (
              <div className="reservation-toast__detail-row">
                <span className="reservation-toast__detail-label">
                  {getTranslation('room', locale)}
                </span>
                <span className="reservation-toast__detail-value">{reservationData.roomName}</span>
              </div>
            )}

            {/* Divider */}
            <div className="reservation-toast__divider" />

            {/* Check-in */}
            <div className="reservation-toast__detail-row">
              <span className="reservation-toast__detail-label">
                {getTranslation('checkIn', locale)}
              </span>
              <span className="reservation-toast__detail-value">
                {formatDate(reservationData.checkIn)}
              </span>
            </div>

            {/* Check-out */}
            <div className="reservation-toast__detail-row">
              <span className="reservation-toast__detail-label">
                {getTranslation('checkOut', locale)}
              </span>
              <span className="reservation-toast__detail-value">
                {formatDate(reservationData.checkOut)}
              </span>
            </div>

            {/* Nights */}
            {reservationData.nights && (
              <div className="reservation-toast__detail-row">
                <span className="reservation-toast__detail-label">
                  {getTranslation('nights', locale)}
                </span>
                <span className="reservation-toast__detail-value">{reservationData.nights}</span>
              </div>
            )}

            {/* Total Price */}
            {reservationData.totalPrice && (
              <>
                <div className="reservation-toast__divider" />
                <div className="reservation-toast__total">
                  <span className="reservation-toast__total-label">
                    {getTranslation('totalPrice', locale)}
                  </span>
                  <span className="reservation-toast__total-value">
                    {reservationData.totalPrice.toFixed(2)} {reservationData.currency || 'EUR'}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Email Confirmation Note */}
          <div className="reservation-toast__note">
            <p>📧 {getTranslation('emailConfirmationSent', locale)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="reservation-toast__footer">
          <button onClick={onClose} className="reservation-toast__button">
            {getTranslation('close', locale)}
          </button>
        </div>
      </div>
    </>
  )
}
