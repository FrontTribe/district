import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'

export const getPayloadClient = async () => {
  const payload = await getPayload({
    config: payloadConfig,
  })
  return payload
}
