'use client'

import { generateTenantUrl, getEnvironment } from '@/utils/generateTenantUrl'

export function TenantUrlDebug() {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const environment = getEnvironment()
  const testUrls = {
    boutique: generateTenantUrl('boutique'),
    'concept-bar': generateTenantUrl('concept-bar'),
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: '#000',
        color: '#fff',
        padding: '10px',
        fontSize: '12px',
        zIndex: 9999,
        borderRadius: '4px',
        fontFamily: 'monospace',
      }}
    >
      <div>
        <strong>Environment:</strong> {environment}
      </div>
      <div>
        <strong>Hostname:</strong>{' '}
        {typeof window !== 'undefined' ? window.location.hostname : 'SSR'}
      </div>
      <div>
        <strong>NODE_ENV:</strong> {process.env.NODE_ENV}
      </div>
      <div>
        <strong>Boutique URL:</strong> {testUrls.boutique}
      </div>
      <div>
        <strong>Concept Bar URL:</strong> {testUrls['concept-bar']}
      </div>
    </div>
  )
}
